// pages/HistoryPage.jsx
import React from 'react';
import { ArrowLeft, Database, Shield, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReceiptHistory from '../components/ReceiptHistory';

const HistoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-300 selection:bg-blue-500/30">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        
        {/* Header HUD */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/create')}
              className="group flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
              aria-label="Back to Terminal"
            >
              <ArrowLeft size={20} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
            </button>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">System_Archive</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                Data_Vault <span className="text-slate-700 font-light">/</span> <span className="text-blue-400/80">Receipt_Logs</span>
              </h1>
            </div>
          </div>

          {/* System Status Pills (Visual Only) */}
          <div className="hidden lg:flex items-center gap-4">
            <StatusPill icon={Database} label="Storage" value="Optimized" />
            <StatusPill icon={Shield} label="Security" value="Encrypted" />
          </div>
        </div>

        {/* History Content Container */}
        <div className="bg-[#161b22]/50 backdrop-blur-sm rounded-[2.5rem] border border-white/5 shadow-2xl shadow-black/50 overflow-hidden">
          {/* Inner Header Accent */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          
          <div className="p-1 md:p-2">
            <ReceiptHistory />
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-full">
                <Activity size={12} className="text-slate-600" />
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                  End of Registry — Total Sessions: 1,204
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatusPill = ({ icon: Icon, label, value }) => (
  <div className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-3">
    <Icon size={14} className="text-slate-500" />
    <div className="flex flex-col">
      <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter leading-none">{label}</span>
      <span className="text-[10px] font-bold text-slate-400 leading-tight">{value}</span>
    </div>
  </div>
);

export default HistoryPage;