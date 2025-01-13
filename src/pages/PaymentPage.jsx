import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import paymentIcon from '../assets/payment.png';
import Navbar from './../components/Navbar';
import ChatWithUs from './../components/ChatWithUs';
import Footer from './../components/Footer';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PaymentPage = () => {
  const query = useQuery();
  const initialPrice = query.get('price');
  const examName = query.get('examId');

  const [selectedPrice, setSelectedPrice] = useState(Number(initialPrice));
  const [isAccepted, setIsAccepted] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  const handlePriceSelection = (price) => {
    setSelectedPrice(price);
  };

  const handleAcceptanceChange = () => {
    setIsAccepted(!isAccepted);
  };

  const handleSaveCardChange = () => {
    setSaveCard(!saveCard);
  };

  return (
    <div className=''>
      <Navbar />
      <ChatWithUs />

      {/* Header Section */}
      <div className="bg-gradient-to-r  from-violet-500 to-purple-500 text-white h-[300px] flex justify-center items-center relative">
        <div className='max-w-6xl mx-auto flex items-center text-center'>
            <img src={paymentIcon} alt="Payment Icon" className="w-64 h-64 object-cover" />
            <h2 className="text-2xl font-bold max-w-3xl leading-relaxed">
              Platformamızda ödənişlər tam təhlükəsizdir. Biz, müasir texnologiyalarla hər kəsə əlçatan və rahat ödəmə imkanları təqdim edirik.
            </h2>
        </div>
      </div>

      {/* Pricing and Details Section */}
      <div className="flex max-w-6xl mx-auto justify-center items-start gap-8 my-12 p-12">
        {/* Left: Price Options */}
        <div className="bg-white w-1/2 p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-6">MƏBLƏĞİ SEÇİN</h3>
          <div className="grid grid-cols-3 gap-4">
            {[1, 3, 5, 10, 20, 30].map((price) => (
              <div
                key={price}
                onClick={() => handlePriceSelection(price)}
                className={`p-5 cursor-pointer border rounded-lg flex flex-col items-center justify-center text-center transition-all duration-300 ${
                  selectedPrice === price ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 bg-gray-50 text-gray-700 hover:shadow-md'
                }`}
              >
                <div className="text-3xl font-bold">{price} ₼</div>
                <div className="text-sm mt-1">Yeni balans: ₼{price}.00</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Payment Details */}
        <div className="bg-white w-1/2 flex flex-col items-start justify-start p-12 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-semibold mb-6">Ödəniş Detalları</h3>
          <div className="space-y-4">
            <p className="text-xl font-medium">Seçilən İmtahan: <span className="font-normal">{examName || 'Adı mövcud deyil'}</span></p>
            <p className="text-xl font-medium">Ödəniləcək məbləğ: <span className="font-medium text-green-400">{selectedPrice ? `₼${selectedPrice}.00` : 'Seçilməyib'}</span></p>
          </div>
          <div className="mt-6 space-y-3">
            {/* DaisyUI Radio Button (sol taraf) */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
               
                <input
                  type="radio"
                  name="paymentMethod"
                  id="creditCard"
                  checked
                  readOnly
                  className="radio radio-primary"
                />
                 <span className="label-text text-base">Bank kartı ilə</span>
              </label>
            </div>
            {/* DaisyUI Checkbox for saving card (sol taraf) */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                
                <input
                  type="checkbox"
                  id="saveCard"
                  onChange={handleSaveCardChange}
                  checked={saveCard}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text text-base">Kartı gələcək ödənişlər üçün yadda saxla</span>
              </label>
            </div>
            <p className='my-8 text-sm'>Kartın məxfi məlumatları üçüncü tərəflər tərəfindən <span className='text-black font-medium'>toplanmır və qorunur</span>.</p>
            {/* DaisyUI Checkbox for accepting terms (sol taraf) */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                
                <input
                  type="checkbox" 
                  id="accept"
                  onChange={handleAcceptanceChange}
                  checked={isAccepted}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text text-base">Ödəniş şərtlərini qəbul edirəm</span>
              </label>
            </div>
          </div>
          <button
            disabled={!selectedPrice || !isAccepted}
            className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
              !selectedPrice || !isAccepted ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            ÖDƏ
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;
