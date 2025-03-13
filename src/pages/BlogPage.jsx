import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogCard from "../components/dashboard/BlogCard"; // BlogCard'ı dahil et
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Hamısı"); // Filtreleme için kategori

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const snapshot = await getDocs(collection(db, "blogs"));
        const blogData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogData);
      } catch (err) {
        console.error("Blog verisi alınırken hata oluştu:", err);
        setError("Bloglar yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filtrelenmiş bloglar
  const filteredBlogs =
    selectedCategory === "Hamısı"
      ? blogs
      : blogs.filter((blog) => blog.category === selectedCategory);

  // Eşsiz kategorileri belirle
  const categories = ["Hamısı", ...new Set(blogs.map((blog) => blog.category))];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow py-16 px-4 lg:px-0">
        <div className="max-w-6xl mx-auto">
         

          {/* Kategori filtresi */}
          <div className="flex mb-6">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select  border border-gray-300 "
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Hata mesajı */}
          {error && <p className="text-center text-red-600 mb-6">{error}</p>}

          {/* Skeleton veya bloglar */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <Skeleton height={200} className="mb-4" />
                  <Skeleton height={20} className="mb-2" />
                  <Skeleton height={20} width="60%" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
