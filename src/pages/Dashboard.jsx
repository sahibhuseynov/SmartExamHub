  import { useEffect, useState } from "react";
  import Navbar from "../components/Navbar";
  import Slider from "../components/dashboard/Slider";
  import ChatWithUs from "../components/ChatWithUs";
  import { collection, getDocs,getDoc, doc, updateDoc } from "firebase/firestore";
  import {  db } from "../firebase/config";
  import { useNavigate } from "react-router-dom";
  import Skeleton from "react-loading-skeleton";
  import "react-loading-skeleton/dist/skeleton.css";
  import { useDispatch, useSelector } from "react-redux";
  import { setCategories, updateCategoryDescription } from "../redux/categorySlice";
  import { setClasses } from "../redux/classSlice";
  // import CompletedExams from "../components/dashboard/CompletedExams";
  import TopRating from './../components/dashboard/TopRating';
  import CongratulationModal from "../components/dashboard/CongratulationModal"; // Modalı dahil ediyoruz
  import LatestExams from "../components/dashboard/LatestExams";
  import { useMemo } from "react";
  import { lazy, Suspense } from "react";
  import ChatBot from "../components/ChatBot";
  const Footer = lazy(() => import("../components/Footer"));
  const LatestBlogs = lazy(() => import("../components/dashboard/LatestBlogs"));
  const TopUsersLeaderboard = lazy(() => import("../components/dashboard/TopUsersLeaderboard"));


  const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categories = useSelector((state) => state.categories.categories);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // Modal durumu
    const userId = useSelector((state) => state.user.user?.uid); // Kullanıcı ID'sini alıyoruz
    const categoryList = useMemo(() => (
      categories.map((category) => (
        <li
          key={category.id}
          className="p-4 bg-blue-500 text-white shadow-md rounded-lg text-center cursor-pointer hover:bg-blue-600 transition duration-300 w-40 h-14 flex items-center justify-center"
          onClick={() => handleExamClick(category.id, category.id)}
        >
          {category.id}
        </li>
      ))
    ), [categories]);
    useEffect(() => {
      
      const fetchCategoriesAndClasses = async () => {
        if (categories.length > 0) {
          setLoading(false);
          return;
        }
      
        try {
          const categoriesSnapshot = await getDocs(collection(db, "Exams"));
          const categoriesData = categoriesSnapshot.docs.map((doc) => ({
            id: doc.id,
            description: doc.data().description || "Açıklama bulunmamaktadır.",
          }));
      
          dispatch(setCategories(categoriesData));
      
          // Paralel class sorguları
          const classPromises = categoriesData.map(async (category) => {
            const classesSnapshot = await getDocs(
              collection(db, `Exams/${category.id}/Classes`)
            );
      
            const classesData = classesSnapshot.docs.map((doc) => ({
              id: doc.id,
              categoryId: category.id,
              ...doc.data(),
            }));
      
            // Redux-a description güncellemesi
            dispatch(
              updateCategoryDescription({
                categoryId: category.id,
                description: category.description,
              })
            );
      
            return classesData;
          });
      
          const allClassesNested = await Promise.all(classPromises);
          const allClasses = allClassesNested.flat();
          dispatch(setClasses(allClasses));
        } catch (error) {
          console.error("Veri yüklenirken hata oluştu:", error);
        } finally {
          setLoading(false);
        }
      };
      

      fetchCategoriesAndClasses();
    }, [dispatch, categories.length]);

    // Kullanıcıyı kontrol et ve "Başlanğıc" rozetini ver
  useEffect(() => {
    const checkAndSetBadge = async () => {
      if (!userId) return; // Kullanıcı ID'si yoksa işlem yapma

      // Kullanıcı belgesini alıyoruz
      const userDocRef = doc(db, "Users", userId);

      try {
        const userSnapshot = await getDoc(userDocRef); // Kullanıcı belgesini al

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
        
          // Modal sadece hasStarterBadge false olduğunda açılacak ve rozet eklenirken tekrar güncellenmeyecek
          if (!userData.hasStarterBadge) {
            setShowModal(true); // Modalı aç
            await updateDoc(userDocRef, { hasStarterBadge: true }); // Rozeti ekle
          }
        }
      } catch (error) {
        console.error("Kullanıcı verisi alınırken hata oluştu: ", error.message);
      }
    };

    checkAndSetBadge(); // Fonksiyonu çağır
  }, [userId]);



    const handleExamClick = (examId, categoryId) => {
      navigate(`/${categoryId}/${examId}`);
    };

    return (
      <div className="bg-gray-50">
        <ChatBot/>
        {/* <ChatWithUs /> */}
        <Navbar />
        <Slider />
        <div className="p-6 flex flex-col items-center max-w-6xl mx-auto">
          <h2 className="text-2xl text-slate-800 font-bold mb-4">İmtahan Kateqoriyaları</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loading ? (
    [...Array(4)].map((_, index) => (
      <li
        key={index}
        className="p-4 shadow-lg rounded-lg w-40 h-14 flex items-center justify-center"
      >
        <Skeleton width="100%" height="100%" className="rounded-lg" />
      </li>
    ))
  ) : (
    categoryList // Burada artıq `map()` işləməyəcək, `useMemo` sayəsində cache-dən götürüləcək
  )}
          </ul>
        </div>

        <div className="max-w-6xl mx-auto mb-12">
          <TopRating />
        
          <LatestExams />
          
          {/* <CompletedExams /> */}
          <Suspense fallback={<div>Loading...</div>}>
            <TopUsersLeaderboard />
            <LatestBlogs />
          </Suspense>
        </div>
        
        <Suspense fallback={<div>Loading...</div>}>
          <Footer />
        </Suspense>

        {/* Tebrik modalını ekliyoruz */}
        <CongratulationModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
    );
  };

  export default Dashboard;
