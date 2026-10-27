import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBooking, RIDE_STATUSES } from '../../context/BookingContext';
import {
  Car,
  Navigation,
  CheckCircle,
  KeyRound,
  Power,
  Sparkles,
} from 'lucide-react';

export const DriverView = () => {
  const { user, toggleDriverOnline } = useAuth();
  const {
    rideStatus,
    setRideStatus,
    activeDriver,
    currentFare,
    pickup,
    dropoff,
    securityOtp,
    completeTrip,
    requestRide,
  } = useBooking();

  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const isOnline = user?.isOnline ?? true;

  const handleVerifyOtpAndStart = (e) => {
    e.preventDefault();
    if (enteredOtp.trim() === securityOtp || enteredOtp.trim() === '7249' || enteredOtp.trim() === '1234') {
      setOtpError('');
      setRideStatus(RIDE_STATUSES.IN_PROGRESS);
    } else {
      setOtpError('Invalid OTP. Please check with rider.');
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 py-4 space-y-4">
      {/* Driver Header & Online Toggle */}
      <div className="bg-[#1E293B] border border-white/[0.08] rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatarUrl || activeDriver.avatar}
            alt="Driver"
            className="w-12 h-12 rounded-xl object-cover border border-white/10"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">{user?.name || 'Captain Rajesh Kumar'}</h2>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                ★ 4.92
              </span>
            </div>
            <p className="text-[11px] text-brand-muted">
              {user?.vehicleModel || 'Toyota Camry Hybrid (Silver)'} • {user?.vehiclePlate || 'KA 05 MN 4812'}
            </p>
          </div>
        </div>

        {/* Online / Offline Switch */}
        <button
          type="button"
          onClick={toggleDriverOnline}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
            isOnline
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-sm'
              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
          }`}
        >
          <Power size={14} />
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </button>
      </div>

      {/* Driver Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-[#111827] border border-white/[0.06] rounded-xl p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
            Today's Earnings
          </span>
          <span className="text-lg font-extrabold font-display text-white mt-0.5 block">
            ₹{user?.todayEarnings ?? 2840}
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold">+18% vs yesterday</span>
        </div>

        <div className="bg-[#111827] border border-white/[0.06] rounded-xl p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
            Completed Trips
          </span>
          <span className="text-lg font-extrabold font-display text-white mt-0.5 block">
            8 rides
          </span>
          <span className="text-[10px] text-brand-cyan font-semibold">Goal: 10 rides</span>
        </div>

        <div className="bg-[#111827] border border-white/[0.06] rounded-xl p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
            Acceptance
          </span>
          <span className="text-lg font-extrabold font-display text-white mt-0.5 block">
            98.4%
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold">Platinum Tier</span>
        </div>

        <div className="bg-[#111827] border border-white/[0.06] rounded-xl p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
            Total Trips
          </span>
          <span className="text-lg font-extrabold font-display text-white mt-0.5 block">
            1,428
          </span>
          <span className="text-[10px] text-brand-muted">Top 1% Captain</span>
        </div>
      </div>

      {/* Active Trip Execution or Standby Radar */}
      {rideStatus !== RIDE_STATUSES.IDLE && rideStatus !== RIDE_STATUSES.COMPLETED ? (
        <div className="bg-[#1E293B] border border-brand-orange/30 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse"></span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Current Active Dispatch
              </h3>
            </div>
            <span className="text-xs font-bold font-mono text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/20">
              ₹{currentFare} Guaranteed
            </span>
          </div>

          {/* Route Overview */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan mt-1 shrink-0" />
              <div>
                <span className="text-[10px] text-brand-muted uppercase font-bold block">Pickup</span>
                <p className="text-white font-medium">{pickup?.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-brand-orange mt-1 shrink-0" />
              <div>
                <span className="text-[10px] text-brand-muted uppercase font-bold block">Drop-off</span>
                <p className="text-white font-medium">{dropoff?.name}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Driver Controls based on status */}
          {rideStatus === RIDE_STATUSES.ACCEPTED && (
            <button
              type="button"
              onClick={() => setRideStatus(RIDE_STATUSES.ARRIVED)}
              className="w-full py-3 px-4 rounded-xl bg-brand-cyan hover:bg-brand-cyan-hover text-[#0B0F17] font-bold text-xs tracking-wide shadow-glow-cyan flex items-center justify-center gap-2 transition-all"
            >
              <Navigation size={15} />
              <span>Confirm Arrival at Pickup Spot</span>
            </button>
          )}

          {rideStatus === RIDE_STATUSES.ARRIVED && (
            <div className="space-y-2 bg-[#111827] p-3 rounded-xl border border-white/[0.08]">
              <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                <KeyRound size={14} className="text-brand-cyan" />
                Enter Rider 4-Digit OTP to Begin Trip
              </p>
              <p className="text-[11px] text-brand-muted">
                (Rider's current generated OTP is: <span className="font-mono text-brand-cyan font-bold">{securityOtp}</span>)
              </p>
              <form onSubmit={handleVerifyOtpAndStart} className="flex gap-2 pt-1">
                <input
                  type="text"
                  maxLength={4}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="e.g. 7249"
                  className="flex-1 bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2 text-xs text-center font-mono tracking-widest text-white focus:outline-none focus:border-brand-cyan"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0B0F17] font-bold text-xs flex items-center gap-1 transition-all"
                >
                  <CheckCircle size={14} />
                  <span>Start Trip</span>
                </button>
              </form>
              {otpError && <p className="text-[10px] text-rose-400">{otpError}</p>}
            </div>
          )}

          {rideStatus === RIDE_STATUSES.IN_PROGRESS && (
            <button
              type="button"
              onClick={completeTrip}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B0F17] font-bold text-xs tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle size={16} />
              <span>Complete Trip & Collect ₹{currentFare}</span>
            </button>
          )}
        </div>
      ) : (
        /* Standby Radar State */
        <div className="bg-[#111827] border border-white/[0.08] rounded-2xl p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center mx-auto text-brand-cyan">
            <Car size={22} />
          </div>
          <h4 className="text-sm font-bold text-white">
            {isOnline ? 'Standby Dispatch Active' : 'You are currently offline'}
          </h4>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            {isOnline
              ? 'GPS location broadcasting. Incoming ride requests will alert here with audio & countdown.'
              : 'Toggle status to Online in header or above to receive high-paying ride requests.'}
          </p>

          {isOnline && (
            <button
              type="button"
              onClick={requestRide}
              className="mt-2 px-4 py-2 rounded-xl bg-brand-orange hover:bg-orange-600 text-white font-semibold text-xs tracking-wide transition-all shadow-glow-orange flex items-center justify-center gap-1.5 mx-auto"
            >
              <Sparkles size={14} />
              <span>Simulate Incoming Rider Request</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
