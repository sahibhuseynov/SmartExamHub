import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import ChatWithUs from './../components/ChatWithUs';

const Dashboard = () => {
  return (
    <div className="bg-blue-300">
      <ChatWithUs />
        <Navbar />
        <Slider />
    </div>
  );
};

export default Dashboard;
