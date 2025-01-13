import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, setDoc,arrayUnion  } from "firebase/firestore";
import { db } from "../firebase/config";
import { FaStar } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { auth } from "../firebase/config"; // Firebase Authentication importu
import { useNavigate } from "react-router-dom";
import CertificateGenerator from '../components/dashboard/CertificateGenerator';  // Import the CertificateGenerator component
import { FaCertificate } from "react-icons/fa";
import { useSelector } from 'react-redux';
const ExamViewPage = () => {
    const { categoryId, classId, examId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0); 
    const [showResults, setShowResults] = useState(false);
    const [comments, setComments] = useState([]);
    const [averageRating, setAverageRating] = useState(0); 
    const [showModal, setShowModal] = useState(true);  // State for modal visibility
    const [isCertifiedExam, setIsCertifiedExam] = useState(false);  // Check if the exam has certification
    const navigate = useNavigate();
    const userr = useSelector(state => state.user.user);
   
    useEffect(() => {
       // Redux'tan kullanıcı bilgilerini çekmek

        const fetchExamData = async () => {
            try {
                const examRef = doc(db, "Exams", categoryId, "Classes", classId, "Exams", examId);
                const examSnap = await getDoc(examRef);

                if (examSnap.exists()) {
                    const questionsSnapshot = await getDocs(collection(examRef, "Questions"));
                    const fetchedQuestions = questionsSnapshot.docs.map(doc => doc.data());
                    setQuestions(fetchedQuestions);
                    setTotalQuestions(fetchedQuestions.length);

                    const commentsRef = collection(examRef, "Comments");
                    const commentsSnapshot = await getDocs(commentsRef);
                    const fetchedComments = commentsSnapshot.docs.map(doc => doc.data());
                    setComments(fetchedComments);

                    const averageRating = examSnap.data().averageRating || 0;
                    setAverageRating(averageRating);

                    // Check if the exam is certified
                    setIsCertifiedExam(examSnap.data().isCertified || false);  // Assuming isCertified is a boolean field
                } else {
                    console.error("Sınav bulunamadı.");
                }
            } catch (error) {
                console.error("Veriler alınırken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExamData();
    }, [categoryId, classId, examId]);

    const handleAnswerChange = (questionIndex, selectedOption) => {
        setSelectedAnswers(prevState => ({
            ...prevState,
            [questionIndex]: selectedOption
        }));
    };

    const handleSubmit = async () => {
        let correct = 0;
        let incorrect = 0;
        questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correct++;
            } else {
                incorrect++;
            }
        });
        setCorrectAnswers(correct);
        setIncorrectAnswers(incorrect);
        setShowResults(true);
    
        const successRate = (correct / totalQuestions) * 100;
    
        if (isCertifiedExam && successRate >= 80) {
            alert("Təbriklər! Sertifikat qazandınız.");
        } else if (isCertifiedExam) {
            alert("Sertifikat üçün uğur faiziniz ən az 80% olmalıdır.");
        }
    
        await saveExamResultsToUser(correct, incorrect);
    };
    

    // Save the results to the User document in Firestore
    const saveExamResultsToUser = async (correct, incorrect) => {
        const user = auth.currentUser;
        if (user) {
          try {
            const successRate = (correct / totalQuestions) * 100;
            const userRef = doc(db, "Users", user.uid);
      
            await setDoc(userRef, {
              name: user.displayName || userr.displayName ,
              exams: arrayUnion({
                examId: examId,
                correctAnswers: correct,
                incorrectAnswers: incorrect,
                totalQuestions: totalQuestions,
                successRate: successRate,
                completedAt: new Date(),
              })
            }, { merge: true });
      
            console.log("Sınav sonucu başarıyla kaydedildi.");
          } catch (error) {
            console.error("Sonuçlar kaydedilirken hata oluştu:", error);
          }
        }
      };
      

    const chartData = [
        { name: 'Doğru', value: correctAnswers },
        { name: 'Yanlış', value: incorrectAnswers }
    ];

    const COLORS = ['#4CAF50', '#F44336'];

    const handleSaveComment = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const commentRef = doc(db, "Exams", categoryId, "Classes", classId, "Exams", examId, "Comments", user.uid);
                await setDoc(commentRef, {
                    Username: user.displayName || userr.displayName,
                    comment: comment,           
                    rating: rating,             
                    createdAt: new Date()       
                });

                alert("Yorumunuz kaydedildi!");
                await updateAverageRating();
                fetchComments();
            } catch (error) {
                console.error("Yorum kaydedilirken hata oluştu:", error);
                alert("Bir hata oluştu, lütfen tekrar deneyin.");
            }
        } else {
            alert("Yorum yapabilmek için giriş yapmanız gerekir.");
        }
    };

    const updateAverageRating = async () => {
        try {
            const commentsRef = collection(db, "Exams", categoryId, "Classes", classId, "Exams", examId, "Comments");
            const commentsSnapshot = await getDocs(commentsRef);
            const comments = commentsSnapshot.docs.map(doc => doc.data());
            const totalRatings = comments.reduce((acc, comment) => acc + comment.rating, 0);
            const averageRating = totalRatings / comments.length;

            const examRef = doc(db, "Exams", categoryId, "Classes", classId, "Exams", examId);
            await setDoc(examRef, { averageRating }, { merge: true });

            console.log("Ortalama puan başarıyla güncellendi!");
            setAverageRating(averageRating);
        } catch (error) {
            console.error("Ortalama puan güncellenirken hata oluştu:", error);
        }
    };

    const fetchComments = async () => {
        try {
            const commentsRef = collection(db, "Exams", categoryId, "Classes", classId, "Exams", examId, "Comments");
            const commentsSnapshot = await getDocs(commentsRef);
            const fetchedComments = commentsSnapshot.docs.map(doc => doc.data());
            setComments(fetchedComments);
        } catch (error) {
            console.error("Yorumlar alınırken hata oluştu:", error);
        }
    };

    const handleRatingChange = (rating) => {
        setRating(rating);
    };

    const goToHomePage = () => {
        navigate('/');
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 overflow-hidden">
                    <div className="bg-white p-8 rounded-lg max-w-md w-full">
                        <h2 className="text-2xl  text-center font-semibold mb-4">İmtahan Qaydaları</h2>
                        <ul className="list-disc pl-5 mb-4">
                            <li>İmtahanı bitirdikdən sonra nəticəni görə bilərsiniz.</li>
                            <li>Cavab verməyə istədiyiniz sualdan başlaya bilərsiniz.</li>
                            <li>Yanlış cavablar doğru cavablara təsir göstərmir.</li>
                            <li>Hər doğru cavab 1 bal ilə qiymətləndirilir.</li>

                            {/* Add other rules here */}
                        </ul>
                        {isCertifiedExam && (
                          <div className="flex gap-3">
                                <FaCertificate  size={32} className="text-yellow-400"/>
                                <p className="text-lg  text-gray-800 mb-4">
                                Bu imtahanın sonunda uğur faizinizə əsasən sertifikat veriləcəkdir.
                                </p>
                          </div>
                        )}
                        <div className="flex justify-center">
                            <button 
                                onClick={closeModal}
                                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
                                Qaydaları Oxudum, Davam Et
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
                {!showResults ? (
                    <>
                        <h2 className="text-4xl font-extrabold text-center text-blue-600">{examId} Sınavı</h2>
                        <p className="text-center text-lg text-gray-500 mt-2">Soruları yanıtlayın ve sınavınızı tamamlayın!</p>

                        {loading ? (
                            <div className="flex justify-center mt-8">
                                <p className="text-xl text-gray-500">Yükleniyor...</p>
                            </div>
                        ) : (
                            questions.length > 0 ? (
                                questions.map((question, index) => (
                                    <div key={index} className="p-6 border rounded-lg shadow-xl bg-gray-50 mt-4 hover:shadow-2xl transition-all">
                                        <p className="text-xl font-semibold text-gray-800">{`Soru ${index + 1}: ${question.questionText}`}</p>
                                        {question.image && (
                                            <div className="mt-4">
                                                <img
                                                    src={question.image}
                                                    alt={`Soru ${index + 1} için resim`}
                                                    className="w-full h-auto rounded-lg shadow-md"
                                                />
                                            </div>
                                        )}
                                        <ul className="mt-4 space-y-3">
                                            {question.options.map((option, i) => (
                                                <li key={i} className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name={`question${index}`}
                                                        value={option}
                                                        checked={selectedAnswers[index] === option}
                                                        onChange={() => handleAnswerChange(index, option)}
                                                        className="form-radio h-5 w-5 text-blue-500"
                                                    />
                                                    <label className="text-gray-700">{option}</label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 mt-8">Bu sınavda soru bulunmamaktadır.</p>
                            )
                        )}

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all mt-8"
                        >
                            Sınavı Tamamla
                        </button>
                    </>
                ) : (
                    <>
                        <h3 className="text-3xl font-semibold text-green-600">Sonuçlar</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" fill="#8884d8" label>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        <p className="text-xl text-gray-700">Doğru: {correctAnswers} | Yanlış: {incorrectAnswers}</p>
                        <p className="text-lg text-gray-600">Başarı Oranı: {(correctAnswers / totalQuestions) * 100}%</p>

                        <div className="mt-6">
                            <h4 className="text-2xl font-semibold text-gray-800">Ortalama Puan: {averageRating ? averageRating.toFixed(2) : "Henüz yorum yapılmamış."}</h4>
                            <h4 className="text-2xl font-semibold text-gray-800">Sınavınızı Değerlendirin:</h4>
                            <div className="flex justify-center items-center space-x-2 mt-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <FaStar
                                        key={star}
                                        onClick={() => handleRatingChange(star)}
                                        color={star <= rating ? "#FFD700" : "#D3D3D3"}
                                        className="cursor-pointer"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full h-32 p-4 border rounded-lg"
                                placeholder="Yorumunuzu buraya yazın..."
                            ></textarea>
                        </div>

                        <button
                            onClick={handleSaveComment}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mt-4"
                        >
                            Yorum ve Puanı Kaydet
                        </button>

                        <button
                            onClick={goToHomePage}
                            className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 mt-4"
                        >
                            Dashboarda Git
                        </button>

                   {isCertifiedExam && correctAnswers / totalQuestions >= 0.8 && (
    <CertificateGenerator
        userName={userr?.displayName || "Bilinmeyen Kullanıcı"}
        examName={examId}
        date={new Date().toLocaleDateString()}
        userUID={userr?.uid|| "Bilinmeyen Kullanıcı"}
    />
)}

                    </>
                )}
            </div>
        </div>
    );
};

export default ExamViewPage;