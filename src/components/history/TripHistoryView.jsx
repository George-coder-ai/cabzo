import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import {
  Car,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const TripHistoryView = () => {
  const { history, setActiveTab } = useBooking();
  const [filter, setFilter] = useState('all'); // 'all' | 'completed' | 'cancelled'

  const filteredHistory = history.filter((item) => {
    if (filter === 'completed') return item.status === 'completed';
    if (filter === 'cancelled') return item.status === 'cancelled';
    return true;
  });

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Recent';
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 py-4 space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold font-display text-white">Your Trip Activity</h2>
          <p className="text-xs text-brand-muted">
            Track past routes, digital tax invoices & trip breakdown
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#111827] p-1 rounded-xl border border-white/[0.06] self-start sm:self-auto">
          {['all', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-brand-cyan text-[#0B0F17]'
                  : 'text-brand-muted hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="bg-[#111827] border border-white/[0.08] rounded-2xl p-10 text-center space-y-3">
          <Car size={32} className="mx-auto text-brand-muted opacity-40" />
          <h3 className="text-sm font-semibold text-white">No trips found</h3>
          <p className="text-xs text-brand-muted max-w-xs mx-auto">
            You don't have any {filter !== 'all' ? filter : ''} rides recorded in your history.
          </p>
          <button
            onClick={() => setActiveTab('book')}
            className="px-4 py-2 rounded-xl bg-brand-cyan text-[#0B0F17] text-xs font-bold shadow-glow-cyan"
          >
            Book a Ride Now
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden lg:block bg-[#111827] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1E293B]/80 text-[10px] uppercase font-bold text-brand-muted border-b border-white/[0.08]">
                <tr>
                  <th className="py-3 px-4">Ride ID & Date</th>
                  <th className="py-3 px-4">Route (Pick-up → Drop-off)</th>
                  <th className="py-3 px-4">Vehicle & Captain</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Fare (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredHistory.map((trip) => (
                  <tr key={trip.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* ID & Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-semibold text-white block">
                        #{trip.id.replace('ride_', '')}
                      </span>
                      <span className="text-[11px] text-brand-muted">
                        {formatDate(trip.createdAt)}
                      </span>
                    </td>

                    {/* Route */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-2 h-2 rounded-full bg-brand-cyan shrink-0" />
                          <span className="text-white font-medium truncate">
                            {trip.pickup?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-2 h-2 rounded-sm bg-brand-orange shrink-0" />
                          <span className="text-gray-300 truncate">
                            {trip.dropoff?.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-brand-muted mt-1 block">
                        {trip.distanceKm} km {trip.durationMinutes ? `• ${trip.durationMinutes} mins` : ''}
                      </span>
                    </td>

                    {/* Vehicle & Driver */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white">{trip.vehicleTier}</p>
                      <p className="text-[11px] text-brand-muted">
                        {trip.driverName ? `Captain ${trip.driverName}` : 'No driver assigned'}
                      </p>
                      {trip.vehiclePlate && (
                        <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">
                          {trip.vehiclePlate}
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {trip.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 size={12} />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <XCircle size={12} />
                          Cancelled
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-display font-extrabold text-sm text-white block">
                        ₹{trip.fare}
                      </span>
                      <span className="text-[10px] text-brand-muted">
                        {trip.paymentMethod || 'UPI'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card List View (Visible on mobile/tablet) */}
          <div className="lg:hidden space-y-3">
            {filteredHistory.map((trip) => (
              <div
                key={trip.id}
                className="bg-[#111827] border border-white/[0.08] rounded-2xl p-4 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">
                      #{trip.id.replace('ride_', '')}
                    </span>
                    <span className="text-[11px] text-brand-muted">
                      {formatDate(trip.createdAt)}
                    </span>
                  </div>

                  {trip.status === 'completed' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Completed
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      Cancelled
                    </span>
                  )}
                </div>

                {/* Route */}
                <div className="bg-[#1E293B]/60 p-3 rounded-xl border border-white/[0.04] space-y-1.5 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-cyan mt-1 shrink-0" />
                    <span className="text-white font-medium truncate">{trip.pickup?.name}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-sm bg-brand-orange mt-1 shrink-0" />
                    <span className="text-gray-300 truncate">{trip.dropoff?.name}</span>
                  </div>
                </div>

                {/* Footer Details */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.06]">
                  <div>
                    <span className="text-white font-semibold block">{trip.vehicleTier}</span>
                    <span className="text-[11px] text-brand-muted">
                      {trip.driverName ? `Captain ${trip.driverName}` : 'Standard Fleet'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold font-display text-white">
                      ₹{trip.fare}
                    </span>
                    <span className="text-[10px] text-brand-muted block">
                      {trip.paymentMethod || 'UPI'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
