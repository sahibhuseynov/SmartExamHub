import { useState } from "react";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

// Smooth Loading üçün Şəkil Komponenti
const SmoothImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const optimizeCloudinaryUrl = (url) => {
    if (!url.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/f_auto,q_auto,w_800/");
  };

  const optimizedSrc = optimizeCloudinaryUrl(src);
  return (
    <img
    src={optimizedSrc}
    alt={alt}
    loading="lazy"
    className={`w-full h-full object-cover rounded-lg transition-opacity duration-700 ${
      loaded ? "opacity-100" : "opacity-0"
    }`}
    onLoad={() => setLoaded(true)}
  />
);
};

const Carousel = () => {
  const slides = [
    {
      image: "https://res.cloudinary.com/dwvmtepwh/image/upload/v1745009062/mkopjmgox6nafm3q5ka4.webp",
      text: "Bebras Challenge ilə əylənərək öyrənin!",
      text2:
        "Uşaqlar üçün nəzərdə tutulmuş bu maraqlı riyaziyyat və məntiq tapşırıqları ilə bacarıqlarınızı sınayın!",
    },
    {
      image: "https://res.cloudinary.com/dwvmtepwh/image/upload/v1746566582/e2nrotwdyox3mcujaivy.png",
      text: "Şir Balası ilə Macəraya Hazır Ol!",
      text2:
        "Ağıllı və bacarıqlı uşaqlar üçün misilsiz tapşırıqlar. Öyrən, əylən və zirvəyə yüksəl!",
    },
    {
      image: "https://res.cloudinary.com/dwvmtepwh/image/upload/v1745009062/fmjppgjibokcnmkuq4es.webp",
      text: "Kenguru Riyaziyyat İmtahanı artıq platformamızda!",
      text2:
        "Riyaziyyat biliklərinizi sınamaq və fərqlənmək şansı üçün buradan başlayın.",
    },
    
  ];

  const settings = {
    dots: true,
    infinite: true, 
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    lazyLoad: false, // Lazy Loading-i deaktiv edirik
  };

  return (
    <div className="bg-gradient-to-b from-pink-500 to-purple-600">
      <div className="carousel-container max-w-[100rem] mx-auto w-full relative group text-white p-8">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className="!flex flex-col md:flex-row items-center justify-center md:h-[230px]"
            >
              {/* Sol tərəf - Şəkil */}
              <div className="w-full md:w-96 h-[200px] md:h-full mb-4 md:mb-0">
                <SmoothImage src={slide.image} alt={`Slide ${index + 1}`} />
              </div>
              {/* Sağ tərəf - Mətn */}
              <div className="w-full md:w-1/2 flex flex-col gap-4 items-center justify-center text-center px-4">
                <h2 className="text-2xl md:text-4xl font-bold">{slide.text}</h2>
                <p className="text-sm md:text-lg">{slide.text2}</p>
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
