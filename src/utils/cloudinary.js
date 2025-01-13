import axios from "axios";

// Cloudinary bilgilerinizi doldurun
const cloudName = "dwvmtepwh"; // Sizin Cloudinary hesabınızdaki cloudName
const uploadPreset = "cirtdan"; // Cloudinary'den bir preset oluşturmanız gerekir

// Dosyayı Cloudinary'e yüklemek için fonksiyon
export const uploadFileToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset); // Cloudinary'deki ayarlarınız
  formData.append("cloud_name", cloudName);

  // Dosya türüne göre uygun endpoint seçimi
  let uploadUrl;
  const fileType = file.type;

  if (fileType.startsWith("image/")) {
    uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  } else if (fileType === "application/pdf") {
    uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
  } else if (fileType.startsWith("audio/") || fileType.startsWith("video/")) {
    uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
  } else {
    throw new Error("Desteklenmeyen dosya türü");
  }

  try {
    const response = await axios.post(uploadUrl, formData);
    return response.data.url; // Yüklenen dosyanın URL'si
  } catch (error) {
    console.error("Dosya yüklenirken hata oluştu:", error);
    throw error;
  }
};
