import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { FaMedal, FaCrown, FaStar, FaGift, FaGem, FaAward } from 'react-icons/fa';

const rankConfig = [
    { name: 'Başlanğıc', icon: <FaStar />, points: 0, reward: 'Təbrik Rozeti' },
    { name: 'Bürünc', icon: <FaMedal />, points: 100, reward: 'Bürünc Sertifikat və Bürünc Məktəbli Dəsti' },
    { name: 'Gümüş', icon: <FaAward />, points: 300, reward: 'Gümüş Sertifikat və 30 AZN Mükafat' },
    { name: 'Qızıl', icon: <FaCrown />, points: 500, reward: 'Qızıl Sertifikat, 50 AZN Mükafat və Oyal Məktəbli Dəsti' },
    { name: 'Platin', icon: <FaGem />, points: 750, reward: 'Platin Sertifikat, 100 AZN Mükafat və Premium Təhsil Dəsti' },
    { name: 'Diamond', icon: <FaGift />, points: 1000, reward: 'Exclusive Hədiyyə' },
];

const UserBadges = () => {
    const [points, setPoints] = useState(0);
    const userUID = useSelector((state) => state.user.user.uid); // Redux'dan UID alınması

    useEffect(() => {
        const fetchUserBadges = async () => {
            if (!userUID) return;

            try {
                const userDocRef = doc(db, "Users", userUID);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setPoints(userData.points || 0);
                } else {
                    console.log("Kullanıcı verisi bulunamadı.");
                }
            } catch (error) {
                console.error("Rozetler alınırken hata oluştu:", error);
            }
        };

        fetchUserBadges();
    }, [userUID]);

    const currentRankIndex = rankConfig.findIndex((rank) => points < rank.points) - 1;
    const currentRank = rankConfig[currentRankIndex >= 0 ? currentRankIndex : rankConfig.length - 1];
    const nextRank = rankConfig[currentRankIndex + 1] || { name: 'Maksimum', points: points, reward: 'Son Hədiyyə' };
    const pointsNeeded = nextRank.points - points;

    return (
        <div className="container mx-auto ">
            <h2 className="text-3xl font-semibold  text-gray-900 mb-6">Rozetlerim ve Hədiyyələrim</h2>

            {/* Current Rank Section */}
            <div className=" shadow-2xl rounded-xl p-8 mb-8">
                <h3 className="text-2xl font-bold ">Cari Rütbə</h3>
                <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="text-5xl ">{currentRank.icon}</div>
                    <span className="text-3xl font-semibold ">{currentRank.name}</span>
                </div>
                <p className="text-lg mt-4 ">Toplanmış Xallar: <span className="font-bold ">{points}</span></p>
                <p className="mt-4 text-lg ">Bir sonraki hədiyyə: <span className="font-semibold ">{nextRank.reward}</span></p>

                {pointsNeeded > 0 && (
                    <p className="mt-4 text-sm ">Gerekli Xallar: <span className="font-bold ">{pointsNeeded}</span></p>
                )}
            </div>

            {/* Rank List Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {rankConfig.map((rank, index) => (
                    <div
                        key={rank.name}
                        className={`relative p-6 shadow-lg rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl ${
                            index <= currentRankIndex ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white' : 'bg-white text-gray-800'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-4xl">{rank.icon}</div>
                            <span className="text-2xl font-bold">{rank.points}+</span>
                        </div>
                        <h3 className="text-xl font-semibold">{rank.name}</h3>
                        <p className="mt-2 text-lg">Hədiyyə: {rank.reward}</p>
                        {index === currentRankIndex + 1 && (
                            <div className="absolute top-2 right-2 bg-yellow-300 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                {pointsNeeded} xal qalır
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserBadges;
