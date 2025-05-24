import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <img
        src={blog.coverImage}
        alt={blog.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <Link to={`/blog/${blog.slug}`} className="hover:underline hover:text-blue-700 font-medium">
          <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
        </Link>
        <p className="text-gray-600 text-sm mb-2">
          {blog.category} - {new Date(blog.createdAt.toDate()).toLocaleDateString()}
        </p>
        <p className="text-gray-800 text-sm line-clamp-1">{blog.content}</p> {/* İçerikten sadece 3 satır göster */}
      </div>
    </div>
  );
};

export default BlogCard;
