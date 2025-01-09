import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { FaStar } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { auth } from "../firebase/config"; // Firebase Authentication importu
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

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

    const handleSubmit = () => {
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
                    userName: user.displayName, 
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
        navigate('/dashboard');
    };

    return (
        <div className="bg-gray-100 min-h-screen">
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
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        size={30}
                                        color={rating >= star ? "#FFD700" : "#D3D3D3"}
                                        onClick={() => handleRatingChange(star)}
                                    />
                                ))}
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Yorumunuzu buraya yazın..."
                                className="mt-2 w-full p-4 border rounded-md shadow-lg focus:outline-none"
                                rows="4"
                            />
                            <button
                                onClick={handleSaveComment}
                                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
                            >
                                Yorum Gönder
                            </button>
                        </div>

                        <div className="mt-6">
                            <h4 className="text-2xl font-semibold text-gray-800">Yorumlar</h4>
                            {comments.length === 0 ? (
                                <p>Henüz yorum yapılmamış.</p>
                            ) : (
                                comments.map((comment, index) => (
                                    <div key={index} className="border-b py-4">
                                        <p><strong>{comment.userName}</strong> ({new Date(comment.createdAt.seconds * 1000).toLocaleDateString()}):</p>
                                        <p>{comment.comment}</p>
                                        <p>⭐ {comment.rating} / 5</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={goToHomePage}
                                className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-all"
                            >
                                Ana Sayfaya Dön
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ExamViewPage;
