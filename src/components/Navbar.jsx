import{ useEffect, useState, useRef } from 'react';
import { FaBell, } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
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
        <div className="navbar-start">
          <Link to={'/'} className="text-3xl font-bold">Cirtdan</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li className="text-xl"><Link to={'/'}>Ana Səhifə</Link></li>
            <li className="text-xl"><Link to={'/aboutUs'}>Haqqımızda</Link></li>
            <li className="text-xl"><Link to={'/rewards'}>Hədiyyələr</Link></li>
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
                  className="btn btn-ghost mr-4">
                  <FaBell className="text-xl" />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border rounded-2xl shadow-lg z-50 ">
                    <div className="p-4">
                      <h3 className="font-bold text-lg">Bildirişlər</h3>
                      <ul>
                        <li className="py-2 border-b">Yeni imtahan nəticəniz hazırdır!</li>
                        <li className="py-2 border-b">Yeni bir hədiyyə qazandınız!</li>
                        <li className="py-2">Hesab məlumatlarınızı yeniləyin.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User Profile" />
                    ) : (
                      <div className='w-10 h h-full flex items-center justify-center rounded-full bg-blue-600'>
                       <span className='text-white text-xl font-thin'>{user.displayName.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                  <li>
                    <Link to='/profile'>{user.displayName || 'Profile'}</Link>
                  </li>
                  <li><a>Settings</a></li>
                  <li><a onClick={handleLogout}>Logout</a></li>
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
