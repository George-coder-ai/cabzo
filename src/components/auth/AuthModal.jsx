import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Mail, Lock, User, Phone, ArrowRight, Loader2 } from 'lucide-react';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    signup,
    loginWithGoogle,
    authError,
    isLoading,
    demoRider,
    demoDriver,
    isFirebaseConfigured,
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [role, setRole] = useState('rider'); // 'rider' | 'driver'

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(email, password);
    } else {
      await signup({ name, email, password, role, phone });
    }
  };

  const fillDemoCredentials = (target) => {
    if (target === 'rider') {
      setEmail(demoRider.email);
      setPassword('password123');
      setMode('login');
    } else {
      setEmail(demoDriver.email);
      setPassword('password123');
      setMode('login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#111827] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-brand-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                Cabzo Auth
              </span>
            </div>

            {/* Firebase Live or .env Ready indicator */}
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isFirebaseConfigured
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}
            >
              {isFirebaseConfigured ? '● Firebase Live' : '○ .env Ready'}
            </span>
          </div>

          <h2 className="text-2xl font-bold font-display text-white">
            {mode === 'login' ? 'Welcome to Cabzo' : 'Join Cabzo Network'}
          </h2>
          <p className="text-xs text-brand-muted mt-1">
            {mode === 'login'
              ? 'Authenticate to book luxury rides or manage captain dispatch.'
              : 'Create an account to experience seamless on-demand mobility.'}
          </p>

          {!isFirebaseConfigured && (
            <div className="mt-3 p-2.5 rounded-xl bg-[#1E293B]/70 border border-white/[0.06] text-[11px] text-gray-300">
              <span className="text-brand-cyan font-semibold">Tip: </span>
              Paste your Firebase Web App credentials into <code className="text-white bg-black/40 px-1 py-0.5 rounded font-mono">.env</code> to connect live authentication. Instant demo mode is active.
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#1E293B] p-1 rounded-xl border border-white/[0.06] mb-5">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-brand-cyan text-[#0B0F17] shadow-sm'
                : 'text-brand-muted hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-brand-cyan text-[#0B0F17] shadow-sm'
                : 'text-brand-muted hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Notification */}
        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            {authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              {/* Role Picker */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold mb-1.5">
                  Register As
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('rider')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      role === 'rider'
                        ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan'
                        : 'bg-[#1E293B]/60 border-white/[0.06] text-brand-muted hover:text-white'
                    }`}
                  >
                    Passenger / Rider
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('driver')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      role === 'driver'
                        ? 'bg-brand-orange/10 border-brand-orange text-brand-orange'
                        : 'bg-[#1E293B]/60 border-white/[0.06] text-brand-muted hover:text-white'
                    }`}
                  >
                    Captain / Driver
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full bg-[#1E293B] border border-white/[0.08] focus:border-brand-cyan rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#1E293B] border border-white/[0.08] focus:border-brand-cyan rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#1E293B] border border-white/[0.08] focus:border-brand-cyan rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1E293B] border border-white/[0.08] focus:border-brand-cyan rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-brand-cyan hover:bg-brand-cyan-hover active:scale-[0.99] text-[#0B0F17] font-semibold text-xs tracking-wide shadow-glow-cyan flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In Securely' : 'Complete Registration'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-brand-muted">
            <span className="bg-[#111827] px-3">or continue with</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={loginWithGoogle}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-[#1E293B] hover:bg-[#27354A] border border-white/[0.08] text-white font-medium text-xs flex items-center justify-center gap-2.5 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google OAuth 2.0
        </button>

        {/* Quick Demo Credentials */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
          <span className="text-brand-muted">Instant Demo Fill:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('rider')}
              className="text-brand-cyan hover:underline font-semibold"
            >
              Demo Rider
            </button>
            <span className="text-white/20">•</span>
            <button
              type="button"
              onClick={() => fillDemoCredentials('driver')}
              className="text-brand-orange hover:underline font-semibold"
            >
              Demo Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
