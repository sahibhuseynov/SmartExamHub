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
      name: Yup.string().required('Ad və soyad mütləqdir!'),
      email: Yup.string().email('Etibarlı bir e-poçt ünvanı daxil edin.').required('E-poçt mütləqdir.'),
      password: Yup.string().min(6, 'Şifrə ən azı 6 simvoldan ibarət olmalıdır.').required('Şifrə mütləqdir.'),
    }),
    onSubmit: async (values) => {
      try {
        const isSuccessful = await emailSignUp(values.email, values.password, values.name, dispatch);
        if (isSuccessful) {
          navigate("/");
        }
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          alert('Bu e-poçt ünvanı artıq qeydiyyatdan keçib!');
        } else {
          alert('Qeydiyyatda səhv baş verdi. Zəhmət olmasa, yenidən cəhd edin.');
        }
      }
    }
    
    
  });

  const handleGoogleSignIn = async () => {
    const isSuccessful = await googleSignIn(dispatch);
    if (isSuccessful) {
      
      navigate("/");
    } else {
      alert('Google ilə girişdə səhv baş verdi.');
    }
  };

  return (
    <div className="h-screen   flex items-center justify-center p-8">
      <div className="flex h-auto bg-white  w-full max-w-4xl rounded-3xl shadow-lg overflow-hidden">
        <div className="hidden  items-center p-8 md:flex flex-col w-1/2 text-white bg-blue-600">
        <h2 className='font-bold text-2xl text-center mb-4'>BalaBebir Ailəsinə Xoş Gəlmisiniz!</h2>
        <div className='w-40 h-40 rounded-3xl  relative bg-white mb-8'>
           <img
          src="https://res.cloudinary.com/dwvmtepwh/image/upload/v1747848141/vavgvj1x9isuexhht9je.png"
          alt="BalaBebir maskotu"
          className="w-full h-full absolute top-8"
         
        />
        </div>
        <div>
          <p className='text-center text-lg text-gray-50 font-medium'>Daxil olmaq üçün əvvəlcə qeydiyyatdan keçmək lazımdır.</p>
        </div>
        
          <div className='w-40 h-40 '>
            <img className='w-full h-full object-cover filter invert brightness-0' src="https://res.cloudinary.com/dwvmtepwh/image/upload/v1747850868/xavdbvx3h2sziim2e9ji.png" alt="" />
          </div>
          
        
        </div>

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
