import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../../firebase/config"; // Firebase auth
import { IoCheckmarkDoneSharp } from "react-icons/io5";

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

        const exams = completedExamsSnapshot.docs.map((doc) => ({
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
    <div className="container mx-auto">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Son İmtahan Nəticələri</h3>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Loading spinner inside the grid */}
          <div className="flex justify-center items-center col-span-full">
            <span className="loading loading-spinner loading-lg text-gray-400"></span>
          </div>
        </div>
      ) : completedExams.length === 0 ? (
        <p className="text-center text-gray-500">Hələ tamamlanmış bir imtahanınız yoxdur.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-lg border-t-8 border-blue-500 px-4 py-5 flex flex-col justify-around shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold font-sans">{exam.examId}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(exam.completedAt).toLocaleDateString("az-AZ")}
                </span>
              </div>
              <div className="py-3">
                <p className="text-sm">
                  <span className="font-semibold">Kateqoriya:</span> {exam.categoryId} / {exam.classId}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <IoCheckmarkDoneSharp size={32} className="text-green-400" />
                <button className="btn btn-primary text-white  font-medium flex items-center ">
                 
                  Detallar
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
