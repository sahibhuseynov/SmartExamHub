import { useEffect, useState, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasInstitution, setHasInstitution] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  // Check if user has an institution
  useEffect(() => {
    const checkUserInstitution = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'Users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setHasInstitution(!!userData.activeInstitution);
          }
        } catch (error) {
          console.error('Error checking user institution:', error);
        }
      }
    };

    checkUserInstitution();
  }, [user]);

  useEffect(() => {
  if (!user?.uid) return;

  // Kullanıcının okunmamış bildirimlerini dinle
  const q = query(
    collection(db, "Users", user.uid, "notifications"),
    where("read", "==", false)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const notifs = [];
    querySnapshot.forEach((doc) => {
      notifs.push({ id: doc.id, ...doc.data() });
    });
    setNotifications(notifs);
    setUnreadCount(notifs.length);
  });

  return unsubscribe;
}, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleInstitutionRedirect = () => {
    if (hasInstitution) {
      navigate('/kurumdashboard');
    } else {
      navigate('/kurslar');
    }
  };

  

  const markAsRead = async (notificationId) => {
  try {
    await updateDoc(doc(db, "Users", user.uid, "notifications", notificationId), {
      read: true,
    });
  } catch (error) {
    console.error("Bildirim güncellenemedi:", error);
  }
};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='w-full bg-white sticky top-0 z-50'>
      <div className='navbar bg-white text-black max-w-7xl mx-auto h-16 px-2 sm:px-16'>
        <div className="navbar-start w-[47%] md:w-2/4">
          <Link to={'/'} className="text-3xl font-bold">Bala Bebir</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li className="text-xl"><Link to={'/'}>Ana Səhifə</Link></li>
            <li className="text-xl"><Link to={'/aboutUs'}>Haqqımızda</Link></li>
            <li className="text-xl"><Link to={'/rewards'}>Hədiyyələr</Link></li>
            <li className="text-xl"><Link to={'/blog'}>Blog</Link></li>
          </ul>
        </div>
        <div className="navbar-end flex items-center">
          {!user ? (
            <div className='flex gap-3'>
              <Link to="/login" className="btn">Daxil ol</Link>
              <Link to="/register" className="btn">Qeydiyyat</Link>
            </div>
          ) : (
            <>
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className="btn btn-ghost mr-4 relative"
                >
                  <FaBell className="text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-72 md:w-96 bg-white border rounded-2xl shadow-lg z-50"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-bold text-lg">Bildirişlər</h3>
                          {notifications.length > 0 && (
                            <button 
                              
                              className="text-sm text-blue-500 hover:text-blue-700"
                            >
                              Hamısını oxunmuş kimi qeyd et
                            </button>
                          )}
                        </div>
                        {notifications.length === 0 ? (
                          <p className="text-gray-500 py-4 text-center">Yeni bildiriş yoxdur</p>
                        ) : (
                          <ul className="max-h-80 overflow-y-auto">
                            {notifications.map((notification) => (
                              <motion.li
                                key={notification.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-3 border-b last:border-b-0"
                              >
                                <div 
                                  className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded"
                                  onClick={() => {
                                    markAsRead(notification.id);
                                    if (notification.link) {
                                      navigate(notification.link);
                                    }
                                  }}
                                >
                                  <div className="flex-1">
                                    <p className="font-medium">{notification.title}</p>
                                    <p className="text-sm text-gray-600">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {new Date(notification.createdAt?.seconds * 1000).toLocaleString()}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                                  )}
                                </div>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User Profile" />
                    ) : (
                      <div className='w-10 h-full flex items-center justify-center rounded-full bg-green-500'>
                       <span className='text-white text-xl font-thin'>{user.displayName?.charAt(0).toUpperCase() || 'U'}</span>
                      </div>
                    )}
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow">
                  <li>
                    <Link to='/profile'>{user.displayName || 'Profil'}</Link>
                  </li>
                  <li>
                    <a onClick={handleInstitutionRedirect}>
                      {hasInstitution ? 'Qurumum' : 'Kurslar'}
                    </a>
                  </li>
                  <li><a onClick={handleLogout}>Hesabdan Çıx</a></li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;