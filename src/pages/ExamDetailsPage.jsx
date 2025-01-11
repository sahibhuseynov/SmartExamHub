import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from './../components/Navbar';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaStar } from "react-icons/fa"; // Yıldız ikonunu ekliyoruz
import certificationIcon from '../assets/certificatIcon.png'; // Sertifika ikonu
import { handleCompleteExam } from "../services/firebaseService"; // Firebase servisi
import { motion } from 'framer-motion';

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
        handleCompleteExam(examId, categoryId, classId);  // İmtahan tamamlanmış olarak işaretle
        navigate(`/exam/${categoryId}/${classId}/${examId}/view`);
    };

    return (
        <div>
            <Navbar />

            {/* ✅ Header Bölümü (İmtahana Başla Butonu Burada) */}
            <div className="bg-gradient-to-b from-teal-500 to-blue-600 text-white p-8 text-center h-[300px] flex justify-center items-center relative">
               

                <div className="max-w-6xl grid grid-cols-3 gap-8 w-full">
                    <div className="bg-white relative text-blue-700 w-full h-44 rounded-lg text-center flex items-center justify-center col-span-1">
                        <h2 className="text-4xl font-bold">{examId}</h2>
                     {/* Sertifika İkonu */} 
{exam?.isCertified && (
  <motion.img
    src={certificationIcon}
    alt="Sertifika"
    className="absolute -top-8 -left-12 w-32 h-32"
    initial={{ opacity: 0, scale: 0.8 }}  // Başlangıç durumu: Opaklık 0, küçük boyut
    animate={{ opacity: 1, scale: 1 }}  // Animasyon: Opaklık 1, normal boyut
    transition={{ 
      duration: 0.6,   // Animasyon süresi
      type: "spring",  // Sıçrama efekti
      stiffness: 100,  // Sertlik (sıçramanın gücü)
      damping: 10,     // Damping (sıçramanın yumuşaklığı)
    }}
  />
)}
                    </div>
                    
                    <div className="text-center flex justify-center items-center col-span-2">
                        
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-lg font-semibold"> {exam?.isCertified && (
                              <h2 className="font-bold text-2xl">RƏQƏMSAL SERTİFİKAT qazan!</h2>
                            )}{exam?.description || "Açıklama yok."}</p>
                        )}
                        
                    </div>
                    
                </div>

                {/* ✅ İmtahanın Yıldız Puanı ve Ortalama Puan */}
                <div className="absolute top-8 right-8 flex items-center space-x-2">
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

                {/* ✅ İmtahana Başla Butonu */}
                <button
                    onClick={handleStartExam}
                    className="absolute bottom-8 px-8 py-4 bg-green-500 text-white text-xl font-semibold rounded-lg hover:bg-green-600 transition duration-300"
                >
                    İmtahana Başla 🚀
                </button>
            </div>

            {/* Detaylar Bölümü */}
            <div className="max-w-6xl mx-auto p-8 space-y-8">
                <div className="flex justify-between">
                    <div className="p-6 text-black text-center">
                        <h3 className="text-2xl font-bold mb-4">📅 İmtahan Tarihi</h3>
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-xl">{formatDate(exam?.examDate)}</p>
                        )}
                    </div>

                    <div className="p-6 text-black text-center">
                        <h3 className="text-2xl font-bold mb-4">📆 Yaratılma Tarihi</h3>
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-xl">{formatDate(exam?.createdAt)}</p>
                        )}
                    </div>

                    <div className="p-6 text-black text-center">
                        <h3 className="text-2xl font-bold mb-4">💰 Fiyat</h3>
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-xl">{exam?.price ? `${exam.price} AZN` : "Gösterilmedi"}</p>
                        )}
                    </div>
                </div>

                {/* 💬 Yorumlar */}
                <div className="p-6 bg-white  text-black mt-8">
                    <h3 className="text-2xl font-bold mb-4">💬 Yorumlar</h3>

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
                                        <p><strong>{comment.userName}:</strong></p>
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
