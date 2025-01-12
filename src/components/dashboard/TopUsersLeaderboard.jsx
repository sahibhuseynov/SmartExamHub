import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaCrown } from 'react-icons/fa';  // Taç simgesi lider kullanıcı için
import { FiUser } from 'react-icons/fi';  // Kullanıcı ikonu

const TopUsersLeaderboard = () => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const usersRef = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersRef);

        const usersData = [];
        usersSnapshot.forEach(doc => {
          const userData = doc.data();
          const exams = userData.exams || [];

          const totalCorrectAnswers = exams.reduce((sum, exam) => sum + (exam.correctAnswers || 0), 0);
          const totalQuestions = exams.reduce((sum, exam) => sum + (exam.totalQuestions || 0), 0);
          const averageSuccessRate = totalQuestions > 0 ? (totalCorrectAnswers / totalQuestions) * 100 : 0;
          const totalPoints = totalCorrectAnswers;  // Toplam puan

          if (totalPoints > 0) {  // Yalnızca puanı 0'dan büyük kullanıcılar
            if (doc.id) {
              updateUserPoints(doc.id, totalPoints);
            }
            usersData.push({
              id: doc.id,
              name: userData.displayName || userData.name || 'Bilinmeyen Kullanıcı',  // `displayName` öncelikli olaraq göstərilir
              averageSuccessRate,
              totalPoints,
            });
          }
        });

        usersData.sort((a, b) => b.totalPoints - a.totalPoints);
        setTopUsers(usersData.slice(0, 5));  // En yüksek 5 kullanıcıyı göster
      } catch (error) {
        console.error('En iyi kullanıcılar alınırken hata oluştu:', error);
      }
    };

    fetchTopUsers();
  }, []);

  // Firebase'deki kullanıcının puanını güncelleyen fonksiyon
  const updateUserPoints = async (userId, points) => {
    try {
      const userRef = doc(db, 'Users', userId);
      await updateDoc(userRef, {
        points: points,  // Puanları ekliyoruz
      });
    } catch (error) {
      console.error('Puan güncellenirken hata oluştu:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-black flex items-center gap-2">
         Ən Yüksək Uğura Sahib İstifadəçilər
      </h2>
      <ul>
        {topUsers.length > 0 ? (
          topUsers.map((user, index) => (
            <li
              key={user.id}
              className={`py-4 px-6 mb-3 rounded-lg flex justify-between items-center shadow ${
                index === 0 ? 'bg-green-100' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                {index === 0 ? (
                  <FaCrown className="text-yellow-500 text-2xl" />
                ) : (
                  <FiUser className="text-gray-500 text-2xl" />
                )}
                <span className="font-semibold text-lg">{user.name}</span>
              </div>
              <span className="text-xl font-bold text-gray-700">
                {user.totalPoints} Puan
              </span>
            </li>
          ))
        ) : (
          <p className="text-white">Kullanıcı bilgileri yükleniyor veya mevcut değil.</p>
        )}
      </ul>
    </div>
  );
};

export default TopUsersLeaderboard;
