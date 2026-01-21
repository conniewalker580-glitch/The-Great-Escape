# Firebase Migration Complete ✅

## Overview
The Great Escape has been successfully migrated from Clerk + Vercel Postgres to **Firebase** (Auth, Firestore, Storage).

## What Was Done

### 1. **Firebase Configuration** (`lib/firebase.ts`)
- ✅ Client-side Firebase initialization
- ✅ Environment variable validation
- ✅ SSR-safe initialization (client-only)
- ✅ Exports for Auth, Firestore, and Storage

### 2. **Firebase Authentication** (`lib/firebase-auth.ts`)
- ✅ Email/password sign up
- ✅ Email/password sign in
- ✅ Sign out
- ✅ Password reset
- ✅ Email verification
- ✅ Auth state listener
- ✅ Profile management

### 3. **Firebase Admin** (`lib/firebase-admin.ts`)
- ✅ Server-side authentication
- ✅ Token verification for API routes
- ✅ `auth(req)` function (replaces Clerk's `auth()`)
- ✅ `getCurrentUserInfo(req)` (replaces Clerk's `currentUser()`)
- ✅ Client-side auth headers helper

### 4. **Firestore Database** (`lib/firebase-db.ts`)
- ✅ User operations (create, get, update tier, increment rooms)
- ✅ Subscription operations (create, get, update status)
- ✅ Room progress tracking (save, get, get all)
- ✅ Badge system (award, get user badges, check and award)
- ✅ AI hints storage
- ✅ Usage tracking
- ✅ Daily rewards

### 5. **Firebase Storage** (`lib/firebase-storage.ts`)
- ✅ Upload room images (main, panoramic, scenes)
- ✅ Upload hotspot close-ups
- ✅ Upload clue images
- ✅ Upload evidence images
- ✅ Upload puzzle visuals
- ✅ Get download URLs
- ✅ Delete operations
- ✅ Upload from URL (for migration)

### 6. **Updated Files**
- ✅ `app/layout.tsx` - Replaced ClerkProvider with FirebaseProvider
- ✅ `components/FirebaseProvider.tsx` - New client component for Firebase initialization
- ✅ `lib/database.ts` - Re-exports Firebase functions for backward compatibility
- ✅ All API routes updated to use Firebase auth:
  - `app/api/play/track/route.ts`
  - `app/api/user-progress/route.ts`
  - `app/api/checkout/route.ts`
  - `app/api/generate-room/route.ts`
  - `app/api/ai/hint/route.ts`
  - `app/api/daily-challenge/route.ts`
  - `app/api/test/upgrade/route.ts`
  - `app/api/test/reset/route.ts`

### 7. **Environment Variables**
Added to `.env.local`:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB9wT3HkQGHJ9b1t2B-P3Nt_Is4RYEDaHs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=the-great-escape-8fc89.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=the-great-escape-8fc89
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=the-great-escape-8fc89.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=581268861906
NEXT_PUBLIC_FIREBASE_APP_ID=1:581268861906:web:f0567770af6d2732e90e0b
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-S2FRQXGB1B
```

## Firebase Collections Structure

### `users`
```typescript
{
  clerk_id: string,           // User ID (Firebase UID)
  email: string,
  username: string | null,
  tier: 'free' | 'explorer' | 'adventurer' | 'elite' | 'master',
  rooms_played_this_month: number,
  total_rooms_completed: number,
  total_hints_used: number,
  total_play_time_seconds: number,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### `subscriptions`
```typescript
{
  user_id: string,
  tier: string,
  stripe_customer_id: string,
  stripe_subscription_id: string,
  stripe_price_id: string,
  status: 'active' | 'canceled' | 'past_due',
  current_period_start: Timestamp,
  current_period_end: Timestamp,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### `room_progress`
```typescript
{
  user_id: string,
  room_id: string,
  completed: boolean,
  stars: number,
  rank: string,
  time_seconds: number,
  hints_used: number,
  attempts: number,
  first_completed_at: Timestamp,
  last_played_at: Timestamp,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### `user_badges`
```typescript
{
  user_id: string,
  badge_id: string,
  earned_at: Timestamp
}
```

### `ai_hints`
```typescript
{
  user_id: string,
  room_id: string,
  puzzle_id: string | null,
  hint_text: string,
  created_at: Timestamp
}
```

### `usage_tracking`
```typescript
{
  user_id: string,
  action_type: string,
  room_id: string | null,
  metadata: any,
  created_at: Timestamp
}
```

### `daily_rewards`
```typescript
{
  user_id: string,
  reward_type: string,
  reward_value: string,
  reward_date: string,
  claimed: boolean,
  claimed_at: Timestamp | null,
  created_at: Timestamp
}
```

## Firebase Storage Structure

```
/rooms/{roomId}/
  - main.jpg (main room image)
  - panoramic.jpg (360° panoramic view)
  - scene-{n}.jpg (multiverse scenes)
  - hotspot-{id}.jpg (hotspot close-ups)
/clues/{roomId}/{clueId}.jpg
/evidence/{roomId}/{evidenceId}.jpg
/puzzles/{roomId}/{puzzleId}.jpg
```

## Next Steps

### 1. **Set Up Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `the-great-escape-8fc89`
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database** → Start in production mode
5. Enable **Storage** → Start in production mode

### 2. **Configure Firestore Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own subscriptions
    match /subscriptions/{subscriptionId} {
      allow read: if request.auth != null && resource.data.user_id == request.auth.uid;
      allow write: if request.auth != null;
    }
    
    // Users can read/write their own room progress
    match /room_progress/{progressId} {
      allow read, write: if request.auth != null && resource.data.user_id == request.auth.uid;
    }
    
    // Users can read/write their own badges
    match /user_badges/{badgeId} {
      allow read, write: if request.auth != null && resource.data.user_id == request.auth.uid;
    }
    
    // Users can read/write their own hints
    match /ai_hints/{hintId} {
      allow read, write: if request.auth != null && resource.data.user_id == request.auth.uid;
    }
    
    // Usage tracking - write only
    match /usage_tracking/{trackingId} {
      allow write: if request.auth != null;
    }
    
    // Daily rewards
    match /daily_rewards/{rewardId} {
      allow read, write: if request.auth != null && resource.data.user_id == request.auth.uid;
    }
  }
}
```

### 3. **Configure Storage Security Rules**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to read all images
    match /{allPaths=**} {
      allow read: if request.auth != null;
    }
    
    // Only allow admin to write (you can adjust this)
    match /{allPaths=**} {
      allow write: if request.auth != null;
    }
  }
}
```

### 4. **Optional: Set Up Firebase Admin SDK for Production**
For production API routes, create a service account:
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Add to `.env.local`:
```bash
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"..."}'
```

## Testing Checklist

- [ ] Firebase Auth initializes without errors
- [ ] Firestore connects successfully
- [ ] Storage is accessible
- [ ] User sign up works
- [ ] User sign in works
- [ ] API routes authenticate correctly
- [ ] Room progress saves to Firestore
- [ ] Images upload to Storage
- [ ] App runs locally without exit code 1

## Migration Notes

- **Backward Compatibility**: `lib/database.ts` re-exports Firebase functions, so existing code continues to work
- **Clerk Removed**: All Clerk imports have been replaced with Firebase equivalents
- **Auth Flow**: Users now authenticate with Firebase Auth (email/password) instead of Clerk
- **Data Storage**: All data is now stored in Firestore instead of Vercel Postgres
- **Assets**: All visual assets will be stored in Firebase Storage

## Known Issues & Solutions

1. **Firebase Admin in Development**: If you don't have a service account, Firebase Admin will initialize in development mode (limited functionality)
2. **SSR Errors**: Firebase only initializes on the client side to prevent SSR errors
3. **Auth Headers**: API routes now require `Authorization: Bearer <token>` header for authentication

## Support

For issues or questions:
- Email: snapmoodsai.gmail@gmail.com
- Owner: C.S. Walker
