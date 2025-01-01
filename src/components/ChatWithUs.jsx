import { useState } from 'react'; // Arrow Down Icon
import { RiArrowDownWideFill } from "react-icons/ri";
import { FaAngleRight } from "react-icons/fa6"; // Arrow Down Icon
import { BsChatRightFill } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa"; // Chat Icon
import { motion } from 'framer-motion'; // Framer Motion import

const ChatWithUs = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [iconChange, setIconChange] = useState(false);

  const handleChatButtonClick = () => {
    setShowPopup(!showPopup);
    setIconChange(!iconChange); // Icon değişimini sağlar
  };

  return (
    <div>
      {/* Chat Button (Daire şeklinde) */}
      <div
        onClick={handleChatButtonClick}
        className="fixed z-50 bottom-7 right-4 bg-green-500 text-white p-4 rounded-full border border-white shadow-lg cursor-pointer transition-all hover:bg-green-600"
      >
        {iconChange ? (
          <RiArrowDownWideFill size={20} />
        ) : (
          <BsChatRightFill size={20} />
        )}
      </div>

      {/* Popup with Framer Motion Animation */}
      {showPopup && (
       <motion.div
       className="fixed z-50 border-2 border-black  bottom-28 right-4 bg-white p-6 rounded-3xl shadow-lg max-w-sm w-full"
       initial={{ opacity: 0, y: 20 }} // Başlangıçta opaklık 0 ve 20px aşağıda
       animate={{ opacity: 1, y: 0 }} // Animasyon sırasında opaklık 1 ve yukarı doğru
       exit={{ opacity: 0, y: 20 }} // Kapanırken opaklık 0 ve 20px aşağıya
       transition={{ duration: 0.5, ease: 'easeInOut' }} // Animasyon süresi ve geçiş türü
     >
      
          <div className="text-center">
            <p className="text-black text-lg font-bold">
            Veb saytını yoxladım və bir neçə sualım var.
            </p>
            <a href="https://wa.me/994509834972" target="_blank" rel="noreferrer">
              <div className='flex  items-center cursor-pointer text-white justify-between mt-4 p-4 rounded-xl bg-black group transition-colorss'>
                <FaWhatsapp size={30} />
                <span className='group-hover:text-green-500 transition-all '>Bizimlə söhbət et</span>   
                <FaAngleRight size={20} />
              </div>
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatWithUs;
