import React, { useState, useEffect } from 'react';
import { Receipt, ShieldCheck, Zap, Terminal, FileText, Cpu } from 'lucide-react';

const PageLoader = () => {
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState("Waking Receipt Engine...");

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 35); // Slightly slower for a more "calculated" feel

    const statusUpdates = [
      { time: 400, text: "Accessing Receipt Vault..." },
      { time: 1000, text: "Verifying Hashing Protocols..." },
      { time: 1800, text: "Syncing ₦_Naira_VAT_Engines..." },
      { time: 2400, text: "Decryption Module Online." },
      { time: 2900, text: "Terminal Ready." },
    ];

    statusUpdates.forEach((update) => {
      setTimeout(() => setStatus(update.text), update.time);
    });

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] overflow-hidden">
      {/* Background Data-Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      
      <div className="text-center relative z-10">
        {/* Animated Scanner Effect */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-emerald-500/20 rounded-full animate-ping" />
          </div>
          <div className="relative w-28 h-28 mx-auto bg-[#11141b] border-2 border-emerald-500/50 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.15)] group">
            <Receipt className="w-14 h-14 text-emerald-500 group-hover:scale-110 transition-transform" />
            {/* Corner Accents */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-emerald-500/50" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-emerald-500/50" />
          </div>
        </div>

        {/* Brand/System Header */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Cpu size={14} className="text-emerald-500/40" />
            <span className="text-[10px] font-black text-emerald-500/40 uppercase tracking-[0.5em]">System_Process</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-[0.2em] uppercase">
            RECEIPT<span className="text-emerald-500">IT</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-emerald-500/30 mt-3 font-mono text-[9px] tracking-[0.3em]">
             <Terminal size={12} />
             EXEC_RECEIPT_LOG_SEQUENCE
          </div>
        </div>

        {/* Progress HUD */}
        <div className="w-72 mx-auto space-y-4">
          <div className="flex justify-between font-mono text-[9px] text-emerald-500/60 uppercase tracking-widest">
            <span className="animate-pulse">{status}</span>
            <span className="text-emerald-500 font-black">{percent}%</span>
          </div>
          
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)] transition-all duration-300 ease-out rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* System Integrity Badges */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified_Vault</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
            <FileText size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Smart_Schema</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;