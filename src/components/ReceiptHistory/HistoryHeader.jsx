// components/ReceiptHistory/HistoryHeader.jsx
import React from 'react';
import { History, Clock, Tag, Download, Trash2, SlidersHorizontal, Activity } from 'lucide-react';
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
    <div className="p-6 sm:p-8 border-b border-white/5 bg-[#161b22] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        
        {/* Left: Brand & Stats */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <History className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">Archive.Log</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">System Online // {savedReceipts.length} Records</span>
              </div>
            </div>
          </div>

          {/* Micro-Monitors */}
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-3 bg-[#0d1117] border border-white/5 rounded-2xl shadow-inner group hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-blue-500" />
                <div>
                  <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">7D Velocity</div>
                  <div className="text-xs font-bold text-slate-200">+{recentCount} New</div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-[#0d1117] border border-white/5 rounded-2xl shadow-inner group hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center gap-3">
                <Activity size={14} className="text-emerald-500" />
                <div>
                  <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Valuation</div>
                  <div className="text-xs font-bold text-emerald-400">{formatNaira(totalValue)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onToggleFilters}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
          >
            <SlidersHorizontal size={14} />
            Parameters
          </button>

          <button
            onClick={onExportHistory}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95"
          >
            <Download size={14} />
            Extract Data
          </button>

          <button
            onClick={onClearHistory}
            className="flex items-center gap-2 px-5 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-black transition-all active:scale-95"
          >
            <Trash2 size={14} />
            Purge All
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryHeader;