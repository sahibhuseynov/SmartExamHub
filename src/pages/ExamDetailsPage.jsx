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
        // In the fetchExamDetails function:
const fetchExamDetails = async () => {
    try {
        const examRef = doc(db, `Exams/${categoryId}/Classes/${classId}/Exams/${examId}`);
        const examSnap = await getDoc(examRef);
        
        if (examSnap.exists()) {
            setExam(examSnap.data());
            
            // First get all sections under the exam
            const sectionsRef = collection(db, `Exams/${categoryId}/Classes/${classId}/Exams/${examId}/Sections`);
            const sectionsSnapshot = await getDocs(sectionsRef);
            
            // For each section, get its questions
            const sectionsWithQuestions = await Promise.all(
                sectionsSnapshot.docs.map(async (sectionDoc) => {
                    const questionsRef = collection(
                        db, 
                        `Exams/${categoryId}/Classes/${classId}/Exams/${examId}/Sections/${sectionDoc.id}/Questions`
                    );
                    const questionsSnapshot = await getDocs(questionsRef);
                    
                    return {
                        id: sectionDoc.id,
                        name: sectionDoc.data().name || sectionDoc.id, // Use section name or fallback to ID
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

    return (
        <div>
            <Navbar />
            <ToastContainer />
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-8 text-center h-auto md:h-[300px] flex justify-center items-center relative">
                <div className="max-w-6xl mt-10 md:mt-0 flex flex-col md:grid grid-cols-3 gap-8 w-full">
                    <div className="bg-white relative text-blue-700 w-full h-44 rounded-lg text-center flex items-center justify-center col-span-1">
                        <h2 className="text-4xl font-bold">{examId.split(' ')[0]}</h2>
                    </div>
                    <div className="text-center flex justify-center items-center col-span-2">
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-lg font-semibold"> {exam?.isCertified && (
                               <>
                                    <h2 className="font-bold text-2xl mb-2 flex-col items-center gap-2 sm:flex">
                                    İmtahan sonunda
                                    <span className="text-yellow-300 flex flex-col items-center gap-1 sm:flex-row">
                                      RƏQƏMSAL SERTİFİKAT QAZAN
                                      <button onClick={() => setOpen(true)}>
                                        <AiOutlineInfoCircle className="text-white ml-2 hover:scale-125 ease-in-out transition-all" size={25} />
                                      </button>
                                    </span>
                                  </h2>
                                  {open && (
                                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                                      <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-lg w-full transform transition-all ">
                                        <h3 className="font-semibold text-2xl text-center text-primary mb-4">Rəqəmsal Sertifikat Necə Qazanılır?</h3>
                                        <p className="text-lg text-gray-700 mb-6">
                                          İmtahanı uğurla tamamladıqdan sonra (80% və ya daha yüksək nəticə ilə), sizin profilinizə avtomatik olaraq rəqəmsal sertifikat əlavə olunur. Sertifikatı PDF formatında yükləyə və paylaşa bilərsiniz.
                                        </p>
                                        <div className="flex justify-center">
                                          <button 
                                            onClick={() => setOpen(false)} 
                                            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out"
                                          >
                                            Bağla
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                               </>
                            )}{exam?.description || "Açıklama yok."}</p>
                        )}
                    </div>
                </div>

                <div className="absolute top-4 md:top-3 md:right-8 flex items-center space-x-2">
                    <p className="text-lg font-semibold">Rating:</p>
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                size={20}
                                color={averageRating >= star ? "#FFD700" : "#D3D3D3"}
                            />
                        ))}
                    </div>
                    <p className="text-lg font-semibold ml-2">({averageRating.toFixed(1)} / 5)</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-8 space-y-8 bg-white">
                <div className="flex justify-center">
                    <button
                        onClick={handleStartExam}
                        className="text-xl w-48 h-16 rounded bg-emerald-500 text-white relative overflow-hidden group z-10 hover:text-white duration-1000"
                    >
                        <span className="absolute bg-emerald-600 w-52 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
                        <span className="absolute bg-emerald-800 w-52 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
                        İmtahana Başla
                    </button>
                </div>

                {/* Kupon Inputu */}
                {exam?.price > 0 && (
                    <div className="p-6 bg-white text-black mt-8">
                        <h3 className="text-2xl font-bold mb-4">Kupon Kodunu İstifadə Et</h3>
                        <input
                            type="text"
                            value={couponCode}
                            onChange={handleCouponChange}
                            className="border bg-white p-2 w-full mb-4"
                            placeholder="Kupon Kodu"
                        />
                        <button
                            onClick={checkCouponValidity}
                            className="bg-emerald-500 text-white p-3 w-full rounded"
                        >
                            Kuponu İstifadə Et
                        </button>
                    </div>
                )}

                {/* Exam Composition Section */}
                <div className="p-6 bg-white text-black mt-8">
                    <h3 className="text-2xl font-bold mb-6">İmtahan Tərkibi</h3>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-11 gap-4">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="p-4 border rounded-lg shadow-sm">
                                    <Skeleton height={20} width="70%" className="mb-2" />
                                    <Skeleton height={15} width="40%" />
                                </div>
                            ))}
                        </div>
                    ) : sections.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
    {sections.map((section, index) => (
        <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h4 className="text-lg font-semibold text-blue-700 mb-2">
                {section.name}
            </h4>
            <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {section.questionCount} sual
                </span>
            </div>
        </div>
    ))}
