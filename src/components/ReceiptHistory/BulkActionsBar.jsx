// components/ReceiptHistory/BulkActionsBar.jsx
import React from 'react';
import { Trash2, Download, Mail, Printer, X, CheckSquare, Square, Layers } from 'lucide-react';

const BulkActionsBar = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBulkAction
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-0 z-20 bg-[#0d1117]/80 backdrop-blur-md border-b border-emerald-500/20 px-6 py-3 flex items-center justify-between animate-slide-down">
      <div className="flex items-center gap-6">
        {/* Selection Control */}
        <button
          onClick={onSelectAll}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-500 hover:text-emerald-400 transition-colors group"
        >
          <div className="relative">
            {selectedCount === totalCount ? (
              <Square size={16} className="group-active:scale-90 transition-transform" />
            ) : (
              <CheckSquare size={16} className="group-active:scale-90 transition-transform" />
            )}
          </div>
          {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
        </button>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <Layers size={14} className="text-slate-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            <span className="text-emerald-500">{selectedCount}</span> / {totalCount} Records Queued
          </span>
        </div>

        {/* Clear Button */}
        <button
          onClick={onClearSelection}
          className="p-1.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"
          title="Dismiss Selection"
        >
          <X size={14} />
        </button>
      </div>

      {/* Action Suite */}
      <div className="flex items-center gap-2 bg-[#161b22] p-1 rounded-xl border border-white/5 shadow-xl">
        <button
          onClick={() => onBulkAction('delete')}
          className="flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-all group"
          title="Purge Selected"
        >
          <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-tighter hidden sm:inline">Purge</span>
        </button>

        <div className="w-[1px] h-4 bg-white/5 mx-1" />

        <button
          onClick={() => onBulkAction('export')}
          className="flex items-center gap-2 px-3 py-2 hover:bg-blue-500/10 rounded-lg text-blue-400 transition-all group"
          title="Export CSV"
        >
          <Download size={16} className="group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-tighter hidden sm:inline">CSV</span>
        </button>

        <button
          onClick={() => onBulkAction('email')}
          className="flex items-center gap-2 px-3 py-2 hover:bg-amber-500/10 rounded-lg text-amber-500 transition-all group"
          title="Email Batch"
        >
          <Mail size={16} className="group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-tighter hidden sm:inline">Email</span>
        </button>

        <button
          onClick={() => onBulkAction('print')}
          className="flex items-center gap-2 px-3 py-2 hover:bg-emerald-500/10 rounded-lg text-emerald-500 transition-all group"
          title="Print Batch"
        >
          <Printer size={16} className="group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-tighter hidden sm:inline">Print</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default BulkActionsBar;