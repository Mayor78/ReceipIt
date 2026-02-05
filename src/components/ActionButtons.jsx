import React from 'react';
import { RefreshCw, Download } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';

const ActionButtons = () => {
  const { resetReceipt } = useReceipt();

  const handleExportJSON = () => {
    const { receiptData } = useReceipt();
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${receiptData.receiptNumber}.json`;
    link.click();
  };

  return (
    <div className="flex space-x-3">
      <button
        onClick={resetReceipt}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
      >
        <RefreshCw size={18} />
        <span>Reset</span>
      </button>
    </div>
  );
};

export default ActionButtons;