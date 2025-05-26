import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiPlus, FiTrash2, FiX, FiCheck,} from 'react-icons/fi';

const ExamCreator = ({ institutionId, onClose }) => {
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    duration: 60,
    passingGrade: 50,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'single-choice', // 'single-choice', 'multiple-choice', 'text'
    options: ['', ''],
    correctAnswers: []
  });

  const [activeTab, setActiveTab] = useState('exam-info');

  const handleAddQuestion = () => {
    if (!currentQuestion.text || currentQuestion.options.some(opt => !opt)) return;

    setExamData(prev => ({
      ...prev,
      questions: [...prev.questions, currentQuestion]
    }));

    setCurrentQuestion({
      text: '',
      type: 'single-choice',
      options: ['', ''],
      correctAnswers: []
    });
  };

  const handleAddOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...currentQuestion.options];
    newOptions.splice(index, 1);
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions,
      correctAnswers: prev.correctAnswers.filter(a => a !== index)
    }));
  };

  const handleToggleAnswer = (index) => {
    if (currentQuestion.type === 'single-choice') {
      setCurrentQuestion(prev => ({
        ...prev,
        correctAnswers: [index]
      }));
    } else {
      setCurrentQuestion(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers.includes(index)
          ? prev.correctAnswers.filter(i => i !== index)
          : [...prev.correctAnswers, index]
      }));
    }
  };

  const handleRemoveQuestion = (index) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!examData.title || examData.questions.length === 0) return;
const examRef = collection(db, 'institutionsExams', institutionId, 'Exams');
        // 2. Yeni sınavı ekle
      await addDoc(examRef, {
        ...examData,
        institutionId, // Kurum ID'sini tekrar kaydediyoruz
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isInstitutionExam: true
      });

      onClose();
    } catch (error) {
      console.error("Sınav oluşturma hatası:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Yeni Sınav Oluştur</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('exam-info')}
            className={`px-4 py-3 font-medium ${activeTab === 'exam-info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Sınav Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-3 font-medium ${activeTab === 'questions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Sorular ({examData.questions.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'exam-info' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Sınav Başlığı*</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  value={examData.title}
                  onChange={(e) => setExamData({...examData, title: e.target.value})}
                  placeholder="Örn: Matematik Ara Sınavı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Açıklama</label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  value={examData.description}
                  onChange={(e) => setExamData({...examData, description: e.target.value})}
                  placeholder="Sınav hakkında açıklama..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Başlangıç Tarihi*</label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 border rounded-lg"
                    value={examData.startDate}
                    onChange={(e) => setExamData({...examData, startDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bitiş Tarihi*</label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 border rounded-lg"
                    value={examData.endDate}
                    onChange={(e) => setExamData({...examData, endDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Süre (dakika)*</label>
                  <input
                    type="number"
                    className="w-full p-3 border rounded-lg"
                    value={examData.duration}
                    onChange={(e) => setExamData({...examData, duration: e.target.value})}
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Geçerli Not (%)*</label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg"
                  value={examData.passingGrade}
                  onChange={(e) => setExamData({...examData, passingGrade: e.target.value})}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-8">
              {/* Question List */}
              <div className="space-y-4">
                {examData.questions.map((q, qIndex) => (
                  <div key={qIndex} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{q.text}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {q.type === 'single-choice' ? 'Tek Seçim' : 
                           q.type === 'multiple-choice' ? 'Çoklu Seçim' : 'Metin Cevap'}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    {q.options && (
                      <ul className="mt-3 space-y-2">
                        {q.options.map((opt, optIndex) => (
                          <li key={optIndex} className="flex items-center">
                            <div className={`w-4 h-4 rounded mr-2 ${
                              q.correctAnswers.includes(optIndex) 
                                ? 'bg-green-500 border border-green-600' 
                                : 'border border-gray-300'
                            }`} />
                            <span>{opt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Question */}
              <div className="border-2 border-dashed rounded-lg p-4">
                <h4 className="font-medium mb-4">Yeni Soru Ekle</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Soru Metni*</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg"
                      value={currentQuestion.text}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                      placeholder="Soru metnini giriniz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Soru Tipi*</label>
                    <select
                      className="w-full p-3 border rounded-lg"
                      value={currentQuestion.type}
                      onChange={(e) => setCurrentQuestion({
                        ...currentQuestion, 
                        type: e.target.value,
                        correctAnswers: []
                      })}
                    >
                      <option value="single-choice">Tek Seçim</option>
                      <option value="multiple-choice">Çoklu Seçim</option>
                      <option value="text">Metin Cevap</option>
                    </select>
                  </div>

                  {currentQuestion.type !== 'text' && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium">Seçenekler*</label>
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleAnswer(index)}
                            className={`w-5 h-5 rounded flex items-center justify-center ${
                              currentQuestion.correctAnswers.includes(index)
                                ? 'bg-green-100 text-green-600 border border-green-300'
                                : 'bg-gray-100 border border-gray-300'
                            }`}
                          >
                            {currentQuestion.correctAnswers.includes(index) && <FiCheck size={14} />}
                          </button>
                          <input
                            type="text"
                            className="flex-1 p-2 border rounded"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...currentQuestion.options];
                              newOptions[index] = e.target.value;
                              setCurrentQuestion({...currentQuestion, options: newOptions});
                            }}
                            placeholder={`Seçenek ${index + 1}`}
                          />
                          {currentQuestion.options.length > 2 && (
                            <button
                              onClick={() => handleRemoveOption(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={handleAddOption}
                        className="flex items-center text-blue-600 mt-2"
                      >
                        <FiPlus size={18} className="mr-1" />
                        Yeni Seçenek Ekle
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddQuestion}
                  disabled={!currentQuestion.text || (currentQuestion.type !== 'text' && currentQuestion.options.some(opt => !opt))}
                  className={`mt-6 px-4 py-2 rounded-lg flex items-center ${
                    !currentQuestion.text || (currentQuestion.type !== 'text' && currentQuestion.options.some(opt => !opt))
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <FiPlus className="mr-2" />
                  Soruyu Ekle
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!examData.title || examData.questions.length === 0}
            className={`px-6 py-2 rounded-lg ${
              !examData.title || examData.questions.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Sınavı Oluştur
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamCreator;