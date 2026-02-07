import React, { useState, useRef, useEffect } from 'react';
import { FileText, Download, Printer, Share2, Copy, Eye, AlertCircle } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';
import html2canvas from 'html2canvas';
import ReceiptPDF from './ReceiptPDF';
import { pdf } from '@react-pdf/renderer';
import BuyMeACoffeeModal from './BuyMeACoffeeModal';
import Swal from 'sweetalert2';

// Import existing components
import PDFPreviewModal from './receiptDisplay/PDFPreviewModal';
import PrintableReceipt from './receiptDisplay/PrintableReceipt';
import ReceiptPreview from './receiptDisplay/ReceiptPreview';

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
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const printableRef = useRef();
  const previewRef = useRef();

  /* ---------------- MOBILE DETECTION ---------------- */
  useEffect(() => {
    const checkMobile = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ---------------- COFFEE MODAL ---------------- */
  useEffect(() => {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem("coffeeModalLastShown");
    if (lastShown !== today) {
      localStorage.removeItem("coffeeModalShownToday");
      localStorage.setItem("coffeeModalLastShown", today);
    }
  }, []);

  const showCoffeeModalIfAllowed = () => {
    if (!localStorage.getItem("coffeeModalShownToday")) {
      setTimeout(() => setShowCoffeeModal(true), 1500);
      localStorage.setItem("coffeeModalShownToday", "true");
    }
  };

  /* ---------------- DOWNLOAD - MOBILE USES IMAGE, DESKTOP USES PDF ---------------- */
  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      Swal.fire({
        title: 'Generating...',
        text: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      if (isMobile) {
        // MOBILE: Download as PNG image
        const canvas = await html2canvas(printableRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        });

        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${receiptData.receiptType}-${receiptData.receiptNumber}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          Swal.fire({
            icon: 'success',
            title: 'Downloaded!',
            text: 'Receipt image saved to your device',
            timer: 2000,
            showConfirmButton: false
          });

          showCoffeeModalIfAllowed();
        }, 'image/png');

      } else {
        // DESKTOP: Download as PDF
        const pdfInstance = (
          <ReceiptPDF
            receiptData={receiptData}
            formatNaira={formatNaira}
            calculateSubtotal={calculateSubtotal}
            calculateDiscount={calculateDiscount}
            calculateVAT={calculateVAT}
            calculateTotal={calculateTotal}
            calculateChange={calculateChange}
            companyLogo={companyLogo}
          />
        );

        const blob = await pdf(pdfInstance).toBlob();
        saveCurrentReceipt(blob);

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${receiptData.receiptType}-${receiptData.receiptNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(url), 100);

        Swal.fire({
          icon: 'success',
          title: 'Downloaded!',
          text: 'Receipt PDF saved',
          timer: 2000,
          showConfirmButton: false
        });

        showCoffeeModalIfAllowed();
      }

    } catch (error) {
      console.error('Download error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Please try again',
        confirmButtonColor: '#059669'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------------- PREVIEW ---------------- */
  const handlePreview = async () => {
    if (isMobile) {
      // On mobile, just scroll to preview or show alert
      Swal.fire({
        icon: 'info',
        title: 'Preview',
        text: 'Scroll down to see receipt preview. Use Download to save as image.',
        confirmButtonColor: '#059669'
      });
      // Scroll to preview
      previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Desktop PDF preview
    setIsGenerating(true);
    try {
      Swal.fire({
        title: 'Generating Preview...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const pdfInstance = (
        <ReceiptPDF
          receiptData={receiptData}
          formatNaira={formatNaira}
          calculateSubtotal={calculateSubtotal}
          calculateDiscount={calculateDiscount}
          calculateVAT={calculateVAT}
          calculateTotal={calculateTotal}
          calculateChange={calculateChange}
          companyLogo={companyLogo}
        />
      );

      const blob = await pdf(pdfInstance).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setShowPreview(true);

      Swal.close();

    } catch (error) {
      console.error('Preview error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Preview Failed',
        text: 'Please try downloading instead',
        confirmButtonColor: '#059669'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------------- PRINT ---------------- */
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${receiptData.receiptType.toUpperCase()} ${receiptData.receiptNumber}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            @media print {
              body { margin: 0; padding: 10px; }
              .no-print { display: none !important; }
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 400px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          ${printableRef.current?.innerHTML || ""}
          <script>
            setTimeout(() => window.print(), 500);
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      showCoffeeModalIfAllowed();
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Popup Blocked',
        text: 'Please allow popups to print',
        confirmButtonColor: '#059669'
      });
    }
  };

  /* ---------------- COPY TO CLIPBOARD ---------------- */
  const copyToClipboard = async () => {
    const text = `
${receiptData.storeName}
${receiptData.receiptType.toUpperCase()}: ${receiptData.receiptNumber}
Date: ${receiptData.date} | Time: ${receiptData.time}
Cashier: ${receiptData.cashierName}

ITEMS:
${receiptData.items.map(item => 
  `${item.quantity}x ${item.name} @ ${formatNaira(item.price)} = ${formatNaira(item.price * item.quantity)}`
).join('\n')}

Subtotal: ${formatNaira(calculateSubtotal())}
${receiptData.includeDiscount ? `Discount: -${formatNaira(calculateDiscount())}\n` : ''}${receiptData.includeVAT ? `VAT: ${formatNaira(calculateVAT())}\n` : ''}Total: ${formatNaira(calculateTotal())}

Payment: ${receiptData.paymentMethod}

Thank you for your business!
    `.trim();

    try {
      await navigator.clipboard.writeText(text);
      Swal.fire({
        icon: 'success',
        title: 'Copied!',
        timer: 1500,
        showConfirmButton: false
      });
      showCoffeeModalIfAllowed();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Copy Failed',
        text: 'Please try again',
        confirmButtonColor: '#059669'
      });
    }
  };

  /* ---------------- SHARE ON WHATSAPP ---------------- */
  const shareOnWhatsApp = () => {
    const itemsList = receiptData.items.map(item =>
      `${item.quantity}x ${item.name} - ${formatNaira(item.price * item.quantity)}`
    ).join('\n');

    const text = encodeURIComponent(`
*${receiptData.receiptType.toUpperCase()} from ${receiptData.storeName}*

📄 Receipt: ${receiptData.receiptNumber}
📅 Date: ${receiptData.date}

🛒 Items:
${itemsList}

💰 Total: ${formatNaira(calculateTotal())}

Thank you! 🎉
    `.trim());

    window.open(`https://wa.me/?text=${text}`, '_blank');
    showCoffeeModalIfAllowed();
  };

  /* ---------------- CLEANUP ---------------- */
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  return (
    <div className="space-y-6">
      {/* Mobile Notice */}
      {isMobile && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-blue-900">Mobile Mode</p>
              <p className="text-xs text-blue-700 mt-1">
                Download saves as PNG image. Print opens in new window. Preview shows below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Coffee Modal */}
      <BuyMeACoffeeModal
        isOpen={showCoffeeModal}
        onClose={() => setShowCoffeeModal(false)}
      />

      {/* PDF Preview Modal - Desktop Only */}
      {!isMobile && (
        <PDFPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          pdfUrl={pdfUrl}
          isGenerating={isGenerating}
          onDownload={handleDownload}
          isMobile={isMobile}
        />
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={handlePrint}
          disabled={isGenerating}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50"
        >
          <Printer size={18} />
          <span>Print</span>
        </button>
        
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Download size={18} />
              <span>{isMobile ? 'Save Image' : 'Download PDF'}</span>
            </>
          )}
        </button>
        
        <button
          onClick={handlePreview}
          disabled={isGenerating}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50"
        >
          <Eye size={18} />
          <span>Preview</span>
        </button>
        
        <button
          onClick={shareOnWhatsApp}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:shadow-lg transition-all font-medium"
        >
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>

      {/* Quick Actions Bar */}
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
              onClick={copyToClipboard}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center space-x-2 transition-colors"
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

      {/* Hidden Printable Receipt */}
      <div ref={printableRef} className="hidden">
        <PrintableReceipt
          receiptData={receiptData}
          companyLogo={companyLogo}
          formatNaira={formatNaira}
          calculateSubtotal={calculateSubtotal}
          calculateDiscount={calculateDiscount}
          calculateVAT={calculateVAT}
          calculateTotal={calculateTotal}
          calculateChange={calculateChange}
          isMobile={isMobile}
        />
      </div>

      {/* Visible Preview */}
      <div ref={previewRef}>
        <ReceiptPreview
          receiptData={receiptData}
          companyLogo={companyLogo}
          formatNaira={formatNaira}
          calculateSubtotal={calculateSubtotal}
          calculateVAT={calculateVAT}
          calculateTotal={calculateTotal}
        />
      </div>
    </div>
  );
};

export default ReceiptDisplay;