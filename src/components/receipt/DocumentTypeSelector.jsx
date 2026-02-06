import React from 'react';
import { FileText } from 'lucide-react';

const getDocumentConfig = (type) => {
  switch(type) {
    case 'invoice':
      return {
        color: 'bg-purple-100 text-purple-600',
        icon: '📄',
        title: 'Invoice',
        description: 'For billing with payment terms',
        features: ['Due Date', 'PO Number', 'Payment Terms']
      };
    case 'quote':
      return {
        color: 'bg-blue-100 text-blue-600',
        icon: '💰',
        title: 'Quote',
        description: 'For price estimates & proposals',
        features: ['Valid Until', 'Quote Number', 'Estimate']
      };
    case 'receipt':
    default:
      return {
        color: 'bg-green-100 text-green-600',
        icon: '🧾',
        title: 'Receipt',
        description: 'For completed payments',
        features: ['Payment Confirmation', 'Cashier', 'Immediate']
      };
  }
};

const DocumentTypeSelector = ({ receiptType, onTypeChange }) => {
  const docConfig = getDocumentConfig(receiptType);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <FileText className="inline mr-2" size={16} />
        Document Type
      </label>
      
      {/* Selected Type Indicator */}
      <div className={`p-3 rounded-lg mb-4 ${docConfig.color} border border-opacity-20`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{docConfig.icon}</span>
            <div>
              <h4 className="font-bold text-gray-800">{docConfig.title}</h4>
              <p className="text-xs text-gray-600">{docConfig.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-gray-500">Features:</div>
            <div className="text-xs text-gray-700">
              {docConfig.features.join(' • ')}
            </div>
          </div>
        </div>
      </div>

      {/* Type Selection */}
      <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
        {['receipt', 'invoice', 'quote'].map(type => {
          const config = getDocumentConfig(type);
          return (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 rounded-lg font-medium capitalize transition-all ${
                receiptType === type
                  ? `${config.color.replace('100', '600')} text-white shadow-sm`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{config.icon}</span>
              <span className="text-sm">{type}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentTypeSelector;