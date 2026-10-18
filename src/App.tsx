import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './lib/store';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { WhatsAppButton } from './components/layout/WhatsAppButton';
import { Toast } from './components/ui/Toast';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmed } from './pages/OrderConfirmed';
import { TrackOrder } from './pages/TrackOrder';
import { OurStory } from './pages/OurStory';
import { Sourcing } from './pages/Sourcing';
import { QualityPromise } from './pages/QualityPromise';
import { FAQ } from './pages/FAQ';
import { Shipping } from './pages/Shipping';
import { Contact } from './pages/Contact';
import { Gifting } from './pages/Gifting';
import { Corporate } from './pages/Corporate';
import { Reviews } from './pages/Reviews';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { ReturnsRefunds } from './pages/ReturnsRefunds';
import { Admin } from './pages/Admin';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

import { Database, AlertTriangle } from 'lucide-react';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#EADFD0] rounded-3xl p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#1F3D2B] text-[#C5A059] flex items-center justify-center mx-auto shadow-xs">
            <Database className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#1F3D2B]">
            Database Connection Required
          </h1>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            Ceylon Crunch operates with Supabase PostgreSQL as the live single source of truth across all devices. Silent fallbacks to mock data are disabled to prevent out-of-sync product inventory.
          </p>
          <div className="bg-[#FAF8F4] border border-[#EADFD0] rounded-xl p-3.5 text-left font-mono text-[11px] text-[#424843] space-y-1.5">
            <div className="text-[10px] text-[#8B5E3C] font-sans font-bold uppercase tracking-wider mb-1">
              Required in .env:
            </div>
            <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
            <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOi...</div>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8B5E3C]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Add your credentials and restart Vite development server</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[#FBF7F0] text-[#2B2B2B] antialiased overflow-x-clip">
          {/* Header */}
          <Header />

          {/* Main Content Area */}
          <main className="flex-1 w-full max-w-[1320px] mx-auto pt-20 sm:pt-24 lg:pt-28 px-4 sm:px-6 lg:px-8 pb-16 lg:pb-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order/:orderNumber/confirmed" element={<OrderConfirmed />} />
              <Route path="/track" element={<TrackOrder />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/about" element={<OurStory />} />
              <Route path="/sourcing" element={<Sourcing />} />
              <Route path="/quality-promise" element={<QualityPromise />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/delivery" element={<Shipping />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gifting" element={<Gifting />} />
              <Route path="/corporate" element={<Corporate />} />
              <Route path="/bulk-orders" element={<Corporate />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsConditions />} />
              <Route path="/refund-policy" element={<ReturnsRefunds />} />
              <Route path="/returns" element={<ReturnsRefunds />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/account" element={<Profile />} />
              <Route path="/login" element={<Profile defaultMode="signin" />} />
              <Route path="/signin" element={<Profile defaultMode="signin" />} />
              <Route path="/register" element={<Profile defaultMode="signup" />} />
              <Route path="/signup" element={<Profile defaultMode="signup" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Floating WhatsApp Action Button (Hidden on /checkout) */}
          <WhatsAppButton />

          {/* Mobile Bottom Tab Bar (< 1024px) */}
          <MobileTabBar />

          {/* Global Aria-Live Toast */}
          <Toast />
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}
