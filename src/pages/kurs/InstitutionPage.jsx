import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUsers, FiBook, FiCalendar, FiClock, FiPlus, FiCheck } from 'react-icons/fi';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const InstitutionPage = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [institution, setInstitution] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);

  // Fetch institution and its exams
  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        // 1. Fetch institution details
        const institutionRef = doc(db, 'institutions', institutionId);
        const docSnap = await getDoc(institutionRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setInstitution(data);
          setIsMember(user?.uid && data.members?.includes(user.uid));
          
          // 2. Fetch exams from the new structure
          const examsRef = collection(db, 'institutionsExams', institutionId, 'Exams');
          const examsSnapshot = await getDocs(examsRef);
          
          const examsData = examsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Ensure we have institutionId for navigation
            institutionId: institutionId
          }));
          
          setExams(examsData);
        } else {
          navigate('/404');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitution();
  }, [institutionId, user?.uid]);

  const handleJoinInstitution = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/institutions/${institutionId}` } });
      return;
    }

    try {
      setJoining(true);
      const institutionRef = doc(db, 'institutions', institutionId);
      
      await updateDoc(institutionRef, {
        members: arrayUnion(user.uid)
      });

      // Update user document if needed
      const userRef = doc(db, 'Users', user.uid);
      await updateDoc(userRef, {
        institutions: arrayUnion(institutionId)
      });

      setIsMember(true);
      setInstitution(prev => ({
        ...prev,
        members: [...prev.members, user.uid]
      }));
    } catch (error) {
      console.error('Error joining institution:', error);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mb-8 md:mb-0 md:mr-10">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-full shadow-xl flex items-center justify-center overflow-hidden">
                {institution.logoUrl ? (
                  <img 
                    src={institution.logoUrl} 
                    alt={institution.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-gray-600">
                    {institution.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-4">
                {institution.name}
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                {institution.description || 'Eğitimde mükemmellik için bir arada'}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                <div className="flex items-center bg-blue-500 bg-opacity-20 px-4 py-2 rounded-full">
                  <FiUsers className="text-white mr-2" />
                  <span className="text-white">
                    {institution.members?.length || 0} Üye
                  </span>
                </div>
                
                <div className="flex items-center bg-blue-500 bg-opacity-20 px-4 py-2 rounded-full">
                  <FiBook className="text-white mr-2" />
                  <span className="text-white">
                    {exams.length} Sınav
                  </span>
                </div>
              </div>
              
              {!isMember ? (
                <button
                  onClick={handleJoinInstitution}
                  disabled={joining}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                    joining ? 'bg-blue-400' : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {joining ? (
                    'Katılıyor...'
                  ) : (
                    <>
                      <FiPlus className="mr-2" />
                      Kuruma Katıl
                    </>
                  )}
                </button>
              ) : (
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                  <FiCheck className="mr-2" />
                  Zaten üyesiniz
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kurum Hakkında</h2>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-700">
              {institution.about || 'Bu kurum hakkında detaylı bilgi bulunmamaktadır.'}
            </p>
          </div>
        </section>

        {/* Exams Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Aktif Sınavlar</h2>
          
          {exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <motion.div
                  key={exam.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                >
                  <Link 
                    to={`/category/${encodeURIComponent(exam.category)}/class/${encodeURIComponent(exam.class)}/exam/${encodeURIComponent(exam.id)}/details${exam.institutionId ? `?institutionId=${exam.institutionId}` : ''}`}
  className="block p-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {exam.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {exam.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiCalendar className="mr-1" />
                        {exam.startDate || 'Tarih belirtilmemiş'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiClock className="mr-1" />
                        {exam.duration} dakika
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Sınava Git
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <FiBook className="mx-auto text-gray-400 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz aktif sınav bulunmamaktadır
              </h3>
              <p className="text-gray-500">
                Bu kurum tarafından yayınlanmış aktif sınav bulunmuyor
              </p>
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
};

export default InstitutionPage;