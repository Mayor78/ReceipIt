import React from 'react';
import { Globe, Smartphone, Users, BarChart, Sparkles, Shield, Zap } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    { icon: Globe, title: "Nigeria Focused", desc: "Built for the local market with VAT compliance, Naira support, and local business formats." },
    { icon: Smartphone, title: "Mobile Optimized", desc: "A seamless terminal experience whether you are on a phone in the market or a laptop in the office." },
    { icon: Users, title: "Zero Friction", desc: "No sign-up. No onboarding. Just open the app and start generating professional documents." },
    { icon: BarChart, title: "Business Ready", desc: "Engineered templates that meet international professional standards for any industry." },
    { icon: Sparkles, title: "Always Free", desc: "No watermarks, no hidden fees, and no subscription traps. Pure utility for your business." },
    { icon: Shield, title: "Local Privacy", desc: "We don't want your data. All calculations and logic happen locally on your secure device." }
  ];

  return (
    <section className="bg-[#0a0c10] py-24 px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-emerald-500 fill-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/80">
                Core Advantages
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              Why Business Leaders <br />
              <span className="text-emerald-500">Trust ReceiptIt</span>
            </h2>
          </div>
          <p className="text-slate-400 font-medium max-w-sm border-l border-white/10 pl-6 hidden md:block">
            We removed the complexity of traditional accounting software to give you speed and security.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-white/[0.03] backdrop-blur-sm rounded-[2rem] p-8 border border-white/5 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden"
            >
              {/* Card Hover Decoration */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
              
              <div className="relative z-10">
                {/* Icon Wrapper */}
                <div className="w-14 h-14 bg-[#11141b] rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-500">
                  <feature.icon className="text-emerald-400 group-hover:scale-110 transition-transform duration-500" size={26} />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                  {feature.desc}
                </p>
              </div>

              {/* Animated Corner accent */}
              <div className="absolute bottom-0 right-0 w-12 h-12 overflow-hidden rounded-br-[2rem]">
                 <div className="absolute bottom-[-20px] right-[-20px] w-10 h-10 bg-emerald-500/20 rotate-45 group-hover:bg-emerald-500/40 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile-only summary */}
        <div className="mt-12 md:hidden text-center px-6">
           <p className="text-slate-500 text-sm italic">
            "ReceiptIt is the standard for fast, verifiable business documents in Nigeria."
           </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;