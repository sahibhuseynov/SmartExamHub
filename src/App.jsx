import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from "./pages/Home"
import CategoriesPage from './pages/CategoriesPage';
const App = () => {
  return (
    <Router>
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Routes>
    </AnimatePresence>
  </Router>
  )
}

export default App