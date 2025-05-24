import { useState } from 'react';
import { RiArrowDownWideFill } from "react-icons/ri";
import { FaAngleRight } from "react-icons/fa6";
import { BsChatRightFill } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from 'framer-motion';

const ChatWithUs = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [iconChange, setIconChange] = useState(false);

  const handleChatButtonClick = () => {
    setShowPopup(!showPopup);
    setIconChange(!iconChange);
  };

  return (
    <div>
      {/* Floating Action Button */}
      <motion.div
        onClick={handleChatButtonClick}
        className="fixed z-50 bottom-7 right-7 bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-full shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {iconChange ? (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <RiArrowDownWideFill size={22} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <BsChatRightFill size={20} />
          </motion.div>
        )}
      </motion.div>

      {/* Popup with Framer Motion Animation */}
      {showPopup && (
        <motion.div
          className="fixed z-40 bottom-24 right-7 bg-white p-6 rounded-2xl shadow-2xl max-w-xs w-full border border-gray-100"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ 
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.3
          }}
        >
          <div className="text-center space-y-4">
            <p className="text-gray-800 text-md font-semibold">
              Veb saytını yoxladım və bir neçə sualım var.
            </p>
            
            <motion.a 
              href="https://wa.me/994509834972" 
              target="_blank" 
              rel="noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className='flex items-center justify-between mt-4 p-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white group transition-all duration-200 hover:shadow-md'>
                <div className="flex items-center space-x-3">
                  <FaWhatsapp size={24} className="text-white" />
                  <span className='font-medium'>Bizimlə söhbət et</span>
                </div>
                <FaAngleRight size={16} className="opacity-80 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatWithUs;