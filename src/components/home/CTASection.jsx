import React from 'react';
import { Rocket, PlayCircle, ShieldCheck, Zap } from 'lucide-react';

const CTASection = ({ onGetStarted }) => {
  return (
    <section className="bg-[#0a0c10] py-24 px-4 relative">
      {/* Background Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative">
        <div className="relative overflow-hidden bg-[#0d1117] border border-white/10 rounded-[2.5rem] p-8 md:p-16 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          {/* Animated Mesh Pattern in background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
            <Zap size={14} className="text-emerald-400 fill-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
              System Ready for Deployment
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
            Ready to Upgrade Your <br />
            <span className="text-emerald-500">Business Protocol?</span>
          </h2>
          
          <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
            Join thousands of Nigerian merchants generating secure, professional, and verifiable receipts in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Main Action */}
            <button
              onClick={onGetStarted}
              className="group relative w-full sm:w-auto overflow-hidden bg-emerald-500 text-black px-10 py-5 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              <div className="absolute inset-0 flex justify-center items-center bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
              <span className="relative flex items-center justify-center gap-2">
                <Rocket size={20} />
                INITIALIZE ENGINE
              </span>
            </button>

            {/* Secondary Action */}
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
            >
              <PlayCircle size={20} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              VIEW DEMO
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck size={16} className="text-emerald-500/50" />
              <span className="text-xs font-bold uppercase tracking-widest">No Card Required</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck size={16} className="text-emerald-500/50" />
              <span className="text-xs font-bold uppercase tracking-widest">100% Private</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck size={16} className="text-emerald-500/50" />
              <span className="text-xs font-bold uppercase tracking-widest">Naira Optimized</span>
            </div>
          </div>

          {/* Floating Glow Decoration */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default CTASection;