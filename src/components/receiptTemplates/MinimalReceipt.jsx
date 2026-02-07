import React from 'react';
import { getTemplateConfig } from '../../data/receiptTemplates';

const MinimalReceipt = ({
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
  const config = getTemplateConfig('minimal');

  return (
    <div 
      className="minimal-receipt p-6 max-w-md mx-auto"
      style={{
        fontFamily: config.fontFamily,
        backgroundColor: config.bgColor,
        borderRadius: config.borderRadius,
        boxShadow: config.shadow,
      }}
    >
      {/* Minimal Header */}
      <div className="text-center mb-8">
        {companyLogo && (
          <img 
            src={companyLogo} 
            alt="Logo" 
            className="h-12 mx-auto mb-3 opacity-80"
          />
        )}
        <h1 className="text-xl font-medium">{receiptData.storeName}</h1>
        <p className="text-sm text-gray-500 mt-1">{receiptData.storeAddress}</p>
      </div>

      {/* Simple Info */}
      <div className="mb-8 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">#{receiptData.receiptNumber}</span>
          <span className="text-gray-500">{receiptData.date}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{receiptData.receiptType}</span>
          <span className="text-gray-500">{receiptData.time}</span>
        </div>
      </div>

      {/* Items - Minimal */}
      <div className="mb-8">
        {receiptData.items.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b border-gray-100">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-gray-500">
                {item.quantity} × {formatNaira(item.price)}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatNaira(item.price * item.quantity)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Totals */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatNaira(calculateSubtotal())}</span>
        </div>
        
        {receiptData.includeDiscount && receiptData.discount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Discount</span>
            <span>-{formatNaira(calculateDiscount())}</span>
          </div>
        )}
        
        {receiptData.includeVAT && (
          <div className="flex justify-between">
            <span>VAT</span>
            <span>{formatNaira(calculateVAT())}</span>
          </div>
        )}
        
        <div className="flex justify-between font-bold pt-2 border-t">
          <span>Total</span>
          <span>{formatNaira(calculateTotal())}</span>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="text-center pt-4 border-t">
        <div className="text-sm text-gray-500 mb-2">
          {receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 && (
            <div className="mb-1">
              Paid: {formatNaira(receiptData.amountPaid)} • Change: {formatNaira(calculateChange())}
            </div>
          )}
          Thank you
        </div>
      </div>
    </div>
  );
};

export default MinimalReceipt;