# 🔐 The Great Escape - 360° Escape Room

An immersive 360° escape room web application built with React, Three.js, and Firebase.

## 🎮 Features

- **360° Room Viewer**: Immersive panoramic view with drag to look around and scroll to zoom
- **Interactive Hotspots**: Click on objects in the room to interact with them
- **Puzzle System**: Progressive puzzle flow - find key → open drawer → crack safe → escape!
- **Inventory System**: Collect and use items to solve puzzles
- **Timer**: Track your escape time
- **Leaderboard**: Compete with others for the fastest escape time
- **Hint System**: Three progressive hints if you get stuck
- **Responsive Design**: Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Firebase account (free tier works perfectly)

### Installation

1. Clone/download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔥 Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" (or use an existing one)
3. Give your project a name (e.g., "the-great-escape")
4. Disable Google Analytics (optional) and click "Create Project"

### Step 2: Enable Authentication

1. In your Firebase project, go to **Build > Authentication**
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Enable **Anonymous** sign-in method
5. Click "Save"

### Step 3: Create Firestore Database

1. Go to **Build > Firestore Database**
2. Click "Create database"
3. Select "Start in **test mode**" (we'll update rules later)
4. Choose your preferred location
5. Click "Enable"

### Step 4: Get Your Firebase Config

1. Go to **Project Settings** (gear icon next to "Project Overview")
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Give it a nickname (e.g., "escape-room-web")
5. DON'T check "Firebase Hosting" yet
6. Click "Register app"
7. Copy the `firebaseConfig` object

### Step 5: Update Your Config

Open `src/firebase.js` and replace the placeholder config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 6: Deploy Firestore Rules

After testing locally, update Firestore rules for security:

1. Go to **Firestore Database > Rules**
2. Replace with the content from `firestore.rules`
3. Click "Publish"

## 🌐 Firebase Hosting Deployment

### First-time Setup

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize hosting (skip if already done):
   ```bash
   firebase init hosting
   ```
   - Select your project
   - Set public directory to `dist`
   - Configure as single-page app: **Yes**
   - Don't overwrite `index.html`

4. Update `.firebaserc` with your project ID

### Deploy

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

## 🎯 How to Play

1. **Look Around**: Drag your mouse or finger to look around the room
2. **Zoom**: Use scroll wheel or pinch gesture to zoom
3. **Interact**: Click on highlighted hotspots to examine objects
4. **Collect Items**: Some objects contain items - add them to your inventory
5. **Use Items**: Click an item in your inventory, then click a hotspot to use it
6. **Get Hints**: Stuck? Click the hint button for progressive hints
7. **Escape**: Find the exit and escape as fast as you can!

## 🧩 Puzzle Solution (Spoilers!)

<details>
<summary>Click to reveal the solution</summary>

1. Click on the **Book** → Take the Key
2. Select the Key from inventory, click on the **Vase** → Use Key to open drawer → Get the Note (code: 1234)
3. Click on the **Painting** → Enter code 1234 on the safe → Get Exit Key
4. Click on the **Door** (appears after getting exit key) → Escape!

</details>

## 🛠️ Tech Stack

- **Frontend**: React 18, Three.js with @react-three/fiber and @react-three/drei
- **State Management**: Zustand
- **Backend**: Firebase (Firestore, Anonymous Auth)
- **Build Tool**: Vite
- **Hosting**: Firebase Hosting

## 📁 Project Structure

```
src/
├── components/
│   ├── Room360.jsx      # 360° panoramic viewer with Three.js
│   ├── Room360.css
│   ├── Timer.jsx        # Game timer
│   ├── Timer.css
│   ├── Inventory.jsx    # Inventory bar
│   ├── Inventory.css
│   ├── Modal.jsx        # Interaction modals for puzzles
│   ├── Modal.css
│   ├── HintButton.jsx   # Hint system
│   ├── HintButton.css
│   ├── Leaderboard.jsx  # Escape leaderboard
│   └── Leaderboard.css
├── store/
│   └── gameStore.js     # Zustand state management
├── firebase.js          # Firebase configuration
├── App.jsx              # Main app component
├── App.css              # Global styles
└── main.jsx             # Entry point
```

## 🎨 Customization

### Change the Panorama Image

In `src/components/Room360.jsx`, update the texture URL:

```javascript
const texture = useTexture('YOUR_EQUIRECTANGULAR_IMAGE_URL');
```

Use any equirectangular (360°) image. Recommended size: 4096x2048 or larger.

### Modify Hotspot Positions

Adjust the `position` prop on `<Hotspot>` components in `Room360.jsx`:

```javascript
<Hotspot
  position={[x, y, z]} // 3D coordinates
  label="Your Label"
  onClick={() => handleHotspotClick('your-id')}
/>
```

### Add New Puzzles

1. Add new game state in `gameStore.js`
2. Create new hotspot in `Room360.jsx`
3. Add modal content in `Modal.jsx`
4. Update hint logic in `gameStore.js`

## 📄 License

MIT License - feel free to use this for personal or commercial projects!

## 🙏 Credits

- Panorama image: [Unsplash](https://unsplash.com)
- Icons: Native emoji
- Built with ❤️ using React and Three.js
