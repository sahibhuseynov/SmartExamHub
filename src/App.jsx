// /src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Home from "./pages/Home";
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import AdminPanel from './components/adminPanel/AdminPanel';
import ExamsPage from './pages/ExamsPage';
import ExamDetailsPage from './pages/ExamDetailsPage';
import ExamViewPage from './pages/ExamViewPage';

const App = () => {
  return (
    <Provider store={store}> {/* Redux store uygulama geneline sağlanıyor */}
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/exams/:categoryId/:examId" element={<ExamsPage />} />
            <Route path="/category/:categoryId/class/:classId/exam/:examId/details" element={<ExamDetailsPage />} />
            <Route path="/exam/:categoryId/:classId/:examId/view" element={<ExamViewPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPanel/>} />
          </Routes>
        </AnimatePresence>
      </Router>
    </Provider>
  );
}

export default App;
