import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiUsers, FiFileText, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const KurumDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    students: 0,
    exams: 0,
    certificates: 0
  });

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        students: 342,
        exams: 15,
        certificates: 278
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Recent activity data
  const recentActivity = [
    { id: 1, type: 'exam', title: 'Matematik Ara Sınavı', date: '10 Dakika Önce', status: 'active' },
    { id: 2, type: 'student', title: '3 Yeni Öğrenci Kaydı', date: '1 Saat Önce', status: 'completed' },
    { id: 3, type: 'certificate', title: 'Sertifikalar Dağıtıldı', date: '3 Gün Önce', status: 'completed' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-64 bg-white shadow-md"
      >
        <div className="p-6 border-b border-gray-200">
          <Link to={"/"}><h1 className="text-xl font-bold text-gray-800">Balabebir</h1></Link>
          <p className="text-sm text-gray-500">Eğitim Yönetim Paneli</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FiBarChart2 className="mr-3" />
                Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('students')}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'students' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FiUsers className="mr-3" />
                Öğrenciler
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('exams')}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'exams' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FiBook className="mr-3" />
                Sınavlar
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('certificates')}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'certificates' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FiFileText className="mr-3" />
                Sertifikalar
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <FiSettings className="mr-3" />
            Ayarlar
          </button>
          <button className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <FiLogOut className="mr-3" />
            Çıkış Yap
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Ara..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Toplam Öğrenci</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.students}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <FiUsers size={24} />
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Son 30 günde %12 artış</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Aktif Sınavlar</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.exams}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                  <FiBook size={24} />
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '40%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">2 yeni sınav bu hafta</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Verilen Sertifikalar</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.certificates}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 text-green-600">
                  <FiFileText size={24} />
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">%98 tamamlama oranı</p>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Son Aktivite</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <motion.div 
                  key={activity.id}
                  whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                  className="p-4 flex items-start"
                >
                  <div className={`p-2 rounded-lg mr-4 ${
                    activity.type === 'exam' ? 'bg-blue-50 text-blue-600' :
                    activity.type === 'student' ? 'bg-green-50 text-green-600' :
                    'bg-purple-50 text-purple-600'
                  }`}>
                    {activity.type === 'exam' && <FiBook size={20} />}
                    {activity.type === 'student' && <FiUsers size={20} />}
                    {activity.type === 'certificate' && <FiFileText size={20} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{activity.title}</h4>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activity.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {activity.status === 'active' ? 'Devam Ediyor' : 'Tamamlandı'}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 text-center">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Tüm Aktiviteyi Görüntüle
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center hover:bg-blue-50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                <FiBook size={24} />
              </div>
              <span className="font-medium text-gray-800">Yeni Sınav Oluştur</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center hover:bg-green-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                <FiUsers size={24} />
              </div>
              <span className="font-medium text-gray-800">Öğrenci Ekle</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center hover:bg-purple-50 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-3">
                <FiFileText size={24} />
              </div>
              <span className="font-medium text-gray-800">Sertifika Gönder</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center hover:bg-yellow-50 transition-colors"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-3">
                <FiBarChart2 size={24} />
              </div>
              <span className="font-medium text-gray-800">Rapor Al</span>
            </motion.button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KurumDashboard; 