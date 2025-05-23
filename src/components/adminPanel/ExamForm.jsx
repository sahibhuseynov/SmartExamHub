import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, doc, setDoc, addDoc, getDocs } from "firebase/firestore";
import { uploadFileToCloudinary } from "../../utils/cloudinary";

const ExamForm = () => {
  const [categories, setCategories] = useState([]);
  const [classes, setClasses] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [classType, setClassType] = useState("");
  const [newClass, setNewClass] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [title, setTitle] = useState("");
  const [examTitle2, setExamTitle2] = useState("");
  const [description, setDescription] = useState("");
  const [examDate, setExamDate] = useState("");
  const [price, setPrice] = useState("");
  const [bulkQuestions, setBulkQuestions] = useState("");
  const [isCertified, setIsCertified] = useState(false);
  const [examDuration, setExamDuration] = useState("");
  
  // Sections state
    const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");

  // Fetch categories and classes
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

  // Handle bulk question addition for active section
  const handleBulkAddQuestions = () => {
    if (!bulkQuestions.trim()) return;

    const lines = bulkQuestions.split('\n');
    const newQuestions = [];
    let currentQuestion = null;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      const nextLine = lines[index + 1] ? lines[index + 1].trim() : "";

      // Check if it's an instruction line
      const isInstructionLine = /^(choose the correct option\.?|doğru seçeneği seçin\.?)$/i.test(trimmedLine);

      // Detect new question
      const isNewQuestion =
        !isInstructionLine && (
          trimmedLine.endsWith('?') ||
          /^soru:/i.test(trimmedLine) ||
          (!/^[A-Da-d][.)]\s/.test(trimmedLine) && /^[A-Da-d][.)]\s/.test(nextLine)) ||
          (trimmedLine && (index === 0 || lines[index - 1].trim() === "") && !/^[A-Da-d][.)]\s/.test(trimmedLine))
        );

      // Start new question
      if (isNewQuestion) {
        if (currentQuestion && currentQuestion.questionText) {
          newQuestions.push(currentQuestion);
        }

        currentQuestion = {
          questionText: trimmedLine.replace(/^soru:/i, '').trim(),
          options: ["", "", "", ""],
          correctAnswer: "",
          image: null,
          imagesEnabled: false,
          optionImages: [null, null, null, null],
          audio: null
        };
      }
      // Option line (A-D)
      else if (currentQuestion && /^[A-Da-d][.)]?\s/.test(trimmedLine)) {
        const optionIndex = trimmedLine.toUpperCase().charCodeAt(0) - 65;
        if (optionIndex >= 0 && optionIndex < 4) {
          const optionText = trimmedLine.replace(/^[A-Da-d][.)]?\s/, '').trim();
          currentQuestion.options[optionIndex] = optionText;

          // Mark correct answer
          if (trimmedLine.includes("(doğru)") || trimmedLine.includes("✓")) {
            currentQuestion.correctAnswer = optionText;
          }
        }
      }
      // Correct answer line
      else if (currentQuestion && /^(doğru cevap:|Cavab:|correct answer:|cevap:)/i.test(trimmedLine)) {
        currentQuestion.correctAnswer = trimmedLine.replace(/^(doğru cevap:|Cavab:|correct answer:|cevap:)/i, '').trim();
      }

      // Add last question
      if (index === lines.length - 1 && currentQuestion && currentQuestion.questionText) {
        newQuestions.push(currentQuestion);
      }
    });

    if (newQuestions.length > 0) {
      const activeQuestions = getActiveSectionQuestions();
      updateActiveSectionQuestions([...activeQuestions, ...newQuestions]);
      setBulkQuestions("");
      alert(`${newQuestions.length} soru eklendi!`);
    } else {
      alert("Soru formatı tanınamadı! Lütfen örnek formata uygun girin.");
    }
  };

  // Get questions for active section
   const getActiveSectionQuestions = () => {
    if (!activeSection) return [];
    const section = sections.find(s => s.id === activeSection);
    return section ? section.questions : [];
  };

  // Update questions for active section
  const updateActiveSectionQuestions = (newQuestions) => {
    setSections(sections.map(section => 
      section.id === activeSection 
        ? { ...section, questions: newQuestions } 
        : section
    ));
    setActiveSection(activeSection);
  };

  // Add new category
  const handleAddCategory = async () => {
    if (newCategory) {
      try {
        const categoryRef = doc(db, "Exams", newCategory);
        await setDoc(categoryRef, { description: categoryDescription });
        setCategories([...categories, { id: newCategory, description: categoryDescription }]);
        setCategoryId(newCategory);
        setNewCategory("");
      } catch (error) {
        console.error("Kategori eklenirken hata oluştu: ", error);
      }
    }
  };

  // Add new class
  const handleAddClass = async () => {
    if (newClass && categoryId) {
      try {
        const classRef = doc(collection(db, `Exams/${categoryId}/Classes`), newClass);
        await setDoc(classRef, { classType: newClass });
        setClasses([...classes, { id: newClass, classType: newClass }]);
        setClassType(newClass);
        setNewClass("");
      } catch (error) {
        console.error("Sınıf eklenirken hata oluştu: ", error);
      }
    }
  };

  // Add new section
  const handleAddSection = () => {
    if (newSectionName.trim()) {
      const newSectionId = newSectionName.toLowerCase().replace(/\s+/g, '-');
      const newSection = {
        id: newSectionId,
        name: newSectionName,
        questions: [
          {
            questionText: "",
            options: ["", "", "", ""],
            correctAnswer: "",
            image: null,
            imagesEnabled: false,
            optionImages: [null, null, null, null],
            audio: null,
          },
        ],
      };

      setSections([...sections, newSection]);
      
      // Set the newly added section as active
      setActiveSection(newSectionId);
      setNewSectionName("");
    }
  };

  // Add question to active section
  const handleAddQuestion = () => {
    const activeQuestions = getActiveSectionQuestions();
    updateActiveSectionQuestions([
      ...activeQuestions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        image: null,
        imagesEnabled: false,
        optionImages: [null, null, null, null],
        audio: null,
      },
    ]);
  };

  // Handle question field changes
  const handleChange = (index, field, value) => {
    const activeQuestions = [...getActiveSectionQuestions()];
    activeQuestions[index][field] = value;
    updateActiveSectionQuestions(activeQuestions);
  };

  // Handle file upload for question images
  const handleFileUpload = async (index, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const fileUrl = await uploadFileToCloudinary(file);
        const activeQuestions = [...getActiveSectionQuestions()];
        activeQuestions[index].image = fileUrl;
        activeQuestions[index].imagesEnabled = true;
        updateActiveSectionQuestions(activeQuestions);
      } catch (error) {
        console.error("Dosya yüklenirken hata oluştu:", error);
      }
    }
  };

  // Handle option image upload
  const handleOptionFileUpload = async (index, optionIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const fileUrl = await uploadFileToCloudinary(file);
        const activeQuestions = [...getActiveSectionQuestions()];
        activeQuestions[index].optionImages[optionIndex] = fileUrl;
        updateActiveSectionQuestions(activeQuestions);
      } catch (error) {
        console.error("Dosya yüklenirken hata oluştu:", error);
      }
    }
  };

  // Handle audio upload
  const handleAudioUpload = async (index, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const fileUrl = await uploadFileToCloudinary(file);
        const activeQuestions = [...getActiveSectionQuestions()];
        activeQuestions[index].audio = fileUrl;
        updateActiveSectionQuestions(activeQuestions);
      } catch (error) {
        console.error("Ses dosyası yüklenirken hata oluştu:", error);
      }
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create category document
      const categoryRef = doc(db, "Exams", categoryId);
      await setDoc(
        categoryRef,
        {
          categoryId,
          description: categoryDescription,
        },
        { merge: true }
      );

      // Create class document
      const classRef = doc(collection(categoryRef, "Classes"), classType);
      await setDoc(classRef, { classType }, { merge: true });

      // Create exam document
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
        sections: sections.map(section => ({
          id: section.id,
          name: section.name
        }))
      });

      // Create sections and questions
      for (const section of sections) {
        const sectionRef = doc(collection(examRef, "Sections"), section.id);
        await setDoc(sectionRef, {
          name: section.name
        });

        // Add questions for this section
        const questionsRef = collection(sectionRef, "Questions");
        for (const question of section.questions) {
          const optionsWithImages = question.options.map((option, index) => ({
            option,
            optionPhoto: question.optionImages[index] || null,
          }));

          await addDoc(questionsRef, {
            questionText: question.questionText,
            options: optionsWithImages,
            correctAnswer: question.correctAnswer,
            image: question.image,
            audio: question.audio || null,
          });
        }
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
          {/* Category Section */}
          <div>
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
            <input
              type="text"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
              placeholder="Yeni Kategori"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button
              type="button"
              className="w-full bg-green-500 text-white py-2 rounded-lg mt-2"
              onClick={handleAddCategory}
            >
              Yeni Kategori Ekle
            </button>
          </div>

          {/* Class Section */}
          <div>
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
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
              placeholder="Yeni Sınıf"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
            />
            <button
              type="button"
              className="w-full bg-green-500 text-white py-2 rounded-lg mt-2"
              onClick={handleAddClass}
            >
              Yeni Sınıf Ekle
            </button>
          </div>

          {/* Exam Details */}
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

          {/* Sections Management */}
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Bölümler</h3>
            <div className="flex flex-wrap gap-2 mb-4">
            {sections.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      type="button"
                      className={`px-4 py-2 rounded-lg ${activeSection === section.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      {section.name}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Şu anda <strong>{sections.find(s => s.id === activeSection)?.name}</strong> bölümünü düzenliyorsunuz
                </p>
              </>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-yellow-700">Henüz bölüm eklenmedi. Sınavınıza bölüm eklemek istiyor musunuz?</p>
              </div>
            )}
            </div>
           <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg"
                placeholder="Bölüm Adı (Örn: Matematik, Məntiq)"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
              />
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={handleAddSection}
              >
                Bölüm Ekle
              </button>
            </div>
          </div>

          {/* Bulk Questions */}
          <div className="p-4 mb-6 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Toplu Soru Ekle</h3>
            <textarea
              className="w-full p-3 border rounded mb-2 h-40 font-mono text-sm"
              placeholder={`Örnek format:
1. Hangi dil konuşulur?
A) İngilizce (doğru)
B) Fransızca
C) Türkçe
D) Almanca
Cevap: İngilizce

2. En büyük gezegen?
A) Mars
B) Jüpiter ✓
C) Dünya
D) Venüs
Doğru Cevap: Jüpiter`}
              value={bulkQuestions}
              onChange={(e) => setBulkQuestions(e.target.value)}
            />
            <button
                  type="button"
                  onClick={handleBulkAddQuestions}
                  className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                >
                  Soruları Ekle
                </button>
          </div>

          {/* Questions for Active Section */}
           <h3 className="text-xl font-semibold mt-6">
                Sorular: {sections.find(s => s.id === activeSection)?.name}
              </h3>
          
          {getActiveSectionQuestions().map((q, index) => (
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

              <input
                type="file"
                accept="audio/*"
                className="w-full p-2 mt-2"
                onChange={(e) => handleAudioUpload(index, e)}
                placeholder="Ses Dosyası"
              />
              {q.audio && (
                <div className="mt-2 text-sm text-green-600">
                  Ses dosyası yüklendi.
                  <audio controls src={q.audio} className="mt-1" />
                </div>
              )}

              {/* Options */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-4">
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-2"
                    placeholder={`Seçenek ${String.fromCharCode(65 + i)}`}
                    value={q.options[i] || ""}
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
                placeholder="Doğru Cevap (A, B, C, D)"
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