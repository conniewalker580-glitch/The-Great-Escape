import { useState } from 'react';
import useGameStore from '../store/gameStore';
import './HintButton.css';

const HintButton = () => {
    const [showHint, setShowHint] = useState(false);
    const { hintsUsed, useHint, getCurrentHint, gameState } = useGameStore();

    const handleHintClick = () => {
        if (!showHint) {
            useHint();
        }
        setShowHint(!showHint);
    };

    if (gameState.escaped) return null;

    return (
        <div className="hint-container">
            <button className="hint-button" onClick={handleHintClick}>
                <span className="hint-icon">💡</span>
                <span className="hint-text">Hint</span>
                <span className="hint-count">{3 - hintsUsed} left</span>
            </button>

            {showHint && (
                <div className="hint-popup">
                    <div className="hint-content">
                        <button className="hint-close" onClick={() => setShowHint(false)}>✕</button>
                        <div className="hint-level">Hint Level {hintsUsed}/3</div>
                        <p className="hint-message">{getCurrentHint()}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HintButton;
