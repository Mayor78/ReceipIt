import React, { useEffect } from 'react';
import { User, Truck, Receipt, Sparkles, MapPin, Phone, PlusCircle } from 'lucide-react';
import SectionHeader from './SectionHeader';

const CustomerInfoSection = ({ 
  isExpanded, 
  onToggle, 
  data, 
  onUpdate 
}) => {
  // Logic preserved: Auto-expand when options are checked
  useEffect(() => {
    if ((data.includeBillTo || data.includeShipTo) && !isExpanded) {
      const timer = setTimeout(() => {
        onToggle('customerInfo');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [data.includeBillTo, data.includeShipTo, isExpanded, onToggle]);

  const handleCheckboxChange = (field, checked) => {
    onUpdate(field, checked);
    if (checked && !isExpanded) {
      setTimeout(() => {
        onToggle('customerInfo');
      }, 50);
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="bg-[#11141b]  border border-white/5 overflow-hidden transition-all duration-300 shadow-xl">
      <SectionHeader 
        title="Customer" 
        details="Client Contact & Delivery"
        icon={User} 
        sectionKey="customerInfo"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ 
          text: data.includeBillTo || data.includeShipTo ? 'Active' : 'Optional', 
          className: data.includeBillTo || data.includeShipTo 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : 'bg-white/5 text-slate-500 border border-white/5' 
        }}
      >
        {/* Toggle Pills in Header */}
      
      </SectionHeader>
        <div className=" flex justify-end gap-2 mr-2" onClick={handleCheckboxClick}>
          <button
            onClick={() => handleCheckboxChange('includeBillTo', !data.includeBillTo)}
            className={`px-2 py-1 rounded-md text-[8px] md:text-[10px] font-black uppercase tracking-tighter transition-all ${
              data.includeBillTo 
                ? 'bg-blue-500 text-black shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                : 'bg-white/5 text-slate-500 hover:text-slate-300 border border-white/5'
            }`}
          >
            Bill To
          </button>
          <button
            onClick={() => handleCheckboxChange('includeShipTo', !data.includeShipTo)}
            className={`px-3 py-1 rounded-md text-[8px] md:text-[10px] font-black uppercase tracking-tighter transition-all ${
              data.includeShipTo 
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                : 'bg-white/5 text-slate-500 hover:text-slate-300 border border-white/5'
            }`}
          >
            Ship To
          </button>
        </div>
      
      {isExpanded && (
        <div className="p-5 sm:p-7 space-y-8 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-500">
          
          {/* EMPTY STATE: Only shows if NOTHING is selected */}
          {!data.includeBillTo && !data.includeShipTo && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 animate-in fade-in zoom-in-95">
              <button 
                onClick={() => handleCheckboxChange('includeBillTo', true)}
                className="group flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-blue-500/5 hover:border-blue-500/30 transition-all"
              >
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                  <Receipt size={24} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-400">Add Billing Info</span>
                <p className="text-[10px] text-slate-600 mt-1">Invoice name, phone & address</p>
              </button>

              <button 
                onClick={() => handleCheckboxChange('includeShipTo', true)}
                className="group flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all"
              >
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                  <Truck size={24} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-400">Add Shipping Info</span>
                <p className="text-[10px] text-slate-600 mt-1">Delivery details & location</p>
              </button>
            </div>
          )}

          {/* Bill To Section */}
          {data.includeBillTo && (
            <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Receipt size={16} className="text-blue-400" />
                  </div>
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Billing Details</h4>
                </div>
                <button 
                  onClick={() => handleCheckboxChange('includeBillTo', false)}
                  className="text-[9px] font-black text-slate-600 hover:text-red-400 uppercase tracking-widest"
                >
                  Remove Section
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Client Name</label>
                  <input
                    type="text"
                    value={data.billToName}
                    onChange={(e) => onUpdate('billToName', e.target.value)}
                    className="w-full bg-white/[0.03] border-white/10 px-4 py-3.5 text-sm text-white border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-700"
                    placeholder="Enter customer name..."
                    autoFocus
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact Phone</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={data.billToPhone}
                      onChange={(e) => onUpdate('billToPhone', e.target.value)}
                      className="w-full bg-white/[0.03] border-white/10 pl-10 pr-4 py-3.5 text-sm text-white border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-700"
                      placeholder="e.g. +1 555-0123"
                    />
                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  </div>
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Billing Address</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={data.billToAddress}
                      onChange={(e) => onUpdate('billToAddress', e.target.value)}
                      className="w-full bg-white/[0.03] border-white/10 pl-10 pr-4 py-3.5 text-sm text-white border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-700"
                      placeholder="Street, City, State, Zip"
                    />
                    <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Divider logic */}
          {data.includeBillTo && data.includeShipTo && <div className="h-px bg-white/5 mx-[-28px]" />}

          {/* Ship To Section */}
          {data.includeShipTo && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Truck size={16} className="text-emerald-400" />
                  </div>
                  <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Delivery Details</h4>
                </div>
                <button 
                  onClick={() => handleCheckboxChange('includeShipTo', false)}
                  className="text-[9px] font-black text-slate-600 hover:text-red-400 uppercase tracking-widest"
                >
                  Remove Section
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Recipient Name</label>
                  <input
                    type="text"
                    value={data.shipToName}
                    onChange={(e) => onUpdate('shipToName', e.target.value)}
                    className="w-full bg-white/[0.03] border-white/10 px-4 py-3.5 text-sm text-white border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder:text-slate-700"
                    placeholder="Same as billing or different?"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Delivery Phone</label>
                  <input
                    type="tel"
                    value={data.shipToPhone}
                    onChange={(e) => onUpdate('shipToPhone', e.target.value)}
                    className="w-full bg-white/[0.03] border-white/10 px-4 py-3.5 text-sm text-white border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder:text-slate-700"
                    placeholder="Recipient contact"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Shipping Address</label>
                  <input
                    type="text"
                    value={data.shipToAddress}
                    onChange={(e) => onUpdate('shipToAddress', e.target.value)}
                    className="w-full bg-white/[0.03] border-white/10 px-4 py-3.5 text-sm text-white border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder:text-slate-700"
                    placeholder="Where are we sending this?"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerInfoSection;