import React from 'react';
import { getTemplateConfig } from '../../data/receiptTemplates';

// Category Icons for Bold template
const CategoryIcons = {
  electronics: () => <span className="text-lg">📱</span>,
  books: () => <span className="text-lg">📚</span>,
  agriculture: () => <span className="text-lg">🌾</span>,
  clothing: () => <span className="text-lg">👕</span>,
  food: () => <span className="text-lg">☕</span>,
  services: () => <span className="text-lg">✂️</span>,
  liquids: () => <span className="text-lg">💧</span>,
  construction: () => <span className="text-lg">🏠</span>,
  logistics: () => <span className="text-lg">🚚</span>,
  general: () => <span className="text-lg">📦</span>
};

const BoldReceipt = ({
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
  const config = getTemplateConfig('bold');

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
      className="bold-receipt p-6 max-w-md mx-auto"
      style={{
        fontFamily: config.fontFamily,
        backgroundColor: config.bgColor,
        borderRadius: config.borderRadius,
        boxShadow: config.shadow,
        border: `3px solid ${config.borderColor}`,
      }}
    >
      {/* Category Notice */}
      {showCategoryData && hasCategoryData && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border-2 border-red-200 text-center">
          <div className="font-bold text-red-700 text-sm uppercase flex items-center justify-center gap-2">
            <span>📋</span>
            <span>DETAILED RECEIPT WITH CATEGORY DATA</span>
          </div>
        </div>
      )}

      {/* Bold Header */}
      <div 
        className="text-center mb-8 p-6 rounded-2xl"
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
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
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
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="h-1 flex-1" style={{ backgroundColor: config.primaryColor }}></div>
          <h2 className="mx-4 text-xl font-bold uppercase">Items</h2>
          <div className="h-1 flex-1" style={{ backgroundColor: config.secondaryColor }}></div>
        </div>
        
        <div className="space-y-4">
          {receiptData.items?.map((item, index) => {
            const customFields = formatCustomFields(item.customFields);
            const categoryIcon = showCategoryData ? getCategoryIcon(item.category) : null;
            
            return (
              <div 
                key={item.id || index} 
                className="p-4 rounded-xl border-2 transition-all hover:scale-[1.02]"
                style={{ borderColor: `${config.primaryColor}40` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      {showCategoryData && categoryIcon && (
                        <div className="mt-1">{categoryIcon}</div>
                      )}
                      <div>
                        <div className="font-bold text-lg">{item.name}</div>
                        
                        {/* Category Display */}
                        {showCategoryData && item.category && item.category !== 'general' && (
                          <div className="inline-block text-xs px-2 py-1 bg-red-50 text-red-600 rounded-md mt-1 font-bold border border-red-200">
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold">{formatNaira(item.price * item.quantity)}</div>
                    <div className="text-sm opacity-75">{formatNaira(item.price)} each</div>
                  </div>
                </div>
                
                {/* Item Details */}
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="font-bold">
                    Qty: <span className="text-base">{item.quantity}</span>
                  </div>
                  {item.unit && (
                    <div className="font-bold">
                      Unit: <span className="text-base">{item.unit}</span>
                    </div>
                  )}
                </div>
                
                {/* Item Description */}
                {item.description && (
                  <div className="text-sm text-gray-600 mb-3 pl-3 border-l-2 border-red-300 py-1">
                    {item.description}
                  </div>
                )}
                
                {/* Custom Fields */}
                {showCategoryData && customFields && customFields.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-xs font-bold text-red-700 uppercase mb-2">
                      Item Specifications:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {customFields.map((field, fIdx) => (
                        <div key={fIdx} className="text-xs p-2 bg-white rounded border border-red-100">
                          <div className="font-bold text-red-600 mb-1">{field.key}</div>
                          <div className="font-semibold text-gray-800 break-all">{field.value}</div>
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

      {/* Important Fields Summary */}
      {showCategoryData && importantFields.length > 0 && (
        <div className="mb-8 p-4 rounded-xl border-2" style={{ 
          borderColor: config.secondaryColor,
          backgroundColor: '#FEF3C7'
        }}>
          <h3 className="text-lg font-bold uppercase mb-3 flex items-center gap-2">
            <span>🔍</span>
            <span>Important Details</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {importantFields.map((field, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-yellow-300">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-sm text-gray-800">
                    Item {field.itemIndex}: {field.itemName}
                  </div>
                  <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold">
                    {field.field}
                  </div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-200 font-bold text-gray-800">
                  {field.value}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3 text-sm font-bold text-yellow-700">
            ✅ All {importantFields.length} important details shown
          </div>
        </div>
      )}

      {/* Bold Calculations */}
      <div className="mb-8 space-y-4">
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
        
        {receiptData.includeVAT && receiptData.vatRate > 0 && (
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
      <div className="mb-8">
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

        {/* Complete Details Notice */}
        {showCategoryData && hasCustomFields && (
          <div className="mt-4 p-4 rounded-xl border-2" style={{ 
            borderColor: '#3B82F6',
            backgroundColor: '#DBEAFE'
          }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">✅</span>
              <span className="font-bold text-blue-700 uppercase">Complete Details Included</span>
            </div>
            <div className="text-sm text-blue-800 font-semibold">
              This receipt contains full item specifications, categories, and important details.
            </div>
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