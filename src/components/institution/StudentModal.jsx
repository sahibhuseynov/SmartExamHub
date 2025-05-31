import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayRemove, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiUser, FiMail, FiCalendar, FiAward, FiSend, FiTrash2, FiGift, FiBell } from 'react-icons/fi';
import { motion } from 'framer-motion';
import StudentModal from './StudentModal';

const StudentsTab = ({ institutionId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        
        // 1. Kurumdaki member UID'lerini al
        const institutionRef = doc(db, 'institutions', institutionId);
        const institutionSnap = await getDoc(institutionRef);
        
        if (!institutionSnap.exists()) {
          setStudents([]);
          return;
        }

        const memberUIDs = institutionSnap.data().members || [];
        
        // 2. Her UID için Users koleksiyonundan detaylı bilgileri çek
        const usersRef = collection(db, 'Users');
        const usersQuery = query(usersRef, where('__name__', 'in', memberUIDs));
        const usersSnapshot = await getDocs(usersQuery);
        
        const studentsData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setStudents(studentsData);
      } catch (error) {
        console.error("Öğrenci bilgileri çekilirken hata:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [institutionId]);

  const handleRemoveStudent = async (studentId) => {
    try {
      // 1. Kurumun members array'inden kaldır
      const institutionRef = doc(db, 'institutions', institutionId);
      await updateDoc(institutionRef, {
        members: arrayRemove(studentId)
      });
      
      // 2. Local state'i güncelle
      setStudents(prev => prev.filter(student => student.id !== studentId));
    } catch (error) {
      console.error("Öğrenci kurumdan çıkarılırken hata:", error);
    }
  };

  const filteredStudents = students.filter(student =>
    student.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Arama ve başlık kısmı aynı kalacak */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Öğrenci Yönetimi</h2>
          <p className="text-gray-500">{students.length} kayıtlı öğrenci</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Öğrenci ara..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      {/* Öğrenci tablosu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Öğrenci</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          {student.photoURL ? (
                            <img className="h-10 w-10 rounded-full" src={student.photoURL} alt={student.displayName} />
                          ) : (
                            <FiUser className="text-lg" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.displayName || 'İsimsiz Kullanıcı'}</div>
                          <div className="text-sm text-gray-500">{student.role || 'Öğrenci'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FiMail className="mr-2 text-gray-400" />
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <FiCalendar className="mr-2 text-gray-400" />
                        {student.createdAt?.toDate?.().toLocaleDateString('tr-TR') || 'Bilinmiyor'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {/* Aksiyon butonları */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg"
                          title="Detaylar"
                        >
                          <FiUser className="text-lg" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-green-600 hover:text-green-800 bg-green-50 rounded-lg"
                          title="Sertifika Gönder"
                        >
                          <FiAward className="text-lg" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-purple-600 hover:text-purple-800 bg-purple-50 rounded-lg"
                          title="Bildirim Gönder"
                        >
                          <FiBell className="text-lg" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-yellow-600 hover:text-yellow-800 bg-yellow-50 rounded-lg"
                          title="Kupon Gönder"
                        >
                          <FiGift className="text-lg" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveStudent(student.id)}
                          className="p-2 text-red-600 hover:text-red-800 bg-red-50 rounded-lg"
                          title="Öğrenciyi Sil"
                        >
                          <FiTrash2 className="text-lg" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'Aradığınız kriterlere uygun öğrenci bulunamadı' : 'Henüz kayıtlı öğrenci yok'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Öğrenci Detay Modal'ı */}
      {showModal && selectedStudent && (
        <StudentModal 
          student={selectedStudent} 
          onClose={() => setShowModal(false)} 
          onSendCertificate={() => console.log('Send certificate to:', selectedStudent.id)}
          onSendNotification={() => console.log('Send notification to:', selectedStudent.id)}
        />
      )}
    </div>
  );
};

export default StudentsTab;