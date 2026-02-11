import React from 'react';
import { getTemplateConfig } from '../../data/receiptTemplates';

// Minimal Category Icons
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

const MinimalReceipt = ({
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
  const config = getTemplateConfig('minimal');

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
        
        {/* Minimal Category Notice */}
        {showCategoryData && hasCategoryData && (
          <div className="mt-2 text-xs text-gray-500 bg-gray-100 py-1 px-2 rounded inline-block">
            📋 Detailed receipt
          </div>
        )}
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

      {/* Items - Minimal with Category Data */}
      <div className="mb-8">
        {receiptData.items?.map((item, index) => {
          const customFields = formatCustomFields(item.customFields);
          const categoryIcon = showCategoryData ? getCategoryIcon(item.category) : null;
          
          return (
            <div key={item.id || index} className="py-3 border-b border-gray-100">
              {/* Main Item Row */}
              <div className="flex justify-between mb-1">
                <div className="flex items-start gap-2">
                  {showCategoryData && categoryIcon && (
                    <div className="mt-0.5">{categoryIcon}</div>
                  )}
                  <div>
                    <div className="font-medium">{item.name}</div>
                    
                    {/* Minimal Category Display */}
                    {showCategoryData && item.category && item.category !== 'general' && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        [{item.category.charAt(0).toUpperCase() + item.category.slice(1)}]
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatNaira(item.price * item.quantity)}</div>
                </div>
              </div>
              
              {/* Item Details */}
              <div className="text-xs text-gray-500 mb-2">
                {item.quantity} × {formatNaira(item.price)}
                {item.unit && item.unit !== 'Piece' && ` (${item.unit})`}
              </div>
              
              {/* Item Description */}
              {item.description && (
                <div className="text-xs text-gray-600 mb-2 pl-2 border-l border-gray-300 py-1">
                  {item.description}
                </div>
              )}
              
              {/* Minimal Custom Fields */}
              {showCategoryData && customFields && customFields.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {customFields.map((field, fIdx) => (
                    <div key={fIdx} className="text-[10px] px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-200 max-w-full break-all">
                      <span className="font-medium">{field.key}:</span> {field.value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Important Fields Summary - Minimal Style */}
      {showCategoryData && importantFields.length > 0 && (
        <div className="mb-8 p-3 bg-gray-50 rounded border border-gray-200">
          <div className="text-xs font-medium text-gray-700 mb-2">
            Important Details:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {importantFields.map((field, idx) => (
              <div key={idx} className="text-xs p-2 bg-white rounded border border-gray-300">
                <div className="font-medium text-gray-800 mb-1">Item {field.itemIndex}: {field.field}</div>
                <div className="text-gray-900 font-semibold">{field.value}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{field.itemName}</div>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-gray-600 text-center mt-2">
            {importantFields.length} details included
          </div>
        </div>
      )}

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
        
        {receiptData.includeVAT && receiptData.vatRate > 0 && (
          <div className="flex justify-between">
            <span>VAT ({receiptData.vatRate}%)</span>
            <span>{formatNaira(calculateVAT())}</span>
          </div>
        )}
        
        <div className="flex justify-between font-bold pt-2 border-t">
          <span>Total</span>
          <span>{formatNaira(calculateTotal())}</span>
        </div>
      </div>

      {/* Complete Details Notice */}
      {showCategoryData && hasCustomFields && (
        <div className="mb-6 p-2 bg-gray-100 rounded text-center">
          <div className="text-xs text-gray-700 font-medium">
            ✅ Complete item details included
          </div>
        </div>
      )}

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
        <div className="text-xs text-gray-400 mt-4">
          {receiptData.receiptNumber} • ReceipIt
        </div>
      </div>
    </div>
  );
};

export default MinimalReceipt;