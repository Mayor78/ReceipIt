import React, { useState } from 'react';
import { Printer, Download, Share2, Copy, Eye, FileText } from 'lucide-react';
import Swal from 'sweetalert2';

const ReceiptActions = ({
  onPrint,
  onDownload,
  onPreview,
  onShare,
  onCopy,
  isGenerating,
  isMobile,
  platform,
  receiptData,
  formatNaira,
  setActionCount,
  calculateTotal,
  savedReceipts,
}) => {
  const isAndroid = platform === 'android';
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Wrap actions to show success alert and increment action count
  const handleAction = async (action, actionName, setIsLoading) => {
    if (isGenerating || (setIsLoading && setIsLoading._currentValue)) {
      return; // Prevent multiple clicks if already loading
    }
    
    try {
      // Set loading state for this specific action
      if (setIsLoading) {
        setIsLoading(true);
      }
      
      await action();
      
      // Show success alert
      Swal.fire({
        title: "✅ Success!",
        text: `${actionName} completed successfully!`,
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
      });
      
      // Increment action count for coffee modal
      setActionCount?.(prev => prev + 1);
    } catch (error) {
      console.error(`${actionName} error:`, error);
      Swal.fire({
        title: "❌ Error",
        text: `Failed to ${actionName.toLowerCase()}. Please try again.`,
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      // Reset loading state
      if (setIsLoading) {
        setTimeout(() => setIsLoading(false), 500); // Small delay to show success state
      }
    }
  };

  // Specific handlers for each action
  const handlePrint = () => handleAction(onPrint, "Print", setIsPrinting);
  const handleDownload = () => handleAction(onDownload, "Download", setIsDownloading);
  const handlePreview = () => handleAction(onPreview, "Preview", setIsPreviewing);
  const handleCopy = () => handleAction(onCopy, "Copy", setIsCopying);
  const handleShare = () => handleAction(onShare, "Share", setIsSharing);

  // Check if any action is in progress
  const isAnyActionLoading = isGenerating || isDownloading || isPrinting || isPreviewing || isCopying || isSharing;

  return (
    <div className="space-y-4">
      {/* Action Buttons - Mobile Optimized. On Android: hide Print (doesn't work), show View/Download/Share only */}
      <div className={`grid gap-3 ${isAndroid ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
        {!isAndroid && (
          <button
            onClick={handlePrint}
            disabled={isAnyActionLoading || isPrinting}
            className={`group relative overflow-hidden bg-gradient-to-r from-gray-900 to-black text-white rounded-xl p-3 flex items-center justify-center space-x-2 transition-all duration-300 font-medium ${
              isPrinting ? 'opacity-70 cursor-wait' : 'hover:shadow-xl disabled:opacity-50'
            }`}
          >
            {isPrinting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Printing...</span>
              </>
            ) : (
              <>
                <Printer size={18} />
                <span>Print</span>
              </>
            )}
          </button>
        )}
        
        <button
          onClick={handleDownload}
          disabled={isAnyActionLoading || isDownloading}
          className={`group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-3 flex items-center justify-center space-x-2 transition-all duration-300 font-medium ${
            isDownloading ? 'opacity-70 cursor-wait' : 'hover:shadow-xl disabled:opacity-50'
          }`}
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <Download size={18} />
              <span>Download PDF</span>
            </>
          )}
        </button>
        
        <button
          onClick={handlePreview}
          disabled={isAnyActionLoading || isPreviewing}
          className={`group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-3 flex items-center justify-center space-x-2 transition-all duration-300 font-medium ${
            isPreviewing ? 'opacity-70 cursor-wait' : 'hover:shadow-xl disabled:opacity-50'
          }`}
        >
          {isPreviewing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Opening...</span>
            </>
          ) : (
            <>
              <Eye size={18} />
              <span>{isAndroid ? 'View' : (isMobile ? 'Open PDF' : 'Preview PDF')}</span>
            </>
          )}
        </button>
        
        <button
          onClick={handleShare}
          disabled={isAnyActionLoading || isSharing}
          className={`group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl p-3 flex items-center justify-center space-x-2 transition-all duration-300 font-medium ${
            isSharing ? 'opacity-70 cursor-wait' : 'hover:shadow-xl disabled:opacity-50'
          }`}
        >
          {isSharing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Sharing...</span>
            </>
          ) : (
            <>
              <Share2 size={18} />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <FileText className="text-blue-600" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {receiptData?.receiptType?.toUpperCase()} #{receiptData?.receiptNumber}
              </p>
              <p className="text-xs text-gray-600">{savedReceipts?.length || 0} saved in history</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              disabled={isAnyActionLoading || isCopying}
              className={`px-3 py-2 border rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${
                isCopying 
                  ? 'border-blue-300 bg-blue-50 text-blue-700 cursor-wait' 
                  : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50'
              }`}
            >
              {isCopying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Copying...</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Text</span>
                </>
              )}
            </button>
            
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">
                {formatNaira(calculateTotal())}
              </p>
              <p className="text-xs text-gray-500">Grand Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator for any action */}
      {isAnyActionLoading && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-pulse">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm">Processing...</span>
        </div>
      )}

      {/* Help text for users */}
      {isAnyActionLoading && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            ⏳ Please wait while we process your request...
          </p>
        </div>
      )}
    </div>
  );
};

export default ReceiptActions;