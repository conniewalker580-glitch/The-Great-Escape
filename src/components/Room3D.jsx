import { useRef, useEffect, useState, memo } from 'react';
import * as THREE from 'three';
import useGameStore from '../store/gameStore';
import aiService from '../services/aiService';
import './Room3D.css';

const Room3D = ({ room }) => {
    const containerRef = useRef();
    const { collectHotspot, startTimer, timerStarted, setActiveModal } = useGameStore();
    const [textures, setTextures] = useState({
        walls: null,
        floor: null,
        object: null
    });

    // Fetch textures from Hugging Face
    useEffect(() => {
        const fetchTextures = async () => {
            try {
                const wallTex = await aiService.generateVisual("dark stone wall texture, high detail, concrete block, dirty, seamless", "item");
                const floorTex = await aiService.generateVisual("worn concrete floor texture, dusty, cracked, seamless", "item");
                const objectTex = await aiService.generateVisual("ancient geometric symbols carved in stone, cryptic, mystical", "item");

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
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        // SCENE SETUP
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050505);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1.6, 3);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        // LIGHTING
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 10);
        pointLight.position.set(0, 3, 0);
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
        const roomBox = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 10), wallMat);
        roomBox.position.y = 2.5;
        scene.add(roomBox);

        const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
        floor.rotation.x = -Math.PI / 2;
        scene.add(floor);

        // DECORATIVE OBJECT (Painting/Symbol)
        const objGeo = new THREE.PlaneGeometry(2, 2);
        const objMat = new THREE.MeshStandardMaterial({
            transparent: true,
            map: textures.object ? texLoader.load(textures.object) : null,
            color: textures.object ? 0xffffff : 0x222222
        });
        const wallObj = new THREE.Mesh(objGeo, objMat);
        wallObj.position.set(0, 2, -4.95);
        scene.add(wallObj);

        // HOTSPOTS
        const hotspots = [];
        room.hotspots?.forEach((hs) => {
            const spot = new THREE.Mesh(
                new THREE.SphereGeometry(0.3),
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

        window.addEventListener('click', handleClick);

        // ANIMATION
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // CLEANUP
        return () => {
            window.removeEventListener('click', handleClick);
            renderer.dispose();
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, [textures, room, collectHotspot, startTimer, timerStarted, setActiveModal]);

    return <div ref={containerRef} className="room-3d-container" style={{ width: '100%', height: '100vh' }} />;
};

export default memo(Room3D);
