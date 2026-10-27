import React from 'react';
import { useBooking, RIDE_STATUSES } from '../../context/BookingContext';
import {
  Phone,
  Star,
  KeyRound,
  Play,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';

const STATUS_STEPS = [
  { key: RIDE_STATUSES.SEARCHING, label: 'Searching' },
  { key: RIDE_STATUSES.ACCEPTED, label: 'Accepted' },
  { key: RIDE_STATUSES.ARRIVED, label: 'Arrived' },
  { key: RIDE_STATUSES.IN_PROGRESS, label: 'In Progress' },
  { key: RIDE_STATUSES.COMPLETED, label: 'Completed' },
];

export const DynamicStatusTracker = () => {
  const {
    rideStatus,
    activeDriver,
    securityOtp,
    cancelRide,
    simulateNextStage,
    autoAdvance,
    setAutoAdvance,
    currentFare,
    selectedVehicle,
  } = useBooking();

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === rideStatus);

  const getStatusHeadline = () => {
    switch (rideStatus) {
      case RIDE_STATUSES.SEARCHING:
        return 'Connecting to Nearby Captains...';
      case RIDE_STATUSES.ACCEPTED:
        return `${activeDriver.name} is on the way`;
      case RIDE_STATUSES.ARRIVED:
        return 'Captain has arrived at your pick-up spot';
      case RIDE_STATUSES.IN_PROGRESS:
        return 'Trip in progress to destination';
      case RIDE_STATUSES.COMPLETED:
        return 'Trip completed successfully';
      default:
        return 'Ride Status';
    }
  };

  return (
    <div className="space-y-4">
      {/* Step-by-Step Progress Timeline */}
      <div className="bg-[#111827] border border-white/[0.08] rounded-2xl p-4 shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {rideStatus === RIDE_STATUSES.SEARCHING ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-cyan"></span>
              </span>
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            )}
            <h4 className="text-xs font-bold text-white tracking-wide">
              {getStatusHeadline()}
            </h4>
          </div>
          <span className="text-[10px] uppercase font-bold text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
            Step {Math.max(1, currentStepIndex + 1)} of 5
          </span>
        </div>

        {/* Timeline Bar */}
        <div className="relative flex items-center justify-between pt-2 pb-1">
          {/* Background Line */}
          <div className="absolute top-[18px] left-3 right-3 h-0.5 bg-white/10 z-0" />
          {/* Active Highlight Line */}
          <div
            className="absolute top-[18px] left-3 h-0.5 bg-gradient-to-r from-brand-cyan to-brand-orange z-0 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentStepIndex) / (STATUS_STEPS.length - 1)) * 92}%`,
            }}
          />

          {STATUS_STEPS.map((step, idx) => {
            const isPassed = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                    isCurrent
                      ? 'bg-brand-cyan border-brand-cyan text-[#0B0F17] shadow-glow-cyan scale-110'
                      : isPassed
                      ? 'bg-emerald-500 border-emerald-500 text-[#0B0F17]'
                      : 'bg-[#1E293B] border-white/20 text-brand-muted'
                  }`}
                >
                  {isPassed ? <CheckCircle2 size={12} /> : idx + 1}
                </div>
                <span
                  className={`text-[9px] mt-1.5 font-semibold tracking-tight transition-colors ${
                    isCurrent
                      ? 'text-brand-cyan font-bold'
                      : isPassed
                      ? 'text-emerald-400'
                      : 'text-brand-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver Card & OTP (When Driver is assigned) */}
      {rideStatus !== RIDE_STATUSES.SEARCHING && (
        <div className="bg-[#1E293B] border border-white/[0.08] rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeDriver.avatar}
                alt={activeDriver.name}
                className="w-12 h-12 rounded-xl object-cover border border-white/10"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">{activeDriver.name}</h4>
                  <span className="flex items-center text-[10px] font-bold text-amber-400">
                    <Star size={10} className="fill-amber-400 mr-0.5" />
                    {activeDriver.rating}
                  </span>
                </div>
                <p className="text-[11px] text-brand-muted">{activeDriver.vehicleModel}</p>
              </div>
            </div>

            {/* License Plate Badge */}
            <div className="bg-[#0B0F17] border border-white/10 px-3 py-1.5 rounded-lg text-right">
              <span className="text-[9px] font-bold uppercase tracking-wider text-brand-muted block">
                PLATE NO.
              </span>
              <span className="text-xs font-mono font-bold text-white tracking-widest">
                {activeDriver.vehiclePlate}
              </span>
            </div>
          </div>

          {/* Security OTP Widget */}
          <div className="flex items-center justify-between bg-[#111827] px-3.5 py-2.5 rounded-xl border border-brand-cyan/20">
            <div className="flex items-center gap-2">
              <KeyRound size={15} className="text-brand-cyan" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-brand-muted">
                  Ride Start OTP
                </p>
                <p className="text-[10px] text-gray-400">Share with driver upon entry</p>
              </div>
            </div>
            <div className="font-mono text-base font-extrabold tracking-[0.25em] text-brand-cyan bg-brand-cyan/10 px-3 py-1 rounded-lg border border-brand-cyan/30">
              {securityOtp}
            </div>
          </div>

          {/* Quick Actions (Call & Cancel) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`tel:${activeDriver.phone}`}
              className="py-2.5 px-3 rounded-xl bg-[#27354A] hover:bg-[#324560] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-white/10"
            >
              <Phone size={13} className="text-brand-cyan" />
              <span>Call Captain</span>
            </a>

            <button
              type="button"
              onClick={cancelRide}
              className="py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-rose-500/20"
            >
              <AlertTriangle size={13} />
              <span>Cancel Ride</span>
            </button>
          </div>
        </div>
      )}

      {/* Searching State Radar Pulse Animation (When Looking for Driver) */}
      {rideStatus === RIDE_STATUSES.SEARCHING && (
        <div className="bg-[#1E293B]/70 border border-white/[0.08] rounded-2xl p-6 text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-brand-cyan/20 animate-ping"></div>
            <div className="relative w-12 h-12 rounded-full bg-brand-cyan/30 border border-brand-cyan flex items-center justify-center shadow-glow-cyan">
              <Radio className="w-6 h-6 text-brand-cyan animate-pulse" />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">Broadcasting Request</h4>
            <p className="text-xs text-brand-muted mt-1 max-w-xs mx-auto">
              Searching nearest captains for your {selectedVehicle.name} (₹{currentFare})
            </p>
          </div>

          <button
            type="button"
            onClick={cancelRide}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-brand-muted hover:text-white text-xs transition-colors"
          >
            Cancel Search
          </button>
        </div>
      )}

      {/* Interactive Simulation Controls (For Reviewer / Demo Experience) */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between">
        <div className="text-[11px]">
          <span className="font-bold text-brand-cyan">Reviewer Demo Mode:</span>
          <p className="text-brand-muted text-[10px]">Test transitions instantly</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto advance toggle */}
          <button
            type="button"
            onClick={() => setAutoAdvance(!autoAdvance)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
              autoAdvance
                ? 'bg-brand-orange/20 border-brand-orange text-brand-orange'
                : 'bg-white/5 border-white/10 text-brand-muted'
            }`}
          >
            {autoAdvance ? 'Auto Advancing' : 'Auto Play'}
          </button>

          {/* Next Step Button */}
          <button
            type="button"
            onClick={simulateNextStage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-cyan text-[#0B0F17] font-bold text-[11px] shadow-glow-cyan hover:bg-brand-cyan-hover transition-all"
          >
            <Play size={11} className="fill-[#0B0F17]" />
            <span>Next Step</span>
          </button>
        </div>
      </div>
    </div>
  );
};
