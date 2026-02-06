import React from 'react';
import { FileText } from 'lucide-react';

const ReceiptPreview = ({
  receiptData,
  companyLogo,
  formatNaira,
  calculateSubtotal,
  calculateVAT,
  calculateTotal
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          {companyLogo && (
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="h-16 mx-auto mb-4"
            />
          )}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{receiptData.storeName}</h2>
          <p className="text-gray-600">{receiptData.storeAddress}</p>
          <p className="text-gray-600 text-sm">Phone: {receiptData.storePhone}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Receipt #</p>
            <p className="font-semibold">{receiptData.receiptNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-semibold">{receiptData.date}</p>
          </div>
        </div>

        <div className="border-t border-b py-4 mb-6">
          {receiptData.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex justify-between py-1">
              <span className="text-sm">
                {item.quantity}x {item.name}
                {item.unit && <span className="text-gray-500 ml-2">({item.unit})</span>}
              </span>
              <span className="text-sm font-medium">
                {formatNaira(item.price * item.quantity)}
              </span>
            </div>
          ))}
          {receiptData.items.length > 3 && (
            <div className="text-center text-sm text-gray-500 mt-2">
              +{receiptData.items.length - 3} more items
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatNaira(calculateSubtotal())}</span>
          </div>
          
          {receiptData.includeVAT && (
            <div className="flex justify-between">
              <span className="text-gray-600">VAT ({receiptData.vatRate}%)</span>
              <span className="font-medium">{formatNaira(calculateVAT())}</span>
            </div>
          )}
          
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total</span>
            <span className="text-blue-600">{formatNaira(calculateTotal())}</span>
          </div>
        </div>

        {/* Signature Preview */}
        {receiptData.includeSignature && (
          <div className="mt-6 pt-4 border-t">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700 mb-2">Signature</div>
              {receiptData.signatureData ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={receiptData.signatureData} 
                    alt="Signature" 
                    className="h-12 border border-gray-300 bg-white p-1"
                  />
                  <div className="text-xs text-gray-500 mt-1">Digital Signature</div>
                </div>
              ) : (
                <div className="h-6 border-b border-gray-400 w-32 mx-auto"></div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-sm text-gray-500">
            This is a preview. Use buttons above to print or save PDF.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreview;