import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/config";
import { FaStar, FaChevronRight, FaChevronLeft, FaList, FaHome } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import CertificateGenerator from '../components/dashboard/CertificateGenerator';
import { useSelector } from 'react-redux';
import Timer from './../components/dashboard/Timer';
import ExamRulesModal from './../components/dashboard/ExamRulesModal';

const ExamViewPage = () => {
    const { categoryId, classId, examId } = useParams();
    const [examDuration, setExamDuration] = useState(0);
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
    const [showModal, setShowModal] = useState(true);
    const [isCertifiedExam, setIsCertifiedExam] = useState(false);
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [hasCertificate, setHasCertificate] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showAnswerSheet, setShowAnswerSheet] = useState(false);
    
    const navigate = useNavigate();
    const userr = useSelector(state => state.user.user);

    const handleTimeUp = () => {
        alert('Vaxt bitdi! İmtahan avtomatik olaraq tamamlandı.');
        handleSubmit();
    };
    
    useEffect(() => {
        if (showResults) {
            window.scrollTo(0, 0);
        }
    }, [showResults]);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showModal]);
    
    useEffect(() => {
        const checkCertificate = async () => {
            try {
                if (userr && examId) {
                    const userDocRef = doc(db, "Users", userr.uid);
                    const userDocSnap = await getDoc(userDocRef);
    
                    if (userDocSnap.exists()) {
                        const certificates = userDocSnap.data().certificates || [];
                        const certificateExists = certificates.some(
                            (cert) => cert.examName === examId
                        );
                        setHasCertificate(certificateExists);
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
                    const examData = examSnap.data();
                    const questionsSnapshot = await getDocs(collection(examRef, "Questions"));
                    const fetchedQuestions = questionsSnapshot.docs.map(doc => doc.data());
                    setQuestions(fetchedQuestions);
                    setTotalQuestions(fetchedQuestions.length);

                    const commentsRef = collection(examRef, "Comments");
                    const commentsSnapshot = await getDocs(commentsRef);
                    const fetchedComments = commentsSnapshot.docs.map(doc => doc.data());
                    setComments(fetchedComments);

                    setAverageRating(examSnap.data().averageRating || 0);
                    setIsCertifiedExam(examSnap.data().isCertified || false);
                    setExamDuration(examData.examDuration || 10);
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
        let wrongAnswersList = [];

        questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correct++;
            } else {
                incorrect++;
                wrongAnswersList.push({
                    question: question.questionText,
                    questionImage: question.image,
                    correctAnswer: question.correctAnswer,
                    userAnswer: selectedAnswers[index]
                });
            }
        });
    
        setCorrectAnswers(correct);
        setIncorrectAnswers(incorrect);
        setShowResults(true);
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
                    
                    const hasAttemptedExam = existingExams.some(
                        (exam) => exam.examId === examId
                    );
    
                    if (!hasAttemptedExam) {
                        const successRate = (correct / totalQuestions) * 100;
    
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
                    }
                }
            } catch (error) {
                console.error("Sonuçlar kaydedilirken hata oluştu:", error);
            }
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const toggleAnswerSheet = () => {
        setShowAnswerSheet(!showAnswerSheet);
    };

    const jumpToQuestion = (index) => {
        setCurrentQuestionIndex(index);
        setShowAnswerSheet(false);
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
                setComment('');
                setRating(0);
            } catch (error) {
                console.error("Yorum kaydedilirken hata oluştu:", error);
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

    const handleRatingChange = (newRating) => {
        setRating(newRating);
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
                <ExamRulesModal
                    showModal={showModal}
                    closeModal={closeModal}
                    isCertifiedExam={isCertifiedExam}
                    isLoading={loading}
                />
            )}

            <div className="max-w-5xl mx-auto p-4 md:p-8 bg-white relative">
                {!showResults ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <Timer initialTime={examDuration * 60} onTimeUp={handleTimeUp} />
                            <button 
                                onClick={toggleAnswerSheet}
                                className="p-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
                            >
                                <FaList /> Cavab Kartı
                            </button>
                        </div>

                        <h2 className="text-2xl md:text-4xl font-extrabold text-center text-blue-600 mb-4">{examId} İmtahanı</h2>
                        
                        {loading ? (
                            <div className="flex justify-center mt-8">
                                <p className="text-xl text-gray-500">Yükleniyor...</p>
                            </div>
                        ) : questions.length > 0 ? (
                            <div className="relative">
                                {/* Cevap kartı paneli */}
                                {showAnswerSheet && (
                                    <div className="absolute right-0 top-0 bg-white p-4 rounded-lg shadow-lg z-10 border border-gray-200 w-64">
                                        <h3 className="font-bold mb-2">Cevap Kartı</h3>
                                        <div className="grid grid-cols-5 gap-2">
                                            {questions.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => jumpToQuestion(index)}
                                                    className={`w-8 h-8 rounded flex items-center justify-center ${
                                                        selectedAnswers[index] 
                                                            ? 'bg-green-500 text-white' 
                                                            : 'bg-gray-200'
                                                    } ${
                                                        index === currentQuestionIndex 
                                                            ? 'border-2 border-blue-500' 
                                                            : ''
                                                    }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tek soru görünümü */}
                                <div className="p-6 border rounded-lg shadow-md">
                                    <p className="text-xl font-semibold text-gray-800">
                                        <span dangerouslySetInnerHTML={{ 
                                            __html: `Sual ${currentQuestionIndex + 1}: ${questions[currentQuestionIndex].questionText}` 
                                        }} />
                                    </p>
                                    
                                    {questions[currentQuestionIndex].image && (
                                        <div className="mt-4">
                                            <img
                                                src={questions[currentQuestionIndex].image}
                                                alt={`Sual ${currentQuestionIndex + 1} üçün resim`}
                                                className="w-full max-h-64 object-contain rounded-lg"
                                            />
                                        </div>
                                    )}
                                    
                                    {questions[currentQuestionIndex].audio && (
                                        <div className="mt-4">
                                            <audio controls>
                                                <source src={questions[currentQuestionIndex].audio} type="audio/mp3" />
                                            </audio>
                                        </div>
                                    )}
                                    
                                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">  {/* Bu satırı değiştiriyoruz */}
    {questions[currentQuestionIndex].options.map((option, i) => (
        <li key={i} className="flex items-center p-3 border rounded hover:bg-gray-50">
            <label className="cursor-pointer flex items-center space-x-3 w-full">
                <input
                    type="radio"
                    name={`question${currentQuestionIndex}`}
                    value={option.option}
                    checked={selectedAnswers[currentQuestionIndex] === option.option}
                    onChange={() => handleAnswerChange(currentQuestionIndex, option.option)}
                    className="radio radio-primary"
                />
                <span className="text-gray-700">{option.option}</span>
                {option.optionPhoto && (
                    <img
                        src={option.optionPhoto}
                        alt={`Option ${i + 1}`}
                        className="ml-2 h-16 object-contain"
                    />
                )}
            </label>
        </li>
    ))}
</ul>
                                    
                                    <div className="flex justify-between mt-6">
                                        <button
                                            onClick={handlePrevQuestion}
                                            disabled={currentQuestionIndex === 0}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                                        >
                                            <FaChevronLeft /> Əvvəlki
                                        </button>
                                        
                                        {currentQuestionIndex < questions.length - 1 ? (
                                            <button
                                                onClick={handleNextQuestion}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                            >
                                                Növbəti <FaChevronRight />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleSubmit}
                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                            >
                                                İmtahanı Bitir
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 mt-8">Bu sınavda soru bulunmamaktadır.</p>
                        )}
                    </>
                ) : (
                    <div className="mt-8">
                        <h3 className="text-4xl font-bold text-indigo-600 mb-6 text-center">Nəticələr</h3>

                        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
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
                                <p className="text-2xl md:text-3xl text-gray-700 mb-2">
                                    Doğru: <span className="text-green-600 font-bold">{correctAnswers}</span> | 
                                    Yanlış: <span className="text-red-600 font-bold">{incorrectAnswers}</span>
                                </p>
                                <p className="text-xl md:text-2xl text-gray-600 mb-2">
                                    Uğur Faizi: <span className="font-bold">{((correctAnswers / totalQuestions) * 100).toFixed(2)}%</span>
                                </p>
                                <p className="text-lg text-gray-600">
                                    Cavabsız suallar: <span className="font-bold text-orange-600">{totalQuestions - (correctAnswers + incorrectAnswers)}</span>
                                </p>
                            </div>
                        </div>

                        {wrongAnswers.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-2xl font-bold text-red-600 mb-4">Yanlış Cavablar</h3>
                                <ul className="space-y-4">
                                    {wrongAnswers.map((item, index) => (
                                        <li key={index} className="p-4 border rounded-lg shadow-md bg-white">
                                            <p 
                                                className="font-semibold text-gray-800"
                                                dangerouslySetInnerHTML={{ __html: `Sual: ${item.question}` }}
                                            />
                                            {item.questionImage && (
                                                <img
                                                    src={item.questionImage}
                                                    alt={`Question Image ${index + 1}`}
                                                    className="mt-2 w-full h-auto md:max-h-80 object-contain"
                                                />
                                            )}
                                            <p className="text-gray-600 mt-2">
                                                Doğru Cavab: <span className="text-green-600 font-bold">{item.correctAnswer}</span>
                                            </p>
                                            <p className="text-gray-600">
                                                Sizin Cavabınız: <span className="text-red-600 font-bold">{item.userAnswer || "Cavab verilməyib"}</span>
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {isCertifiedExam && correctAnswers / totalQuestions >= 0.8 && (
                            <div className="mt-8 text-center">
                                {hasCertificate ? (
                                    <p className="text-green-500 text-lg font-semibold">
                                        Siz daha əvvəl bu sertifikatı qazanmısınız. Profildən əldə edə bilərsiniz.
                                    </p>
                                ) : (
                                    <CertificateGenerator
                                        userName={userr.displayName}
                                        examName={examId}
                                        passPercentage={(correctAnswers / totalQuestions) * 100}
                                        userUID={userr.uid}
                                    />
                                )}
                            </div>
                        )}

                        <div className="mt-12">
                            <h4 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
                                İmtahanı qiymətləndirin
                            </h4>
                            
                            <div className="flex flex-col items-center">
                                <div className="flex justify-center items-center space-x-2 mb-4">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <FaStar
                                            size={32}
                                            key={star}
                                            onClick={() => handleRatingChange(star)}
                                            color={star <= rating ? "#FFD700" : "#D3D3D3"}
                                            className="cursor-pointer hover:scale-110 transition"
                                        />
                                    ))}
                                </div>
                                
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full max-w-2xl h-32 p-4 border rounded-lg shadow-md mb-4"
                                    placeholder="Şərhinizi bura yazın..."
                                ></textarea>
                                
                                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
                                    <button
                                        onClick={handleSaveComment}
                                        className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                                    >
                                        Göndər
                                    </button>
                                    <button
                                        onClick={goToHomePage}
                                        className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
                                    >
                                        <FaHome /> Ana Səhifəyə Get
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamViewPage;