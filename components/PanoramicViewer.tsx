import React, { useState, useRef, useEffect, useTransition } from 'react';
import { motion } from 'framer-motion';


interface PanoramicViewerProps {
    imageUrl: string;
    hotspots?: Array<{
        id: string;
        angle: number; // 0-360 degrees
        elevation: number; // -90 to 90 degrees (vertical position)
        label: string;
        onClick: () => void;
        isSubtle?: boolean;
        isDiscovered?: boolean;
    }>;
    effects?: {
        fog?: boolean;
        particles?: 'dust' | 'stars' | 'sparks' | 'snow';
        lighting?: 'dim' | 'flickering' | 'bright' | 'neon';
    };
}

export function PanoramicViewer({ imageUrl, hotspots = [], effects }: PanoramicViewerProps) {
    const [rotation, setRotation] = useState(0); // Current view angle
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startRotation, setStartRotation] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [flickerDelay, setFlickerDelay] = useState(0);
    const [, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {
            setFlickerDelay(Math.random() * 10);
        });
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.clientX);
        setStartRotation(rotation);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const rotationDelta = deltaX * 0.5; // Sensitivity factor
        const newRotation = (startRotation + rotationDelta) % 360;
        setRotation(newRotation < 0 ? newRotation + 360 : newRotation);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        setStartRotation(rotation);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;

        const deltaX = e.touches[0].clientX - startX;
        const rotationDelta = deltaX * 0.5;
        const newRotation = (startRotation + rotationDelta) % 360;
        setRotation(newRotation < 0 ? newRotation + 360 : newRotation);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Calculate hotspot position based on current rotation
    const getHotspotPosition = (angle: number, elevation: number) => {
        const relativeAngle = (angle - rotation + 360) % 360;

        // Only show hotspots within ~120 degree field of view
        if (relativeAngle > 60 && relativeAngle < 300) {
            return null; // Hotspot is behind the camera
        }

        // Map angle to screen position (-60 to 60 degrees visible)
        const normalizedAngle = relativeAngle > 180 ? relativeAngle - 360 : relativeAngle;
        const x = 50 + (normalizedAngle / 60) * 40; // Center ± 40%
        const y = 50 - (elevation / 90) * 40; // Map elevation to vertical position

        return { x, y };
    };

    // Particle Rendering
    const renderParticles = () => {
        if (!effects?.particles) return null;

        const count = effects.particles === 'stars' ? 50 : 30;
        return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden origin-center">
                {[...Array(count)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute rounded-full ${effects.particles === 'stars' ? 'bg-white' :
                            effects.particles === 'sparks' ? 'bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.8)]' :
                                effects.particles === 'snow' ? 'bg-white/80' : 'bg-zinc-400/20'
                            }`}
                        style={{
                            width: Math.random() * (effects.particles === 'stars' ? 2 : 4) + 1,
                            height: Math.random() * (effects.particles === 'stars' ? 2 : 4) + 1,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={
                            effects.particles === 'snow' ? {
                                y: [0, 1000],
                                x: [0, (Math.random() - 0.5) * 50]
                            } : effects.particles === 'stars' ? {
                                opacity: [0.2, 1, 0.2],
                                scale: [1, 1.2, 1]
                            } : {
                                x: [0, (Math.random() - 0.5) * 100],
                                y: [0, (Math.random() - 0.5) * 100],
                                opacity: [0.1, 0.5, 0.1]
                            }
                        }
                        transition={{
                            duration: effects.particles === 'snow' ? 5 + Math.random() * 5 : 3 + Math.random() * 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none ${effects?.lighting === 'dim' ? 'brightness-75 contrast-125' : ''
                }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Panoramic Image */}
            <div
                className="absolute inset-0 transition-transform duration-100"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: `${(rotation / 360) * 100}% center`,
                    backgroundRepeat: 'repeat-x',
                }}
            />

            {/* Atmosphere Overlays */}
            {effects?.lighting === 'flickering' && (
                <motion.div
                    className="absolute inset-0 bg-black/10 pointer-events-none z-10"
                    animate={{ opacity: [0, 0.3, 0.1, 0.4, 0] }}
                    transition={{ duration: 0.2, repeat: Infinity, repeatDelay: flickerDelay }}
                />
            )}
            {effects?.lighting === 'neon' && (
                <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none z-10 shadow-[inset_0_0_100px_rgba(6,182,212,0.2)]" />
            )}
            {effects?.fog && (
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none z-10 backdrop-blur-[1px]" />
            )}

            {/* Particle System */}
            {renderParticles()}

            {/* Hotspots */}
            <div className="absolute inset-0 pointer-events-none z-20">
                {hotspots.map((hotspot) => {
                    const position = getHotspotPosition(hotspot.angle, hotspot.elevation);
                    if (!position) return null;

                    const isSubtle = hotspot.isSubtle !== false;
                    const isDiscovered = hotspot.isDiscovered || false;

                    return (
                        <motion.button
                            key={hotspot.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: isSubtle && !isDiscovered ? 0.3 : 1,
                            }}
                            whileHover={{ scale: 1.2, opacity: 1 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                hotspot.onClick();
                            }}
                            className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center pointer-events-auto group/hs"
                            style={{ left: `${position.x}%`, top: `${position.y}%` }}
                        >
                            {(!isSubtle || isDiscovered) && (
                                <div className="absolute inset-0 bg-cyan-500/30 rounded-full animate-ping" />
                            )}
                            <div
                                className={`relative w-3 h-3 rounded-full border-2 border-white shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all ${isSubtle && !isDiscovered ? 'bg-white/20' : 'bg-cyan-400 group-hover/hs:bg-white group-hover/hs:shadow-[0_0_20px_rgba(255,255,255,1)]'
                                    }`}
                            />

                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] text-cyan-100 whitespace-nowrap opacity-0 group-hover/hs:opacity-100 transition-opacity border border-white/10 uppercase tracking-widest pointer-events-none">
                                {hotspot.label}
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Navigation Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs text-cyan-400 pointer-events-none z-30">
                <span className="opacity-70">← Drag to look around →</span>
            </div>

            {/* Compass Indicator */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-2 rounded-full text-xs text-cyan-400 font-mono z-30">
                {Math.round(rotation)}°
            </div>
        </div>
    );
}
