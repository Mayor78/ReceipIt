import React from 'react';

const PrintableReceipt = ({
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
  return (
    <div className="p-8 max-w-md mx-auto">
      {companyLogo && (
        <div className="text-center mb-4">
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            style={{ height: '60px', margin: '0 auto' }}
          />
        </div>
      )}
      
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{receiptData.storeName}</h1>
        <p className="text-gray-600">{receiptData.storeAddress}</p>
        <p className="text-gray-600 text-sm">Phone: {receiptData.storePhone}</p>
        {receiptData.tinNumber && <p className="text-sm">{receiptData.tinNumber}</p>}
      </div>

      <div className="border-t border-b py-4 my-4">
        <div className="flex justify-between mb-2">
          <span>Receipt #{receiptData.receiptNumber}</span>
          <span>{receiptData.date}</span>
        </div>
        <div className="text-sm text-gray-600">
          Cashier: {receiptData.cashierName} | Time: {receiptData.time}
        </div>
      </div>

      <div className="mb-6">
        <div className="font-semibold border-b pb-2 mb-2">ITEMS</div>
        {receiptData.items.map(item => (
          <div key={item.id} className="flex justify-between py-2 border-b">
            <div>
              <div className="font-medium">{item.quantity}x {item.name}</div>
              {item.unit && <div className="text-sm text-gray-600">Unit: {item.unit}</div>}
            </div>
            <div className="text-right">
              <div>{formatNaira(item.price * item.quantity)}</div>
              <div className="text-sm text-gray-600">{formatNaira(item.price)} each</div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>{formatNaira(calculateSubtotal())}</span>
        </div>
        
        {receiptData.includeDiscount && receiptData.discount > 0 && (
          <div className="flex justify-between mb-2 text-red-600">
            <span>Discount</span>
            <span>-{formatNaira(calculateDiscount())}</span>
          </div>
        )}
        
        {receiptData.includeVAT && (
          <div className="flex justify-between mb-2">
            <span>VAT ({receiptData.vatRate}%)</span>
            <span>{formatNaira(calculateVAT())}</span>
          </div>
        )}
        
        <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
          <span>TOTAL</span>
          <span>{formatNaira(calculateTotal())}</span>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mt-6 border-t pt-4">
        <div className="text-sm text-gray-600 mb-2">Payment Method: {receiptData.paymentMethod}</div>
        {receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 && (
          <div className="text-sm text-gray-600">
            Amount Paid: {formatNaira(receiptData.amountPaid)} | 
            Change: {formatNaira(calculateChange())}
          </div>
        )}
      </div>

      {/* Signature Section */}
      {receiptData.includeSignature && (
        <div className="mt-8 pt-6 border-t">
          <div className="text-center">
            <div className="mb-2 font-semibold">Authorized Signature</div>
            {receiptData.signatureData ? (
              <div>
                <img 
                  src={receiptData.signatureData} 
                  alt="Signature" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '60px', 
                    margin: '0 auto',
                    display: 'block'
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">Digital Signature</div>
              </div>
            ) : (
              <div className="signature-line" style={{ width: '200px', margin: '20px auto', borderBottom: '1px solid #000', paddingBottom: '5px' }}></div>
            )}
            <div className="text-xs text-gray-600 mt-2">
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 pt-4 border-t text-center text-sm">
        <p className="mb-2">{receiptData.customerNotes}</p>
        <p className="font-semibold">{receiptData.footerMessage}</p>
        {receiptData.includeTerms && receiptData.termsAndConditions && (
          <div className="mt-4 text-left">
            <div className="font-semibold mb-2">Terms & Conditions:</div>
            <div className="text-xs text-gray-600 whitespace-pre-line">
              {receiptData.termsAndConditions}
            </div>
          </div>
        )}
        <p className="text-gray-600 mt-4">Thank you for your business!</p>
      </div>
    </div>
  );
};

export default PrintableReceipt;