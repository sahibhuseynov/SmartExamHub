import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { db, auth } from "../../firebase/config";
import { updateDoc, doc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import { setUser } from "../../redux/userSlice";
import { FiUser, FiMail, FiPhone, FiCalendar, FiLock } from "react-icons/fi";

const Settings = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [birthDate, setBirthDate] = useState(user?.birthDate || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `fixed top-5 right-5 z-50 transition-all duration-300`;
    toast.innerHTML = `
      <div class="flex items-center p-4 rounded-lg shadow-lg ${
        type === 'success' 
          ? 'bg-green-500 text-white' 
          : type === 'error' 
            ? 'bg-red-500 text-white' 
            : 'bg-red-500 text-white'
      }">
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        displayName,
        phone,
        birthDate,
        gender,
      });
      dispatch(setUser({
        ...user,
        displayName,
        phone,
        birthDate,
        gender,
      }));
      showToast("Profil məlumatlarınız uğurla yeniləndi!", "success");
    } catch (error) {
      console.error(error);
      showToast("Profil yenilənərkən xəta baş verdi.", "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("Yeni şifrə ilə təsdiq şifrə uyğun deyil.", "warning");
      return;
    }
    
    if (newPassword.length < 6) {
      showToast("Şifrə ən azı 6 simvol olmalıdır.", "warning");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const currentUser = auth.currentUser;
      await updatePassword(currentUser, newPassword);
      showToast("Şifrə uğurla yeniləndi!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      showToast("Şifrə yenilənərkən xəta baş verdi.", "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="">
      {/* Profile Information Section */}
      <div className="bg-white rounded-xl ">
        <h2 className="text-2xl font-semibold  mb-6 flex items-center gap-2">
          
          Profil Məlumatları
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium ">Ad Soyad</label>
            <div className="relative">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input input-bordered w-full pl-10"
                placeholder="Ad Soyad"
              />
              <FiUser className="absolute left-3 top-3.5 " />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">E-poçt</label>
            <div className="relative">
              <input 
                type="email" 
                value={email} 
                disabled 
                className="input input-bordered w-full  pl-10" 
              />
              <FiMail className="absolute left-3 top-3.5 " />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Telefon</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input input-bordered w-full  pl-10"
                placeholder="+994 XX XXX XX XX"
              />
              <FiPhone className="absolute left-3 top-3.5 " />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Doğum tarixi</label>
            <div className="relative">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
              <FiCalendar className="absolute left-3 top-3.5 " />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cins</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="select select-bordered w-full "
            >
              <option value="">Seçin</option>
              <option value="male">Kişi</option>
              <option value="female">Qadın</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleUpdateProfile} 
            disabled={isUpdatingProfile}
            className="btn btn-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isUpdatingProfile ? (
              <span className="loading loading-spinner"></span>
            ) : "Profili Yenilə"}
          </button>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-xl ">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          
          Şifrə Dəyişdir
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cari Şifrə</label>
            <div className="relative">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input input-bordered w-full  pl-10"
                placeholder="••••••••"
              />
              <FiLock className="absolute left-3 top-3.5 " />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Yeni Şifrə</label>
            <div className="relative">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input input-bordered w-full pl-10"
                placeholder="••••••••"
              />
              <FiLock className="absolute left-3 top-3.5 " />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Yeni Şifrəni Təsdiq Et</label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-bordered w-full  pl-10"
                placeholder="••••••••"
              />
              <FiLock className="absolute left-3 top-3.5 " />
            </div>
          </div>
          
          
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleChangePassword} 
            disabled={isUpdatingPassword}
            className="btn btn-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isUpdatingPassword ? (
              <span className="loading loading-spinner"></span>
            ) : "Şifrəni Yenilə"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;