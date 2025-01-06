import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import ChatWithUs from "../components/ChatWithUs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [exams, setExams] = useState([]);
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
      }
    };

    fetchExams();
  }, []);

  const handleExamClick = (examId, categoryId) => {
    navigate(`/exams/${categoryId}/${examId}`); // Kategoriyi de yönlendirmeye dahil ettik
  };

  return (
    <div className="bg-blue-300 min-h-screen">
      <ChatWithUs />
      <Navbar />
      <Slider />

      <div className="p-6 flex flex-col items-center max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">İmtahan Kateqoriyaları</h2>
        <ul className="flex gap-4">
          {exams.map((exam) => (
            <li
              key={exam.id}
              className="p-4 bg-white shadow-md rounded cursor-pointer hover:bg-blue-500 hover:text-white transition duration-300"
              onClick={() => handleExamClick(exam.id, exam.categoryId)} // Kategori ID'si ile yönlendirme
            >
              {exam.categoryId}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;