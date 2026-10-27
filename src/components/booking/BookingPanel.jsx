import React, { useState } from 'react';
import { useBooking, RIDE_STATUSES } from '../../context/BookingContext';
import { LocationInput } from './LocationInput';
import { VehicleSelection } from './VehicleSelection';
import { DynamicStatusTracker } from './DynamicStatusTracker';
import { TripCompletedReceipt } from './TripCompletedReceipt';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const BookingPanel = () => {
  const { rideStatus } = useBooking();
  const [isMobileDrawerExpanded, setIsMobileDrawerExpanded] = useState(true);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Mobile Drawer Handle (Visible only on mobile/small screens) */}
      <div className="md:hidden flex flex-col items-center pt-2 pb-1 bg-[#1E293B] rounded-t-2xl border-t border-white/10 cursor-pointer"
           onClick={() => setIsMobileDrawerExpanded(!isMobileDrawerExpanded)}>
        <div className="w-10 h-1 rounded-full bg-white/20 mb-1" />
        <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-muted">
          <span>{isMobileDrawerExpanded ? 'Swipe Down to View Map' : 'Swipe Up to View Controls'}</span>
          {isMobileDrawerExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 overflow-y-auto px-4 py-4 space-y-4 ${
        !isMobileDrawerExpanded ? 'hidden md:block' : 'block'
      }`}>
        {rideStatus === RIDE_STATUSES.IDLE && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
              <div>
                <h2 className="text-base font-bold font-display text-white">Where to?</h2>
                <p className="text-xs text-brand-muted">Select pickup & destination</p>
              </div>
              <span className="text-[10px] font-mono uppercase bg-[#111827] px-2.5 py-1 rounded-md text-brand-cyan border border-brand-cyan/20">
                LIVE GPS
              </span>
            </div>

            <LocationInput />
            <VehicleSelection />
          </div>
        )}

        {rideStatus !== RIDE_STATUSES.IDLE && rideStatus !== RIDE_STATUSES.COMPLETED && (
          <div className="animate-in fade-in duration-300">
            <DynamicStatusTracker />
          </div>
        )}

        {rideStatus === RIDE_STATUSES.COMPLETED && (
          <div className="animate-in fade-in duration-300">
            <TripCompletedReceipt />
          </div>
        )}
      </div>
    </div>
  );
};
