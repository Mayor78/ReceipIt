import React from 'react';
import { getTemplateConfig } from '../../data/receiptTemplates';

const ModernReceipt = ({
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
  const config = getTemplateConfig('modern');

  return (
    <div 
      className="modern-receipt p-8 max-w-md mx-auto"
      style={{
        fontFamily: config.fontFamily,
        backgroundColor: config.bgColor,
        borderRadius: config.borderRadius,
        boxShadow: config.shadow,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      {/* Header with gradient */}
      <div 
        className="text-center mb-8 pb-6 border-b"
        style={{ borderColor: `${config.primaryColor}20` }}
      >
        {companyLogo && (
          <div className="mb-4">
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="h-16 mx-auto rounded-xl shadow-md"
            />
          </div>
        )}
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ color: config.primaryColor }}
        >
          {receiptData.storeName}
        </h1>
        <p className="text-gray-600">{receiptData.storeAddress}</p>
        {receiptData.storePhone && (
          <p className="text-sm text-gray-500 mt-1">📞 {receiptData.storePhone}</p>
        )}
      </div>

      {/* Receipt Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-lg bg-gray-50">
        <div>
          <p className="text-xs text-gray-500">Receipt #</p>
          <p className="font-bold">{receiptData.receiptNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Date & Time</p>
          <p className="font-bold">{receiptData.date} {receiptData.time}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Cashier</p>
          <p className="font-medium">{receiptData.cashierName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Type</p>
          <p className="font-medium uppercase">{receiptData.receiptType}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg" style={{ color: config.primaryColor }}>
            Items
          </h2>
          <span className="text-sm text-gray-500">
            {receiptData.items.length} items
          </span>
        </div>
        
        <div className="space-y-3">
          {receiptData.items.map((item) => (
            <div 
              key={item.id} 
              className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">
                  {item.quantity} × {formatNaira(item.price)}
                  {item.unit && ` (${item.unit})`}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{formatNaira(item.price * item.quantity)}</div>
                <div className="text-xs text-gray-500">
                  {item.unit || 'unit'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between py-2 border-b">
          <span>Subtotal</span>
          <span className="font-medium">{formatNaira(calculateSubtotal())}</span>
        </div>
        
        {receiptData.includeDiscount && receiptData.discount > 0 && (
          <div className="flex justify-between py-2 border-b text-red-600">
            <span>Discount</span>
            <span className="font-medium">-{formatNaira(calculateDiscount())}</span>
          </div>
        )}
        
        {receiptData.includeVAT && (
          <div className="flex justify-between py-2 border-b">
            <span>VAT ({receiptData.vatRate}%)</span>
            <span className="font-medium">{formatNaira(calculateVAT())}</span>
          </div>
        )}
        
        <div 
          className="flex justify-between py-3 mt-2 text-lg font-bold rounded-lg px-4"
          style={{ 
            backgroundColor: `${config.primaryColor}10`,
            color: config.primaryColor
          }}
        >
          <span>TOTAL</span>
          <span>{formatNaira(calculateTotal())}</span>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: `${config.primaryColor}20` }}>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-medium">{receiptData.paymentMethod}</span>
        </div>
        {receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 && (
          <>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-medium">{formatNaira(receiptData.amountPaid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Change:</span>
              <span className="font-bold">{formatNaira(calculateChange())}</span>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="text-center pt-6 border-t" style={{ borderColor: `${config.primaryColor}20` }}>
        {receiptData.customerNotes && (
          <div className="mb-4 p-3 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 italic">{receiptData.customerNotes}</p>
          </div>
        )}
        
        {receiptData.includeSignature && (
          <div className="my-4">
            <div className="font-medium mb-2">Authorized Signature</div>
            {receiptData.signatureData ? (
              <img 
                src={receiptData.signatureData} 
                alt="Signature" 
                className="h-12 mx-auto border rounded"
              />
            ) : (
              <div className="h-0.5 w-32 mx-auto bg-gray-400" />
            )}
          </div>
        )}
        
        <div 
          className="text-sm font-medium mt-4"
          style={{ color: config.primaryColor }}
        >
          {receiptData.footerMessage || 'Thank you for your business!'}
        </div>
        
        {receiptData.includeTerms && receiptData.termsAndConditions && (
          <div className="mt-4 text-xs text-gray-500">
            <div className="font-medium mb-1">Terms & Conditions:</div>
            <p className="text-left">{receiptData.termsAndConditions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernReceipt;