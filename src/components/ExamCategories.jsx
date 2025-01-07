import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";  

const ExamCategories = () => {
  const [categories, setCategories] = useState([]);  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // exam koleksiyonundaki tüm belgeleri alıyoruz
        const querySnapshot = await getDocs(collection(db, "exam"));
        const categoriesList = querySnapshot.docs.map((doc) => doc.id); // Koleksiyonun id'sini alıyoruz
        setCategories(categoriesList);
      } catch (error) {
        console.error("Hata oluştu: ", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold text-center mb-6">Sınav Kategorileri</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <div
              key={index}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-center shadow-md hover:bg-blue-600 transition-all"
            >
              {category}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">Yükleniyor veya kategori bulunamadı...</p>
        )}
      </div>
    </div>
  );
};

export default ExamCategories;
