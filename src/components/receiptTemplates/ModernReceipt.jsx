import React from 'react';
import { getTemplateConfig } from '../../data/receiptTemplates';

// Import SVG icons for categories (you can replace with lucide-react if available)
const CategoryIcons = {
  electronics: () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
    </svg>
  ),
  books: () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
    </svg>
  ),
  agriculture: () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.5 12c.93 0 1.78.28 2.5.76V8c0-1.1-.9-2-2-2h-6.29l-1.06-1.06 1.06-1.06c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-2.83 2.83c-.2.2-.2.51 0 .71l2.83 2.83c.2.2.51.2.71 0 .2-.2.2-.51 0-.71L13.29 8H20v1.68c-2.36 1.12-4 3.61-4 6.32 0 .34.03.68.08 1H4v-7c0-2.21 1.79-4 4-4s4 1.79 4 4v7h1.08c.05-.32.08-.66.08-1 0-2.71 1.64-5.2 4-6.32V12h.5z"/>
    </svg>
  ),
  clothing: () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21.6 18.2L13 11.75v-.91c1.65-.49 2.8-2.17 2.43-4.05-.26-1.31-1.27-2.4-2.56-2.7C11.46 3.85 10 5.13 10 6.71c0 1.14.61 2.14 1.53 2.69v2.35L2.4 18.2c-.77.58-.36 1.8.6 1.8h18c.96 0 1.37-1.22.6-1.8zM6 18l6-4.5 6 4.5H6z"/>
    </svg>
  ),
  food: () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z"/>
    </svg>
  ),
  services: () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z"/>
    </svg>
  ),
  general: () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
    </svg>
  )
};

const ModernReceipt = ({
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
  const config = getTemplateConfig('modern');

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

  return (
    <div 
      className="modern-receipt p-6 max-w-md mx-auto"
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
        className="text-center mb-6 pb-6 border-b"
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
            {receiptData.items?.length || 0} items
          </span>
        </div>
        
        <div className="space-y-3">
          {receiptData.items?.map((item, index) => {
            const customFields = formatCustomFields(item.customFields);
            return (
              <div 
                key={item.id || index} 
                className="flex justify-between items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    {showCategoryData && item.category && (
                      <div className="mt-0.5 text-gray-400">
                        {getCategoryIcon(item.category)}
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.quantity} × {formatNaira(item.price)}
                        {item.unit && ` (${item.unit})`}
                      </div>
                      
                      {/* Category Badge */}
                      {showCategoryData && item.category && item.category !== 'general' && (
                        <span className="inline-block text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full mt-1">
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </span>
                      )}
                      
                      {/* Custom Fields */}
                      {showCategoryData && customFields && customFields.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {customFields.slice(0, 2).map((field, fIdx) => (
                            <div key={fIdx} className="text-xs text-gray-600 flex items-center">
                              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                              <span className="font-medium">{field.key}:</span>
                              <span className="ml-1">{field.value}</span>
                            </div>
                          ))}
                          {customFields.length > 2 && (
                            <div className="text-[10px] text-gray-400 mt-1">
                              +{customFields.length - 2} more details
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatNaira(item.price * item.quantity)}</div>
                  <div className="text-xs text-gray-500">
                    {item.unit || 'unit'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Important Fields Summary */}
      {showCategoryData && importantFields.length > 0 && (
        <div className="mb-6 p-4 rounded-lg border" style={{ 
          backgroundColor: `${config.primaryColor}08`,
          borderColor: `${config.primaryColor}20`
        }}>
          <h4 className="font-bold text-sm mb-2 flex items-center gap-2" style={{ color: config.primaryColor }}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            Important Details
          </h4>
          <div className="space-y-2">
            {importantFields.slice(0, 3).map((field, idx) => (
              <div key={idx} className="text-sm flex items-center">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: config.primaryColor }}></span>
                <span>
                  <span className="font-medium">Item {field.itemIndex}:</span> {field.field} = {field.value}
                </span>
              </div>
            ))}
            {importantFields.length > 3 && (
              <div className="text-xs opacity-70 mt-1">
                +{importantFields.length - 3} more important details
              </div>
            )}
          </div>
        </div>
      )}

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
        
        {receiptData.includeVAT && receiptData.vatRate > 0 && (
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