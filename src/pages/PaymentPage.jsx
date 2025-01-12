import Navbar from './../components/Navbar';
import ChatWithUs from './../components/ChatWithUs';
import { useState } from 'react';
import Footer from './../components/Footer';

const PaymentPage = () => {
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);

  const handlePriceSelection = (price) => {
    setSelectedPrice(price);
  };

  const handleAcceptanceChange = () => {
    setIsAccepted(!isAccepted);
  };

  return (
    <div>
        <Navbar />
        <ChatWithUs />
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-8 text-center h-[300px] flex justify-center items-center relative">
            <h2 className="text-2xl font-bold max-w-4xl">
              Platformamızın əsas məqsədi ölkəmizdə təhsilin keyfiyyətini yüksəltmək və müasir tədris metodları ilə hər kəsə bərabər imkanlar yaratmaqdır. Biz, texnologiyanın gücündən faydalanaraq, tələbələrə və müəllimlərə daha effektiv, innovativ və rəqabətcil bir təhsil mühiti təqdim etməyə çalışırıq.
            </h2>
        </div>

        {/* Pricing Section */}
        <div className="flex justify-center items-start space-x-8 p-8">
          {/* Left Side: Price Options */}
          <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Qiymət Seçin</h3>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => handlePriceSelection(5)} 
                className={`p-4 cursor-pointer border rounded-lg ${selectedPrice === 5 ? 'bg-violet-500 text-white' : 'bg-white text-black'}`}>
                5 AZN
              </div>
              <div 
                onClick={() => handlePriceSelection(10)} 
                className={`p-4 cursor-pointer border rounded-lg ${selectedPrice === 10 ? 'bg-violet-500 text-white' : 'bg-white text-black'}`}>
                10 AZN
              </div>
              <div 
                onClick={() => handlePriceSelection(20)} 
                className={`p-4 cursor-pointer border rounded-lg ${selectedPrice === 20 ? 'bg-violet-500 text-white' : 'bg-white text-black'}`}>
                20 AZN
              </div>
              <div 
                onClick={() => handlePriceSelection(30)} 
                className={`p-4 cursor-pointer border rounded-lg ${selectedPrice === 30 ? 'bg-violet-500 text-white' : 'bg-white text-black'}`}>
                30 AZN
              </div>
            </div>
          </div>

          {/* Right Side: Payment Details */}
          <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg h-auto">
            <h3 className="text-xl font-semibold mb-4">Ödəniş Detalları</h3>
            <div className="mb-4">
              <p className="text-lg">Seçilən Qiymət: {selectedPrice ? `${selectedPrice} AZN` : "Heç bir qiymət seçilməyib"}</p>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <input 
                type="checkbox" 
                id="accept" 
                onChange={handleAcceptanceChange} 
                checked={isAccepted} 
              />
              <label htmlFor="accept" className="text-sm">Ödənişi qəbul edirəm</label>
            </div>
            <button 
              disabled={!selectedPrice || !isAccepted} 
              className={`w-full py-2 bg-violet-500 text-white rounded-lg ${(!selectedPrice || !isAccepted) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
              Ödə
            </button>
          </div>
        </div>

        <Footer />
    </div>
  );
};

export default PaymentPage;
