import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import PacksPage from './pages/PacksPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import OrderTrackerPage from './pages/OrderTrackerPage';

function AppContent() {
  const getPage = () => window.location.hash.replace('#','') || 'home';
  const [page, setPage] = useState(getPage);
  const [cartOpen, setCartOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = (p) => {
    setPage(p);
    window.location.hash = p === 'home' ? '' : p;
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  useEffect(() => {
    const onHash = () => setPage(window.location.hash.replace('#','') || 'home');
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('hashchange', onHash);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('resize', onResize); };
  }, []);

  if (page === 'admin') return <AdminPage onNavigate={navigate} />;

  const renderPage = () => {
    switch(page) {
      case 'home':     return <HomePage onNavigate={navigate} />;
      case 'menu':     return <MenuPage onNavigate={navigate} />;
      case 'packs':    return <PacksPage onNavigate={navigate} />;
      case 'checkout': return <CheckoutPage onNavigate={navigate} />;
      case 'about':    return <AboutPage onNavigate={navigate} />;
      case 'contact':  return <AboutPage onNavigate={navigate} />;
      case 'tracker':  return <OrderTrackerPage onNavigate={navigate} />;
      default:         return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#FAF5EC' }}>
      <Navbar activePage={page} onNavigate={navigate} onCartOpen={() => setCartOpen(true)} />
      <main style={{ paddingBottom: isMobile ? 120 : 0 }}>
        {renderPage()}
      </main>
      {!isMobile && (
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}
          onCheckout={() => { setCartOpen(false); navigate('checkout'); }} />
      )}
      {isMobile && <BottomNav activePage={page} onNavigate={navigate} />}
    </div>
  );
}

export default function App() {
  return <CartProvider><AppContent /></CartProvider>;
}
