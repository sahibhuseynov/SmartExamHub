import { useState, useEffect } from "react";
import { collection, getDocs,} from "firebase/firestore";
import ExamForm from "../components/adminPanel/ExamForm";
import CouponForm from "../components/adminPanel/CouponForm";
import BlogForm from "../components/adminPanel/BlogForm"
import UserList from "../components/adminPanel/UserList";

import { 
  FiBook, FiGift, FiFileText, 
  FiUsers, FiHome, FiBarChart2, 
  FiAward, 
  FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { db } from "../firebase/config";




const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminPanel = () => {
  const [isCouponFormVisible, setIsCouponFormVisible] = useState(false);
  const [isExamFormVisible, setIsExamFormVisible] = useState(false);
  const [isBlogFormVisible, setIsBlogFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    users: 0,
    institutions: 0,
    exams: 0,
    certificates: 0
  });
  const [loading, setLoading] = useState(true);

  // Firestore'dan verileri çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tüm istatistikleri tek seferde çek
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const institutionsSnapshot = await getDocs(collection(db, "institutions"));
        const examsSnapshot = await getDocs(collection(db, "Exams"));
        const certificatesSnapshot = await getDocs(collection(db, "certificates"));

        setStats({
          users: usersSnapshot.size,
          institutions: institutionsSnapshot.size,
          exams: examsSnapshot.size,
          certificates: certificatesSnapshot.size
        });
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Grafik verileri
  const chartData = [
    { name: 'Kullanıcılar', value: stats.users },
    { name: 'Kurumlar', value: stats.institutions },
    { name: 'Sınavlar', value: stats.exams },
    { name: 'Sertifikalar', value: stats.certificates }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg hidden md:block">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Paneli
            </h2>
          </div>
         
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiBarChart2 className="mr-3" />
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'users' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiUsers className="mr-3" />
                  Kullanıcılar
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('institutions')}
                  className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'institutions' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiHome className="mr-3" />
                  Kurumlar
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('exams')}
                  className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'exams' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiFileText className="mr-3" />
                  Sınavlar
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {activeTab === 'dashboard' && 'Genel İstatistikler'}
              {activeTab === 'users' && 'Kullanıcı Yönetimi'}
              {activeTab === 'institutions' && 'Kurum Yönetimi'}
              {activeTab === 'exams' && 'Sınav Yönetimi'}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Yükleniyor...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                      title="Toplam Kullanıcı" 
                      value={stats.users} 
                      icon={<FiUsers className="text-indigo-600" size={24} />} 
                      color="indigo"
                    />
                    <StatCard 
                      title="Toplam Kurum" 
                      value={stats.institutions} 
                      icon={<FiHome className="text-green-600" size={24} />} 
                      color="green"
                    />
                    <StatCard 
                      title="Toplam Sınav" 
                      value={stats.exams} 
                      icon={<FiFileText className="text-purple-600" size={24} />} 
                      color="purple"
                    />
                    <StatCard 
                      title="Toplam Sertifika" 
                      value={stats.certificates} 
                      icon={<FiAward className="text-yellow-600" size={24} />} 
                      color="yellow"
                    />
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Platform Dağılımı">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Platform Büyüme">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartCard>
                  </div>
                </div>
              )}

              {/* Diğer tab'lar için içerikler */}
              {activeTab !== 'dashboard' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <p className="text-gray-600">
                    {activeTab === 'users' && <UserList />}
                    {activeTab === 'institutions' && 'Kurum listesi ve yönetim araçları burada olacak'}
                    {activeTab === 'exams' && 'Sınav listesi ve yönetim araçları burada olacak'}
                  </p>
                </div>
              )}

              {/* Quick Actions - Orijinal form yapısını koruyoruz */}
              <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    onClick={() => {
                      setIsExamFormVisible(!isExamFormVisible);
                      setIsCouponFormVisible(false);
                      setIsBlogFormVisible(false);
                    }}
                    className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isExamFormVisible ? (
                      <FiX size={16} />
                    ) : (
                      <FiFileText size={16} />
                    )}
                    {isExamFormVisible ? "Formu Kapat" : "Yeni Sınav"}
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setIsCouponFormVisible(!isCouponFormVisible);
                      setIsExamFormVisible(false);
                      setIsBlogFormVisible(false);
                    }}
                    className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isCouponFormVisible ? (
                      <FiX size={16} />
                    ) : (
                      <FiGift size={16} />
                    )}
                    {isCouponFormVisible ? "Formu Kapat" : "Yeni Kupon"}
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setIsBlogFormVisible(!isBlogFormVisible);
                      setIsExamFormVisible(false);
                      setIsCouponFormVisible(false);
                    }}
                    className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isBlogFormVisible ? (
                      <FiX size={16} />
                    ) : (
                      <FiBook size={16} />
                    )}
                    {isBlogFormVisible ? "Formu Kapat" : "Yeni Blog"}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {isExamFormVisible && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 overflow-hidden"
                    >
                      <ExamForm />
                    </motion.div>
                  )}

                  {isCouponFormVisible && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 overflow-hidden"
                    >
                      <CouponForm />
                    </motion.div>
                  )}

                  {isBlogFormVisible && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 overflow-hidden"
                    >
                      <BlogForm />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Yardımcı bileşenler
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${colorClasses[color]}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-white">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default AdminPanel;