</div>
                    ) : (
                        <p className="text-gray-500">İmtahan tərkibi məlumatı yoxdur.</p>
                    )}
                </div>

                <div className=" px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <h3 className="text-2xl font-semibold mb-4">İmtahan Tarixi</h3>
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-xl">
                                {exam?.examDate ? formatDate(exam.examDate) : "İstənilən Vaxt"}
                            </p>
                        )}
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <h3 className="text-2xl font-semibold mb-4">Yaradılma Tarixi</h3>
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-xl">{formatDate(exam?.createdAt)}</p>
                        )}
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <h3 className="text-2xl font-semibold mb-4">Müddət</h3>
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-xl">
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
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <h3 className="text-2xl font-semibold mb-4">Qiymət</h3>
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-xl">{exam?.price ? `${exam.price} AZN` : <span className="text-green-500 font-semibold">Pulsuz</span> }</p>
                        )}
                    </div>
                </div>

                {/* 💬 Yorumlar */}
            <div className="p-6 bg-white rounded-xl shadow-sm mt-8">
    <h3 className="text-2xl font-bold mb-6 text-gray-800">Rəylər</h3>
    
    {/* Rating Summary - Only shows if reviews exist */}
    {!loading && comments.length > 0 && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Reyting Statistikası</h4>
            <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                    const count = comments.filter(c => c.rating === star).length;
                    const percentage = comments.length > 0 ? (count / comments.length) * 100 : 0;
                    
                    return (
                        <div key={star} className="flex items-center">
                            <span className="w-8 text-sm font-medium text-gray-600">{star} ★</span>
                            <div className="flex-1 bg-gray-200 h-2.5 mx-3 rounded-full overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            <span className="text-sm font-medium w-10 text-right text-gray-600">
                                {Math.round(percentage)}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    )}

    {/* Review Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
            [...Array(3)].map((_, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg animate-pulse">
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-3"></div>
                    <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 w-4 bg-gray-200 rounded-full mr-1"></div>
                        ))}
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                </div>
            ))
        ) : comments.length > 0 ? (
            comments
                .filter(comment => comment.comment && comment.rating)
                .map((comment, index) => (
                    <div key={index} className="bg-gray-50 hover:bg-gray-100 transition-colors p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-3">
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
                        <p className="text-gray-600 mb-2">{comment.comment}</p>
                        <p className="text-xs text-gray-400">
                            {comment.createdAt && formatDateRelative(comment.createdAt)}
                        </p>
                    </div>
                ))
        ) : (
            <div className="col-span-full text-center py-8">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <FaStar className="text-gray-400 text-xl" />
                </div>
                <h4 className="text-lg font-medium text-gray-600">Hələ rəy yoxdur</h4>
                <p className="text-gray-500">İlk rəy yazan siz olun</p>
            </div>
        )}
    </div>
</div>
            </div>
        </div>
    );
};

export default ExamDetailsPage;