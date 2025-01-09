import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, doc, setDoc, getDocs, addDoc, deleteDoc } from "firebase/firestore";

const AdminPanel = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [classType, setClassType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [examDate, setExamDate] = useState("");
  const [isCertified, setIsCertified] = useState(false); // Sertifikalı sınav seçimi
  const [questions, setQuestions] = useState([{ questionText: "", options: ["", "", ""], correctAnswer: "" }]);
  const [categoriesWithExams, setCategoriesWithExams] = useState([]);
  const [isExamFormVisible, setIsExamFormVisible] = useState(false);

  useEffect(() => {
    const fetchCategoriesWithExams = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Exams"));
        const categories = [];

        for (const categoryDoc of querySnapshot.docs) {
          const categoryId = categoryDoc.id;
          const classesSnapshot = await getDocs(collection(db, "Exams", categoryId, "Classes"));
          const exams = [];

          for (const classDoc of classesSnapshot.docs) {
            const examsSnapshot = await getDocs(collection(db, "Exams", categoryId, "Classes", classDoc.id, "Exams"));
            exams.push(
              ...examsSnapshot.docs.map((exam) => ({
                id: exam.id,
                className: classDoc.id,
                description: exam.data().description || "Açıklama yok",
                examDate: exam.data().examDate || "Tarih belirtilmemiş",
                isCertified: exam.data().isCertified || false,
              }))
            );
          }

          categories.push({ id: categoryId, exams });
        }

        setCategoriesWithExams(categories);
      } catch (error) {
        console.error("Veriler alınırken hata oluştu: ", error);
      }
    };

    fetchCategoriesWithExams();
  }, []);

  const handleDeleteCategory = async (categoryId) => {
    try {
      const categoryRef = doc(db, "Exams", categoryId);
      const classesSnapshot = await getDocs(collection(categoryRef, "Classes"));

      for (const classDoc of classesSnapshot.docs) {
        const examsSnapshot = await getDocs(collection(categoryRef, "Classes", classDoc.id, "Exams"));
        for (const examDoc of examsSnapshot.docs) {
          await deleteDoc(doc(categoryRef, "Classes", classDoc.id, "Exams", examDoc.id));
        }
        await deleteDoc(doc(categoryRef, "Classes", classDoc.id));
      }

      await deleteDoc(categoryRef);

      alert(`Kategori '${categoryId}' başarıyla silindi!`);
      setCategoriesWithExams(categoriesWithExams.filter((cat) => cat.id !== categoryId));
    } catch (error) {
      console.error("Kategori silinirken hata oluştu: ", error);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", ""], correctAnswer: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryRef = doc(db, "Exams", category);
      await setDoc(
        categoryRef,
        {
          categoryId: category,
          description: categoryDescription,
        },
        { merge: true }
      );

      const classRef = doc(collection(categoryRef, "Classes"), classType);
      await setDoc(classRef, { classType }, { merge: true });

      const examRef = doc(collection(classRef, "Exams"), title);
      await setDoc(examRef, {
        title,
        price: parseFloat(price),
        description,
        examDate,
        isCertified, // Sertifika bilgisi
        createdAt: new Date(),
      });

      const questionsRef = collection(examRef, "Questions");
      for (const question of questions) {
        await addDoc(questionsRef, {
          questionText: question.questionText,
          options: question.options,
          correctAnswer: question.correctAnswer,
        });
      }

      alert("Sınav ve sorular başarıyla eklendi!");
      setIsExamFormVisible(false);
    } catch (error) {
      console.error("Sınav eklenirken hata oluştu: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Panel</h2>

        <button
          onClick={() => setIsExamFormVisible(!isExamFormVisible)}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all mb-6"
        >
          {isExamFormVisible ? "Sınav Formunu Kapat" : "Yeni Sınav Oluştur"}
        </button>

        {isExamFormVisible && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Kategori ID"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              placeholder="Sınav Açıklaması"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Sınav Tarihi"
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
              </div>
            ))}
            <button
              type="button"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all"
              onClick={handleAddQuestion}
            >
              Soru Ekle
            </button>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all"
            >
              Sınavı Kaydet
            </button>
          </form>
        )}

        <h3 className="text-2xl font-bold mt-8">Mevcut Kategoriler ve Sınavlar:</h3>
        {categoriesWithExams.map((cat) => (
          <div key={cat.id} className="p-4 border rounded-lg bg-blue-50">
            <h4 className="text-lg font-semibold">{cat.id}</h4>
            {cat.exams.map((exam) => (
              <p key={exam.id}>
                {exam.className} - {exam.id} | {exam.description} | Tarih: {exam.examDate} | Sertifikalı:{" "}
                {exam.isCertified ? "Evet" : "Hayır"}
              </p>
            ))}
            <button
              onClick={() => handleDeleteCategory(cat.id)}
              className="mt-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
            >
              Kategoriyi Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
