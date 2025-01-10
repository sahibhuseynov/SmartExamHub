import Slider from 'react-slick';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; 
import sliderimg1 from '../../assets/slider1.webp';
import sliderimg2 from '../../assets/slider2.webp';
import sliderimg3 from '../../assets/slider3.jpg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Özelleştirilmiş Arrow bileşenleri
const NextArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 right-4 z-10 cursor-pointer text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    onClick={onClick}
  >
    <FaArrowRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 left-4 z-10 cursor-pointer text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    onClick={onClick}
  >
    <FaArrowLeft />
  </div>
);

const Carousel = () => {
  const slides = [
    { image: sliderimg1, text: "Canlı onlayn imtahan, yarış və müsabiqələrdə iştirak et.  ", text2: "Bilik yarışları, olimpiadalar və intellektual oyunlarda öz biliklərini sınayaraq uğur qazan.Cırtdan, istifadəçiləri üçün canlı yarışlar təşkil edərək əyləncə imkanı yaradır." },
    { image: sliderimg2, text: "Hər gün yeni onlayn imtahanlar, testlər və suallar ilə biliyini inkişaf etdir. " , text2: "Online təhsil platformasındakı kurslar və müəllimlərin təqdim etdiyi yeni imtahanlar, minlərlə sual və geniş test bazası ilə öz bilik səviyyəni ölç!" },
    { image: sliderimg3, text: "Adventure Awaits You" }
  ];

  const settings = {
    dots: true, 
    infinite: true, 
    speed: 500, 
    slidesToShow: 1, 
    slidesToScroll: 1, 
    nextArrow: <NextArrow />, 
    prevArrow: <PrevArrow />, 
    // autoplay: true, 
    autoplaySpeed: 3000,
    pauseOnHover: true,
    // appendDots: dots => (
    //   <div className="absolute bottom-4 w-full flex justify-center">
    //     <ul className="flex space-x-3 justify-center">{dots}</ul>
    //   </div>
    // ),
    // customPaging: () => (
    //   <div className="w-4 h-4 flex items-center justify-center">
    //     <div 
    //       className="w-3 h-3 rounded-full border border-blue-500 transition-all duration-300 ease-in-out"
    //     />
    //   </div>
    // ),
  };

  return (
   <div className='bg-gradient-to-b from-pink-500 to-purple-600'>
      <div className="carousel-container max-w-7xl mx-auto  w-full h-[300px] relative group  text-white p-8 ">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="!flex items-center justify-center h-[230px]">
              {/* Sol taraf - Resim */}
              <div className="w-64 h-full">
                <img src={slide.image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
              </div>
              {/* Sağ taraf - Metin */}
              <div className="w-1/2 flex flex-col gap-4 items-center justify-center p-8 text-center">
                <h2 className="text-4xl font-bold">{slide.text}</h2>
                <p>{slide.text2}</p>
              </div>
            </div>
          ))}
        </Slider>
        <style>{`
          .slick-dots li button:before {
            display: none;
          }
  
          .slick-dots li div {
            border-radius: 50%;
            border: 2px solid blue;
          }
  
          .slick-dots li.slick-active div {
            background-color: blue !important;
            border-color: blue !important;
            transform: scale(1.3); 
          }
        `}</style>
      </div>
   </div>
  );
};

export default Carousel;
