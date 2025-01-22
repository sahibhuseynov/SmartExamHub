import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogCard from "../components/dashboard/BlogCard"; // BlogCard'ı dahil et

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const snapshot = await getDocs(collection(db, "blogs"));
        const blogData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow py-16 px-4 lg:px-0">
        <div className="max-w-6xl mx-auto">
       

          {error && <p className="text-center text-red-600 mb-6">{error}</p>}
          {loading ? (
            <p>Yükleniyor...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {blogs.map((blog) => (
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
