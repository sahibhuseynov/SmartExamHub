
import Navbar from './../components/Navbar';
import HeroSection from './../components/HeroSection';

const App = () => {
  return (
    <div
    className="h-screen bg-cover bg-center"
    style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.5) 1.7px, transparent 1.7px), 
          linear-gradient(to right, rgba(255, 255, 255, 0.5) 0.5px, transparent 1px),
          linear-gradient(to right, #1e3a8a, #4f46e5)`, /* Tailwind colors for from-blue-800 and to-indigo-900 */
          backgroundSize: '24px 24px, 24px 24px, cover',
        backgroundBlendMode: 'normal',
        opacity: 0.9, /* Adjust the opacity of the entire background if needed */
      }}
    >
        <div
    className="absolute inset-0"
    style={{
      background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))', /* Siyah gradient */
      zIndex: 1, /* Üstte olmasını sağlar */
    }}
  ></div>
      <Navbar/>
      <HeroSection />
    </div>
  );
};

export default App;
