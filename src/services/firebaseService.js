import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";  // Firebase yapılandırması

/**
 * Kullanıcının tamamladığı sınavı kaydeder.
 * @param {string} examId - Sınav ID
 * @param {string} categoryId - Kategori ID
 * @param {string} classId - Sınıf ID
 */
export const handleCompleteExam = async (examId, categoryId, classId) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("Kullanıcı giriş yapmamış.");
    return;
  }

  const userCompletedExamsRef = doc(db, `Users/${user.uid}/CompletedExams/${examId}`);
  
  try {
    await setDoc(userCompletedExamsRef, {
      examId,
      categoryId,
      classId,
      completedAt: new Date().toISOString()
    });
    console.log("Sınav tamamlandı olarak işaretlendi.");
  } catch (error) {
    console.error("Sınavı tamamlama verisi güncellenirken hata:", error);
  }
};
