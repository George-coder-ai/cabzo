// Routing & Geolocation Service for Cabzo Platform

// Fetch real turn-by-turn road route geometries via OSRM (Open Source Routing Machine)
export async function getRoadRoute(pickup, dropoff) {
  if (!pickup || !dropoff) return null;

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch route from OSRM');

    const data = await response.json();
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No driving route found between points');
    }

    const route = data.routes[0];
    // OSRM returns coordinates in [lng, lat] format, convert to Leaflet [lat, lng] format
    const points = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
    const durationMinutes = Math.max(5, Math.round(route.duration / 60));

    return {
      points,
      distanceKm,
      durationMinutes,
    };
  } catch (error) {
    console.warn('[Cabzo Route] OSRM fallback triggered:', error);
    // Graceful fallback: interpolate curved points
    const p1 = [pickup.lat, pickup.lng];
    const p2 = [dropoff.lat, dropoff.lng];
    const midLat = (pickup.lat + dropoff.lat) / 2;
    const midLng = (pickup.lng + dropoff.lng) / 2;
    const offset = 0.006 * (pickup.lat > dropoff.lat ? 1 : -1);

    const cp1 = [pickup.lat * 0.7 + dropoff.lat * 0.3, pickup.lng * 0.7 + dropoff.lng * 0.3 + offset];
    const cp2 = [pickup.lat * 0.3 + dropoff.lat * 0.7, pickup.lng * 0.3 + dropoff.lng * 0.7 - offset];

    return {
      points: [p1, cp1, [midLat, midLng + offset * 0.5], cp2, p2],
      distanceKm: null, // Keep existing haversine distance
      durationMinutes: null,
    };
  }
}

// Search locations by query using OpenStreetMap Nominatim
export async function searchAddress(query) {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=5&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
      },
    });
    if (!response.ok) return [];

    const results = await response.json();
    return results.map((item) => ({
      id: `nom_${item.place_id}`,
      name: item.name || item.display_name.split(',')[0],
      address: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type || 'location',
    }));
  } catch (err) {
    console.warn('[Cabzo Geocoding] Search error:', err);
    return [];
  }
}

// Reverse geocode GPS coordinates to human-readable address
export async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    return {
      name: data.name || data.display_name.split(',')[0] || 'Selected Map Location',
      address: data.display_name,
      lat,
      lng,
    };
  } catch (err) {
    return {
      name: 'Pinned Map Spot',
      address: `Coords: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      lat,
      lng,
    };
  }
}
