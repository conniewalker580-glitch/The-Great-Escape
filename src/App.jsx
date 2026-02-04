/**
 * The Great Escape - Main Application
 * Created by C.S. Walker
 * 
 * A fully visual escape room game with interactive hotspots,
 * 2D room backgrounds, and immersive puzzle-solving experience.
 */

import { useEffect, useState, Suspense } from 'react';
import RoomSelector from './components/RoomSelector';
import { RoomRenderer } from './components/RoomRenderer';
import Room360 from './components/Room360';
import Timer from './components/Timer';
import ClueLog from './components/ClueLog';
import Modal from './components/Modal';
import HintButton from './components/HintButton';
import Leaderboard from './components/Leaderboard';
import { signInAnonymousUser } from './firebase';
import useGameStore from './store/gameStore';
import './App.css';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-icon">🔍</div>
        <h1>The Great Escape</h1>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
        <p>Loading adventure...</p>
      </div>
    </div>
  );
}

function GameView({ selectedRoom, onBackToMenu, viewMode }) {
  const { resetGame } = useGameStore();

  const handleBackToMenu = () => {
    resetGame();
    onBackToMenu();
  };

  return (
    <div className="game-view">
      <button className="back-btn" onClick={handleBackToMenu}>
        ← Back to Rooms
      </button>

      {/* Visual Room Renderer (2D) - Primary Quiz Mode */}
      <Suspense fallback={<LoadingScreen />}>
        {viewMode === '2d' ? (
          <RoomRenderer room={selectedRoom} />
        ) : (
          <Room360 room={selectedRoom} />
        )}
      </Suspense>

      <Timer />
      <HintButton />
      <ClueLog />
      <Modal />
      <Leaderboard />
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState('selector');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [viewMode, setViewMode] = useState('2d');

  useEffect(() => {
    signInAnonymousUser();
  }, []);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setCurrentView('game');
  };

  const handleBackToMenu = () => {
    setSelectedRoom(null);
    setCurrentView('selector');
  };

  return (
    <div className="app">
      {currentView === 'selector' ? (
        <RoomSelector onSelectRoom={handleSelectRoom} />
      ) : (
        <GameView
          selectedRoom={selectedRoom}
          onBackToMenu={handleBackToMenu}
          viewMode={viewMode}
        />
      )}
    </div>
  );
}

export default App;
