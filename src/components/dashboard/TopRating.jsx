import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTopExams, setLoading, selectTopExams } from "../../redux/topExamsSlice";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { FaStar, FaCertificate } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Slider from "react-slick"; // Import react-slick
import { MdArrowForwardIos, MdOutlineArrowBackIosNew } from "react-icons/md";


const TopRating = () => {
  const { topExams, loading } = useSelector(selectTopExams);
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
    const fetchTopExams = async () => {
      try {
        dispatch(setLoading(true));
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
        dispatch(setTopExams(examsData)); // Show top 4 exams
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if (topExams.length === 0) {
      fetchTopExams();
    } else {
      dispatch(setLoading(false)); // Set loading to false when data is fetched
    }
  }, [topExams, dispatch]);

  const goToExam = (categoryId, classId, examId) => {
    navigate(`/category/${categoryId}/class/${classId}/exam/${examId}/details`);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 2 cards at a time
    slidesToScroll: 1,
    centerMode: true, // Center the current slide
    nextArrow: <NextArrow/>, 
    prevArrow: <PrevArrow/>, 
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // Show 1 card at a time on smaller screens
          centerPadding: "10px", // Adjust space for mobile
        },
      },
    ],
  };

  return (
    <div className="p-8 mb-4 group">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Ən Sevilən</h2>

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
          topExams.map((exam, index) => (
            <div
              key={index}
              className="bg-white  !w-[95%]  shadow-md rounded-lg transform transition-all duration-300 relative"
              // Add margin to create space between slides
            >
              {exam?.isCertified && (
                <FaCertificate className="text-yellow-500 text-3xl absolute top-2 right-2" />
              )}

              <div className="p-6">
                <h3 className="line-clamp-1p text-xl font-semibold mb-2 text-black">{exam.id}</h3>
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
      </Slider>
      
    </div>
  );
};

export default TopRating;
