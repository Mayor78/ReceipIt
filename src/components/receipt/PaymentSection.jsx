import React from 'react';
import { CreditCard, Wallet, Banknote, Landmark, ArrowRightCircle } from 'lucide-react';
import SectionHeader from './SectionHeader';

const getDocumentConfig = (type) => {
  switch(type) {
    case 'invoice':
      return {
        color: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        glow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]',
        accent: 'text-purple-400',
        ring: 'focus:ring-purple-500/30'
      };
    case 'quote':
      return {
        color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
        accent: 'text-blue-400',
        ring: 'focus:ring-blue-500/30'
      };
    case 'receipt':
    default:
      return {
        color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
        accent: 'text-emerald-400',
        ring: 'focus:ring-emerald-500/30'
      };
  }
};

const PaymentSection = ({ 
  isExpanded, 
  onToggle, 
  data, 
  onUpdate 
}) => {
  const docConfig = getDocumentConfig(data.receiptType);

  return (
    <div className={`bg-[#11141b] rounded-[1rem] px-3  border border-white/5 overflow-hidden transition-all duration-300 shadow-xl ${docConfig.glow}`}>
      <SectionHeader 
        title="Payment" 
        details="Settlement Details"
        icon={CreditCard} 
        sectionKey="payment"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ 
          text: data.receiptType === 'invoice' ? 'To Pay' : 
                data.receiptType === 'quote' ? 'Estimate' : 'Paid',
          className: `${docConfig.color} font-black uppercase tracking-widest px-4 py-1 border`
        }}
      />
      
      {isExpanded && (
        <div className="p-6 sm:p-8 space-y-6 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                <Wallet size={12} className={docConfig.accent} />
                {data.receiptType === 'invoice' ? 'Payment Terms' : 'Settlement Method'}
              </label>
              
              <div className="relative group">
                <select
                  value={data.paymentMethod}
                  onChange={(e) => onUpdate('paymentMethod', e.target.value)}
                  className={`w-full bg-white/[0.03] border-white/10 px-4 py-3.5 text-sm text-white border rounded-2xl outline-none transition-all appearance-none cursor-pointer ${docConfig.ring} focus:border-white/20`}
                >
                  {data.receiptType === 'invoice' ? (
                    <>
                      <option value="Net 30">Net 30 Days</option>
                      <option value="Net 15">Net 15 Days</option>
                      <option value="Due on Receipt">Due on Receipt</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </>
                  ) : data.receiptType === 'quote' ? (
                    <>
                      <option value="Estimate">Estimate Only</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                      <option value="POS">POS</option>
                    </>
                  ) : (
                    <>
                      <option value="Cash">Cash</option>
                      <option value="POS">POS (Card Swipe)</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Cheque">Cheque</option>
                    </>
                  )}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <ArrowRightCircle size={16} className="rotate-90" />
                </div>
              </div>
            </div>

            {/* Conditional Amount Paid Input */}
            {data.receiptType === 'receipt' && data.paymentMethod === 'Cash' && (
              <div className="space-y-2 animate-in zoom-in-95 duration-300">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <Banknote size={12} className="text-emerald-400" />
                  Actual Amount Paid
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-bold">₦</span>
                  <input
                    type="number"
                    value={data.amountPaid}
                    onChange={(e) => onUpdate('amountPaid', parseFloat(e.target.value) || 0)}
                    className="w-full bg-emerald-500/5 border-emerald-500/20 pl-8 pr-4 py-3.5 text-sm text-emerald-400 font-black border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    step="100"
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
            )}

            {/* Visual Feedback for non-cash/invoice */}
            {(data.receiptType !== 'receipt' || data.paymentMethod !== 'Cash') && (
               <div className="hidden sm:flex flex-col justify-center p-4 bg-white/[0.01] rounded-2xl border border-dashed border-white/5 text-center">
                  <Landmark size={20} className="mx-auto text-slate-800 mb-1" />
                  <p className="text-[9px] text-slate-600 uppercase font-black tracking-tighter">Verified Transaction Mode</p>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;