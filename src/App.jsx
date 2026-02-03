import { useEffect, Suspense } from 'react';
import Room360 from './components/Room360';
import Timer from './components/Timer';
import Inventory from './components/Inventory';
import Modal from './components/Modal';
import HintButton from './components/HintButton';
import Leaderboard from './components/Leaderboard';
import { signInAnonymousUser } from './firebase';
import './App.css';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-icon">🔐</div>
        <h1>The Great Escape</h1>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
        <p>Loading escape room...</p>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Initialize anonymous auth
    signInAnonymousUser();
  }, []);

  return (
    <div className="app">
      <div className="title-header">
        <h1>🔐 The Great Escape</h1>
        <p>Find clues, solve puzzles, and escape!</p>
      </div>

      <Suspense fallback={<LoadingScreen />}>
        <Room360 />
      </Suspense>

      <Timer />
      <HintButton />
      <Inventory />
      <Modal />
      <Leaderboard />
    </div>
  );
}

export default App;
