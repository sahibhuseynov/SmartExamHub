import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from './../components/Navbar';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ExamsPage = () => {
    const { categoryId } = useParams();  
    const [classes, setClasses] = useState([]);
    const [description, setDescription] = useState("");  
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();  

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const categoryRef = doc(db, "Exams", categoryId);
                const categorySnap = await getDoc(categoryRef);
                
                if (categorySnap.exists()) {
                    setDescription(categorySnap.data().description || "Açıklama bulunmamaktadır.");
                } else {
                    setDescription("Kategori bulunamadı.");
                }

                const categoryClassesRef = collection(db, `Exams/${categoryId}/Classes`);
                const querySnapshot = await getDocs(categoryClassesRef);
                const classesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setClasses(classesData);
            } catch (error) {
                console.error("Veriler alınırken bir hata oluştu: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [categoryId]);

    const handleClassClick = (classId) => {
        navigate(`/category/${categoryId}/class/${classId}`);
    };

    return (
        <div>
            <Navbar />
            {/* ✅ Ortalanma için flex ve justify-center eklendi */}
            <div className="bg-gradient-to-b from-violet-700 to-indigo-600 text-white p-6 h-[300px] flex justify-center items-center">
                <div className="max-w-6xl grid grid-cols-3 gap-8 w-full">
                    <div className="bg-white text-blue-700 w-full h-44 rounded-lg text-center flex items-center justify-center col-span-1">
                        <h2 className="text-4xl font-bold">{categoryId}</h2>
                    </div>
                    <div className="text-center flex justify-center items-center col-span-2">
                        {loading ? (
                            <Skeleton count={1} height={30} width="50%" className="mx-auto" />
                        ) : (
                            <p className="text-lg font-semibold">{description}</p>  
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6">
                {loading ? (
                    <div className="flex flex-wrap gap-4 justify-center">
                        {[...Array(3)].map((_, index) => (
                            <Skeleton key={index} height={40} width={150} className="rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4 justify-center">
                        {classes.length > 0 ? (
                            classes.map(cls => (
                                <button
                                    key={cls.id}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
                                    onClick={() => handleClassClick(cls.id)}  
                                >
                                    {cls.id}
                                </button>
                            ))
                        ) : (
                            <p>Bu kategoride henüz sınıf bulunmamaktadır.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamsPage;
