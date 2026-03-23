import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import PacksPage from './pages/PacksPage';
import AboutPage from './pages/AboutPage';

// Placeholder pages - to be built out
function ComingSoon({ title }) {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif", flexDirection: 'column', gap: 12,
    }}>
      <div style={{ fontSize: 48 }}>🔧</div>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 600, color: '#1C1A14', margin: 0 }}>
        {title}
      </h2>
      <p style={{ fontSize: 14, color: '#9A8F85' }}>Esta página está en construcción</p>
    </div>
  );
}

function AppContent() {
  const [page, setPage] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage onNavigate={navigate} />;
      case 'menu': return <MenuPage onNavigate={navigate} />;
      case 'packs': return <PacksPage onNavigate={navigate} />;
      case 'about': return <AboutPage onNavigate={navigate} />;
      case 'contact': return <AboutPage onNavigate={navigate} />;
      case 'checkout': return <CheckoutPage onNavigate={navigate} />;
      default: return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7' }}>
      <Navbar activePage={page} onNavigate={navigate} onCartOpen={() => setCartOpen(true)} />
      <main>
        {renderPage()}
      </main>
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
