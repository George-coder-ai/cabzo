import React, { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import {
  BellRing,
  Clock,
  Check,
  X,
} from 'lucide-react';

export const IncomingRequestModal = () => {
  const { incomingRequest, acceptIncomingRequest, declineIncomingRequest } = useBooking();
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (!incomingRequest) {
      setTimeLeft(15);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          declineIncomingRequest();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [incomingRequest, declineIncomingRequest]);

  if (!incomingRequest) return null;

  const progressPercent = (timeLeft / 15) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#111827] border-2 border-brand-cyan/40 rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Countdown Timer Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#1E293B]">
          <div
            className="h-full bg-gradient-to-r from-brand-cyan to-brand-orange transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan animate-bounce">
              <BellRing size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">New Ride Request</h3>
              <p className="text-[10px] text-brand-cyan font-mono font-semibold uppercase">
                {incomingRequest.vehicleTier}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#1E293B] px-2.5 py-1 rounded-lg border border-white/10 text-xs font-mono font-bold text-brand-orange">
            <Clock size={12} />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Fare Highlight Card */}
        <div className="bg-[#1E293B] p-3.5 rounded-xl border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-muted block">
              Estimated Earning
            </span>
            <span className="text-2xl font-extrabold font-display text-white tracking-tight">
              ₹{incomingRequest.fare}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-muted block">
              Trip Distance
            </span>
            <span className="text-xs font-bold text-white">
              {incomingRequest.distanceKm} km
            </span>
          </div>
        </div>

        {/* Pickup & Dropoff Route Details */}
        <div className="space-y-2 bg-[#0B0F17] p-3 rounded-xl border border-white/[0.06] text-xs">
          <div className="flex items-start gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan mt-1 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-brand-muted block">
                Pickup (1.2 km away)
              </span>
              <p className="text-white font-medium truncate">
                {incomingRequest.pickup.name}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {incomingRequest.pickup.address}
              </p>
            </div>
          </div>

          <div className="ml-1 w-0.5 h-3 bg-white/20" />

          <div className="flex items-start gap-2.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-brand-orange mt-1 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-brand-muted block">
                Drop-off Destination
              </span>
              <p className="text-white font-medium truncate">
                {incomingRequest.dropoff.name}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {incomingRequest.dropoff.address}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={declineIncomingRequest}
            className="py-3 px-4 rounded-xl bg-[#1E293B] hover:bg-[#27354A] text-brand-muted hover:text-white font-semibold text-xs border border-white/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <X size={15} />
            <span>Decline</span>
          </button>

          <button
            type="button"
            onClick={acceptIncomingRequest}
            className="py-3 px-4 rounded-xl bg-brand-cyan hover:bg-brand-cyan-hover text-[#0B0F17] font-bold text-xs shadow-glow-cyan transition-all flex items-center justify-center gap-1.5"
          >
            <Check size={16} strokeWidth={3} />
            <span>Accept Ride</span>
          </button>
        </div>
      </div>
    </div>
  );
};
