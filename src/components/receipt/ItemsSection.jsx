import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, AlertCircle } from 'lucide-react';
import SectionHeader from './SectionHeader';
import ReceiptItem from '../ReceiptItem';
import { Package } from 'lucide-react';

const ItemsSection = ({ 
  isExpanded, 
  onToggle, 
  items, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem,
  hasOnlyDummyItems 
}) => {
  const [forceSaveItems, setForceSaveItems] = useState([]);
  const [addingNewItem, setAddingNewItem] = useState(false);

  // Count complete and incomplete items
  const completeItems = items.filter(item => 
    item.name.trim() !== "" && item.name !== "New Item" && item.price > 0
  );
  
  const incompleteItems = items.filter(item => 
    !item.name.trim() || item.name === "New Item" || item.price === 0
  );

  const handleAddItem = () => {
    // First, force save any incomplete items
    if (incompleteItems.length > 0) {
      // Mark incomplete items for forced save
      setForceSaveItems(incompleteItems.map(item => item.id));
      
      // Wait for saves to complete, then add new item
      setTimeout(() => {
        if (hasOnlyDummyItems && items.length > 0) {
          if (window.confirm('Clear all incomplete items and start fresh?')) {
            // Remove incomplete items
            incompleteItems.forEach(item => onRemoveItem(item.id));
            // Add new item
            setTimeout(() => {
              onAddItem();
              setAddingNewItem(true);
            }, 100);
          }
        } else {
          onAddItem();
          setAddingNewItem(true);
        }
        // Clear force save flags
        setTimeout(() => setForceSaveItems([]), 100);
      }, 200);
    } else {
      // No incomplete items, just add new one
      onAddItem();
      setAddingNewItem(true);
    }
  };

  // Reset adding flag when items update
  useEffect(() => {
    if (addingNewItem) {
      setAddingNewItem(false);
    }
  }, [items]);

  const handleItemSaveComplete = (itemId) => {
    // Remove item from force save list when saved
    setForceSaveItems(prev => prev.filter(id => id !== itemId));
  };

  const totalValue = completeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <SectionHeader 
        title="Items" 
        icon={Package} 
        sectionKey="items"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ 
          text: `${completeItems.length}/${items.length} saved`, 
          className: completeItems.length === items.length ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }}
      >
        <button
          onClick={handleAddItem}
          className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
        >
          <Plus size={14} />
          <span>Add Item</span>
        </button>
      </SectionHeader>
      
      {isExpanded && (
        <div className="pt-4 border-t">
          {/* Stats */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-600" />
                  <span className="text-sm">{completeItems.length} saved</span>
                </div>
                {incompleteItems.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={14} className="text-amber-600" />
                    <span className="text-sm">{incompleteItems.length} editing</span>
                  </div>
                )}
              </div>
              <div className="text-sm font-semibold text-green-700">
                Total: ₦{totalValue.toLocaleString()}
              </div>
            </div>
            
            {/* Auto-save Info */}
            {incompleteItems.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                ⏱️ Items auto-save after 60 seconds of inactivity
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🛒</div>
              <p className="text-sm font-medium">No items yet</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add Item" to start adding items</p>
              <button
                onClick={handleAddItem}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                Add First Item
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                {items.map((item, index) => (
                  <ReceiptItem
                    key={item.id}
                    item={item}
                    updateItem={onUpdateItem}
                    removeItem={onRemoveItem}
                    isFirstItem={index === 0 && incompleteItems.length > 0}
                    forceSave={forceSaveItems.includes(item.id)}
                    onSaveComplete={() => handleItemSaveComplete(item.id)}
                  />
                ))}
              </div>

              {/* Add Another Button */}
              <button
                onClick={handleAddItem}
                className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                <Plus size={16} />
                <span className="text-sm font-medium">Add Another Item</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemsSection;