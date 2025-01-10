// ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Animasyonlu scroll işlemi
    const scrollWithAnimation = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // Kaydırma animasyonu
      });
    };

    scrollWithAnimation(); // Sayfa her değiştiğinde animasyonlu olarak scroll yap

  }, [location]);

  return null; // Bu bileşen sadece sayfa değiştiğinde scroll'u sıfırlıyor.
};

export default ScrollToTop;
