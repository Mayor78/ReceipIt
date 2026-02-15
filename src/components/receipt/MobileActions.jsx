import React, { useState, useEffect } from 'react';
import { Plus, ArrowUp, Sparkles } from 'lucide-react';

const MobileActions = () => {
 


  return (
    <div className="sticky bottom-6 px-4 lg:hidden z-[100] animate-in slide-in-from-bottom-10 duration-500">
      <div className="">
        
      

        {/* Scroll to Top Button */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-14 h-14 flex items-center justify-center bg-emerald-500 text-black rounded-[1.5rem] font-bold shadow-[0_8px_20px_rgba(16,185,129,0.3)] active:scale-90 transition-all border border-emerald-400/20"
        >
          <ArrowUp size={24} strokeWidth={3} />
        </button>
      </div>
      
      {/* Subtle Bottom Glow */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-blue-500/20 blur-xl rounded-full" />
    </div>
  );
};

export default MobileActions;