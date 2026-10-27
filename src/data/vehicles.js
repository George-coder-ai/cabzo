export const VEHICLE_TIERS = [
  {
    id: 'economy-sedan',
    name: 'Economy Sedan',
    model: 'Maruti Dzire / Toyota Etios',
    tagline: 'Affordable, reliable everyday city rides',
    baseFare: 50,
    ratePerKm: 14,
    capacity: 4,
    etaMinutes: 3,
    icon: 'Car',
    badge: 'Popular',
    speedKmh: 42,
  },
  {
    id: 'compact-ev',
    name: 'Compact EV',
    model: 'Tata Nexon EV / MG ZS',
    tagline: 'Zero-emission quiet urban glide',
    baseFare: 65,
    ratePerKm: 16,
    capacity: 4,
    etaMinutes: 2,
    icon: 'Zap',
    badge: 'Eco Friendly',
    speedKmh: 45,
  },
  {
    id: 'premium-sedan',
    name: 'Premium Executive',
    model: 'Toyota Camry / Skoda Superb',
    tagline: 'Top-rated captains, premium interiors',
    baseFare: 120,
    ratePerKm: 24,
    capacity: 4,
    etaMinutes: 5,
    icon: 'Sparkles',
    badge: 'High Comfort',
    speedKmh: 48,
  },
  {
    id: 'luxury-suv',
    name: 'Luxury SUV',
    model: 'Audi Q5 / BMW X3 / Fortuner',
    tagline: 'Spacious 6-seater executive travel',
    baseFare: 200,
    ratePerKm: 36,
    capacity: 6,
    etaMinutes: 7,
    icon: 'ShieldCheck',
    badge: 'Spacious',
    speedKmh: 50,
  },
];

export const calculateFare = (baseFare, ratePerKm, distanceKm) => {
  const calculated = baseFare + distanceKm * ratePerKm;
  // Round to nearest integer for clean INR display
  return Math.max(50, Math.round(calculated));
};
