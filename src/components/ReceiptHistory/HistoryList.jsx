// components/ReceiptHistory/HistoryList.jsx
import React, { useState } from 'react';
import { Calendar, Search, ArrowUp, Hash, Layers } from 'lucide-react';
import { useReceipt } from '../../context/ReceiptContext';
import ReceiptListItem from './ReceiptListItem';

const HistoryList = ({ searchTerm, selectedFilter }) => {
  const { savedReceipts } = useReceipt();
  const [expandedReceipt, setExpandedReceipt] = useState(null);

  // LOGIC PRESERVED: Filter receipts
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

  function isRecent(date) {
    const receiptDate = new Date(date);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return receiptDate > oneWeekAgo;
  };

  // LOGIC PRESERVED: Group by date
  const groupedReceipts = filteredReceipts.reduce((groups, receipt) => {
    const date = new Date(receipt.date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(receipt);
    return groups;
  }, {});

  const toggleExpand = (id) => {
    setExpandedReceipt(expandedReceipt === id ? null : id);
  };

  // UI: Empty State
  if (filteredReceipts.length === 0) {
    return (
      <div className="py-24 text-center bg-[#0d1117]/50 rounded-b-[2.5rem]">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-slate-500/10 rounded-full animate-pulse" />
          <div className="w-full h-full bg-[#161b22] border border-white/5 rounded-full flex items-center justify-center">
            <Search className="text-slate-600" size={32} />
          </div>
        </div>
        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Null Search Result</h3>
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-2 max-w-xs mx-auto leading-relaxed">
          No matching data found in the current archive. Modify your query parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#161b22] flex flex-col min-h-0">
      {/* Results HUD Overlay */}
      <div className="px-6 py-3 bg-blue-500/5 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-blue-500" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Filtering: <span className="text-blue-400">{filteredReceipts.length}</span> of <span className="text-white">{savedReceipts.length}</span> Index_Items
            </p>
          </div>
          {searchTerm && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              <ArrowUp size={12} className="group-hover:-translate-y-1 transition-transform" />
              Scroll To Top
            </button>
          )}
        </div>
      </div>

      {/* Main Feed Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[75vh]">
        {Object.entries(groupedReceipts).map(([date, receipts], groupIndex) => (
          <div key={date} className="relative">
            {/* Sticky Date Header */}
            <div className="sticky top-0 z-20 px-6 py-3 bg-[#0d1117]/80 backdrop-blur-md border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em]">
                  <Calendar size={14} className="mr-3 text-blue-500" />
                  <span className="text-slate-200">{date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash size={10} className="text-slate-600" />
                  <span className="text-[9px] font-black text-slate-500 uppercase">{receipts.length} entries</span>
                </div>
              </div>
            </div>

            {/* Receipt Items */}
            <div className="divide-y divide-white/[0.03]">
              {receipts.map((receipt) => (
                <ReceiptListItem
                  key={receipt.id}
                  receipt={receipt}
                  isExpanded={expandedReceipt === receipt.id}
                  onToggleExpand={() => toggleExpand(receipt.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Feed Bottom Status */}
      <div className="px-8 py-5 border-t border-white/5 bg-[#0d1117]/30 text-center rounded-b-[2.5rem]">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full border border-white/5">
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
             End of Data Stream // {filteredReceipts.length} Records Verified
           </span>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
};

export default HistoryList;