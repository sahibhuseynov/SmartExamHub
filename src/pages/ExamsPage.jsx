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
    const [loadingExams, setLoadingExams] = useState(false); // ✅ Yeni loading state
    const [selectedClass, setSelectedClass] = useState(null);
    const [exams, setExams] = useState([]);
    const navigate = useNavigate();  

    useEffect(() => {
        const fetchCategoryData = async () => {
            setLoading(true);
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
                if (classesData.length > 0) {
                    setSelectedClass(classesData[0].id);  
                }
            } catch (error) {
                console.error("Veriler alınırken bir hata oluştu: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [categoryId]);

    useEffect(() => {
        const fetchExams = async () => {
            if (!selectedClass) return;
            setLoadingExams(true); // ✅ Sadece sınavları yüklerken true
            try {
                const examsRef = collection(db, `Exams/${categoryId}/Classes/${selectedClass}/Exams`);
                const querySnapshot = await getDocs(examsRef);
                const examsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setExams(examsData);
            } catch (error) {
                console.error("Sınavlar yüklenirken hata oluştu: ", error);
            } finally {
                setLoadingExams(false); // ✅ Yükleme bitti
            }
        };

        fetchExams();
    }, [selectedClass, categoryId]);

    const handleClassClick = (classId) => {
        setSelectedClass(classId);  
    };

    const handleExamClick = (examId) => {
        navigate(`/category/${categoryId}/class/${selectedClass}/exam/${examId}/details`);
    };

    return (
        <div>
            <Navbar />
            {/* Başlık Alanı */}
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

            {/* ✅ Sınıf Butonları */}
            <div className="max-w-6xl mx-auto p-6 flex flex-wrap gap-4 justify-center">
                {loading ? (
                    <Skeleton count={3} height={40} width={150} />
                ) : (
                    classes.map(cls => (
                        <button
                            key={cls.id}
                            className={`px-6 py-3 rounded-lg transition-all ${
                                selectedClass === cls.id
                                    ? "bg-blue-700 text-white"
                                    : "bg-blue-500 text-white hover:bg-blue-700"
                            }`}
                            onClick={() => handleClassClick(cls.id)}
                        >
                            {cls.id}
                        </button>
                    ))
                )}
            </div>

            {/* ✅ Sınav Kartları */}
            <div className="max-w-6xl mx-auto p-6">
                {loadingExams ? (
                    <div className="flex flex-wrap gap-4 justify-center">
                        {[...Array(3)].map((_, index) => (
                            <Skeleton key={index} height={200} width={300} className="rounded-lg" />
                        ))}
                    </div>
                ) : (
                    exams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {exams.map(exam => (
                                <div
                                    key={exam.id}
                                    className="border border-gray-300 shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all"
                                    onClick={() => handleExamClick(exam.id)}
                                >
                                    <h3 className="text-xl font-bold">{exam.id}</h3>
                                    <p className="text-gray-600">{exam.description || "Açıklama yok."}</p>
                                    <p className="mt-2 text-lg font-semibold">
                                        {exam.price ? `${exam.price} AZN` : "Ücretsiz"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-lg">Bu sınıfta henüz sınav bulunmamaktadır.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default ExamsPage;
