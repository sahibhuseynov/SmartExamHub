
import Navbar from './../components/Navbar';
import HeroSection from './../components/HeroSection';
import dagimage from '../assets/dag3.png';
import InfoSection from '../components/InfoSection';
import { motion } from 'framer-motion';
import  ContactSection  from '../components/ContactSection';
const App = () => {
  return (
    <div
    className="h-screen bg-cover bg-center "
    style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.5) 1.7px, transparent 1.7px), 
          linear-gradient(to right, rgba(255, 255, 255, 0.5) 0.5px, transparent 1px),
          linear-gradient(to bottom, #2837ae, #36dbe3)`, /* Tailwind colors for from-blue-800 and to-indigo-900 */
          backgroundSize: '24px 24px, 24px 24px, cover',
        backgroundBlendMode: 'normal',
        opacity: 0.9, /* Adjust the opacity of the entire background if needed */
      }}
    >
        <motion.div
    className="absolute w-full h-full bg-cover bg-center z-10  opacity-50  "
      Loading = "lazy"
    style={{
      backgroundImage: `url(${dagimage})`, 
    }}
   
  ></motion.div>
        <div
    className="absolute inset-0"
    style={{
      background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))', /* Siyah gradient */
      zIndex: 1, /* Üstte olmasını sağlar */
    }}
  ></div>
        
      <Navbar/><div className='absolute bottom-0 w-full h-1 bg-white z-10'></div>
      <HeroSection />
      

      <InfoSection />
      <ContactSection />
    </div>
  );
};

export default App;
