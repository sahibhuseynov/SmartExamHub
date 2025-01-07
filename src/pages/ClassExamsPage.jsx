import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from './../components/Navbar';

const ClassExamsPage = () => {
    const { categoryId, classId } = useParams();  
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const examsRef = collection(db, `Exams/${categoryId}/Classes/${classId}/Exams`);
                const querySnapshot = await getDocs(examsRef);
                const examsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setExams(examsData);
            } catch (error) {
                console.error("Sınavlar alınırken bir hata oluştu: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [categoryId, classId]);

    const handleExamClick = (examId) => {
        navigate(`/category/${categoryId}/class/${classId}/exam/${examId}/details`);
    };

    return (
        <div className="bg-gradient-to-b from-orange-500 to-yellow-500 min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6 text-white">{classId} İçindeki Sınavlar</h2>
                {loading ? (
                    <p>Yükleniyor...</p>
                ) : (
                    <div className="grid grid-cols-3 gap-6">
                        {exams.length > 0 ? (
                            exams.map(exam => (
                                <div 
                                    key={exam.id} 
                                    className="bg-white shadow-lg p-6 rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-100 transition-all"
                                    onClick={() => handleExamClick(exam.id)}
                                >
                                    <h3 className="text-xl font-semibold mb-4">{exam.id}</h3>
                                    <p>{exam.description || "Açıklama bulunmamaktadır."}</p>
                                    <p className="text-lg font-semibold text-green-600 mt-4">
                                        Fiyat: {exam.price ? `${exam.price} AZN` : "Belirtilmemiş"}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>Bu sınıfta henüz sınav bulunmamaktadır.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassExamsPage;
