import { useState } from "react";
import { useSelector } from "react-redux";
import { db, auth } from "../../firebase/config";
import { updateDoc, doc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";

const Settings = () => {
  const user = useSelector((state) => state.user.user);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<div class="alert alert-success bg-green-500 text-white"><span>${message}</span></div>`;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleUpdateProfile = async () => {
    try {
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        displayName,
        phone,
        birthDate,
        gender,
      });
      showToast("Profil məlumatlarınız uğurla yeniləndi!", "success");
    } catch (error) {
      console.error(error);
      showToast("Profil yenilənərkən xəta baş verdi.", "error");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("Yeni şifrə ilə təsdiq şifrə uyğun deyil.", "warning");
      return;
    }
    try {
      const currentUser = auth.currentUser;
      await updatePassword(currentUser, newPassword);
    } catch (error) {
      console.error(error);
      showToast("Şifrə yenilənərkən xəta baş verdi.", "error");
      showToast("Şifrə yenilənərkən xəta baş verdi.", "error");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block font-semibold">Ad Soyad</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">E-poçt</label>
        <input type="email" value={email} disabled className="input input-bordered w-full" />
      </div>
      <div>
        <label className="block font-semibold">Telefon</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">Doğum tarixi</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">Cins</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="">Seçin</option>
          <option value="male">Kişi</option>
          <option value="female">Qadın</option>
        </select>
      </div>
      <button onClick={handleUpdateProfile} className="btn btn-primary col-span-2">
        Profili Yenilə
      </button>
      <h3 className="text-xl font-semibold col-span-2">Şifrə Dəyişdir</h3>
      <div>
        <label className="block font-semibold">Cari Şifrə</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">Yeni Şifrə</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">Yeni Şifrəni Təsdiq Et</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <button onClick={handleChangePassword} className="btn btn-warning col-span-2">
        Şifrəni Yenilə
      </button>
    </div>
  );
};

export default Settings;
