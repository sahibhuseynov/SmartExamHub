import { motion } from 'framer-motion'; // Framer Motion import edildi
import Navbar from "../components/Navbar";
import ChatWithUs from './../components/ChatWithUs';
import Footer from "../components/Footer";
import { BsTwitterX } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
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
            <span className="text-black">Bala Bebir</span> Online İmtahan Platforması
          </h1>

          <motion.p
            className="text-xl text-gray-700 mb-12"
            initial={{ opacity: 0 }} // Başlangıç animasyonu
            animate={{ opacity: 1 }} // Hedef animasyon
            transition={{ duration: 1 }} // Geçiş süresi
          >
            Bala Bebir onlayn sınaq imtahanları, yarışlar, müsabiqələr və test bazası ilə hər kəs üçün təhsil imkanı yaradır. Layihəmiz magistrlərdən ibtidai siniflərə, abituriyentlərdən müəllimlərə qədər geniş bir auditoriya üçün nəzərdə tutulub. Cirtdan-ın əsas məqsədi onlayn təhsilin inkişafını dəstəkləmək və müasir təhsil mühitində rəqabət qabiliyyətli iştirakçıları yetişdirməkdir.
          </motion.p>

          <h2
            className="text-3xl font-semibold text-gray-800 mt-12 mb-6"
            
          >
            Bala Bebiri Nə Fərqləndirir?
          </h2>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {/* Fərqləndirici cardlar */}
            <div
              className="bg-white flex flex-col items-center justify-center p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl"
              
            
            >
              <motion.img
                src={"https://res.cloudinary.com/dwvmtepwh/image/upload/v1745012778/cko94fzoa42ersupyttm.webp"}
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
              <img src={"https://res.cloudinary.com/dwvmtepwh/image/upload/v1745012873/whbchj8jav5kvdqsgd2q.webp"} alt="rankbadge" className="w-36 h-36 object-cover" />
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
                src={"https://res.cloudinary.com/dwvmtepwh/image/upload/v1745013027/kiwsfdvawugzlljexdqd.webp"}
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
                src={"https://res.cloudinary.com/dwvmtepwh/image/upload/v1745012779/zfahqljjn5y5hyr7vamp.webp"}
                alt="victorycup"
                className="w-36 h-36 object-cover"
                initial={{ rotate: 0, y: 0 }}
whileInView={{ rotate: [0, -10, 10, -8, 8, 0], y: 0 }}
viewport={{ once: false }}
transition={{ duration: 1.2, ease: "easeInOut",  }}
              />
              <h3 className="text-xl font-semibold text-gray-800">Məlumatlandırma </h3>
              <p className="text-gray-500 mt-2">
              İmtahan tarixləri, nəticələr və digər vacib dəyişikliklər haqqında məlumatları vaxtında almaq üçün bildirişlər və e-poçt yeniləmələrindən yararlan.
              </p>
            </div>
            <div
              className="bg-white flex flex-col justify-center items-center p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl"
             
              
            >
              <motion.img
                src={"https://res.cloudinary.com/dwvmtepwh/image/upload/v1745012778/lrehuf0ddcabu51fe3d3.webp"}
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
            className="text-3xl font-bold mb-24 mt-24"
            initial={{ opacity: 0, y: 50 }} // Başlangıç animasyonu
            animate={{ opacity: 1, y: 0 }} // Hedef animasyon
            transition={{ duration: 0.8 }} // Geçiş süresi
          >
            Komandamız
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Kartlar */}
            <motion.div
  className="relative bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out group"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
>
  {/* Profil Şəkli */}
  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-white -mt-20 group-hover:scale-105  transition-transform duration-300">
    <img
      src="https://res.cloudinary.com/dwvmtepwh/image/upload/v1745010685/o91ouqdqw6cctovymjah.png"
      alt="Hüseynov"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Ad və Pozisiya */}
  <div className="mt-6 text-center">
    <h3 className="text-xl font-bold text-gray-800  duration-300">Huseynov</h3>
    <p className="text-sm text-gray-500">CEO & Qurucu</p>
  </div>

  {/* Bio (istəyə bağlı əlavə) */}
  <p className="text-sm text-gray-600 text-center mt-3 px-2">
    Rəqəmsal transformasiya üzrə lider. Komandanı motivasiya edən ilhamverici şəxsiyyət.
  </p>

  {/* Sosial Media İkonları */}
  <div className="mt-4 flex justify-center gap-4">
    <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-xl">
    <BsTwitterX />
    </a>
    <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors text-xl">
      <FaLinkedinIn />
    </a>
    <a href="#" className="text-gray-400 hover:text-gray-800 transition-colors text-xl">
      <FaGithub />
    </a>
  </div>
</motion.div>


<motion.div
  className="relative bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out group"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
>
  {/* Profil Şəkli */}
  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-white -mt-20 group-hover:scale-105  transition-transform duration-300">
    <img
      src="https://res.cloudinary.com/dwvmtepwh/image/upload/v1745012243/fwvafck1vi3lozvrd7hf.png"
      alt="Hüseynov"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Ad və Pozisiya */}
  <div className="mt-6 text-center">
    <h3 className="text-xl font-bold text-gray-800  duration-300">İslamova</h3>
    <p className="text-sm text-gray-500">UI/UX</p>
  </div>

  {/* Bio (istəyə bağlı əlavə) */}
  <p className="text-sm text-gray-600 text-center mt-3 px-2">
  Gözoxşayan interfeyslər və axıcı təcrübələrin yaradıcısı.
  </p>

  {/* Sosial Media İkonları */}
  <div className="mt-4 flex justify-center gap-4">
    <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-xl">
    <BsTwitterX />
    </a>
    <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors text-xl">
      <FaLinkedinIn />
    </a>
    <a href="#" className="text-gray-400 hover:text-gray-800 transition-colors text-xl">
      <FaGithub />
    </a>
  </div>
</motion.div>

<motion.div
  className="relative bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out group"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
>
  {/* Profil Şəkli */}
  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-white -mt-20 group-hover:scale-105  transition-transform duration-300">
    <img
      src="https://res.cloudinary.com/dwvmtepwh/image/upload/v1745011870/qvtptqcjcco66ydegmvp.png"
      alt="Quliyeva"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Ad və Pozisiya */}
  <div className="mt-6 text-center">
    <h3 className="text-xl font-bold text-gray-800  duration-300">Quliyeva</h3>
    <p className="text-sm text-gray-500">Developer</p>
  </div>

  {/* Bio (istəyə bağlı əlavə) */}
  <p className="text-sm text-gray-600 text-center mt-3 px-2">
  Müasir veb interfeyslərin hazırlanmasında ixtisaslaşmış frontend developer.
  </p>

  {/* Sosial Media İkonları */}
  <div className="mt-4 flex justify-center gap-4">
    <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-xl">
    <BsTwitterX />
    </a>
    <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors text-xl">
      <FaLinkedinIn />
    </a>
    <a href="#" className="text-gray-400 hover:text-gray-800 transition-colors text-xl">
      <FaGithub />
    </a>
  </div>
</motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
