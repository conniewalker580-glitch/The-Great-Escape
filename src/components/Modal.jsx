import { useState } from 'react';
import useGameStore from '../store/gameStore';
import './Modal.css';

const Modal = () => {
    const {
        activeModal,
        closeModal,
        gameState,
        addToInventory,
        updateGameState,
        selectedItem,
        clearSelectedItem,
        removeFromInventory
    } = useGameStore();

    const [safeCode, setSafeCode] = useState('');
    const [codeError, setCodeError] = useState(false);

    if (!activeModal) return null;

    const handleTakeKey = () => {
        addToInventory({
            id: 'key',
            name: 'Old Key',
            icon: '🗝️',
            description: 'An old brass key. It might open something...'
        });
        updateGameState({ hasKey: true });
        closeModal();
    };

    const handleUseKeyOnVase = () => {
        if (selectedItem?.id === 'key') {
            updateGameState({ drawerOpened: true, hasUsedKey: true });
            removeFromInventory('key');
            addToInventory({
                id: 'note',
                name: 'Secret Note',
                icon: '📜',
                description: 'A note with the code: 1234'
            });
            updateGameState({ hasNote: true });
            clearSelectedItem();
        }
    };

    const handleCodeSubmit = () => {
        if (safeCode === '1234') {
            updateGameState({ safeOpened: true });
            removeFromInventory('note');
            addToInventory({
                id: 'exitKey',
                name: 'Exit Key',
                icon: '🔑',
                description: 'The key to freedom!'
            });
            updateGameState({ hasExitKey: true });
            closeModal();
        } else {
            setCodeError(true);
            setTimeout(() => setCodeError(false), 1000);
        }
    };

    const handleEscape = () => {
        if (selectedItem?.id === 'exitKey' || gameState.hasExitKey) {
            updateGameState({ escaped: true });
            clearSelectedItem();
            closeModal();
        }
    };

    const renderModalContent = () => {
        switch (activeModal) {
            case 'book':
                return (
                    <div className="modal-content book-modal">
                        <div className="modal-header">
                            <h2>📚 Old Book</h2>
                            <button className="close-btn" onClick={closeModal}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="book-image">
                                <div className="book-visual">
                                    <div className="book-cover">
                                        <span className="book-title">Ancient Mysteries</span>
                                    </div>
                                    {!gameState.hasKey && (
                                        <div className="key-in-book">
                                            <span className="key-icon">🗝️</span>
                                            <span className="key-shine"></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="modal-description">
                                {gameState.hasKey
                                    ? "An old book about ancient mysteries. You already took the key from here."
                                    : "You open the dusty book and discover an old brass key hidden between the pages!"
                                }
                            </p>
                            {!gameState.hasKey && (
                                <button className="action-btn take-btn" onClick={handleTakeKey}>
                                    <span>🗝️</span> Take Key
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 'vase':
                return (
                    <div className="modal-content vase-modal">
                        <div className="modal-header">
                            <h2>🏺 Antique Vase</h2>
                            <button className="close-btn" onClick={closeModal}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="vase-image">
                                <div className="vase-visual">
                                    <div className="vase-body"></div>
                                    <div className={`secret-drawer ${gameState.drawerOpened ? 'opened' : ''}`}>
                                        <div className="drawer-handle"></div>
                                        {gameState.drawerOpened && (
                                            <div className="note-in-drawer">
                                                <span>📜</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="modal-description">
                                {gameState.drawerOpened
                                    ? "The secret drawer is open! You found a note with a code: 1234"
                                    : gameState.hasKey
                                        ? "A beautiful antique vase. There seems to be a hidden drawer at the base. It has a keyhole..."
                                        : "A beautiful antique vase. There seems to be something hidden at the base, but it's locked."
                                }
                            </p>
                            {!gameState.drawerOpened && gameState.hasKey && (
                                <button
                                    className={`action-btn use-key-btn ${selectedItem?.id === 'key' ? 'ready' : ''}`}
                                    onClick={handleUseKeyOnVase}
                                    disabled={selectedItem?.id !== 'key'}
                                >
                                    <span>🗝️</span>
                                    {selectedItem?.id === 'key' ? 'Use Key to Open Drawer' : 'Select the Key from Inventory'}
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 'painting':
                return (
                    <div className="modal-content painting-modal">
                        <div className="modal-header">
                            <h2>🖼️ Mysterious Painting</h2>
                            <button className="close-btn" onClick={closeModal}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="painting-image">
                                <div className="painting-visual">
                                    <div className="painting-frame">
                                        <div className="painting-canvas">
                                            {gameState.drawerOpened && !gameState.safeOpened && (
                                                <div className="safe-revealed">
                                                    <div className="safe">
                                                        <div className="safe-door">
                                                            <div className="keypad">
                                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map((key) => (
                                                                    <button
                                                                        key={key}
                                                                        className={`keypad-btn ${codeError ? 'error' : ''}`}
                                                                        onClick={() => {
                                                                            if (key === 'C') {
                                                                                setSafeCode('');
                                                                            } else if (key === '✓') {
                                                                                handleCodeSubmit();
                                                                            } else if (safeCode.length < 4) {
                                                                                setSafeCode(prev => prev + key);
                                                                            }
                                                                        }}
                                                                    >
                                                                        {key}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <div className={`code-display ${codeError ? 'error' : ''}`}>
                                                                {safeCode.padEnd(4, '_').split('').map((char, i) => (
                                                                    <span key={i} className="code-digit">{char}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {gameState.safeOpened && (
                                                <div className="safe-open">
                                                    <div className="exit-key-container">
                                                        <span className="exit-key">🔑</span>
                                                        <p>You found the Exit Key!</p>
                                                    </div>
                                                </div>
                                            )}
                                            {!gameState.drawerOpened && (
                                                <div className="painting-art">
                                                    <div className="moon"></div>
                                                    <div className="stars">✨</div>
                                                    <div className="mountains"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="modal-description">
                                {gameState.safeOpened
                                    ? "The safe is open! You retrieved the Exit Key. Now find the door to escape!"
                                    : gameState.drawerOpened
                                        ? "Behind the painting, there's a safe! Enter the 4-digit code to open it."
                                        : "A beautiful painting of a moonlit landscape. But wait... is there something behind it?"
                                }
                            </p>
                        </div>
                    </div>
                );

            case 'door':
                return (
                    <div className="modal-content door-modal">
                        <div className="modal-header">
                            <h2>🚪 Exit Door</h2>
                            <button className="close-btn" onClick={closeModal}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="door-image">
                                <div className="door-visual">
                                    <div className="door-frame">
                                        <div className="door-panel">
                                            <div className="door-handle"></div>
                                            <div className="door-keyhole"></div>
                                        </div>
                                    </div>
                                    {gameState.hasExitKey && (
                                        <div className="freedom-light"></div>
                                    )}
                                </div>
                            </div>
                            <p className="modal-description">
                                {gameState.hasExitKey
                                    ? "This is the exit! Use the Exit Key to escape the room!"
                                    : "The exit door. It's locked. You need to find the Exit Key."
                                }
                            </p>
                            {gameState.hasExitKey && (
                                <button className="action-btn escape-btn" onClick={handleEscape}>
                                    <span>🚪</span> Escape the Room!
                                </button>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                {renderModalContent()}
            </div>
        </div>
    );
};

export default Modal;
