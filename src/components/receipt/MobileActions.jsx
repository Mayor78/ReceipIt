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
    <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg lg:hidden z-">
      <div className="flex justify-end space-x-2">
    

        {/* Scroll to Top Button */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-green-300 transition-colors"
        >
          <ArrowUp size={18} />
        </button>
      </div>
   
    </div>
  );
};

export default MobileActions;