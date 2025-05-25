import { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { FiUser, FiMail, FiClock, FiAward as FiBadge, FiSearch, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Kullanıcıları çek
  // Kullanıcıları ve sınavlarını çek
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          lastLogin: doc.data().lastLogin?.toDate()
        }));
        
        const usersWithExams = await Promise.all(
          usersData.map(async (user) => {
            // Kullanıcının CompletedExams koleksiyonundan sınavları çek
            const examsSnapshot = await getDocs(
              collection(db, "Users", user.id, "CompletedExams")
            );
            const exams = examsSnapshot.docs.map(exam => ({
              id: exam.id,
              ...exam.data(),
              completedAt: new Date(exam.data().completedAt) // String'i Date'e çevir
            }));
            
            return { ...user, exams };
          })
        );
        
        setUsers(usersWithExams);
        setFilteredUsers(usersWithExams);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        toast.error("Kullanıcı verileri yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Arama fonksiyonu
  useEffect(() => {
    const results = users.filter(user =>
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  // Kullanıcı silme fonksiyonu
   const handleDeleteUser = async (userId) => {
    if (window.confirm("Bu kullanıcıyı ve tüm sınav kayıtlarını silmek istediğinize emin misiniz?")) {
      try {
        // Kullanıcının sınavlarını sil
        const examsSnapshot = await getDocs(
          collection(db, "Users", userId, "CompletedExams")
        );
        const deleteExams = examsSnapshot.docs.map(exam => 
          deleteDoc(doc(db, "Users", userId, "CompletedExams", exam.id))
        );
        await Promise.all(deleteExams);

        // Kullanıcıyı sil
        await deleteDoc(doc(db, "users", userId));
        
        // State'i güncelle
        setUsers(users.filter(user => user.id !== userId));
        setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
        
        toast.success("Kullanıcı ve sınav kayıtları başarıyla silindi");
      } catch (error) {
        console.error("Silme işlemi hatası:", error);
        toast.error("Silme işlemi sırasında hata oluştu");
      }
    }
  };
  // Kullanıcı detay bileşeni
  const UserDetail = ({ user }) => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm p-6 mt-4 overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-6">
          <div className="bg-gray-100 p-4 rounded-full">
            <FiUser size={24} className="text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{user.displayName || 'İsimsiz Kullanıcı'}</h3>
            <p className="text-gray-600 flex items-center mt-1">
              <FiMail className="mr-2" /> {user.email}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              <FiClock className="mr-1 inline" /> 
              Son Giriş: {user.lastLogin?.toLocaleDateString() || 'Bilinmiyor'}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleDeleteUser(user.id)}
          className="text-red-600 hover:text-red-800 p-2"
          title="Kullanıcıyı Sil"
        >
          <FiTrash2 size={20} />
        </button>
      </div>

      <div className="mt-6">
        <h4 className="font-medium text-gray-800 mb-3">Sınav Geçmişi</h4>
         {user.exams?.length > 0 ? (
          <div className="space-y-4">
            {user.exams.map((exam, index) => (
              <div key={index} className="border-l-4 border-indigo-200 pl-4 py-2">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">{exam.examId}</span>
                    <span className="ml-3 text-sm text-gray-500">{exam.categoryId}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    exam.successRate > 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {exam.successRate || 0}% Başarı
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="mr-3">Sınıf: {exam.classId}</span>
                  <span>Tarih: {exam.completedAt?.toLocaleDateString()}</span>
                </div>
                {exam.hasStarterBadge && (
                  <div className="flex items-center text-sm text-yellow-600 mt-1">
                    <FiBadge className="mr-1" /> Başlangıç Rozeti
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Henüz sınav kaydı bulunmamaktadır.</p>
        )}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Kullanıcılar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Arama Çubuğu */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Kullanıcı Listesi */}
      <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Kullanıcılar ({filteredUsers.length})</h3>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm ? "Aradığınız kriterlere uygun kullanıcı bulunamadı" : "Kullanıcı bulunmamaktadır"}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div key={user.id}>
                <motion.div 
                  whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                  className="p-4 cursor-pointer"
                  onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <FiUser className="text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{user.displayName || 'İsimsiz Kullanıcı'}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {user.exams?.length || 0} sınav
                      </span>
                    </div>
                  </div>
                </motion.div>
                
                {selectedUser?.id === user.id && <UserDetail user={user} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;