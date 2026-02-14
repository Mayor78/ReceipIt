import React from 'react';
import { Percent, TruckIcon, BadgePercent, Zap, ShieldCheck } from 'lucide-react';
import SectionHeader from './SectionHeader';

const TaxDiscountSection = ({ 
  isExpanded, 
  onToggle, 
  data, 
  onUpdate 
}) => {
  return (
    <div className="bg-[#11141b] rounded-[1rem] px-3  border border-white/5 overflow-hidden transition-all duration-300 shadow-xl">
      <SectionHeader 
        title="Tax & Charges" 
        details="Adjustments & Fees"
        icon={Percent} 
        sectionKey="taxDiscount"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ 
          text: 'Optional', 
          className: 'bg-white/5 text-slate-500 border border-white/5' 
        }}
      />
      
      {isExpanded && (
        <div className="p-6 sm:p-8 space-y-6 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* VAT Row */}
          <div className={`flex items-center justify-between p-4 rounded-2xl transition-all ${data.includeVAT ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-white/[0.02] border border-white/5'}`}>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={data.includeVAT}
                  onChange={(e) => onUpdate('includeVAT', e.target.checked)}
                  className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                />
                <div className="w-5 h-5 border-2 border-slate-700 rounded-md peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-sm scale-0 peer-checked:scale-100 transition-transform" />
                </div>
              </div>
              <span className={`text-xs font-black uppercase tracking-widest ${data.includeVAT ? 'text-emerald-400' : 'text-slate-500'}`}>
                Apply VAT
              </span>
            </label>

            {data.includeVAT && (
              <div className="flex items-center gap-2 animate-in zoom-in-95 duration-200">
                <input
                  type="number"
                  value={data.vatRate}
                  onChange={(e) => onUpdate('vatRate', parseFloat(e.target.value) || 0)}
                  className="w-20 bg-black/40 border-emerald-500/30 px-3 py-2 text-sm text-emerald-400 font-bold border rounded-xl outline-none focus:border-emerald-500 transition-all"
                  step="0.1"
                  min="0"
                  placeholder="7.5"
                />
                <span className="text-xs font-black text-emerald-500/50">%</span>
              </div>
            )}
          </div>

          {/* Discount Row */}
          <div className={`flex items-center justify-between p-4 rounded-2xl transition-all ${data.includeDiscount ? 'bg-blue-500/5 border border-blue-500/20' : 'bg-white/[0.02] border border-white/5'}`}>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={data.includeDiscount}
                  onChange={(e) => onUpdate('includeDiscount', e.target.checked)}
                  className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                />
                <div className="w-5 h-5 border-2 border-slate-700 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-sm scale-0 peer-checked:scale-100 transition-transform" />
                </div>
              </div>
              <span className={`text-xs font-black uppercase tracking-widest ${data.includeDiscount ? 'text-blue-400' : 'text-slate-500'}`}>
                Discount
              </span>
            </label>

            {data.includeDiscount && (
              <div className="flex items-center gap-2 animate-in zoom-in-95 duration-200">
                <select
                  value={data.discountType}
                  onChange={(e) => onUpdate('discountType', e.target.value)}
                  className="bg-black/40 border-blue-500/30 text-[10px] font-black text-blue-400 border rounded-xl px-2 py-2 outline-none appearance-none cursor-pointer"
                >
                  <option value="percentage">PCT %</option>
                  <option value="fixed">FLAT ₦</option>
                </select>
                <input
                  type="number"
                  value={data.discount}
                  onChange={(e) => onUpdate('discount', parseFloat(e.target.value) || 0)}
                  className="w-24 bg-black/40 border-blue-500/30 px-3 py-2 text-sm text-blue-400 font-bold border rounded-xl outline-none focus:border-blue-500 transition-all"
                  step={data.discountType === 'percentage' ? '0.1' : '100'}
                  min="0"
                  placeholder="0"
                />
              </div>
            )}
          </div>

          {/* Additional Charges Grid */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Zap size={14} className="text-amber-500" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Extra Logistics</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1 group-focus-within:text-white transition-colors">
                  <TruckIcon size={12} /> Delivery Fee
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-bold">₦</span>
                  <input
                    type="number"
                    value={data.deliveryFee}
                    onChange={(e) => onUpdate('deliveryFee', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white/[0.03] border-white/10 pl-8 pr-4 py-3 text-sm text-white font-medium border rounded-2xl outline-none focus:ring-2 focus:ring-white/10 transition-all"
                    step="100"
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="group space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1 group-focus-within:text-white transition-colors">
                  <ShieldCheck size={12} /> Service Charge
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-bold">₦</span>
                  <input
                    type="number"
                    value={data.serviceCharge}
                    onChange={(e) => onUpdate('serviceCharge', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white/[0.03] border-white/10 pl-8 pr-4 py-3 text-sm text-white font-medium border rounded-2xl outline-none focus:ring-2 focus:ring-white/10 transition-all"
                    step="100"
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxDiscountSection;