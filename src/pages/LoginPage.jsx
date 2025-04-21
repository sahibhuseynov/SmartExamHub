import { useFormik } from 'formik';
import * as Yup from 'yup';
import { emailSignIn, googleSignIn } from "../firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Geçerli bir e-posta girin').required('E-posta gerekli'),
      password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre gerekli'),
    }),
    onSubmit: async (values) => {
      try {
        const isSuccessful = await emailSignIn(values.email, values.password, dispatch);
        if (isSuccessful) {
          navigate("/"); // Ana səhifəyə yönləndir
        } else {
          alert('E-poçt və ya şifrə səhvdir!');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('E-poçt və ya şifrə səhvdir!');
      }
    }
  });

  const handleGoogleSignIn = async () => {
    try {
      const isSuccessful = await googleSignIn(dispatch);
      if (isSuccessful) {
        navigate("/"); // Ana səhifəyə yönləndir
      } else {
        alert('Google ilə giriş zamanı xəta baş verdi!');
      }
    } catch (error) {
      console.error('Google ilə giriş zamanı xəta baş verdi.', error.message);
      alert('Google ilə giriş zamanı xəta baş verdi!');
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-violet-700 to-indigo-600 flex items-center justify-center p-8">
      <div className="flex h-auto bg-gray-100 w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: `url("https://res.cloudinary.com/dwvmtepwh/image/upload/v1745182033/nbwosusokjwc4ga6vqv9.png")` }}></div>

        <div className="flex flex-col w-full md:w-1/2 items-center justify-center p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Xoş Gəlmisiniz!</h1>

          <form className="w-full max-w-sm" onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <div className="min-h-[1rem] text-red-500 text-xs">
                {formik.touched.email && formik.errors.email}
              </div>
              <input
                type="email"
                name="email"
                placeholder="E-poçt"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'focus:ring-blue-500'}`}
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
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'focus:ring-blue-500'}`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Daxil ol
            </button>
          </form>

          <div className="w-full max-w-sm mt-6 flex flex-col items-center">
            <p className="mb-4">və ya</p>
            <button
              className="w-full flex items-center justify-center p-3 border rounded-lg mb-3"
              onClick={handleGoogleSignIn}
            >
              <FaGoogle className="w-6 h-6 mr-2 text-red-600" />
              Google
            </button>

            {/* Qeydiyyat linki */}
            <p className="text-sm text-gray-600">
              Hesabınız yoxdur?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
              Qeydiyyatdan keç
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
