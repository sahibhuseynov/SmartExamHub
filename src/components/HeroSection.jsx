import CirtdanImage from '../assets/cirtdanhero.png';
import { motion } from 'framer-motion';
import starImage from '../assets/star.png';
import pencilImage from  '../assets/pencil.png';
import pencilImage2 from  '../assets/pencil2.png';
import rullerImage from  '../assets/ruller.png';
import { Link } from 'react-router-dom';
const HeroSection = () => {
  return (
    <section className="text-center overflow-hidden relative z-10 max-w-6xl mx-auto" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        {/* Üst Kısım */}
        
        <motion.img
      src={starImage}
      alt="Star"
       loading="lazy"
      className="absolute top-20 right-0 w-40 h-auto"
      animate={{
        rotate: [0, 15, -15, 0], // Sağa sola dönme
        y: [0, -10, 10, 0], // Yukarı aşağı hareket
      }}
      transition={{
        duration: 3, // Animasyonun süresi
        ease: "easeInOut", // Pürüzsüz hareket
        repeat: 1, // Animasyon yalnızca 1 kez tekrar eder
      }}
    />
    <motion.img
      src={starImage}
      alt="Star"
       loading="lazy"
      className="absolute left-20 right-0 w-40 h-auto"
      animate={{
        rotate: [0, 15, -15, 0], // Sağa sola dönme
        y: [0, -10, 10, 0], // Yukarı aşağı hareket
      }}
      transition={{
        duration: 3, // Animasyonun süresi
        ease: "easeInOut", // Pürüzsüz hareket
        repeat: 1, // Animasyon yalnızca 1 kez tekrar eder
      }}
    />
    <motion.img

        src={   pencilImage}
        alt="Pencil"
         loading="lazy"
        className="absolute bottom-10 right-72 w-40 h-auto z-0 "
        initial={{ y: 100, opacity: 0 }} // Baştaki pozisyon ve opaklık
        animate={{ y: 0, opacity: 1 }} // Animasyon sonrası pozisyon ve opaklık
        transition={{
          type: "spring", // Yaylı hareket
          stiffness: 200, // Yay sertliği
          damping: 12, // Hareket sönümleme
          duration: 1, // Süre
          delay: 1.5, // Gecikme
      }}
      
        />
         <motion.img
src={  pencilImage2}
alt="Pencil"
 loading="lazy"
className="absolute bottom-10 right-96 w-40 h-auto z-0 "
initial={{ y: 100, opacity: 0 }} // Baştaki pozisyon ve opaklık
animate={{ y: 0, opacity: 1 }} // Animasyon sonrası pozisyon ve opaklık
transition={{
  type: "spring", // Yaylı hareket
  stiffness: 200, // Yay sertliği
  damping: 12, // Hareket sönümleme
  duration: 1, // Süre
  delay: 1.7, // Gecikme
}}

/>
<motion.img
src={ rullerImage}
alt="Pencil"
 loading="lazy"
className="absolute bottom-10 left-80 w-40 h-auto z-0 "
initial={{ y: 150, opacity: 0 }} // Baştaki pozisyon ve opaklık
animate={{ y: 0, opacity: 1 }} // Animasyon sonrası pozisyon ve opaklık
transition={{
  type: "spring", // Yaylı hareket
  stiffness: 200, // Yay sertliği
  damping: 12, // Hareket sönümleme
  duration: 1, // Süre
  delay: 1.7, // Gecikme
}}
/>


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
      >Əylənərək Öyrənin!</motion.h1>
      {/* Cırtdan Resmi */}
      <div className="absolute bottom-20 inset-x-0 flex justify-center">
  <motion.img
    src={CirtdanImage}
    alt="Cırtdan"
    loading="lazy"
    className="w-80 h-auto "
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
      <div className="bg-gradient-to-b from-violet-700 to-violet-700 absolute w-2/5 bottom-0 left-1/2 transform -translate-x-1/2 border-x-4 border-t-4 border-white bg-white rounded-t-3xl shadow-lg p-6 flex flex-col items-center min-w-80 ">
        {/* Orta Buton */}
        <Link to="/register" className='absolute -top-6 bg-blue-500 border-4 border-white text-white text-lg font-bold px-16 py-3 rounded-full shadow-md hover:scale-105 hover:border-green-500 transition-all ease-in' >
          <button className="  ">
            Bilet Al
          </button>
  
        </Link>
        {/* Kırmızı Noktalar */}
        <div className="flex justify-center space-x-6 mt-8  ">
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
