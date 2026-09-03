import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CommerceProvider } from './context/CommerceContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import posthog from './lib/posthog';

// Automatically captures pageviews in PostHog on SPA route transitions
const PostHogPageViewTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      path: location.pathname,
      search: location.search
    });
  }, [location]);

  return null;
};

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { AIFinder } from './pages/AIFinder';
import { Rankings } from './pages/Rankings';
import { Compare } from './pages/Compare';
import { ProductDetail } from './pages/ProductDetail';
import { PriceIntelligencePage } from './pages/PriceIntelligencePage';
import { AgentsPage } from './pages/AgentsPage';
import { GrowthPage } from './pages/GrowthPage';
import { Checkout } from './pages/Checkout';
import { Profile } from './pages/Profile';
import { DemoMode } from './pages/DemoMode';
import { Auth } from './pages/Auth';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CommerceProvider>
        <BrowserRouter>
          <PostHogPageViewTracker />
          <div className="min-h-screen bg-bg text-ink flex flex-col font-sans selection:bg-accent/25 selection:text-ink">
            
            {/* Global Minimal Navbar */}
            <Navbar />

            {/* Main Application Routes */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/ai-finder" element={<AIFinder />} />
                <Route path="/rankings" element={<Rankings />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/price-intelligence/:id" element={<PriceIntelligencePage />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/growth" element={<GrowthPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/cart" element={<Navigate to="/shop" replace />} />
                <Route path="/demo" element={<DemoMode />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Profile />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Global Drawers, Modals & Floating Trays */}
            <CartDrawer />
            <VoiceSearchModal />
            <CompareFloatingBar />

            {/* Minimal Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </CommerceProvider>
    </AuthProvider>
  );
};

export default App;
