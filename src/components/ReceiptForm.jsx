import React, { useEffect, useState } from 'react';
import { useReceipt } from '../context/ReceiptContext';
import DraftPrompt from './receipt/DraftPrompt';
import DocumentTypeSelector from './receipt/DocumentTypeSelector';
import BusinessInfoSection from './receipt/BusinessInfoSection';
import DocumentDetailsSection from './receipt/DocumentDetailsSection';
import CustomerInfoSection from './receipt/CustomerInfoSection';
import ItemsSection from './receipt/ItemsSection';
import TaxDiscountSection from './receipt/TaxDiscountSection';
import PaymentSection from './receipt/PaymentSection';
import TermsSection from './receipt/TermsSection';
import MobileActions from './receipt/MobileActions';

const ReceiptForm = () => {
  const {
    receiptData,
    updateReceiptData,
    addItem,
    updateItem,
    removeItem,
    showDraftPrompt,
    restoreDraft,
    discardDraft,
    hasOnlyDummyItems,
    clearDummyItems,
  } = useReceipt();

  const [expandedSections, setExpandedSections] = useState({
    businessInfo: false,
    documentDetails: false,
    customerInfo: false,
    items: true,
    taxDiscount: false,
    payment: false,
    terms: false
  });

  // Check if there are incomplete items
  const hasIncompleteItems = receiptData.items.some(item => 
    !item.name.trim() || item.name === "New Item" || item.price === 0
  );

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAddItem = () => {
    // If all items are dummy, clear them first
    if (hasOnlyDummyItems()) {
      if (window.confirm('Clear incomplete items and add new one?')) {
        clearDummyItems();
        setTimeout(() => {
          addItem();
        }, 100);
      }
    } else {
      addItem();
    }
  };

  return (
    <div className="space-y-3">
      {/* Draft Prompt */}
      {showDraftPrompt && (
        <DraftPrompt 
          onRestore={restoreDraft}
          onDiscard={discardDraft}
        />
      )}

      {/* Document Type Selector */}
      <DocumentTypeSelector 
        receiptType={receiptData.receiptType}
        onTypeChange={(type) => updateReceiptData('receiptType', type)}
      />

      {/* Business Information */}
      <BusinessInfoSection 
        isExpanded={expandedSections.businessInfo}
        onToggle={() => toggleSection('businessInfo')}
        data={receiptData}
        onUpdate={updateReceiptData}
      />

      {/* Document Details */}
      <DocumentDetailsSection 
        isExpanded={expandedSections.documentDetails}
        onToggle={() => toggleSection('documentDetails')}
        data={receiptData}
        onUpdate={updateReceiptData}
      />

      {/* Customer Information */}
      <CustomerInfoSection 
        isExpanded={expandedSections.customerInfo}
        onToggle={() => toggleSection('customerInfo')}
        data={receiptData}
        onUpdate={updateReceiptData}
      />

      {/* Items Section */}
      <ItemsSection 
        isExpanded={expandedSections.items}
        onToggle={() => toggleSection('items')}
        items={receiptData.items}
        onAddItem={handleAddItem}
        onUpdateItem={updateItem}
        onRemoveItem={removeItem}
        hasOnlyDummyItems={hasOnlyDummyItems()}
      />

      {/* Tax & Discount */}
      <TaxDiscountSection 
        isExpanded={expandedSections.taxDiscount}
        onToggle={() => toggleSection('taxDiscount')}
        data={receiptData}
        onUpdate={updateReceiptData}
      />

      {/* Payment Section */}
      <PaymentSection 
        isExpanded={expandedSections.payment}
        onToggle={() => toggleSection('payment')}
        data={receiptData}
        onUpdate={updateReceiptData}
      />

      {/* Terms & Notes */}
      <TermsSection 
        isExpanded={expandedSections.terms}
        onToggle={() => toggleSection('terms')}
        data={receiptData}
        onUpdate={updateReceiptData}
      />

      {/* Mobile Bottom Actions */}
      <MobileActions 
        onAddItem={handleAddItem}
        hasIncompleteItems={hasIncompleteItems}
      />
    </div>
  );
};

export default ReceiptForm;