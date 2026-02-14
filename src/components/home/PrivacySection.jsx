import React, { useEffect, useState, useMemo } from 'react';
import { 
  Shield, 
  Cpu, 
  Lock, 
  Database, 
  CloudOff, 
  Hash, 
  EyeOff,
  Sparkles,
  ShieldCheck,
  Zap,
  HardDrive
} from 'lucide-react';

const PrivacySection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const flowSteps = [
    { icon: Cpu, label: "Input Data", status: "Local Only" },
    { icon: Zap, label: "Processing", status: "Browser-side" },
    { icon: Lock, label: "Generation", status: "Secured" },
    { icon: HardDrive, label: "Storage", status: "Your Device" }
  ];

  return (
    <section className="bg-[#0a0c10] py-24 px-4 relative overflow-hidden">
      {/* Background Grid & Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Area */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Shield size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Security Protocol</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
            Privacy First. <br />
            <span className="text-emerald-500">By Architecture.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            We don't just promise privacy; we engineered the app so we physically 
            <span className="text-white"> cannot see your data.</span>
          </p>
        </div>

        {/* Data Flow Visualization */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {flowSteps.map((step, i) => (
            <div key={i} className="relative group">
              <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] text-center hover:border-emerald-500/30 transition-all">
                <div className="w-12 h-12 bg-[#11141b] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <step.icon className="text-emerald-400" size={20} />
                </div>
                <p className="text-white font-bold text-sm mb-1">{step.label}</p>
                <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">{step.status}</p>
              </div>
              {i < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-2 translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-4 h-px bg-white/20" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* The "Zero Storage" Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: What stays with you */}
          <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck size={120} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <Database className="text-emerald-400" />
              Client-Side Logic
            </h3>
            <ul className="space-y-6">
              {[
                { t: "Receipt Content", d: "Your business and customer details stay in browser memory." },
                { t: "Calculations", d: "VAT and totals are computed locally on your CPU." },
                { t: "PDF Rendering", d: "Document generation happens entirely on your device." }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                  <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider">{item.t}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: What we see (The Zero List) */}
          <div className="bg-red-500/[0.02] border border-red-500/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <EyeOff size={120} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <CloudOff className="text-red-400" />
              Zero Server Storage
            </h3>
            <div className="space-y-4">
              {["Business Identity", "Customer Databases", "Sales History", "Tax Information"].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 group hover:bg-red-500/5 transition-colors">
                  <span className="text-slate-300 font-medium">{item}</span>
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full">
                    Not Stored
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Transparency Footer */}
        <div className="mt-12 p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4 text-left">
            <Hash className="text-emerald-400 shrink-0" size={24} />
            <p className="text-slate-400 text-sm">
              <span className="text-white font-bold uppercase text-xs tracking-widest block mb-1">Hashing Protocol:</span>
              When verification is active, we only store a <span className="text-emerald-400">cryptographic hash</span>. 
              This is a one-way fingerprint that cannot be reverse-engineered to see your business data.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-xl font-black text-[10px] tracking-tighter uppercase whitespace-nowrap">
            <Sparkles size={14} />
            Verified Secure
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;