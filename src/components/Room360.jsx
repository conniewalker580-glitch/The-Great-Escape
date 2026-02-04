import { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';
import useGameStore, { roomConfigs } from '../store/gameStore';
import './Room360.css';

// Hotspot component positioned in 3D space with interactive effects
function Hotspot({
    hotspot,
    onCollect,
    isCollected,
    canInteract,
    isNextTarget
}) {
    const meshRef = useRef();
    const glowRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Determine hotspot color based on state
    const getHotspotColor = () => {
        if (isCollected) return '#22c55e'; // Green for collected
        if (!canInteract) return '#6b7280'; // Gray for locked
        if (isNextTarget) return '#fbbf24'; // Yellow for next target
        return '#8b5cf6'; // Purple for available
    };

    const pulseColor = getHotspotColor();
    const isInteractive = canInteract && !isCollected;

    useFrame((state) => {
        if (meshRef.current && isInteractive) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
            meshRef.current.scale.setScalar(scale);
        }
        if (glowRef.current && isInteractive) {
            glowRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
        }
    });

    const handleClick = (e) => {
        e.stopPropagation();
        if (isInteractive) {
            onCollect(hotspot);
        }
    };

    // Hide collected hotspots that are exits, show others as "completed"
    if (isCollected && hotspot.isExit) return null;

    return (
        <group position={hotspot.position}>
            {/* Outer glow ring */}
            {isInteractive && (
                <mesh ref={glowRef}>
                    <ringGeometry args={[0.5, 0.7, 32]} />
                    <meshBasicMaterial
                        color={pulseColor}
                        transparent
                        opacity={0.4}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {/* Main hotspot sphere */}
            <mesh
                ref={meshRef}
                onClick={handleClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[isInteractive ? 0.35 : 0.25, 16, 16]} />
                <meshBasicMaterial
                    color={pulseColor}
                    transparent
                    opacity={isCollected ? 0.4 : (hovered ? 1 : 0.8)}
                />
            </mesh>

            {/* Inner core */}
            {isInteractive && (
                <mesh>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
                </mesh>
            )}

            {/* Label */}
            <Html center distanceFactor={15}>
                <div
                    className={`hotspot-label ${isCollected ? 'collected' : ''} ${!canInteract ? 'locked' : ''} ${hovered && isInteractive ? 'hovered' : ''}`}
                    onClick={handleClick}
                    style={{
                        borderColor: pulseColor,
                        opacity: isCollected ? 0.6 : 1
                    }}
                >
                    <span className="hotspot-icon">{hotspot.icon}</span>
                    <div className="hotspot-info">
                        <span className="hotspot-text">{hotspot.label.split(' ').slice(1).join(' ')}</span>
                        {isCollected && <span className="collected-badge">✓ Collected</span>}
                        {!canInteract && !isCollected && <span className="locked-badge">🔒 Locked</span>}
                        {isNextTarget && canInteract && !isCollected && <span className="target-badge">👆 Click!</span>}
                    </div>
                </div>
            </Html>
        </group>
    );
}

// 360 Sphere with dynamic panoramic texture
function PanoramaSphere({ panoramaUrl }) {
    const texture = useLoader(THREE.TextureLoader, panoramaUrl, (tex) => {
        tex.mapping = THREE.EquirectangularReflectionMapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
    });

    return (
        <mesh scale={[-1, 1, 1]}>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
}

// Particle effect for atmosphere
function AtmosphereParticles({ color }) {
    const particlesRef = useRef();
    const count = 200;

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const seed = 42;
        const pseudoRandom = (n) => {
            const x = Math.sin(n) * 10000;
            return x - Math.floor(x);
        };

        for (let i = 0; i < count; i++) {
            const theta = pseudoRandom(i + seed) * Math.PI * 2;
            const phi = Math.acos(2 * pseudoRandom(i + seed + 0.1) - 1);
            const radius = 20 + pseudoRandom(i + seed + 0.2) * 40;
            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = radius * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
            particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.5}
                color={color || '#ffffff'}
                transparent
                opacity={0.4}
                sizeAttenuation
            />
        </points>
    );
}

// Scene with dynamic hotspots based on room configuration
function Scene({ roomConfig }) {
    const {
        collectHotspot,
        collectedItems,
        canInteractWithHotspot,
        updateGameState,
        setActiveModal
    } = useGameStore();

    const handleCollect = (hotspot) => {
        if (hotspot.isExit) {
            // Handle escape!
            updateGameState({ escaped: true });
            setActiveModal('escape-success');
            return;
        }

        if (hotspot.collectible && hotspot.itemName) {
            const item = {
                id: hotspot.id,
                name: hotspot.itemName,
                icon: hotspot.icon,
                description: hotspot.description
            };
            collectHotspot(hotspot.id, item);
            setActiveModal(`collected-${hotspot.id}`);
        } else {
            collectHotspot(hotspot.id, null);
        }
    };

    // Find the next target hotspot (first one that can be interacted with but hasn't been collected)
    const nextTarget = roomConfig.hotspots.find(h =>
        !collectedItems.includes(h.id) &&
        (!h.required || collectedItems.includes(h.required))
    );

    return (
        <>
            <PanoramaSphere panoramaUrl={roomConfig.panorama} />

            <AtmosphereParticles color={roomConfig.ambientColor} />

            {/* Render all hotspots from room config */}
            {roomConfig.hotspots.map((hotspot) => (
                <Hotspot
                    key={hotspot.id}
                    hotspot={hotspot}
                    onCollect={handleCollect}
                    isCollected={collectedItems.includes(hotspot.id)}
                    canInteract={canInteractWithHotspot(hotspot)}
                    isNextTarget={nextTarget?.id === hotspot.id}
                />
            ))}

            <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={10}
                maxDistance={100}
                rotateSpeed={-0.3}
                zoomSpeed={0.5}
                minPolarAngle={Math.PI * 0.15}
                maxPolarAngle={Math.PI * 0.85}
                dampingFactor={0.05}
                enableDamping
            />

            {/* Ambient lighting */}
            <ambientLight intensity={0.5} />
        </>
    );
}

// Loading fallback for the 3D scene
function SceneLoader() {
    return (
        <Html center>
            <div className="scene-loader">
                <div className="loader-spinner"></div>
                <p>Loading 360° Environment...</p>
            </div>
        </Html>
    );
}

const Room360 = ({ room }) => {
    const { startTimer, timerStarted, setCurrentRoom, currentRoom } = useGameStore();

    // Get room configuration
    const roomConfig = roomConfigs[room?.id] || roomConfigs[1];

    // Set current room in store if not already set
    useEffect(() => {
        if (room && (!currentRoom || currentRoom.id !== room.id)) {
            setCurrentRoom(room);
        }
    }, [room, currentRoom, setCurrentRoom]);

    const handleCanvasClick = () => {
        if (!timerStarted) {
            startTimer();
        }
    };

    return (
        <div className="room-360-container" onClick={handleCanvasClick}>
            <Canvas camera={{ fov: 75, position: [0, 0, 0.1] }}>
                <Suspense fallback={<SceneLoader />}>
                    <Scene roomConfig={roomConfig} />
                </Suspense>
            </Canvas>

            {/* Progress indicator */}
            <div className="room-progress">
                <ProgressTracker roomConfig={roomConfig} />
            </div>

            <div className="room-instructions">
                <p>🖱️ Drag to look around • 🔍 Scroll to zoom • 👆 Click glowing hotspots to collect items</p>
            </div>
        </div>
    );
};

// Progress tracker component
function ProgressTracker({ roomConfig }) {
    const { collectedItems } = useGameStore();
    const collectibleHotspots = roomConfig.hotspots.filter(h => h.collectible);
    const collected = collectibleHotspots.filter(h => collectedItems.includes(h.id)).length;
    const total = collectibleHotspots.length;

    return (
        <div className="progress-tracker">
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${(collected / total) * 100}%` }}
                />
            </div>
            <span className="progress-text">{collected} / {total} items found</span>
        </div>
    );
}

export default Room360;
