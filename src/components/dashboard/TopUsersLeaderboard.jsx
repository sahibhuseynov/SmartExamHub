import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaCrown } from 'react-icons/fa';  // Taç simgesi lider kullanıcı için
import { FiUser } from 'react-icons/fi';  // Kullanıcı ikonu
import { GiRank3 } from 'react-icons/gi';  // Sıralama ikonu

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

          usersData.push({
            id: doc.id,
            name: userData.name || 'Bilinmeyen Kullanıcı',
            averageSuccessRate,
          });
        });

        usersData.sort((a, b) => b.averageSuccessRate - a.averageSuccessRate);
        setTopUsers(usersData.slice(0, 5));
      } catch (error) {
        console.error('En iyi kullanıcılar alınırken hata oluştu:', error);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <div className=" p-6  ">
      <h2 className="text-3xl font-bold mb-6 text-black flex items-center gap-2">
        <GiRank3 /> Ən Yüksək Uğura Sahib İstifadəçilər
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
                {user.averageSuccessRate.toFixed(2)}%
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
