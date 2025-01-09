import axios from "axios";

// Cloudinary bilgilerinizi doldurun
const cloudName = "dwvmtepwh"; // Sizin Cloudinary hesabınızdaki cloudName
const uploadPreset = "cirtdan"; // Cloudinary'den bir preset oluşturmanız gerekir

// Resmi Cloudinary'e yüklemek için fonksiyon
export const uploadImageToCloudinary = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", uploadPreset); // Cloudinary'deki ayarlarınız
  formData.append("cloud_name", cloudName);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    return response.data.url; // Yüklenen resmin URL'si
  } catch (error) {
    console.error("Resim yüklenirken hata oluştu:", error);
    throw error;
  }
};
