import { useState, useEffect } from 'react';
import { getLeaderboard, addScore } from '../firebase';
import useGameStore from '../store/gameStore';
import './Leaderboard.css';

const Leaderboard = () => {
    const [scores, setScores] = useState([]);
    const [nickname, setNickname] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const { elapsedTime, gameState, resetGame } = useGameStore();

    const fetchLeaderboard = async () => {
        const data = await getLeaderboard();
        setScores(data);
    };

    useEffect(() => {
        if (gameState.escaped) {
            getLeaderboard().then(data => {
                setScores(data);
            });
        }
    }, [gameState.escaped]);

    const handleSubmit = async () => {
        if (submitted) return;
        setLoading(true);
        await addScore(nickname || 'Anonymous', elapsedTime);
        setSubmitted(true);
        await fetchLeaderboard();
        setLoading(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!gameState.escaped) return null;

    return (
        <div className="leaderboard-overlay">
            <div className="leaderboard-modal">
                <div className="escape-celebration">
                    <div className="confetti"></div>
                    <h1>🎉 You Escaped! 🎉</h1>
                    <div className="final-time">
                        <span className="time-label">Your Time</span>
                        <span className="time-value">{formatTime(elapsedTime)}</span>
                    </div>
                </div>

                {!submitted ? (
                    <div className="submit-score">
                        <input
                            type="text"
                            placeholder="Enter nickname..."
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            maxLength={20}
                        />
                        <button onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Score'}
                        </button>
                    </div>
                ) : (
                    <p className="submitted-msg">Score submitted!</p>
                )}

                <div className="leaderboard-list">
                    <h2>🏆 Top 10 Escapees</h2>
                    {scores.length === 0 ? (
                        <p className="no-scores">No scores yet. Be the first!</p>
                    ) : (
                        <ul>
                            {scores.map((score, index) => (
                                <li key={score.id} className={`rank-${index + 1}`}>
                                    <span className="rank">{index + 1}</span>
                                    <span className="name">{score.nickname}</span>
                                    <span className="time">{formatTime(score.time)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button className="play-again-btn" onClick={resetGame}>
                    🔄 Play Again
                </button>
            </div>
        </div>
    );
};

export default Leaderboard;
