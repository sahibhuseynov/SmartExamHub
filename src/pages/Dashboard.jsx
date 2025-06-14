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
  const Footer = lazy(() => import("../components/Footer"));
  const LatestBlogs = lazy(() => import("../components/dashboard/LatestBlogs"));
  const TopUsersLeaderboard = lazy(() => import("../components/dashboard/TopUsersLeaderboard"));
import InstitutionShowcase from './../components/dashboard/InstitutionShowcase';
import { motion } from 'framer-motion';


  const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categories = useSelector((state) => state.categories.categories);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // Modal durumu
    const userId = useSelector((state) => state.user.user?.uid); // Kullanıcı ID'sini alıyoruz
    
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
            description: doc.data().description || "Açıqlama mövcud deyil.",
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
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
  hover: {
    y: -5,
    scale: 1.03,
    transition: { duration: 0.2 }
  }
};
    return (
      <div className="bg-gray-50">
        <div className="chatbot-container md:block hidden">
      <ChatWithUs />
  </div>
 
  {/* Show ChatWithUs for smaller screens */}
  <div className="chatwithus-container md:hidden block">
    <ChatWithUs />
  </div>
        <Navbar />
        <Slider />
        
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
  <div className="text-center mb-10">
    <h2 
      
      className="text-3xl font-bold text-gray-900 mb-3"
    >
      İmtahan Kateqoriyaları
    </h2>
    <p
      
      className="text-lg text-gray-600 max-w-2xl mx-auto"
    >
      İstədiyiniz kateqoriyanı seçərək imtahanlara başlaya bilərsiniz
    </p>
  </div>

  <motion.ul 
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5 w-full max-w-5xl mx-auto"
  >
    {loading ? (
      [...Array(4)].map((_, index) => (
        <motion.li 
          key={index}
          variants={itemVariants}
          className="h-20"
        >
          <div className="h-full bg-white rounded-xl shadow-sm overflow-hidden">
            <Skeleton width="100%" height="100%" className="rounded-xl" />
          </div>
        </motion.li>
      ))
    ) : (
      categories.map((category) => (
        <motion.li 
          key={category.id}
          variants={itemVariants}
          whileHover="hover"
        >
          <motion.button
            onClick={() => handleExamClick(category.id, category.id)}
            className="w-full h-20 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md flex items-center justify-center px-4"
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg font-medium text-gray-800 text-center line-clamp-2">
              {category.id}
            </span>
          </motion.button>
        </motion.li>
      ))
    )}
  </motion.ul>
</div>

        <div className="max-w-6xl mx-auto mb-12">
          <TopRating />
        
          <LatestExams />
          <InstitutionShowcase />
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
