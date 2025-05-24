import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from './../components/Navbar';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaStar } from "react-icons/fa";
import { handleCompleteExam } from "../services/firebaseService"; 
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from "react-redux";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";

const ExamDetailsPage = () => {
    const [open, setOpen] = useState(false);
    const [sections, setSections] = useState([]);
    
    const formatDateRelative = (timestamp) => {
        if (!timestamp?.seconds) return "Bilinmiyor";
    
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();
        const timeDiff = now - date;
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
        if (daysDiff < 1) {
            return "Bugün";
        } else if (daysDiff === 1) {
            return "1 gün əvvəl";
        } else if (daysDiff < 7) {
            return `${daysDiff} gün əvvəl`;
        } else if (daysDiff < 30) {
            const weeks = Math.floor(daysDiff / 7);
            return `${weeks} həftə əvvəl`;
        } else if (daysDiff < 365) {
            const months = Math.floor(daysDiff / 30);
            return `${months} ay əvvəl`;
        } else {
            const years = Math.floor(daysDiff / 365);
            return `${years} il əvvəl`;
        }
    };

    const { categoryId, classId, examId } = useParams();
    const [exam, setExam] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);
    const [couponCode, setCouponCode] = useState("");
    const [isCouponValid, setIsCouponValid] = useState(false);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        const fetchExamDetails = async () => {
            try {
                const examRef = doc(db, `Exams/${categoryId}/Classes/${classId}/Exams/${examId}`);
                const examSnap = await getDoc(examRef);
                
                if (examSnap.exists()) {
                    setExam(examSnap.data());
                    
                    const sectionsRef = collection(db, `Exams/${categoryId}/Classes/${classId}/Exams/${examId}/Sections`);
                    const sectionsSnapshot = await getDocs(sectionsRef);
                    
                    const sectionsWithQuestions = await Promise.all(
                        sectionsSnapshot.docs.map(async (sectionDoc) => {
                            const questionsRef = collection(
                                db, 
                                `Exams/${categoryId}/Classes/${classId}/Exams/${examId}/Sections/${sectionDoc.id}/Questions`
                            );
                            const questionsSnapshot = await getDocs(questionsRef);
                            
                            return {
                                id: sectionDoc.id,
                                name: sectionDoc.data().name || sectionDoc.id,
                                questionCount: questionsSnapshot.size
                            };
                        })
                    );
                    
                    setSections(sectionsWithQuestions);
                } else {
                    console.error("İmtahan bulunamadı.");
                }
            } catch (error) {
                console.error("Veri alınırken hata:", error);
            }
        };

        const fetchComments = async () => {
            try {
                const commentsRef = collection(db, `Exams/${categoryId}/Classes/${classId}/Exams/${examId}/Comments`);
                const commentsSnapshot = await getDocs(commentsRef);
                const commentsList = commentsSnapshot.docs.map(doc => doc.data());
                setComments(commentsList);

                if (commentsList.length > 0) {
                    const totalRating = commentsList.reduce((acc, comment) => acc + comment.rating, 0);
                    setAverageRating(totalRating / commentsList.length);
                }
            } catch (error) {
                console.error("Yorumlar alınırken hata:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExamDetails();
        fetchComments();
    }, [categoryId, classId, examId]);

    const formatDate = (timestamp) => {
        if (typeof timestamp === "string") {
            const date = new Date(timestamp);
            return date.toLocaleDateString("tr-TR");
        }
        if (timestamp?.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleDateString("tr-TR");
        }
        return "Bilinmiyor";
    };

    const handleStartExam = () => {
        if (!user) {
            navigate("/register");
            return;
        }
    
        if (exam?.price && exam.price > 0) {
            navigate(`/payment?examId=${examId}&categoryId=${categoryId}&classId=${classId}&price=${exam.price}`);
        } else {
            handleCompleteExam(examId, categoryId, classId);
            navigate(`/exam/${categoryId}/${classId}/${examId}/view`);
        }
    };

    const handleCouponChange = async (event) => {
        setCouponCode(event.target.value);
    };

    const checkCouponValidity = async () => {
        try {
            const couponRef = collection(db, "Coupons");
            const couponQuery = await getDocs(couponRef);
            const couponList = couponQuery.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
    
            const validCoupon = couponList.find(coupon => coupon.couponCode === couponCode);
    
            if (validCoupon) {
                if (validCoupon.usageLimit > 0) {
                    setIsCouponValid(true);
                    toast.success("Kupon geçerli!");
    
                    const couponDocRef = doc(db, "Coupons", validCoupon.id);
                    await updateDoc(couponDocRef, {
                        usageLimit: validCoupon.usageLimit - 1,
                    });
                    handleCompleteExam(examId, categoryId, classId); 
                    navigate(`/exam/${categoryId}/${classId}/${examId}/view`);
                } else {
                    setIsCouponValid(false);
                    toast.error("Kuponun istifadə müddəti bitib.");
                }
            } else {
                setIsCouponValid(false);
                toast.error("Yalnış kupon kodu!");
            }
        } catch (error) {
            console.error("Kupon kontrolü yapılırken hata:", error);
            toast.error("Bir hata oluştu, lütfen tekrar deneyin.");
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} />
            
            {/* Hero Section */}
            <div className=" bg-gradient-to-r from-indigo-600 to-purple-600 text-white  md:py-16">
                <div className="max-w-6xl mx-auto ">
                    <div 
                        
                        className="flex flex-col md:flex-row items-center justify-between gap-8"
                    >
                        <div className="bg-white rounded-xl h-44 p-6 w-full md:w-1/3 flex items-center justify-center shadow-lg border border-white/20">
                            <h2 className="text-4xl text-blue-700 font-bold">{examId.split(' ')[0]}</h2>
                        </div>
                        
                      <div className="text-center md:text-left w-full md:w-2/3 space-y-4">
  <AnimatePresence>
    {exam ? (
      <>
        <motion.h1 
          className="text-3xl md:text-4xl font-bold leading-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {exam.title}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {exam.description || "Açıqlama yoxdur."}
        </motion.p>
      </>
    ) : (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
      >
        <div className="h-12 w-full bg-gray-700/50 rounded-lg" />
        <div className="h-6 w-4/5 bg-gray-700/50 rounded-lg" />
        <div className="h-6 w-3/4 bg-gray-700/50 rounded-lg" />
      </motion.div>
    )}
  </AnimatePresence>

  {exam?.isCertified && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-4"
    >
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2 text-sm font-medium cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <span className="mr-2">RƏQƏMSAL SERTİFİKAT QAZAN</span>
        <AiOutlineInfoCircle className="text-white" size={18} />
      </motion.div>
    </motion.div>
  )}
</div>
                    </div>
                    
                    
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto  py-8">
                {/* Start Exam Button */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-12"
                >
                    <button
                        onClick={handleStartExam}
                        className="relative overflow-hidden group px-8 py-4 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 "
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                            <span className="text-lg">İmtahana Başla</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </button>
                </motion.div>

                {/* Coupon Section */}
                {exam?.price > 0 && (
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Kupon Kodunu İstifadə Et</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={handleCouponChange}
                                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent"
                                placeholder="Kupon Kodu daxil edin"
                            />
                            <button
                                onClick={checkCouponValidity}
                                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                            >
                                Təsdiqlə
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Exam Composition Section */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-12"
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">İmtahan Tərkibi</h3>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <Skeleton height={24} width="70%" className="mb-3" />
                                    <Skeleton height={20} width="40%" />
                                </div>
                            ))}
                        </div>
                    ) : sections.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {sections.map((section, index) => (
                                <div 
                                    key={index}
                                    
                                    className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                                {section.name}
                                            </h4>
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                {section.questionCount} sual
                                            </span>
                                        </div>
                                        <div className="bg-blue-500/10 p-2 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                            <p className="text-gray-500">İmtahan tərkibi məlumatı yoxdur.</p>
                        </div>
                    )}
                </motion.div>

                {/* Exam Details Cards */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
                >
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">İmtahan Tarixi</h3>
                        </div>
                        {loading ? (
                            <Skeleton height={24} width="60%" />
                        ) : (
                            <p className="text-gray-600">
                                {exam?.examDate ? formatDate(exam.examDate) : "İstənilən Vaxt"}
                            </p>
                        )}
                    </motion.div>

                    <motion.div 
                        variants={itemVariants}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Yaradılma Tarixi</h3>
                        </div>
                        {loading ? (
                            <Skeleton height={24} width="60%" />
                        ) : (
                            <p className="text-gray-600">{formatDate(exam?.createdAt)}</p>
                        )}
                    </motion.div>

                    <motion.div 
                        variants={itemVariants}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Müddət</h3>
                        </div>
                        {loading ? (
                            <Skeleton height={24} width="60%" />
                        ) : (
                            <p className="text-gray-600">
                                {(() => {
                                    const totalMinutes = exam?.examDuration || 0;
                                    const hours = Math.floor(totalMinutes / 60);
                                    const minutes = totalMinutes % 60;

                                    if (hours > 0 && minutes > 0) {
                                        return `${hours} saat ${minutes} dəqiqə`;
                                    } else if (hours > 0) {
                                        return `${hours} saat`;
                                    } else {
                                        return `${minutes} dəqiqə`;
                                    }
                                })()}
                            </p>
                        )}
                    </motion.div>

                    <motion.div 
                        variants={itemVariants}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Qiymət</h3>
                        </div>
                        {loading ? (
                            <Skeleton height={24} width="60%" />
                        ) : (
                            <p className={`text-lg font-medium ${exam?.price ? "text-gray-800" : "text-green-600"}`}>
                                {exam?.price ? `${exam.price} AZN` : "Pulsuz"}
                            </p>
                        )}
                    </motion.div>
                </motion.div>

                {/* Reviews Section */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-800">Rəylər</h3>
                        {comments.length > 0 && (
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            size={18}
                                            className={averageRating >= star ? "text-yellow-400" : "text-gray-300"}
                                        />
                                    ))}
                                </div>
                                <span className="font-medium text-gray-700">
                                    {averageRating.toFixed(1)} ({comments.length} rəy)
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Rating Summary */}
                    {!loading && comments.length > 0 && (
                        <motion.div 
                            variants={itemVariants}
                            className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            <h4 className="font-medium text-gray-700 mb-4">Reyting Statistikası</h4>
                            <div className="space-y-3">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = comments.filter(c => c.rating === star).length;
                                    const percentage = comments.length > 0 ? (count / comments.length) * 100 : 0;
                                    
                                    return (
                                        <div key={star} className="flex items-center">
                                            <span className="w-10 text-sm font-medium text-gray-600">{star} ★</span>
                                            <div className="flex-1 bg-gray-200 h-2.5 mx-3 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full" 
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium w-12 text-right text-gray-600">
                                              {Math.round(percentage)}%
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Review Cards */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg animate-pulse">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                                        <div>
                                            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-3 w-16 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : comments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {comments
                                .filter(comment => comment.comment && comment.rating)
                                .map((comment, index) => (
                                    <motion.div 
                                        key={index}
                                        variants={itemVariants}
                                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-3">
                                                {comment.Username?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{comment.Username || "İstifadəçi"}</p>
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            size={14}
                                                            className={i < comment.rating ? "text-yellow-400" : "text-gray-300"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mb-3">{comment.comment}</p>
                                        <p className="text-xs text-gray-400">
                                            {comment.createdAt && formatDateRelative(comment.createdAt)}
                                        </p>
                                    </motion.div>
                                ))}
                        </div>
                    ) : (
                        <motion.div 
                            variants={itemVariants}
                            className="text-center py-10"
                        >
                            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FaStar className="text-gray-400 text-2xl" />
                            </div>
                            <h4 className="text-xl font-medium text-gray-600 mb-2">Hələ rəy yoxdur</h4>
                            <p className="text-gray-500">İlk rəy yazan siz olun</p>
                        </motion.div>
                    )}
                </motion.div>
            </main>

            {/* Certificate Modal */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl"
                    >
                        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Rəqəmsal Sertifikat</h3>
                        <p className="text-gray-600 mb-6">
                            İmtahanı uğurla tamamladıqdan sonra (80% və ya daha yüksək nəticə ilə), sizin profilinizə avtomatik olaraq rəqəmsal sertifikat əlavə olunur. Sertifikatı PDF formatında yükləyə və paylaşa bilərsiniz.
                        </p>
                        <div className="flex justify-center">
                            <button 
                                onClick={() => setOpen(false)} 
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Bağla
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ExamDetailsPage;