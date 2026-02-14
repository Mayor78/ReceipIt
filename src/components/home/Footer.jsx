import React from 'react';
import { Receipt, Coffee, Heart, ShieldCheck, Github, Twitter, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0c10] pt-20 pb-10 px-6 border-t border-white/5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-500 p-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Receipt className="text-black" size={22} />
              </div>
              <div className="leading-none">
                <span className="block text-2xl font-black tracking-tighter text-white">
                  RECEIPT<span className="text-emerald-500">IT</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">
                  Secure Protocol v2.0
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The standard for professional document generation in Nigeria. 
              Built for speed, localized for the Naira, and engineered for absolute privacy.
            </p>
          </div>

          {/* Quick Stats/Links */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Security Info</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <ShieldCheck size={14} className="text-emerald-500" /> 
                CLIENT-SIDE ENCRYPTION
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <ShieldCheck size={14} className="text-emerald-500" /> 
                ZERO SERVER STORAGE
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <ShieldCheck size={14} className="text-emerald-500" /> 
                VAT COMPLIANCE READY
              </li>
            </ul>
          </div>

          {/* Support/Coffee */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Support Development</h4>
            <button 
              onClick={() => window.open('https://paystack.shop/pay/mvvrth6y8d', '_blank')}
              className="group flex items-center gap-3 bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 px-4 py-3 rounded-2xl transition-all w-full"
            >
              <div className="bg-emerald-500/10 p-2 rounded-lg group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                <Coffee size={18} className="text-emerald-400 group-hover:text-inherit" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-emerald-500 uppercase leading-none mb-1">Buy the dev a coffee</p>
                <p className="text-white font-bold text-sm">Contribute on Paystack</p>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <span>© {currentYear} RECEIPTIT LABS.</span>
            <span className="hidden md:block">•</span>
            <span>MADE WITH <Heart size={12} className="inline text-emerald-500 mx-1 fill-emerald-500/20" /> BY MAYORDEV</span>
          </div>

          {/* System Status Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">System Online</span>
            </div>
            <div className="flex gap-4 text-slate-500">
               <Twitter size={16} className="hover:text-emerald-400 cursor-pointer transition-colors" />
               <Github size={16} className="hover:text-emerald-400 cursor-pointer transition-colors" />
               <Globe size={16} className="hover:text-emerald-400 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
        
        {/* Privacy Microcopy */}
        <p className="text-center text-[9px] text-slate-700 font-bold uppercase tracking-[0.3em] mt-10">
          Your documents are processed locally. We do not store, view, or sell your business data.
        </p>
      </div>
    </footer>
  );
};

export default Footer;