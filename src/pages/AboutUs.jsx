import { motion } from 'framer-motion'; // Framer Motion import edildi
import Navbar from "../components/Navbar";
import ChatWithUs from './../components/ChatWithUs';
import Footer from "../components/Footer";
import RankBadgeImg from '../assets/rankbadge.png' 
import VictoryCupImg from '../assets/Victorycup.png' 
import Aiİconİmg from '../assets/Aiİcon.png' 
import CertificatIconImg from '../assets/certificatIcon.png'
const AboutUs = () => {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <ChatWithUs />

      <div className="max-w-7xl mx-auto px-6 py-12 mb-16">
        <div className="text-center">
          <h1
            className="text-4xl font-extrabold text-blue-600 mb-6"
            
          >
            <span className="text-black">Cirtdan</span> Online İmtahan Platforması
          </h1>

          <motion.p
            className="text-xl text-gray-700 mb-12"
            initial={{ opacity: 0 }} // Başlangıç animasyonu
            animate={{ opacity: 1 }} // Hedef animasyon
            transition={{ duration: 1 }} // Geçiş süresi
          >
            Cirtdan onlayn sınaq imtahanları, yarışlar, müsabiqələr və test bazası ilə hər kəs üçün təhsil imkanı yaradır. Layihəmiz magistrlərdən ibtidai siniflərə, abituriyentlərdən müəllimlərə qədər geniş bir auditoriya üçün nəzərdə tutulub. Cirtdan-ın əsas məqsədi onlayn təhsilin inkişafını dəstəkləmək və müasir təhsil mühitində rəqabət qabiliyyətli iştirakçıları yetişdirməkdir.
          </motion.p>

          <h2
            className="text-3xl font-semibold text-gray-800 mt-12 mb-6"
            
          >
            Cirtdanı Nə Fərqləndirir?
          </h2>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {/* Fərqləndirici cardlar */}
            <div
              className="bg-white flex flex-col items-center justify-center p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl"
              
            
            >
              <motion.img
                src={Aiİconİmg}
                alt="ListIcon"
                className="w-36 h-36 object-cover"
                initial={{ rotate: 0 }} // Başlangıç animasyonu
                whileInView={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.7 }}
              />
              <h3 className="text-xl font-semibold text-gray-800">Aİ ilə Gəlişmiş İstatistiklər</h3>
              <p className="text-gray-500 mt-2">
              Cirtdan, yapay zeka desteğiyle istifadəçi nəticələrini analiz edir və daha dəqiq nəticələr təqdim edir. 
              </p>
            </div>

            <div
              className="bg-white flex flex-col justify-center items-center p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl"
              
              
            >
              <img src={RankBadgeImg} alt="rankbadge" className="w-36 h-36 object-cover" />
              <h3 className="text-xl font-semibold text-gray-800">Rozet Sistemimiz</h3>
              <p className="text-gray-500 mt-2">
                Yeni rozetlər əldə edərək, müxtəlif hədiyyələr qazanma imkanı əldə edin!
              </p>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full mt-4 h-2.5">
                <motion.div
                  className="bg-blue-600 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "80%" }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>


            <div
              className="bg-white flex flex-col justify-center items-center p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl"
             
              
            >
              <motion.img
                src={VictoryCupImg}
                alt="victorycup"
                className="w-36 h-36 object-cover"
                initial={{ rotate: 0, y: 0 }}
                whileInView={{ rotate: [0, 15, -15, 0], y: [0, -10, 0] }}
                viewport={{ once: false }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <h3 className="text-xl font-semibold text-gray-800">Yarış və Müsabiqələr</h3>
              <p className="text-gray-500 mt-2">
                Canlı yarışlara və müsabiqələrə qoşularaq bütün istifadəçilər arasında fərqlənin və hədiyyələr qazanın!
              </p>
            </div>
            <div
              className="bg-white flex flex-col justify-center items-center p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl"
             
              
            >
              <motion.img
                src={CertificatIconImg}
                alt="victorycup"
                className="w-36 h-36 object-cover"
                initial={{ rotate: 0, y: 0 }}
                whileInView={{ rotate: [0, 15, -15, 0], y: [0, -10, 0] }}
                viewport={{ once: false }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <h3 className="text-xl font-semibold text-gray-800">Sertifikatlar və Nailiyyətlər</h3>
              <p className="text-gray-500 mt-2">
              Sertifikatlarınızı və əldə etdiyiniz nailiyyətləri toplayaraq fərqlənin, uğurlarınızı paylaşın və daha çox motivasiya qazanın!
              </p>
            </div>
          </div>

          <motion.h2
            className="text-3xl font-bold mb-8"
            initial={{ opacity: 0, y: 50 }} // Başlangıç animasyonu
            animate={{ opacity: 1, y: 0 }} // Hedef animasyon
            transition={{ duration: 0.8 }} // Geçiş süresi
          >
            Komandamız
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Kartlar */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }} // Başlangıç animasyonu
              animate={{ opacity: 1, scale: 1 }} // Hedef animasyon
              transition={{ duration: 0.5 }} // Geçiş süresi
            >
              <img
                src="https://via.placeholder.com/100"
                alt="John Doe"
                className="rounded-full mx-auto mb-4"
              />
              <p className="text-xl font-semibold text-gray-800">John Doe</p>
              <p className="text-gray-500">CEO & Kurucu</p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }} // Başlangıç animasyonu
              animate={{ opacity: 1, scale: 1 }} // Hedef animasyon
              transition={{ duration: 0.5 }} // Geçiş süresi
            >
              <motion.img
                src="https://via.placeholder.com/100"
                alt="Jane Smith"
                className="rounded-full mx-auto mb-4"
              />
              <p className="text-xl font-semibold text-gray-800">Jane Smith</p>
              <p className="text-gray-500">Teknik Müdür</p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }} // Başlangıç animasyonu
              animate={{ opacity: 1, scale: 1 }} // Hedef animasyon
              transition={{ duration: 0.5 }} // Geçiş süresi
            >
              <img
                src="https://via.placeholder.com/100"
                alt="Michael Brown"
                className="rounded-full mx-auto mb-4"
              />
              <p className="text-xl font-semibold text-gray-800">Michael Brown</p>
              <p className="text-gray-500">Tasarımcı</p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
