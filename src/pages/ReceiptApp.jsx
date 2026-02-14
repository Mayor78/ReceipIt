// pages/ReceiptApp.jsx
import React from 'react';
import { ReceiptProvider } from '../context/ReceiptContext';
import LogoUpload from '../components/LogoUpload';
import ReceiptForm from '../components/ReceiptForm';
import ReceiptDisplay from '../components/ReceiptDisplay';
import TemplateSelector from '../components/receiptTemplates/TemplateSelector';
import { useNavigate } from 'react-router-dom';
import { History, Settings, LayoutDashboard, Zap } from 'lucide-react';

const ReceiptApp = () => {
  const navigate = useNavigate();

  return (
    <ReceiptProvider>
      <div className="min-h-screen bg-[#0d1117] text-slate-300 font-sans selection:bg-blue-500/30">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Cyber-Glass Header */}
          <header className="bg-[#161b22]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[100] shadow-2xl">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Zap size={22} className="text-white fill-current" />
                </div>
                <div>
                  <h1 className="text-sm font-black text-white uppercase tracking-[0.2em] leading-none">SmartReceipt</h1>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Generation Engine v3.0</p>
                </div>
              </div>
              
              {/* Navigation Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/history')}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-xl transition-all duration-300 border border-transparent hover:border-white/10 group"
                  aria-label="View history"
                >
                  <History size={18} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                  <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">History</span>
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="p-2.5 hover:bg-white/5 rounded-xl transition-all duration-300 border border-transparent hover:border-white/10 group"
                  aria-label="Settings"
                >
                  <Settings size={18} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Dashboard Layout */}
          <main className="p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column - Configuration (8 Units) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Brand Identity Card */}
                  <section className="bg-[#161b22] rounded-[2rem] border border-white/5 shadow-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                      <LayoutDashboard size={14} className="text-blue-500" />
                      <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Brand Identity</h2>
                    </div>
                    <div className="p-6">
                      <LogoUpload />
                    </div>
                  </section>
                  
                  {/* Template Selection Card */}
                  <section className="bg-[#161b22] rounded-[2rem] border border-white/5 shadow-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                      <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Visual Style</h2>
                    </div>
                    <div className="p-6">
                      <TemplateSelector />
                    </div>
                  </section>
                </div>
                
                {/* Data Entry Card */}
                <section className="bg-[#161b22] rounded-[2rem] border border-white/5 shadow-xl overflow-hidden">
                  <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <span className="text-emerald-500 font-black text-xs">01</span>
                      </div>
                      <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Transaction Data entry</h2>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Autosave Active</span>
                  </div>
                  <div className="p-8">
                    <ReceiptForm />
                  </div>
                </section>
              </div>

              {/* Right Column - Live Render (4 Units) */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <section className="bg-[#161b22] rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.04] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                        <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Production Preview</h2>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] font-black rounded uppercase border border-blue-500/20">
                        Real-time
                      </span>
                    </div>
                    <div className="p-5 bg-[#0d1117]/50">
                      <ReceiptDisplay />
                    </div>
                  </section>
                  
                  {/* Shortcut Tip */}
                  <div className="mt-6 px-6 py-4 bg-blue-600/5 border border-blue-500/10 rounded-2xl flex items-center gap-4">
                    <div className="p-2 bg-blue-600/10 rounded-lg">
                      <Zap size={16} className="text-blue-500" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 leading-snug uppercase tracking-tight">
                      Pro Tip: Use <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-white/10 text-white">CMD+P</kbd> to trigger instant print bridge.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Minimalist Footer */}
          <footer className="px-8 py-10 border-t border-white/5 bg-[#161b22]/30 mt-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 text-slate-500">
                <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">Documentation</a>
                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">Support</a>
                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">Terms</a>
              </div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                System Engineered with 💚 by <span className="text-blue-500">mayordev</span>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </ReceiptProvider>
  );
};

export default ReceiptApp;