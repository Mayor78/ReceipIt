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
    <div className="p-8 max-w-md mx-auto bg-white text-black font-sans print:p-0">
      {/* Header & Logo */}
      {companyLogo && (
        <div className="text-center mb-6">
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            style={{ height: '60px', margin: '0 auto', objectFit: 'contain' }}
          />
        </div>
      )}
      
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tight mb-1">{receiptData.storeName}</h1>
        <p className="text-gray-700 text-sm leading-relaxed">{receiptData.storeAddress}</p>
        <p className="text-gray-700 text-sm font-medium">Phone: {receiptData.storePhone}</p>
        {receiptData.tinNumber && (
          <p className="text-[11px] font-bold mt-1 text-gray-500 uppercase tracking-widest">
            TIN: {receiptData.tinNumber}
          </p>
        )}
      </div>

      {/* Transaction Metadata */}
      <div className="border-t-2 border-b-2 border-black py-3 my-4">
        <div className="flex justify-between mb-1 font-bold text-sm">
          <span>RECEIPT #{receiptData.receiptNumber}</span>
          <span>{receiptData.date}</span>
        </div>
        <div className="text-[11px] text-gray-600 uppercase font-medium">
          Cashier: {receiptData.cashierName} | Time: {receiptData.time}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <div className="font-black text-xs border-b-2 border-black pb-1 mb-2 tracking-[0.2em]">ITEMS</div>
        <div className="space-y-3">
          {receiptData.items.map(item => (
            <div key={item.id} className="flex justify-between items-start py-1 border-b border-gray-100 last:border-0">
              <div className="pr-4">
                <div className="font-bold text-sm leading-tight">{item.quantity}x {item.name}</div>
                {item.unit && <div className="text-[10px] text-gray-500 uppercase font-bold">Unit: {item.unit}</div>}
              </div>
              <div className="text-right whitespace-nowrap">
                <div className="font-bold text-sm">{formatNaira(item.price * item.quantity)}</div>
                <div className="text-[10px] text-gray-500 font-medium">{formatNaira(item.price)} each</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Totals */}
      <div className="border-t-2 border-black pt-4 space-y-1.5">
        <div className="flex justify-between text-sm font-medium text-gray-700">
          <span>Subtotal</span>
          <span>{formatNaira(calculateSubtotal())}</span>
        </div>
        
        {receiptData.includeDiscount && receiptData.discount > 0 && (
          <div className="flex justify-between text-sm font-bold text-red-600 italic">
            <span>Discount Applied</span>
            <span>-{formatNaira(calculateDiscount())}</span>
          </div>
        )}
        
        {receiptData.includeVAT && (
          <div className="flex justify-between text-sm font-medium text-gray-700">
            <span>VAT ({receiptData.vatRate}%)</span>
            <span>{formatNaira(calculateVAT())}</span>
          </div>
        )}
        
        <div className="flex justify-between font-black text-xl mt-4 pt-4 border-t-2 border-black">
          <span>TOTAL DUE</span>
          <span className="tabular-nums">{formatNaira(calculateTotal())}</span>
        </div>
      </div>

      {/* Payment Information */}
      <div className="mt-6 border-t border-dashed border-gray-300 pt-4 text-xs font-bold uppercase tracking-wider text-gray-600">
        <div className="mb-1">Payment Method: {receiptData.paymentMethod}</div>
        {receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 && (
          <div className="flex gap-2">
            <span>Paid: {formatNaira(receiptData.amountPaid)}</span>
            <span className="text-black">|</span>
            <span>Change: {formatNaira(calculateChange())}</span>
          </div>
        )}
      </div>

      {/* Signature Section */}
      {receiptData.includeSignature && (
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="mb-4 font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">Authorized Signature</div>
            {receiptData.signatureData ? (
              <div className="mb-2">
                <img 
                  src={receiptData.signatureData} 
                  alt="Signature" 
                  style={{ 
                    maxWidth: '180px', 
                    maxHeight: '50px', 
                    margin: '0 auto',
                    display: 'block',
                    filter: 'contrast(1.5) grayscale(1)'
                  }}
                />
                <div className="text-[9px] font-bold text-gray-400 uppercase mt-2 tracking-tighter">Digitally signed & verified</div>
              </div>
            ) : (
              <div className="w-48 h-[1px] bg-black mx-auto mb-2"></div>
            )}
            <div className="text-[10px] font-medium text-gray-500">
              Verified on {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer & Notes */}
      <div className="mt-10 pt-6 border-t-2 border-black border-double text-center">
        {receiptData.customerNotes && (
          <p className="text-sm italic text-gray-700 mb-3 leading-relaxed">"{receiptData.customerNotes}"</p>
        )}
        <p className="font-black text-sm uppercase tracking-widest">{receiptData.footerMessage}</p>
        
        {receiptData.includeTerms && receiptData.termsAndConditions && (
          <div className="mt-6 text-left p-3 bg-gray-50 rounded border border-gray-100">
            <div className="font-black text-[10px] uppercase tracking-widest mb-2">Terms & Conditions:</div>
            <div className="text-[9px] text-gray-600 leading-normal whitespace-pre-line font-medium italic">
              {receiptData.termsAndConditions}
            </div>
          </div>
        )}
        <div className="mt-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">
            Thank you for your business!
          </p>
          <div className="mt-2 text-[8px] text-gray-300 font-mono">
            Generated via SmartReceipt Digital Engine
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableReceipt;