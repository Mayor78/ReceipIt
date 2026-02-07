import React from 'react';
import { getTemplateConfig } from '../../data/receiptTemplates';

const ElegantReceipt = ({
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
  const config = getTemplateConfig('elegant');

  return (
    <div 
      className="elegant-receipt p-8 max-w-md mx-auto"
      style={{
        fontFamily: config.fontFamily,
        backgroundColor: config.bgColor,
        borderRadius: config.borderRadius,
        boxShadow: config.shadow,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      {/* Decorative Header */}
      <div className="relative mb-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="px-4 bg-white">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                className="h-20 mx-auto"
              />
            ) : (
              <h1 
                className="text-3xl font-serif font-bold"
                style={{ color: config.primaryColor }}
              >
                {receiptData.storeName}
              </h1>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Info in elegant layout */}
      <div className="mb-10">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-2">RECEIPT</p>
          <h2 className="text-2xl font-serif font-bold mb-4">{receiptData.receiptType.toUpperCase()}</h2>
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <div>
              <p className="font-medium">No: {receiptData.receiptNumber}</p>
            </div>
            <div>
              <p>{receiptData.date}</p>
              <p className="text-xs">{receiptData.time}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Attended By</p>
            <p className="font-medium">{receiptData.cashierName}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Location</p>
            <p className="font-medium">{receiptData.storeAddress}</p>
          </div>
        </div>
      </div>

      {/* Items with elegant styling */}
      <div className="mb-10">
        <div className="mb-6">
          <h3 className="text-lg font-serif font-bold mb-4 text-center">Items Purchased</h3>
        </div>
        
        <div className="space-y-4">
          {receiptData.items.map((item, index) => (
            <div 
              key={item.id} 
              className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span 
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${config.primaryColor}20`,
                      color: config.primaryColor
                    }}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.unit && (
                      <div className="text-xs text-gray-500">{item.unit}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{formatNaira(item.price * item.quantity)}</div>
                <div className="text-xs text-gray-500">
                  {item.quantity} × {formatNaira(item.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calculation Section */}
      <div className="mb-10 space-y-4">
        <div className="flex justify-between py-2 border-b border-gray-200">
          <span className="text-gray-700">Subtotal</span>
          <span className="font-medium">{formatNaira(calculateSubtotal())}</span>
        </div>
        
        {receiptData.includeDiscount && receiptData.discount > 0 && (
          <div className="flex justify-between py-2 border-b border-gray-200 text-red-600">
            <span>Discount</span>
            <span className="font-medium">-{formatNaira(calculateDiscount())}</span>
          </div>
        )}
        
        {receiptData.includeVAT && (
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span>VAT ({receiptData.vatRate}%)</span>
            <span className="font-medium">{formatNaira(calculateVAT())}</span>
          </div>
        )}
        
        <div className="mt-6">
          <div 
            className="flex justify-between items-center py-4 px-6 rounded-xl"
            style={{ 
              backgroundColor: `${config.primaryColor}10`,
              border: `1px solid ${config.primaryColor}30`
            }}
          >
            <span className="text-xl font-serif font-bold">Total</span>
            <span 
              className="text-2xl font-serif font-bold"
              style={{ color: config.primaryColor }}
            >
              {formatNaira(calculateTotal())}
            </span>
          </div>
        </div>
      </div>

      {/* Payment and Signature */}
      <div className="mb-10">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-2">Payment Method</p>
            <p className="font-medium">{receiptData.paymentMethod}</p>
            {receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500">Paid: {formatNaira(receiptData.amountPaid)}</p>
                <p className="text-xs text-gray-500">Change: {formatNaira(calculateChange())}</p>
              </div>
            )}
          </div>
          
          {receiptData.includeSignature && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Signature</p>
              {receiptData.signatureData ? (
                <img 
                  src={receiptData.signatureData} 
                  alt="Signature" 
                  className="h-12 border rounded"
                />
              ) : (
                <div className="h-12 border-b-2 border-gray-400" />
              )}
            </div>
          )}
        </div>

        {receiptData.customerNotes && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Notes</p>
            <p className="italic text-gray-600">{receiptData.customerNotes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-gray-300 text-center">
        <div 
          className="text-xl font-serif font-bold mb-2"
          style={{ color: config.primaryColor }}
        >
          {receiptData.footerMessage || 'Thank You'}
        </div>
        <p className="text-sm text-gray-500">We value your patronage</p>
        
        {receiptData.includeTerms && receiptData.termsAndConditions && (
          <div className="mt-8 text-xs text-gray-500">
            <p className="font-bold mb-2">Terms:</p>
            <p>{receiptData.termsAndConditions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElegantReceipt;