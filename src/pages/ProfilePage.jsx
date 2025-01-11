import { useState } from 'react';
import { useSelector } from 'react-redux';
import RankBadgeImg from '../assets/rankbadge.png'; // Rozet görseli
import Navbar from '../components/Navbar';
import { IoStarSharp } from "react-icons/io5";
const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('exams');
  const userName = useSelector((state) => state.user.user.displayName);

  const renderContent = () => {
    switch (activeTab) {
      case 'exams':
        return <div className="text-lg">İmtahanlarım</div>;
      case 'certificates':
        return <div className="text-lg">Sertifikatlarım</div>;
      case 'balance':
        return <div className="text-lg">Balansım</div>;
      case 'settings':
        return <div className="text-lg">Ayarlar</div>;
        case 'badge':
        return <div className="text-lg">Rozetlərim</div>;
      default:
        return <div className="text-lg">İmtahanlarım</div>;
    }
  };

  return (
   <div className='bg-gray-50'>
    <Navbar />
        <div className="flex  h-screen max-w-7xl mx-auto py-7 ">
          {/* Sol Menü */}
          <div className="w-1/4 bg-white p-6 shadow-md rounded-lg">
            {/* Profil Başlığı */}
            <div className="text-center flex flex-col items-center mb-8">
              <img src={RankBadgeImg} alt="Rozet" className="w-32 h-32 object-cover" />
              <h2 className="text-2xl font-bold text-gray-800">{userName}</h2>
              <div className='flex gap-1 items-center mt-2'><p className="text-sm text-gray-500">Kəşfiyyatçı</p>
              <IoStarSharp />
              </div>
            </div>
    
            <h3 className="text-lg font-semibold mb-4">Profil Menyusu</h3>
            <ul className="space-y-3">
              {[
                { label: 'İmtahanlarım', tab: 'exams' },
                { label: 'Sertifikatlarım', tab: 'certificates' },
                { label: 'Balansım', tab: 'balance' },
                { label: 'Ayarlar', tab: 'settings' },
                { label: 'Rozetlərim', tab: 'badge' },
              ].map(({ label, tab }) => (
                <li key={tab}>
                  <button
                    className={`w-full text-left px-5 py-3 rounded-lg font-medium ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
    
          {/* Sağ İçerik */}
          <div className="flex-1 bg-white p-8 shadow-md rounded-lg ml-4">{renderContent()}</div>
        </div>
   </div>
  );
};

export default ProfilePage;
