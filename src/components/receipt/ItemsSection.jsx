import React from 'react';
import { Plus, CheckCircle, AlertCircle, Package } from 'lucide-react';
import SectionHeader from './SectionHeader';
import ReceiptItem from '../ReceiptItem';

const ItemsSection = ({ 
  isExpanded, 
  onToggle, 
  items, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem
}) => {
  const completeItems = items.filter(item => 
    item.name.trim() !== "" && item.name !== "New Item" && item.price > 0
  );
  
  const incompleteItems = items.filter(item => 
    !item.name.trim() || item.name === "New Item" || item.price === 0
  );

  const handleAddItem = (e) => {
    if (e) e.preventDefault();
    onAddItem();
  };

  const totalValue = completeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
      <SectionHeader 
        title="Items" 
        icon={Package} 
        sectionKey="items"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ 
          text: `${items.length} item${items.length !== 1 ? 's' : ''}`, 
          className: incompleteItems.length === 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }}
      >
        <button
          onClick={handleAddItem}
          className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-800 transition-colors text-[11px] font-bold uppercase tracking-wider shadow-sm"
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </SectionHeader>
      
      {isExpanded && (
        <div className="pt-4 mt-2">
          {/* Stats Bar */}
          {items.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <CheckCircle size={12} className="text-green-600" />
                  <span className="text-[11px] font-bold text-gray-600">{completeItems.length} Done</span>
                </div>
                {incompleteItems.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle size={12} className="text-amber-600" />
                    <span className="text-[11px] font-bold text-gray-600">{incompleteItems.length} Draft</span>
                  </div>
                )}
              </div>
              <div className="text-sm font-black text-green-700">
                ₦{totalValue.toLocaleString()}
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-12 bg-gray-50/30 rounded-3xl border border-dashed border-gray-200">
              <div className="text-4xl mb-3">🛍️</div>
              <p className="text-sm font-black text-gray-900">Your bag is empty</p>
              <p className="text-xs text-gray-400 mt-1">Tap 'Add Item' to start the receipt</p>
            </div>
          ) : (
            <div className="relative">
              {/* THE SCROLL BOX (iPhone Physics applied here) */}
              <div className="ios-scroll-box">
                {items.map((item, index) => (
                  <div key={item.id} className="receipt-card-wrapper">
                    <ReceiptItem
                      item={item}
                      updateItem={onUpdateItem}
                      removeItem={onRemoveItem}
                      isFirstItem={index === 0 && incompleteItems.length > 0}
                    />
                  </div>
                ))}
                
                {/* Visual spacer to allow the last item to scroll comfortably above the button */}
                <div className="h-10 flex-shrink-0" />
              </div>

              {/* Fading bottom overlay to suggest more items */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-xl" />
            </div>
          )}

          {/* Add Another Button (Sticky-ish bottom) */}
          {items.length > 0 && (
            <button
              onClick={handleAddItem}
              className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all active:scale-[0.98]"
            >
              <Plus size={18} />
              <span className="text-sm font-black uppercase tracking-tight">Add Another Item</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemsSection;