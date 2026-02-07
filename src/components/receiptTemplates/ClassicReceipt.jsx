import React from 'react';
import { getTemplateConfig } from '../../data/receiptTemplates';

const ClassicReceipt = ({
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
  const config = getTemplateConfig('classic');

  return (
    <div 
      className="classic-receipt p-6 max-w-md mx-auto"
      style={{
        fontFamily: config.fontFamily,
        backgroundColor: config.bgColor,
        boxShadow: config.shadow,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      {/* Classic Header */}
      <div className="text-center mb-8">
        <div className="border-b-2 border-gray-800 pb-4 mb-4">
          {companyLogo && (
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="h-16 mx-auto mb-3"
            />
          )}
          <h1 className="text-2xl font-bold uppercase">{receiptData.storeName}</h1>
          <p className="text-sm">{receiptData.storeAddress}</p>
          {receiptData.storePhone && (
            <p className="text-sm">Phone: {receiptData.storePhone}</p>
          )}
          {receiptData.tinNumber && (
            <p className="text-xs mt-1">TIN: {receiptData.tinNumber}</p>
          )}
        </div>
      </div>

      {/* Receipt Info - Classic Layout */}
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm">Receipt: <strong>#{receiptData.receiptNumber}</strong></div>
            <div className="text-sm">Date: {receiptData.date}</div>
          </div>
          <div className="text-right">
            <div className="text-sm">Time: {receiptData.time}</div>
            <div className="text-sm">Cashier: {receiptData.cashierName}</div>
          </div>
        </div>
        
        <div className="text-center py-2 border-y border-gray-800">
          <strong className="uppercase">{receiptData.receiptType} RECEIPT</strong>
        </div>
      </div>

      {/* Items - Classic Table */}
      <div className="mb-8">
        <div className="border-b border-gray-800 pb-2 mb-4">
          <div className="flex justify-between font-bold">
            <div className="w-1/2">Description</div>
            <div className="w-1/4 text-center">Qty</div>
            <div className="w-1/4 text-right">Amount</div>
          </div>
        </div>
        
        <div className="space-y-3">
          {receiptData.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <div className="w-1/2">
                <div>{item.name}</div>
                {item.unit && (
                  <div className="text-xs">({item.unit})</div>
                )}
                <div className="text-xs">@{formatNaira(item.price)}</div>
              </div>
              <div className="w-1/4 text-center">{item.quantity}</div>
              <div className="w-1/4 text-right font-bold">
                {formatNaira(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-4 pt-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatNaira(calculateSubtotal())}</span>
          </div>
          
          {receiptData.includeDiscount && receiptData.discount > 0 && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-{formatNaira(calculateDiscount())}</span>
            </div>
          )}
          
          {receiptData.includeVAT && (
            <div className="flex justify-between">
              <span>VAT ({receiptData.vatRate}%):</span>
              <span>{formatNaira(calculateVAT())}</span>
            </div>
          )}
          
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-800">
            <span>TOTAL:</span>
            <span>{formatNaira(calculateTotal())}</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-8">
        <div className="border border-gray-800 p-3">
          <div className="mb-2">
            <span className="font-bold">Payment Method:</span> {receiptData.paymentMethod}
          </div>
          {receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 && (
            <div className="space-y-1">
              <div>
                <span className="font-bold">Amount Paid:</span> {formatNaira(receiptData.amountPaid)}
              </div>
              <div>
                <span className="font-bold">Change:</span> {formatNaira(calculateChange())}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Notes */}
      {receiptData.customerNotes && (
        <div className="mb-8 p-3 border border-gray-800">
          <div className="font-bold mb-1">Customer Notes:</div>
          <div className="text-sm">{receiptData.customerNotes}</div>
        </div>
      )}

      {/* Signature Section */}
      {receiptData.includeSignature && (
        <div className="mb-8">
          <div className="text-center">
            <div className="font-bold mb-4">AUTHORIZED SIGNATURE</div>
            {receiptData.signatureData ? (
              <img 
                src={receiptData.signatureData} 
                alt="Signature" 
                className="h-16 mx-auto border border-gray-800"
              />
            ) : (
              <div className="h-12 border-b-2 border-gray-800 mx-auto w-48"></div>
            )}
            <div className="text-xs mt-2">Date: {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      )}

      {/* Terms & Conditions */}
      {receiptData.includeTerms && receiptData.termsAndConditions && (
        <div className="mb-8">
          <div className="font-bold mb-2">Terms & Conditions:</div>
          <div className="text-xs border border-gray-800 p-3">
            {receiptData.termsAndConditions}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center border-t border-gray-800 pt-4">
        <div className="font-bold text-lg mb-2">
          {receiptData.footerMessage || 'THANK YOU FOR YOUR BUSINESS'}
        </div>
        <div className="text-sm">Please retain this receipt for your records</div>
      </div>
    </div>
  );
};

export default ClassicReceipt;