import React from 'react';

// Import all template components
import ModernReceipt from '../receiptTemplates/ModernReceipt';
import ProfessionalReceipt from '../receiptTemplates/ProfessionalReceipt';
import ElegantReceipt from '../receiptTemplates/ElegantReceipt';
import MinimalReceipt from '../receiptTemplates/MinimalReceipt';
import BoldReceipt from '../receiptTemplates/BoldReceipt';
import ClassicReceipt from '../receiptTemplates/ClassicReceipt';
import { useReceipt } from '../../context/ReceiptContext';

// Category icons mapping - same as in ReceiptDisplay
const CATEGORY_ICONS = {
  electronics: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12" y2="18"></line>
    </svg>
  ),
  books: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  ),
  agriculture: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
      <line x1="6" y1="2" x2="6" y2="4"></line>
      <line x1="10" y1="2" x2="10" y2="4"></line>
      <line x1="14" y1="2" x2="14" y2="4"></line>
    </svg>
  ),
  clothing: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
    </svg>
  ),
  food: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
      <line x1="6" y1="1" x2="6" y2="4"></line>
      <line x1="10" y1="1" x2="10" y2="4"></line>
      <line x1="14" y1="1" x2="14" y2="4"></line>
    </svg>
  ),
  services: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
  liquids: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 2.69 5.66 5.66a8 8 0 1 1-11.31 0z"></path>
    </svg>
  ),
  construction: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  logistics: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  ),
  general: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  )
};

const TemplateRenderer = ({
  receiptData,
  companyLogo,
  formatNaira,
  calculateSubtotal,
  calculateDiscount,
  calculateVAT,
  calculateTotal,
  calculateChange,
  isMobile,
  showCategoryData = true // New prop to control category display
}) => {
  const { selectedTemplate } = useReceipt();

  // Enhanced data processing similar to ReceiptDisplay
  const getCategoryIcon = (category = 'general') => {
    const IconComponent = CATEGORY_ICONS[category] || CATEGORY_ICONS.general;
    return <IconComponent />;
  };

  const formatCustomFields = (customFields) => {
    if (!customFields || Object.keys(customFields).length === 0) return null;
    
    return Object.entries(customFields)
      .filter(([key, value]) => value && value.toString().trim() !== '')
      .map(([key, value]) => ({
        key: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
        value: value.toString()
      }));
  };

  // Process receipt data with category information
  const getEnhancedReceiptData = () => {
    const baseData = { ...receiptData };
    
    const enhancedItems = baseData.items.map(item => ({
      ...item,
      categoryIcon: getCategoryIcon(item.category),
      formattedCustomFields: formatCustomFields(item.customFields),
      categoryName: item.category ? 
        item.category.charAt(0).toUpperCase() + item.category.slice(1) : 
        'General',
      hasImportantFields: item.customFields && Object.keys(item.customFields).some(key => 
        ['IMEI', 'Serial', 'Warranty', 'Expiry', 'Weight', 'Size'].includes(key)
      )
    }));
    
    return {
      ...baseData,
      items: enhancedItems,
      hasCategoryData: enhancedItems.some(item => 
        item.category && item.category !== 'general'
      ),
      hasCustomFields: enhancedItems.some(item => 
        item.formattedCustomFields && item.formattedCustomFields.length > 0
      ),
      importantFields: enhancedItems.reduce((acc, item, index) => {
        if (item.formattedCustomFields) {
          item.formattedCustomFields.forEach(field => {
            if (['IMEI', 'Serial', 'Warranty', 'Expiry', 'Weight', 'Size'].includes(field.key)) {
              acc.push({
                itemIndex: index + 1,
                itemName: item.name,
                field: field.key,
                value: field.value
              });
            }
          });
        }
        return acc;
      }, [])
    };
  };

  // Template component mapping
  const templateComponents = {
    modern: ModernReceipt,
    professional: ProfessionalReceipt,
    elegant: ElegantReceipt,
    minimal: MinimalReceipt,
    bold: BoldReceipt,
    classic: ClassicReceipt,
  };

  const SelectedTemplate = templateComponents[selectedTemplate] || ModernReceipt;

  const enhancedData = getEnhancedReceiptData();

  return (
    <SelectedTemplate
      receiptData={enhancedData}
      companyLogo={companyLogo}
      formatNaira={formatNaira}
      calculateSubtotal={calculateSubtotal}
      calculateDiscount={calculateDiscount}
      calculateVAT={calculateVAT}
      calculateTotal={calculateTotal}
      calculateChange={calculateChange}
      isMobile={isMobile}
      showCategoryData={showCategoryData}
    />
  );
};

export default TemplateRenderer;