import { useState, useEffect } from 'react';
import { FaCalendar, FaClock, FaListAlt, FaTicketAlt } from 'react-icons/fa';

const CategoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [closestExams, setClosestExams] = useState([]);

  const categories = ['İbtidai Siniflər', 'Orta məktəb', 'Yüksək məktəb', 'Gənc Tələbələr'];

  const exams = [
    {
      id: 1,
      title: 'Riyaziyyat İmtahanı',
      date: '2025-01-03',
      duration: '45 dəqiqə',
      totalTests: 20,
      category: 'İbtidai Siniflər',
      price: '30 AZN',
    },
    {
      id: 2,
      title: 'Azərbaycan Dili İmtahanı',
      date: '2025-01-05',
      duration: '30 dəqiqə',
      totalTests: 25,
      category: 'Orta məktəb',
      price: '40 AZN',
    },
    {
      id: 3,
      title: 'Təbiət Elmləri İmtahanı',
      date: '2025-01-10',
      duration: '40 dəqiqə',
      totalTests: 15,
      category: 'İbtidai Siniflər',
      price: '25 AZN',
    },
    {
      id: 4,
      title: 'Həndəsə İmtahanı',
      date: '2025-01-07',
      duration: '60 dəqiqə',
      totalTests: 30,
      category: 'Yüksək məktəb',
      price: '50 AZN',
    },
  ];

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const futureExams = exams
      .filter((exam) => exam.date >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setClosestExams(futureExams);
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const openModal = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
  };

  const filteredExams = closestExams.filter(
    (exam) => exam.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-600 to-indigo-600 py-8 px-4 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">İmtahan Kateqoriyaları</h1>

      {/* Kateqoriyalar */}
      <div className="flex space-x-6 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={`py-2 px-6 rounded-lg shadow-lg transition ${
              selectedCategory === category ? 'bg-yellow-500 text-black' : 'bg-white text-black hover:bg-yellow-300'
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* İmtahanlar */}
      <h2 className="text-2xl font-bold mb-6">
        {filteredExams.length > 0
          ? `Ən Yaxın İmtahanlar (${filteredExams[0]?.date})`
          : 'Seçilən Kateqoriyada İmtahan Tapılmadı'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white p-6 rounded-xl shadow-xl cursor-pointer transition"
            onClick={() => openModal(exam)}
          >
            <h3 className="font-bold text-lg text-black">{exam.title}</h3>
            <p className="text-gray-600">Tarix: {exam.date}</p>
            <p className="text-gray-600">Müddət: {exam.duration}</p>
            <p className="text-gray-600">Ümumi Testlər: {exam.totalTests}</p>
            <p className="text-gray-600">Qiymət: {exam.price}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-2xl text-black">
            <h2 className="text-xl font-bold mb-4">{selectedExam.title}</h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2">
                <FaCalendar className="text-blue-500" />
                <p><strong>İmtahan Tarixi:</strong> {selectedExam.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaClock className="text-orange-500" />
                <p><strong>Müddət:</strong> {selectedExam.duration}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaListAlt className="text-green-500" />
                <p><strong>Ümumi Test Sayı:</strong> {selectedExam.totalTests}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaTicketAlt className="text-red-500" />
                <p><strong>Qiymət:</strong> {selectedExam.price}</p>
              </div>
            </div>

            {/* Düymələr */}
            <div className="flex justify-between">
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                onClick={closeModal}
              >
                Bağla
              </button>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Ön Baxış
              </button>
              <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition">
                Bilet Al
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
