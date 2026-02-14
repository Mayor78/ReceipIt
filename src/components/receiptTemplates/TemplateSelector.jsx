import React from 'react';
import { Check, Sparkles, Layout, Zap } from 'lucide-react';
import { useReceipt } from '../../context/ReceiptContext';
import { receiptTemplates } from '../../data/receiptTemplates';

const TemplateSelector = () => {
  const { selectedTemplate, changeTemplate } = useReceipt();

  return (
    <div className="space-y-6">
      {/* Header with Cyber Accent */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Sparkles size={16} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Interface Skins</h3>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Select visual output</p>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-black text-slate-400 border border-white/5">
          {receiptTemplates.length} MODULES
        </span>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 gap-4">
        {receiptTemplates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          
          return (
            <button
              key={template.id}
              onClick={() => changeTemplate(template.id)}
              className={`
                group relative p-4 rounded-2xl border transition-all duration-300 text-left overflow-hidden
                ${isSelected 
                  ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                  : 'border-white/5 bg-[#0d1117] hover:border-white/20'
                }
              `}
            >
              {/* Active Glow Effect */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-[30px] -mr-8 -mt-8" />
              )}

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex-1">
                  <h4 className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>
                    {template.name}
                  </h4>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                    {template.category}
                  </p>
                </div>
                
                {isSelected && (
                  <div className="bg-blue-500 text-black p-1 rounded-lg animate-scale-in">
                    <Check size={10} strokeWidth={4} />
                  </div>
                )}
              </div>
              
              {/* Color Accent Strip */}
              <div 
                className="h-1 rounded-full mb-4 relative z-10"
                style={{ 
                  background: `linear-gradient(90deg, ${template.previewColor}, ${template.previewColor}66)`,
                  boxShadow: isSelected ? `0 0 10px ${template.previewColor}44` : 'none'
                }}
              />
              
              {/* Micro Data Simulation */}
              <div className="space-y-2 opacity-60 group-hover:opacity-100 transition-opacity relative z-10">
                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                  <span>ITEM_01</span>
                  <span className="text-slate-300 tabular-nums">₦1,500</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">TOTAL</span>
                  <span 
                    className="font-black text-[10px] tabular-nums"
                    style={{ color: template.previewColor }}
                  >
                    ₦3,800
                  </span>
                </div>
              </div>

              {/* Selection Border Glow */}
              {!isSelected && (
                <div 
                  className="absolute inset-x-0 bottom-0 h-0 transition-all group-hover:h-0.5 opacity-50"
                  style={{ backgroundColor: template.previewColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Detail Panel for Selected Template */}
      {selectedTemplate && (
        <div className="relative group overflow-hidden bg-gradient-to-br from-[#161b22] to-[#0d1117] rounded-3xl p-5 border border-white/10 shadow-2xl">
          {/* Subtle animated background icon */}
          <Layout className="absolute -right-4 -bottom-4 text-white/[0.02] rotate-12" size={100} />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
                <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                  {receiptTemplates.find(t => t.id === selectedTemplate)?.name} Active
                </p>
              </div>
              <Zap size={12} className="text-amber-500 fill-current" />
            </div>
            
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide leading-relaxed mb-4">
              {receiptTemplates.find(t => t.id === selectedTemplate)?.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {receiptTemplates
                .find(t => t.id === selectedTemplate)
                ?.features.map((feature, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 text-[8px] font-black uppercase tracking-widest bg-white/5 border border-white/10 rounded-full text-slate-300 hover:border-blue-500/50 transition-colors"
                  >
                    {feature}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
};

export default TemplateSelector;