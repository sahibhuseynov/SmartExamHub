import { useState } from "react";
import { db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadFileToCloudinary } from "../../utils/cloudinary";

const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Admin"); // Varsayılan olarak Admin
  const [sections, setSections] = useState([]); // İçeriği bölümlerle saklamak için
  const [newImage, setNewImage] = useState(null);
  const [imageText, setImageText] = useState("");
  const [coverImage, setCoverImage] = useState(null); // Kapak fotoğrafı
  const [coverImageUrl, setCoverImageUrl] = useState(""); // Kapak fotoğrafı URL'si
  const [newText, setNewText] = useState(""); // Yeni metin eklemek için

  const handleImageUpload = async () => {
    if (newImage) {
      try {
        const fileUrl = await uploadFileToCloudinary(newImage);
        const newSection = {
          type: "image",
          url: fileUrl,
          alt: "Resim açıklaması", // Varsayılan alt metni
          text: imageText || "", // Resim açıklaması
        };
        setSections([...sections, newSection]);
        setNewImage(null);
        setImageText("");
        alert("Resim başarıyla yüklendi!");
      } catch (error) {
        console.error("Resim yükleme hatası: ", error);
        alert("Resim yüklenirken bir hata oluştu.");
      }
    } else {
      alert("Lütfen bir resim seçin.");
    }
  };

  const handleCoverImageUpload = async () => {
    if (coverImage) {
      try {
        const fileUrl = await uploadFileToCloudinary(coverImage);
        setCoverImageUrl(fileUrl);
        setCoverImage(null);
        alert("Kapak fotoğrafı başarıyla yüklendi!");
      } catch (error) {
        console.error("Kapak fotoğrafı yükleme hatası: ", error);
        alert("Kapak fotoğrafı yüklenirken bir hata oluştu.");
      }
    } else {
      alert("Lütfen bir kapak fotoğrafı seçin.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverImageUrl) {
      alert("Lütfen bir kapak fotoğrafı yükleyin.");
      return;
    }
    try {
      await addDoc(collection(db, "blogs"), {
        title,
        slug,
        category,
        author,
        content,
        sections, // Bölümler burada saklanıyor
        coverImage: coverImageUrl, // Kapak fotoğrafı URL'si
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      alert("Blog başarıyla eklendi!");
      setTitle("");
      setSlug("");
      setCategory("");
      setContent("");
      setSections([]);
      setCoverImageUrl("");
    } catch (error) {
      console.error("Blog eklenirken hata oluştu:", error);
      alert("Blog eklenirken bir hata oluştu.");
    }
  };

  const handleAddText = () => {
    if (newText.trim()) {
      const newSection = { type: "text", content: newText };
      setSections([...sections, newSection]);
      setNewText("");
    } else {
      alert("Lütfen geçerli bir metin girin.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Yeni Blog Ekle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Başlık"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="İçerik"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          {/* Kapak Fotoğrafı Yükleme */}
          <div className="space-y-2">
            <input
              type="file"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={handleCoverImageUpload}
              className="w-full bg-green-500 text-white py-2 rounded-lg"
            >
              Kapak Fotoğrafını Yükle
            </button>
          </div>

          {/* İçerik Bölümleri */}
          <div className="space-y-2">
            <input
              type="file"
              onChange={(e) => setNewImage(e.target.files[0])}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              placeholder="Resim açıklamasını girin"
              value={imageText}
              onChange={(e) => setImageText(e.target.value)}
            />
            <button
              type="button"
              onClick={handleImageUpload}
              className="w-full bg-green-500 text-white py-2 rounded-lg"
            >
              Resmi Yükle
            </button>
          </div>

          {/* Metin Ekleme Alanı */}
          <div className="space-y-2">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Metin ekleyin"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddText}
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Metin Ekle
            </button>
          </div>

          {/* Eklenen Bölümler */}
          {sections.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold">Eklenen Bölümler:</h3>
              {sections.map((section, index) => (
                <div key={index} className="space-y-2">
                  {section.type === "image" && (
                    <div>
                      <img
                        src={section.url}
                        alt={section.alt}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <p className="mt-2 text-sm text-gray-600">{section.text}</p>
                    </div>
                  )}
                  {section.type === "text" && <p>{section.content}</p>}
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Blogu Ekle
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
