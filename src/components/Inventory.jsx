import useGameStore from '../store/gameStore';
import './Inventory.css';

const Inventory = () => {
    const { inventory, selectedItem, selectItem, clearSelectedItem } = useGameStore();

    const handleItemClick = (item) => {
        if (selectedItem?.id === item.id) {
            clearSelectedItem();
        } else {
            selectItem(item);
        }
    };

    return (
        <div className="inventory">
            <div className="inventory-header">
                <span className="inventory-icon">🎒</span>
                <span className="inventory-title">Inventory</span>
            </div>
            <div className="inventory-items">
                {inventory.length === 0 ? (
                    <div className="inventory-empty">
                        <span className="empty-text">No items collected</span>
                    </div>
                ) : (
                    inventory.map((item) => (
                        <div
                            key={item.id}
                            className={`inventory-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                            onClick={() => handleItemClick(item)}
                            title={item.description}
                        >
                            <span className="item-icon">{item.icon}</span>
                            <span className="item-name">{item.name}</span>
                            {selectedItem?.id === item.id && (
                                <div className="item-selected-indicator">Using</div>
                            )}
                        </div>
                    ))
                )}
            </div>
            {selectedItem && (
                <div className="inventory-hint">
                    Click on a hotspot to use the {selectedItem.name}
                </div>
            )}
        </div>
    );
};

export default Inventory;
