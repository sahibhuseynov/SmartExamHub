import CirtdanImage from '../assets/cirtdanhero.png';

const HeroSection = () => {
  return (
    <section className="text-center relative z-10" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <h1 className="text-white text-5xl font-bold ">Eğlenerek Öğrenin!</h1>
      {/* Cırtdan Resmi */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-20 ">
        <img src={CirtdanImage} alt="Cırtdan" className="w-80 h-auto" />
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
