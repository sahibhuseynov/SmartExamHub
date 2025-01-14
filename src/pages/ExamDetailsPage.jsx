import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from './../components/Navbar';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaStar } from "react-icons/fa"; // Yıldız ikonunu ekliyoruz
import { handleCompleteExam } from "../services/firebaseService"; // Firebase servisi

const ExamDetailsPage = () => {
    const { categoryId, classId, examId } = useParams();
    const [exam, setExam] = useState(null);
    const [comments, setComments] = useState([]); // Yorumlar durumu
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0); // Ortalama puan
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExamDetails = async () => {
            try {
                const examRef = doc(db, `Exams/${categoryId}/Classes/${classId}/Exams/${examId}`);
                const examSnap = await getDoc(examRef);

                if (examSnap.exists()) {
                    setExam(examSnap.data());
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

                // Ortalama puanı hesaplama
                if (commentsList.length > 0) {
                    const totalRating = commentsList.reduce((acc, comment) => acc + comment.rating, 0);
                    setAverageRating(totalRating / commentsList.length); // Ortalama hesaplama
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
        if (exam?.price && exam.price > 0) {
            navigate(`/payment?examId=${examId}&categoryId=${categoryId}&classId=${classId}&price=${exam.price}`);
        } else {
            handleCompleteExam(examId, categoryId, classId);  // İmtahan tamamlanmış olaraq işarətlənir
            navigate(`/exam/${categoryId}/${classId}/${examId}/view`);
        }
    };

    return (
        <div>
            <Navbar />

            {/* ✅ Header Bölümü (İmtahana Başla Butonu Burada) */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-8 text-center h-[450px] md:h-[300px] flex justify-center items-center relative">
               

                <div className="max-w-6xl  flex flex-col md:grid grid-cols-3 gap-8 w-full">
                    <div className="bg-white relative text-blue-700 w-full h-44 rounded-lg text-center flex items-center justify-center col-span-1">
                        <h2 className="text-4xl font-bold">{examId}</h2>
                     
                    </div>
                    
                    <div className="text-center flex justify-center items-center col-span-2">
                        
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-lg font-semibold"> {exam?.isCertified && (
                              <h2 className="font-bold text-2xl mb-2">İmtahan sonunda <span className="text-yellow-300">RƏQƏMSAL SERTİFİKAT</span> qazan!</h2>
                            )}{exam?.description || "Açıklama yok."}</p>
                        )}
                        
                    </div>
                    
                </div>

                {/* ✅ İmtahanın Yıldız Puanı ve Ortalama Puan */}
                <div className="absolute top-2 md:top-8 md:right-8 flex items-center space-x-2">
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

            {/* Detaylar Bölümü */}
            <div className="max-w-6xl mx-auto p-8 space-y-8">
                {/* ✅ İmtahana Başla Butonu */}
                <div className="flex justify-center">
                    <button
          onClick={handleStartExam}
          className="text-xl w-48 h-16 rounded bg-emerald-500 text-white relative  overflow-hidden group z-10 hover:text-white duration-1000"
        >
          <span className="absolute bg-emerald-600 w-52 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
          <span className="absolute bg-emerald-800 w-52 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
                            İmtahana Başla
        </button>
                </div>
                <div className="flex flex-wrap justify-between">
                    <div className="p-6 text-black text-center">
                        <img src="" alt="" />
                        <h3 className="text-2xl font-bold mb-4">İmtahan Tarixi</h3>
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-xl">{formatDate(exam?.examDate)}</p>
                        )}
                    </div>

                    <div className="p-6 text-black text-center">
                        <h3 className="text-2xl font-bold mb-4">Yaradılma Tarixi</h3>
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-xl">{formatDate(exam?.createdAt)}</p>
                        )}
                    </div>

                    <div className="p-6 text-black text-center">
                        
                        <h3 className="text-2xl font-bold mb-4">Qiymət</h3>
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-xl">{exam?.price ? `${exam.price} AZN` : "Gösterilmedi"}</p>
                        )}
                    </div>
                </div>

                {/* 💬 Yorumlar */}
                <div className="p-6 bg-white  text-black mt-8">
                    <h3 className="text-2xl font-bold mb-4">💬 Rəylər</h3>

                    {/* Yorumları 3 sütunlu grid içinde göstereceğiz */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            // Skeletonları grid içinde hizalayarak göstereceğiz
                            [...Array(3)].map((_, index) => (
                                <div key={index} className="p-4 border rounded-lg shadow-sm">
                                    <Skeleton height={100} width="100%" />
                                    <Skeleton height={20} width="80%" className="mt-4" />
                                    <Skeleton height={20} width="50%" className="mt-2" />
                                </div>
                            ))
                        ) : (
                            comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <div key={index} className="p-4 border rounded-lg shadow-sm">
                                        <p><strong>{comment.Username}</strong></p>
                                        <p>{comment.comment}</p>
                                        <div className="flex items-center space-x-1 mt-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    size={20}
                                                    color={comment.rating >= star ? "#FFD700" : "#D3D3D3"}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm mt-1">⭐ {comment.rating} / 5</p>
                                    </div>
                                ))
                            ) : (
                                <p>Henüz yorum yok.</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamDetailsPage;
