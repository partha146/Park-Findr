# ParkFindr

Mobile-first parking discovery app for **Bengaluru, India**. Built with React, Vite, Tailwind CSS, Firebase (Auth + Firestore), React Router, and Razorpay.

## Features

- Splash screen with auto-redirect to login
- Firebase Auth signup/login with Firestore user profiles
- Home screen with stats, offer carousel, and category sections
- Search across all Bengaluru locations
- Slot grid (A1–A20), parking entry, live active parking timer
- Billing summary with coupon codes (`PARK30`, `AIRPORT50`)
- Razorpay payments (UPI/Card) or cash; demo mode without keys
- Bookings history, profile, help board

## Quick start

```bash
npm install
cp .env.example .env
# Add Firebase + Razorpay keys (optional for demo mode)
npm run dev
```

**Demo mode:** If Firebase env vars are missing, the app uses localStorage for auth and sessions. Sign up first, then log in with the same email.

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_*` | Firebase project config |
| `VITE_RAZORPAY_KEY_ID` | Razorpay test/live key |

## Firebase setup

1. Create a Firebase project and enable **Email/Password** auth.
2. Create Firestore database.
3. Collections used:
   - `users` — profile, vehicle, stats
   - `parkingSessions` — active and completed sessions
4. Deploy rules (adjust for production):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /parkingSessions/{sessionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

5. Create composite index: `parkingSessions` — `userId` ASC, `status` ASC, `exitTime` DESC.

## Pricing

| Type | Rate |
|------|------|
| Car / SUV | ₹20/hr |
| Bike | ₹10/hr |
| Malls | ₹30/hr |
| Airport | ₹50/hr |

## Design

- Max width 430px, centered
- Primary `#1A237E`, Accent `#FFC107`
- Available `#4CAF50`, Occupied `#F44336`

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview build
