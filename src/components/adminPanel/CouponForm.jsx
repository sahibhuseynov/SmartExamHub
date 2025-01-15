import { useState } from "react";
import { db } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";

// Kupon kodu üretme fonksiyonu
const generateCouponCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let couponCode = "";
  for (let i = 0; i < 8; i++) {
    couponCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return couponCode;
};

const CouponForm = () => {
  const [formData, setFormData] = useState({
    couponCode: generateCouponCode(),
    usageLimit: "", // Toplam kullanım hakkı
    usedCount: 0, // Şu ana kadar kullanılan sayısı
    expirationDate: "", // Son geçerlilik tarihi
    active: true, // Kuponun aktif durumu
  });

  const [error, setError] = useState(""); // Hata mesajlarını tutmak için

  // Form alanlarını güncelleme fonksiyonu
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Form gönderme işlemi
  const handleAddCoupon = async (e) => {
    e.preventDefault();

    // Form doğrulama
    if (!formData.usageLimit || !formData.expirationDate) {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    try {
      const couponRef = collection(db, "Coupons");
      await addDoc(couponRef, {
        couponCode: formData.couponCode,
        usageLimit: parseInt(formData.usageLimit, 10), // Kullanım sınırı
        usedCount: formData.usedCount, // Varsayılan 0
        expirationDate: formData.expirationDate, // Son kullanma tarihi
        active: formData.active, // Aktiflik durumu
      });

      alert("Yeni kupon başarıyla eklendi!");
      setFormData({
        couponCode: generateCouponCode(),
        usageLimit: "",
        usedCount: 0,
        expirationDate: "",
        active: true,
      });
      setError(""); // Hata mesajını sıfırla
    } catch (error) {
      console.error("Kupon eklenirken hata oluştu:", error);
      setError("Kupon eklenirken bir hata oluştu.");
    }
  };

  return (
    <form onSubmit={handleAddCoupon} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="text"
        name="couponCode"
        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
        placeholder="Kupon Kodu"
        value={formData.couponCode}
        readOnly
      />
      <select
        name="usageLimit"
        value={formData.usageLimit}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
      >
        <option value="">Kaç Kullanımlık Kupon?</option>
        <option value="5">5 Kullanım</option>
        <option value="10">10 Kullanım</option>
        <option value="20">20 Kullanım</option>
        <option value="50">50 Kullanım</option>
      </select>
      <input
        type="date"
        name="expirationDate"
        className="w-full p-3 border border-gray-300 rounded-lg"
        placeholder="Son Geçerlilik Tarihi"
        value={formData.expirationDate}
        onChange={handleInputChange}
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="active"
          checked={formData.active}
          onChange={handleInputChange}
        />
        <span>Aktif Kupon</span>
      </label>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all"
      >
        Kuponu Ekle
      </button>
    </form>
  );
};

export default CouponForm;
