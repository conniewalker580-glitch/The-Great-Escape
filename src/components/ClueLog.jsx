/**
 * ClueLog Component
 * Created by C.S. Walker
 * 
 * A side/bottom panel that stores all discovered clues in the room.
 * Helps players track information needed to solve the quiz.
 */

import { useState } from 'react';
import useGameStore from '../store/gameStore';
import './ClueLog.css';

const ClueLog = () => {
    const { foundClues, currentRoom } = useGameStore();
    const [isExpanded, setIsExpanded] = useState(false);

    if (!currentRoom) return null;

    return (
        <div className={`clue-log ${isExpanded ? 'expanded' : ''} ${foundClues.length > 0 ? 'has-clues' : ''}`}>
            <div
                className="clue-log__header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="header-left">
                    <span className="log-icon">📓</span>
                    <span className="log-title">CLUE LOG</span>
                    <span className="clue-count">{foundClues.length}</span>
                </div>
                <div className="header-right">
                    <span className="expand-hint">{isExpanded ? 'CLOSE' : 'OPEN'}</span>
                    <button className="expand-toggle">
                        {isExpanded ? '▼' : '▲'}
                    </button>
                </div>
            </div>

            <div className="clue-log__content">
                {foundClues.length === 0 ? (
                    <div className="clue-log__empty">
                        <div className="empty-visual">📍</div>
                        <p>No clues discovered yet. Explore the room and interact with objects.</p>
                    </div>
                ) : (
                    <div className="clue-log__list">
                        {foundClues.map((clue, index) => (
                            <div key={index} className="clue-entry">
                                <div className="clue-entry__marker">0{index + 1}</div>
                                <div className="clue-entry__body">
                                    <p className="clue-entry__text">{clue}</p>
                                    <div className="clue-entry__footer">
                                        <span className="clue-entry__timestamp">Recovered from {currentRoom.name}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Notification hint when new clue is found but log is closed */}
            {!isExpanded && foundClues.length > 0 && (
                <div className="clue-log__notification">
                    New clue logged. Click to review.
                </div>
            )}
        </div>
    );
};

export default ClueLog;
