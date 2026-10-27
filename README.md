# CABZO | Premium Car Ride Booking Platform 🚖⚡

Cabzo is a modern, responsive, ultra-minimalist car ride-booking web application built using **React**, **Tailwind CSS**, **Leaflet / OpenStreetMap**, and **Firebase Authentication**.

---

## ✨ Features

- **High-Contrast Dark Aesthetic**: Charcoal base (`#0B0F17`), slate surfaces (`#1E293B`), electric cyan (`#00A6FF`) actions, and tech orange (`#F97316`) active highlights.
- **Real-World Geographical Routing**: Powered by Open Source Routing Machine (OSRM) to calculate authentic turn-by-turn road geometries between GPS locations.
- **Dynamic Fare Engine**: Instant fare calculation using `Base + (Distance × Rate)` across multiple vehicle fleets (*Economy Sedan, Compact EV, Premium Executive, Luxury SUV*) in INR (`₹`).
- **Interactive Map Controls**:
  - OpenStreetMap dark tiles with zero watermarks.
  - Optional high-definition Mapbox vector tiles support via `.env`.
  - Device GPS location detection (*"My Location"*).
  - Direct map click-to-pin for both pickup and destination.
  - Live address autocomplete search via Nominatim.
- **Dynamic Ride Lifecycle**:
  - Full simulated flow: `Searching` &rarr; `Driver Accepted` &rarr; `Arrived` &rarr; `In Progress` &rarr; `Completed`.
  - Driver verification OTP code, captain profile, and license plate badge.
  - Trip celebration receipt with star rating feedback.
- **Captain / Driver Console**:
  - Online / Offline toggle with glowing status indicators.
  - Real-time earnings dashboard and performance metrics.
  - Incoming ride request modal with a 15-second countdown timer, fare payout, and accept/decline actions.
- **Trip History Activity**:
  - Desktop responsive table & mobile stacked card view with status tags (*Completed*, *Cancelled*).
- **Firebase Authentication 2.0**:
  - Email/Password login & registration.
  - Google OAuth 2.0 sign-in.
  - Dual-role support (Passenger vs Driver).

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS v3, Vanilla CSS glassmorphism
- **Icons**: Lucide React
- **Maps & Routing**: Leaflet, React-Leaflet, OSRM Engine, Nominatim Geocoding
- **Authentication**: Firebase Auth v11 (Web SDK)
- **Effects**: Canvas Confetti

---

## 🚀 Quick Start Guide

### 1. Clone the repository:
```bash
git clone https://github.com/George-coder-ai/cabzo.git
cd cabzo
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Configure Environment Variables:
Copy the template `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase and optional Mapbox credentials:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Platform Branding
VITE_APP_NAME=Cabzo
VITE_DEFAULT_CITY=Bengaluru

# Optional HD Map Tiles
VITE_MAPBOX_ACCESS_TOKEN=
```

### 4. Start the development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```
├── .env.example              # Environment variables template
├── index.html                # Entry HTML with custom fonts & Leaflet
├── tailwind.config.js        # Design system tokens and palette
├── src/
│   ├── config/
│   │   └── firebase.js       # Firebase initialization & auth providers
│   ├── context/
│   │   ├── AuthContext.jsx   # Authentication state & role switching
│   │   └── BookingContext.jsx# Ride lifecycle, fares, and dispatch state
│   ├── services/
│   │   └── routingService.js # OSRM road routing & Nominatim geocoding
│   ├── components/
│   │   ├── auth/             # Login/Signup modal with Google OAuth
│   │   ├── booking/          # Location inputs, vehicle list, and status tracker
│   │   ├── driver/           # Captain console & incoming request modal
│   │   ├── history/          # Trip history table & stacked cards
│   │   ├── map/              # Leaflet dark map with SVG markers & route
│   │   └── common/           # Header navbar with role badges
│   ├── data/                 # Vehicle tiers and preset coordinates
│   ├── App.jsx               # Split-screen desktop & mobile drawer layout
│   └── main.jsx
```

---

## 📄 License
MIT License. Built for modern urban mobility.
