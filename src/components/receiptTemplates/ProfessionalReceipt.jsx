import React from 'react';
import { getTemplateConfig } from '../../data/receiptTemplates';

const ProfessionalReceipt = ({
  receiptData,
  companyLogo,
  formatNaira,
  calculateSubtotal,
  calculateDiscount,
  calculateVAT,
  calculateTotal,
  calculateChange,
  isMobile
}) => {
  const config = getTemplateConfig('professional');

  return (
    <div 
      className="professional-receipt p-8 max-w-md mx-auto"
      style={{
        fontFamily: config.fontFamily,
        backgroundColor: config.bgColor,
        borderRadius: config.borderRadius,
        boxShadow: config.shadow,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      {/* Company Header */}
      <div className="text-center mb-8">
        {companyLogo && (
          <div className="mb-6">
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="h-20 mx-auto"
            />
          </div>
        )}
        
        <div className="mb-6">
          <h1 
            className="text-2xl font-bold uppercase tracking-wide mb-2"
            style={{ color: config.primaryColor }}
          >
            {receiptData.storeName}
          </h1>
          <div className="h-1 w-24 mx-auto mb-3" style={{ backgroundColor: config.primaryColor }} />
          <p className="text-gray-700">{receiptData.storeAddress}</p>
          {receiptData.storePhone && (
            <p className="text-gray-600 mt-1">Phone: {receiptData.storePhone}</p>
          )}
          {receiptData.tinNumber && (
            <p className="text-sm text-gray-500 mt-1">TIN: {receiptData.tinNumber}</p>
          )}
        </div>
      </div>

      {/* Receipt Details */}
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs font-medium text-gray-500 mb-1">RECEIPT NUMBER</p>
            <p className="font-bold text-lg">{receiptData.receiptNumber}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded text-right">
            <p className="text-xs font-medium text-gray-500 mb-1">DATE & TIME</p>
            <p className="font-bold">{receiptData.date}</p>
            <p className="text-sm">{receiptData.time}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">Cashier</p>
            <p className="font-medium">{receiptData.cashierName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Receipt Type</p>
            <p className="font-medium uppercase">{receiptData.receiptType}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr 
                className="border-b-2"
                style={{ borderColor: config.primaryColor }}
              >
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Description</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Qty</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Price</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {receiptData.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 px-2">
                    <div className="font-medium">{item.name}</div>
                    {item.unit && (
                      <div className="text-xs text-gray-500">{item.unit}</div>
                    )}
                  </td>
                  <td className="text-center py-3 px-2">
                    <div className="font-medium">{item.quantity}</div>
                  </td>
                  <td className="text-center py-3 px-2">
                    <div className="font-medium">{formatNaira(item.price)}</div>
                  </td>
                  <td className="text-right py-3 px-2">
                    <div className="font-bold">{formatNaira(item.price * item.quantity)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculation Section */}
      <div className="mb-8 space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatNaira(calculateSubtotal())}</span>
        </div>
        
        {receiptData.includeDiscount && receiptData.discount > 0 && (
          <div className="flex justify-between items-center py-2 text-red-600">
            <span>Discount ({receiptData.discount}%)</span>
            <span className="font-medium">-{formatNaira(calculateDiscount())}</span>
          </div>
        )}
        
        {receiptData.includeVAT && (
          <div className="flex justify-between items-center py-2">
            <span>VAT ({receiptData.vatRate}%)</span>
            <span className="font-medium">{formatNaira(calculateVAT())}</span>
          </div>
        )}
        
        <div className="h-px bg-gray-300 my-2" />
        
        <div 
          className="flex justify-between items-center py-3 px-4 rounded-lg"
          style={{ 
            backgroundColor: `${config.primaryColor}10`,
            border: `2px solid ${config.primaryColor}30`
          }}
        >
          <span className="text-lg font-bold">TOTAL AMOUNT</span>
          <span 
            className="text-2xl font-bold"
            style={{ color: config.primaryColor }}
          >
            {formatNaira(calculateTotal())}
          </span>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-8">
        <div 
          className="p-4 rounded-lg border"
          style={{ borderColor: `${config.primaryColor}20` }}
        >
          <h3 className="font-bold mb-3" style={{ color: config.primaryColor }}>
            PAYMENT DETAILS
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Method:</span>
              <span className="font-medium">{receiptData.paymentMethod}</span>
            </div>
            {receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium">{formatNaira(receiptData.amountPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Change Due:</span>
                  <span className="font-bold">{formatNaira(calculateChange())}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-gray-200">
        {receiptData.customerNotes && (
          <div className="mb-6">
            <h4 className="font-bold text-gray-700 mb-2">Customer Notes</h4>
            <p className="text-gray-600 italic">{receiptData.customerNotes}</p>
          </div>
        )}
        
        {receiptData.includeSignature && (
          <div className="mb-6">
            <h4 className="font-bold text-gray-700 mb-4">AUTHORIZED SIGNATURE</h4>
            <div className="flex items-center justify-between">
              <div>
                {receiptData.signatureData ? (
                  <img 
                    src={receiptData.signatureData} 
                    alt="Signature" 
                    className="h-16"
                  />
                ) : (
                  <div className="h-12 w-48 border-b-2 border-gray-400" />
                )}
                <p className="text-xs text-gray-500 mt-2">Signature</p>
              </div>
              <div className="text-right">
                <div className="h-12 w-48 border-b-2 border-gray-400" />
                <p className="text-xs text-gray-500 mt-2">Date</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <div 
            className="font-bold text-lg mb-2"
            style={{ color: config.primaryColor }}
          >
            {receiptData.footerMessage || 'THANK YOU FOR YOUR BUSINESS'}
          </div>
          <p className="text-sm text-gray-500">We appreciate your patronage</p>
          
          {receiptData.includeTerms && receiptData.termsAndConditions && (
            <div className="mt-6 text-xs text-gray-500 text-left">
              <p className="font-bold mb-1">Terms & Conditions:</p>
              <p className="leading-relaxed">{receiptData.termsAndConditions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalReceipt;