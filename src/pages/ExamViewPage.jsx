import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/config";
import { FaFacebook, FaStar,FaWhatsapp } from "react-icons/fa";
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
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [hasCertificate, setHasCertificate] = useState(false); //daha once sertifikat almisimi
    const navigate = useNavigate();
    const userr = useSelector(state => state.user.user);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    
        // Cleanup için: Modal kapandığında scroll özelliğini geri yükle
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showModal]);
    
    useEffect(() => {
        const checkCertificate = async () => {
            try {
                if (userr && examId) {
                    // Kullanıcı belgesine erişim
                    const userDocRef = doc(db, "Users", userr.uid);
                    const userDocSnap = await getDoc(userDocRef);
    
                    if (userDocSnap.exists()) {
                        // Certificates array'ini al
                        const certificates = userDocSnap.data().certificates || [];
                        
                        // Array içinde examName kontrolü
                        const certificateExists = certificates.some(
                            (cert) => cert.examName === examId
                        );
    
                        console.log("Certificate exists:", certificateExists);
                        setHasCertificate(certificateExists);
                    } else {
                        console.log("User document does not exist.");
                    }
                }
            } catch (error) {
                console.error("Error checking certificates:", error);
            }
        };
    
        checkCertificate();
    }, [userr, examId]);
    
    useEffect(() => {
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

                    setIsCertifiedExam(examSnap.data().isCertified || false);
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
        let wrongAnswersList = []; // Yanlış cevapları tutacak bir liste
    
        questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correct++;
            } else {
                incorrect++;
                wrongAnswersList.push({
                    question: question.questionText,
                    correctAnswer: question.correctAnswer,
                    userAnswer: selectedAnswers[index]
                });
            }
        });
    
        setCorrectAnswers(correct);
        setIncorrectAnswers(incorrect);
        setShowResults(true);
        
        // Yanlış cevaplar kısmını göstermek için state güncellemesi
        setWrongAnswers(wrongAnswersList);
    
        const successRate = (correct / totalQuestions) * 100;
    
        if (isCertifiedExam && successRate >= 80) {
            alert("Təbriklər! Sertifikat qazandınız.");
        } else if (isCertifiedExam) {
            alert("Sertifikat üçün uğur faiziniz ən az 80% olmalıdır.");
        }
    
        await saveExamResultsToUser(correct, incorrect);
    };

    const saveExamResultsToUser = async (correct, incorrect) => {
        const user = auth.currentUser;
        if (user) {
            try {
                const userRef = doc(db, "Users", user.uid);
                const userSnap = await getDoc(userRef);
    
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const existingExams = userData.exams || [];
                    
                    // Kullanıcının bu sınava daha önce girip girmediğini kontrol et
                    const hasAttemptedExam = existingExams.some(
                        (exam) => exam.examId === examId
                    );
    
                    if (!hasAttemptedExam) {
                        const successRate = (correct / totalQuestions) * 100;
    
                        // Kullanıcının sınav sonuçlarını ekle
                        await setDoc(
                            userRef,
                            {
                                exams: arrayUnion({
                                    examId: examId,
                                    correctAnswers: correct,
                                    incorrectAnswers: incorrect,
                                    totalQuestions: totalQuestions,
                                    successRate: successRate,
                                    completedAt: new Date(),
                                }),
                            },
                            { merge: true }
                        );
    
                        console.log("Sınav sonucu başarıyla kaydedildi.");
                    } else {
                        console.log("Kullanıcı bu sınava daha önce girmiş.");
                    }
                } else {
                    console.log("Kullanıcı belgesi bulunamadı.");
                }
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
        <div className="bg-white min-h-screen">
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 overflow-hidden">
                    <div className="bg-white p-8 rounded-lg max-w-md w-full">
                        <h2 className="text-2xl  text-center font-semibold mb-4">İmtahan Qaydaları</h2>
                        <ul className="list-disc pl-5 mb-4">
                            <li>İmtahanı bitirdikdən sonra nəticəni görə bilərsiniz.</li>
                            <li>Cavab verməyə istədiyiniz sualdan başlaya bilərsiniz.</li>
                            <li>Yanlış cavablar doğru cavablara təsir göstərmir.</li>
                            <li>Hər doğru cavab 1 bal ilə qiymətləndirilir.</li>
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

            <div className="max-w-5xl mx-auto p-8 bg-white ">
                {!showResults ? (
                    <>
                        <h2 className="text-4xl font-extrabold text-center text-blue-600">{examId} İmtahanı</h2>
                        <p className="text-center text-lg text-gray-500 mt-2">Suaları cavablandırın və imtahanınızı tamamlayın!</p>

                        {loading ? (
                            <div className="flex justify-center mt-8">
                                <p className="text-xl text-gray-500">Yükleniyor...</p>
                            </div>
                        ) : (
                            questions.length > 0 ? (
                                questions.map((question, index) => (
                                    <div key={index} className="p-6   mt-4 transition-all">
                                        <p className="text-xl font-semibold text-gray-800">{`Sual ${index + 1}: ${question.questionText}`}</p>
                                        {question.image && (
                                            <div className="mt-4">
                                                <img
                                                    src={question.image}
                                                    alt={`Sual ${index + 1} üçün resim`}
                                                    className="w-full h-96 object-contain rounded-lg "
                                                />
                                            </div>
                                        )}
                                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {question.options.map((option, i) => (
    <li 
      key={i} 
      className="flex flex-col items-start p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <label className="cursor-pointer flex items-center space-x-2 w-full">
        <input
          type="radio"
          name={`question${index}`}
          value={option.option}
          checked={selectedAnswers[index] === option.option}
          onChange={() => handleAnswerChange(index, option.option)}
          className="radio radio-primary"
        />
        <span className="text-gray-700">{option.option}</span>
      </label>
      {option.optionPhoto && (
        <img
          src={option.optionPhoto}
          alt={`Option ${i + 1} for question ${index + 1}`}
          className="mt-2 h-16 w-16 object-cover rounded-lg"
        />
      )}
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
                            İmtahanı Bitir
                        </button>
                    </>
                ) : (
                    <>
    <div className="">
        <h3 className="text-6xl font-bold text-indigo-600 mb-6 text-center">Nəticələr</h3>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="w-full md:w-1/2">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie 
                            data={chartData} 
                            dataKey="value" 
                            nameKey="name" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius="80%" 
                            fill="#4f46e5" 
                            label>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="w-full md:w-1/2 text-center">
                <p className="text-4xl text-gray-700 mb-2">Doğru: <span className="text-green-600 font-bold">{correctAnswers}</span> | Yanlış: <span className="text-red-600 font-bold">{incorrectAnswers}</span></p>
                <p className="text-2xl text-gray-600">Başarı Oranı: <span className="font-bold">{((correctAnswers / totalQuestions) * 100).toFixed(2)}%</span></p>
                <p className="text-lg text-gray-600">Cavabsız suallar: <span className="font-bold text-orange-600">{totalQuestions - (correctAnswers + incorrectAnswers)}</span></p>

                
            </div>
        </div>

        {showResults && wrongAnswers.length > 0 && (
            <div className="mt-8">
                <h3 className="text-2xl font-bold text-red-600">Yanlış Cevaplar</h3>
                <ul className="mt-4 space-y-4">
                    {wrongAnswers.map((item, index) => (
                        <li key={index} className="p-4 border rounded-lg shadow-md bg-white">
                            <p className="font-semibold text-gray-800">Sual: {item.question}</p>
                            <p className="text-gray-600">Doğru Cevap: <span className="text-green-600 font-bold">{item.correctAnswer}</span></p>
                            <p className="text-gray-600">Sizin Cevabınız: <span className="text-red-600 font-bold">{item.userAnswer}</span></p>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <div className="mt-24 flex flex-col text-center gap-4 items-center">
            <h4 className="text-4xl font-bold text-black ">İmtahanınızı qiymətləndirin</h4>
            <div className="flex justify-center items-center space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map(star => (
                    <FaStar
                        size={45}
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        color={star <= rating ? "#FFD700" : "#D3D3D3"}
                        className="cursor-pointer"
                    />
                ))}
            </div>

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-32 p-4 border rounded-lg shadow-md mt-4"
                placeholder="Yorumunuzu buraya yazın..."
            ></textarea>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
                onClick={handleSaveComment}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
                Göndər
            </button>
            <button
                onClick={goToHomePage}
                className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600">
                Ana Səhifəyə Get
            </button>
        </div>

        {isCertifiedExam && correctAnswers / totalQuestions >= 0.8 && (
            hasCertificate ? (
                <p className="text-green-500 text-lg font-semibold mt-4">
                    Siz daha əvvəl bu sertifikatı qazanmısınız. Profildən əldə edə bilərsiniz.
                </p>
            ) : (
                <CertificateGenerator
                    userName={userr.displayName}
                    examName={examId}
                    passPercentage={(correctAnswers / totalQuestions) * 100}
                    userUID={userr.uid}
                />
            )
        )}

        
    </div>
</>

                )}
            </div>
        </div>
    );
};

export default ExamViewPage;