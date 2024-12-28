import CirtdanImage from '../assets/cirtdanhero.png';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="text-center relative z-10 max-w-6xl mx-auto" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <motion.h1 
      className="text-white text-fluid font-bold "
      initial={{ y: 100, opacity: 0 }} // Baştaki pozisyon ve opaklık
        animate={{ y: 0, opacity: 1 }} // Animasyon sonrası pozisyon ve opaklık
        transition={{
          type: "spring", // Yaylı hareket
          stiffness: 200, // Yay sertliği
          damping: 12, // Hareket sönümleme
          duration: 1, // Süre
      }}
      >Eğlenerek Öğrenin!</motion.h1>
      {/* Cırtdan Resmi */}
      <div className="absolute bottom-20 inset-x-0 flex justify-center">
  <motion.img
    src={CirtdanImage}
    alt="Cırtdan"
    className="w-80 h-auto"
    initial={{ y: 80, opacity: 0 }}
  animate={{ y: [50, -30, 10, 0], opacity: 1 }}
  transition={{
    type: 'spring',
    stiffness: 150, // Yayın sertliği
    damping: 8,     // Sekme sonrası durulma
    duration: 1.5,  // Animasyonun süresi
  }}
  />
</div>

      {/* Alt Kısım */}
      <div className="absolute w-2/5 bottom-0 left-1/2 transform -translate-x-1/2 border-x-4 border-t-4 border-yellow-500 bg-white rounded-t-3xl shadow-lg p-6 flex flex-col items-center ">
        {/* Orta Buton */}
        <button className="absolute -top-6 bg-blue-500 border-4 border-yellow-500 text-white text-lg font-bold px-12 py-3 rounded-full shadow-md hover:scale-105 hover:border-green-500 transition-all ease-in ">
          İNDİ BAŞLA 
        </button>

        {/* Kırmızı Noktalar */}
        <div className="flex justify-center space-x-6 mt-8 ">
          <div className="h-4 w-4 bg-red-500 rounded-full"></div>
          <div className="h-4 w-4 bg-red-500 rounded-full"></div>
          <div className="h-4 w-4 bg-red-500 rounded-full"></div>
          <div className="h-4 w-4 bg-red-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
