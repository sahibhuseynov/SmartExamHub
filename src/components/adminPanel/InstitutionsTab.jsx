import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { FiCheckCircle, FiXCircle, FiHome, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import { db } from "../../firebase/config";
import { createNotification } from "../../firebase/createNotification";

const InstitutionsTab = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "institutions"));
        const institutionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setInstitutions(institutionsData);
      } catch (err) {
        console.error("Error fetching institutions:", err);
        setError("Kurumlar yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

    const handleApproveInstitution = async (institutionId) => {
  try {
    const institutionRef = doc(db, "institutions", institutionId);
    const institutionDoc = await getDoc(institutionRef);
    const institutionData = institutionDoc.data();

    if (!institutionData.adminUserId) {
      throw new Error("Kurum sahibi bulunamadı!");
    }

    // 1. Kurumun durumunu "active" yap
    await updateDoc(institutionRef, { status: "active" });

    // 2. Kurum sahibine bildirim gönder
    await createNotification({
      userId: institutionData.adminUserId,
      title: "Qurum Təsdiqləndi 🎉",
      message: `${institutionData.name} qurumunuz uğurla təsdiqləndi! Artıq şagird qeydiyyatı apara bilərsiniz.`,
      link: "/kurumdashboard", // Yönlendirme linki
    });

    // 3. State'i güncelle
    setInstitutions(prev =>
      prev.map(inst => (inst.id === institutionId ? { ...inst, status: "active" } : inst))
    );
  } catch (err) {
    console.error("Kurum onaylanırken hata:", err);
    setError("Kurum onaylanamadı!");
  }
};

  const handleRejectInstitution = async (institutionId) => {
    try {
      const institutionRef = doc(db, "institutions", institutionId);
      await updateDoc(institutionRef, {
        status: "rejected"
      });
      
      setInstitutions(prev => prev.map(inst => 
        inst.id === institutionId ? { ...inst, status: "rejected" } : inst
      ));
    } catch (err) {
      console.error("Error rejecting institution:", err);
      setError("Kurum reddedilirken hata oluştu");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Kurumlar yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiXCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutions.map((institution) => (
          <motion.div
            key={institution.id}
            whileHover={{ y: -3 }}
            className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
              institution.status === "active"
                ? "border-green-500"
                : institution.status === "rejected"
                ? "border-red-500"
                : "border-yellow-500"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{institution.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {institution.description || "Açıklama yok"}
                </p>
                <div className="flex items-center mt-3 text-sm text-gray-500">
                  <FiUser className="mr-1" />
                  <span>{institution.members?.length || 0} üye</span>
                </div>
              </div>
              {institution.logoUrl ? (
                <img
                  src={institution.logoUrl}
                  alt={institution.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <FiHome className="text-gray-400" />
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    institution.status === "active"
                      ? "bg-green-100 text-green-800"
                      : institution.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {institution.status === "active"
                    ? "Onaylandı"
                    : institution.status === "rejected"
                    ? "Reddedildi"
                    : "Beklemede"}
                </span>

                {institution.status === "inactive" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproveInstitution(institution.id)}
                      className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
                    >
                      <FiCheckCircle className="mr-1" />
                      Onayla
                    </button>
                    <button
                      onClick={() => handleRejectInstitution(institution.id)}
                      className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
                    >
                      <FiXCircle className="mr-1" />
                      Reddet
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InstitutionsTab;