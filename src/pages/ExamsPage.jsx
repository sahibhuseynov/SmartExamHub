import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from './../components/Navbar';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch, useSelector } from "react-redux";
import { setClasses } from "../redux/classSlice";
import { FaCertificate } from "react-icons/fa";

const ExamsPage = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const reduxClasses = useSelector((state) => state.classes.classes);
  const reduxCategoryDescription = useSelector((state) =>
    state.categories.categories.find(cls => cls.id === categoryId)?.description || ""
  );
  const [description, setDescription] = useState(reduxCategoryDescription);
  const [loading, setLoading] = useState(!reduxCategoryDescription);
  const [examsLoading, setExamsLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [exams, setExams] = useState([]);
  const [filter, setFilter] = useState("all"); // "all", "free", "paid"
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!reduxCategoryDescription) {
        setLoading(true);
        try {
          const categoryRef = doc(db, "Exams", categoryId);
          const categorySnap = await getDoc(categoryRef);
          if (categorySnap.exists()) {
            const categoryData = categorySnap.data();
            setDescription(categoryData.description || "Açıqlama mövcud deyil.");
            const categoryClassesRef = collection(db, `Exams/${categoryId}/Classes`);
            const querySnapshot = await getDocs(categoryClassesRef);
            const classesData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              categoryId: categoryId
            }));
            dispatch(setClasses(classesData));
            if (classesData.length > 0) {
              setSelectedClass(classesData[0].id);
            }
          } else {
            setDescription("Kategori bulunamadı.");
          }
        } catch (error) {
          console.error("Veri alınırken hata oluştu: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCategoryData();
  }, [categoryId, reduxCategoryDescription, dispatch]);

  useEffect(() => {
    const fetchExams = async () => {
      if (!selectedClass) return;
      setExamsLoading(true);
      try {
        const examsRef = collection(db, `Exams/${categoryId}/Classes/${selectedClass}/Exams`);
        const querySnapshot = await getDocs(examsRef);
        const examsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setExams(examsData);
      } catch (error) {
        console.error("Sınavlar yüklenirken hata oluştu: ", error);
      } finally {
        setExamsLoading(false);
      }
    };

    fetchExams();
  }, [selectedClass, categoryId]);

  const handleClassClick = (classId) => {
    setSelectedClass(classId);
  };

  const handleExamClick = (examId) => {
    navigate(`/category/${categoryId}/class/${selectedClass}/exam/${examId}/details`);
  };

  const displayedClasses = reduxClasses.filter(cls => cls.categoryId === categoryId);

  useEffect(() => {
    if (displayedClasses.length > 0 && !selectedClass) {
      setSelectedClass(displayedClasses[0].id);
    }
  }, [displayedClasses, selectedClass]);

  // Filter exams based on selected filter
  const filteredExams = exams.filter(exam => {
    if (filter === "all") return true;
    if (filter === "free") return !exam.price || exam.price === 0;
    if (filter === "paid") return exam.price && exam.price > 0;
    return true;
  });

  return (
    <div>
      <Navbar />
      <div className="bg-gradient-to-b from-violet-700 to-indigo-600 text-white p-6 h-[450px] md:h-[300px] flex justify-center md:items-center">
        <div className="max-w-6xl flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-8 w-full">
          <div className="bg-white text-blue-700 w-full h-44 rounded-xl text-center flex items-center justify-center col-span-1">
            <h2 className="text-4xl font-bold">{categoryId}</h2>
          </div>
          <div className="text-center flex justify-center items-center col-span-2">
            {loading ? (
              <Skeleton count={1} height={30} width="50%" className="mx-auto" />
            ) : (
              <p className="text-base md:text-lg font-semibold">{description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl bg-white mx-auto p-6 flex flex-wrap gap-4 justify-center">
        {examsLoading && displayedClasses.length === 0 ? (
          <Skeleton count={3} height={40} width={150} />
        ) : (
          displayedClasses.map(cls => (
            <button
              key={cls.id}
              className={`px-6 py-3 rounded-lg transition-all ${selectedClass === cls.id ? "bg-blue-700 text-white" : "bg-blue-500 text-white hover:bg-blue-700"}`}
              onClick={() => handleClassClick(cls.id)}
            >
              {cls.id}
            </button>
          ))
        )}
      </div>

      {/* Filter select dropdown */}
      <div className="max-w-6xl mx-auto  bg-white flex ">
        <div className="relative w-full md:w-64">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Bütün imtahanlar</option>
            <option value="free">Pulsuz imtahanlar</option>
            <option value="paid">Ödənişli imtahanlar</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-6 h-screen bg-white">
        {examsLoading ? (
          <div className="flex flex-wrap gap-4">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} height={100} width={300} className="rounded-xl" />
            ))}
          </div>
        ) : filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredExams.map(exam => (
              <div
                key={exam.id}
                className="border border-gray-100 shadow-xl rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all relative"
                onClick={() => handleExamClick(exam.id)}
              >
                <h3 className="text-xl font-bold">{exam.id}</h3>
                <p className="text-gray-600">
                  {exam.description ? exam.title2 : "Açıqlama mövcud deyil."}
                </p>
                <p className={`mt-2 text-lg font-semibold ${exam.price ? "text-purple-600" : "text-green-600"}`}>
                  {exam.price ? `${exam.price} AZN` : "Pulsuz"}
                </p>
                {exam.isCertified && (
                  <div className="absolute top-4 right-4">
                    <FaCertificate className="text-yellow-500 text-2xl" title="Sertifikalı Sınav" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg">
            {filter === "all" 
              ? "Bu sinifdə hələ imtahan mövcud deyil." 
              : filter === "free" 
                ? "Bu sinifdə pulsuz imtahan mövcud deyil." 
                : "Bu sinifdə ödənişli imtahan mövcud deyil."}
          </p>
        )}
      </div>
    </div>
  );
};

export default ExamsPage;