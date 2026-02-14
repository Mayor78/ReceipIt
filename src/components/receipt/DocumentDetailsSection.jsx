import React, { useState } from 'react';
import { CreditCard, Tag, Calendar, User, ChevronDown, FileText, ClipboardCheck, Sparkles } from 'lucide-react';
import SectionHeader from './SectionHeader';

const getDocumentConfig = (type) => {
  switch(type) {
    case 'invoice':
      return {
        color: 'bg-purple-500/10 border-purple-500/20',
        textColor: 'text-purple-400',
        accent: 'bg-purple-500'
      };
    case 'quote':
      return {
        color: 'bg-blue-500/10 border-blue-500/20',
        textColor: 'text-blue-400',
        accent: 'bg-blue-500'
      };
    case 'receipt':
    default:
      return {
        color: 'bg-emerald-500/10 border-emerald-500/20',
        textColor: 'text-emerald-400',
        accent: 'bg-emerald-500'
      };
  }
};

const PREDEFINED_ROLES = [
  { value: 'owner', label: 'Owner' },
  { value: 'manager', label: 'Manager' },
  { value: 'cashier', label: 'Cashier' },
  { value: 'sales_person', label: 'Sales Person' },
  { value: 'admin', label: 'Admin' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'custom', label: 'Other...' }
];

const DocumentDetailsSection = ({ 
  isExpanded, 
  onToggle, 
  data, 
  onUpdate 
}) => {
  const docConfig = getDocumentConfig(data.receiptType);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customRole, setCustomRole] = useState('');
  
  // Logic preserved: Role initialization
  const getSelectedRole = () => {
    if (!data.cashierName) return '';
    const predefined = PREDEFINED_ROLES.find(role => 
      role.label.toLowerCase() === data.cashierName.toLowerCase() ||
      role.value === data.cashierName.toLowerCase()
    );
    return predefined ? predefined.value : 'custom';
  };

  const handleRoleChange = (roleValue) => {
    if (roleValue === 'custom') {
      setShowCustomInput(true);
      if (data.cashierName && !PREDEFINED_ROLES.some(r => 
        r.label.toLowerCase() === data.cashierName.toLowerCase())) {
        setCustomRole(data.cashierName);
      }
    } else {
      setShowCustomInput(false);
      const selectedRole = PREDEFINED_ROLES.find(r => r.value === roleValue);
      if (selectedRole) onUpdate('cashierName', selectedRole.label);
    }
  };

  const handleCustomRoleSave = () => {
    if (customRole.trim()) {
      onUpdate('cashierName', customRole.trim());
      setShowCustomInput(false);
    }
  };

  const handleCustomRoleKeyPress = (e) => { if (e.key === 'Enter') handleCustomRoleSave(); };

  const handleCancelCustom = () => {
    setShowCustomInput(false);
    setCustomRole('');
    const selectedRole = getSelectedRole();
    if (selectedRole && selectedRole !== 'custom') {
      const role = PREDEFINED_ROLES.find(r => r.value === selectedRole);
      if (role) onUpdate('cashierName', role.label);
    }
  };

  return (
    <div className="bg-[#11141b] rounded-[1rem] px-3  border border-white/5 overflow-hidden transition-all duration-300 shadow-xl">
      <SectionHeader 
        title="Numbering & Staff" 
        details="Who is issuing this?"
        icon={ClipboardCheck}
        sectionKey="documentDetails"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ 
          text: data.receiptType === 'invoice' ? 'Invoice' : 
                data.receiptType === 'quote' ? 'Quote' : 'Receipt',
          className: `${docConfig.color} ${docConfig.textColor} border`
        }}
      />
      
      {isExpanded && (
        <div className="p-5 sm:p-7 space-y-6 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Document Number */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                {data.receiptType === 'invoice' ? 'Invoice Number' : 
                 data.receiptType === 'quote' ? 'Quote Number' : 'Receipt Number'} *
              </label>
              <div className="group relative">
                <input
                  type="text"
                  value={data.receiptNumber}
                  onChange={(e) => onUpdate('receiptNumber', e.target.value)}
                  className="w-full bg-white/[0.03] border-white/10 px-4 py-3.5 text-sm text-white border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  placeholder={
                    data.receiptType === 'invoice' ? 'e.g. INV-001' :
                    data.receiptType === 'quote' ? 'e.g. QT-100' : 'e.g. RCT-500'
                  }
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100 transition-opacity">
                   <Sparkles size={14} className={docConfig.textColor} />
                </div>
              </div>
            </div>
            
            {/* Staff Member */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                Who is issuing this? *
              </label>
              
              {!showCustomInput ? (
                <div className="space-y-3">
                  <div className="relative">
                    <select
                      value={getSelectedRole()}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="w-full bg-white/[0.03] border-white/10 px-4 py-3.5 text-sm text-white border rounded-2xl outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500/30 transition-all"
                    >
                      <option value="" className="bg-[#11141b]">Select Staff Position...</option>
                      {PREDEFINED_ROLES.map((role) => (
                        <option key={role.value} value={role.value} className="bg-[#11141b]">
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>

                  {/* Current Active User Label */}
                  {data.cashierName && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Active: {data.cashierName}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      onKeyPress={handleCustomRoleKeyPress}
                      placeholder="e.g. Assistant Manager"
                      className="flex-1 bg-white/[0.03] border-emerald-500/40 px-4 py-3.5 text-sm text-white border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50"
                      autoFocus
                    />
                    <button onClick={handleCustomRoleSave} className="bg-emerald-500 text-black px-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-400">Save</button>
                    <button onClick={handleCancelCustom} className="bg-white/5 text-slate-400 px-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10">✕</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Type-Specific Smart Cards */}
          {(data.receiptType === 'invoice' || data.receiptType === 'quote') && (
            <div className={`rounded-3xl p-5 border shadow-inner ${docConfig.color}`}>
              <div className={`flex items-center gap-2 mb-4 font-black text-xs uppercase tracking-[0.15em] ${docConfig.textColor}`}>
                {data.receiptType === 'invoice' ? <CreditCard size={16} /> : <Tag size={16} />}
                <span>{data.receiptType} Specifics</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.receiptType === 'invoice' && (
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Order Ref (PO)</label>
                    <input
                      type="text"
                      value={data.poNumber}
                      onChange={(e) => onUpdate('poNumber', e.target.value)}
                      className="w-full bg-white/40 border-white/20 px-3 py-2 text-sm text-slate-800 border rounded-xl outline-none focus:bg-white/60 transition-all"
                      placeholder="PO-001"
                    />
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {data.receiptType === 'invoice' ? 'Payment Due Date' : 'Offer Valid Until'}
                  </label>
                  <input
                    type="date"
                    value={data.dueDate}
                    onChange={(e) => onUpdate('dueDate', e.target.value)}
                    className="w-full bg-white/40 border-white/20 px-3 py-2 text-sm text-slate-800 border rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Deadline Terms</label>
                  <select
                    value={data.termsAndConditions || 'Net 30'}
                    onChange={(e) => onUpdate('termsAndConditions', e.target.value)}
                    className="w-full bg-white/40 border-white/20 px-3 py-2 text-sm text-slate-800 border rounded-xl outline-none appearance-none"
                  >
                    {data.receiptType === 'invoice' ? (
                      <>
                        <option>Due on Receipt</option>
                        <option>Net 15</option>
                        <option>Net 30</option>
                      </>
                    ) : (
                      <>
                        <option>7 Days</option>
                        <option>15 Days</option>
                        <option>30 Days</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentDetailsSection;