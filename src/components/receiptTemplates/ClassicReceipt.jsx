import React from 'react';
import { getTemplateConfig } from '../../data/receiptTemplates';

// Category Icons for Classic template
const CategoryIcons = {
  electronics: () => <span className="text-xs">📱</span>,
  books: () => <span className="text-xs">📚</span>,
  agriculture: () => <span className="text-xs">🌾</span>,
  clothing: () => <span className="text-xs">👕</span>,
  food: () => <span className="text-xs">☕</span>,
  services: () => <span className="text-xs">✂️</span>,
  liquids: () => <span className="text-xs">💧</span>,
  construction: () => <span className="text-xs">🏠</span>,
  logistics: () => <span className="text-xs">🚚</span>,
  general: () => <span className="text-xs">📦</span>
};

const ClassicReceipt = ({
  receiptData,
  companyLogo,
  formatNaira,
  calculateSubtotal,
  calculateDiscount,
  calculateVAT,
  calculateTotal,
  calculateChange,
  isMobile,
  showCategoryData = true
}) => {
  const config = getTemplateConfig('classic');

  // Helper function to get category icon
  const getCategoryIcon = (category = 'general') => {
    const IconComponent = CategoryIcons[category] || CategoryIcons.general;
    return <IconComponent />;
  };

  // Format custom fields
  const formatCustomFields = (customFields) => {
    if (!customFields || Object.keys(customFields).length === 0) return null;
    
    return Object.entries(customFields)
      .filter(([key, value]) => value && value.toString().trim() !== '')
      .map(([key, value]) => ({
        key: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
        value: value.toString()
      }));
  };

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
            <div className="w-2/5">Description</div>
            <div className="w-1/5 text-center">Qty</div>
            <div className="w-2/5 text-right">Amount</div>
          </div>
        </div>
        
        <div className="space-y-4">
          {receiptData.items?.map((item, index) => {
            const customFields = formatCustomFields(item.customFields);
            return (
              <div key={item.id || index}>
                {/* Item Row */}
                <div className="flex justify-between">
                  <div className="w-2/5">
                    <div className="flex items-center gap-1">
                      {showCategoryData && item.category && (
                        <span className="flex-shrink-0">
                          {getCategoryIcon(item.category)}
                        </span>
                      )}
                      <span>{item.name}</span>
                    </div>
                    {showCategoryData && item.category && item.category !== 'general' && (
                      <div className="text-[10px] text-gray-600 mt-0.5">
                        [{item.category.charAt(0).toUpperCase() + item.category.slice(1)}]
                      </div>
                    )}
                    <div className="text-xs">@{formatNaira(item.price)}</div>
                    {item.unit && (
                      <div className="text-xs">({item.unit})</div>
                    )}
                  </div>
                  <div className="w-1/5 text-center">{item.quantity}</div>
                  <div className="w-2/5 text-right">
                    <div className="font-bold">{formatNaira(item.price * item.quantity)}</div>
                  </div>
                </div>
                
                {/* Custom Fields for Classic Style */}
                {showCategoryData && customFields && customFields.length > 0 && (
                  <div className="mt-2 ml-6 p-2 bg-gray-50 border-l-2 border-gray-300">
                    <div className="text-xs text-gray-600 space-y-1">
                      {customFields.slice(0, 2).map((field, fIdx) => (
                        <div key={fIdx} className="flex justify-between">
                          <span className="font-medium">{field.key}:</span>
                          <span>{field.value}</span>
                        </div>
                      ))}
                      {customFields.length > 2 && (
                        <div className="text-[10px] text-gray-500 italic">
                          ...and {customFields.length - 2} more details
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-4">
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
          
          {receiptData.includeVAT && receiptData.vatRate > 0 && (
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

      {/* Important Details Box */}
      {showCategoryData && receiptData.items?.some(item => item.customFields && Object.keys(item.customFields).some(key => 
        ['IMEI', 'Serial', 'Warranty', 'Expiry', 'Weight', 'Size'].includes(key))
      ) && (
        <div className="mb-6 p-3 border border-gray-800">
          <div className="font-bold mb-2 text-sm">SPECIAL DETAILS:</div>
          <div className="space-y-1">
            {receiptData.items.map((item, index) => {
              const customFields = formatCustomFields(item.customFields);
              return customFields?.filter(f => ['IMEI', 'Serial', 'Warranty', 'Expiry', 'Weight', 'Size'].includes(f.key))
                .map((field, fIdx) => (
                  <div key={`${index}-${fIdx}`} className="text-xs flex justify-between">
                    <span>Item {index + 1}: {field.key}</span>
                    <span className="font-medium">{field.value}</span>
                  </div>
                ));
            }).flat()}
          </div>
        </div>
      )}

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
        {showCategoryData && receiptData.items?.some(item => item.category) && (
          <div className="text-xs text-gray-600 mt-2">
            * Category information included
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassicReceipt;