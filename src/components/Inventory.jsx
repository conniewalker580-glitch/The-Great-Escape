import { useState } from 'react';
import useGameStore from '../store/gameStore';
import AIImage from './AIImage';
import './Inventory.css';

// Item images for visual display
const itemImages = {
    'old-book': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200',
    'ornate-key': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
    'painting': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200',
    'safe': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200',
    'microscope': 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=200',
    'chemical-set': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=200',
    'tesla-coil': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    'control-panel': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200',
    'hieroglyph': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=200',
    'golden-idol': 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200',
    'torch': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
    'altar': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200',
    'terminal': 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=200',
    'oxygen-tank': 'https://images.unsplash.com/photo-1454779132693-e5cd0a216ed3?w=200',
    'star-map': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=200',
    'power-core': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200'
};

const Inventory = () => {
    const { inventory, selectedItem, selectItem, clearSelectedItem } = useGameStore();
    const [expandedItem, setExpandedItem] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleItemClick = (item) => {
        if (selectedItem?.id === item.id) {
            clearSelectedItem();
            setExpandedItem(null);
        } else {
            selectItem(item);
            setExpandedItem(item);
        }
    };

    const handleCloseExpanded = (e) => {
        e.stopPropagation();
        setExpandedItem(null);
        clearSelectedItem();
    };

    return (
        <div className={`inventory ${isExpanded ? 'expanded' : ''}`}>
            <div
                className="inventory-header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="header-left">
                    <span className="inventory-icon">🎒</span>
                    <span className="inventory-title">Inventory</span>
                    <span className="item-count">{inventory.length}</span>
                </div>
                <button className="expand-toggle">
                    {isExpanded ? '▼' : '▲'}
                </button>
            </div>

            <div className="inventory-items">
                {inventory.length === 0 ? (
                    <div className="inventory-empty">
                        <span className="empty-icon">📭</span>
                        <span className="empty-text">Click on hotspots to collect items</span>
                    </div>
                ) : (
                    inventory.map((item) => (
                        <div
                            key={item.id}
                            className={`inventory-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                            onClick={() => handleItemClick(item)}
                        >
                            {/* Item thumbnail */}
                            <div className="item-thumbnail">
                                <AIImage
                                    prompt={item.description || item.name}
                                    type="item"
                                    fallbackUrl={itemImages[item.id]}
                                    alt={item.name}
                                    className="thumbnail-img"
                                />
                            </div>

                            {/* Item info */}
                            <div className="item-info">
                                <span className="item-name">{item.name}</span>
                                {isExpanded && (
                                    <span className="item-desc">{item.description}</span>
                                )}
                            </div>

                            {/* Selection indicator */}
                            {selectedItem?.id === item.id && (
                                <div className="item-selected-indicator">
                                    <span>✓</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Expanded item preview */}
            {expandedItem && isExpanded && (
                <div className="expanded-preview">
                    <div className="preview-image">
                        <AIImage
                            prompt={expandedItem.description || expandedItem.name}
                            type="item"
                            fallbackUrl={itemImages[expandedItem.id]?.replace('w=200', 'w=400')}
                            alt={expandedItem.name}
                        />
                    </div>
                    <div className="preview-info">
                        <h4>{expandedItem.name}</h4>
                        <p>{expandedItem.description}</p>
                    </div>
                    <button className="preview-close" onClick={handleCloseExpanded}>✕</button>
                </div>
            )}

            {selectedItem && !isExpanded && (
                <div className="inventory-hint">
                    <span className="hint-icon">💡</span>
                    Using: {selectedItem.name}
                </div>
            )}
        </div>
    );
};

export default Inventory;
