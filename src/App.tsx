import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import { useEffect } from 'react';
import { setCurrentUser } from './utils/helper';
import AdminPage from './pages/AdminPage';

function App() {
  useEffect(() => {
    setCurrentUser("user1");
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
