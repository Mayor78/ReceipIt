import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SectionHeader = ({ 
  title, 
  icon: Icon, 
  sectionKey, 
  children, 
  badge, 
  isExpanded,
  onClick,
  details
}) => {
  const getSectionColor = (key) => {
    switch(key) {
      case 'businessInfo': return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' };
      case 'documentDetails': return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' };
      case 'customerInfo': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
      case 'items': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
      case 'taxDiscount': return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' };
      case 'payment': return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' };
      default: return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' };
    }
  };

  const colors = getSectionColor(sectionKey);

  return (
    <div 
      className={`flex items-center justify-between cursor-pointer p-4 sm:p-6 transition-all duration-300 select-none ${isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Neon Icon Container */}
        <div className={`p-2.5 rounded-xl border ${colors.bg} ${colors.border} shadow-inner transition-transform duration-300 ${isExpanded ? 'scale-110' : 'scale-100'}`}>
          {Icon && <Icon className={`${colors.text} drop-shadow-[0_0_8px_rgba(var(--tw-color-current),0.5)]`} size={20} />}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">{title}</h3>
            {badge && (
              <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md border animate-in fade-in zoom-in-95 ${badge.className}`}>
                {badge.text}
              </span>
            )}
          </div>
          
          {details && (
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">
              {details}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Slot for buttons like "Add Item" */}
        <div onClick={(e) => e.stopPropagation()} className="contents">
          {children}
        </div>
        
        {/* Toggle Arrow */}
        <div className={`p-1.5 rounded-full transition-all duration-500 ${isExpanded ? 'bg-white/10 rotate-0' : 'bg-transparent rotate-180'}`}>
          <ChevronUp 
            className={`transition-colors duration-300 ${isExpanded ? 'text-white' : 'text-slate-600'}`} 
            size={18} 
            strokeWidth={3}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;