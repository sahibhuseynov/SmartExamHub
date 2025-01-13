import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { FaStar, FaCertificate } from "react-icons/fa"; // Sertifika ikonu
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TopRating = () => {
  const [topExams, setTopExams] = useState([]);
  const [loading, setLoading] = useState(true); // Veri yükleniyor durumu
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopExams = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "Exams"));
        const examsData = [];

        for (const categoryDoc of categoriesSnapshot.docs) {
          const classesSnapshot = await getDocs(collection(categoryDoc.ref, "Classes"));

          for (const classDoc of classesSnapshot.docs) {
            const examsSnapshot = await getDocs(collection(classDoc.ref, "Exams"));

            examsSnapshot.forEach((examDoc) => {
              const examData = examDoc.data();
              if (examData.averageRating) {
                examsData.push({
                  ...examData,
                  id: examDoc.id,
                  classId: classDoc.id,
                  categoryId: categoryDoc.id,
                });
              }
            });
          }
        }

        examsData.sort((a, b) => b.averageRating - a.averageRating);
        setTopExams(examsData.slice(0, 4)); // En iyi 4 sınavı göster
        setLoading(false); // Veriler yüklendiği için loading durumunu false yap
      } catch (error) {
        console.error("Veri yüklenirken hata oluştu:", error);
        setLoading(false); // Hata durumunda da loading durumu false yapılır
      }
    };

    fetchTopExams();
  }, []);

  const goToExam = (categoryId, classId, examId) => {
    navigate(`/category/${categoryId}/class/${classId}/exam/${examId}/details`);
  };

  return (
    <div className="p-8 mb-4">
      {/* Başlık her zaman görünecek */}
      <h2 className="text-3xl font-bold  mb-6">Ən Sevilən</h2>

      {/* Eğer veriler yükleniyorsa skeleton gösterilecek */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <div className="p-6">
                <Skeleton width="100%" height={30} className="mb-4" /> {/* Başlık Skeleton */}
                <Skeleton width="60%" height={20} className="mb-4" /> {/* Alt Başlık Skeleton */}
                <div className="flex items-center mb-4">
                  <Skeleton circle width={24} height={24} className="mr-2" /> {/* Yıldız Iconu Skeleton */}
                  <Skeleton width="40%" height={20} /> {/* Rating Skeleton */}
                </div>
                <Skeleton width="100%" height={40} className="rounded-lg" /> {/* Button Skeleton */}
              </div>
            </div>
          ))
        ) : (
          // Veriler yüklendiyse normal kartlar gösterilecek
          topExams.map((exam, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg transform hover:scale-105 transition-all duration-300 relative"
            >
              {/* Sertifika İkonu */}
              {exam?.isCertified && (
                <FaCertificate className="text-yellow-500 text-4xl absolute top-2 right-2" />
              )}

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-black">{exam.id}</h3>
                <p className="text-gray-500 mb-4">{exam.categoryId} / {exam.classId}</p>
                <div className="flex items-center mb-4">
                  <FaStar className="text-yellow-400 mr-2" />
                  <span className="text-gray-700 font-medium">{exam.averageRating.toFixed(2)} / 5</span>
                </div>

                <button
                  onClick={() => goToExam(exam.categoryId, exam.classId, exam.id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  İmtahana Bax
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopRating;
