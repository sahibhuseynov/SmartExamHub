import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../../firebase/config"; // Firebase auth
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CompletedExams = () => {
  const [completedExams, setCompletedExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedExams = async () => {
      const user = auth.currentUser; // Mevcut kullanıcıyı al
      if (!user) {
        console.error("Kullanıcı giriş yapmamış.");
        setLoading(false); // Kullanıcı giriş yapmamışsa loading false yap
        return;
      }

      try {
        const completedExamsRef = collection(db, `Users/${user.uid}/CompletedExams`);
        const completedExamsSnapshot = await getDocs(completedExamsRef);
        
        const exams = completedExamsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompletedExams(exams);
      } catch (error) {
        console.error("Veriler alınırken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedExams();
  }, []); // useEffect sadece ilk renderda çalışacak

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg text-black mt-8">
      <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">Son İmtahan Nəticələri</h3>
      
      {loading ? (
        <Skeleton count={3} height={50} />
      ) : completedExams.length === 0 ? (
        <p className="text-center text-gray-500">Henüz tamamlanmış bir sınavınız yok.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {completedExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex justify-between">
                <span className="font-semibold text-xl">{exam.examId}</span>
                <span className="text-gray-500">{new Date(exam.completedAt).toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="mt-2 text-gray-700">
                <span className="font-semibold">Kategori:</span> {exam.categoryId} / {exam.classId}
              </div>
              <div className="mt-4 text-center">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Detaylar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedExams;
