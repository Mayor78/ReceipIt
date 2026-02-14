import React, { useState, useEffect } from 'react';
import { Settings, FileText, Shield, Download, Store, ArrowRight, CheckCircle, Sparkles, ChevronRight } from 'lucide-react';

// ===== MODERN COLOR SYSTEM (CYBER THEME) =====
const COLORS = {
  bg: 'bg-[#0a0c10]',
  cardBg: 'bg-white/5',
  cardBorder: 'border-white/10',
  accent: 'emerald-500',
  textMain: 'text-white',
  textMuted: 'text-slate-400',
  premium: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]'
  }
};

export const StepCard = ({ number, title, description, icon: Icon, index, isLast, isPremium = false }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="relative flex flex-col items-center group">
      <article 
        className={`
          relative z-10 w-full p-8 rounded-[2rem] border transition-all duration-500
          ${isPremium ? `${COLORS.premium.bg} ${COLORS.premium.border} ${COLORS.premium.glow}` : `${COLORS.cardBg} ${COLORS.cardBorder}`}
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          hover:-translate-y-2 hover:bg-white/[0.08]
        `}
      >
        {/* Step Number Overlay */}
        <div className="absolute top-4 right-6 text-6xl font-black text-white/5 group-hover:text-emerald-500/10 transition-colors pointer-events-none">
          {number}
        </div>

        {/* Icon Container */}
        <div className={`
          inline-flex p-4 rounded-2xl mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
          ${isPremium ? 'bg-emerald-500 text-black' : 'bg-white/5 text-emerald-400'}
        `}>
          <Icon size={28} strokeWidth={2.5} />
        </div>

        {/* Text Content */}
        <div className="relative">
          <h3 className="text-xl font-black text-white mb-3 tracking-tight">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
            {description}
          </p>
        </div>

        {/* Premium Perks */}
        {isPremium && (
          <div className="mt-6 pt-6 border-t border-emerald-500/20 space-y-3">
            {['Anti-Forgery', 'Verified ID', 'Brand Safety'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <CheckCircle size={12} />
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Bottom Glow Line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-emerald-500 group-hover:w-1/2 transition-all duration-500 opacity-50" />
      </article>

      {/* Connection Arrow (Desktop) */}
      {!isLast && (
        <div className="hidden lg:flex absolute top-1/2 -right-4 z-0 translate-x-1/2 -translate-y-1/2 text-white/10 group-hover:text-emerald-500/30 transition-colors">
          <ChevronRight size={40} strokeWidth={1} />
        </div>
      )}
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    { number: "01", title: "Input Data", description: "Enter business info, items, and tax rates in our secure terminal.", icon: Settings },
    { number: "02", title: "Stylize", description: "Select from professional templates built for modern commerce.", icon: FileText },
    { number: "03", title: "Brand It", description: "Deploy your company logo for instant customer recognition.", icon: Shield },
    { number: "04", title: "Deploy", description: "Generate encrypted PDFs ready for printing or digital sharing.", icon: Download },
    { number: "05", title: "Verify Store", description: "Secure your legacy. Lock your business name from forgers.", icon: Store, isPremium: true }
  ];

  return (
    <section className={`py-24 px-6 relative overflow-hidden ${COLORS.bg}`}>
      {/* Abstract Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -ml-64 -mb-64" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
              Operational Protocol
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
            The Flow of <span className="text-emerald-500">Trust</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 font-medium">
            A high-speed engine designed to generate, brand, and secure your transactions in seconds.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <StepCard 
              key={index}
              {...step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* Security Alert Footer */}
        <div className="mt-20 flex justify-center">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-3xl flex items-center gap-4 group hover:border-emerald-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-white uppercase tracking-wider leading-none mb-1">Recommended Action</p>
              <p className="text-sm text-slate-400">Complete <span className="text-emerald-400 font-bold">Step 05</span> to unlock global verification status.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;