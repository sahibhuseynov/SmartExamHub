import { motion } from "framer-motion";
import biuImage from "../assets/biu.png";

const cardVariants = {
  offscreen: { opacity: 0, y: 100, rotateX: 45, scale: 0.8 },
  onscreen: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    scale: 1, 
    transition: { 
      type: "spring", 
      bounce: 0.4, 
      duration: 1 
    } 
  },
};

const hoverEffect = {
  scale: 1.05,
  rotateZ: 2,
  transition: { duration: 0.3 },
};

const InfoSection = () => {
  return (
    <section className="py-12 relative  mx-auto">
   <div className="bg-gradient-to-b from-violet-700 to-indigo-600 absolute inset-0"></div>
      <div className="max-w-6xl mx-auto relative ">
        <div className="text-center ">
          <h2 className="text-4xl font-extrabold text-white mb-4">Niyə Bizi Seçməlisiniz?</h2>
          <p className="text-lg text-white">
          Cırtdan uşaqlar üçün öyrənməyi daha əyləncəli edir! <br />
Ayda 2 dəfə keçirilən viktorinalar, testlər və interaktiv oyunlarla uşaqlar həm öyrənir, həm də əylənir!







          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Kart 1 */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg relative flex flex-col items-center text-center"
            initial="offscreen"
            whileInView="onscreen"
            whileHover={hoverEffect}
            viewport={{ once: true, amount: 0.5 }}
            variants={cardVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-transparent opacity-10 rounded-lg" />
            <h3 className="text-2xl font-bold text-blue-800 mb-4">İnteraktiv Öyrənmə</h3>
            <motion.img
              src={biuImage}
              alt="İnteraktiv Öyrənmə"
              className="w-full rounded-lg mb-4"
              whileHover={{ scale: 1.2, transition: { duration: 0.4 } }}
            />
            <p className="text-gray-600">
              Uşaqlara yeni anlayışları maraqlı və interaktiv şəkildə öyrənməyə kömək edən yanaşma.
            </p>
          </motion.div>
  
          {/* Kart 2 */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg relative flex flex-col items-center text-center"
            initial="offscreen"
            whileInView="onscreen"
            whileHover={hoverEffect}
            viewport={{ once: true, amount: 0.5 }}
            variants={cardVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500 to-transparent opacity-10 rounded-lg" />
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Fərdiləşdirilmiş Viktorinalar</h3>
            <motion.img
              src={biuImage}
              alt="Fərdiləşdirilmiş Viktorinalar"
              className="w-full rounded-lg mb-4"
              whileHover={{ scale: 1.2, transition: { duration: 0.4 } }}
            />
            <p className="text-gray-600">
              Uşaqların öz tempində öyrənməsi üçün fərdiləşdirilmiş viktorinalar.
            </p>
          </motion.div>
  
          {/* Kart 3 */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg relative flex flex-col items-center text-center"
            initial="offscreen"
            whileInView="onscreen"
            whileHover={hoverEffect}
            viewport={{ once: true, amount: 0.5 }}
            variants={cardVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-transparent opacity-10 rounded-lg" />
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Əyləncəli Oyunlar</h3>
            <motion.img
              src={biuImage}
              alt="Əyləncəli Oyunlar"
              className="w-full rounded-lg mb-4"
              whileHover={{ scale: 1.2, transition: { duration: 0.4 } }}
            />
            <p className="text-gray-600">
              İnteraktiv oyunlar vasitəsilə uşaqların problem həll etmə bacarıqlarını inkişaf etdirin.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
