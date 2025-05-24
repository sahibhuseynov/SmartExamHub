import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/config";
import { FaStar, FaChevronRight, FaChevronLeft, FaList, FaHome, FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import CertificateGenerator from '../components/dashboard/CertificateGenerator';
import { useSelector } from 'react-redux';
import Timer from './../components/dashboard/Timer';
import ExamRulesModal from './../components/dashboard/ExamRulesModal';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from "framer-motion";

const ExamViewPage = () => {
    const { categoryId, classId, examId } = useParams();
    const [examDuration, setExamDuration] = useState(0);
    const [sections, setSections] = useState([]);
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
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showAnswerSheet, setShowAnswerSheet] = useState(false);
    const [isFreeExam, setIsFreeExam] = useState(false);
    const [currentWrongAnswerIndex, setCurrentWrongAnswerIndex] = useState(0);
    const navigate = useNavigate();
    const userr = useSelector(state => state.user.user);

    const handleTimeUp = () => {
        Swal.fire({
            title: 'Vaxt bitdi!',
            text: 'İmtahan avtomatik olaraq tamamlandı.',
            icon: 'info',
            confirmButtonText: 'Geri dön',
            customClass: {
                popup: 'rounded-xl shadow-xl'
            }
        });
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
                    
                    const sectionsRef = collection(examRef, "Sections");
                    const sectionsSnapshot = await getDocs(sectionsRef);
                    let fetchedSections = [];
                    
                    if (sectionsSnapshot.size > 0) {
                        for (const sectionDoc of sectionsSnapshot.docs) {
                            const sectionData = sectionDoc.data();
                            const questionsRef = collection(sectionDoc.ref, "Questions");
                            const questionsSnapshot = await getDocs(questionsRef);
                            const questions = questionsSnapshot.docs.map(doc => doc.data());
                            
                            fetchedSections.push({
                                id: sectionDoc.id,
                                name: sectionData.name,
                                questions: questions
                            });
                        }
                    } else {
                        const questionsRef = collection(examRef, "Questions");
                        const questionsSnapshot = await getDocs(questionsRef);
                        const questions = questionsSnapshot.docs.map(doc => doc.data());
                        
                        if (questions.length > 0) {
                            fetchedSections.push({
                                id: 'default-section',
                                name: 'Questions',
                                questions: questions
                            });
                        }
                    }
                    
                    setSections(fetchedSections);
                    const total = fetchedSections.reduce((sum, section) => sum + section.questions.length, 0);
                    setTotalQuestions(total);

                    const commentsRef = collection(examRef, "Comments");
                    const commentsSnapshot = await getDocs(commentsRef);
                    const fetchedComments = commentsSnapshot.docs.map(doc => doc.data());
                    setComments(fetchedComments);

                    setAverageRating(examSnap.data().averageRating || 0);
                    setIsCertifiedExam(examSnap.data().isCertified || false);
                    setIsFreeExam(examSnap.data().isFree || false);
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

    const handleAnswerChange = (sectionId, questionIndex, selectedOption) => {
        setSelectedAnswers(prevState => ({
            ...prevState,
            [`${sectionId}-${questionIndex}`]: selectedOption
        }));
    };
    
    const handleSubmit = async () => {
        const unansweredCount = totalQuestions - Object.keys(selectedAnswers).length;
        
        const result = await Swal.fire({
            title: 'İmtahanı bitirmək istədiyinizə əminsiniz?',
            html: `
                <div class="text-left">
                    <p class="mb-2">Cavablanmamış suallar: <strong>${unansweredCount}</strong></p>
                    ${unansweredCount > 0 ? 
                        '<p class="text-red-600">Cavab vermədiyiniz suallar var!</p>' : 
                        '<p class="text-green-600">✓ Bütün suallara cavab verdiniz</p>'
                    }
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Bəli, Bitir',
            cancelButtonText: 'Xeyr, Geri Dön',
            customClass: {
                popup: 'rounded-xl shadow-xl',
                actions: '!gap-4',
                confirmButton: '!ml-4 order-2 !px-4 !py-2 bg-blue-500 hover:bg-blue-600 rounded-lg !text-white',
                cancelButton: 'order-1 !px-4 !py-2 bg-gray-300 hover:bg-gray-400 rounded-lg'
            },
            buttonsStyling: false,
            reverseButtons: true
        });
        
        if (!result.isConfirmed) {
            return;
        }

        let correct = 0;
        let incorrect = 0;
        let wrongAnswersList = [];

        sections.forEach(section => {
            section.questions.forEach((question, index) => {
                const answerKey = `${section.id}-${index}`;
                if (selectedAnswers[answerKey] === question.correctAnswer) {
                    correct++;
                } else {
                    incorrect++;
                    wrongAnswersList.push({
                        question: question.questionText,
                        questionImage: question.image,
                        correctAnswer: question.correctAnswer,
                        userAnswer: selectedAnswers[answerKey],
                        sectionName: section.name
                    });
                }
            });
        });
    
        setCorrectAnswers(correct);
        setIncorrectAnswers(incorrect);
        setShowResults(true);
        setWrongAnswers(wrongAnswersList);

        const successRate = (correct / totalQuestions) * 100;
    
        if (isCertifiedExam && !isFreeExam) {
            if (successRate >= 80) {
                await Swal.fire({
                    title: 'Təbriklər!',
                    text: 'Sertifikat qazandınız!',
                    icon: 'success',
                    confirmButtonText: 'Tamam',
                    customClass: {
                        popup: 'rounded-xl shadow-xl'
                    }
                });
            } else {
                await Swal.fire({
                    title: 'Diqqət',
                    text: 'Sertifikat üçün uğur faiziniz ən az 80% olmalıdır.',
                    icon: 'warning',
                    confirmButtonText: 'Tamam',
                    customClass: {
                        popup: 'rounded-xl shadow-xl'
                    }
                });
            }
        }
    
        await saveExamResultsToUser(correct, incorrect);
    };
    
    const saveExamResultsToUser = async (correct, incorrect) => {
        const user = auth.currentUser;
        if (user && !isFreeExam) {
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
        const currentSection = sections[currentSectionIndex];
        
        if (currentQuestionIndex < currentSection.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } 
        else if (currentSectionIndex < sections.length - 1) {
            setCurrentSectionIndex(currentSectionIndex + 1);
            setCurrentQuestionIndex(0);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        } 
        else if (currentSectionIndex > 0) {
            setCurrentSectionIndex(currentSectionIndex - 1);
            const prevSection = sections[currentSectionIndex - 1];
            setCurrentQuestionIndex(prevSection.questions.length - 1);
        }
    };

    const toggleAnswerSheet = () => {
        setShowAnswerSheet(!showAnswerSheet);
    };

    const calculateQuestionOffset = (sectionIndex) => {
        let offset = 0;
        for (let i = 0; i < sectionIndex; i++) {
            offset += sections[i].questions.length;
        }
        return offset;
    };

    const jumpToQuestion = (sectionIndex, questionIndex) => {
        setCurrentSectionIndex(sectionIndex);
        setCurrentQuestionIndex(questionIndex);
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

                Swal.fire({
                    title: 'Uğurlu!',
                    text: 'Rəyiniz qeyd olundu!',
                    icon: 'success',
                    confirmButtonText: 'Geri dön',
                    customClass: {
                        popup: 'rounded-xl shadow-xl'
                    }
                });
                await updateAverageRating();
                fetchComments();
                setComment('');
                setRating(0);
            } catch (error) {
                console.error("Yorum kaydedilirken hata oluştu:", error);
            }
        } else {
            Swal.fire({
                title: 'Xəbərdarlıq',
                text: 'Yorum yapabilmek için giriş yapmanız gerekir.',
                icon: 'warning',
                confirmButtonText: 'Tamam',
                customClass: {
                    popup: 'rounded-xl shadow-xl'
                }
            });
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

    const getNextButtonText = () => {
        const currentSection = sections[currentSectionIndex];
        
        if (currentSectionIndex === sections.length - 1 && 
            currentQuestionIndex === currentSection.questions.length - 1) {
            return "İmtahanı Bitir";
        }
        
        if (currentQuestionIndex === currentSection.questions.length - 1) {
            return `Sonrakı Bölüm (${sections[currentSectionIndex + 1].name})`;
        }
        
        return "Növbəti";
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {showModal && (
                <ExamRulesModal
                    showModal={showModal}
                    closeModal={closeModal}
                    isCertifiedExam={isCertifiedExam}
                    isLoading={loading}
                />
            )}

            <div className="max-w-6xl mx-auto p-4 md:p-6">
                {!showResults ? (
                    <>
                        {/* Header with Timer */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl md:text-2xl font-bold text-gray-800">{examId}</h1>
                                <span className="hidden md:block text-gray-400">|</span>
                                <span className="text-sm text-gray-500">
                                    {sections.length} bölüm • {totalQuestions} sual
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Timer initialTime={examDuration * 60} onTimeUp={handleTimeUp} />
                                
                                <button 
                                    onClick={toggleAnswerSheet}
                                    className={`flex items-center gap-2 p-4 rounded-lg ${showAnswerSheet ? 'bg-blue-100 text-blue-600' : 'bg-white shadow-lg hover:bg-gray-200'} transition`}
                                >
                                    <FaList size={14} />
                                    <span className="hidden sm:inline">Cavab Kartı</span>
                                </button>
                                
                              <button
  onClick={handleSubmit}
  className="flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all duration-300 shadow-lg bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 hover:shadow-xl active:scale-95"
>
  <span>İmtahanı Bitir</span>
  
</button>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="relative flex gap-6">
                            {/* Answer Sheet Sidebar */}
                            <AnimatePresence>
                                {showAnswerSheet && (
                                    <motion.div 
                                          initial={{ x: 300, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 300, opacity: 0 }}
                                        transition={{ type: "spring", damping: 30 }}
                                        className="hidden md:block absolute md:relative right-0 top-0 w-64 bg-white p-4 rounded-xl shadow-lg z-10 border border-gray-200 h-[80vh] overflow-y-auto"
                                    >
                                        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <FaList className="text-blue-500" />
                                            Cavab Kartı
                                        </h3>
                                        
                                        {sections.map((section, sectionIndex) => {
                                            const offset = calculateQuestionOffset(sectionIndex);
                                            return (
                                                <div key={section.id} className="mb-4">
                                                    <h4 className="font-medium text-sm mb-2 text-gray-600">{section.name}</h4>
                                                    <div className="grid grid-cols-5 gap-2">
                                                        {section.questions.map((_, questionIndex) => {
                                                            const globalQuestionNumber = offset + questionIndex + 1;
                                                            const isCurrent = sectionIndex === currentSectionIndex && 
                                                                            questionIndex === currentQuestionIndex;
                                                            const isAnswered = selectedAnswers[`${section.id}-${questionIndex}`];
                                                            
                                                            return (
                                                                <button
                                                                    key={questionIndex}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // Tıklamanın dışarı yayılmasını engelle
                                                                        jumpToQuestion(sectionIndex, questionIndex);
                                                                    }}
                                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                                                                        isCurrent 
                                                                            ? 'bg-blue-600 text-white scale-110 ring-2 ring-blue-300' 
                                                                            : isAnswered 
                                                                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                                                                : 'bg-gray-100 hover:bg-gray-200'
                                                                    }`}
                                                                >
                                                                    {globalQuestionNumber}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Question Area */}
                            <motion.div 
                                layout
                                className={`flex-1 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all min-h-[70vh]`}
                                
                            >
                                {loading ? (
                                    <div className="p-8 text-center">
                                        <p className="text-gray-500">Yüklənir...</p>
                                    </div>
                                ) : sections.length > 0 ? (
                                    <div className="p-6">
                                        {/* Section Navigation */}
                                        {sections.length > 1 && (
                                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                                <h3 className="text-lg font-semibold text-blue-700">
                                                    {sections[currentSectionIndex].name}
                                                </h3>
                                                <span className="text-sm text-gray-500">
                                                    Bölüm {currentSectionIndex + 1}/{sections.length}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {/* Question Content */}
                                        <div className="mb-6">
                                           <p className="text-xl font-medium text-gray-800 mb-4 break-words"> 
                                                <span className="font-bold text-blue-600">
                                                    Sual {calculateQuestionOffset(currentSectionIndex) + currentQuestionIndex + 1}:
                                                </span> {sections[currentSectionIndex].questions[currentQuestionIndex].questionText}
                                            </p>
                                            
                                            {sections[currentSectionIndex].questions[currentQuestionIndex].image && (
                                                <div className="mb-6 flex justify-center">
                                                    <img
                                                        src={sections[currentSectionIndex].questions[currentQuestionIndex].image}
                                                        alt="Sual şəkli"
                                                        className="max-h-64 rounded-lg border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                            
                                            {sections[currentSectionIndex].questions[currentQuestionIndex].audio && (
                                                <div className="mb-6">
                                                    <audio controls className="w-full">
                                                        <source src={sections[currentSectionIndex].questions[currentQuestionIndex].audio} type="audio/mp3" />
                                                    </audio>
                                                </div>
                                            )}
                                            
                                            <ul className="grid grid-cols-1 md:grid-cols-2 items-center gap-3">
                                                {sections[currentSectionIndex].questions[currentQuestionIndex].options.map((option, i) => (
                                                    <li key={i} >
                                                        <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                                                            selectedAnswers[`${sections[currentSectionIndex].id}-${currentQuestionIndex}`] === option.option
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-gray-200 hover:bg-gray-50'
                                                        }`}>
                                                            <input
                                                                type="radio"
                                                                name={`question-${sections[currentSectionIndex].id}-${currentQuestionIndex}`}
                                                                value={option.option}
                                                                checked={selectedAnswers[`${sections[currentSectionIndex].id}-${currentQuestionIndex}`] === option.option}
                                                                onChange={() => handleAnswerChange(sections[currentSectionIndex].id, currentQuestionIndex, option.option)}
                                                                className="radio radio-primary"
                                                            />
                                                            <span className="ml-3 text-gray-700">{option.option}</span>
                                                            {option.optionPhoto && (
                                                                <img
                                                                    src={option.optionPhoto}
                                                                    alt={`Option ${i + 1}`}
                                                                    className="ml-auto h-16 object-contain"
                                                                />
                                                            )}
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        {/* Navigation Buttons */}
                                        <div className="flex justify-between pt-4 border-t border-gray-200">
                                            <button
                                                onClick={handlePrevQuestion}
                                                disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition"
                                            >
                                                <FaChevronLeft /> Əvvəlki
                                            </button>
                                            
                                            <button
                                                onClick={
                                                    currentSectionIndex === sections.length - 1 && 
                                                    currentQuestionIndex === sections[currentSectionIndex].questions.length - 1
                                                        ? handleSubmit
                                                        : handleNextQuestion
                                                }
                                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                {getNextButtonText()} 
                                                {!(currentSectionIndex === sections.length - 1 && 
                                                  currentQuestionIndex === sections[currentSectionIndex].questions.length - 1) && 
                                                  <FaChevronRight />}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-gray-500">Bu sınavda soru bulunmamaktadır.</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-200">
                        <h3 className="text-3xl font-bold text-indigo-600 mb-8 text-center">Nəticələr</h3>

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
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <p className="text-2xl md:text-3xl text-gray-700 mb-4">
                                        <span className="text-green-600 font-bold">{correctAnswers}</span> Doğru | 
                                        <span className="text-red-600 font-bold"> {incorrectAnswers}</span> Yanlış
                                    </p>
                                    <p className="text-xl md:text-2xl text-gray-600 mb-4">
                                        Uğur Faizi: <span className="font-bold">{((correctAnswers / totalQuestions) * 100).toFixed(2)}%</span>
                                    </p>
                                    <p className="text-lg text-gray-600">
                                        Cavabsız suallar: <span className="font-bold text-orange-600">{totalQuestions - (correctAnswers + incorrectAnswers)}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {wrongAnswers.length > 0 && (
                            <div className="mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold text-red-600">
                                        Yanlış Cavablar ({currentWrongAnswerIndex + 1}/{wrongAnswers.length})
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentWrongAnswerIndex(prev => Math.max(prev - 1, 0))}
                                            disabled={currentWrongAnswerIndex === 0}
                                            className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition text-sm"
                                        >
                                            <FaChevronLeft className="text-xs" /> Əvvəlki
                                        </button>
                                        <button
                                            onClick={() => setCurrentWrongAnswerIndex(prev => Math.min(prev + 1, wrongAnswers.length - 1))}
                                            disabled={currentWrongAnswerIndex === wrongAnswers.length - 1}
                                            className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition text-sm"
                                        >
                                            Növbəti <FaChevronRight className="text-xs" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                    {wrongAnswers[currentWrongAnswerIndex].sectionName}
                                                </span>
                                                <h4 className="mt-2 text-lg font-semibold text-gray-800">
                                                    {wrongAnswers[currentWrongAnswerIndex].question}
                                                </h4>
                                            </div>
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                                                Sual {currentWrongAnswerIndex + 1}
                                            </span>
                                        </div>

                                        {wrongAnswers[currentWrongAnswerIndex].questionImage && (
                                            <div className="mt-4 flex justify-center">
                                                <img
                                                    src={wrongAnswers[currentWrongAnswerIndex].questionImage}
                                                    alt="Sual şəkli"
                                                    className="max-h-64 rounded-lg border border-gray-200"
                                                />
                                            </div>
                                        )}

                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                                <h5 className="text-sm font-medium text-green-800 mb-1">Doğru cavab</h5>
                                                <p className="text-green-700 font-semibold">
                                                    {wrongAnswers[currentWrongAnswerIndex].correctAnswer}
                                                </p>
                                            </div>
                                            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                                <h5 className="text-sm font-medium text-red-800 mb-1">Sizin cavabınız</h5>
                                                <p className="text-red-700 font-semibold">
                                                    {wrongAnswers[currentWrongAnswerIndex].userAnswer || "Cavab verilməyib"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <FaList className="text-blue-500" />
                                        Cavab Kartı
                                    </h4>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex flex-wrap gap-2">
                                            {wrongAnswers.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentWrongAnswerIndex(index)}
                                                    className={`
                                                        w-10 h-10 rounded-lg flex items-center justify-center transition-all
                                                        ${index === currentWrongAnswerIndex 
                                                            ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                                                            : 'bg-gray-100 hover:bg-gray-200'}
                                                    `}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isCertifiedExam && !isFreeExam && correctAnswers / totalQuestions >= 0.8 && (
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
                            
                            <div className="flex flex-col items-center max-w-2xl mx-auto">
                                <div className="flex justify-center items-center space-x-2 mb-6">
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
                                    className="w-full h-32 p-4 border rounded-lg shadow-sm mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Şərhinizi bura yazın..."
                                ></textarea>
                                
                                <div className="flex flex-col sm:flex-row gap-4 w-full">
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