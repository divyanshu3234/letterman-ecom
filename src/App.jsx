import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CustomizePage from './pages/CustomizePage';
import RunwayPage from './pages/RunwayPage';
import CartPage from './pages/CartPage';
import KnowUs from './pages/KnowUs';
import HelpDesk from './pages/HelpDesk';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<HomePage />} />
        <Route path="/collection"     element={<GalleryPage />} />
        <Route path="/product/:id"    element={<ProductDetailPage />} />
        <Route path="/customize/:id"  element={<CustomizePage />} />
        <Route path="/runway"         element={<RunwayPage />} />
        <Route path="/cart"           element={<CartPage />} />
        <Route path="/know-us"        element={<KnowUs />} />
        <Route path="/helpdesk"       element={<HelpDesk />} />
      </Routes>
    </BrowserRouter>
  );
}
