import  { useState } from 'react';
import { FaCalendar, FaClock, FaListAlt, FaTicketAlt } from 'react-icons/fa'; 

const CategoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['İbtidai Siniflər', 'Ortaokul', 'Yüksekokul', 'Gənc Tələbələr'];
  
  const exams = [
    {
      id: 1,
      title: 'Matematik Sınavı',
      date: '2025-01-15',
      duration: '45 dakika',
      totalTests: 20,
      category: 'İbtidai Siniflər',
      price: '30 AZN',
    },
    {
      id: 2,
      title: 'Türkçe Sınavı',
      date: '2025-01-20',
      duration: '30 dakika',
      totalTests: 25,
      category: 'Ortaokul',
      price: '40 AZN',
    },
    {
      id: 3,
      title: 'Fen Bilgisi Sınavı',
      date: '2025-01-25',
      duration: '40 dakika',
      totalTests: 15,
      category: 'İbtidai Siniflər',
      price: '25 AZN',
    },
    {
      id: 4,
      title: 'Matematik ve Geometri Sınavı',
      date: '2025-01-18',
      duration: '60 dakika',
      totalTests: 30,
      category: 'Yüksekokul',
      price: '50 AZN',
    },
  ];

  // Kategoriye tıklama işlemi
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Modal açma
  const openModal = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  // Modal kapama
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
  };

  // Kategoriye göre sınavları filtreleme
  const filteredExams = exams.filter((exam) => exam.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-600 to-indigo-600 py-8 px-4 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Sınav Kategorileri</h1>

      {/* Kategoriler */}
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

      {/* Sınavlar */}
      <h2 className="text-2xl font-bold mb-6">Seçilen Kategori: {selectedCategory}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white p-6 rounded-xl shadow-xl cursor-pointer hover:bg-blue-100 transition"
            onClick={() => openModal(exam)}
          >
            <h3 className="font-bold text-lg">{exam.title}</h3>
            <p className="text-gray-600">Tarih: {exam.date}</p>
            <p className="text-gray-600">Süre: {exam.duration}</p>
            <p className="text-gray-600">Toplam Test: {exam.totalTests}</p>
            <p className="text-gray-600">Fiyat: {exam.price}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl w-[700px] shadow-2xl text-black">
            <div className="flex justify-between items-center mb-6">
              <button
                className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition"
                onClick={closeModal}
              >
                Kapat
              </button>
              <h2 className="text-2xl font-bold">{selectedExam.title}</h2>
            </div>

            <div className="space-y-4 mb-6">
              {/* Sınav Detayları */}
              <div className="flex items-center space-x-2">
                <FaCalendar className="text-blue-500" />
                <p><strong>Sınav Tarixi:</strong> {selectedExam.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaClock className="text-orange-500" />
                <p><strong>Sınav Müddəti:</strong> {selectedExam.duration}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaListAlt className="text-green-500" />
                <p><strong>Cəmi Test Sayısı:</strong> {selectedExam.totalTests}</p>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <FaTicketAlt className="text-red-500" />
                <p><strong>Qiymət:</strong> {selectedExam.price}</p>
              </div>
            </div>

            {/* Bilet Al Butonu */}
            <div className="flex justify-center">
              <button className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-green-600 transition">
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
