import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Slider from "../components/dashboard/Slider";
import ChatWithUs from "../components/ChatWithUs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import { setCategories, updateCategoryDescription } from "../redux/categorySlice";
import { setClasses } from "../redux/classSlice";
import CompletedExams from "../components/dashboard/CompletedExams";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.categories.categories);
  const [loading, setLoading] = useState(categories.length === 0);

  useEffect(() => {
    const fetchCategoriesAndClasses = async () => {
      if (categories.length > 0) return;

      try {
        const categoriesSnapshot = await getDocs(collection(db, "Exams"));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          description: doc.data().description || "Açıklama bulunmamaktadır."
        }));

        dispatch(setCategories(categoriesData));

        const allClasses = [];
        for (const category of categoriesData) {
          const classesSnapshot = await getDocs(collection(db, `Exams/${category.id}/Classes`));
          const classesData = classesSnapshot.docs.map((doc) => ({
            id: doc.id,
            categoryId: category.id,
            ...doc.data(),
          }));
          allClasses.push(...classesData);

          dispatch(updateCategoryDescription({ 
            categoryId: category.id, 
            description: category.description 
          }));
        }

        dispatch(setClasses(allClasses));
      } catch (error) {
        console.error("Veri yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndClasses();
  }, [dispatch, categories.length]);

  const handleExamClick = (examId, categoryId) => {
    navigate(`/${categoryId}/${examId}`);
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
  [...Array(4)].map((_, index) => (
    <li
      key={index}
      className="p-4 bg-gradient-to-r from-blue-400 to-purple-600 text-white shadow-lg rounded-lg w-45 h-30 flex items-center justify-center"
    >
      <button className="w-3/4 p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all animate-pulse">
        <Skeleton width="100%" height="100%" className="rounded-lg" />
      </button>
    </li>
  ))
) : (
  categories.map((category) => (
    <li
      key={category.id}
      className="p-4 bg-blue-500 text-white shadow-md rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300 w-45 h-30 flex items-center text-center justify-center"
      onClick={() => handleExamClick(category.id, category.id)}
    >
      {category.id}
    </li>
  ))
)}

        </ul>
      </div>
      <CompletedExams />
    </div>
  );
};

export default Dashboard;
