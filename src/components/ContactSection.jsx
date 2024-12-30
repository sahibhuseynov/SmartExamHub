import contactImage from '../assets/contactImage.png';
import { motion } from 'framer-motion';

const ContactSection = () => {
  return (
    <section className="relative bg-blue-50 py-12 px-4 h-screen">
      <div className="text-center mb-80">
        <h2 className="text-4xl font-bold text-blue-800">Bizimlə Əlaqə</h2>
        <p className="text-gray-600 mt-2 ">
          Suallarınız və ya təklifləriniz üçün bizimlə əlaqə saxlayın. Sizə kömək etməkdən məmnunuq!
        </p>
      </div>
      <div className="max-w-2xl mx-auto h-36 bg-white shadow-lg rounded-lg relative ">
        {/* Form kısmı */}
        <div className='absolute top-0 bg-gradient-to-r from-emerald-500 to-emerald-900 h-16 w-full rounded-t-lg'></div>

        {/* Çocuk resmi */}
        <div className="absolute -top-80 left-1/2 transform -translate-x-35">
          <motion.img
            src={contactImage} // Buraya çocuğun oturduğu resmin URL'sini koyun
            alt="Çocuk"
            className="w-80 h-auto"
            loading="lazy"
            initial={{ y: -200, opacity: 0 }} // Başlangıç pozisyonu
            whileInView={{ y: 0, opacity: 1 }} // Scroll ile tetiklenecek animasyon
            viewport={{ once: true, amount: 0.5 }} // Görünüm alanına %50 girince tetiklenir
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 8,
              duration: 1.5,
            }}
          />
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
