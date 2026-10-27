import React, { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { PRESET_LOCATIONS } from '../../data/locations';
import { searchAddress, reverseGeocode } from '../../services/routingService';
import { ArrowUpDown, ChevronDown, Check, Search, Crosshair, Loader2 } from 'lucide-react';

export const LocationInput = () => {
  const { pickup, setPickup, dropoff, setDropoff, swapLocations } = useBooking();
  const [activeDropdown, setActiveDropdown] = useState(null); // 'pickup' | 'dropoff' | null
  
  // Live Geocoding Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchAddress(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectLocation = (loc, type) => {
    if (type === 'pickup') {
      setPickup(loc);
    } else {
      setDropoff(loc);
    }
    setActiveDropdown(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Live Browser GPS
  const handleUseLiveGPS = (type) => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const resolved = await reverseGeocode(latitude, longitude);
        const newLoc = {
          id: `gps_${Date.now()}`,
          name: resolved?.name || 'Current Location',
          address: resolved?.address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          lat: latitude,
          lng: longitude,
          type: 'current-gps',
        };
        if (type === 'pickup') {
          setPickup(newLoc);
        } else {
          setDropoff(newLoc);
        }
        setIsLocating(false);
        setActiveDropdown(null);
      },
      (err) => {
        setIsLocating(false);
        alert('Could not retrieve GPS position. Please check browser permissions.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-3">
      {/* Location Input Container */}
      <div className="relative bg-[#111827] border border-white/[0.08] rounded-2xl p-3 shadow-inner">
        {/* Vertical Connecting Line */}
        <div className="absolute left-[26px] top-[28px] bottom-[28px] w-0.5 bg-gradient-to-b from-brand-cyan via-white/20 to-brand-orange z-0 pointer-events-none" />

        {/* Pickup Field */}
        <div className="relative z-10 mb-2.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-muted pl-8 block mb-1">
            Pick-up Location
          </label>
          <div
            onClick={() => {
              setActiveDropdown(activeDropdown === 'pickup' ? null : 'pickup');
              setSearchQuery('');
            }}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1E293B]/80 hover:bg-[#1E293B] border border-white/[0.06] hover:border-brand-cyan/40 cursor-pointer transition-all"
          >
            <div className="w-4 h-4 rounded-full bg-brand-cyan/20 border-2 border-brand-cyan flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{pickup?.name || 'Select pickup'}</p>
              <p className="text-[11px] text-brand-muted truncate">{pickup?.address || 'Choose point'}</p>
            </div>
            <ChevronDown size={14} className="text-brand-muted shrink-0" />
          </div>

          {/* Pickup Search & Dropdown Options */}
          {activeDropdown === 'pickup' && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#111827] border border-white/10 rounded-xl shadow-2xl p-2 z-30 max-h-72 overflow-y-auto space-y-2">
              {/* Search input for any geographical location */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type any address, airport, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-brand-cyan" />
                )}
              </div>

              {/* Use Current GPS Location option */}
              <button
                type="button"
                onClick={() => handleUseLiveGPS('pickup')}
                disabled={isLocating}
                className="w-full flex items-center gap-2 p-2 rounded-lg bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan text-xs font-semibold transition-colors"
              >
                <Crosshair size={14} className={isLocating ? 'animate-spin' : ''} />
                <span>{isLocating ? 'Acquiring GPS position...' : 'Use Current Device Location'}</span>
              </button>

              {/* Live Search Results */}
              {searchResults.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-bold text-brand-cyan px-1 py-1">Search Results</p>
                  {searchResults.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectLocation(loc, 'pickup');
                      }}
                      className="flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer hover:bg-white/5 text-gray-200 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-white truncate">{loc.name}</p>
                        <p className="text-[10px] text-brand-muted truncate">{loc.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Preset Locations */}
              <div>
                <p className="text-[10px] uppercase font-bold text-brand-muted px-1 py-1">Popular Hotspots</p>
                {PRESET_LOCATIONS.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLocation(loc, 'pickup');
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      pickup?.id === loc.id
                        ? 'bg-brand-cyan/15 text-brand-cyan'
                        : 'hover:bg-white/5 text-gray-200'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold truncate">{loc.name}</p>
                      <p className="text-[10px] text-brand-muted truncate">{loc.address}</p>
                    </div>
                    {pickup?.id === loc.id && <Check size={14} className="text-brand-cyan shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Swap Button Floating Right */}
        <div className="relative flex justify-end pr-2 -my-2.5 z-20">
          <button
            type="button"
            onClick={swapLocations}
            title="Swap locations"
            className="w-7 h-7 rounded-full bg-[#1E293B] hover:bg-brand-cyan hover:text-[#0B0F17] text-brand-muted border border-white/10 flex items-center justify-center transition-all shadow-md group"
          >
            <ArrowUpDown size={12} className="group-hover:rotate-180 transition-transform duration-300" />
          </button>
        </div>

        {/* Dropoff Field */}
        <div className="relative z-10">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-muted pl-8 block mb-1">
            Drop-off Destination
          </label>
          <div
            onClick={() => {
              setActiveDropdown(activeDropdown === 'dropoff' ? null : 'dropoff');
              setSearchQuery('');
            }}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1E293B]/80 hover:bg-[#1E293B] border border-white/[0.06] hover:border-brand-orange/40 cursor-pointer transition-all"
          >
            <div className="w-4 h-4 rounded-sm bg-brand-orange/20 border-2 border-brand-orange flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-[1px] bg-brand-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{dropoff?.name || 'Select destination'}</p>
              <p className="text-[11px] text-brand-muted truncate">{dropoff?.address || 'Choose drop location'}</p>
            </div>
            <ChevronDown size={14} className="text-brand-muted shrink-0" />
          </div>

          {/* Dropoff Search & Dropdown Options */}
          {activeDropdown === 'dropoff' && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#111827] border border-white/10 rounded-xl shadow-2xl p-2 z-30 max-h-72 overflow-y-auto space-y-2">
              {/* Search input for any geographical location */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search destination, station, landmark..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-brand-orange" />
                )}
              </div>

              {/* Live Search Results */}
              {searchResults.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-bold text-brand-orange px-1 py-1">Search Results</p>
                  {searchResults.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectLocation(loc, 'dropoff');
                      }}
                      className="flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer hover:bg-white/5 text-gray-200 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-white truncate">{loc.name}</p>
                        <p className="text-[10px] text-brand-muted truncate">{loc.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Preset Locations */}
              <div>
                <p className="text-[10px] uppercase font-bold text-brand-muted px-1 py-1">Popular Destinations</p>
                {PRESET_LOCATIONS.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLocation(loc, 'dropoff');
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      dropoff?.id === loc.id
                        ? 'bg-brand-orange/15 text-brand-orange'
                        : 'hover:bg-white/5 text-gray-200'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold truncate">{loc.name}</p>
                      <p className="text-[10px] text-brand-muted truncate">{loc.address}</p>
                    </div>
                    {dropoff?.id === loc.id && <Check size={14} className="text-brand-orange shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Select Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-muted shrink-0 mr-1">
          Quick:
        </span>
        {PRESET_LOCATIONS.slice(0, 4).map((loc) => (
          <button
            key={loc.id}
            type="button"
            onClick={() => setDropoff(loc)}
            className={`px-2.5 py-1 rounded-lg text-[11px] shrink-0 border transition-all ${
              dropoff?.id === loc.id
                ? 'bg-brand-orange/15 text-brand-orange border-brand-orange/40 font-semibold'
                : 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-brand-muted hover:text-white border-white/[0.06]'
            }`}
          >
            {loc.name.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
};
