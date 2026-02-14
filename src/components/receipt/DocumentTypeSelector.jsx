import React from "react";
import { Receipt, FileText, BadgeDollarSign } from 'lucide-react';

const TYPES = {
  receipt: {
    label: "Sales Receipt",
    icon: Receipt,
    active: "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    inactive: "text-slate-400 hover:text-white hover:bg-white/5",
  },
  invoice: {
    label: "Invoice",
    icon: FileText,
    active: "bg-purple-500 text-black shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    inactive: "text-slate-400 hover:text-white hover:bg-white/5",
  },
  quote: {
    label: "Price Quote",
    icon: BadgeDollarSign,
    active: "bg-blue-500 text-black shadow-[0_0_20_rgba(59,130,246,0.3)]",
    inactive: "text-slate-400 hover:text-white hover:bg-white/5",
  },
};

const DocumentTypeSelector = ({ receiptType, onTypeChange }) => {
  return (
    <div className="bg-[#1a1f26] rounded-[1rem] px-3  py-2 border border-white/5 shadow-inner">
      <div className="px-4 pt-2 pb-3 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Choose Paper Type
        </p>
        <div className="h-1 w-8 bg-white/10 rounded-full" />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {Object.entries(TYPES).map(([key, config]) => {
          const isActive = receiptType === key;
          const Icon = config.icon;

          return (
            <button
              key={key}
              onClick={() => onTypeChange(key)}
              className={`
                flex-1 flex items-center justify-center gap-3
                py-4 sm:py-3.5 px-4 rounded-[1.5rem] 
                text-xs font-black uppercase tracking-widest
                transition-all duration-300 transform active:scale-95
                ${
                  isActive
                    ? `${config.active}`
                    : `${config.inactive}`
                }
              `}
            >
              <Icon size={18} strokeWidth={2.5} />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentTypeSelector;