// components/ReceiptHistory/EmptyHistory.jsx
import React from 'react';
import { History, Check, FileDown, PlusCircle, Database } from 'lucide-react';

const EmptyHistory = () => {
  return (
    <div className="bg-[#161b22] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden relative group">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />
      
      <div className="text-center py-16 sm:py-24 px-6 relative z-10">
        {/* Animated Icon Container */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping opacity-20" />
          <div className="w-full h-full bg-[#0d1117] border border-white/5 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
            {/* Scanner Line Animation */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan" />
            <History className="text-blue-500/40 group-hover:text-blue-400 transition-colors duration-500" size={48} strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">System.Archive</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">Vault is Empty</h3>
          </div>
          
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide leading-relaxed">
            Archive protocols are active. Generated documents will be indexed here for real-time management and retrieval.
          </p>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-3 justify-center mt-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-[9px] font-black text-slate-300 uppercase tracking-widest transition-all hover:border-blue-500/30">
            <Check size={14} className="text-emerald-500" />
            Auto-Sync Active
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-[9px] font-black text-slate-300 uppercase tracking-widest transition-all hover:border-blue-500/30">
            <Database size={14} className="text-blue-500" />
            Cloud Optimized
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-[9px] font-black text-slate-300 uppercase tracking-widest transition-all hover:border-blue-500/30">
            <FileDown size={14} className="text-amber-500" />
            Export Ready
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default EmptyHistory;