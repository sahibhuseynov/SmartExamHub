import { useState, useEffect } from "react";
import { FaCertificate, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ExamRulesModal = ({ showModal, closeModal, isCertifiedExam, isLoading }) => {
  const [showCertificateText, setShowCertificateText] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowCertificateText(true);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="relative p-6 md:p-8">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>

              <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  İmtahan Qaydaları
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-3 rounded-full" />
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5">
                    1
                  </div>
                  <p className="text-gray-700">
                    İmtahanı bitirdikdən sonra nəticəni görə bilərsiniz.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5">
                    2
                  </div>
                  <p className="text-gray-700">
                    Cavab verməyə istədiyiniz sualdan başlaya bilərsiniz.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5">
                    3
                  </div>
                  <p className="text-gray-700">
                    Yanlış cavablar doğru cavablara təsir göstərmir.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5">
                    4
                  </div>
                  <p className="text-gray-700">
                    Hər doğru cavab 1 bal ilə qiymətləndirilir.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50/70 border border-yellow-100 rounded-lg p-4 mb-8 flex items-start gap-4">
                <FaCertificate size={24} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  {showCertificateText
                    ? isCertifiedExam
                      ? "Bu imtahanın sonunda uğur faizinizə əsasən rəqəmsal sertifikat alacaqsınız."
                      : "Bu imtahanda sertifikat təqdim edilmir."
                    : "Yüklənir..."}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-6 rounded-lg shadow-md "
              >
                İmtahana Başla
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExamRulesModal;