import { useState, useMemo } from 'react';
import useGameStore from '../store/gameStore';
import AIImage from './AIImage';
import './Modal.css';

/**
 * Enhanced Modal System for Clue Discovery
 * Updated by C.S. Walker
 */
const clueDetails = {
    // Room 1: Victorian Study
    'old-book': {
        title: 'Leather Journal',
        icon: '📚',
        clue: "Journal Entry: 'I started my apprenticeship exactly 20 years before the Great War (1914).'",
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
        discoveryText: 'The journal contains specific dates regarding the Master\'s life.'
    },
    'painting': {
        title: 'Family Portrait',
        icon: '🖼️',
        clue: "A small inscription: 'Painted on my 20th Birthday, 1894.'",
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600',
        discoveryText: 'A secret marking on the frame reveals his age.'
    },
    'decorative-vase': {
        title: 'Antique Vase',
        icon: '🏺',
        clue: "Just a dusty old vase. Nothing useful here.",
        image: 'https://images.unsplash.com/photo-1581781870027-0cf754877395?w=600',
        isMisleading: true
    },

    // Room 2: Scientist's Lab
    'microscope': {
        title: 'Advanced Microscope',
        icon: '🔬',
        clue: "Slide 42: Atomic Number 47 is the stabilizer.",
        image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600',
    },
    'chemical-set': {
        title: 'Periodic Table Scrap',
        icon: '⚗️',
        clue: "Periodic Table Scrap: '...46 (Pd), 47 (?), 48 (Cd)...'",
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600',
    },

    // Room 3: Ancient Temple
    'hieroglyph': {
        title: 'Sun Disc Carving',
        icon: '☀️',
        clue: "The Sun Disc symbol translates to 'RA'.",
        image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
    },
    'altar-scroll': {
        title: 'Priest\'s Scroll',
        icon: '📜',
        clue: "Scroll suffix: '...HOTEP means Peace.' Full name: [Sun Disc]-[Peace].",
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',
    },

    // Room 4: Space Station
    'terminal': {
        title: 'Main Computer',
        icon: '💻',
        clue: "Log: 'Distance to Proxima Centauri is 4.22 light years.'",
        image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600',
    },
    'star-map': {
        title: 'Astro-Chart',
        icon: '🗺️',
        clue: "Airlock memo: 'The code is the light-year distance of the nearest star, ignoring decimals.'",
        image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600',
    }
};

const Modal = () => {
    const {
        activeModal,
        closeModal,
        currentRoom
    } = useGameStore();

    const [isInteracting, setIsInteracting] = useState(false);
    const [showDiscovery, setShowDiscovery] = useState(false);

    const confetti = useMemo(() => {
        if (activeModal !== 'escape-success') return [];
        const colors = ['#8b5cf6', '#06b6d4', '#22c55e', '#fbbf24', '#ef4444'];
        return [...Array(20)].map((_, i) => ({
            id: i,
            delay: `${(i * 0.1) % 2}s`,
            x: `${(i * 7) % 100}%`,
            color: colors[i % colors.length]
        }));
    }, [activeModal]);

    if (!activeModal) return null;

    // Handle escape success modal
    if (activeModal === 'escape-success') {
        return (
            <div className="modal-overlay success-overlay">
                <div className="modal-container escape-success-modal">
                    <div className="success-content">
                        <div className="success-icon">🏆</div>
                        <h1>PUZZLE SOLVED!</h1>
                        <h2>You Found the Answer!</h2>
                        <div className="success-stats">
                            <p>Excellent deduction in the {currentRoom?.name}.</p>
                        </div>
                        <div className="confetti">
                            {confetti.map((c) => (
                                <div key={c.id} className="confetti-piece" style={{
                                    '--delay': c.delay,
                                    '--x': c.x,
                                    '--color': c.color
                                }} />
                            ))}
                        </div>
                        <button className="action-btn success-btn" onClick={closeModal}>
                            Next Room →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Handle clue collection and inspection
    if (activeModal.startsWith('clue-') || activeModal.startsWith('misleading-')) {
        const isMisleading = activeModal.startsWith('misleading-');
        const hotspotId = activeModal.replace('clue-', '').replace('misleading-', '');

        // Find clue from store's current room config
        const hotspotInfo = currentRoom?.hotspots.find(h => h.id === hotspotId);
        const detail = clueDetails[hotspotId] || {
            title: hotspotInfo?.label || 'Unknown Object',
            icon: hotspotInfo?.icon || '🔍',
            clue: hotspotInfo?.clue || 'No specific information found.',
            discoveryText: hotspotInfo?.description || 'You examine the object closely.'
        };

        const handleExamine = () => {
            setIsInteracting(true);
            setTimeout(() => {
                setShowDiscovery(true);
                setIsInteracting(false);
            }, 800);
        };

        return (
            <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-container clue-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{detail.icon} {detail.title}</h2>
                            <button className="close-btn" onClick={closeModal}>✕</button>
                        </div>

                        <div className="modal-body clue-detail-body">
                            <div className={`item-image-container ${isInteracting ? 'inspecting' : ''} ${isMisleading ? 'misleading-glow' : ''}`}>
                                <AIImage
                                    prompt={detail.clue || detail.discoveryText || detail.title}
                                    type="item"
                                    fallbackUrl={detail.image}
                                    alt={detail.title}
                                    className="item-image"
                                />
                                {isInteracting && (
                                    <div className="inspection-overlay">
                                        <div className="inspection-scanner"></div>
                                        <p>Analyzing...</p>
                                    </div>
                                )}
                                {showDiscovery && !isMisleading && (
                                    <div className="discovery-badge clue-found">
                                        <span>✨ New Clue Logged</span>
                                    </div>
                                )}
                            </div>

                            <div className="clue-content-area">
                                {!showDiscovery ? (
                                    <>
                                        <p className="description-text">{detail.discoveryText || hotspotInfo?.description}</p>
                                        <button className="action-btn examine-btn" onClick={handleExamine}>
                                            <span className="action-icon">🔍</span>
                                            Examine Closely
                                        </button>
                                    </>
                                ) : (
                                    <div className={`clue-reveal ${isMisleading ? 'misleading' : ''}`}>
                                        <div className="clue-tag">{isMisleading ? 'OBSERVATION' : 'DISCOVERY'}</div>
                                        <p className="clue-text">{detail.clue || hotspotInfo?.clue}</p>
                                        <button className="action-btn continue-btn" onClick={closeModal}>
                                            Close Log →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default Modal;
