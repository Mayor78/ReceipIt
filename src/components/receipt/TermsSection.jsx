import React, { useState } from 'react';
import { MessageSquare, FileSignature, Eye, EyeOff, Check } from 'lucide-react';
import SectionHeader from './SectionHeader';
import SignatureCapture from './SignatureCapture';

const TermsSection = ({ 
  isExpanded, 
  onToggle, 
  data, 
  onUpdate 
}) => {
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const handleSignatureSave = (signatureData) => {
    onUpdate('signatureData', signatureData);
  };

  const handleSignatureToggle = (checked) => {
    onUpdate('includeSignature', checked);
    if (checked && !data.signatureData) {
      setShowSignaturePad(true);
    }
  };

  const presetMessages = {
    receipt: [
      'Thank you for your business!',
      'Goods sold are not returnable',
      'Warranty valid for 30 days',
      'Keep this receipt for returns'
    ],
    invoice: [
      'Payment due within 30 days',
      'Late fees apply after due date',
      'Thank you for your business',
      'Contact us for payment options'
    ],
    quote: [
      'Quote valid for 30 days',
      'Prices subject to change',
      'Thank you for your consideration',
      'Contact us to proceed'
    ]
  };

  const presetTerms = {
    receipt: [
      'Returns accepted within 7 days with receipt',
      'No refunds on opened items',
      'Warranty covers manufacturing defects only',
      'Store credit available for eligible returns'
    ],
    invoice: [
      'Payment terms: Net 30 days',
      '1.5% monthly interest on late payments',
      'All sales are final',
      'Contact accounting department for queries'
    ],
    quote: [
      'Prices valid for 30 days from date of quote',
      'Subject to stock availability',
      'Additional charges may apply for special requests',
      'Formal acceptance required to proceed'
    ]
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <SectionHeader 
        title="Notes, Terms & Signature" 
        details="Add your notes, terms and signature"
        icon={MessageSquare} 
        sectionKey="terms"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ text: 'Optional', className: 'bg-gray-100 text-gray-700' }}
      />
      
      {isExpanded && (
        <div className="pt-4 space-y-6 border-t">
          {/* Customer Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Customer Notes
            </label>
            <textarea
              value={data.customerNotes}
              onChange={(e) => onUpdate('customerNotes', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="2"
              placeholder="Thank you for your business!"
            />
            
            {/* Quick Message Buttons */}
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Quick suggestions:</div>
              <div className="flex flex-wrap gap-1">
                {presetMessages[data.receiptType]?.map((msg, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onUpdate('customerNotes', msg)}
                    className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Message */}
          {/* <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Footer Message
            </label>
            <input
              type="text"
              value={data.footerMessage}
              onChange={(e) => onUpdate('footerMessage', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={
                data.receiptType === 'invoice' ? 'Payment due within 30 days' :
                data.receiptType === 'quote' ? 'Quote valid for 30 days' :
                'Thank you for your business!'
              }
            />
          </div> */}

          {/* Quick Options */}
          <div className="space-y-4">
            {/* Terms & Conditions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.includeTerms}
                    onChange={(e) => onUpdate('includeTerms', e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Add Terms & Conditions</span>
                </label>
                
                {data.includeTerms && presetTerms[data.receiptType] && (
                  <div className="flex flex-wrap gap-1">
                    {presetTerms[data.receiptType].map((term, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          const current = data.termsAndConditions || '';
                          const separator = current ? '\n• ' : '• ';
                          onUpdate('termsAndConditions', current + separator + term);
                        }}
                        className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                      >
                        + {term.split(' ')[0]}...
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {data.includeTerms && (
                <div>
                  <textarea
                    value={data.termsAndConditions}
                    onChange={(e) => onUpdate('termsAndConditions', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder={
                      data.receiptType === 'invoice' ? 'Payment terms, late fees, etc.' :
                      data.receiptType === 'quote' ? 'Quote validity, acceptance terms, etc.' :
                      'Return policy, warranty, etc.'
                    }
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Use bullet points (•) for better formatting
                  </div>
                </div>
              )}
            </div>

            {/* Signature */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.includeSignature}
                    onChange={(e) => handleSignatureToggle(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700 flex items-center">
                    <FileSignature size={14} className="mr-1" />
                    Include Signature Line
                  </span>
                </label>
                
                {data.includeSignature && (
                  <button
                    type="button"
                    onClick={() => setShowSignaturePad(!showSignaturePad)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  >
                    {showSignaturePad ? (
                      <>
                        <EyeOff size={12} />
                        <span>Hide Pad</span>
                      </>
                    ) : (
                      <>
                        <Eye size={12} />
                        <span>{data.signatureData ? 'Edit' : 'Add'} Signature</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {data.includeSignature && showSignaturePad && (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <SignatureCapture 
                    onSignatureSave={handleSignatureSave}
                    existingSignature={data.signatureData}
                  />
                </div>
              )}
              
              {data.includeSignature && data.signatureData && !showSignaturePad && (
                <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-green-600">
                        <Check size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-green-800">
                          Signature Added
                        </div>
                        <div className="text-xs text-green-700">
                          Will appear on your document
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowSignaturePad(true)}
                      className="text-xs text-green-700 hover:text-green-800"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="mt-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-xs font-medium text-gray-700 mb-2">Preview on document:</div>
            <div className="space-y-2 text-sm text-gray-600">
              {data.customerNotes && (
                <div className="p-2 bg-white rounded border">
                  <div className="text-xs text-gray-500 mb-1">Notes:</div>
                  {data.customerNotes}
                </div>
              )}
              
              {data.footerMessage && (
                <div className="p-2 bg-white rounded border">
                  <div className="text-xs text-gray-500 mb-1">Footer:</div>
                  {data.footerMessage}
                </div>
              )}
              
              {data.includeSignature && (
                <div className="p-2 bg-white rounded border">
                  <div className="text-xs text-gray-500 mb-1">Signature:</div>
                  <div className="h-8 border-b border-gray-400">
                    {data.signatureData && (
                      <img 
                        src={data.signatureData} 
                        alt="Signature" 
                        className="h-6 opacity-70"
                      />
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {data.signatureData ? 'Digital Signature' : 'Signature Line'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsSection;