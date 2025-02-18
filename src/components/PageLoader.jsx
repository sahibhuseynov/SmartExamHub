import { useSelector } from "react-redux";

const PageLoader = () => {
  const isLoading = useSelector((state) => state.loading.isLoading);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-1 bg-blue-500 transition-all duration-300 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
      style={{ width: isLoading ? "100%" : "0%" }}
    />
  );
};

export default PageLoader;
