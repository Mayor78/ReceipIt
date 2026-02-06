import React from 'react';
import { CreditCard, Tag, Calendar } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { FileText } from 'lucide-react';

const getDocumentConfig = (type) => {
  switch(type) {
    case 'invoice':
      return {
        color: 'bg-purple-100',
        textColor: 'text-purple-600'
      };
    case 'quote':
      return {
        color: 'bg-blue-100',
        textColor: 'text-blue-600'
      };
    case 'receipt':
    default:
      return {
        color: 'bg-green-100',
        textColor: 'text-green-600'
      };
  }
};

const DocumentDetailsSection = ({ 
  isExpanded, 
  onToggle, 
  data, 
  onUpdate 
}) => {
  const docConfig = getDocumentConfig(data.receiptType);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <SectionHeader 
        title="Document Details" 
        icon={FileText}
        sectionKey="documentDetails"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ 
          text: data.receiptType === 'invoice' ? 'Invoice' : 
                data.receiptType === 'quote' ? 'Quote' : 'Receipt',
          className: `${docConfig.color} ${docConfig.textColor}`
        }}
      />
      
      {isExpanded && (
        <div className="pt-4 space-y-4 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                {data.receiptType === 'invoice' ? 'Invoice #' : 
                 data.receiptType === 'quote' ? 'Quote #' : 'Receipt #'} *
              </label>
              <input
                type="text"
                value={data.receiptNumber}
                onChange={(e) => onUpdate('receiptNumber', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={
                  data.receiptType === 'invoice' ? 'INV2024/0001' :
                  data.receiptType === 'quote' ? 'QTE2024/0001' :
                  'RCT000001'
                }
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Cashier/Sales Person *
              </label>
              <input
                type="text"
                value={data.cashierName}
                onChange={(e) => onUpdate('cashierName', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Chidi Okafor"
              />
            </div>
          </div>

          {/* Invoice Specific Fields */}
          {data.receiptType === 'invoice' && (
            <div className="space-y-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 text-purple-700 mb-2">
                <CreditCard size={16} />
                <span className="text-sm font-medium">Invoice Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    PO Number
                  </label>
                  <input
                    type="text"
                    value={data.poNumber}
                    onChange={(e) => onUpdate('poNumber', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="PO2024/0001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={data.dueDate}
                    onChange={(e) => onUpdate('dueDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Terms
                  </label>
                  <select
                    value={data.termsAndConditions || 'Net 30'}
                    onChange={(e) => onUpdate('termsAndConditions', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  >
                    <option>Net 15</option>
                    <option>Net 30</option>
                    <option>Net 45</option>
                    <option>Due on Receipt</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Quote Specific Fields */}
          {data.receiptType === 'quote' && (
            <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 text-blue-700 mb-2">
                <Tag size={16} />
                <span className="text-sm font-medium">Quote Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={data.dueDate}
                    onChange={(e) => onUpdate('dueDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Quote Terms
                  </label>
                  <select
                    value={data.termsAndConditions || '30 Days'}
                    onChange={(e) => onUpdate('termsAndConditions', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  >
                    <option>7 Days</option>
                    <option>15 Days</option>
                    <option>30 Days</option>
                    <option>60 Days</option>
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