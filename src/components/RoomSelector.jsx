import { useState } from 'react';
import useGameStore from '../store/gameStore';
import AIImage from './AIImage';
import './RoomSelector.css';

const rooms = [
    {
        id: 1,
        name: "The Victorian Study",
        difficulty: "Easy",
        time: "15 min",
        description: "A classic escape room set in an old Victorian mansion. Find the hidden key and unlock the secrets within.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        color: "#8b5cf6"
    },
    {
        id: 2,
        name: "The Scientist's Lab",
        difficulty: "Medium",
        time: "20 min",
        description: "Dr. Frankenstein's laboratory holds dark secrets. Solve chemical puzzles to escape before the experiment goes wrong.",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
        color: "#06b6d4"
    },
    {
        id: 3,
        name: "Ancient Temple",
        difficulty: "Hard",
        time: "25 min",
        description: "Deep within an ancient temple lies untold treasure. Decode the hieroglyphics to find your way out.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
        color: "#f59e0b"
    },
    {
        id: 4,
        name: "Geometric Chamber",
        difficulty: "Special",
        time: "10 min",
        description: "A mysterious 3D environment where mathematical clues are hidden in the shadows.",
        image: "https://images.unsplash.com/photo-1511210141604-e362fa7ca123?w=800",
        color: "#10b981",
        viewMode: "3d"
    }
];

const RoomSelector = ({ onSelectRoom }) => {
    const [hoveredRoom, setHoveredRoom] = useState(null);
    const [aiTheme, setAiTheme] = useState('');
    const { generateDynamicRoom, isGenerating } = useGameStore();

    const handleGenerateAiRoom = async (e) => {
        e.preventDefault();
        if (!aiTheme.trim() || isGenerating) return;

        const room = await generateDynamicRoom(aiTheme);
        if (room) {
            onSelectRoom(room);
        } else {
            alert('Failed to generate room. Please check your API keys in the .env file.');
        }
    };

    return (
        <div className="room-selector">
            <header className="selector-header">
                <div className="logo">🔐</div>
                <h1>The Great Escape</h1>
                <p>Choose your adventure and test your puzzle-solving skills</p>
            </header>

            <div className="rooms-container">
                <h2 className="section-title">🚪 Select a Room</h2>

                <div className="rooms-grid">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className={`room-card ${hoveredRoom === room.id ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredRoom(room.id)}
                            onMouseLeave={() => setHoveredRoom(null)}
                            onClick={() => onSelectRoom(room)}
                            style={{ '--accent-color': room.color }}
                        >
                            <div className="room-card-image">
                                <AIImage
                                    prompt={`${room.name}: ${room.description}`}
                                    type="room"
                                    fallbackUrl={room.image}
                                    alt={room.name}
                                />
                                <div className="room-badge" style={{ backgroundColor: room.color }}>
                                    {room.difficulty}
                                </div>
                            </div>

                            <div className="room-info">
                                <div className="room-header">
                                    <h3>{room.name}</h3>
                                </div>

                                <p className="room-description">{room.description}</p>

                                <div className="room-meta">
                                    <span className="time-estimate">
                                        <span className="meta-icon">⏱️</span>
                                        {room.time}
                                    </span>
                                    <button className="enter-btn">
                                        Enter Room
                                        <span className="arrow">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="ai-generator-section">
                <div className="ai-generator-card">
                    <div className="ai-badge">AI POWERED</div>
                    <h2>✨ Generate Custom Room</h2>
                    <p>Describe any theme (e.g., "Underwater Bioshock Lab", "Cyberpunk Ramen Shop") and our AI will create a unique escape room just for you!</p>

                    <form onSubmit={handleGenerateAiRoom} className="ai-form">
                        <input
                            type="text"
                            placeholder="Describe your escape room theme..."
                            value={aiTheme}
                            onChange={(e) => setAiTheme(e.target.value)}
                            disabled={isGenerating}
                            className="ai-input"
                        />
                        <button type="submit" className="ai-generate-btn" disabled={isGenerating}>
                            {isGenerating ? (
                                <>
                                    <span className="ai-spinner">⭐</span>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <span className="ai-icon">🚀</span>
                                    Generate & Enter
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <section className="how-to-play">
                <h2>🎮 How to Play</h2>
                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Look Around</h3>
                        <p>Drag your mouse or finger to explore the 360° room</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Find Clues</h3>
                        <p>Click on highlighted objects to discover hidden items</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Solve Puzzles</h3>
                        <p>Use items from your inventory to unlock new areas</p>
                    </div>
                    <div className="step">
                        <div className="step-number">4</div>
                        <h3>Escape!</h3>
                        <p>Find the exit and escape as fast as you can</p>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2>✨ Features</h2>
                <div className="features-grid">
                    <div className="feature">
                        <span className="feature-icon">🌐</span>
                        <h3>360° Immersion</h3>
                        <p>Fully immersive panoramic rooms</p>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">🏆</span>
                        <h3>Leaderboard</h3>
                        <p>Compete for the fastest escape time</p>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">💡</span>
                        <h3>Hint System</h3>
                        <p>Stuck? Get progressive hints</p>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">📱</span>
                        <h3>Mobile Ready</h3>
                        <p>Play on any device</p>
                    </div>
                </div>
            </section>

            <footer className="selector-footer">
                <p>© 2024 The Great Escape. Built with ❤️ using React & Three.js</p>
            </footer>
        </div>
    );
};

export default RoomSelector;
