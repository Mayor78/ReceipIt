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

  const totalValue = completeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddItem = () => {
    onAddItem();
  };

  // When item is saved, if it's the active entry form, it will auto-clear and stay open
  const handleItemSaved = (itemId) => {
    // The form will clear itself if keepFormOpen is true
    // We don't need to do anything here
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <SectionHeader 
        title="Items" 
        icon={Package} 
        sectionKey="items"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ 
          text: `${completeItems.length} item${completeItems.length !== 1 ? 's' : ''}`, 
          className: incompleteItems.length === 0 && items.length > 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }}
      >
        {incompleteItems.length === 0 && (
          <button
            onClick={handleAddItem}
            className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-semibold"
          >
            <Plus size={14} />
            <span>Add Item</span>
          </button>
        )}
      </SectionHeader>
      
      {isExpanded && (
        <div className="p-4">
          {/* Stats Bar */}
          {items.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <CheckCircle size={12} className="text-green-600" />
                  <span className="text-xs font-semibold text-gray-600">{completeItems.length} Complete</span>
                </div>
                {incompleteItems.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle size={12} className="text-amber-600" />
                    <span className="text-xs font-semibold text-gray-600">{incompleteItems.length} In Progress</span>
                  </div>
                )}
              </div>
              <div className="text-sm font-bold text-green-700">
                ₦{totalValue.toLocaleString()}
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-sm font-semibold text-gray-900">No items yet</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">Start adding items to your receipt</p>
              <button
                onClick={handleAddItem}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm"
              >
                <Plus size={16} />
                <span>Add First Item</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Entry Form - Show incomplete items with keepFormOpen=true */}
              {incompleteItems.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase">
                      Add Item {incompleteItems.length > 1 && `(${incompleteItems.length} in progress)`}
                    </h3>
                  </div>
                  
                  {incompleteItems.map((item, index) => (
                    <ReceiptItem
                      key={item.id}
                      item={item}
                      updateItem={onUpdateItem}
                      removeItem={onRemoveItem}
                      isFirstItem={index === 0}
                      keepFormOpen={true} 
                      onSaveComplete={() => handleItemSaved(item.id)}
                    />
                  ))}
                </div>
              )}

              {/* Saved Items List */}
              {completeItems.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase">
                      Saved Items ({completeItems.length})
                    </h3>
                  </div>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {completeItems.map((item) => (
                      <ReceiptItem
                        key={item.id}
                        item={item}
                        updateItem={onUpdateItem}
                        removeItem={onRemoveItem}
                        isFirstItem={false}
                        keepFormOpen={false}  
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Add Another Button - only when no incomplete items */}
              {incompleteItems.length === 0 && (
                <button
                  onClick={handleAddItem}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all"
                >
                  <Plus size={18} />
                  <span className="text-sm font-semibold">Add Another Item</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemsSection;