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
import { Building2, CreditCard, UserCircle, Receipt as ReceiptIcon, ShoppingBag } from 'lucide-react';
import StoreRegistrationModal from './StoreRegistrationModal';

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

  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const onRegisterClick = () => setShowModal(true);

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

  // Modern, clear labels for shop owners
  const GroupLabel = ({ icon: Icon, title }) => (
    <div className="flex items-center space-x-2 mb-3 px-2">
      <div className="p-1.5 bg-emerald-500/10 rounded-lg">
        <Icon size={14} className="text-emerald-400" />
      </div>
      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
        {title}
      </span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-6 space-y-10">
      {/* Modals & Alerts */}
      {showModal && (
        <StoreRegistrationModal
          isOpen={showModal}
          onClose={handleModalClose}
          onRegister={() => {setShowModal(true)}}
        />
      )}
      
      {showDraftPrompt && (
        <div className="animate-in slide-in-from-top-4 duration-500">
          <DraftPrompt onRestore={restoreDraft} onDiscard={discardDraft} />
        </div>
      )}

      {/* ZONE 1: WHO IS SENDING THIS? */}
      <section className="animate-in fade-in duration-700">
        <GroupLabel icon={Building2} title="Your Shop & Receipt Type" />
        <div className="bg-[#11141b] rounded-[1rem] px-3  border border-white/5 shadow-2xl overflow-hidden p-2 space-y-2">
          <div className="bg-white/[0.02] rounded-2xl p-1">
            <DocumentTypeSelector 
              receiptType={receiptData.receiptType}
              onTypeChange={(type) => updateReceiptData('receiptType', type)}
            />
          </div>
          <BusinessInfoSection 
            isExpanded={expandedSections.businessInfo}
            onToggle={() => toggleSection('businessInfo')}
            data={receiptData}
            onUpdate={updateReceiptData}
            onRegisterClick={onRegisterClick}
          />
          <DocumentDetailsSection 
            isExpanded={expandedSections.documentDetails}
            onToggle={() => toggleSection('documentDetails')}
            data={receiptData}
            onUpdate={updateReceiptData}
          />
        </div>
      </section>

      {/* ZONE 2: WHO BOUGHT WHAT? */}
      <section className="animate-in fade-in duration-700 delay-100">
        <GroupLabel icon={ShoppingBag} title="Customer & Items" />
        <div className="space-y-4">
          <div className="bg-[#11141b] rounded-[32px] border border-white/5 overflow-hidden p-1">
            <CustomerInfoSection 
              isExpanded={expandedSections.customerInfo}
              onToggle={() => toggleSection('customerInfo')}
              data={receiptData}
              onUpdate={updateReceiptData}
            />
          </div>
          <div className="bg-[#11141b] rounded-[32px] border border-white/5 overflow-hidden p-1">
            <ItemsSection 
              isExpanded={expandedSections.items}
              onToggle={() => toggleSection('items')}
              items={receiptData.items}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
            />
          </div>
        </div>
      </section>

      {/* ZONE 3: MONEY MATTERS */}
      <section className="animate-in fade-in duration-700 delay-200">
        <GroupLabel icon={CreditCard} title="Payments & Final Notes" />
        <div className="bg-emerald-500/[0.02] rounded-[40px] p-3 space-y-3 border border-emerald-500/10 shadow-[inner_0_2px_10px_rgba(0,0,0,0.5)]">
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

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-40 md:hidden">
        <MobileActions 
          onAddItem={addItem}
          hasIncompleteItems={receiptData.items.some(i => !i.name || i.price === 0)}
        />
      </div>
    </div>
  );
};

export default ReceiptForm;