import { useEffect, useState } from "react";
import { db } from "../firebase/config"; // Firebase bağlantısı
import { useParams } from "react-router-dom"; // URL parametrelerini almak için
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore'dan veri almak için
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BlogDetailPage = () => {
  const { slug } = useParams(); // URL parametre (slug)
  const [blog, setBlog] = useState(null); // Blog verisi
  const [loading, setLoading] = useState(true); // Yükleniyor durumu
  const [error, setError] = useState(null); // Hata durumu

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null); // Hata durumunu sıfırlıyoruz

      try {
        const q = query(collection(db, "blogs"), where("slug", "==", slug)); // slug ile sorgulama
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const blogDoc = querySnapshot.docs[0];
          setBlog(blogDoc.data());
        } else {
          setError("Blog bulunamadı.");
        }
      } catch (err) {
        console.error("Blog verisi alınırken hata oluştu:", err);
        setError("Blog verisi alınırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-grow py-16 px-4 lg:px-0">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg text-gray-400"></span>
            </div>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-center mb-12">
                {blog.title}
              </h1>
              <section className="mb-8">
                <p className="text-gray-600 text-sm mb-4">
                  Kategori: {blog.category} -{" "}
                  {new Date(blog.createdAt.toDate()).toLocaleDateString()}
                </p>
              </section>
              <div className="space-y-8">
                {blog.sections.map((section, index) => (
                  <div key={index} className="space-y-6">
                    {section.type === "image" && (
                      <div
                        className={`flex flex-col md:flex-row items-center gap-6 border-4 bg-slate-200 border-blue-700 rounded-lg overflow-hidden ${
                          index % 2 === 0 ? "" : "md:flex-row-reverse"
                        }`}
                      >
                        <div className="w-full md:w-1/2">
                          <img
                            src={section.url}
                            alt={section.alt}
                            className="w-full h-auto object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="w-full md:w-1/2 p-4">
                          <p
                            className="text-gray-800 text-lg"
                            dangerouslySetInnerHTML={{
                              __html: section.text.replace(
                                /<h4>/g,
                                '<h4 class="text-2xl font-semibold mb-4">'
                              ),
                            }}
                          ></p>
                        </div>
                      </div>
                    )}
                    {section.type === "text" && (
                      <div className="border-4 bg-slate-200 border-blue-700 rounded-lg p-8 text-center">
                        <p
                          className="text-gray-800"
                          dangerouslySetInnerHTML={{
                            __html: section.content.replace(
                              /<h4>/g,
                              '<h4 class="text-2xl font-semibold mb-4">'
                            ),
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetailPage;
