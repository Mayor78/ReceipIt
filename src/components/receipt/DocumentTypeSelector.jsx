import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

const getDocumentConfig = (type) => {
  switch(type) {
    case 'invoice':
      return {
        activeColor: 'bg-purple-600 text-white',
        lightColor: 'bg-purple-50 text-purple-700 border-purple-100',
        icon: '📄',
        title: 'Invoice',
        description: 'Professional billing & terms',
        features: ['Due Date', 'PO Num']
      };
    case 'quote':
      return {
        activeColor: 'bg-blue-600 text-white',
        lightColor: 'bg-blue-50 text-blue-700 border-blue-100',
        icon: '💰',
        title: 'Quote',
        description: 'Price estimates & proposals',
        features: ['Valid Until', 'Estimate']
      };
    case 'receipt':
    default:
      return {
        activeColor: 'bg-green-600 text-white',
        lightColor: 'bg-green-50 text-green-700 border-green-100',
        icon: '🧾',
        title: 'Receipt',
        description: 'Proof of completed payment',
        features: ['Immediate', 'Confirmation']
      };
  }
};

const DocumentTypeSelector = ({ receiptType, onTypeChange }) => {
  const docConfig = getDocumentConfig(receiptType);

  return (
    <div className="w-full bg-white/50 backdrop-blur-sm p-4 sm:p-5 transition-all">
      <div className="flex items-center justify-between mb-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center">
          <FileText className="mr-2" size={14} />
          Select Document Type
        </label>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
          Step 1 of 4
        </span>
      </div>
      
      {/* Selected Type Hero Card */}
      <div className={`p-4 rounded-[22px] mb-5 border transition-all duration-500 ${docConfig.lightColor} shadow-sm`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
              {docConfig.icon}
            </div>
            <div>
              <h4 className="font-black text-gray-900 leading-tight">{docConfig.title}</h4>
              <p className="text-[11px] font-medium opacity-80">{docConfig.description}</p>
            </div>
          </div>
          
          <div className="flex items-center sm:text-right border-t sm:border-t-0 border-current border-opacity-10 pt-2 sm:pt-0">
            <div className="flex-1">
              <div className="text-[9px] font-black uppercase tracking-tighter opacity-60">Key Features</div>
              <div className="text-[10px] font-bold whitespace-nowrap">
                {docConfig.features.join(' • ')}
              </div>
            </div>
            <ChevronRight size={16} className="ml-2 opacity-40 hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Type Selection Tabs */}
      <div className="flex gap-2 p-1.5 bg-gray-100/80 rounded-[20px] overflow-x-auto no-scrollbar">
        {['receipt', 'invoice', 'quote'].map(type => {
          const config = getDocumentConfig(type);
          const isActive = receiptType === type;
          
          return (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`flex-1 min-w-[100px] flex items-center justify-center space-x-2 py-2.5 rounded-[15px] font-bold capitalize transition-all duration-300 ${
                isActive
                  ? `${config.activeColor} shadow-md scale-100`
                  : 'bg-transparent text-gray-500 hover:text-gray-700 scale-95'
              }`}
            >
              <span className="text-base">{config.icon}</span>
              <span className="text-xs">{type}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentTypeSelector;