import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useParams } from "react-router-dom";
import Navbar from './../components/Navbar';

const ExamsPage = () => {
    const { categoryId } = useParams();  // URL parametrelerinden categoryId alıyoruz
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const q = query(collection(db, "Exams"), where("categoryId", "==", categoryId));
                const querySnapshot = await getDocs(q);
                const examsData = [];

                for (let doc of querySnapshot.docs) {
                    const examData = {
                        id: doc.id,
                        ...doc.data()
                    };

                    // 'Questions' alt koleksiyonunu çekme
                    const questionsSnapshot = await getDocs(collection(doc.ref, "Questions"));
                    const questions = questionsSnapshot.docs.map(questionDoc => ({
                        id: questionDoc.id,
                        ...questionDoc.data()
                    }));

                    examData.questions = questions;
                    examsData.push(examData);
                }

                setExams(examsData);
            } catch (error) {
                console.error("Sınavlar alınırken bir hata oluştu: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [categoryId]);

    return (
        <div>
            <Navbar />
            <div className="bg-red-500 text-white p-6">
  <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
    <div className="bg-white text-blue-700 w-full h-44 rounded-lg text-center flex items-center justify-center col-span-1">
      <h2 className="text-2xl font-bold">{categoryId}</h2>
    </div>
    <div className="text-center flex justify-center items-center col-span-2">
      {exams.length > 0 && <h3 className="text-xl font-semibold">{exams[0].title}</h3>}
    </div>
  </div>
</div>

            <div className="max-w-6xl mx-auto p-6">
                {loading ? (
                    <p>Yükleniyor...</p>
                ) : (
                    <ul>
                        {exams.length > 0 ? (
                            exams.map(exam => (
                                <li key={exam.id} className="mb-4">
                                    <ul>
                                        {exam.questions.length > 0 ? (
                                            exam.questions.map(question => (
                                                <li key={question.id}>{question.questionText}</li>
                                            ))
                                        ) : (
                                            <p>Soru bulunmamaktadır.</p>
                                        )}
                                    </ul>
                                </li>
                            ))
                        ) : (
                            <p>Bu kategoride henüz sınav bulunmamaktadır.</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ExamsPage;