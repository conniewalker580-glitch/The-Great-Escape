import { useEffect, useState, Suspense } from 'react';
import RoomSelector from './components/RoomSelector';
import Room360 from './components/Room360';
import Timer from './components/Timer';
import Inventory from './components/Inventory';
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

function GameView({ selectedRoom, onBackToMenu }) {
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

      <div className="room-title">
        <span className="room-name">{selectedRoom.name}</span>
        <span
          className="room-difficulty"
          style={{ background: selectedRoom.color }}
        >
          {selectedRoom.difficulty}
        </span>
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

function App() {
  const [currentView, setCurrentView] = useState('selector'); // 'selector' or 'game'
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    // Initialize anonymous auth
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
        />
      )}
    </div>
  );
}

export default App;
