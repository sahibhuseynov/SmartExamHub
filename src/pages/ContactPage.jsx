import { useState } from 'react';
import { motion } from 'framer-motion';

import Footer from '../components/Footer';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import { SiLinkedin } from 'react-icons/si';
import Navbar from '../components/Navbar';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      y: -5,
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* Loading Animation */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-700">Mesajınız göndərilir...</p>
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {submitSuccess && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          Mesajınız uğurla göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq.
        </motion.div>
      )}

      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              variants={itemVariants}
            >
              Bizimlə Əlaqə
            </motion.h1>
            <motion.p 
              className="text-xl max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Hər hansı sualınız və ya təklifiniz varsa, bizimlə əlaqə saxlamaqdan çəkinməyin.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Content */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Bizə Mesaj Göndərin</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 mb-2">Adınız</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 mb-2">Email Ünvanınız</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">Mesajınız</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <motion.button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Mesajı Göndər
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Əlaqə Məlumatları</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaPhoneAlt className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Telefon</h3>
                    <p className="text-gray-600">+994 12 345 67 89</p>
                    <p className="text-gray-600">+994 50 123 45 67</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">info@balabebir.az</p>
                    <p className="text-gray-600">support@balabebir.az</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Ünvan</h3>
                    <p className="text-gray-600">Bakı şəhəri, Nəsimi rayonu</p>
                    <p className="text-gray-600">H.Cavid prospekti, 15</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Sosial Şəbəkələr</h2>
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="#"
                  className="bg-blue-600 text-white p-4 rounded-full"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTelegramPlane className="text-xl" />
                </motion.a>
                <motion.a
                  href="#"
                  className="bg-green-500 text-white p-4 rounded-full"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaWhatsapp className="text-xl" />
                </motion.a>
                <motion.a
                  href="#"
                  className="bg-blue-700 text-white p-4 rounded-full"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SiLinkedin className="text-xl" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Map Section */}
      <motion.section 
        className="bg-gray-100 py-12 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Bizim Yerləşdiyimiz Ünvan</h2>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-96 w-full bg-gray-300 flex items-center justify-center">
              <p className="text-gray-500">Xəritə burada görünəcək</p>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default ContactPage;