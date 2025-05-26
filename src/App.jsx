import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import AdminPanel from './pages/AdminPanel';
import ExamsPage from './pages/ExamsPage';
import ExamDetailsPage from './pages/ExamDetailsPage';
import ExamViewPage from './pages/ExamViewPage';
import AboutUs from './pages/AboutUs';
import ScrollToTop from './components/ScrollToTop';
import ProfilePage from './pages/ProfilePage';
import RewardsPage from './pages/RewardsPage';
import PaymentPage from './pages/PaymentPage';
import PaymentConditions from './pages/PaymentConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import LoginPage from './pages/LoginPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';
import KurumTanitim from './pages/kurs/KurumTanitim';
import InstitutionRegistration from './pages/kurs/QeydiyyatKurum';
import KurumDashboard from './pages/kurs/KurumDashboard';
import ProtectedInstitutionRoute from './components/ProtectedInstitutionRoute';
import LoadingSpinner from './components/LoadingSpinner';
import InstitutionPage from './pages/kurs/InstitutionPage';


const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <Router>
          <ScrollToTop />
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
              <Route path="/termsOfUse" element={<TermsOfUse />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/kurslar" element={<KurumTanitim/>} />
              <Route path="/registrationForm" element={<InstitutionRegistration />} />
              <Route path="/institutions/:institutionId" element={<InstitutionPage />} />
              
              {/* Protected Institution Routes */}
              <Route element={<ProtectedInstitutionRoute />}>
                <Route path="/kurumdashboard" element={<KurumDashboard/>} />
                {/* Diğer kuruma özel route'lar buraya eklenebilir */}
              </Route>
            </Routes>
          </AnimatePresence>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;