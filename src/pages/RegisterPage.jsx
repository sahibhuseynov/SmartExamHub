import { useFormik } from 'formik';
import * as Yup from 'yup'; 
import { emailSignUp, googleSignIn } from "../firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";


const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Ad Soyad gerekli'),
      email: Yup.string().email('Geçerli bir e-posta girin').required('E-posta gerekli'),
      password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre gerekli'),
    }),
    onSubmit: async (values) => {
      try {
        const isSuccessful = await emailSignUp(values.email, values.password, values.name, dispatch);
        if (isSuccessful) {
          alert('Qeydiyyat uğurla tamamlandı!');
          navigate("/");
        }
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          alert('Bu e-posta adresi zaten kayıtlı!');
        } else {
          alert('Qeydiyyatda səhv baş verdi. Zəhmət olmasa, yenidən cəhd edin.');
        }
      }
    }
    
    
  });

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
    <div className="h-screen bg-gradient-to-b from-violet-700 to-indigo-600  flex items-center justify-center p-8">
      <div className="flex h-auto bg-white  w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: `url("https://res.cloudinary.com/dwvmtepwh/image/upload/v1745182033/nbwosusokjwc4ga6vqv9.png")` }}></div>

        <div className="flex flex-col w-full md:w-1/2 items-center justify-center p-8">
          <h1 className="text-3xl font-bold mb-6">Hesab Yaradın</h1>

          <form className="w-full max-w-sm" onSubmit={formik.handleSubmit}>
  <div className="mb-4">
    <div className="min-h-[1rem] text-red-500 text-xs">
      {formik.touched.name && formik.errors.name}
    </div>
    <input
      type="text"
      name="name"
      placeholder="Ad Soyad"
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={formik.values.name}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
    />
  </div>

  <div className="mb-4">
    <div className="min-h-[1rem] text-red-500 text-xs">
      {formik.touched.email && formik.errors.email}
    </div>
    <input
      type="email"
      name="email"
      placeholder="E-poçt"
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={formik.values.email}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
    />
  </div>

  <div className="mb-4">
    <div className="min-h-[1rem] text-red-500 text-xs">
      {formik.touched.password && formik.errors.password}
    </div>
    <input
      type="password"
      name="password"
      placeholder="Şifrə"
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={formik.values.password}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
    />
  </div>

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
