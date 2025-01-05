import Slider from 'react-slick';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; 
import sliderimg1 from '../assets/slider1.webp';
import sliderimg2 from '../assets/slider2.webp';
import sliderimg3 from '../assets/slider3.jpg';
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
    { image: sliderimg1, text: "Discover the Beauty of Nature" },
    { image: sliderimg2, text: "Explore the World with Us" },
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
    appendDots: dots => (
      <div className="absolute bottom-4 w-full flex justify-center">
        <ul className="flex space-x-3 justify-center">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-4 h-4 flex items-center justify-center">
        <div 
          className="w-3 h-3 rounded-full border border-blue-500 transition-all duration-300 ease-in-out"
        />
      </div>
    ),
  };

  return (
    <div className="carousel-container  w-full h-[270px] relative group bg-gray-900 text-white p-8 ">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="!flex items-center justify-center h-[200px]">
            {/* Sol taraf - Resim */}
            <div className="w-64 h-full">
              <img src={slide.image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
            </div>
            {/* Sağ taraf - Metin */}
            <div className="w-1/2 flex items-center justify-center p-8 text-center">
              <h2 className="text-4xl font-bold">{slide.text}</h2>
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
  );
};

export default Carousel;
