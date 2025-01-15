import { useState } from "react";
import { db } from "../../firebase/config";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "../../utils/cloudinary"; // Cloudinary yükleme fonksiyonu

const ExamForm = () => {
  const [categoryId, setCategoryId] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [classType, setClassType] = useState("");
  const [title, setTitle] = useState("");
  const [examTitle2, setExamTitle2] = useState("");
  const [description, setDescription] = useState("");
  const [examDate, setExamDate] = useState("");
  const [price, setPrice] = useState("");
  const [isCertified, setIsCertified] = useState(false);
  const [questions, setQuestions] = useState([{ questionText: "", options: ["", "", ""], correctAnswer: "", image: null }]);

  // Yeni soru ekleme
  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", ""], correctAnswer: "", image: null }]);
  };

  // Input değişikliklerini yönetme
  const handleChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // Dosya yükleme
  const handleFileUpload = async (index, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const fileUrl = await uploadFileToCloudinary(file);
        const updatedQuestions = [...questions];
        updatedQuestions[index].image = fileUrl;
        setQuestions(updatedQuestions);
      } catch (error) {
        console.error("Dosya yüklenirken hata oluştu:", error);
      }
    }
  };

  // Formu gönderme
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Firebase işlemleri burada olacak (sınav, kategori ve sorular ekleme)
      
      const categoryRef = doc(db, "Exams", categoryId);
      await setDoc(categoryRef, {
        categoryId,
        description: categoryDescription,
      }, { merge: true });

      const classRef = doc(collection(categoryRef, "Classes"), classType);
      await setDoc(classRef, { classType }, { merge: true });

      const examRef = doc(collection(classRef, "Exams"), title);
      await setDoc(examRef, {
        title,
        title2: examTitle2,
        description,
        examDate,
        price: parseFloat(price),
        isCertified,
        createdAt: new Date(),
      });

      // Soruları ekleme
      const questionsRef = collection(examRef, "Questions");
      for (const question of questions) {
        await addDoc(questionsRef, {
          questionText: question.questionText,
          options: question.options,
          correctAnswer: question.correctAnswer,
          image: question.image,
        });
      }

      alert("Sınav başarıyla eklendi!");
    } catch (error) {
      console.error("Sınav eklenirken hata oluştu: ", error);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="   mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Sınav Ekle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Kategori ID"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Kategori Açıklaması"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Sınıf Adı"
            value={classType}
            onChange={(e) => setClassType(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Sınav Başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Sınav Başlığı-2"
            value={examTitle2}
            onChange={(e) => setExamTitle2(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Sınav Açıklaması"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
          />
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Fiyat (AZN)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isCertified}
              onChange={(e) => setIsCertified(e.target.checked)}
            />
            <span>Sertifikalı Sınav</span>
          </label>

          <h3 className="text-xl font-semibold mt-6">Sorular:</h3>
          {questions.map((q, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50 mb-4">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg mb-2"
                placeholder="Soru Metni"
                value={q.questionText}
                onChange={(e) => handleChange(index, "questionText", e.target.value)}
              />
              {q.options.map((option, i) => (
                <input
                  key={i}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                  placeholder={`Seçenek ${i + 1}`}
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...q.options];
                    updatedOptions[i] = e.target.value;
                    handleChange(index, "options", updatedOptions);
                  }}
                />
              ))}
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Doğru Cevap"
                value={q.correctAnswer}
                onChange={(e) => handleChange(index, "correctAnswer", e.target.value)}
              />
              <input
                type="file"
                className="w-full p-2 mt-2"
                onChange={(e) => handleFileUpload(index, e)}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddQuestion}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all"
          >
            Yeni Soru Ekle
          </button>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all"
          >
            Sınavı Ekle
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExamForm;
