import React, { useState } from 'react';
import { Plus, Building2, User, FileText, Percent, Package, TruckIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';
import ReceiptItem from './ReceiptItem';

const ReceiptForm = () => {
  const {
    receiptData,
    updateReceiptData,
    addItem,
    updateItem,
    removeItem
  } = useReceipt();

  // State to manage dropdown sections
  const [expandedSections, setExpandedSections] = useState({
    businessInfo: true,
    documentDetails: true,
    customerInfo: true,
    items: true,
    taxDiscount: true,
    payment: true,
    terms: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionHeader = ({ title, icon: Icon, sectionKey, children }) => (
    <div 
      className="flex items-center justify-between cursor-pointer border-b pb-3"
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex items-center">
        {Icon && <Icon className="mr-2" size={20} />}
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="flex text-xs items-center space-x-2">
        {children}
        {expandedSections[sectionKey] ? (
          <ChevronUp className="text-gray-500" size={20} />
        ) : (
          <ChevronDown className="text-gray-500" size={20} />
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Receipt Type Selector - Always visible */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <FileText className="inline mr-2" size={16} />
          Document Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['receipt', 'invoice', 'quote'].map(type => (
            <button
              key={type}
              onClick={() => updateReceiptData('receiptType', type)}
              className={`px-4 py-3 rounded-lg font-medium capitalize transition-all ${
                receiptData.receiptType === type
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Business Information - Collapsible */}
      <div className="border  rounded-lg p-4 bg-white">
        <SectionHeader 
          title="Business Information" 
          icon={Building2} 
          sectionKey="businessInfo"
        />
        
        {expandedSections.businessInfo && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={receiptData.storeName}
                onChange={(e) => updateReceiptData('storeName', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="ABC Stores Limited"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address *
              </label>
              <input
                type="text"
                value={receiptData.storeAddress}
                onChange={(e) => updateReceiptData('storeAddress', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Shop 15, Allen Avenue, Ikeja, Lagos"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={receiptData.storePhone}
                  onChange={(e) => updateReceiptData('storePhone', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="0803 456 7890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={receiptData.storeEmail}
                  onChange={(e) => updateReceiptData('storeEmail', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="info@business.com.ng"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TIN Number
                </label>
                <input
                  type="text"
                  value={receiptData.tinNumber}
                  onChange={(e) => updateReceiptData('tinNumber', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="TIN: 12345678-0001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RC Number
                </label>
                <input
                  type="text"
                  value={receiptData.rcNumber}
                  onChange={(e) => updateReceiptData('rcNumber', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="RC 123456"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Document Details - Collapsible */}
      <div className="border rounded-lg p-4 bg-white">
        <SectionHeader 
          title="Document Details" 
          sectionKey="documentDetails"
        />
        
        {expandedSections.documentDetails && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cashier/Sales Person *
                </label>
                <input
                  type="text"
                  value={receiptData.cashierName}
                  onChange={(e) => updateReceiptData('cashierName', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Chidi Okafor"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt Number *
                </label>
                <input
                  type="text"
                  value={receiptData.receiptNumber}
                  onChange={(e) => updateReceiptData('receiptNumber', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="RCT000001"
                />
              </div>
            </div>

            {receiptData.receiptType === 'invoice' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={receiptData.invoiceNumber}
                    onChange={(e) => updateReceiptData('invoiceNumber', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="INV2024/0001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    P.O. Number
                  </label>
                  <input
                    type="text"
                    value={receiptData.poNumber}
                    onChange={(e) => updateReceiptData('poNumber', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="PO2024/0001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={receiptData.dueDate}
                    onChange={(e) => updateReceiptData('dueDate', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Information - Collapsible */}
      <div className="border rounded-lg p-4 bg-white">
        <SectionHeader 
          title="Customer Information" 
          icon={User} 
          sectionKey="customerInfo"
        >
          <div className="flex gap-3">
            <label className="flex items-center space-x-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={receiptData.includeBillTo}
                onChange={(e) => updateReceiptData('includeBillTo', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-xs font-medium text-gray-700">Bill To</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={receiptData.includeShipTo}
                onChange={(e) => updateReceiptData('includeShipTo', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-xs font-medium text-gray-700">Ship To</span>
            </label>
          </div>
        </SectionHeader>
        
        {expandedSections.customerInfo && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bill To */}
              {receiptData.includeBillTo && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-sm text-gray-800 mb-3">BILL TO</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={receiptData.billToName}
                      onChange={(e) => updateReceiptData('billToName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Customer Name"
                    />
                    <input
                      type="text"
                      value={receiptData.billToAddress}
                      onChange={(e) => updateReceiptData('billToAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Customer Address"
                    />
                    <input
                      type="tel"
                      value={receiptData.billToPhone}
                      onChange={(e) => updateReceiptData('billToPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              )}

              {/* Ship To */}
              {receiptData.includeShipTo && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-sm text-gray-800 mb-3">SHIP TO</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={receiptData.shipToName}
                      onChange={(e) => updateReceiptData('shipToName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Recipient Name"
                    />
                    <input
                      type="text"
                      value={receiptData.shipToAddress}
                      onChange={(e) => updateReceiptData('shipToAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Delivery Address"
                    />
                    <input
                      type="tel"
                      value={receiptData.shipToPhone}
                      onChange={(e) => updateReceiptData('shipToPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Items Section - Collapsible */}
      <div className="border rounded-lg p-4 bg-white">
        <SectionHeader 
          title="Items" 
          icon={Package} 
          sectionKey="items"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              addItem();
            }}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
          >
            <Plus size={16} />
            <span>Add Item</span>
          </button>
        </SectionHeader>
        
        {expandedSections.items && (
          <div className="mt-4">
            <div className="space-y-2">
              {receiptData.items.map(item => (
                <ReceiptItem
                  key={item.id}
                  item={item}
                  updateItem={updateItem}
                  removeItem={removeItem}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tax, Discount & Charges - Collapsible */}
      <div className="border rounded-lg p-4 bg-white">
        <SectionHeader 
          title="Tax, Discounts & Charges" 
          icon={Percent} 
          sectionKey="taxDiscount"
        />
        
        {expandedSections.taxDiscount && (
          <div className="mt-4 space-y-4">
            {/* VAT */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={receiptData.includeVAT}
                  onChange={(e) => updateReceiptData('includeVAT', e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Include VAT</span>
              </label>
              {receiptData.includeVAT && (
                <div className="mt-3 ml-8">
                  <input
                    type="number"
                    value={receiptData.vatRate}
                    onChange={(e) => updateReceiptData('vatRate', parseFloat(e.target.value) || 0)}
                    className="w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    step="0.1"
                    min="0"
                    placeholder="7.5"
                  />
                  <span className="ml-2 text-sm text-gray-600">%</span>
                </div>
              )}
            </div>

            {/* Discount */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={receiptData.includeDiscount}
                  onChange={(e) => updateReceiptData('includeDiscount', e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Include Discount</span>
              </label>
              {receiptData.includeDiscount && (
                <div className="mt-3 ml-8 grid grid-cols-2 gap-3">
                  <select
                    value={receiptData.discountType}
                    onChange={(e) => updateReceiptData('discountType', e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₦)</option>
                  </select>
                  <input
                    type="number"
                    value={receiptData.discount}
                    onChange={(e) => updateReceiptData('discount', parseFloat(e.target.value) || 0)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    step={receiptData.discountType === 'percentage' ? '0.1' : '100'}
                    min="0"
                    placeholder={receiptData.discountType === 'percentage' ? '10' : '5000'}
                  />
                </div>
              )}
            </div>

            {/* Additional Charges */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <TruckIcon className="mr-2" size={16} />
                  Delivery Fee (₦)
                </label>
                <input
                  type="number"
                  value={receiptData.deliveryFee}
                  onChange={(e) => updateReceiptData('deliveryFee', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  step="100"
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Charge (₦)
                </label>
                <input
                  type="number"
                  value={receiptData.serviceCharge}
                  onChange={(e) => updateReceiptData('serviceCharge', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  step="100"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Method - Collapsible */}
      <div className="border rounded-lg p-4 bg-white">
        <SectionHeader 
          title="Payment Details" 
          sectionKey="payment"
        />
        
        {expandedSections.payment && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  value={receiptData.paymentMethod}
                  onChange={(e) => updateReceiptData('paymentMethod', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="POS">POS (Debit/Credit Card)</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Credit">Credit/Pay Later</option>
                </select>
              </div>

              {receiptData.paymentMethod === 'Cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Paid (₦)
                  </label>
                  <input
                    type="number"
                    value={receiptData.amountPaid}
                    onChange={(e) => updateReceiptData('amountPaid', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    step="100"
                    min="0"
                    placeholder="0"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Terms & Footer - Collapsible */}
      <div className="border rounded-lg p-4 bg-white">
        <SectionHeader 
          title="Terms & Messages" 
          sectionKey="terms"
        />
        
        {expandedSections.terms && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={receiptData.includeTerms}
                onChange={(e) => updateReceiptData('includeTerms', e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Include Terms & Conditions</span>
            </div>

            {receiptData.includeTerms && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms & Conditions
                </label>
                <textarea
                  value={receiptData.termsAndConditions}
                  onChange={(e) => updateReceiptData('termsAndConditions', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="Payment terms, return policy, etc."
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Notes
              </label>
              <textarea
                value={receiptData.customerNotes}
                onChange={(e) => updateReceiptData('customerNotes', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows="2"
                placeholder="Thank you for your business!"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Message
              </label>
              <input
                type="text"
                value={receiptData.footerMessage}
                onChange={(e) => updateReceiptData('footerMessage', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Payment is due within 15 days"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={receiptData.includeSignature}
                onChange={(e) => updateReceiptData('includeSignature', e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Include Signature Line</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptForm;