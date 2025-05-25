import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import ChatWithUs from '../../components/ChatWithUs';
import { useSelector } from 'react-redux';

export default function KurumTanitim() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const handleFreeTrialClick = () => {
    if (user) {
      navigate('/registrationForm');
    } else {
      navigate('/login');
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <>
      <Navbar />
      <ChatWithUs />
      <header>
        <title>Kurum Platforması - Öz Rəqəmsal Məktəbini Qur</title>
        <meta name="description" content="Peşəkar imtahan və kurs idarəetmə sistemi" />
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={0}
          >
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full mb-6">
              <span className="text-sm font-medium">YENİ NESİL ÖĞRENİM PLATFORMU</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Öz <span className="text-yellow-300 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">Rəqəmsal Məktəbini</span> Qur
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Tələbələrin üçün peşəkar imtahanlar yarat, nəticələri anında izlə,
              <br className="hidden md:block" /> və brendinə uyğun sertifikatlar təqdim et!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                className="bg-white hover:bg-green-500 hover:text-white text-gray-900 font-bold px-8 py-4 rounded-full text-lg transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                onClick={handleFreeTrialClick}
              >
                İndi Pulsuz Yoxla
              </button>
              <button className="border-2 border-white/30 hover:border-white/60 text-white font-bold px-8 py-4 rounded-full text-lg transition-all transform hover:scale-[1.02]">
                Demo İzlə
              </button>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center mt-12 gap-6 opacity-90 text-sm md:text-base"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={1}
          >
            {[
              "✓ 3 Dəqiqəyə Hazır",
              "✓ Məlumat Təhlükəsizliyi",
              "✓ Ətraflı Hesabatlar",
              "✓ 7/24 Dəstək"
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <span className="text-green-300">✓</span> {item.split("✓ ")[1]}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Xüsusiyyətlər */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={0}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Niyə Balabebir Platforması?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Təhsil prosesinizi rəqəmsal dünyaya daşıyın və idarəetməni asanlaşdırın
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: '📝',
              title: 'Asan İmtahan Qurucusu',
              desc: 'Sürükla-burax interfeysi ilə dəqiqələr içində test qur',
              color: 'bg-blue-100 text-blue-600'
            },
            {
              icon: '👨‍🎓',
              title: 'Tələbə İzləmə Sistemi',
              desc: 'Hər tələbənin ətraflı performans təhlili',
              color: 'bg-purple-100 text-purple-600'
            },
            {
              icon: '🏆',
              title: 'Avtomatik Sertifikatlar',
              desc: 'Kurum loqolu, peşəkar sənədlər təqdim et',
              color: 'bg-yellow-100 text-yellow-600'
            },
            {
              icon: '📊',
              title: 'Real-time Analitika',
              desc: 'Anlıq statistikalar və performans metrikaları',
              color: 'bg-green-100 text-green-600'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-blue-100 transition-all group"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={i+1}
            >
              <span className={`text-3xl mb-6 block w-16 h-16 rounded-full ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {item.icon}
              </span>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
              <div className="mt-6">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  Ətraflı məlumat
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div
              className="flex-1"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={0}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Canlı İzləmə Paneli</h2>
              <p className="text-lg mb-8 leading-relaxed text-gray-700">
                İmtahan zamanı tələbələrin fəaliyyətlərini canlı izləyin,
                <br className="hidden md:block" /> və anlıq müdaxilə edin.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Brauzer kilidi və şübhəli hərəkət xəbərdarlıqları",
                  "Ətraflı statistikalar və müqayisələr",
                  "Tələbəyə xüsusi performans izləməsi",
                  "Avtomatik qiymətləndirmə və hesabatlar"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 p-1 rounded-full mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                  Demo İstə
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                  Video Baxış
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                  </svg>
                </button>
              </div>
            </motion.div>
            <motion.div
              className="flex-1 w-full"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={1}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <div className="bg-gray-800 h-8 flex items-center px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-80 md:h-96 flex items-center justify-center">
                  <div className="text-center p-6 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-xl font-bold mb-2">Demo Panel</h3>
                    <p className="opacity-80">Canlı izləmə panelinin interaktiv nümayişi</p>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Demo
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={0}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tez-tez Verilən Suallar</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Axtardığınız sualın cavabını tapa bilmədiniz? Əlaqə saxlayın!
          </p>
        </motion.div>
        
        <div className="space-y-4 mb-16">
          {[
            {
              q: 'Kurum qeydiyyatı üçün hansı sənədlər lazımdır?',
              a: 'VÖEN (vergi sənədi) və məsul şəxsə aid şəxsiyyət vəsiqəsi kifayətdir. Təsdiq prosesi 24 saatdan artıq çəkmir.'
            },
            {
              q: 'Tələbə limiti varmı?',
              a: 'Pulsuz plan 100 tələbə ilə məhdudlaşır, premium paketlərdə limitsizdir.'
            },
            {
              q: 'İmtahan nəticələrini necə paylaşa bilərəm?',
              a: 'Excel/PDF kimi yükləyə və ya avtomatik olaraq tələbələrə göndərə bilərsiniz.'
            },
            {
              q: 'Xarici dilləri dəstəkləyirmi?',
              a: 'Bəli, platformamız Azərbaycan, Türk, İngilis və Rus dillərini dəstəkləyir.'
            },
            {
              q: 'Mobil cihazlarda işləyirmi?',
              a: 'Bəli, bütün platformalarımız mobil uyğun olaraq hazırlanmışdır.'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={index+1}
            >
              <button
                className={`w-full text-left p-6 hover:bg-gray-50 transition-colors font-medium flex justify-between items-center ${activeFAQ === index ? 'bg-gray-50' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg">{item.q}</span>
                <span className={`text-2xl transition-transform ${activeFAQ === index ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {activeFAQ === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6 pt-2 bg-white"
                >
                  <p className="text-gray-700">{item.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 p-10 rounded-2xl text-center shadow-lg"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={3}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Hazırsınız?</h3>
          <p className="mb-6 max-w-2xl mx-auto leading-relaxed text-white/90">
            3 dəqiqəyə kurum hesabınızı yaradın, ilk imtahanınızı paylaşın və
            təhsil prosesinizi rəqəmsallaşdırın!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white hover:bg-gray-100 text-blue-600 font-bold px-10 py-4 rounded-full text-lg shadow-md hover:shadow-lg transition-all">
              Pulsuz Qeydiyyat
            </button>
            <button className="border-2 border-white/40 hover:border-white/80 text-white font-bold px-10 py-4 rounded-full text-lg hover:bg-white/10 transition-all">
              Ətraflı Məlumat
            </button>
          </div>
        </motion.div>
      </section>
      
      <Footer />
    </>
  );
}