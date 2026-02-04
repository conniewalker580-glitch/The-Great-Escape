/**
 * VisualHotspot Component
 * Created by C.S. Walker
 * 
 * Interactive visual hotspots that are rendered as visible objects within the room scene.
 * Click detection is tied to visible elements rather than text.
 */

import { useState, useRef } from 'react';
import './VisualHotspot.css';

const VisualHotspot = ({
    hotspot,
    isCollected,
    isActive,
    onClick
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const hotspotRef = useRef(null);

    // Hide exit hotspots that have been activated (using completed game check instead)
    if (isCollected && hotspot.isExit) {
        return null;
    }

    const handleClick = (e) => {
        e.stopPropagation();
        onClick();
    };

    // Position styling - using percentages for hit areas to scale with background
    const positionStyle = {
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        width: `${hotspot.width || 60}px`,
        height: `${hotspot.height || 60}px`,
        backgroundColor: (isHovered && !isCollected) ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
    };

    return (
        <div
            ref={hotspotRef}
            className={`visual-hotspot ${isCollected ? 'visual-hotspot--collected' : 'visual-hotspot--hidden'} ${isActive ? 'visual-hotspot--shake' : ''}`}
            style={positionStyle}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
            aria-label={isCollected ? hotspot.label : "Hidden Area"}
        >
            {/* 
                Visual Highlights Removed: No Glow Ring, No Beacon, No Particles
                The user must discover this area by feeling around the room.
            */}

            {/* Main Icon Container - only visible after collection */}
            {isCollected && (
                <div className="visual-hotspot__icon-container discovered">
                    {hotspot.sprite ? (
                        <img
                            src={hotspot.sprite}
                            alt={hotspot.label}
                            className="visual-hotspot__sprite"
                            draggable={false}
                        />
                    ) : (
                        <span className="visual-hotspot__icon">{hotspot.icon}</span>
                    )}

                    <div className="visual-hotspot__collected-badge">
                        <span>✓</span>
                    </div>
                </div>
            )}

            {/* Hit area indicator (very subtle hover only) */}
            {!isCollected && isHovered && (
                <div className="visual-hotspot__discovery-hint" />
            )}
        </div>
    );
};

export default VisualHotspot;
