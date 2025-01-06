import { useState, useEffect } from 'react';
import { createExam, db } from '../../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const AdminPanel = () => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [classType, setClassType] = useState("");  
    const [questions, setQuestions] = useState([{ questionText: "", options: ["", "", ""], correctAnswer: "" }]);
    const [existingCategories, setExistingCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Exams"));
                const categories = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title,
                    categoryId: doc.data().categoryId,
                    classTypes: doc.data().classTypes || []  // ✅ Sınıf listesi
                }));
                setExistingCategories(categories);
            } catch (error) {
                console.error("Kategoriler alınırken hata oluştu: ", error);
            }
        };
        fetchCategories();
    }, []);

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

        const existingCategory = existingCategories.find(cat => cat.categoryId === category);

        if (existingCategory) {
            if (!existingCategory.classTypes.includes(classType)) {
                // ✅ Yeni sınıfı mevcut kategoriye ekle
                await updateDoc(doc(db, "Exams", existingCategory.id), {
                    classTypes: [...existingCategory.classTypes, classType]
                });
                alert(`${category} kategorisine yeni sınıf eklendi: ${classType}`);
            } else {
                alert("Bu sınıf zaten mevcut!");
            }
        } else {
            // ✅ Yeni kategori oluştur
            await createExam(title, category, classType, questions);
            alert("Yeni kategori oluşturuldu ve sınav eklendi!");
        }
    };

    return (
        <div>
            <h2>Admin Panel - Yeni Sınav Oluştur</h2>

            {/* ✅ Mevcut Kategorileri Listele */}
            <h3>Mevcut Kategoriler:</h3>
            <ul>
                {existingCategories.map(cat => (
                    <li key={cat.id}>
                        {cat.title} ({cat.categoryId}) - Sınıflar: {cat.classTypes.join(", ")}
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Sınav Başlığı"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Kategori ID"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <select value={classType} onChange={(e) => setClassType(e.target.value)}>
                    <option value="">Sınıf Seç</option>
                    <option value="1stGrade">1. Sınıf</option>
                    <option value="2ndGrade">2. Sınıf</option>
                    <option value="3rdGrade">3. Sınıf</option>
                </select>

                {questions.map((q, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            placeholder="Soru Metni"
                            value={q.questionText}
                            onChange={(e) => handleChange(index, "questionText", e.target.value)}
                        />
                        {q.options.map((option, i) => (
                            <input
                                key={i}
                                type="text"
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
                            placeholder="Doğru Cevap"
                            value={q.correctAnswer}
                            onChange={(e) => handleChange(index, "correctAnswer", e.target.value)}
                        />
                    </div>
                ))}

                <button type="button" onClick={handleAddQuestion}>Soru Ekle</button>
                <button type="submit">Sınavı Kaydet</button>
            </form>
        </div>
    );
};

export default AdminPanel;
