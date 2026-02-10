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
import { Building2, CreditCard, UserCircle } from 'lucide-react';

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const GroupLabel = ({ icon: Icon, title }) => (
    <div className="flex items-center space-x-2  mb-2">
      <Icon size={14} className="text-gray-400" />
      <span className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">
        {title}
      </span>
    </div>
  );

  return (
    <div className="ma-w-7xl mx-auto pb-2 space-y-8 ">
      {showDraftPrompt && (
        <DraftPrompt onRestore={restoreDraft} onDiscard={discardDraft} />
      )}

      {/* ZONE 1: DOCUMENT IDENTITY */}
      <section>
        <GroupLabel icon={Building2} title="Sender & Type" />
        <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden p-1 space-y-1">
          <DocumentTypeSelector 
            receiptType={receiptData.receiptType}
            onTypeChange={(type) => updateReceiptData('receiptType', type)}
          />
          <BusinessInfoSection 
            isExpanded={expandedSections.businessInfo}
            onToggle={() => toggleSection('businessInfo')}
            data={receiptData}
            onUpdate={updateReceiptData}
          />
          <DocumentDetailsSection 
            isExpanded={expandedSections.documentDetails}
            onToggle={() => toggleSection('documentDetails')}
            data={receiptData}
            onUpdate={updateReceiptData}
          />
        </div>
      </section>

      {/* ZONE 2: TRANSACTION DETAILS */}
      <section>
        <GroupLabel icon={UserCircle} title="Customer & Items" />
        <div className="space-y-3">
          <CustomerInfoSection 
            isExpanded={expandedSections.customerInfo}
            onToggle={() => toggleSection('customerInfo')}
            data={receiptData}
            onUpdate={updateReceiptData}
          />
          <ItemsSection 
            isExpanded={expandedSections.items}
            onToggle={() => toggleSection('items')}
            items={receiptData.items}
            onAddItem={addItem}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
          />
        </div>
      </section>

      {/* ZONE 3: FINANCES & LOGISTICS */}
      <section>
        <GroupLabel icon={CreditCard} title="Payment & Notes" />
        <div className="bg-gray-100/40 rounded-[32px] p-2 space-y-2 border border-gray-200/50">
          <TaxDiscountSection 
            isExpanded={expandedSections.taxDiscount}
            onToggle={() => toggleSection('taxDiscount')}
            data={receiptData}
            onUpdate={updateReceiptData}
          />
          <PaymentSection 
            isExpanded={expandedSections.payment}
            onToggle={() => toggleSection('payment')}
            data={receiptData}
            onUpdate={updateReceiptData}
          />
          <TermsSection 
            isExpanded={expandedSections.terms}
            onToggle={() => toggleSection('terms')}
            data={receiptData}
            onUpdate={updateReceiptData}
          />
        </div>
      </section>

      <MobileActions 
        onAddItem={addItem}
        hasIncompleteItems={receiptData.items.some(i => !i.name || i.price === 0)}
      />
    </div>
  );
};

export default ReceiptForm;