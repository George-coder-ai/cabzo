// Popular preset locations with coordinates
export const PRESET_LOCATIONS = [
  {
    id: 'loc-1',
    name: 'Indiranagar 100ft Road',
    address: '100 Feet Rd, HAL 2nd Stage, Indiranagar',
    city: 'Bengaluru',
    lat: 12.9719,
    lng: 77.6412,
    type: 'hub',
  },
  {
    id: 'loc-2',
    name: 'Kempegowda Int. Airport (BLR)',
    address: 'Terminal 2, KIAL Rd, Devanahalli',
    city: 'Bengaluru',
    lat: 13.1986,
    lng: 77.7066,
    type: 'airport',
  },
  {
    id: 'loc-3',
    name: 'Koramangala 4th Block',
    address: '80 Feet Rd, Sony World Signal, Koramangala',
    city: 'Bengaluru',
    lat: 12.9344,
    lng: 77.6289,
    type: 'hub',
  },
  {
    id: 'loc-4',
    name: 'Electronic City Phase 1',
    address: 'Infosys Main Gate, Hosur Rd, E-City',
    city: 'Bengaluru',
    lat: 12.8452,
    lng: 77.6602,
    type: 'tech-park',
  },
  {
    id: 'loc-5',
    name: 'Whitefield ITPL',
    address: 'International Tech Park, Pattandur Agrahara',
    city: 'Bengaluru',
    lat: 12.9866,
    lng: 77.7381,
    type: 'tech-park',
  },
  {
    id: 'loc-6',
    name: 'MG Road Metro Station',
    address: 'Mahatma Gandhi Rd, Ashok Nagar',
    city: 'Bengaluru',
    lat: 12.9756,
    lng: 77.6066,
    type: 'transit',
  },
  {
    id: 'loc-7',
    name: 'Krantivira Sangolli Rayanna (SBC)',
    address: 'Majestic City Railway Station, Gubbi Thotadappa Rd',
    city: 'Bengaluru',
    lat: 12.9781,
    lng: 77.5695,
    type: 'transit',
  },
  {
    id: 'loc-8',
    name: 'HSR Layout Sector 1',
    address: '27th Main Rd, Sector 1, HSR Layout',
    city: 'Bengaluru',
    lat: 12.9116,
    lng: 77.6534,
    type: 'residential',
  },
];

// Haversine formula to compute distance in KM between 2 lat/lng points
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  // Return formatted float with 1 decimal place, minimum 1.5 km
  return Math.max(1.5, Math.round(d * 10) / 10);
}
