import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import ChatWithUs from "../components/ChatWithUs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Dashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading durumu ekledik
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Exams"));
        const examsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExams(examsData);
      } catch (error) {
        console.error("Sınavlar yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);  // Veriler yüklendikten sonra loading durumunu false yapıyoruz
      }
    };

    fetchExams();
  }, []);

  const handleExamClick = (examId, categoryId) => {
    navigate(`/exams/${categoryId}/${examId}`); // Kategoriyi de yönlendirmeye dahil ettik
  };

  return (
    <div className="min-h-screen">
      <ChatWithUs />
      <Navbar />
      <Slider />

      <div className="p-6 flex flex-col items-center max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">İmtahan Kateqoriyaları</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loading ? (
            // Modern ve şık Skeleton'lar, 4 tane kategori olacak şekilde ayarladık
            [...Array(4)].map((_, index) => (
              <li key={index} className="p-4  bg-gradient-to-r from-blue-400 to-purple-600 text-white shadow-lg rounded-lg w-40 h-20">
                <Skeleton height={30} width="80%" className="mb-2 rounded-lg " />
                <Skeleton height={20} width="60%" className="rounded-lg" />
              </li>
            ))
          ) : (
            exams.map((exam) => (
              <li
                key={exam.id}
                className="p-4 bg-blue-500 text-white shadow-md rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300 w-40 h-20 flex items-center text-center justify-center"
                onClick={() => handleExamClick(exam.id, exam.categoryId)} // Kategori ID'si ile yönlendirme
              >
                {exam.categoryId}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
