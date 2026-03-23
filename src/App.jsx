import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import PacksPage from './pages/PacksPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const [page, setPage] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin runs standalone — no navbar, no cart
  if (page === 'admin') return <AdminPage onNavigate={navigate} />;

  const renderPage = () => {
    switch (page) {
      case 'home':     return <HomePage onNavigate={navigate} />;
      case 'menu':     return <MenuPage onNavigate={navigate} />;
      case 'packs':    return <PacksPage onNavigate={navigate} />;
      case 'checkout': return <CheckoutPage onNavigate={navigate} />;
      case 'about':    return <AboutPage onNavigate={navigate} />;
      case 'contact':  return <AboutPage onNavigate={navigate} />;
      default:         return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7' }}>
      <Navbar activePage={page} onNavigate={navigate} onCartOpen={() => setCartOpen(true)} />
      <main>{renderPage()}</main>
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); navigate('checkout'); }}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
