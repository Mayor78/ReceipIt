// components/ReceiptHistory/ClearConfirm.jsx
import React from 'react';
import { X, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useReceipt } from '../../context/ReceiptContext';

const ClearConfirm = ({ onClose }) => {
  const { savedReceipts, clearHistory, formatNaira } = useReceipt();

  const totalValue = savedReceipts.reduce((sum, receipt) => sum + receipt.total, 0);

  const handleClear = () => {
    clearHistory();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0d1117]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      {/* Modal Container */}
      <div className="bg-[#161b22] border border-red-500/20 rounded-[2rem] max-w-md w-full p-8 shadow-[0_20px_50px_rgba(239,68,68,0.15)] animate-scale-in overflow-hidden relative">
        
        {/* Warning Glow Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px] -mr-16 -mt-16" />

        <div className="flex items-start justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-lg shadow-red-500/5">
              <ShieldAlert className="text-red-500" size={28} />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1">System Purge</h3>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">Clear All History?</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10 text-slate-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Warning Box */}
        <div className="mb-8 p-5 bg-red-500/5 rounded-2xl border border-red-500/10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
          <div className="flex gap-3">
            <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-slate-300 leading-relaxed uppercase tracking-tight">
              Critical: This will permanently delete <span className="text-white font-black">{savedReceipts.length}</span> archived records 
              with a total valuation of <span className="text-red-400 font-black">{formatNaira(totalValue)}</span>.
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end relative z-10">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-xl hover:bg-white/5 hover:text-white transition-all order-2 sm:order-1"
          >
            Abort Action
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-red-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <Trash2 size={14} />
            Confirm Purge
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default ClearConfirm;