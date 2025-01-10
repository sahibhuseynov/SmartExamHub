import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Home from "./pages/Home";
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import AdminPanel from './components/adminPanel/AdminPanel';
import ExamsPage from './pages/ExamsPage';
import ExamDetailsPage from './pages/ExamDetailsPage';
import ExamViewPage from './pages/ExamViewPage';
import AboutUs from './pages/AboutUs';
import ScrollToTop from './components/ScrollToTop';  // ScrollToTop bileşenini import et

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <ScrollToTop />  {/* Sayfa her değiştiğinde scroll sıfırlanır */}
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/aboutUs" element={<AboutUs />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/:categoryId/:examId" element={<ExamsPage />} />
              <Route path="/category/:categoryId/class/:classId/exam/:examId/details" element={<ExamDetailsPage />} />
              <Route path="/exam/:categoryId/:classId/:examId/view" element={<ExamViewPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              
            </Routes>
          </AnimatePresence>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
