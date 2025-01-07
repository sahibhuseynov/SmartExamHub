import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from './../components/Navbar';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ExamDetailsPage = () => {
    const { categoryId, classId, examId } = useParams();  
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExamDetails = async () => {
            try {
                const examRef = doc(db, `Exams/${categoryId}/Classes/${classId}/Exams/${examId}`);
                const examSnap = await getDoc(examRef);
                
                if (examSnap.exists()) {
                    setExam(examSnap.data());
                } else {
                    console.error("Sınav bulunamadı.");
                }
            } catch (error) {
                console.error("Veriler alınırken hata:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExamDetails();
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
        navigate(`/exam/${categoryId}/${classId}/${examId}/view`);
    };

    return (
        <div>
            <Navbar />

            {/* ✅ Header Bölümü (Sınava Başla Butonu Burada) */}
            <div className="bg-gradient-to-b from-teal-500 to-blue-600 text-white p-8 text-center h-[300px] flex justify-center items-center relative">
                <div className="max-w-6xl grid grid-cols-3 gap-8 w-full">
                    <div className="bg-white text-blue-700 w-full h-44 rounded-lg text-center flex items-center justify-center col-span-1">
                        <h2 className="text-4xl font-bold">{examId}</h2>
                    </div>
                    <div className="text-center flex justify-center items-center col-span-2">
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-lg font-semibold">{exam?.description || "Açıklama bulunmamaktadır."}</p>
                        )}
                    </div>
                </div>

                {/* ✅ Sınava Başla Butonu */}
                <button
                    onClick={handleStartExam}
                    className="absolute bottom-8 px-8 py-4 bg-green-500 text-white text-xl font-semibold rounded-lg hover:bg-green-600 transition duration-300"
                >
                    Sınava Başla 🚀
                </button>
            </div>

            {/* Detaylar Bölümü */}
            <div className="max-w-6xl mx-auto p-8 space-y-8">
                <div className="flex justify-between">
                    <div className="p-6 text-black text-center">
                        <h3 className="text-2xl font-bold mb-4">📅 Sınav Tarihi</h3>
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" />
                        ) : (
                            <p className="text-xl">{formatDate(exam?.examDate)}</p>
                        )}
                    </div>

                    <div className="p-6 text-black text-center">
                        <h3 className="text-2xl font-bold mb-4">📆 Oluşturulma Tarihi</h3>
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
                            <p className="text-xl">{exam?.price ? `${exam.price} AZN` : "Belirtilmemiş"}</p>
                        )}
                    </div>
                </div>

                {/* 💬 Yorumlar */}
                <div className="p-6 bg-white shadow-lg rounded-lg text-black mt-8">
                    <h3 className="text-2xl font-bold mb-4">💬 Yorumlar</h3>
                    {loading ? (
                        <Skeleton count={3} height={30} />
                    ) : (
                        <>
                            <p><strong>Ahmet:</strong> Çok başarılı bir sınav.</p>
                            <p><strong>Elif:</strong> Sorular çok kaliteli.</p>
                            <p><strong>Murat:</strong> Tavsiye ederim!</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamDetailsPage;
