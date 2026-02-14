import React, { useState, useEffect } from 'react';
import { Receipt, ShieldCheck, Zap, Terminal } from 'lucide-react';

const PageLoader = () => {
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState("Initializing Core...");

  // Simulated boot sequence for extra flair
  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const statusUpdates = [
      { time: 500, text: "Loading Security Protocol..." },
      { time: 1200, text: "Mapping Local Storage..." },
      { time: 2000, text: "Syncing Naira VAT Rules..." },
      { time: 2600, text: "System Ready." },
    ];

    statusUpdates.forEach((update) => {
      setTimeout(() => setStatus(update.text), update.time);
    });

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] overflow-hidden">
      {/* Background Matrix/Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />
      
      <div className="text-center relative z-10">
        {/* Main Animated Icon */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-emerald-500/20 rounded-full animate-ping" />
          </div>
          <div className="relative w-24 h-24 mx-auto bg-[#11141b] border-2 border-emerald-500/50 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <Receipt className="w-12 h-12 text-emerald-500" />
          </div>
        </div>

        {/* Brand Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white tracking-widest uppercase flex items-center justify-center gap-2">
            RECEIPT<span className="text-emerald-500">IT</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-emerald-500/50 mt-2 font-mono text-[10px] tracking-[0.4em]">
             <Terminal size={12} />
             BOOT_SEQUENCE_ACTIVE
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 mx-auto space-y-3">
          <div className="flex justify-between font-mono text-[10px] text-emerald-500/70 uppercase tracking-widest">
            <span>{status}</span>
            <span>{percent}%</span>
          </div>
          
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Footer Badges */}
        <div className="mt-16 grid grid-cols-2 gap-4 max-w-xs mx-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Secure</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
            <Zap size={14} className="text-emerald-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Local Only</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;