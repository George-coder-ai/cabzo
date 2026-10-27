import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { VEHICLE_TIERS, calculateFare } from '../../data/vehicles';
import { Car, Zap, Sparkles, ShieldCheck, Users, Clock, CreditCard, ChevronRight } from 'lucide-react';

const getVehicleIcon = (iconName) => {
  switch (iconName) {
    case 'Zap':
      return <Zap className="w-5 h-5 text-emerald-400" />;
    case 'Sparkles':
      return <Sparkles className="w-5 h-5 text-brand-cyan" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-5 h-5 text-brand-orange" />;
    case 'Car':
    default:
      return <Car className="w-5 h-5 text-brand-cyan" />;
  }
};

export const VehicleSelection = () => {
  const {
    selectedVehicleId,
    setSelectedVehicleId,
    distanceKm,
    paymentMethod,
    setPaymentMethod,
    requestRide,
  } = useBooking();

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted">
          Available Fleets ({VEHICLE_TIERS.length})
        </h3>
        <span className="text-[11px] text-brand-cyan font-medium">
          Instant Fare Lock
        </span>
      </div>

      {/* Vertical Vehicle Cards List */}
      <div className="space-y-2">
        {VEHICLE_TIERS.map((tier) => {
          const fare = calculateFare(tier.baseFare, tier.ratePerKm, distanceKm);
          const isSelected = selectedVehicleId === tier.id;

          return (
            <div
              key={tier.id}
              onClick={() => setSelectedVehicleId(tier.id)}
              className={`relative p-3 rounded-2xl border transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-gradient-to-r from-brand-cyan/[0.08] to-[#1E293B] border-brand-cyan shadow-glow-cyan/20'
                  : 'bg-[#1E293B]/70 hover:bg-[#1E293B] border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-brand-cyan/20 border border-brand-cyan/40'
                        : 'bg-[#111827] border border-white/[0.06] group-hover:border-white/10'
                    }`}
                  >
                    {getVehicleIcon(tier.icon)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white tracking-wide truncate">
                        {tier.name}
                      </p>
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-white/5 text-gray-300 border border-white/10">
                        {tier.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-brand-muted truncate">
                      {tier.model}
                    </p>

                    <div className="flex items-center gap-3 mt-1 text-[10px] text-brand-subtle">
                      <span className="flex items-center gap-1">
                        <Users size={11} className="text-gray-400" />
                        {tier.capacity} seats
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-gray-400" />
                        {tier.etaMinutes} min away
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Fare in INR */}
                <div className="text-right shrink-0 pl-2">
                  <div className="text-base font-extrabold font-display text-white tracking-tight">
                    ₹{fare.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] text-brand-muted">
                    Base ₹{tier.baseFare} + ₹{tier.ratePerKm}/km
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Method Selector */}
      <div className="pt-1 flex items-center justify-between bg-[#111827] p-2.5 rounded-xl border border-white/[0.06]">
        <div className="flex items-center gap-2">
          <CreditCard size={15} className="text-brand-cyan" />
          <span className="text-xs text-white font-medium">Payment Mode</span>
        </div>
        <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded-lg border border-white/[0.08]">
          {['UPI', 'Card', 'Cash'].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                paymentMethod === method
                  ? 'bg-brand-cyan text-[#0B0F17]'
                  : 'text-brand-muted hover:text-white'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Confirm Ride Button */}
      <button
        type="button"
        onClick={requestRide}
        className="w-full py-3.5 px-4 rounded-xl bg-brand-cyan hover:bg-brand-cyan-hover active:scale-[0.99] text-[#0B0F17] font-bold text-sm tracking-wide shadow-glow-cyan flex items-center justify-center gap-2 transition-all"
      >
        <span>Confirm & Request Ride</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
