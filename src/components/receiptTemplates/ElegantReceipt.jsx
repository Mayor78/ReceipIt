import React from 'react';
import { getTemplateConfig } from '../../data/receiptTemplates';

// Elegant Category Icons
const CategoryIcons = {
  electronics: () => <span className="text-base">📱</span>,
  books: () => <span className="text-base">📚</span>,
  agriculture: () => <span className="text-base">🌾</span>,
  clothing: () => <span className="text-base">👕</span>,
  food: () => <span className="text-base">☕</span>,
  services: () => <span className="text-base">✂️</span>,
  liquids: () => <span className="text-base">💧</span>,
  construction: () => <span className="text-base">🏠</span>,
  logistics: () => <span className="text-base">🚚</span>,
  general: () => <span className="text-base">📦</span>
};

const ElegantReceipt = ({
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
  const config = getTemplateConfig('elegant');

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

  // Get important fields
  const getImportantFields = () => {
    const fields = [];
    receiptData.items?.forEach((item, index) => {
      if (item.customFields) {
        const formatted = formatCustomFields(item.customFields);
        formatted?.forEach(field => {
          if (['IMEI', 'Serial', 'Warranty', 'Expiry', 'Weight', 'Size'].includes(field.key)) {
            fields.push({
              itemIndex: index + 1,
              itemName: item.name,
              field: field.key,
              value: field.value
            });
          }
        });
      }
    });
    return fields;
  };

  const importantFields = getImportantFields();
  const hasCategoryData = receiptData.items?.some(item => item.category && item.category !== 'general');
  const hasCustomFields = receiptData.items?.some(item => item.customFields && Object.keys(item.customFields).length > 0);

  return (
    <div 
      className="elegant-receipt p-6 max-w-md mx-auto"
      style={{
        fontFamily: config.fontFamily,
        backgroundColor: config.bgColor,
        borderRadius: config.borderRadius,
        boxShadow: config.shadow,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      {/* Elegant Category Notice */}
      {showCategoryData && hasCategoryData && (
        <div className="mb-6 p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
          <div className="text-sm font-medium text-purple-700 italic">
            📋 Detailed specification receipt
          </div>
        </div>
      )}

      {/* Decorative Header */}
      <div className="relative mb-8">
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
                className="text-3xl font-serif font-bold text-center"
                style={{ color: config.primaryColor }}
              >
                {receiptData.storeName}
              </h1>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Info in elegant layout */}
      <div className="mb-8">
        <div className="text-center mb-6">
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

        <div className="flex justify-between items-center mb-6">
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

      {/* Items with elegant styling and category data */}
      <div className="mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-serif font-bold mb-4 text-center">Items Purchased</h3>
        </div>
        
        <div className="space-y-4">
          {receiptData.items?.map((item, index) => {
            const customFields = formatCustomFields(item.customFields);
            const categoryIcon = showCategoryData ? getCategoryIcon(item.category) : null;
            
            return (
              <div 
                key={item.id || index} 
                className="py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      {showCategoryData && categoryIcon && (
                        <div className="mt-0.5">{categoryIcon}</div>
                      )}
                      <div>
                        <div className="font-medium text-gray-800">{item.name}</div>
                        
                        {/* Elegant Category Display */}
                        {showCategoryData && item.category && item.category !== 'general' && (
                          <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full inline-block mt-1 italic border border-purple-200">
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </div>
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
                
                {/* Item Details */}
                <div className="text-xs text-gray-600 mb-2">
                  {item.unit && item.unit !== 'Piece' && (
                    <span className="italic">Unit: {item.unit}</span>
                  )}
                </div>
                
                {/* Item Description */}
                {item.description && (
                  <div className="text-sm text-gray-600 mb-2 pl-2 border-l border-gray-300 py-1 italic">
                    {item.description}
                  </div>
                )}
                
                {/* Elegant Custom Fields */}
                {showCategoryData && customFields && customFields.length > 0 && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-xs font-bold text-purple-700 uppercase mb-2 tracking-wide">
                      Specifications
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {customFields.map((field, fIdx) => (
                        <div key={fIdx} className="text-xs p-2 bg-white rounded border border-purple-100">
                          <div className="font-bold text-purple-600 mb-1 text-[10px] uppercase tracking-wide">
                            {field.key}
                          </div>
                          <div className="text-gray-800 font-medium break-all">{field.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Important Fields Summary - Elegant Style */}
      {showCategoryData && importantFields.length > 0 && (
        <div className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-bold text-yellow-800 mb-3 text-center uppercase tracking-wide">
            <span className="mr-1">🔍</span> Important Item Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {importantFields.map((field, idx) => (
              <div key={idx} className="p-3 bg-white rounded border border-yellow-300">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs font-bold text-yellow-700">Item {field.itemIndex}</div>
                  <div className="text-[10px] px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold uppercase">
                    {field.field}
                  </div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-200 text-gray-800 font-bold">
                  {field.value}
                </div>
                <div className="text-[10px] text-yellow-600 mt-2 text-center italic">
                  {field.itemName}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3 text-xs text-yellow-700 italic">
            All {importantFields.length} important details elegantly presented
          </div>
        </div>
      )}

      {/* Calculation Section */}
      <div className="mb-8 space-y-3">
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
        
        {receiptData.includeVAT && receiptData.vatRate > 0 && (
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span>VAT ({receiptData.vatRate}%)</span>
            <span className="font-medium">{formatNaira(calculateVAT())}</span>
          </div>
        )}
        
        <div className="mt-4">
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

      {/* Complete Details Notice */}
      {showCategoryData && hasCustomFields && (
        <div className="mb-6 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <div>
              <div className="text-sm font-bold text-purple-700">Complete Specifications Included</div>
              <div className="text-xs text-purple-600 italic">
                All item details and specifications elegantly presented above
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment and Signature */}
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
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
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Notes</p>
            <p className="italic text-gray-600">{receiptData.customerNotes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-gray-300 text-center">
        <div 
          className="text-xl font-serif font-bold mb-2"
          style={{ color: config.primaryColor }}
        >
          {receiptData.footerMessage || 'Thank You'}
        </div>
        <p className="text-sm text-gray-500 italic">We value your patronage</p>
        
        {receiptData.includeTerms && receiptData.termsAndConditions && (
          <div className="mt-6 text-xs text-gray-500">
            <p className="font-bold mb-2">Terms:</p>
            <p className="italic">{receiptData.termsAndConditions}</p>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-400">
          {receiptData.receiptNumber} • ReceipIt
        </div>
      </div>
    </div>
  );
};

export default ElegantReceipt;