import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import {
  CheckCircle2,
  Star,
  ArrowRight,
} from 'lucide-react';

export const TripCompletedReceipt = () => {
  const {
    currentFare,
    distanceKm,
    estimatedDurationMinutes,
    selectedVehicle,
    activeDriver,
    resetToNewBooking,
    paymentMethod,
  } = useBooking();

  const [rating, setRating] = useState(5);
  const [rated, setRated] = useState(false);

  return (
    <div className="bg-[#111827] border border-white/[0.08] rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
      {/* Header with Celebration Badge */}
      <div className="text-center space-y-1.5 pb-2 border-b border-white/[0.06]">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="text-lg font-bold font-display text-white">Ride Completed</h3>
        <p className="text-xs text-brand-muted">Hope you enjoyed your journey with Cabzo</p>
      </div>

      {/* Fare Display */}
      <div className="bg-[#1E293B] p-4 rounded-xl border border-white/[0.06] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-muted block">
            Total Paid ({paymentMethod})
          </span>
          <span className="text-2xl font-extrabold font-display text-white tracking-tight">
            ₹{currentFare}
          </span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Paid Successfully
        </span>
      </div>

      {/* Trip Details List */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-brand-muted">
          <span>Distance Covered:</span>
          <span className="text-white font-medium">{distanceKm} km</span>
        </div>
        <div className="flex items-center justify-between text-brand-muted">
          <span>Trip Duration:</span>
          <span className="text-white font-medium">~{estimatedDurationMinutes} mins</span>
        </div>
        <div className="flex items-center justify-between text-brand-muted">
          <span>Vehicle Tier:</span>
          <span className="text-white font-medium">{selectedVehicle.name}</span>
        </div>
        <div className="flex items-center justify-between text-brand-muted">
          <span>Captain:</span>
          <span className="text-white font-medium">{activeDriver.name}</span>
        </div>
      </div>

      {/* Star Rating Section */}
      <div className="bg-[#1E293B]/70 p-3.5 rounded-xl border border-white/[0.06] text-center space-y-2">
        <p className="text-xs font-semibold text-white">Rate your trip with Captain {activeDriver.name}</p>
        <div className="flex justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => {
                setRating(star);
                setRated(true);
              }}
              className="p-1 transition-transform hover:scale-125 focus:outline-none"
            >
              <Star
                size={22}
                className={
                  star <= rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-600 hover:text-amber-300'
                }
              />
            </button>
          ))}
        </div>
        {rated && (
          <p className="text-[11px] text-emerald-400 font-medium animate-in fade-in">
            Thank you for your {rating}-star rating!
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={resetToNewBooking}
          className="w-full py-3 px-4 rounded-xl bg-brand-cyan hover:bg-brand-cyan-hover text-[#0B0F17] font-bold text-xs tracking-wide shadow-glow-cyan flex items-center justify-center gap-2 transition-all"
        >
          <span>Book Another Ride</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
