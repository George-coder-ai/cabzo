import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Header } from './components/common/Header';
import { AuthModal } from './components/auth/AuthModal';
import { IncomingRequestModal } from './components/driver/IncomingRequestModal';
import { InteractiveMap } from './components/map/InteractiveMap';
import { BookingPanel } from './components/booking/BookingPanel';
import { DriverView } from './components/driver/DriverView';
import { TripHistoryView } from './components/history/TripHistoryView';
import { Compass, Car, History } from 'lucide-react';

const MainLayout = () => {
  const { activeTab, setActiveTab } = useBooking();
  const { user, switchRole } = useAuth();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0B0F17] text-[#F8FAFC]">
      {/* Top Header */}
      <Header />

      {/* Main Split-Screen Content Area */}
      <main className="flex-1 flex flex-col md:flex-row w-full h-[calc(100vh-61px)] overflow-hidden relative">
        {/* Left Side: Interactive Map Container (60-65% on Desktop, Background on Mobile) */}
        <div className={`relative w-full ${
          activeTab === 'history' ? 'hidden md:block md:w-[45%] lg:w-[50%]' : 'h-[40vh] md:h-full md:w-[60%] lg:w-[65%]'
        } flex-shrink-0 transition-all duration-300`}>
          <InteractiveMap />
        </div>

        {/* Right Side: Side Control Panel (35-40% on Desktop, Bottom Sheet on Mobile) */}
        <div className={`relative w-full ${
          activeTab === 'history'
            ? 'flex-1 md:w-[55%] lg:w-[50%]'
            : 'flex-1 md:w-[40%] lg:w-[35%]'
        } bg-[#0B0F17] md:border-l border-white/[0.08] flex flex-col overflow-hidden shadow-2xl z-20`}>
          {activeTab === 'book' && <BookingPanel />}
          {activeTab === 'driver' && <DriverView />}
          {activeTab === 'history' && <TripHistoryView />}
        </div>
      </main>

      {/* Mobile Floating Bottom Navigation Bar (Visible only on mobile 320px - 768px) */}
      <nav className="md:hidden z-40 bg-[#111827]/95 backdrop-blur-lg border-t border-white/[0.08] px-4 py-2 flex items-center justify-around">
        <button
          type="button"
          onClick={() => setActiveTab('book')}
          className={`flex flex-col items-center gap-1 min-h-[44px] justify-center px-4 rounded-xl transition-all ${
            activeTab === 'book'
              ? 'text-brand-cyan font-bold scale-105'
              : 'text-brand-muted hover:text-white'
          }`}
        >
          <Compass size={18} />
          <span className="text-[10px]">Book</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('driver');
            if (user?.role !== 'driver') switchRole('driver');
          }}
          className={`flex flex-col items-center gap-1 min-h-[44px] justify-center px-4 rounded-xl transition-all ${
            activeTab === 'driver'
              ? 'text-brand-orange font-bold scale-105'
              : 'text-brand-muted hover:text-white'
          }`}
        >
          <Car size={18} />
          <span className="text-[10px]">Captain</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 min-h-[44px] justify-center px-4 rounded-xl transition-all ${
            activeTab === 'history'
              ? 'text-brand-cyan font-bold scale-105'
              : 'text-brand-muted hover:text-white'
          }`}
        >
          <History size={18} />
          <span className="text-[10px]">History</span>
        </button>
      </nav>

      {/* Global Modals */}
      <AuthModal />
      <IncomingRequestModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <MainLayout />
      </BookingProvider>
    </AuthProvider>
  );
}
