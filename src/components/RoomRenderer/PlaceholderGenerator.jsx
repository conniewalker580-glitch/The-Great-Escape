/**
 * PlaceholderGenerator Component
 * Created by C.S. Walker
 * 
 * Generates a temporary visual placeholder when a room background is not available.
 * Creates a dynamic, themed visual based on the room's atmosphere and name.
 */

import { useMemo } from 'react';
import './PlaceholderGenerator.css';

// Atmosphere-based color schemes and patterns
const atmosphereThemes = {
    dark: {
        primary: '#2a1810',
        secondary: '#4a3020',
        accent: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #1a0f0a 0%, #2a1810 50%, #1e1e2e 100%)',
        pattern: 'victorian',
        icons: ['📚', '🕯️', '🖼️', '⚰️', '🗝️', '🦇']
    },
    neon: {
        primary: '#0a1628',
        secondary: '#1e3a5f',
        accent: '#06b6d4',
        gradient: 'linear-gradient(135deg, #0d0d1a 0%, #0a1628 50%, #161b33 100%)',
        pattern: 'circuit',
        icons: ['🔬', '⚗️', '⚡', '🧪', '💻', '🔋']
    },
    warm: {
        primary: '#1a1206',
        secondary: '#3d2a0f',
        accent: '#f59e0b',
        gradient: 'linear-gradient(135deg, #0f0a04 0%, #1a1206 50%, #2a1a0a 100%)',
        pattern: 'hieroglyph',
        icons: ['📜', '🗿', '🔥', '⚱️', '🏛️', '💎']
    },
    space: {
        primary: '#0d0d1a',
        secondary: '#161b33',
        accent: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #000010 0%, #0d0d1a 50%, #1a1a2e 100%)',
        pattern: 'stars',
        icons: ['🛸', '🌟', '🚀', '💫', '🔭', '☄️']
    }
};

const PlaceholderGenerator = ({ roomName, atmosphere = 'dark' }) => {
    const theme = atmosphereThemes[atmosphere] || atmosphereThemes.dark;

    // Generate random star positions for space theme
    const stars = useMemo(() => {
        if (atmosphere !== 'space') return [];
        return [...Array(100)].map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            delay: Math.random() * 3,
            duration: Math.random() * 2 + 1
        }));
    }, [atmosphere]);

    // Generate floating icons
    const floatingIcons = useMemo(() => {
        return theme.icons.map((icon, i) => ({
            icon,
            x: 10 + (i * 15) + Math.random() * 10,
            y: 20 + Math.random() * 60,
            delay: i * 0.5,
            scale: 0.8 + Math.random() * 0.5
        }));
    }, [theme.icons]);

    return (
        <div
            className={`placeholder-generator placeholder-generator--${atmosphere}`}
            style={{ background: theme.gradient }}
        >
            {/* Pattern Overlay */}
            <div className={`placeholder-generator__pattern placeholder-generator__pattern--${theme.pattern}`} />

            {/* Stars for Space Theme */}
            {atmosphere === 'space' && (
                <div className="placeholder-generator__stars">
                    {stars.map(star => (
                        <div
                            key={star.id}
                            className="placeholder-generator__star"
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                animationDelay: `${star.delay}s`,
                                animationDuration: `${star.duration}s`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Floating Ambient Icons */}
            <div className="placeholder-generator__icons">
                {floatingIcons.map((item, index) => (
                    <div
                        key={index}
                        className="placeholder-generator__floating-icon"
                        style={{
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                            animationDelay: `${item.delay}s`,
                            transform: `scale(${item.scale})`,
                            '--accent': theme.accent
                        }}
                    >
                        {item.icon}
                    </div>
                ))}
            </div>

            {/* Center Room Title */}
            <div className="placeholder-generator__center">
                <div className="placeholder-generator__room-icon">🔒</div>
                <h2 className="placeholder-generator__room-name">{roomName}</h2>
                <p className="placeholder-generator__message">Visual assets loading...</p>

                {/* Loading animation */}
                <div className="placeholder-generator__loader">
                    <div className="placeholder-generator__loader-bar" style={{ background: theme.accent }} />
                </div>
            </div>

            {/* Vignette Effect */}
            <div className="placeholder-generator__vignette" />

            {/* Grid Lines for Neon Theme */}
            {atmosphere === 'neon' && (
                <div className="placeholder-generator__grid">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="placeholder-generator__grid-line"
                            style={{ left: `${i * 5}%` }}
                        />
                    ))}
                </div>
            )}

            {/* Particle Effects */}
            <div className="placeholder-generator__particles">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="placeholder-generator__particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            '--particle-color': theme.accent
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default PlaceholderGenerator;
