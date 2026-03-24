import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import PacksPage from './pages/PacksPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import OrderTrackerPage from './pages/OrderTrackerPage';

function AppContent() {
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  };

  const [page, setPage] = useState(getInitialPage);
  const [cartOpen, setCartOpen] = useState(false);

  const navigate = (p) => {
    setPage(p);
    window.location.hash = p === 'home' ? '' : p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setPage(hash || 'home');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Standalone pages — no navbar/cart
  if (page === 'admin') return <AdminPage onNavigate={navigate} />;

  const renderPage = () => {
    switch (page) {
      case 'home':    return <HomePage onNavigate={navigate} />;
      case 'menu':    return <MenuPage onNavigate={navigate} />;
      case 'packs':   return <PacksPage onNavigate={navigate} />;
      case 'checkout':return <CheckoutPage onNavigate={navigate} />;
      case 'about':   return <AboutPage onNavigate={navigate} />;
      case 'contact': return <AboutPage onNavigate={navigate} />;
      case 'tracker': return <OrderTrackerPage onNavigate={navigate} />;
      default:        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF5' }}>
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
