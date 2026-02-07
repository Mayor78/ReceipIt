import React from 'react';
import { getTemplateConfig } from '../../data/receiptTemplates';

const BoldReceipt = ({
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
  const config = getTemplateConfig('bold');

  return (
    <div 
      className="bold-receipt p-8 max-w-md mx-auto"
      style={{
        fontFamily: config.fontFamily,
        backgroundColor: config.bgColor,
        borderRadius: config.borderRadius,
        boxShadow: config.shadow,
        border: `2px solid ${config.borderColor}`,
      }}
    >
      {/* Bold Header */}
      <div 
        className="text-center mb-10 p-6 rounded-2xl"
        style={{ 
          backgroundColor: config.primaryColor,
          color: 'white'
        }}
      >
        {companyLogo && (
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            className="h-16 mx-auto mb-4 invert"
          />
        )}
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">
          {receiptData.storeName}
        </h1>
        <p className="opacity-90">{receiptData.storeAddress}</p>
        {receiptData.storePhone && (
          <p className="mt-2 opacity-80">📞 {receiptData.storePhone}</p>
        )}
      </div>

      {/* Receipt Info in bold style */}
      <div className="mb-10">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="text-center p-4 rounded-xl border-2" style={{ borderColor: config.primaryColor }}>
            <p className="text-sm font-bold uppercase mb-1">Receipt #</p>
            <p className="text-2xl font-bold">{receiptData.receiptNumber}</p>
          </div>
          <div className="text-center p-4 rounded-xl border-2" style={{ borderColor: config.secondaryColor }}>
            <p className="text-sm font-bold uppercase mb-1">Date & Time</p>
            <p className="text-xl font-bold">{receiptData.date}</p>
            <p className="text-sm">{receiptData.time}</p>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 rounded-xl border-2" style={{ borderColor: config.primaryColor }}>
          <div>
            <p className="text-sm font-bold uppercase mb-1">Cashier</p>
            <p className="text-lg font-bold">{receiptData.cashierName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold uppercase mb-1">Type</p>
            <p className="text-lg font-bold uppercase">{receiptData.receiptType}</p>
          </div>
        </div>
      </div>

      {/* Items List with bold styling */}
      <div className="mb-10">
        <div className="flex items-center mb-6">
          <div className="h-1 flex-1" style={{ backgroundColor: config.primaryColor }}></div>
          <h2 className="mx-4 text-xl font-bold uppercase">Items</h2>
          <div className="h-1 flex-1" style={{ backgroundColor: config.secondaryColor }}></div>
        </div>
        
        <div className="space-y-3">
          {receiptData.items.map((item) => (
            <div 
              key={item.id} 
              className="flex justify-between items-center p-4 rounded-lg border-2 transition-all hover:scale-[1.02]"
              style={{ borderColor: `${config.primaryColor}40` }}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 flex items-center justify-center rounded-full font-bold"
                    style={{ 
                      backgroundColor: config.primaryColor,
                      color: 'white'
                    }}
                  >
                    {item.quantity}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{item.name}</div>
                    {item.unit && (
                      <div className="text-sm opacity-75">{item.unit}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{formatNaira(item.price * item.quantity)}</div>
                <div className="text-sm opacity-75">{formatNaira(item.price)} each</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bold Calculations */}
      <div className="mb-10 space-y-4">
        <div className="flex justify-between py-3 border-b-2" style={{ borderColor: config.primaryColor }}>
          <span className="font-bold">Subtotal</span>
          <span className="font-bold">{formatNaira(calculateSubtotal())}</span>
        </div>
        
        {receiptData.includeDiscount && receiptData.discount > 0 && (
          <div className="flex justify-between py-3 border-b-2" style={{ borderColor: config.primaryColor }}>
            <span className="font-bold text-red-600">Discount</span>
            <span className="font-bold text-red-600">-{formatNaira(calculateDiscount())}</span>
          </div>
        )}
        
        {receiptData.includeVAT && (
          <div className="flex justify-between py-3 border-b-2" style={{ borderColor: config.primaryColor }}>
            <span className="font-bold">VAT ({receiptData.vatRate}%)</span>
            <span className="font-bold">{formatNaira(calculateVAT())}</span>
          </div>
        )}
        
        <div 
          className="flex justify-between items-center p-6 rounded-xl mt-6"
          style={{ 
            backgroundColor: config.primaryColor,
            color: 'white'
          }}
        >
          <span className="text-2xl font-bold uppercase">Total</span>
          <span className="text-3xl font-bold">{formatNaira(calculateTotal())}</span>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mb-10">
        <div 
          className="p-4 rounded-xl border-2 mb-4"
          style={{ borderColor: config.secondaryColor }}
        >
          <h3 className="text-lg font-bold mb-3 uppercase">Payment</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-bold">Method:</span>
              <span className="font-bold uppercase">{receiptData.paymentMethod}</span>
            </div>
            {receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="font-bold">Amount Paid:</span>
                  <span className="font-bold">{formatNaira(receiptData.amountPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Change:</span>
                  <span className="font-bold text-xl">{formatNaira(calculateChange())}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {receiptData.customerNotes && (
          <div className="p-4 rounded-xl border-2" style={{ borderColor: config.primaryColor }}>
            <h3 className="text-lg font-bold mb-2 uppercase">Notes</h3>
            <p className="italic">{receiptData.customerNotes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center">
        {receiptData.includeSignature && (
          <div className="mb-6">
            <p className="font-bold mb-2 uppercase">Signature</p>
            {receiptData.signatureData ? (
              <img 
                src={receiptData.signatureData} 
                alt="Signature" 
                className="h-16 mx-auto border-2 rounded"
                style={{ borderColor: config.primaryColor }}
              />
            ) : (
              <div className="h-12 border-b-4 mx-auto w-48" style={{ borderColor: config.primaryColor }} />
            )}
          </div>
        )}
        
        <div 
          className="text-2xl font-bold uppercase mt-8 mb-4"
          style={{ color: config.primaryColor }}
        >
          {receiptData.footerMessage || 'Thanks For Your Business!'}
        </div>
        
        {receiptData.includeTerms && receiptData.termsAndConditions && (
          <div className="mt-6 p-4 rounded-xl border" style={{ borderColor: `${config.primaryColor}40` }}>
            <p className="font-bold mb-2">Terms:</p>
            <p className="text-sm">{receiptData.termsAndConditions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoldReceipt;