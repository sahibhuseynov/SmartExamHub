import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import AdminPanel from './components/adminPanel/AdminPanel';
import ExamsPage from './pages/ExamsPage';
import ExamDetailsPage from './pages/ExamDetailsPage';
import ExamViewPage from './pages/ExamViewPage';
import AboutUs from './pages/AboutUs';
import ScrollToTop from './components/ScrollToTop';  // ScrollToTop bileşenini import et
import ProfilePage from './pages/ProfilePage';
import RewardsPage from './pages/RewardsPage';
import PaymentPage from './pages/PaymentPage';
import PaymentConditions from './pages/PaymentConditions';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <ScrollToTop />  {/* Sayfa her değiştiğinde scroll sıfırlanır */}
          <AnimatePresence mode="wait">
            <Routes>
            <Route path="/" element={<Dashboard />} />
              <Route path="/aboutUs" element={<AboutUs />} />
              <Route path="/rewards" element={<RewardsPage/>} />
              
              <Route path="/:categoryId/:examId" element={<ExamsPage />} />
              <Route path="/category/:categoryId/class/:classId/exam/:examId/details" element={<ExamDetailsPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/paymentConditions" element={<PaymentConditions />} />
              <Route path="/exam/:categoryId/:classId/:examId/view" element={<ExamViewPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/profile" element={<ProfilePage />} />
              
            </Routes>
          </AnimatePresence>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
