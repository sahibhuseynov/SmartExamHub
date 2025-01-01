import contactImage from '../assets/contactImage.png';
import { motion } from 'framer-motion';
import bgImage from '../assets/conbg.png';

const ContactSection = () => {
  return (
    <section
      className="relative  bg-gradient-to-b from-red-600 to-teal-500 py-12 px-4 "
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Başlık ve Açıklama */}
      <div className="text-center mb-80">
        <h2 className="text-4xl font-bold text-blue-800">Bizimlə Əlaqə</h2>
        <p className="text-blue-800 mt-2">
          Suallarınız və ya təklifləriniz üçün bizimlə əlaqə saxlayın. Sizə kömək etməkdən məmnunuq!
        </p>
      </div>

      {/* Form Konteyner */}
      <div className="max-w-2xl pt-16  mx-auto bg-white shadow-lg rounded-lg relative">
        {/* Form Üst Bar */}
        <div className="absolute  flex items-center px-4 top-0 bg-blue-700 h-16 w-full rounded-t-lg">
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-red-700 rounded-full"></div>
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Çocuk Resmi */}
        <div className="absolute -top-80 left-[49%] transform -translate-x-1/3">
          <motion.img
            src={contactImage}
            alt="Çocuk"
            className="w-80 h-auto"
            loading="lazy"
            initial={{ y: -200, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 8,
              duration: 1.5,
            }}
          />
        </div>

        {/* İletişim Formu */}
        <form className="p-6 space-y-4">
          {/* İsim Alanı */}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
              Adınız:
            </label>
            <input
              type="text"
              id="name"
              placeholder="Adınızı buraya yazın 😊"
              className="w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* E-posta Alanı */}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
              E-posta:
            </label>
            <input
              type="email"
              id="email"
              placeholder="E-posta adresiniz"
              className="w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mesaj Alanı */}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="message">
              Mesajınız:
            </label>
            <textarea
              id="message"
              rows="4"
              placeholder="Mesajınızı buraya yazın 📩"
              className="w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Gönder Butonu */}
          <motion.button
            type="submit"
            className="w-full bg-yellow-400 text-white py-3 px-4 rounded-md font-bold hover:bg-yellow-500 transition duration-300 ease-in-out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Mesaj Uçur! 🚀
          </motion.button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
