// /src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Home from "./pages/Home";
import Dashboard from './pages/Dashboard';
import CategoriesPage from './pages/CategoriesPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return (
    <Provider store={store}> {/* Redux store uygulama geneline sağlanıyor */}
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </Provider>
  );
}

export default App;
