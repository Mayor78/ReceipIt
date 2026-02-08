import React from 'react';
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
  // Wrap actions to show success alert and increment action count
  const handleAction = async (action, actionName) => {
    try {
      await action();
      
      // Show success alert
      Swal.fire({
        title: "Success!",
        text: `${actionName} completed successfully!`,
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
      });
      
      // Increment action count for coffee modal
      setActionCount(prev => prev + 1);
    } catch (error) {
      console.error(`${actionName} error:`, error);
      Swal.fire({
        title: "Error",
        text: `Failed to ${actionName.toLowerCase()}. Please try again.`,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons - Mobile Optimized. On Android: hide Print (doesn't work), show View/Download/Share only */}
      <div className={`grid gap-3 ${isAndroid ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
        {!isAndroid && (
        <button
          onClick={() => handleAction(onPrint, "Print")}
          disabled={isGenerating}
          className="group relative overflow-hidden bg-gradient-to-r from-gray-900 to-black text-white rounded-xl p-3 flex items-center justify-center space-x-2 hover:shadow-xl transition-all duration-300 font-medium disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Printer size={18} />
              <span>Print</span>
            </>
          )}
        </button>
        )}
        
        <button
          onClick={() => handleAction(onDownload, "Download")}
          disabled={isGenerating}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-3 flex items-center justify-center space-x-2 hover:shadow-xl transition-all duration-300 font-medium disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Download size={18} />
              <span>Download PDF</span>
            </>
          )}
        </button>
        
        <button
          onClick={() => handleAction(onPreview, "Preview")}
          disabled={isGenerating}
          className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-3 flex items-center justify-center space-x-2 hover:shadow-xl transition-all duration-300 font-medium disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Eye size={18} />
              <span>{isAndroid ? 'View' : (isMobile ? 'Open PDF' : 'Preview PDF')}</span>
            </>
          )}
        </button>
        
        <button
          onClick={() => handleAction(onShare, "Share")}
          className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl p-3 flex items-center justify-center space-x-2 hover:shadow-xl transition-all duration-300 font-medium"
        >
          <Share2 size={18} />
          <span>Share</span>
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
              onClick={() => handleAction(onCopy, "Copy")}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center space-x-2"
            >
              <Copy size={14} />
              <span>Copy Text</span>
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
    </div>
  );
};

export default ReceiptActions;