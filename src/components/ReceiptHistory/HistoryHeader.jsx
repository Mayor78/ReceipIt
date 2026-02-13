import React from 'react';
import { History, Clock, Tag } from 'lucide-react';
import { useReceipt } from '../../context/ReceiptContext';

const HistoryHeader = ({ onClearHistory, onExportHistory, onToggleFilters }) => {
  const { savedReceipts, formatNaira } = useReceipt();

  const totalValue = savedReceipts.reduce((sum, receipt) => sum + receipt.total, 0);
  
  const recentCount = savedReceipts.filter(receipt => {
    const receiptDate = new Date(receipt.date);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return receiptDate > oneWeekAgo;
  }).length;

  return (
    <div className="p-5 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-white to-blue-50">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
       

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleFilters}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Filter
          </button>
          <button
            onClick={onExportHistory}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-emerald-800 transition-colors font-medium shadow-sm"
          >
            Export History
          </button>
          <button
            onClick={onClearHistory}
            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryHeader;