import React from 'react';
import { CreditCard } from 'lucide-react';
import SectionHeader from './SectionHeader';

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

const PaymentSection = ({ 
  isExpanded, 
  onToggle, 
  data, 
  onUpdate 
}) => {
  const docConfig = getDocumentConfig(data.receiptType);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <SectionHeader 
        title="Payment" 
        icon={CreditCard} 
        sectionKey="payment"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ 
          text: data.receiptType === 'invoice' ? 'To Pay' : 
                data.receiptType === 'quote' ? 'Estimate' : 'Paid',
          className: `${docConfig.color} ${docConfig.textColor}`
        }}
      />
      
      {isExpanded && (
        <div className="pt-4 space-y-4 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                {data.receiptType === 'invoice' ? 'Payment Terms' : 'Payment Method'} *
              </label>
              <select
                value={data.paymentMethod}
                onChange={(e) => onUpdate('paymentMethod', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {data.receiptType === 'invoice' ? (
                  <>
                    <option value="Net 30">Net 30 Days</option>
                    <option value="Net 15">Net 15 Days</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </>
                ) : data.receiptType === 'quote' ? (
                  <>
                    <option value="Estimate">Estimate Only</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="POS">POS</option>
                  </>
                ) : (
                  <>
                    <option value="Cash">Cash</option>
                    <option value="POS">POS (Card)</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Cheque">Cheque</option>
                  </>
                )}
              </select>
            </div>

            {data.receiptType === 'receipt' && data.paymentMethod === 'Cash' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Amount Paid (₦)
                </label>
                <input
                  type="number"
                  value={data.amountPaid}
                  onChange={(e) => onUpdate('amountPaid', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  step="100"
                  min="0"
                  placeholder="0"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;