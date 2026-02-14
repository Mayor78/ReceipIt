import React, { useState, useEffect } from 'react';
import SectionHeader from './SectionHeader';
import { Building2, Edit2, Check, Store, Shield, Percent, Phone, Mail, MapPin, CreditCard, Award, ArrowRight, Sparkles } from 'lucide-react';

const BusinessInfoSection = ({ 
  isExpanded, 
  onToggle, 
  data, 
  onUpdate,
  onRegisterClick 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    storeAddress: '',
    storePhone: '',
    storeEmail: '',
    tinNumber: '',
    rcNumber: ''
  });

  // LOGIC UNTOUCHED
  useEffect(() => {
    if (data) {
      setFormData({
        storeName: data.storeName || '',
        storeAddress: data.storeAddress || '',
        storePhone: data.storePhone || '',
        storeEmail: data.storeEmail || '',
        tinNumber: data.tinNumber || '',
        rcNumber: data.rcNumber || ''
      });
    }
  }, [data]);

  const handleRegister = () => {
    if (onRegisterClick) onRegisterClick();
  };

  const hasBusinessInfo = () => !!(formData.storeName && formData.storeAddress && formData.storePhone);
  const hasAnyBusinessInfo = () => !!(formData.storeName || formData.storeAddress || formData.storePhone || formData.storeEmail);
  const hasStoredData = (field) => !!data?.[field];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onUpdate(field, value);
  };

  const handleSave = () => setIsEditing(false);
  const handleEdit = () => setIsEditing(true);
  const canEdit = () => isEditing || !hasBusinessInfo();

  // STYLED FOR NEW USERS (Registration Banner)
  if (!hasAnyBusinessInfo()) {
    return (
      <div className="bg-[#11141b] rounded-[1rem] px-3  border border-white/5 overflow-hidden transition-all duration-500 hover:border-emerald-500/20 shadow-2xl">
        <SectionHeader 
          title="Your Shop Identity" 
          details="Set up your shop to start issuing receipts"
          icon={Building2} 
          sectionKey="businessInfo"
          isExpanded={isExpanded}
          onClick={onToggle}
          badge={{ 
            text: 'Not Set Yet', 
            className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
          }}
        />
        
        {isExpanded && (
          <div className="p-1 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] rounded-[1.75rem] p-4 sm:p-8 border border-white/5 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px]" />
              
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 relative z-10">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-500 text-black rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                      <Store size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Register Your Shop</h3>
                      <p className="text-emerald-500/70 text-xs font-bold uppercase tracking-widest">Setup takes 60 seconds</p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                    Joining ReceiptIt gives you a professional business profile. Your customers get clean receipts, and your business gets more trust.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: Shield, text: "Fraud Protection", color: "text-emerald-400" },
                      { icon: Percent, text: "Auto Tax Calculation", color: "text-blue-400" },
                      { icon: Award, text: "Professional Look", color: "text-purple-400" },
                      { icon: Sparkles, text: "Unlimited Receipts", color: "text-amber-400" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                        <item.icon size={16} className={item.color} />
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-72 bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] text-center backdrop-blur-sm">
                  <div className="inline-flex px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">
                    Recommended
                  </div>
                  <h4 className="text-2xl font-black text-white mb-2 tracking-tight">Free Forever</h4>
                  <p className="text-xs text-slate-500 mb-6 font-medium">No hidden fees. No credit cards. Just good business.</p>
                  
                  <button
                    onClick={handleRegister}
                    className="w-full group flex items-center justify-center gap-3 bg-emerald-500 text-black px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all active:scale-95 shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
                  >
                    Quick Setup
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // FORM FOR ESTABLISHED SHOPS
  return (
    <div className="bg-[#11141b] rounded-[2rem] border border-white/5 overflow-hidden transition-all duration-500">
      <SectionHeader 
        title="Your Shop Info" 
        details={hasBusinessInfo() ? "Details showing on your receipts" : "Tell us about your business"}
        icon={Building2} 
        sectionKey="businessInfo"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ 
          text: hasBusinessInfo() ? 'Live' : 'Action Needed', 
          className: hasBusinessInfo() ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400' 
        }}
      />
      
      {isExpanded && (
        <div className="p-6 space-y-6 border-t border-white/5 animate-in fade-in duration-500">
          {hasBusinessInfo() && !isEditing && (
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black">
                <Check size={18} strokeWidth={3} />
              </div>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Your shop is verified & active</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Shop Name *</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => handleInputChange('storeName', e.target.value)}
                  className={`w-full bg-white/[0.03] px-4 py-3 text-sm text-white border rounded-2xl transition-all focus:ring-2 focus:ring-emerald-500/50 outline-none ${
                    !canEdit() ? 'border-transparent opacity-60' : 'border-white/10 hover:border-white/20'
                  }`}
                  placeholder="e.g. Kola's Supermarket"
                  readOnly={!canEdit()}
                />
                {!canEdit() && <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Business Phone *</label>
              <input
                type="tel"
                value={formData.storePhone}
                onChange={(e) => handleInputChange('storePhone', e.target.value)}
                className={`w-full bg-white/[0.03] px-4 py-3 text-sm text-white border rounded-2xl transition-all outline-none ${
                  !canEdit() ? 'border-transparent opacity-60' : 'border-white/10'
                }`}
                placeholder="080 000 0000"
                readOnly={!canEdit()}
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Shop Address *</label>
              <input
                type="text"
                value={formData.storeAddress}
                onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                className={`w-full bg-white/[0.03] px-4 py-3 text-sm text-white border rounded-2xl transition-all outline-none ${
                  !canEdit() ? 'border-transparent opacity-60' : 'border-white/10'
                }`}
                placeholder="Block 14, Shop 2, Main Market..."
                readOnly={!canEdit()}
              />
            </div>

            {/* TIN & RC */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">TIN (Optional)</label>
              <input
                type="text"
                value={formData.tinNumber}
                onChange={(e) => handleInputChange('tinNumber', e.target.value)}
                className="w-full bg-white/[0.03] border-white/10 px-4 py-3 text-sm text-white border rounded-2xl outline-none"
                placeholder="Tax Number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">RC No (Optional)</label>
              <input
                type="text"
                value={formData.rcNumber}
                onChange={(e) => handleInputChange('rcNumber', e.target.value)}
                className="w-full bg-white/[0.03] border-white/10 px-4 py-3 text-sm text-white border rounded-2xl outline-none"
                placeholder="Registration Number"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-end pt-4 gap-3">
            {!isEditing && hasBusinessInfo() ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                <Edit2 size={14} /> Change Details
              </button>
            ) : isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="px-6 py-3 text-slate-500 text-xs font-black uppercase tracking-widest">Cancel</button>
                <button onClick={handleSave} className="px-8 py-3 bg-emerald-500 text-black rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Confirm Changes</button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessInfoSection;