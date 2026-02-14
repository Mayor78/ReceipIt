import React from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

const faqs = [
  {
    q: "What is ReceiptIt?",
    a: "ReceiptIt is a high-speed, secure online receipt generator designed specifically for small businesses to deploy professional, verifiable documents instantly."
  },
  {
    q: "Is ReceiptIt really free?",
    a: "100%. Our core mission is to provide professional tools to entrepreneurs without the friction of signup fees, watermarks, or hidden charges."
  },
  {
    q: "Does ReceiptIt support Nigerian Naira?",
    a: "Absolutely. We are optimized for the local market with full ₦ currency support and automated 7.5% VAT calculations for compliant bookkeeping."
  },
  {
    q: "How do I save my receipts?",
    a: "You can export your receipts as high-fidelity PNG files or print them directly from your browser. Data is processed locally for maximum privacy."
  },
  {
    q: "Is registration required?",
    a: "No. You can start generating immediately. However, registering your store (Step 05) is recommended to prevent brand forgery and unlock verified status."
  }
];

const FAQSection = () => {
  return (
    <section className="bg-[#0a0c10] py-24 px-4 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <HelpCircle size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Support Center</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Common <span className="text-emerald-500">Queries</span>
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <details
              key={i}
              className="group border border-white/5 rounded-[1.5rem] bg-white/[0.02] overflow-hidden transition-all duration-300 open:bg-white/[0.05] open:border-emerald-500/30"
            >
              <summary className="flex justify-between items-center cursor-pointer p-6 list-none focus:outline-none">
                <span className="text-lg font-bold text-slate-200 group-hover:text-white group-open:text-emerald-400 transition-colors pr-4">
                  {item.q}
                </span>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-open:bg-emerald-500 group-open:text-black transition-all">
                  <ChevronDown className="w-5 h-5 transition-transform duration-300 group-open:rotate-180" />
                </div>
              </summary>
              
              <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="pt-2 border-t border-white/5">
                  <p className="text-slate-400 leading-relaxed font-medium pt-4">
                    {item.a}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-16 p-8 rounded-[2rem] bg-gradient-to-r from-emerald-500 to-teal-600 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(16,185,129,0.2)]">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black text-black tracking-tight leading-none mb-2">Still have questions?</h3>
            <p className="text-black/70 font-bold">Our support protocol is active 24/7.</p>
          </div>
          <button className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-xl">
            <MessageCircle size={18} />
            CONTACT SUPPORT
          </button>
        </div>
      </div>

      <style>{`
        /* Remove default arrow in some browsers */
        summary::-webkit-details-marker {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FAQSection;