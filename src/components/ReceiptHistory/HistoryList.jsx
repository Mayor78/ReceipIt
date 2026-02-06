import React, { useState } from 'react';
import { Calendar, Search } from 'lucide-react';
import { useReceipt } from '../../context/ReceiptContext';
import ReceiptListItem from './ReceiptListItem';

const HistoryList = ({ searchTerm, selectedFilter }) => {
  const { savedReceipts } = useReceipt();
  const [expandedReceipt, setExpandedReceipt] = useState(null);

  // Filter receipts
  const filteredReceipts = savedReceipts.filter(receipt => {
    const matchesSearch = 
      receipt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (receipt.data?.customerName && receipt.data.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
      receipt.template === selectedFilter ||
      (selectedFilter === 'recent' && isRecent(receipt.date)) ||
      (selectedFilter === 'invoice' && receipt.name.toLowerCase().includes('invoice')) ||
      (selectedFilter === 'receipt' && receipt.name.toLowerCase().includes('receipt')) ||
      (selectedFilter === 'quote' && receipt.name.toLowerCase().includes('quote'));
    
    return matchesSearch && matchesFilter;
  });

  const isRecent = (date) => {
    const receiptDate = new Date(date);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return receiptDate > oneWeekAgo;
  };

  // Group by date
  const groupedReceipts = filteredReceipts.reduce((groups, receipt) => {
    const date = new Date(receipt.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(receipt);
    return groups;
  }, {});

  const toggleExpand = (id) => {
    setExpandedReceipt(expandedReceipt === id ? null : id);
  };

  if (filteredReceipts.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="text-gray-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No receipts found</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          No receipts match your search criteria. Try a different search term or filter.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Results Count */}
      <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-50 to-transparent">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-semibold">{filteredReceipts.length}</span> of{' '}
            <span className="font-semibold">{savedReceipts.length}</span> receipts
          </p>
          {searchTerm && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              ↑ Top
            </button>
          )}
        </div>
      </div>

      {/* Receipts List */}
      <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
        {Object.entries(groupedReceipts).map(([date, receipts]) => (
          <div key={date} className="bg-white">
            {/* Date Header */}
            <div className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center text-gray-700 font-medium">
                <Calendar size={18} className="mr-3 text-blue-600" />
                <span className="text-gray-900">{date}</span>
                <span className="ml-3 px-2 py-1 bg-white rounded-lg text-sm font-normal">
                  {receipts.length} receipt{receipts.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {receipts.map((receipt) => (
              <ReceiptListItem
                key={receipt.id}
                receipt={receipt}
                isExpanded={expandedReceipt === receipt.id}
                onToggleExpand={() => toggleExpand(receipt.id)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="text-center text-sm text-gray-600">
          {filteredReceipts.length} receipt{filteredReceipts.length !== 1 ? 's' : ''} shown
        </div>
      </div>
    </>
  );
};

export default HistoryList;