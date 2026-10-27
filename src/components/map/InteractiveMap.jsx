import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useBooking, RIDE_STATUSES } from '../../context/BookingContext';
import { getRoadRoute, reverseGeocode } from '../../services/routingService';
import { MapApiKeyModal } from './MapApiKeyModal';
import {
  Crosshair,
  ShieldCheck,
  Key,
  MapPin,
} from 'lucide-react';

// Custom SVG HTML DivIcons for crisp vector markers with zero 404 image issues
const createPickupIcon = () =>
  L.divIcon({
    className: 'custom-map-marker-pickup',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(0, 166, 255, 0.25); animation: ping-slow 2s infinite;"></div>
        <div style="width: 20px; height: 20px; border-radius: 50%; background: #00A6FF; border: 3px solid #0B0F17; box-shadow: 0 0 12px #00A6FF; display: flex; align-items: center; justify-content: center;">
          <div style="width: 6px; height: 6px; border-radius: 50%; background: #FFFFFF;"></div>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

const createDropoffIcon = () =>
  L.divIcon({
    className: 'custom-map-marker-dropoff',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(249, 115, 22, 0.25); animation: ping-slow 2s infinite;"></div>
        <div style="width: 20px; height: 20px; border-radius: 4px; background: #F97316; border: 3px solid #0B0F17; box-shadow: 0 0 12px #F97316; transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
          <div style="width: 5px; height: 5px; background: #FFFFFF; transform: rotate(-45deg);"></div>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

const createDriverIcon = (isOnline = true) =>
  L.divIcon({
    className: 'custom-map-marker-driver',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 42px; height: 42px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #1E293B; border: 2px solid ${isOnline ? '#00A6FF' : '#64748B'}; box-shadow: 0 0 14px rgba(0, 166, 255, 0.4); display: flex; align-items: center; justify-content: center; transition: all 0.5s ease;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F8FAFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
            <circle cx="7" cy="17" r="2"></circle>
            <path d="M9 17h6"></path>
            <circle cx="17" cy="17" r="2"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });

// Component to fit bounds whenever pickup or dropoff coordinates change
const AutoFitBounds = ({ pickup, dropoff }) => {
  const map = useMap();

  useEffect(() => {
    if (!pickup || !dropoff) return;
    try {
      const bounds = L.latLngBounds(
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng]
      );
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 15,
        animate: true,
      });
    } catch (e) {
      // safe fallback
    }
  }, [pickup, dropoff, map]);

  return null;
};

// Map click handler to set pickup/dropoff by clicking directly on the map
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const InteractiveMap = () => {
  const {
    pickup,
    setPickup,
    dropoff,
    setDropoff,
    distanceKm,
    estimatedDurationMinutes,
    driverMarkerPos,
    rideStatus,
    activeDriver,
  } = useBooking();

  const [routePolyline, setRoutePolyline] = useState([]);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [clickMode, setClickMode] = useState(null); // 'pickup' | 'dropoff' | null
  const [isLocatingUser, setIsLocatingUser] = useState(false);

  // Check for custom map credentials in .env
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const cartoKey = import.meta.env.VITE_CARTO_API_KEY;

  // Determine tile URL and CSS class
  let tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  let tileClass = 'dark-osm-tiles';
  let attribution = '© OpenStreetMap contributors';

  if (mapboxToken && !mapboxToken.includes('your_mapbox')) {
    tileUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`;
    tileClass = '';
    attribution = '© Mapbox © OpenStreetMap';
  } else if (cartoKey && !cartoKey.includes('your_carto')) {
    tileUrl = `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${cartoKey}`;
    tileClass = '';
    attribution = '© CARTO © OpenStreetMap';
  }

  // Fetch actual road geometry from OSRM whenever pickup or dropoff changes
  useEffect(() => {
    let isMounted = true;
    async function loadRoadRoute() {
      if (!pickup || !dropoff) return;
      const result = await getRoadRoute(pickup, dropoff);
      if (isMounted && result && result.points) {
        setRoutePolyline(result.points);
      }
    }
    loadRoadRoute();
    return () => {
      isMounted = false;
    };
  }, [pickup, dropoff]);

  // Handle click on map to set pickup or dropoff
  const handleMapClick = async (lat, lng) => {
    if (!clickMode) return;
    const resolved = await reverseGeocode(lat, lng);
    if (clickMode === 'pickup') {
      setPickup(resolved);
    } else {
      setDropoff(resolved);
    }
    setClickMode(null);
  };

  // HTML5 Live Geolocation GPS to locate current user
  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const resolved = await reverseGeocode(latitude, longitude);
        setPickup({
          id: `gps_${Date.now()}`,
          name: resolved.name || 'My Current Location',
          address: resolved.address || `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          lat: latitude,
          lng: longitude,
          type: 'current-gps',
        });
        setIsLocatingUser(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsLocatingUser(false);
        alert('Could not retrieve GPS location. Please allow location access or pick manually.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const defaultCenter = pickup ? [pickup.lat, pickup.lng] : [12.9719, 77.6412];

  return (
    <div className="relative w-full h-full min-h-[350px] bg-[#0B0F17] overflow-hidden select-none">
      {/* Top Telemetry & Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[500] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Telemetry Pill */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 bg-[#0B0F17]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
            </span>
            <span className="text-xs font-semibold text-white tracking-wide">CABZO LIVE GPS</span>
            <span className="text-xs text-brand-muted border-l border-white/10 pl-2">
              {distanceKm} km • ~{estimatedDurationMinutes} mins
            </span>
          </div>

          {rideStatus !== RIDE_STATUSES.IDLE && (
            <div className="flex items-center gap-1.5 bg-[#1E293B]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-brand-orange/30 shadow-lg text-xs font-medium text-brand-orange">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></span>
              <span className="capitalize">{rideStatus.replace('_', ' ')}</span>
            </div>
          )}
        </div>

        {/* Right Action Pills (Live GPS & Map Key Guide) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Current GPS button */}
          <button
            type="button"
            onClick={handleGetLiveLocation}
            disabled={isLocatingUser}
            className="flex items-center gap-1.5 bg-[#1E293B]/90 hover:bg-[#27354A] backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-xs font-semibold text-white shadow-lg transition-all"
            title="Locate me using GPS"
          >
            <Crosshair size={13} className={`text-brand-cyan ${isLocatingUser ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">My Location</span>
          </button>

          {/* Map API Key Guide Modal Button */}
          <button
            type="button"
            onClick={() => setIsApiKeyModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#1E293B]/90 hover:bg-[#27354A] backdrop-blur-md px-3 py-2 rounded-xl border border-brand-cyan/30 text-xs font-semibold text-brand-cyan shadow-lg transition-all"
            title="Extract & add your Mapbox / Carto API keys"
          >
            <Key size={13} />
            <span className="hidden sm:inline">Map API Keys</span>
          </button>
        </div>
      </div>

      {/* Pin On Map Instructions Helper (if user selected click mode) */}
      {clickMode && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[500] bg-brand-cyan text-[#0B0F17] font-bold text-xs px-4 py-2 rounded-xl shadow-2xl animate-bounce">
          Click anywhere on the map to place {clickMode === 'pickup' ? 'Pick-up' : 'Drop-off'}
        </div>
      )}

      {/* Leaflet Map Tile Container */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full z-0"
      >
        {/* OpenStreetMap with high-contrast dark filter (Zero Watermark) OR Mapbox/Carto */}
        <TileLayer
          url={tileUrl}
          className={tileClass}
          subdomains="abc"
          maxZoom={19}
          attribution={attribution}
        />

        <MapClickHandler onMapClick={handleMapClick} />

        {/* Dynamic Road Route Polyline */}
        {routePolyline.length > 0 && (
          <>
            {/* Outer neon glow line */}
            <Polyline
              positions={routePolyline}
              pathOptions={{
                color: '#00A6FF',
                weight: 6,
                opacity: 0.35,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            {/* Inner solid high-contrast road line */}
            <Polyline
              positions={routePolyline}
              pathOptions={{
                color: '#00A6FF',
                weight: 3.5,
                opacity: 0.95,
                dashArray: rideStatus === RIDE_STATUSES.IN_PROGRESS ? '8, 8' : undefined,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </>
        )}

        {/* Pickup Marker */}
        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]} icon={createPickupIcon()}>
            <Popup className="dark-popup">
              <div className="text-xs space-y-1">
                <p className="font-semibold text-brand-cyan">PICK-UP LOCATION</p>
                <p className="text-white font-medium">{pickup.name}</p>
                <p className="text-gray-400 text-[11px]">{pickup.address}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Dropoff Marker */}
        {dropoff && (
          <Marker position={[dropoff.lat, dropoff.lng]} icon={createDropoffIcon()}>
            <Popup className="dark-popup">
              <div className="text-xs space-y-1">
                <p className="font-semibold text-brand-orange">DROP-OFF DESTINATION</p>
                <p className="text-white font-medium">{dropoff.name}</p>
                <p className="text-gray-400 text-[11px]">{dropoff.address}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Active Driver Vehicle Marker */}
        {driverMarkerPos && (
          <Marker
            position={[driverMarkerPos.lat, driverMarkerPos.lng]}
            icon={createDriverIcon(true)}
          >
            <Popup className="dark-popup">
              <div className="text-xs space-y-1">
                <p className="font-semibold text-white flex items-center gap-1">
                  <ShieldCheck size={13} className="text-brand-cyan" />
                  {activeDriver.name}
                </p>
                <p className="text-gray-300 font-mono text-[11px]">{activeDriver.vehiclePlate}</p>
                <p className="text-gray-400 text-[11px]">{activeDriver.vehicleModel}</p>
              </div>
            </Popup>
          </Marker>
        )}

        <AutoFitBounds pickup={pickup} dropoff={dropoff} />
      </MapContainer>

      {/* Floating Bottom Left: Set via Map Click Quick Chips */}
      <div className="absolute bottom-3 left-3 z-[500] flex items-center gap-2">
        <button
          type="button"
          onClick={() => setClickMode(clickMode === 'pickup' ? null : 'pickup')}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold backdrop-blur-md border transition-all ${
            clickMode === 'pickup'
              ? 'bg-brand-cyan text-[#0B0F17] border-brand-cyan font-bold shadow-glow-cyan'
              : 'bg-[#0B0F17]/85 text-brand-muted hover:text-white border-white/10'
          }`}
        >
          <MapPin size={11} className="inline mr-1 text-brand-cyan" />
          Pin Pickup
        </button>

        <button
          type="button"
          onClick={() => setClickMode(clickMode === 'dropoff' ? null : 'dropoff')}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold backdrop-blur-md border transition-all ${
            clickMode === 'dropoff'
              ? 'bg-brand-orange text-white border-brand-orange font-bold shadow-glow-orange'
              : 'bg-[#0B0F17]/85 text-brand-muted hover:text-white border-white/10'
          }`}
        >
          <MapPin size={11} className="inline mr-1 text-brand-orange" />
          Pin Dropoff
        </button>
      </div>

      {/* Floating Bottom Right Watermark */}
      <div className="absolute bottom-3 right-3 z-[500] pointer-events-none">
        <div className="px-2.5 py-1 rounded-md bg-[#0B0F17]/80 backdrop-blur-sm border border-white/5 text-[10px] text-gray-500 font-mono">
          CABZO GEO ROUTE • OSRM • OPENSTREETMAP
        </div>
      </div>

      {/* Step-by-Step API Key Guide Modal */}
      <MapApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
};
