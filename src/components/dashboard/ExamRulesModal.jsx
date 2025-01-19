import { useState, useEffect } from "react";
import { FaCertificate } from "react-icons/fa";

const ExamRulesModal = ({ showModal, closeModal, isCertifiedExam, isLoading }) => {
  const [showCertificateText, setShowCertificateText] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowCertificateText(true);
    }
  }, [isLoading]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 md:p-8 ">
    <h1 className="text-2xl md:text-4xl font-extrabold text-center text-gray-900 mb-4 md:mb-8">
      İmtahan Haqqında
    </h1>
    
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Qaydalar</h2>
    <ul className="list-inside list-disc text-gray-700 text-sm md:text-base space-y-2 md:space-y-3">
      <li>İmtahanı bitirdikdən sonra nəticəni görə bilərsiniz.</li>
      <li>Cavab verməyə istədiyiniz sualdan başlaya bilərsiniz.</li>
      <li>Yanlış cavablar doğru cavablara təsir göstərmir.</li>
      <li>Hər doğru cavab 1 bal ilə qiymətləndirilir.</li>
    </ul>

    <div className="flex items-center gap-2 md:gap-4 mt-6 md:mt-8 bg-yellow-50 p-3 md:p-4 rounded-lg border border-yellow-200">
      <FaCertificate size={32} className="text-yellow-500 " />
      <p className="text-sm md:text-lg text-gray-800">
        {showCertificateText
          ? isCertifiedExam
            ? "Bu imtahanın sonunda uğur faizinizə əsasən sertifikat veriləcəkdir."
            : "Bu imtahanda sertifikat təqdim edilmir."
          : "Yüklənir..."}
      </p>
    </div>

    <div className="mt-8 md:mt-10 flex justify-center">
      <button
        onClick={closeModal}
        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-2 md:py-3 px-6 md:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out text-sm md:text-base"
      >
        İmtahana Başla
      </button>
    </div>
  </div>
</div>

  );
};

export default ExamRulesModal;
