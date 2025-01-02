import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaListAlt, FaTicketAlt } from 'react-icons/fa'; // React Icons kullanıyoruz
import catagoriesCharacter from '../assets/catagoriesCharacter.png';

const CategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const handleClassClick = (className) => {
    setSelectedClass(className);
    setIsModalOpen(true);
    // Fenlerin sınıfa göre değişen listeyi buradan ayarlıyoruz
    if (className === '1-ci Sinif') {
      setSelectedSubjects(['Fen Bilgisi', 'Türkçe', 'Matematik']);
    } else if (className === '2-ci Sinif') {
      setSelectedSubjects(['Fen Bilgisi', 'Matematik', 'Türkçe']);
    } else if (className === '3-cü Sinif') {
      setSelectedSubjects(['Fen Bilgisi', 'Matematik', 'Türkçe', 'Hayat Bilgisi']);
    } else if (className === '4-cü Sinif') {
      setSelectedSubjects(['Fen Bilgisi', 'Matematik', 'İngilizce']);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='flex justify-center items-center h-screen relative'>
      <img src={catagoriesCharacter} alt="Karakter" className='w-responsive absolute z-20 bottom-3 right-32' />
      <motion.div
        className="flex flex-col items-center justify-center bg-blue-400 rounded-xl p-4 max-w-lg text-black"
        initial={{ y: "-100%" }} // Sayfa yukarıdan başlar
        animate={{ y: 0 }} // Sayfa aşağı iner
        exit={{ y: "-100%" }} // Geri dönüşte yukarı çıkar
        transition={{ duration: 0.8, ease: "easeInOut" }} // Animasyon süresi ve tipi
      >
        <h1 className="text-3xl font-bold mb-6">İbtidai Siniflər</h1>
        <div className="grid grid-cols-2 gap-6">
          {/* Kartlar */}
          <div className="bg-blue-300 p-6 rounded-xl shadow-xl cursor-pointer" onClick={() => handleClassClick('1-ci Sinif')}>
            <h2 className="font-bold text-xl ">1-ci Sinif</h2>
          </div>

          <div className="bg-red-300 p-6 rounded-xl shadow-xl cursor-pointer" onClick={() => handleClassClick('2-ci Sinif')}>
            <h2 className="font-bold text-xl ">2-ci Sinif</h2>
          </div>

          <div className="bg-yellow-300 p-6 rounded-xl shadow-xl cursor-pointer" onClick={() => handleClassClick('3-cü Sinif')}>
            <h2 className="font-bold text-xl ">3-cü Sinif</h2>
          </div>

          <div className="bg-green-300 p-6 rounded-xl shadow-xl cursor-pointer" onClick={() => handleClassClick('4-cü Sinif')}>
            <h2 className="font-bold text-xl ">4-cü Sinif</h2>
          </div>
        </div>
      </motion.div>

      {/* Modal - Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl w-96 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">{selectedClass}</h2>
            <div className="space-y-4 mb-6">
              {/* Sınav Bilgileri */}
              <div className="flex items-center space-x-2">
                <FaCalendar className="text-blue-500" />
                <p><strong>Sınav Tarixi:</strong> 15.01.2025</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaClock className="text-orange-500" />
                <p><strong>Sınav Müddəti:</strong> 45 dəqiqə</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaListAlt className="text-green-500" />
                <p><strong>Cəmi Test Sayısı:</strong> 20</p>
              </div>

              {/* Fenler Listesi */}
              <div>
                <p className="font-bold text-lg mt-4">Fənlər:</p>
                <ul className="list-disc pl-5">
                  {selectedSubjects.map((subject, index) => (
                    <li key={index} className="text-sm text-gray-600">{subject}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <FaTicketAlt className="text-red-500" />
                <p><strong>Qiymət:</strong> 30 AZN</p>
              </div>
            </div>
            <div className="flex justify-between gap-4"> {/* Butonlar arasına gap eklendi */}
              <button
                className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition"
                onClick={closeModal}
              >
                Bağla
              </button>
              <button className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-green-600 transition">
                Ön Baxış
              </button>
              <button className="bg-orange-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-orange-600 transition">
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
