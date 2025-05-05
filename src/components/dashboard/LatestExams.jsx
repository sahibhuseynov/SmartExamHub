import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLatestExams, setLoading, selectLatestExams } from "../../redux/latestExamsSlice";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { FaCertificate } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Slider from "react-slick"; // Import react-slick
import { MdArrowForwardIos, MdOutlineArrowBackIosNew } from "react-icons/md";

const LatestExams = () => {
  const { latestExams, loading } = useSelector(selectLatestExams);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const NextArrow = ({ onClick }) => (
    <div
      className="absolute top-2/4 -right-8 z-10 cursor-pointer text-black text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      onClick={onClick}
    >
      <MdArrowForwardIos />
    </div>
  );
  
  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute top-2/4 -left-8 z-10 cursor-pointer text-black text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      onClick={onClick}
    >
      <MdOutlineArrowBackIosNew />
    </div>
  );

  useEffect(() => {
    const fetchLatestExams = async () => {
      try {
        dispatch(setLoading(true));
        const categoriesSnapshot = await getDocs(collection(db, "Exams"));
        const examsData = [];

        for (const categoryDoc of categoriesSnapshot.docs) {
          const classesSnapshot = await getDocs(collection(categoryDoc.ref, "Classes"));

          for (const classDoc of classesSnapshot.docs) {
            const examsSnapshot = await getDocs(query(collection(classDoc.ref, "Exams"), orderBy("createdAt", "desc")));

            examsSnapshot.forEach((examDoc) => {
              const examData = examDoc.data();
              examsData.push({
                ...examData,
                id: examDoc.id,
                classId: classDoc.id,
                categoryId: categoryDoc.id,
                createdAt: examData.createdAt.toDate().toISOString(), // createdAt'ı ISO formatına çeviriyoruz
              });
            });
          }
        }

        dispatch(setLatestExams(examsData.slice(0, 4))); // En son 4 sınavı gösteriyoruz
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if (latestExams.length === 0) {
      fetchLatestExams();
    } else {
      dispatch(setLoading(false)); // Data geldiğinde loading'i false yapıyoruz
    }
  }, [latestExams, dispatch]);

  const goToExam = (categoryId, classId, examId) => {
    navigate(`/category/${categoryId}/class/${classId}/exam/${examId}/details`);
  };

  // Verileri sıralama (en son yüklenen ilk gelmeli)
  const sortedExams = [...latestExams].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // 3 kart birden gösterilecek
    slidesToScroll: 1,
    centerMode: true, // Ortalanmış şekilde göster
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // Küçük ekranlarda 1 kart gösterilecek
          centerPadding: "10px", // Mobile uygun padding
        },
      },
    ],
  };

  return (
    <div className="p-8 mb-4 group">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Son Yüklənənlər</h2>

      <Slider {...sliderSettings}>
        {loading ? (
          [...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white !w-[95%] shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <div className="p-6">
                <Skeleton width="100%" height={30} className="mb-4" />
                <Skeleton width="60%" height={20} className="mb-4" />
                <div className="flex items-center mb-4">
                  <Skeleton circle width={24} height={24} className="mr-2" />
                  <Skeleton width="40%" height={20} />
                </div>
                <Skeleton width="100%" height={40} className="rounded-lg" />
              </div>
            </div>
          ))
        ) : (
          sortedExams.map((exam, index) => (
            <div
              key={index}
              className="bg-white !w-[95%] shadow-md rounded-lg transform transition-all duration-300 relative"
            >
             

              <div className="p-6">
                <h3 className="line-clamp-1 text-xl font-semibold mb-2 text-black">{exam.id}</h3>
                <p className="text-gray-500 mb-4">{exam.categoryId} / {exam.classId}</p>
                <p className="text-gray-500 mb-4">{new Date(exam.createdAt).toLocaleString()}</p> {/* ISO formatındaki tarihi normal tarihe çeviriyoruz */}
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
      </Slider>
    </div>
  );
};

export default LatestExams;
