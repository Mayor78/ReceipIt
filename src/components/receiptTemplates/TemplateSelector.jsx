import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useReceipt } from '../../context/ReceiptContext';
import { receiptTemplates } from '../../data/receiptTemplates';

const TemplateSelector = () => {
  const { selectedTemplate, changeTemplate } = useReceipt();

  return (
    <div className="space-y-4">
      {/* Header with subtle flair */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles size={16} className="text-green-600" />
          <h3 className="text-sm font-semibold text-gray-900">Pick Your Style</h3>
        </div>
        <span className="text-xs text-gray-500">
          {receiptTemplates.length} templates
        </span>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {receiptTemplates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          
          return (
            <button
              key={template.id}
              onClick={() => changeTemplate(template.id)}
              className={`
                group relative p-4 rounded-xl border-2 transition-all text-left
                ${isSelected 
                  ? 'border-green-600 bg-green-50 shadow-sm' 
                  : 'border-gray-200 bg-white hover:border-green-200 hover:shadow-sm'
                }
              `}
            >
              {/* Template Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className={`text-sm font-semibold mb-0.5 ${isSelected ? 'text-green-900' : 'text-gray-900'}`}>
                    {template.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {template.category}
                  </p>
                </div>
                
                {/* Animated Check Mark */}
                {isSelected && (
                  <div className="bg-green-600 text-white p-1 rounded-full animate-scale-in">
                    <Check size={12} />
                  </div>
                )}
              </div>
              
              {/* Color Accent Strip with gradient */}
              <div 
                className="h-1.5 rounded-full mb-3 shadow-sm"
                style={{ 
                  background: `linear-gradient(90deg, ${template.previewColor}, ${template.previewColor}dd)`
                }}
              />
              
              {/* Mini Receipt Preview */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Coffee</span>
                  <span className="font-medium">₦1,500</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Lunch</span>
                  <span className="font-medium">₦2,300</span>
                </div>
                <div className="border-t border-dashed border-gray-300 pt-1.5 mt-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Total</span>
                    <span 
                      className="font-bold text-sm"
                      style={{ color: template.previewColor }}
                    >
                      ₦3,800
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Subtle hover indicator */}
              {!isSelected && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl transition-all group-hover:h-1"
                  style={{ backgroundColor: template.previewColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Template Details */}
      {selectedTemplate && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-green-900">
                {receiptTemplates.find(t => t.id === selectedTemplate)?.name}
              </p>
              <p className="text-xs text-green-700 mt-0.5">
                {receiptTemplates.find(t => t.id === selectedTemplate)?.description}
              </p>
            </div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {receiptTemplates
              .find(t => t.id === selectedTemplate)
              ?.features.map((feature, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 text-xs font-medium bg-white border border-green-200 rounded-full text-green-800 shadow-sm"
                >
                  {feature}
                </span>
              ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TemplateSelector;