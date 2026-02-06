import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { useReceipt } from '../../context/ReceiptContext';

const ClearConfirm = ({ onClose }) => {
  const { savedReceipts, clearHistory, formatNaira } = useReceipt();

  const totalValue = savedReceipts.reduce((sum, receipt) => sum + receipt.total, 0);

  const handleClear = () => {
    clearHistory();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Trash2 className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Clear All History?</h3>
              <p className="text-sm text-gray-600">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
          <p className="text-red-700">
            This will permanently delete all <span className="font-bold">{savedReceipts.length}</span> saved receipts 
            with a total value of <span className="font-bold">{formatNaira(totalValue)}</span>.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-medium shadow-lg transition-all"
          >
            Clear All Receipts
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearConfirm;