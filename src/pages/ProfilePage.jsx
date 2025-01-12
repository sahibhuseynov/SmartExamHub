import { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { FaStar } from 'react-icons/fa';
import CompletedExams from './../components/dashboard/CompletedExams';
import Settings from './../components/dashboard/Settings';
const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('exams');
  const user = useSelector((state) => state.user.user);
  console.log(user)
  const renderContent = () => {
    switch (activeTab) {
      case 'exams':
        return <div className="text-lg">
          <CompletedExams />
        </div>;
      case 'certificates':
        return <div className="text-lg">Sertifikatlarım</div>;
      case 'balance':
        return <div className="text-lg">Balansım</div>;
      case 'settings':
        return <div className="text-lg"><Settings /></div>;
        case 'badge':
        return <div className="text-lg">Rozetlərim</div>;
      default:
        return <div className="text-lg">İmtahanlarım</div>;
    }
  };

  return (
   <div className='bg-gray-50'>
    <Navbar />
        <div className="flex   max-w-7xl mx-auto py-7 ">
          {/* Sol Menü */}
          <div className="w-1/4 bg-white p-6 shadow-md rounded-lg">
            {/* Profil Başlığı */}
            <div className="text-center flex flex-col items-center mb-8">
              <img  src={user.photoURL} alt="Rozet" className="w-28 h-28 object-cover rounded-full" />
              <h2 className="text-2xl font-bold text-gray-800">{user.displayName}</h2>
              <div className='flex gap-1 items-center mt-2'><p className="text-sm text-gray-500">Başlanğıc</p>
              <FaStar />
              </div>
            </div>
    
            
            <ul className="space-y-3">
              {[
                { label: 'Nəticələrim', tab: 'exams' },
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
