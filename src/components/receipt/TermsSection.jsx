import React, { useState } from 'react';
import { MessageSquare, FileSignature, Eye, EyeOff, Check, Edit3, MousePointer2 } from 'lucide-react';
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
    receipt: ['Thank you for your business!', 'Goods sold are not returnable', 'Warranty valid for 30 days', 'Keep this receipt for returns'],
    invoice: ['Payment due within 30 days', 'Late fees apply after due date', 'Thank you for your business', 'Contact us for payment options'],
    quote: ['Quote valid for 30 days', 'Prices subject to change', 'Thank you for your consideration', 'Contact us to proceed']
  };

  const presetTerms = {
    receipt: ['Returns accepted within 7 days with receipt', 'No refunds on opened items', 'Warranty covers manufacturing defects only', 'Store credit available for eligible returns'],
    invoice: ['Payment terms: Net 30 days', '1.5% monthly interest on late payments', 'All sales are final', 'Contact accounting department for queries'],
    quote: ['Prices valid for 30 days from date of quote', 'Subject to stock availability', 'Additional charges may apply for special requests', 'Formal acceptance required to proceed']
  };

  return (
    <div className="bg-[#11141b] rounded-[1rem] px-3 border border-white/5 overflow-hidden transition-all  duration-300 shadow-xl">
      <SectionHeader 
        title="Notes & Terms" 
        details="Add your notes, terms and signature"
        icon={MessageSquare} 
        sectionKey="terms"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ 
          text: 'Optional', 
          className: 'bg-white/5 text-slate-500 border border-white/5' 
        }}
      />
      
      {isExpanded && (
        <div className="p-6 sm:p-8 space-y-8 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* Customer Notes */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Customer Notes
            </label>
            <textarea
              value={data.customerNotes}
              onChange={(e) => onUpdate('customerNotes', e.target.value)}
              className="w-full bg-white/[0.03] border-white/10 px-4 py-3 text-sm text-white border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-700"
              rows="2"
              placeholder="e.g. Thank you for your business!"
            />
            
            {/* Quick Message Buttons */}
            <div className="space-y-2">
              <div className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Quick suggestions:</div>
              <div className="flex flex-wrap gap-2">
                {presetMessages[data.receiptType]?.map((msg, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onUpdate('customerNotes', msg)}
                    className="px-3 py-1.5 text-[10px] font-bold bg-white/5 border border-white/5 text-slate-400 rounded-xl hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Options Container */}
          <div className="space-y-8 pt-4 border-t border-white/5">
            
            {/* Terms & Conditions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={data.includeTerms}
                      onChange={(e) => onUpdate('includeTerms', e.target.checked)}
                      className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                    />
                    <div className="w-5 h-5 border-2 border-slate-700 rounded-md peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex items-center justify-center">
                      <div className="w-2 h-2 bg-black rounded-sm scale-0 peer-checked:scale-100 transition-transform" />
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${data.includeTerms ? 'text-emerald-400' : 'text-slate-500'}`}>
                    Include Terms & Conditions
                  </span>
                </label>
                
                {data.includeTerms && presetTerms[data.receiptType] && (
                  <div className="flex flex-wrap gap-1.5">
                    {presetTerms[data.receiptType].map((term, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          const current = data.termsAndConditions || '';
                          const separator = current ? '\n• ' : '• ';
                          onUpdate('termsAndConditions', current + separator + term);
                        }}
                        className="px-2 py-1 text-[9px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"
                      >
                        + {term.split(' ')[0]}...
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {data.includeTerms && (
                <div className="animate-in slide-in-from-top-2 duration-300 space-y-2">
                  <textarea
                    value={data.termsAndConditions}
                    onChange={(e) => onUpdate('termsAndConditions', e.target.value)}
                    className="w-full bg-black/40 border-white/10 px-4 py-3 text-sm text-slate-300 border rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-mono"
                    rows="4"
                    placeholder="Enter policy details..."
                  />
                  <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                    <div className="w-1 h-1 bg-slate-600 rounded-full" /> Tip: Use bullet points (•) for a cleaner layout
                  </div>
                </div>
              )}
            </div>

            {/* Signature Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={data.includeSignature}
                      onChange={(e) => handleSignatureToggle(e.target.checked)}
                      className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                    />
                    <div className="w-5 h-5 border-2 border-slate-700 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all flex items-center justify-center">
                      <div className="w-2 h-2 bg-black rounded-sm scale-0 peer-checked:scale-100 transition-transform" />
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${data.includeSignature ? 'text-blue-400' : 'text-slate-500'}`}>
                    <FileSignature size={14} strokeWidth={3} />
                    Digital Signature Line
                  </span>
                </label>
                
                {data.includeSignature && (
                  <button
                    type="button"
                    onClick={() => setShowSignaturePad(!showSignaturePad)}
                    className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:bg-white/10 hover:text-white transition-all"
                  >
                    {showSignaturePad ? <><EyeOff size={12} /> Hide Pad</> : <><Edit3 size={12} /> {data.signatureData ? 'Edit' : 'Draw'} Signature</>}
                  </button>
                )}
              </div>
              
              {data.includeSignature && showSignaturePad && (
                <div className="p-1 border border-white/10 rounded-2xl bg-white/[0.02] animate-in zoom-in-95 duration-300 shadow-inner">
                  <SignatureCapture 
                    onSignatureSave={handleSignatureSave}
                    existingSignature={data.signatureData}
                  />
                </div>
              )}
              
              {data.includeSignature && data.signatureData && !showSignaturePad && (
                <div className="p-4 border border-emerald-500/20 rounded-2xl bg-emerald-500/5 flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500 text-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                      <Check size={20} strokeWidth={4} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-emerald-400 uppercase tracking-widest">Signature Secured</div>
                      <div className="text-[10px] text-emerald-500/60 font-bold uppercase">Ready for document export</div>
                    </div>
                  </div>
                  <button onClick={() => setShowSignaturePad(true)} className="text-[10px] font-black text-emerald-500 hover:text-emerald-400 uppercase underline decoration-2 underline-offset-4">Change</button>
                </div>
              )}
            </div>
          </div>

          {/* Visual Preview Badge */}
          {(data.customerNotes || data.includeTerms || data.includeSignature) && (
            <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-3 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
               <MousePointer2 size={14} className="text-slate-500" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Live Content Preview Active</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TermsSection;