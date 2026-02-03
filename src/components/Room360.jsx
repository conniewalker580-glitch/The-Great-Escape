import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import useGameStore from '../store/gameStore';
import './Room360.css';

// Hotspot component positioned in 3D space
function Hotspot({ position, label, onClick, visible = true, pulseColor = '#8b5cf6' }) {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
        }
    });

    if (!visible) return null;

    return (
        <group position={position}>
            <mesh ref={meshRef} onClick={onClick}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial color={pulseColor} transparent opacity={0.7} />
            </mesh>
            <Html center distanceFactor={15}>
                <div className="hotspot-label" onClick={onClick}>
                    <span className="hotspot-icon">👆</span>
                    <span className="hotspot-text">{label}</span>
                </div>
            </Html>
        </group>
    );
}

// 360 Sphere with panoramic texture
function PanoramaSphere() {
    // Using a placeholder panorama - you can replace with your own
    const texture = useTexture('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=4096');

    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    return (
        <mesh scale={[-1, 1, 1]}>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
}

// Scene with hotspots
function Scene() {
    const { setActiveModal, gameState, selectedItem } = useGameStore();

    const handleHotspotClick = (hotspotId) => {
        setActiveModal(hotspotId);
    };

    return (
        <>
            <PanoramaSphere />

            {/* Book hotspot - always visible */}
            <Hotspot
                position={[-8, 0, -5]}
                label="📚 Book"
                onClick={() => handleHotspotClick('book')}
                pulseColor={gameState.hasKey ? '#4ade80' : '#8b5cf6'}
            />

            {/* Vase hotspot - always visible */}
            <Hotspot
                position={[6, -2, -7]}
                label="🏺 Vase"
                onClick={() => handleHotspotClick('vase')}
                pulseColor={gameState.drawerOpened ? '#4ade80' : (gameState.hasKey ? '#fbbf24' : '#8b5cf6')}
            />

            {/* Painting hotspot - always visible but highlighted after getting note */}
            <Hotspot
                position={[0, 3, -8]}
                label="🖼️ Painting"
                onClick={() => handleHotspotClick('painting')}
                pulseColor={gameState.safeOpened ? '#4ade80' : (gameState.hasNote ? '#fbbf24' : '#8b5cf6')}
            />

            {/* Door hotspot - appears after getting exit key */}
            <Hotspot
                position={[10, 0, 3]}
                label="🚪 Exit Door"
                onClick={() => handleHotspotClick('door')}
                visible={gameState.hasExitKey}
                pulseColor="#10b981"
            />

            <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={10}
                maxDistance={100}
                rotateSpeed={-0.3}
                zoomSpeed={0.5}
                minPolarAngle={Math.PI * 0.25}
                maxPolarAngle={Math.PI * 0.75}
            />
        </>
    );
}

const Room360 = () => {
    const { startTimer, timerStarted } = useGameStore();

    const handleCanvasClick = () => {
        if (!timerStarted) {
            startTimer();
        }
    };

    return (
        <div className="room-360-container" onClick={handleCanvasClick}>
            <Canvas camera={{ fov: 75, position: [0, 0, 0.1] }}>
                <Scene />
            </Canvas>

            <div className="room-instructions">
                <p>🖱️ Drag to look around • 🔍 Scroll to zoom • 👆 Click hotspots to interact</p>
            </div>
        </div>
    );
};

export default Room360;
