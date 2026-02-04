/**
 * ObjectiveBanner Component
 * Created by C.S. Walker
 * 
 * Displays the room question/objective at the top of the screen upon room entry.
 * Provides clear guidance on what the player needs to accomplish.
 */

import { useState, useEffect } from 'react';
import aiService from '../../services/aiService';
import './ObjectiveBanner.css';

const ObjectiveBanner = ({ objective, roomName }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    // Narrate objective when it changes
    useEffect(() => {
        if (!isMuted && objective) {
            // Short delay to allow visual transition
            const speakTimer = setTimeout(() => {
                aiService.speak(objective);
            }, 500);
            return () => clearTimeout(speakTimer);
        }
    }, [objective, isMuted]);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`objective-banner ${isExpanded ? 'expanded' : 'collapsed'}`}>
            {/* Banner Header - Always Visible */}
            <div className="objective-banner__header" onClick={handleToggle}>
                <div className="objective-banner__icon-container">
                    <span className="objective-banner__icon">🎯</span>
                    <span className="objective-banner__pulse" />
                </div>

                <div className="objective-banner__title-container">
                    <h2 className="objective-banner__title">Mission Objective</h2>
                    <span className="objective-banner__room-name">{roomName}</span>
                </div>

                <div className="objective-banner__controls">
                    <button
                        className={`objective-banner__mute ${isMuted ? 'muted' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMuted(!isMuted);
                            if (!isMuted) window.speechSynthesis.cancel();
                        }}
                        aria-label={isMuted ? 'Unmute narration' : 'Mute narration'}
                    >
                        {isMuted ? '🔇' : '🔊'}
                    </button>

                    <button
                        className="objective-banner__toggle"
                        aria-label={isExpanded ? 'Collapse objective' : 'Expand objective'}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggle();
                        }}
                    >
                        <span className={`objective-banner__toggle-icon ${isExpanded ? 'open' : ''}`}>
                            ▼
                        </span>
                    </button>
                </div>
            </div>

            {/* Objective Content - Expandable */}
            <div className="objective-banner__content">
                <div className="objective-banner__text-container">
                    <p className="objective-banner__text">{objective}</p>
                </div>

                {/* Quick Tips */}
                <div className="objective-banner__tips">
                    <div className="objective-banner__tip">
                        <span className="tip-icon">💡</span>
                        <span>Look for glowing objects</span>
                    </div>
                    <div className="objective-banner__tip">
                        <span className="tip-icon">🔓</span>
                        <span>Unlock items in sequence</span>
                    </div>
                    <div className="objective-banner__tip">
                        <span className="tip-icon">⏱️</span>
                        <span>Time is ticking!</span>
                    </div>
                </div>
            </div>

            {/* Decorative Border Animation */}
            <div className="objective-banner__border-glow" />
        </div>
    );
};

export default ObjectiveBanner;
