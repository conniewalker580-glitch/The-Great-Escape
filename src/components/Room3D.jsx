import { useRef, useEffect, useState, memo } from 'react';
import * as THREE from 'three';
import useGameStore from '../store/gameStore';
import aiService from '../services/aiService';
import ObjectiveBanner from './RoomRenderer/ObjectiveBanner';
import QuizPanel from './RoomRenderer/QuizPanel';
import './Room3D.css';

const Room3D = ({ room }) => {
    const containerRef = useRef();
    const { collectHotspot, startTimer, timerStarted, setActiveModal, currentRoom } = useGameStore();
    const [textures, setTextures] = useState({
        walls: null,
        floor: null,
        object: null
    });

    // Fetch textures from Hugging Face
    useEffect(() => {
        const fetchTextures = async () => {
            try {
                // Background image from room config acts as the base prompt
                const basePrompt = room.background || "dark stone wall";
                const wallTex = await aiService.generateVisual(`${basePrompt}, high detail stone texture, seamless`, "item");
                const floorTex = await aiService.generateVisual("worn concrete industrial floor, dusty, seamless", "item");
                const objectTex = await aiService.generateVisual("cryptic mathematical pi symbol carved in stone, ancient", "item");

                setTextures({
                    walls: wallTex,
                    floor: floorTex,
                    object: objectTex
                });
            } catch (err) {
                console.error("Failed to fetch HF textures:", err);
            }
        };
        fetchTextures();
    }, [room.background]);

    useEffect(() => {
        if (!containerRef.current) return;

        // SCENE SETUP
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050505);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1.6, 4);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);

        // LIGHTING
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1.5, 20);
        pointLight.position.set(0, 3, 2);
        scene.add(pointLight);

        // MATERIALS
        const texLoader = new THREE.TextureLoader();
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0x444444,
            side: THREE.BackSide,
            map: textures.walls ? texLoader.load(textures.walls) : null
        });
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x333333,
            map: textures.floor ? texLoader.load(textures.floor) : null
        });

        // ROOM GEOMETRY
        const roomBox = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 12), wallMat);
        roomBox.position.y = 3;
        scene.add(roomBox);

        const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), floorMat);
        floor.rotation.x = -Math.PI / 2;
        scene.add(floor);

        // DECORATIVE OBJECT
        const objGeo = new THREE.PlaneGeometry(3, 3);
        const objMat = new THREE.MeshStandardMaterial({
            transparent: true,
            map: textures.object ? texLoader.load(textures.object) : null,
            color: textures.object ? 0xffffff : 0x222222
        });
        const wallObj = new THREE.Mesh(objGeo, objMat);
        wallObj.position.set(0, 2.5, -5.9);
        scene.add(wallObj);

        // HOTSPOTS
        const hotspots = [];
        room.hotspots?.forEach((hs) => {
            const spot = new THREE.Mesh(
                new THREE.SphereGeometry(0.5),
                new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
            );
            spot.position.set(...hs.position);
            spot.userData = { hsId: hs.id, clue: hs.clue };
            hotspots.push(spot);
            scene.add(spot);
        });

        // INTERACTION
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const handleClick = (e) => {
            if (e.target.closest('.objective-banner') || e.target.closest('.quiz-panel') || e.target.closest('.back-btn')) return;

            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(hotspots);
            if (intersects.length > 0) {
                const hit = intersects[0].object;
                if (!timerStarted) startTimer();
                collectHotspot(hit.userData.hsId, hit.userData.clue);
                setActiveModal(`clue-${hit.userData.hsId}`);
            }
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('click', handleClick);
        window.addEventListener('resize', handleResize);

        // ANIMATION
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // CLEANUP
        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, [textures, room, collectHotspot, startTimer, timerStarted, setActiveModal]);

    return (
        <div className="room-3d-wrapper">
            <div ref={containerRef} className="room-3d-canvas-container" />

            {/* UI Overlay */}
            <div className="room-3d-ui-layer">
                <ObjectiveBanner
                    objective={room.objective}
                    roomName={room.name}
                />

                <QuizPanel key={currentRoom?.id} />

                <div className="room-renderer__hud">
                    <span className="clue-tracker">
                        🔎 DISCOVERIES: {useGameStore.getState().collectedItems.length}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default memo(Room3D);
