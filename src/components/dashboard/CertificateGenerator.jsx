import { jsPDF } from "jspdf";
import PropTypes from 'prop-types';
import certificateTemplate from "../../assets/Sertifika.png"; // Şablon PNG dosyası
import "../../assets/font/Poppins-Regular-normal";
import { uploadFileToCloudinary } from "../../utils/cloudinary"; // Cloudinary yükleme fonksiyonu
import { db } from  '../../firebase/config';
import {  arrayUnion, doc, updateDoc } from "firebase/firestore"; // Firestore işlemleri

const CertificateGenerator = ({ userName, examName, date, userUID }) => {
    let isGenerating = false;
    
    const generatePDF = async () => {
        if (isGenerating) return;
        isGenerating = true;

        const pdfDoc = new jsPDF('l', 'mm', [529, 374]);
        pdfDoc.addImage(certificateTemplate, "PNG", 0, 0, 529, 374);

        const capitalizeName = userName
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");

        pdfDoc.setFont("Poppins-Regular", "normal");
        pdfDoc.setFontSize(32);
        pdfDoc.setTextColor(50, 50, 50);
        pdfDoc.text(capitalizeName, 220, 180);

        const wrappedText = pdfDoc.splitTextToSize(
            `Təşkilatımız tərəfindən ${date} tarixində keçirilən "${examName}" Təhsil proqramını tamamlayaraq bu sənədi almağa haqq qazandı.`,
            480
        );

        const lineSpacing = 20;
        wrappedText.forEach((line, index) => {
            const textWidth = pdfDoc.getTextWidth(line);
            const xPosition = (529 - textWidth) / 2;
            const yPosition = 220 + index * lineSpacing;
            pdfDoc.text(line, xPosition, yPosition);
        });

        const pdfBlob = pdfDoc.output("blob");
        pdfDoc.save(`${userName}_sertifika.pdf`);

        try {
            // PDF dosyasını Cloudinary'e yükle
            const url = await uploadFileToCloudinary(pdfBlob); // Yükleme fonksiyonu güncellenmiş şekilde çağrılıyor
            console.log("Cloudinary Sertifika URL'si:", url);

            // Sertifikayı Firestore'a kaydet
            const userDocRef = doc(db, "Users", userUID);
            await updateDoc(userDocRef, {
                certificates: arrayUnion({
                    url:url,
                    examName: examName,
                })
            });
            console.log("Sertifika Firebase'e kaydedildi.");
        } catch (error) {
            console.error("Sertifika yüklenirken hata oluştu:", error);
        } finally {
            isGenerating = false;
        }
    };

    console.log(userUID);

    return (
        <div>
            <h2>Tebrikler, sınavı tamamladınız!</h2>
            <button onClick={generatePDF} disabled={isGenerating}>
                Sertifikayı İndir ve Yükle
            </button>
        </div>
    );
};

CertificateGenerator.propTypes = {
    userName: PropTypes.string.isRequired,
    examName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    userUID: PropTypes.string.isRequired, // UID prop olarak gereklidir
};

export default CertificateGenerator;
