import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from "react-redux";
import { FaTimes } from 'react-icons/fa';

const CongratulationModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);

  const goToGiftsPage = () => {
    navigate('/rewards');
  };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: { opacity: 0, scale: 0.8, y: 50 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3 }}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-gradient-to-br from-white to-gray-50 flex flex-col items-center p-8 rounded-2xl shadow-2xl text-center max-w-md w-[90%] border border-gray-200"
          >


            <div className="absolute top-4 right-4">
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-6 text-center">
              <motion.div 
                className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 500
                }}
              >
                Təbriklər!
              </motion.div>
              <motion.div 
                className="text-xl font-semibold text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {user?.displayName}
              </motion.div>
            </div>

            <motion.div 
              className="relative mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.2,
                type: "spring",
                stiffness: 500
              }}
            >
              <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-md animate-pulse"></div>
              <img
                src={"https://res.cloudinary.com/dwvmtepwh/image/upload/v1745012873/whbchj8jav5kvdqsgd2q.webp"}
                alt="Başlanğıc Rozeti"
                className="relative w-40 h-40 object-contain mx-auto z-10"
              />

            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4 mb-8"
            >
              <p className="text-lg font-medium text-gray-800">
                İlk rozetinizi qazandınız! 
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Daha çox rozet qazanaraq hədiyyələr və sürprizlərlə dolu mükafatlara sahib olun!
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-800 rounded-xl text-lg font-medium hover:bg-gray-200 transition-all duration-300 shadow-sm"
              >
                Bağla
              </button>

              <button
                onClick={goToGiftsPage}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                
                Hədiyyələrə Bax
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CongratulationModal;