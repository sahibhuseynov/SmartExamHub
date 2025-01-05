import { useState } from 'react';
import { createExam } from '../../firebase/config';

const AdminPanel = () => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [questions, setQuestions] = useState([
        { questionText: "", options: ["", "", ""], correctAnswer: "" }
    ]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { questionText: "", options: ["", "", ""], correctAnswer: "" }]);
    };

    const handleChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createExam(title, category, questions);
    };

    return (
        <div>
            <h2>Admin - Yeni Sınav Oluştur</h2>
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
