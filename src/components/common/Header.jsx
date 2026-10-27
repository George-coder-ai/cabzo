import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import {
  Car,
  Compass,
  History,
  Shield,
  LogOut,
  LogIn,
  ChevronDown,
} from 'lucide-react';

export const Header = () => {
  const { user, logout, switchRole, toggleDriverOnline, setIsAuthModalOpen, isFirebaseConfigured } = useAuth();
  const { activeTab, setActiveTab } = useBooking();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F17]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 lg:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('book')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-cyan to-[#0070BA] p-0.5 shadow-glow-cyan flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                <Car className="text-brand-cyan w-4 h-4 transition-transform group-hover:rotate-[-6deg]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg tracking-wider text-white">
                  CABZO
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20">
                  RIDE
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-1 ml-6 bg-[#1E293B]/60 p-1 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setActiveTab('book')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'book'
                  ? 'bg-brand-cyan text-[#0B0F17] font-semibold shadow-sm'
                  : 'text-brand-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass size={14} />
              Book Ride
            </button>

            <button
              onClick={() => {
                setActiveTab('driver');
                if (user?.role !== 'driver') switchRole('driver');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'driver'
                  ? 'bg-brand-cyan text-[#0B0F17] font-semibold shadow-sm'
                  : 'text-brand-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <Car size={14} />
              Driver Console
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-brand-cyan text-[#0B0F17] font-semibold shadow-sm'
                  : 'text-brand-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <History size={14} />
              Trip History
            </button>
          </nav>
        </div>

        {/* Right: Driver Status / Role Switcher / Auth Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Driver Online/Offline toggle if driver mode */}
          {user && user.role === 'driver' && (
            <button
              onClick={toggleDriverOnline}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                user.isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  user.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span className="hidden sm:inline">
                {user.isOnline ? 'Captain Online' : 'Captain Offline'}
              </span>
            </button>
          )}

          {/* Role Switcher Pill */}
          {user && (
            <div className="flex items-center bg-[#1E293B] p-0.5 rounded-lg border border-white/[0.08]">
              <button
                onClick={() => {
                  switchRole('rider');
                  setActiveTab('book');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  user.role === 'rider'
                    ? 'bg-brand-cyan text-[#0B0F17] shadow-sm'
                    : 'text-brand-muted hover:text-white'
                }`}
              >
                Rider
              </button>
              <button
                onClick={() => {
                  switchRole('driver');
                  setActiveTab('driver');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  user.role === 'driver'
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'text-brand-muted hover:text-white'
                }`}
              >
                Driver
              </button>
            </div>
          )}

          {/* Firebase Connection Status Badge */}
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-semibold transition-all ${
              isFirebaseConfigured
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
            title={
              isFirebaseConfigured
                ? 'Firebase Auth connected via .env'
                : 'Add your Firebase API keys in .env'
            }
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isFirebaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>{isFirebaseConfigured ? 'Firebase Live' : 'Firebase .env'}</span>
          </button>

          {/* User Profile Avatar / Sign In */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#1E293B]/80 hover:bg-[#1E293B] border border-white/[0.08] transition-all"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-white/10"
                />
                <span className="hidden sm:block text-xs font-medium text-white max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown size={14} className="text-brand-muted" />
              </button>

              {/* Profile Dropdown */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-[#111827] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <div className="p-2 border-b border-white/[0.06] mb-1">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-brand-muted truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-brand-cyan uppercase tracking-wider font-semibold">
                      <Shield size={10} />
                      Firebase Verified • {user.role}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('history')}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-brand-muted hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <History size={14} />
                    Trip History
                  </button>

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-cyan hover:bg-brand-cyan-hover text-[#0B0F17] font-semibold text-xs shadow-glow-cyan transition-all"
            >
              <LogIn size={14} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
