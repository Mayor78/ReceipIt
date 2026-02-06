// components/BuyMeACoffeeModal.jsx
import React from 'react';
import { Coffee, Copy, X, CheckCircle } from 'lucide-react';
import Portal from './Portal';

const BuyMeACoffeeModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const accountNumber = "7084718050";
  const bankName = "Opay/Paycom"; 
  const accountName = "Mayowa Abraham"; 
  
  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <>
    <Portal>
      {/* Higher z-index backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={onClose}
      />
      
      {/* Modal with even higher z-index */}
      <div className="fixed inset-0 flex items-end sm:items-center justify-center  z-9999 p-2 sm:p-4"
      >
        <div className="relative bg-white rounded-xl sm:rounded-2xl w-full max-w-sm shadow-2xl animate-slide-up sm:animate-scale-in">
          {/* Header */}
          <div className="px-4 pt-4 sm:px-6 sm:pt-6 pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 sm:p-2 bg-amber-100 rounded-full">
                  <Coffee className="text-amber-600" size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-800">Enjoy ReceiptIt?</h2>
                  <p className="text-xs text-gray-500">Support with a coffee! ☕</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="text-gray-500" size={18} />
              </button>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              This free tool helps your business. Consider supporting its development.
            </p>
          </div>
          
          {/* Content */}
          <div className="px-4 sm:px-6 pb-4">
            {/* Bank Transfer Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 mb-3">
              <h3 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">
                Bank Transfer
              </h3>
              
              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Bank</div>
                  <div className="font-medium text-gray-800">{bankName}</div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500">Account Name</div>
                  <div className="font-medium text-gray-800">{accountName}</div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 mb-1">Account Number</div>
                  <div className="flex items-center justify-between">
                    <code className="font-mono text-base sm:text-lg font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">
                      {accountNumber}
                    </code>
                    <button
                      onClick={handleCopyAccountNumber}
                      className="flex items-center space-x-1 px-2 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-xs font-medium ml-2"
                    >
                      {copied ? (
                        <>
                          <CheckCircle size={14} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Donation Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => window.open('https://paystack.shop/pay/hnzvthnq88', '_blank')}
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg p-2 sm:p-3 flex flex-col items-center justify-center transition-colors active:scale-95"
              >
                <div className="text-sm font-bold">₦500</div>
                <div className="text-xs opacity-90">Coffee</div>
              </button>
              
              <button
                onClick={() => window.open('https://paystack.shop/pay/tuk5dw37hv', '_blank')}
                className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg p-2 sm:p-3 flex flex-col items-center justify-center transition-colors active:scale-95"
              >
                <div className="text-sm font-bold">₦1,000</div>
                <div className="text-xs opacity-90">Lunch</div>
              </button>
              
              <button
                onClick={() => window.open('https://paystack.shop/pay/t5nsmmkpbr', '_blank')}
                className="bg-amber-700 hover:bg-amber-800 text-white rounded-lg p-2 sm:p-3 flex flex-col items-center justify-center transition-colors active:scale-95"
              >
                <div className="text-sm font-bold">₦2,000</div>
                <div className="text-xs opacity-90">Dinner</div>
              </button>
            </div>
            
            {/* Custom Amount */}
            <button
              onClick={() => window.open('https://paystack.shop/pay/mvvrth6y8d', '_blank')}
              className="w-full border border-amber-300 text-amber-700 rounded-lg p-2 sm:p-3 hover:bg-amber-50 transition-colors text-sm font-medium mb-3"
            >
              Custom Amount via Paystack
            </button>
          </div>
          
          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl sm:rounded-b-2xl">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Maybe later
              </button>
              <div className="text-xs text-gray-500">
                🙏 Thank you!
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add minimal CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { 
            transform: scale(0.95);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
        }
      `}</style>
      </Portal>
    </>
  );
};

export default BuyMeACoffeeModal;