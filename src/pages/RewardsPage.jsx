import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FaMedal, FaCrown, FaStar, FaGift, FaGem,FaAward } from 'react-icons/fa'; 
import Navbar from './../components/Navbar';

const rankConfig = [
    { name: 'Başlanğıc', icon: <FaStar />, points: 0, reward: 'Təbrik Rozeti' },
    { name: 'Bürünc', icon: <FaMedal />, points: 100, reward: 'Bürünc Sertifikat və Bürünc Məktəbli Dəsti ' },
    { name: 'Gümüş', icon: <FaAward />, points: 300, reward: 'Gümüş Sertifikat və 30 AZN Mükafat' },
    { name: 'Qızıl', icon: <FaCrown />, points: 500, reward: 'Qızıl Sertifikat, 50 AZN Mükafat və Oyal Məktəbli Dəsti' },
    { name: 'Platin', icon: <FaGem />, points: 750, reward: 'Platin Sertifikat, 100 AZN Mükafat və Premium Təhsil Dəsti' },
    { name: 'Diamond', icon: <FaGift />, points: 1000, reward: 'Exclusive Hədiyyə' },
    
];

const RewardsPage = () => {
  const [points, setPoints] = useState(0);
  const userId = useSelector((state) => state.user.user?.uid); 

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (!userId) return;
      try {
        const usersRef = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersRef);

        usersSnapshot.forEach((doc) => {
          if (doc.id === userId) {
            const userData = doc.data();
            setPoints(userData.points || 0);
          }
        });
      } catch (error) {
        console.error('Xal məlumatı alınarkən xəta:', error);
      }
    };

    fetchUserPoints();
  }, [userId]);

  const currentRankIndex = rankConfig.findIndex((rank) => points < rank.points) - 1;
  const currentRank = rankConfig[currentRankIndex >= 0 ? currentRankIndex : rankConfig.length - 1];
  const nextRank = rankConfig[currentRankIndex + 1] || { name: 'Maksimum', points: points, reward: 'Son Hədiyyə' };
  const pointsNeeded = nextRank.points - points;

  return (
   <div>
    <Navbar />
        <div className="p-6 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center animate-fade-in"><sapn className='text-blue-600'>Hədiyyələr</sapn> və Rütbələr</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rankConfig.map((rank, index) => (
              <div
                key={rank.name}
                className={`relative p-6 shadow-xl rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl ${
                  index <= currentRankIndex ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white' : 'bg-white text-gray-800'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="text-5xl">{rank.icon}</div>
                  <span className="text-3xl font-bold">{rank.points}+</span>
                </div>
                <h3 className="text-2xl font-semibold">{rank.name}</h3>
                <p className="mt-2 text-lg">Hədiyyə: {rank.reward}</p>
                {index === currentRankIndex + 1 && (
                  <div className="absolute top-2 right-2 bg-yellow-300 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    {pointsNeeded} xal qalır
                  </div>
                )}
              </div>
            ))}
          </div>
    
          <div className="mt-12 text-center p-6  bg-white">
            <h3 className="text-xl font-semibold">Cari Rütbə</h3>
            <p className="text-2xl flex items-center justify-center gap-2 mt-4">
              {currentRank.icon} <span>{currentRank.name}</span>
            </p>
            <p className="text-lg mt-2">Toplanmış Xallar: <span className="font-bold text-blue-600">{points}</span></p>
          </div>
        </div>
   </div>
  );
};

export default RewardsPage;
