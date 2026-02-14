import React, { useState } from 'react';
import { Printer, Download, Share2, Copy, Eye, FileText, Shield, QrCode, Activity, Loader2 } from 'lucide-react';
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
  onShowQR,
  enableVerification,
  onVerify,
  isVerifying
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
      return; 
    }
    
    try {
      if (setIsLoading) {
        setIsLoading(true);
      }
      
      await action();
      
      Swal.fire({
        title: "✅ Success!",
        text: `${actionName} completed successfully!`,
        icon: "success",
        background: '#1c2128',
        color: '#fff',
        confirmButtonColor: '#2563eb',
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
      });
      
      setActionCount?.(prev => prev + 1);
    } catch (error) {
      console.error(`${actionName} error:`, error);
      Swal.fire({
        title: "❌ Error",
        text: `Failed to ${actionName.toLowerCase()}. Please try again.`,
        icon: "error",
        background: '#1c2128',
        color: '#fff',
        confirmButtonColor: '#ef4444',
        confirmButtonText: "OK"
      });
    } finally {
      if (setIsLoading) {
        setTimeout(() => setIsLoading(false), 500);
      }
    }
  };

  const handlePrint = () => handleAction(onPrint, "Print", setIsPrinting);
  const handleDownload = () => handleAction(onDownload, "Download", setIsDownloading);
  const handlePreview = () => handleAction(onPreview, "Preview", setIsPreviewing);
  const handleCopy = () => handleAction(onCopy, "Copy", setIsCopying);
  const handleShare = () => handleAction(onShare, "Share", setIsSharing);

  const isAnyActionLoading = isGenerating || isDownloading || isPrinting || isPreviewing || isCopying || isSharing;

  return (
    <div className="space-y-4">
      {/* Primary Action Grid */}
      <div className={`grid gap-3 ${isAndroid ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
        {!isAndroid && (
          <button
            onClick={handlePrint}
            disabled={isAnyActionLoading || isPrinting}
            className={`group relative overflow-hidden bg-[#1c2128] border border-white/10 text-white rounded-[1.25rem] p-4 flex items-center justify-center space-x-2 transition-all duration-300 font-black uppercase text-[10px] tracking-widest ${
              isPrinting ? 'opacity-70 cursor-wait' : 'hover:bg-white/5 active:scale-95 disabled:opacity-50'
            }`}
          >
            {isPrinting ? (
              <Loader2 className="animate-spin text-blue-500" size={18} />
            ) : (
              <>
                <Printer size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                <span>Print</span>
              </>
            )}
          </button>
        )}
        
        {enableVerification && (
          <>
            {/* Logic space preserved */}
          </>
        )}

        <button
          onClick={handleDownload}
          disabled={isAnyActionLoading || isDownloading}
          className={`group relative overflow-hidden bg-blue-600 text-white rounded-[1.25rem] p-4 flex items-center justify-center space-x-2 transition-all duration-300 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-600/20 ${
            isDownloading ? 'opacity-70 cursor-wait' : 'hover:bg-blue-500 active:scale-95 disabled:opacity-50'
          }`}
        >
          {isDownloading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <Download size={18} />
              <span>Save PDF</span>
            </>
          )}
        </button>
        
        <button
          onClick={handlePreview}
          disabled={isAnyActionLoading || isPreviewing}
          className={`group relative overflow-hidden bg-purple-600 text-white rounded-[1.25rem] p-4 flex items-center justify-center space-x-2 transition-all duration-300 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-purple-600/20 ${
            isPreviewing ? 'opacity-70 cursor-wait' : 'hover:bg-purple-500 active:scale-95 disabled:opacity-50'
          }`}
        >
          {isPreviewing ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <Eye size={18} />
              <span>{isAndroid ? 'View' : (isMobile ? 'Open' : 'Preview')}</span>
            </>
          )}
        </button>
        
        <button
          onClick={handleShare}
          disabled={isAnyActionLoading || isSharing}
          className={`group relative overflow-hidden bg-emerald-600 text-white rounded-[1.25rem] p-4 flex items-center justify-center space-x-2 transition-all duration-300 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-600/20 ${
            isSharing ? 'opacity-70 cursor-wait' : 'hover:bg-emerald-500 active:scale-95 disabled:opacity-50'
          }`}
        >
          {isSharing ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <Share2 size={18} />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Info Status Bar */}
      <div className="bg-[#1c2128] border border-white/5 rounded-[1.5rem] p-5 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <FileText className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">
                Current Document
              </p>
              <h4 className="text-sm font-black text-white uppercase tracking-tighter">
                {receiptData?.receiptType} <span className="text-blue-500">#{receiptData?.receiptNumber}</span>
              </h4>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleCopy}
              disabled={isAnyActionLoading || isCopying}
              className={`h-11 px-5 border rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 transition-all duration-200 ${
                isCopying 
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                  : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {isCopying ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Payload</span>
                </>
              )}
            </button>
            
            <div className="text-right pl-4 border-l border-white/10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Grand Total</p>
              <p className="text-lg font-black text-white leading-none">
                {formatNaira(calculateTotal())}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Processing Bar */}
      {isAnyActionLoading && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(37,99,235,0.4)] flex items-center space-x-3 z-[110] animate-in slide-in-from-bottom-5">
          <Loader2 className="animate-spin" size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">System Processing</span>
        </div>
      )}

      {/* Dynamic Status Message */}
      {isAnyActionLoading && (
        <div className="flex items-center justify-center gap-2 mt-2 py-2 animate-pulse">
          <Activity size={12} className="text-slate-500" />
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Compiling assets and metadata...
          </p>
        </div>
      )}
    </div>
  );
};

export default ReceiptActions;