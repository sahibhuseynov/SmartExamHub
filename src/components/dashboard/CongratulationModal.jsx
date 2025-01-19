import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import rankBadgeImg from '../../assets/rankbadge.png';
import { useSelector } from "react-redux";

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
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 50 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
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
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white flex flex-col items-center p-12 rounded-xl shadow-xl text-center max-w-lg w-full"
          >
            <motion.h2 className="text-3xl font-bold text-blue-600 mb-4">
              Təbriklər!
            </motion.h2>
            <motion.h2 className="text-3xl font-bold text-blue-600 mb-4">
              {user.displayName}
            </motion.h2>
            <div className="mb-2">
              <img
                src={rankBadgeImg}
                alt="Başlanğıc Rozeti"
                className="w-32 h-32 object-cover mx-auto"
              />
            </div>

            <p className="text-lg font-medium text-gray-700 mb-6">
              İlk rozetinizi qazandınız!
            </p>
            <p className="text-sm text-gray-600 mb-8">
              Daha çox rozet qazanarak hədiyyələr və sürprizlərlə dolu mükafatlara sahib olun!
            </p>

            <div className="flex flex-col md:flex-row gap-3 items-center">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                Bağla
              </button>

              <button
                onClick={goToGiftsPage}
                className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg hover:bg-green-600 transition duration-300 ease-in-out"
              >
                Hədiyyələrə Bax
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CongratulationModal;
