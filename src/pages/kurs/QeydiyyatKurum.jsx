import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { uploadFileToCloudinary } from './../../utils/cloudinary';
import { useSelector } from 'react-redux';

const InstitutionRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    institutionName: '',
    description: '',
    logoUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  // Get current user from Redux
  const currentUser = useSelector((state) => state.user.user);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      setUserId(currentUser.uid);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const response = await uploadFileToCloudinary(file);
      setFormData(prev => ({ ...prev, logoUrl: response }));
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Create the institution document
      const institutionRef = await addDoc(collection(db, 'institutions'), {
        name: formData.institutionName,
        description: formData.description,
        logoUrl: formData.logoUrl,
        createdAt: new Date(),
        status: 'active',
        adminUserId: userId, // Associate with the current user
        members: [userId]    // Add user as first member
      });

      // 2. Update the user document to reference this institution
      const userRef = doc(db, 'Users', userId);
      await updateDoc(userRef, {
        institutions: arrayUnion(institutionRef.id),
        activeInstitution: institutionRef.id
      });

      setTimeout(() => {
        navigate('/kurumdashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving institution:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: { duration: 0.2 }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ 
              width: step === 1 ? '33%' : step === 2 ? '66%' : '100%',
              transition: { duration: 0.4 }
            }}
          />
        </div>

        {/* Form Container */}
        <div className="p-8 relative" style={{ minHeight: '500px' }}>
          <AnimatePresence mode="wait" custom={step}>
            {/* Step 1: Institution Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Kurum Bilgileri</h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-2">
                      Kurum Adı*
                    </label>
                    <input
                      type="text"
                      id="institutionName"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Örneğin: ABC Okulları"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo Yükle (Opsiyonel)
                    </label>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        disabled={isSubmitting}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors disabled:opacity-50"
                      >
                        {formData.logoUrl ? 'Logo Değiştir' : 'Logo Seç'}
                      </button>
                      
                      {isSubmitting && (
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>

                    {formData.logoUrl && !isSubmitting && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden">
                          <img 
                            src={formData.logoUrl} 
                            alt="Uploaded logo" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-sm text-gray-500">Logo yüklendi</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!formData.institutionName || isSubmitting}
                      className={`w-full py-3.5 px-6 rounded-lg font-medium text-white text-lg ${
                        !isSubmitting && formData.institutionName 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md' 
                          : 'bg-gray-400 cursor-not-allowed'
                      } transition-all`}
                    >
                      Devam Et
                      <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Institution Description */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Kurum Açıklaması</h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Kurum Tanımı*
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Kurumunuzu kısaca tanıtın..."
                      required
                    />
                  </div>

                  <div className="flex justify-between space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-3.5 px-6 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                      </svg>
                      Geri
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!formData.description}
                      className={`flex-1 py-3.5 px-6 rounded-lg font-medium text-white text-lg ${
                        formData.description 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md' 
                          : 'bg-gray-400 cursor-not-allowed'
                      } transition-all`}
                    >
                      Devam Et
                      <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Completion */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center"
              >
                <div className="mb-8">
                  <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
                    <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">Kayıt Tamamlandı!</h2>
                <p className="text-gray-600 mb-8 max-w-md text-lg">
                  <span className="font-semibold">{formData.institutionName}</span> kurumu başarıyla kaydedildi.
                </p>

                {isSubmitting ? (
                  <div className="w-full max-w-xs py-3.5 px-6 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Yönlendiriliyor...
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="w-full max-w-xs">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg shadow-md transition-all"
                    >
                      Dashboarda Git
                      <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </button>
                  </form>
                )}

                <div className="mt-12 pt-6 border-t border-gray-200 w-full max-w-xs">
                  <p className="text-sm text-gray-500">Hesabınızı daha sonra ayarlar bölümünden düzenleyebilirsiniz.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default InstitutionRegistration;