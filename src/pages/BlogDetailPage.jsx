import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiClock, FiFolder, } from "react-icons/fi";
import { motion } from "framer-motion";

// Təkmilləşdirilmiş Şəkil Komponenti
const SmoothImage = ({ src, alt, lazy, className = "" }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        loading={lazy ? "lazy" : "eager"}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}
    </div>
  );
};

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);

      try {
        const q = query(collection(db, "blogs"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const blogDoc = querySnapshot.docs[0];
          setBlog({
            id: blogDoc.id,
            ...blogDoc.data()
          });
        } else {
          setError("Bloq tapılmadı");
        }
      } catch (err) {
        console.error("Bloq məlumatları alınarkən xəta baş verdi:", err);
        setError("Bloq məlumatları alınarkən xəta baş verdi");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // Animasiya variantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow py-12 px-4 lg:px-0">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">😕</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
              <p className="text-gray-600">Əsas səhifəyə qayıdıb yenidən cəhd edin</p>
            </div>
          ) : (
            <motion.article
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {/* Bloq Başlığı */}
              <motion.header variants={itemVariants} className="mb-12 text-center">
                <div className="flex justify-center items-center gap-4 mb-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiClock size={14} />
                    {new Date(blog.createdAt.toDate()).toLocaleDateString('az-AZ', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FiFolder size={14} />
                    {blog.category}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                  {blog.title}
                </h1>
                <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
              </motion.header>

              {/* Bloq Məzmunu */}
              <motion.div variants={containerVariants} className="space-y-12">
                {blog.sections.map((section, index) => (
                  <motion.section
                    key={index}
                    variants={itemVariants}
                    className="space-y-6"
                  >
                    {section.type === "image" && (
                      <div
                        className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-stretch gap-6 bg-white rounded-xl shadow-md overflow-hidden`}
                      >
                        <div className="w-full md:w-1/2 h-64 md:h-auto">
                          <SmoothImage
                            src={section.url}
                            alt={section.alt}
                            lazy={index !== 0}
                            className="h-full"
                          />
                        </div>
                        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                          <div
                            className="prose prose-lg max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{
                              __html: section.text.replace(
                                /<h4>/g,
                                '<h4 class="text-xl font-bold mb-3 text-gray-800">'
                              ),
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {section.type === "text" && (
                      <div className="bg-white rounded-xl shadow-md p-8">
                        <div
                          className="prose prose-lg max-w-none text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: section.content.replace(
                              /<h4>/g,
                              '<h4 class="text-xl font-bold mb-3 text-gray-800">'
                            ),
                          }}
                        />
                      </div>
                    )}
                  </motion.section>
                ))}
              </motion.div>

             
            </motion.article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetailPage;