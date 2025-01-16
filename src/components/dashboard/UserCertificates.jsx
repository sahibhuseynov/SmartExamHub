import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

const UserCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(certificates)
    const userUID = useSelector((state) => state.user.user.uid); // Redux'dan UID alınması

    useEffect(() => {
        const fetchCertificates = async () => {
            if (!userUID) return; // UID yoksa işlem yapma

            try {
                const userDocRef = doc(db, "Users", userUID);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setCertificates(userData.certificates || []); // Sertifikaları al
                } else {
                    console.log("Belge bulunamadı.");
                }
            } catch (error) {
                console.error("Sertifikalar alınırken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, [userUID]);

    const downloadFile = (url, filename) => {
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => console.error("Dosya indirilemedi:", error));
    };

    return (
        <div className="container mx-auto  ">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Sertifikatlarım</h2>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Loading spinner inside the grid */}
                    <div className="flex justify-center items-center col-span-full">
                        <div className="loading loading-spinner text-gray-400"></div>
                    </div>
                </div>
            ) : certificates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((certificate, index) => (
    <div
        key={index}
        className="bg-white rounded-b-lg border-t-8 border-green-400 px-4 py-5 flex flex-col justify-around shadow-md rounded-lg"
    >
        <p className="text-lg font-bold font-sans">Sertifikat {index + 1}</p>
        <div className="py-3">
            <span>
                {certificate.examId}
            </span>
            <p className="text-sm">
                Sertifikatı uğurla aldınız!
            </p>
        </div>
        <div className="flex items-center justify-between">
            <IoCheckmarkDoneSharp size={32} className="text-green-400" />
            <div>
                <button
                    onClick={() => downloadFile(certificate.url, `sertifika_${index + 1}.pdf`)}
                    className="btn btn-primary text-white"
                >
                    Yüklə
                </button>
            </div>
        </div>
    </div>
))}

                </div>
            ) : (
                <p>Hazırda heç bir sertifikatınız yoxdur. Sertifikat əldə etmək üçün sertifikatlı imtahanlara qatılmalı və uğurlarınız nəticəsində rozet qazandıqdan sonra sertifikatınıza sahib ola bilərsiniz.</p>
            )}
        </div>
    );
};

export default UserCertificates;
