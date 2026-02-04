/**
 * ObjectiveBanner Component
 * Created by C.S. Walker
 * 
 * Displays the room question/objective at the top of the screen upon room entry.
 * Provides clear guidance on what the player needs to accomplish.
 */

import { useState, useEffect } from 'react';
import './ObjectiveBanner.css';

const ObjectiveBanner = ({ objective, roomName }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    // Auto-collapse after 5 seconds of inactivity
    useEffect(() => {
        const collapseTimer = setTimeout(() => {
            setIsExpanded(false);
        }, 8000);

        return () => clearTimeout(collapseTimer);
    }, [objective]);

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

                <button
                    className="objective-banner__toggle"
                    aria-label={isExpanded ? 'Collapse objective' : 'Expand objective'}
                >
                    <span className={`objective-banner__toggle-icon ${isExpanded ? 'open' : ''}`}>
                        ▼
                    </span>
                </button>
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
