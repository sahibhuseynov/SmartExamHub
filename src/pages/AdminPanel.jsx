import { useState } from "react";
import ExamForm from "../components/adminPanel/ExamForm"; // Sınav formunu içeren componenti import ediyoruz
import CouponForm from "../components/adminPanel/CouponForm"; // Kupon formunu içeren componenti import ediyoruz
import BlogForm from "../components/adminPanel/BlogForm"; // Blog formunu içeren componenti import ediyoruz

const AdminPanel = () => {
  const [isCouponFormVisible, setIsCouponFormVisible] = useState(false); // Kupon formunun görünürlüğü
  const [isExamFormVisible, setIsExamFormVisible] = useState(false); // Sınav formunun görünürlüğü
  const [isBlogFormVisible, setIsBlogFormVisible] = useState(false); // Blog formunun görünürlüğü

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Admin Paneli</h2>

        {/* Butonlar */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setIsExamFormVisible(!isExamFormVisible)}
            className="py-2 px-6 rounded-lg text-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300"
          >
            {isExamFormVisible ? "Sınav Formunu Kapat" : "Yeni Sınav Ekle"}
          </button>

          <button
            onClick={() => setIsCouponFormVisible(!isCouponFormVisible)}
            className="py-2 px-6 rounded-lg text-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-all"
          >
            {isCouponFormVisible ? "Kupon Formunu Kapat" : "Yeni Kupon Oluştur"}
          </button>

          <button
            onClick={() => setIsBlogFormVisible(!isBlogFormVisible)}
            className="py-2 px-6 rounded-lg text-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-all"
          >
            {isBlogFormVisible ? "Blog Formunu Kapat" : "Yeni Blog Yazısı Ekle"}
          </button>
        </div>

        {/* Tab içerikleri */}
        {isExamFormVisible && <ExamForm />}  {/* Sınav ekleme formu */}
        {isCouponFormVisible && <CouponForm />} {/* Kupon ekleme formu */}
        {isBlogFormVisible && <BlogForm />} {/* Blog yazısı ekleme formu */}
      </div>
    </div>
  );
};

export default AdminPanel;
