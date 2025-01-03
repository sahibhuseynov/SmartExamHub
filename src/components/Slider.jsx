import Slider from 'react-slick';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // İkonlar için react-icons
import sliderimg1 from '../assets/slider1.webp';
import sliderimg2 from '../assets/slider2.webp';
import sliderimg3 from '../assets/slider3.jpg';

const Carousel = () => {
  // Slider için ayarları yapılandırıyoruz
  const settings = {
    dots: true, // Sayfa numarası noktaları
    infinite: true, // Sonsuz kaydırma
    speed: 500, // Kaydırma hızı
    slidesToShow: 1, // Görüntülenmesi gereken slayt sayısı
    slidesToScroll: 1, // Kaydırılacak slayt sayısı
    nextArrow: <FaArrowRight  />, // Next arrow
    prevArrow: <FaArrowLeft  />, // Previous arrow
  };

  return (
    <div className="carousel-container relative w-full overflow-hidden h-72">
      <Slider {...settings}>
        <div className="slide">
          <img src={sliderimg1} alt="Slide 1" className="w-full h-auto object-cover" />
        </div>
        <div className="slide">
          <img src={sliderimg2} alt="Slide 2" className="w-full h-auto object-cover" />
        </div>
        <div className="slide">
          <img src={sliderimg3} alt="Slide 3" className="w-full h-auto object-cover" />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
