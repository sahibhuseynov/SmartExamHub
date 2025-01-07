import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import Navbar from './../components/Navbar';

const ExamViewPage = () => {
    const { categoryId, classId, examId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const questionsRef = doc(db, `Exams/${categoryId}/Classes/${classId}/Exams/${examId}`);
                const examSnap = await getDoc(questionsRef);
                if (examSnap.exists()) {
                    setQuestions(examSnap.data().questions || []);
                } else {
                    console.error("Sınav bulunamadı.");
                }
            } catch (error) {
                console.error("Sorular alınırken hata:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [categoryId, classId, examId]);

    return (
        <div>
            <Navbar />
            <div className="max-w-6xl mx-auto p-8 space-y-8">
                <h2 className="text-4xl font-bold text-center">📖 Sınav Soruları</h2>
                {loading ? (
                    <p>Yükleniyor...</p>
                ) : (
                    questions.length > 0 ? (
                        questions.map((question, index) => (
                            <div key={index} className="p-4 border rounded-lg shadow">
                                <p className="text-xl font-bold">{`Soru ${index + 1}: ${question.text}`}</p>
                                <ul className="mt-2">
                                    {question.options.map((option, i) => (
                                        <li key={i} className="ml-4">{option}</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p>Bu sınavda soru bulunmamaktadır.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default ExamViewPage;
