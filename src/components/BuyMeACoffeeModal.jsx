// components/BuyMeACoffeeModal.jsx
import React from 'react';
import { Coffee, Copy, X, CheckCircle, Zap, Heart } from 'lucide-react';
import Portal from './Portal';

const BuyMeACoffeeModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const accountNumber = "7084718050";
  const bankName = "Opay/Paycom"; 
  const accountName = "Mayowa Abraham"; 
  
  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <>
    <Portal>
      {/* Backdrop with heavy blur */}
      <div 
        className="fixed inset-0 bg-[#0d1117]/80 backdrop-blur-md z-[100] animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-end sm:items-center justify-center z-[101] p-2 sm:p-4 pointer-events-none">
        <div className="relative bg-[#161b22] border border-white/10 rounded-[2rem] w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-slide-up sm:animate-scale-in pointer-events-auto overflow-hidden">
          
          {/* Top Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500" />

          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/5">
                  <Coffee className="text-amber-500" size={24} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Fuel the Engine</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Support development ☕</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10 group"
              >
                <X className="text-slate-500 group-hover:text-white" size={20} />
              </button>
            </div>
            
            <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
              ReceiptIt is free for your business. If it saves you time, consider fueling the next update.
            </p>
          </div>
          
          {/* Content */}
          <div className="px-6 pb-6">
            {/* Bank Transfer Section - High Contrast */}
            <div className="bg-[#0d1117] border border-amber-500/20 rounded-[1.5rem] p-5 mb-4 shadow-inner">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-amber-500" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Bank Transfer</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <div>
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Institution</div>
                    <div className="text-xs font-bold text-slate-200">{bankName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Beneficiary</div>
                    <div className="text-xs font-bold text-slate-200">{accountName}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Account Number</div>
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl border border-white/5">
                    <code className="font-mono text-lg font-black text-amber-500 tracking-tighter ml-2">
                      {accountNumber}
                    </code>
                    <button
                      onClick={handleCopyAccountNumber}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${
                        copied 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-amber-500 text-black hover:bg-amber-400'
                      }`}
                    >
                      {copied ? (
                        <>
                          <CheckCircle size={14} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Tier Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Coffee', amount: '₦500', link: 'https://paystack.shop/pay/hnzvthnq88', color: 'bg-white/5' },
                { label: 'Lunch', amount: '₦1,000', link: 'https://paystack.shop/pay/tuk5dw37hv', color: 'bg-amber-500/10' },
                { label: 'Dinner', amount: '₦2,000', link: 'https://paystack.shop/pay/t5nsmmkpbr', color: 'bg-amber-500' }
              ].map((tier, i) => (
                <button
                  key={i}
                  onClick={() => window.open(tier.link, '_blank')}
                  className={`${tier.color === 'bg-amber-500' ? 'bg-amber-500 text-black' : tier.color + ' text-white'} border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95`}
                >
                  <div className="text-[10px] font-black">{tier.amount}</div>
                  <div className="text-[8px] font-bold uppercase tracking-tighter opacity-70">{tier.label}</div>
                </button>
              ))}
            </div>
            
            {/* Custom Amount */}
            <button
              onClick={() => window.open('https://paystack.shop/pay/mvvrth6y8d', '_blank')}
              className="w-full bg-white/5 border border-white/10 text-slate-300 rounded-xl p-3 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
            >
              Custom Amount via Paystack
            </button>
          </div>
          
          {/* Footer Info */}
          <div className="px-6 py-4 bg-[#0d1117]/50 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
            >
              Skip for now
            </button>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-widest">
              <Heart size={12} className="fill-current" />
              <span>Thank You</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logic-safe CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </Portal>
    </>
  );
};

export default BuyMeACoffeeModal;