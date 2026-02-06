import React, { useState, useEffect } from 'react';
import { Plus, ArrowUp } from 'lucide-react';

const MobileActions = ({ 
  onAddItem, 
  hasIncompleteItems = false
}) => {
  const [buttonText, setButtonText] = useState('Add Item');

  // Update button text based on incomplete items state
  useEffect(() => {
    if (hasIncompleteItems) {
      setButtonText('Add Another Item');
    } else {
      setButtonText('Add Item');
    }
  }, [hasIncompleteItems]);

  const handleAddItem = () => {
    // Just add item - items auto-save as they're filled
    onAddItem();
  };

  return (
    <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg lg:hidden z-50">
      <div className="flex space-x-2">
        {/* Main Action Button */}
        <button
          onClick={handleAddItem}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            hasIncompleteItems 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <Plus size={18} />
          <span>{buttonText}</span>
        </button>

        {/* Scroll to Top Button */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowUp size={18} />
        </button>
      </div>
      
      {/* Hint Text */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500">
          {hasIncompleteItems 
            ? 'Complete current item to add more'
            : 'Tap to add items to your receipt'}
        </p>
      </div>
    </div>
  );
};

export default MobileActions;