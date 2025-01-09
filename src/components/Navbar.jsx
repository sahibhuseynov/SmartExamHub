import { useState, useEffect } from 'react';
import { FaBell,FaUserCircle } from 'react-icons/fa'; // FontAwesome ikonlarını kullanıyoruz
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  // Kullanıcı bilgilerini Redux store'dan al
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Kullanıcı çıkış yaparsa login sayfasına yönlendir
  };

  return (
    <div
      className={`navbar ${isAuthenticated ? 'bg-white text-black ' : 'bg-transparent text-white'}  relative z-10 h-16 px-2 sm:px-16`}>
      <div className="navbar-start">
        <div className="dropdown hidden sm:relative">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><a>Item 1</a></li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li><a>Submenu 1</a></li>
                <li><a>Submenu 2</a></li>
              </ul>
            </li>
            <li><a>Item 3</a></li>
          </ul>
        </div>
        <Link to={'/dashboard'} className=" text-3xl font-bold">Cirtdan</Link>
      </div>

      {/* Menü kısmı */}
      <div className="navbar-center hidden lg:flex ">
        <ul className="menu menu-horizontal px-1">
          <li className="text-xl"><Link to={'/dashboard'}>Ana Səhifə</Link></li>
          <li className="text-xl"><Link to={'/aboutUs'}>Haqqımızda</Link></li>
          <li className="text-xl"><Link>Əlaqə</Link></li>
        </ul>
      </div>

      {/* Kullanıcı giriş yaptıysa profil ve bildirim simgelerini göster */}
      <div className="navbar-end flex items-center">
        {!isAuthenticated && (
          <Link to="/register" className="btn">Daxil ol</Link>
        )}
        {isAuthenticated && (
          <>
            <button className="btn btn-ghost  mr-4">
              <FaBell className="text-xl" /> {/* Bildirim ikonu */}
            </button>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User Avatar"
                    src={user?.photoURL || FaUserCircle } />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li>
                  <a className="justify-between">
                    {user?.displayName || 'Profile'}
                  </a>
                </li>
                <li><a>Settings</a></li>
                <li><a onClick={handleLogout}>Logout</a></li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
