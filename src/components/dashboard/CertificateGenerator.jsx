import { jsPDF } from "jspdf";
import PropTypes from 'prop-types';
import certificateTemplate from "../../assets/Sertifika.png"; // Şablon PNG dosyasını import ediyoruz
import "../../assets/font/Poppins-Regular-normal";

const CertificateGenerator = ({ userName, examName, date }) => {
    const generatePDF = () => {
        const doc = new jsPDF('l', 'mm', [529, 374]); // PDF yönlendirmesi yatay ve özel boyut (genişlik, yükseklik)

        // Sertifika şablonunu PDF'ye tam ölçülerle ekle
        doc.addImage(certificateTemplate, "PNG", 0, 0, 529, 374);

        // Kullanıcı adı için büyük harflerle baş harf düzenleme
        const capitalizeName = userName
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");

        doc.setFont("Poppins-Regular", "normal");
        doc.setFontSize(32);
        doc.setTextColor(50, 50, 50); // Siyaha yakın koyu gri (RGB)
        doc.text(capitalizeName, 220, 180); // Konum, şablona göre ayarlanmalı

        // Açıklama metnini alt satıra geçtiğinde ortalayarak ve satır aralığını artırarak ekle
        const wrappedText = doc.splitTextToSize(
            `Təşkilatımız tərəfindən ${date} tarixində keçirilən "${examName}" Təhsil proqramını tamamlayaraq bu sənədi almağa haqq qazandı.`,
            480
        );

        const lineSpacing = 20; // Satırlar arasındaki boşluk (daha büyük değerler daha geniş aralık sağlar)
        wrappedText.forEach((line, index) => {
            const textWidth = doc.getTextWidth(line); // Metin genişliğini ölç
            const xPosition = (529 - textWidth) / 2;  // Ortalamak için x pozisyonu hesapla
            const yPosition = 220 + index * lineSpacing; // Satır aralığını ayarla
            doc.text(line, xPosition, yPosition);
        });

        // Sertifikayı indir
        doc.save(`${userName}_sertifika.pdf`);
    };

    return (
        <div>
            <h2>Tebrikler, sınavı tamamladınız!</h2>
            <button onClick={generatePDF}>Sertifikayı İndir</button>
        </div>
    );
};
CertificateGenerator.propTypes = {
    userName: PropTypes.string.isRequired,
    examName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
};

export default CertificateGenerator;
