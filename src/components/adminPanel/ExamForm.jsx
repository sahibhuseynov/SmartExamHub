import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, doc, setDoc, addDoc, getDocs } from "firebase/firestore";
import { uploadFileToCloudinary } from "../../utils/cloudinary"; // Cloudinary yükleme fonksiyonu

const ExamForm = () => {
  const [categories, setCategories] = useState([]); // Kategorileri tutmak için state
  const [classes, setClasses] = useState([]); // Sınıfları tutmak için state

  const [categoryId, setCategoryId] = useState("");
  const [classType, setClassType] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [title, setTitle] = useState("");
  const [examTitle2, setExamTitle2] = useState("");
  const [description, setDescription] = useState("");
  const [examDate, setExamDate] = useState("");
  const [price, setPrice] = useState("");
  const [isCertified, setIsCertified] = useState(false);
  const [examDuration, setExamDuration] = useState("");
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", "", ""],
      correctAnswer: "",
      image: null,
      imagesEnabled: false,
      optionImages: [null, null, null, null, null],
    },
  ]);

  // Firestore'dan kategori ve sınıfları çekme
  useEffect(() => {
    const fetchCategories = async () => {
      const categorySnapshot = await getDocs(collection(db, "Exams"));
      const fetchedCategories = categorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(fetchedCategories);
    };

    if (categoryId) {
      const fetchClasses = async () => {
        const classSnapshot = await getDocs(collection(db, `Exams/${categoryId}/Classes`));
        const fetchedClasses = classSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setClasses(fetchedClasses);
      };
      fetchClasses();
    }

    fetchCategories();
  }, [categoryId]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", "", ""],
        correctAnswer: "",
        image: null,
        imagesEnabled: false,
        optionImages: [null, null, null, null, null],
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleFileUpload = async (index, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const fileUrl = await uploadFileToCloudinary(file);
        const updatedQuestions = [...questions];
        updatedQuestions[index].image = fileUrl;
        updatedQuestions[index].imagesEnabled = true;
        setQuestions(updatedQuestions);
      } catch (error) {
        console.error("Dosya yüklenirken hata oluştu:", error);
      }
    }
  };

  const handleOptionFileUpload = async (index, optionIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const fileUrl = await uploadFileToCloudinary(file);
        const updatedQuestions = [...questions];
        updatedQuestions[index].optionImages[optionIndex] = fileUrl;
        setQuestions(updatedQuestions);
      } catch (error) {
        console.error("Dosya yüklenirken hata oluştu:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryRef = doc(db, "Exams", categoryId);
      await setDoc(
        categoryRef,
        {
          categoryId,
          description: categoryDescription,
        },
        { merge: true }
      );

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
        examDuration: parseInt(examDuration),
        createdAt: new Date(),
      });

      const questionsRef = collection(examRef, "Questions");
      for (const question of questions) {
        const optionsWithImages = question.options.map((option, index) => ({
          option,
          optionPhoto: question.optionImages[index] || null,
        }));

        await addDoc(questionsRef, {
          questionText: question.questionText,
          options: optionsWithImages,
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
    <div className="min-h-screen">
      <div className="mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Sınav Ekle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Kategori Seçin</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.id}
              </option>
            ))}
          </select>

          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={classType}
            onChange={(e) => setClassType(e.target.value)}
          >
            <option value="">Sınıf Seçin</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.classType || cls.id}
              </option>
            ))}
          </select>

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
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Sınav Süresi (Dakika)"
            value={examDuration}
            onChange={(e) => setExamDuration(e.target.value)}
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

              <input
                type="file"
                className="w-full p-2 mt-2"
                onChange={(e) => handleFileUpload(index, e)}
                placeholder="Soru Resmi"
              />

              {q.image && (
                <div className="mt-2 text-sm text-gray-500">Soru resmi yüklendi.</div>
              )}

              {q.options.map((option, i) => (
                <div key={i} className="mb-4">
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-2"
                    placeholder={`Seçenek ${String.fromCharCode(65 + i)}`}
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...q.options];
                      updatedOptions[i] = e.target.value;
                      handleChange(index, "options", updatedOptions);
                    }}
                  />

                  {q.imagesEnabled && (
                    <input
                      type="file"
                      className="w-full p-2 mt-2"
                      onChange={(e) => handleOptionFileUpload(index, i, e)}
                      placeholder={`Seçenek ${String.fromCharCode(65 + i)} Resmi`}
                    />
                  )}
                </div>
              ))}

              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Doğru Cevap (A, B, C, D, E)"
                value={q.correctAnswer}
                onChange={(e) => handleChange(index, "correctAnswer", e.target.value)}
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
