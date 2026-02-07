import React from 'react';


// Import all template components
import ModernReceipt from '../receiptTemplates/ModernReceipt';
import ProfessionalReceipt from '../receiptTemplates/ProfessionalReceipt';
import ElegantReceipt from '../receiptTemplates/ElegantReceipt';
import MinimalReceipt from '../receiptTemplates/MinimalReceipt';
import BoldReceipt from '../receiptTemplates/BoldReceipt';
import ClassicReceipt from '../receiptTemplates/ClassicReceipt';
import { useReceipt } from '../../context/ReceiptContext';

const TemplateRenderer = ({
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
  const { selectedTemplate } = useReceipt();

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

  return (
    <SelectedTemplate
      receiptData={receiptData}
      companyLogo={companyLogo}
      formatNaira={formatNaira}
      calculateSubtotal={calculateSubtotal}
      calculateDiscount={calculateDiscount}
      calculateVAT={calculateVAT}
      calculateTotal={calculateTotal}
      calculateChange={calculateChange}
      isMobile={isMobile}
    />
  );
};

export default TemplateRenderer;