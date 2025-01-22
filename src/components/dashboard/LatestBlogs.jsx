import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import BlogCard from "./BlogCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsQuery = query(
          collection(db, "blogs"),
          orderBy("createdAt", "desc"),
          limit(4) // Son 4 blogu al
        );
        const blogsSnapshot = await getDocs(blogsQuery);
        const blogsData = blogsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsData);
      } catch (error) {
        console.error("Blog verisi alınırken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Son Bloglar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {loading
          ? [...Array(4)].map((_, index) => (
              <div key={index} className="p-4 shadow-lg rounded-lg">
                <Skeleton height={200} className="mb-2" />
                <Skeleton height={20} width="80%" className="mb-1" />
                <Skeleton height={20} width="60%" />
              </div>
            ))
          : blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
      </div>
    </div>
  );
};

export default LatestBlogs;
