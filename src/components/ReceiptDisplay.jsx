import React, { useState, useRef, useEffect } from 'react';
import { Printer, Download, Share2, Copy, FileText, Eye, X, CheckCircle } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';
import ReceiptPDF from './ReceiptPDF';
import { pdf } from '@react-pdf/renderer';
import BuyMeACoffeeModal from './BuyMeACoffeeModal';

const ReceiptDisplay = () => {
  const {
    receiptData,
    companyLogo,
    savedReceipts,
    saveCurrentReceipt,
    calculateSubtotal,
    calculateDiscount,
    calculateVAT,
    calculateTotal,
    calculateChange,
    formatNaira
  } = useReceipt();
  
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const [actionCount, setActionCount] = useState(0);
  const printableRef = useRef();

  // Clean up Blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (actionCount >= 3) {
      const hasShownToday = localStorage.getItem('coffeeModalShown');
      if (!hasShownToday) {
        setTimeout(() => {
          setShowCoffeeModal(true);
          localStorage.setItem('coffeeModalShown', 'true');
        }, 1500);
        setActionCount(0);
      }
    }
  }, [actionCount]);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('coffeeModalLastShown');
    if (lastShown !== today) {
      localStorage.removeItem('coffeeModalShown');
      localStorage.setItem('coffeeModalLastShown', today);
    }
  }, []);

  const generatePDFBlob = async () => {
    const pdfInstance = (
      <ReceiptPDF
        receiptData={receiptData}
        calculateSubtotal={calculateSubtotal}
        calculateDiscount={calculateDiscount}
        calculateVAT={calculateVAT}
        calculateTotal={calculateTotal}
        calculateChange={calculateChange}
        companyLogo={companyLogo}
      />
    );
    return await pdf(pdfInstance).toBlob();
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const blob = await generatePDFBlob();
      saveCurrentReceipt(blob);
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${receiptData.receiptType}-${receiptData.receiptNumber}.pdf`;
      
      // Required for Firefox/Mobile Safari
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setActionCount(prev => prev + 1);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Mobile browser blocked the download. Please try again or use Chrome.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewPDF = async () => {
    setIsGenerating(true);
    setShowPreview(true);
    try {
      const blob = await generatePDFBlob();
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setActionCount(prev => prev + 1);
    } catch (error) {
      console.error('Preview Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the receipt');
      return;
    }

    const printContent = `
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .print-container { max-width: 800px; margin: auto; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="print-container">${printableRef.current.innerHTML}</div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const copyToClipboard = () => {
    const text = `
${receiptData.storeName}
${receiptData.receiptType.toUpperCase()}: ${receiptData.receiptNumber}
Total: ${formatNaira(calculateTotal())}
Thank you for your business!
    `.trim();
    
    if (navigator.share) {
      // Use native share if on mobile
      navigator.share({ title: 'Receipt', text: text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('Receipt text copied!');
        setActionCount(prev => prev + 1);
      });
    }
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`*${receiptData.storeName}* \nReceipt: ${receiptData.receiptNumber}\nTotal: ${formatNaira(calculateTotal())}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setActionCount(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <BuyMeACoffeeModal isOpen={showCoffeeModal} onClose={() => setShowCoffeeModal(false)} />

      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white p-4 rounded-xl shadow-lg flex items-center space-x-2">
          <CheckCircle size={20} />
          <span>Receipt Saved Successfully!</span>
        </div>
      )}

      {/* PDF Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-2 md:p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-bold">PDF Preview</h2>
              <button onClick={() => setShowPreview(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            <div className="flex-1 bg-gray-200 overflow-hidden relative">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm">Rendering PDF...</p>
                </div>
              ) : (
                <object
                  data={pdfUrl}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <p className="mb-4">Mobile browsers may not support inline PDF previews.</p>
                    <button onClick={handleDownloadPDF} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                      Download to View
                    </button>
                  </div>
                </object>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button onClick={handlePrint} className="flex items-center justify-center space-x-2 bg-gray-900 text-white p-3 rounded-xl hover:opacity-90 transition">
          <Printer size={18} /> <span>Print</span>
        </button>
        <button onClick={handleDownloadPDF} disabled={isGenerating} className="flex items-center justify-center space-x-2 bg-blue-600 text-white p-3 rounded-xl hover:opacity-90 transition disabled:bg-blue-400">
          <Download size={18} /> <span>{isGenerating ? 'Generating...' : 'Save PDF'}</span>
        </button>
        <button onClick={handlePreviewPDF} className="flex items-center justify-center space-x-2 bg-purple-600 text-white p-3 rounded-xl hover:opacity-90 transition">
          <Eye size={18} /> <span>Preview</span>
        </button>
        <button onClick={shareOnWhatsApp} className="flex items-center justify-center space-x-2 bg-green-600 text-white p-3 rounded-xl hover:opacity-90 transition">
          <Share2 size={18} /> <span>Share</span>
        </button>
      </div>

      {/* Visual UI Preview */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 max-w-md mx-auto">
        <div className="text-center border-b pb-4 mb-4">
          {companyLogo && <img src={companyLogo} alt="Logo" className="h-12 mx-auto mb-2" />}
          <h2 className="text-xl font-bold">{receiptData.storeName}</h2>
          <p className="text-xs text-gray-500">{receiptData.storeAddress}</p>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span>#{receiptData.receiptNumber}</span>
          <span>{receiptData.date}</span>
        </div>
        <div className="space-y-2 mb-4">
          {receiptData.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span>{formatNaira(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-2 space-y-1">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-blue-600">{formatNaira(calculateTotal())}</span>
          </div>
        </div>
      </div>

      {/* Hidden container for Browser Printing */}
      <div ref={printableRef} className="hidden">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>{receiptData.storeName}</h1>
          <p>{receiptData.storeAddress}</p>
          <hr />
          <p>Receipt: {receiptData.receiptNumber}</p>
          <p>Total: {formatNaira(calculateTotal())}</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDisplay;