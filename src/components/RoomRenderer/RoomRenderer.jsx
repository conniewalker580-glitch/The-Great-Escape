/**
 * RoomRenderer Component
 * Created by C.S. Walker
 * 
 * A fully visual room system that displays 2D virtual background scenes
 * with interactive hotspots, objectives, and visual placeholder support.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import useGameStore, { roomConfigs } from '../../store/gameStore';
import VisualHotspot from './VisualHotspot';
import ObjectiveBanner from './ObjectiveBanner';
import PlaceholderGenerator from './PlaceholderGenerator';
import QuizPanel from './QuizPanel';
import './RoomRenderer.css';

const RoomRenderer = ({ room }) => {
    const {
        collectHotspot,
        collectedItems,
        startTimer,
        timerStarted,
        setCurrentRoom,
        currentRoom,
        setActiveModal,
        updateGameState,
        gameState
    } = useGameStore();

    const containerRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [activeHotspot, setActiveHotspot] = useState(null);
    const [showInstructions, setShowInstructions] = useState(true);

    // Get room configuration from centralized store
    const roomConfig = roomConfigs[room?.id] || null;

    // Set current room when component mounts
    useEffect(() => {
        if (room && (!currentRoom || currentRoom.id !== room.id)) {
            setCurrentRoom(room);
        }
    }, [room, currentRoom, setCurrentRoom]);

    // Hide instructions after first interaction
    useEffect(() => {
        if (timerStarted) {
            const timer = setTimeout(() => setShowInstructions(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [timerStarted]);

    // Handle canvas click to start timer
    const handleContainerClick = useCallback(() => {
        if (!timerStarted) {
            startTimer();
        }
    }, [timerStarted, startTimer]);

    // Handle hotspot click to find clues
    const handleHotspotClick = useCallback((hotspot) => {
        if (!timerStarted) {
            startTimer();
        }

        // Check if hotspot can be interacted with (optional sequence)
        const canInteract = !hotspot.required || collectedItems.includes(hotspot.required);

        if (!canInteract) {
            setActiveHotspot(hotspot.id);
            setTimeout(() => setActiveHotspot(null), 500);
            return;
        }

        // Logic for Misleading Objects
        if (hotspot.isMisleading) {
            setActiveHotspot(hotspot.id);
            setActiveModal(`misleading-${hotspot.id}`);
            setTimeout(() => setActiveHotspot(null), 1000);
            return;
        }

        if (collectedItems.includes(hotspot.id)) {
            // Re-show the clue modal if already collected
            setActiveModal(`clue-${hotspot.id}`);
            return;
        }

        // Collect Clue
        if (hotspot.clue) {
            collectHotspot(hotspot.id, hotspot.clue);
            setActiveModal(`clue-${hotspot.id}`);
        } else {
            collectHotspot(hotspot.id, null);
        }
    }, [timerStarted, startTimer, collectedItems, collectHotspot, setActiveModal]);

    // Handle image load success
    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
        setImageError(false);
    }, []);

    // Handle image load error
    const handleImageError = useCallback(() => {
        setImageLoaded(false);
        setImageError(true);
    }, []);

    // Progress calculation
    const usefulHotspots = roomConfig?.hotspots.filter(h => !h.isMisleading && h.clue) || [];
    const collectedCount = usefulHotspots.filter(h => collectedItems.includes(h.id)).length;
    const totalCount = usefulHotspots.length;

    if (!roomConfig) {
        return (
            <div className="room-renderer room-renderer--loading">
                <div className="room-renderer__loading-content">
                    <div className="room-renderer__loading-icon">🔍</div>
                    <p>Scanning environment...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`room-renderer room-renderer--${roomConfig.atmosphere} ${gameState.lastAnswerCorrect ? 'unlocked' : ''}`}
            onClick={handleContainerClick}
        >
            {/* Question displayed at top via ObjectiveBanner */}
            <ObjectiveBanner
                objective={roomConfig.objective}
                roomName={roomConfig.name}
            />

            {/* Background Image Layer */}
            <div className="room-renderer__background">
                {!imageError ? (
                    <img
                        src={roomConfig.background}
                        alt={roomConfig.name}
                        className={`room-renderer__image ${imageLoaded ? 'loaded' : ''}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        draggable={false}
                    />
                ) : (
                    <PlaceholderGenerator
                        roomName={roomConfig.name}
                        atmosphere={roomConfig.atmosphere}
                    />
                )}

                {/* Atmosphere FX */}
                <div className={`room-renderer__atmosphere room-renderer__atmosphere--${roomConfig.atmosphere}`} />
            </div>

            {/* Hidden Visual Hotspots Layer */}
            <div className="room-renderer__hotspots">
                {roomConfig.hotspots.map((hotspot) => {
                    const isCollected = collectedItems.includes(hotspot.id);
                    const canInteract = !hotspot.required || collectedItems.includes(hotspot.required);
                    const isActive = activeHotspot === hotspot.id;

                    return (
                        <VisualHotspot
                            key={hotspot.id}
                            hotspot={hotspot}
                            isCollected={isCollected}
                            canInteract={canInteract}
                            isActive={isActive}
                            onClick={() => handleHotspotClick(hotspot)}
                        />
                    );
                })}
            </div>

            {/* Quiz Panel - The central puzzle interaction */}
            <QuizPanel />

            {/* Stealth HUD: Only shows count, no guidance bar */}
            <div className="room-renderer__hud">
                <span className="clue-tracker">
                    <span className="clue-tracker__icon">🔎</span>
                    DISCOVERIES: {collectedCount} / {totalCount}
                </span>
            </div>

            {/* Brief Instructions */}
            {showInstructions && (
                <div className="room-renderer__instructions">
                    <p>
                        <span className="instruction-icon">🕵️</span>
                        Search the room visuals for clues
                        <span className="instruction-separator">•</span>
                        <span className="instruction-icon">🔒</span>
                        The correct answer unlocks the way
                    </p>
                </div>
            )}
        </div>
    );
};

export default RoomRenderer;
