import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  isFirebaseConfigured,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from '../config/firebase';

const AuthContext = createContext(null);

const DEMO_RIDER = {
  id: 'usr_rider_101',
  firebaseUid: 'cabzo_rider_fb921',
  name: 'Aaditya Sharma',
  email: 'aaditya.sharma@cabzo.in',
  phone: '+91 98765 43210',
  role: 'rider', // 'rider' | 'driver'
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  isOnline: true,
  rating: 4.95,
  totalRides: 48,
};

const DEMO_DRIVER = {
  id: 'usr_driver_204',
  firebaseUid: 'cabzo_driver_fb812',
  name: 'Rajesh Kumar (Captain)',
  email: 'rajesh.captain@cabzo.in',
  phone: '+91 98450 11223',
  role: 'driver',
  avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  vehicleModel: 'Toyota Camry Hybrid (Silver)',
  vehiclePlate: 'KA 05 MN 4812',
  vehicleTier: 'Premium Executive',
  isOnline: true,
  rating: 4.92,
  totalTrips: 1420,
  todayEarnings: 2840,
  acceptanceRate: '98%',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cabzo_user_session');
      return saved ? JSON.parse(saved) : DEMO_RIDER;
    } catch (e) {
      return DEMO_RIDER;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Listen to Firebase Auth state if real credentials are provided
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser((prev) => ({
          id: firebaseUser.uid,
          firebaseUid: firebaseUser.uid,
          name: firebaseUser.displayName || prev?.name || 'Cabzo User',
          email: firebaseUser.email || prev?.email || '',
          phone: firebaseUser.phoneNumber || prev?.phone || '+91 98765 43210',
          role: prev?.role || 'rider',
          avatarUrl:
            firebaseUser.photoURL ||
            prev?.avatarUrl ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
              firebaseUser.displayName || 'Cabzo'
            )}&backgroundColor=00A6FF,1E293B`,
          isOnline: prev?.isOnline ?? true,
          rating: prev?.rating || 5.0,
          totalRides: prev?.totalRides || 0,
          vehicleModel: prev?.vehicleModel || 'Toyota Camry Hybrid (Silver)',
          vehiclePlate: prev?.vehiclePlate || 'KA 05 MN 4812',
          todayEarnings: prev?.todayEarnings ?? 2840,
          acceptanceRate: prev?.acceptanceRate || '98%',
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Save session to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('cabzo_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('cabzo_user_session');
    }
  }, [user]);

  // Login: Uses Real Firebase if configured, otherwise simulated Firebase flow
  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError('');

    try {
      if (isFirebaseConfigured && auth) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        const isDriver = email.toLowerCase().includes('driver') || email.toLowerCase().includes('captain');

        setUser({
          id: fbUser.uid,
          firebaseUid: fbUser.uid,
          name: fbUser.displayName || (isDriver ? 'Captain Rajesh' : 'Cabzo Rider'),
          email: fbUser.email,
          phone: fbUser.phoneNumber || '+91 98765 43210',
          role: isDriver ? 'driver' : 'rider',
          avatarUrl:
            fbUser.photoURL ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
              fbUser.displayName || email
            )}&backgroundColor=00A6FF,1E293B`,
          isOnline: true,
          rating: 4.95,
          totalRides: 12,
        });
      } else {
        // Fallback simulation when user hasn't added .env keys yet
        await new Promise((res) => setTimeout(res, 600));

        if (!email || !password) {
          setAuthError('Please fill in both email and password.');
          setIsLoading(false);
          return false;
        }

        const isDriverLogin = email.toLowerCase().includes('driver') || email.toLowerCase().includes('captain');
        const targetUser = isDriverLogin
          ? { ...DEMO_DRIVER, email }
          : { ...DEMO_RIDER, email };

        setUser(targetUser);
      }

      setIsLoading(false);
      setIsAuthModalOpen(false);
      return true;
    } catch (err) {
      console.error('Firebase Login Error:', err);
      setAuthError(err.message?.replace('Firebase: ', '') || 'Authentication failed. Please check credentials.');
      setIsLoading(false);
      return false;
    }
  };

  // Sign Up: Uses Real Firebase if configured, otherwise simulated Firebase flow
  const signup = async ({ name, email, password, role, phone }) => {
    setIsLoading(true);
    setAuthError('');

    try {
      if (isFirebaseConfigured && auth) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        // Update display name in Firebase
        if (name) {
          await updateProfile(fbUser, { displayName: name });
        }

        const newUser = {
          id: fbUser.uid,
          firebaseUid: fbUser.uid,
          name: name || 'Cabzo User',
          email: fbUser.email,
          phone: phone || '+91 90000 00000',
          role: role || 'rider',
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            name
          )}&backgroundColor=00A6FF,1E293B`,
          isOnline: true,
          rating: 5.0,
          totalRides: 0,
          ...(role === 'driver' && {
            vehicleModel: 'Hyundai Verna (White)',
            vehiclePlate: 'KA 01 EK 7744',
            vehicleTier: 'Economy Sedan',
            todayEarnings: 0,
            acceptanceRate: '100%',
          }),
        };

        setUser(newUser);
      } else {
        // Fallback simulation
        await new Promise((res) => setTimeout(res, 700));

        if (!name || !email || !password) {
          setAuthError('All fields are required.');
          setIsLoading(false);
          return false;
        }

        const newUser = {
          id: `usr_${Date.now()}`,
          firebaseUid: `fb_${Math.random().toString(36).substring(2, 9)}`,
          name,
          email,
          phone: phone || '+91 90000 00000',
          role: role || 'rider',
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            name
          )}&backgroundColor=00A6FF,1E293B`,
          isOnline: true,
          rating: 5.0,
          totalRides: 0,
          ...(role === 'driver' && {
            vehicleModel: 'Hyundai Verna (White)',
            vehiclePlate: 'KA 01 EK 7744',
            vehicleTier: 'Economy Sedan',
            todayEarnings: 0,
            acceptanceRate: '100%',
          }),
        };

        setUser(newUser);
      }

      setIsLoading(false);
      setIsAuthModalOpen(false);
      return true;
    } catch (err) {
      console.error('Firebase Signup Error:', err);
      setAuthError(err.message?.replace('Firebase: ', '') || 'Registration failed.');
      setIsLoading(false);
      return false;
    }
  };

  // Google OAuth 2.0 with Firebase
  const loginWithGoogle = async () => {
    setIsLoading(true);
    setAuthError('');

    try {
      if (isFirebaseConfigured && auth && googleProvider) {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;

        setUser({
          id: fbUser.uid,
          firebaseUid: fbUser.uid,
          name: fbUser.displayName || 'Google User',
          email: fbUser.email,
          phone: fbUser.phoneNumber || '+91 98765 43210',
          role: 'rider',
          avatarUrl: fbUser.photoURL || DEMO_RIDER.avatarUrl,
          isOnline: true,
          rating: 5.0,
          totalRides: 0,
        });
      } else {
        // Fallback demo user
        await new Promise((res) => setTimeout(res, 600));
        const googleUser = {
          ...DEMO_RIDER,
          name: 'Google Verified User',
          email: 'verified.google@gmail.com',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        };
        setUser(googleUser);
      }

      setIsLoading(false);
      setIsAuthModalOpen(false);
      return true;
    } catch (err) {
      console.error('Firebase Google Auth Error:', err);
      setAuthError(err.message?.replace('Firebase: ', '') || 'Google authentication failed.');
      setIsLoading(false);
      return false;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.error('Sign out error:', e);
    }
    setUser(null);
    setIsAuthModalOpen(false);
  };

  // Role Switcher for paired testing
  const switchRole = (newRole) => {
    if (!user) {
      setUser(newRole === 'driver' ? DEMO_DRIVER : DEMO_RIDER);
      return;
    }
    if (newRole === 'driver') {
      setUser({
        ...user,
        role: 'driver',
        vehicleModel: user.vehicleModel || 'Toyota Camry Hybrid (Silver)',
        vehiclePlate: user.vehiclePlate || 'KA 05 MN 4812',
        todayEarnings: user.todayEarnings ?? 2840,
        acceptanceRate: user.acceptanceRate || '98%',
      });
    } else {
      setUser({
        ...user,
        role: 'rider',
      });
    }
  };

  const toggleDriverOnline = () => {
    setUser((prev) => (prev ? { ...prev, isOnline: !prev.isOnline } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        authError,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isFirebaseConfigured,
        login,
        signup,
        loginWithGoogle,
        logout,
        switchRole,
        toggleDriverOnline,
        demoRider: DEMO_RIDER,
        demoDriver: DEMO_DRIVER,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
