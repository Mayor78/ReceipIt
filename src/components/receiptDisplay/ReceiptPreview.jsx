import React from 'react';
import { FileText, Smartphone, Hash, Calendar, Layers } from 'lucide-react';

const ReceiptPreview = ({
  receiptData,
  companyLogo,
  formatNaira,
  calculateSubtotal,
  calculateVAT,
  calculateTotal
}) => {
  return (
    <div className="bg-[#1c2128] rounded-[2rem] shadow-2xl p-6 border border-white/10 relative overflow-hidden group">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <FileText size={120} />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          {companyLogo ? (
            <div className="inline-block p-2 bg-white rounded-2xl mb-4 shadow-lg shadow-white/5">
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                className="h-12 object-contain"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
              <Smartphone className="text-blue-400" size={24} />
            </div>
          )}
          <h2 className="text-lg font-black text-white uppercase tracking-wider mb-1">
            {receiptData.storeName || "New Receipt"}
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">
            {receiptData.storeAddress}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Hash size={12} className="text-blue-400" />
              <p className="text-[9px] font-black text-slate-500 uppercase">Serial</p>
            </div>
            <p className="text-xs font-bold text-white tracking-tight">{receiptData.receiptNumber}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-right">
            <div className="flex items-center gap-2 mb-1 justify-end">
              <p className="text-[9px] font-black text-slate-500 uppercase">Timestamp</p>
              <Calendar size={12} className="text-emerald-400" />
            </div>
            <p className="text-xs font-bold text-white tracking-tight">{receiptData.date}</p>
          </div>
        </div>

        {/* Items Preview (Logic preserved: only showing first 3) */}
        <div className="space-y-3 mb-8 border-y border-white/5 py-6">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={14} className="text-purple-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Line Items</span>
          </div>
          
          {receiptData.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex justify-between items-center group/item">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200">
                  <span className="text-blue-400 font-black mr-2">{item.quantity}×</span>
                  {item.name}
                </span>
                {item.unit && (
                  <span className="text-[9px] font-bold text-slate-500 uppercase ml-6 tracking-tighter">
                    per {item.unit}
                  </span>
                )}
              </div>
              <span className="text-xs font-black text-white tabular-nums">
                {formatNaira(item.price * item.quantity)}
              </span>
            </div>
          ))}
          
          {receiptData.items.length > 3 && (
            <div className="flex items-center justify-center pt-2">
              <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest border border-white/5">
                + {receiptData.items.length - 3} additional items hidden
              </span>
            </div>
          )}
        </div>

        {/* Financial Summary */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subtotal</span>
            <span className="text-xs font-bold text-white">{formatNaira(calculateSubtotal())}</span>
          </div>
          
          {receiptData.includeVAT && (
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Service VAT ({receiptData.vatRate}%)
              </span>
              <span className="text-xs font-bold text-white">{formatNaira(calculateVAT())}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Total Due</span>
            <span className="text-xl font-black text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              {formatNaira(calculateTotal())}
            </span>
          </div>
        </div>

        {/* Signature Section */}
        {receiptData.includeSignature && (
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Authorization</div>
            {receiptData.signatureData ? (
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full" />
                <img 
                  src={receiptData.signatureData} 
                  alt="Signature" 
                  className="h-10 relative z-10 brightness-200 contrast-125 filter invert p-1"
                />
                <div className="text-[8px] font-black text-blue-500 uppercase tracking-tighter mt-2">Digital Stamp Verified</div>
              </div>
            ) : (
              <div className="h-[2px] bg-slate-700 w-24 mx-auto rounded-full"></div>
            )}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t border-white/5 text-center">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
            Internal Preview Mode <br />
            <span className="text-blue-500/50">Final document requires export</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreview;