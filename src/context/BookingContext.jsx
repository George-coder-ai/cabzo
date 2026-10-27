import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { VEHICLE_TIERS, calculateFare } from '../data/vehicles';
import { PRESET_LOCATIONS, calculateHaversineDistance } from '../data/locations';
import { INITIAL_TRIP_HISTORY } from '../data/initialHistory';
import confetti from 'canvas-confetti';

const BookingContext = createContext(null);

export const RIDE_STATUSES = {
  IDLE: 'idle',
  SEARCHING: 'searching',
  ACCEPTED: 'accepted',
  ARRIVED: 'arrived',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const BookingProvider = ({ children }) => {
  // Navigation View State ('book' | 'driver' | 'history')
  const [activeTab, setActiveTab] = useState('book');

  // Location State
  const [pickup, setPickup] = useState(PRESET_LOCATIONS[0]); // Indiranagar
  const [dropoff, setDropoff] = useState(PRESET_LOCATIONS[1]); // Airport

  // Vehicle Selection State
  const [selectedVehicleId, setSelectedVehicleId] = useState('economy-sedan');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'Card' | 'Cash'

  // Ride Lifecycle State
  const [rideStatus, setRideStatus] = useState(RIDE_STATUSES.IDLE);
  const [securityOtp, setSecurityOtp] = useState('7249');
  const [activeRideId, setActiveRideId] = useState(null);

  // Active Assigned Driver info
  const [activeDriver, setActiveDriver] = useState({
    id: 'usr_driver_204',
    name: 'Rajesh Kumar',
    rating: 4.92,
    totalTrips: 1840,
    vehicleModel: 'Toyota Camry Hybrid (Silver)',
    vehiclePlate: 'KA 05 MN 4812',
    phone: '+91 98450 11223',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80',
    currentLocation: { lat: 12.9719, lng: 77.6412 },
  });

  // Simulated moving driver coordinates for map
  const [driverMarkerPos, setDriverMarkerPos] = useState({
    lat: PRESET_LOCATIONS[0].lat + 0.008,
    lng: PRESET_LOCATIONS[0].lng - 0.006,
  });

  // Driver View incoming request modal state
  const [incomingRequest, setIncomingRequest] = useState(null);

  // Trip History State
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('car_platform_history');
      return saved ? JSON.parse(saved) : INITIAL_TRIP_HISTORY;
    } catch (e) {
      return INITIAL_TRIP_HISTORY;
    }
  });

  // Auto-advance toggle for test demonstration
  const [autoAdvance, setAutoAdvance] = useState(false);

  // Sync History to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('car_platform_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Dynamic Distance Calculation
  const distanceKm = useMemo(() => {
    if (!pickup || !dropoff) return 10.0;
    return calculateHaversineDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
  }, [pickup, dropoff]);

  // Selected vehicle object
  const selectedVehicle = useMemo(() => {
    return VEHICLE_TIERS.find((v) => v.id === selectedVehicleId) || VEHICLE_TIERS[0];
  }, [selectedVehicleId]);

  // Estimated Fare in INR
  const currentFare = useMemo(() => {
    return calculateFare(selectedVehicle.baseFare, selectedVehicle.ratePerKm, distanceKm);
  }, [selectedVehicle, distanceKm]);

  // Estimated Duration in Minutes (approx based on distance & avg city speed)
  const estimatedDurationMinutes = useMemo(() => {
    return Math.max(8, Math.round((distanceKm / 35) * 60));
  }, [distanceKm]);

  // Start Booking Flow
  const requestRide = useCallback(() => {
    const rideId = `ride_${Math.floor(10000 + Math.random() * 90000)}`;
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setActiveRideId(rideId);
    setSecurityOtp(randomOtp);
    setRideStatus(RIDE_STATUSES.SEARCHING);

    // Prepare driver incoming notification
    setIncomingRequest({
      rideId,
      pickup,
      dropoff,
      distanceKm,
      fare: currentFare,
      vehicleTier: selectedVehicle.name,
      riderName: 'Aaditya S.',
      rating: 4.9,
    });
  }, [pickup, dropoff, distanceKm, currentFare, selectedVehicle]);

  // Driver accepts ride request
  const acceptIncomingRequest = () => {
    setIncomingRequest(null);
    setRideStatus(RIDE_STATUSES.ACCEPTED);
  };

  // Driver declines ride request
  const declineIncomingRequest = () => {
    setIncomingRequest(null);
  };

  // Cancel Current Ride
  const cancelRide = () => {
    if (activeRideId) {
      const cancelledTrip = {
        id: activeRideId,
        riderId: 'usr_rider_101',
        driverId: activeDriver?.id || null,
        driverName: activeDriver?.name || 'Unassigned',
        driverAvatar: activeDriver?.avatar || null,
        vehicleTier: selectedVehicle.name,
        vehicleModel: selectedVehicle.model,
        vehiclePlate: activeDriver?.vehiclePlate || 'KA 01 EK 0000',
        pickup,
        dropoff,
        distanceKm,
        fare: currentFare,
        status: 'cancelled',
        paymentMethod,
        createdAt: new Date().toISOString(),
        durationMinutes: 0,
        rating: null,
      };
      setHistory((prev) => [cancelledTrip, ...prev]);
    }
    setRideStatus(RIDE_STATUSES.IDLE);
    setIncomingRequest(null);
    setActiveRideId(null);
    setAutoAdvance(false);
  };

  // Trigger celebration confetti
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00A6FF', '#F97316', '#38BDF8', '#10B981'],
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  // Complete Trip & Append to History
  const completeTrip = useCallback(() => {
    setRideStatus(RIDE_STATUSES.COMPLETED);
    triggerConfetti();

    const completedTrip = {
      id: activeRideId || `ride_${Date.now()}`,
      riderId: 'usr_rider_101',
      driverId: activeDriver.id,
      driverName: activeDriver.name,
      driverAvatar: activeDriver.avatar,
      vehicleTier: selectedVehicle.name,
      vehicleModel: selectedVehicle.model,
      vehiclePlate: activeDriver.vehiclePlate,
      pickup,
      dropoff,
      distanceKm,
      fare: currentFare,
      status: 'completed',
      paymentMethod,
      createdAt: new Date().toISOString(),
      durationMinutes: estimatedDurationMinutes,
      rating: 5,
    };

    setHistory((prev) => [completedTrip, ...prev]);
    setAutoAdvance(false);
  }, [
    activeRideId,
    activeDriver,
    selectedVehicle,
    pickup,
    dropoff,
    distanceKm,
    currentFare,
    paymentMethod,
    estimatedDurationMinutes,
    triggerConfetti,
  ]);

  // Step-by-step progress simulation helper
  const simulateNextStage = useCallback(() => {
    switch (rideStatus) {
      case RIDE_STATUSES.IDLE:
        requestRide();
        break;
      case RIDE_STATUSES.SEARCHING:
        setRideStatus(RIDE_STATUSES.ACCEPTED);
        setIncomingRequest(null);
        break;
      case RIDE_STATUSES.ACCEPTED:
        setRideStatus(RIDE_STATUSES.ARRIVED);
        break;
      case RIDE_STATUSES.ARRIVED:
        setRideStatus(RIDE_STATUSES.IN_PROGRESS);
        break;
      case RIDE_STATUSES.IN_PROGRESS:
        completeTrip();
        break;
      case RIDE_STATUSES.COMPLETED:
      case RIDE_STATUSES.CANCELLED:
        setRideStatus(RIDE_STATUSES.IDLE);
        setActiveRideId(null);
        break;
      default:
        break;
    }
  }, [rideStatus, completeTrip, requestRide]);

  // Automated progression timer when autoAdvance is enabled
  useEffect(() => {
    if (!autoAdvance) return;
    if (rideStatus === RIDE_STATUSES.IDLE || rideStatus === RIDE_STATUSES.COMPLETED) return;

    const timer = setTimeout(() => {
      simulateNextStage();
    }, 4500);

    return () => clearTimeout(timer);
  }, [autoAdvance, rideStatus, simulateNextStage]);

  // Animate driver marker along route based on status
  useEffect(() => {
    if (!pickup || !dropoff) return;

    if (rideStatus === RIDE_STATUSES.SEARCHING || rideStatus === RIDE_STATUSES.IDLE) {
      // Driver parked nearby pickup
      setDriverMarkerPos({
        lat: pickup.lat + 0.007,
        lng: pickup.lng - 0.005,
      });
    } else if (rideStatus === RIDE_STATUSES.ACCEPTED) {
      // Driver moving towards pickup
      setDriverMarkerPos({
        lat: pickup.lat + 0.003,
        lng: pickup.lng - 0.002,
      });
    } else if (rideStatus === RIDE_STATUSES.ARRIVED) {
      // Driver reached pickup point
      setDriverMarkerPos({
        lat: pickup.lat + 0.0003,
        lng: pickup.lng + 0.0003,
      });
    } else if (rideStatus === RIDE_STATUSES.IN_PROGRESS) {
      // Driver mid-way between pickup and dropoff
      setDriverMarkerPos({
        lat: (pickup.lat + dropoff.lat) / 2,
        lng: (pickup.lng + dropoff.lng) / 2,
      });
    } else if (rideStatus === RIDE_STATUSES.COMPLETED) {
      // Driver reached dropoff
      setDriverMarkerPos({
        lat: dropoff.lat,
        lng: dropoff.lng,
      });
    }
  }, [rideStatus, pickup, dropoff]);

  // Swap pickup & dropoff
  const swapLocations = () => {
    const temp = pickup;
    setPickup(dropoff);
    setDropoff(temp);
  };

  // Reset Booking to start a new ride
  const resetToNewBooking = () => {
    setRideStatus(RIDE_STATUSES.IDLE);
    setActiveRideId(null);
    setIncomingRequest(null);
    setAutoAdvance(false);
  };

  return (
    <BookingContext.Provider
      value={{
        activeTab,
        setActiveTab,
        pickup,
        setPickup,
        dropoff,
        setDropoff,
        swapLocations,
        distanceKm,
        selectedVehicleId,
        setSelectedVehicleId,
        selectedVehicle,
        paymentMethod,
        setPaymentMethod,
        currentFare,
        estimatedDurationMinutes,
        rideStatus,
        setRideStatus,
        securityOtp,
        activeDriver,
        setActiveDriver,
        driverMarkerPos,
        incomingRequest,
        acceptIncomingRequest,
        declineIncomingRequest,
        history,
        requestRide,
        cancelRide,
        completeTrip,
        simulateNextStage,
        autoAdvance,
        setAutoAdvance,
        resetToNewBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
