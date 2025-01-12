import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { emailSignUp, googleSignIn } from "../firebase/auth"; 
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import registerImg from '../assets/registr.webp';
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccessful = await emailSignUp(formData.email, formData.password, formData.name, dispatch);
    if (isSuccessful) {
      alert('Qeydiyyat uğurla tamamlandı!');
      navigate("/");
    } else {
      alert('Qeydiyyatda səhv baş verdi. Zəhmət olmasa, yenidən cəhd edin.');
    }
  };

  const handleGoogleSignIn = async () => {
    const isSuccessful = await googleSignIn(dispatch);
    if (isSuccessful) {
      alert('Google ilə uğurla giriş edildi!');
      navigate("/");
    } else {
      alert('Google ilə girişdə səhv baş verdi.');
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-violet-700 to-indigo-600 flex items-center justify-center p-8">
      <div className="flex h-auto bg-gray-100 w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${registerImg})` }}></div>

        <div className="flex flex-col w-full md:w-1/2 items-center justify-center p-8">
          <h1 className="text-3xl font-bold mb-6">Hesab Yaradın</h1>

          <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Ad Soyad"
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="E-poçt"
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Şifrə"
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Qeydiyyat
            </button>
          </form>

          <div className="w-full max-w-sm mt-6 flex flex-col items-center">
            <p className="mb-4">və ya</p>
            <button
              className="w-full flex items-center justify-center p-3 border rounded-lg mb-3"
              onClick={handleGoogleSignIn}
            >
              <FaGoogle className="w-6 h-6 mr-2 text-red-600" />
              Google ilə Qeydiyyat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
