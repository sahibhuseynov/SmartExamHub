import { useState } from "react";
import ExamForm from "../components/adminPanel/ExamForm";
import CouponForm from "../components/adminPanel/CouponForm";
import BlogForm from "../components/adminPanel/BlogForm";
import { FiPlus, FiX, FiBook, FiGift, FiFileText } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const AdminPanel = () => {
  const [isCouponFormVisible, setIsCouponFormVisible] = useState(false);
  const [isExamFormVisible, setIsExamFormVisible] = useState(false);
  const [isBlogFormVisible, setIsBlogFormVisible] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-10">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin Paneli
          </h2>
          <p className="text-gray-600 mt-2">Sistem yönetimini buradan gerçekleştirebilirsiniz</p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <motion.button
            onClick={() => {
              setIsExamFormVisible(!isExamFormVisible);
              setIsCouponFormVisible(false);
              setIsBlogFormVisible(false);
            }}
            className="flex items-center gap-2 py-3 px-6 rounded-xl text-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {isExamFormVisible ? (
              <FiX size={20} />
            ) : (
              <FiFileText size={20} />
            )}
            {isExamFormVisible ? "Formu Kapat" : "Yeni Sınav"}
          </motion.button>

          <motion.button
            onClick={() => {
              setIsCouponFormVisible(!isCouponFormVisible);
              setIsExamFormVisible(false);
              setIsBlogFormVisible(false);
            }}
            className="flex items-center gap-2 py-3 px-6 rounded-xl text-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {isCouponFormVisible ? (
              <FiX size={20} />
            ) : (
              <FiGift size={20} />
            )}
            {isCouponFormVisible ? "Formu Kapat" : "Yeni Kupon"}
          </motion.button>

          <motion.button
            onClick={() => {
              setIsBlogFormVisible(!isBlogFormVisible);
              setIsExamFormVisible(false);
              setIsCouponFormVisible(false);
            }}
            className="flex items-center gap-2 py-3 px-6 rounded-xl text-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {isBlogFormVisible ? (
              <FiX size={20} />
            ) : (
              <FiBook size={20} />
            )}
            {isBlogFormVisible ? "Formu Kapat" : "Yeni Blog"}
          </motion.button>
        </div>

        {/* Forms with Animation */}
        <AnimatePresence>
          {isExamFormVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <ExamForm />
            </motion.div>
          )}

          {isCouponFormVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <CouponForm />
            </motion.div>
          )}

          {isBlogFormVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <BlogForm />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isExamFormVisible && !isCouponFormVisible && !isBlogFormVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="bg-indigo-100 p-6 rounded-full mb-4">
              <FiPlus className="text-indigo-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Bir İşlem Seçin</h3>
            <p className="text-gray-600 max-w-md">
              Yönetim panelinde yapmak istediğiniz işlemi seçerek başlayabilirsiniz
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;