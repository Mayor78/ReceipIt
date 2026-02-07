import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { FileText } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';
import BuyMeACoffeeModal from './BuyMeACoffeeModal';
import Swal from 'sweetalert2';

// Import new components
import ReceiptActions from './receiptDisplay/ReceiptActions';
import PDFPreviewModal from './receiptDisplay/PDFPreviewModal';
import MobileNotice from './receiptDisplay/MobileNotice';
import PrintableReceipt from './receiptDisplay/PrintableReceipt';
import ReceiptPreview from './receiptDisplay/ReceiptPreview';

// Lazy load PDF components to avoid SSR issues
const ReceiptPDF = lazy(() => import('./ReceiptPDF'));
const { pdf } = lazy(() => import('@react-pdf/renderer'));

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
  const [useFallback, setUseFallback] = useState(false);
  const printableRef = useRef();

  // Check if we're in browser environment
  const [isBrowser, setIsBrowser] = useState(false);
  
  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined');
    
    const checkMobile = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      setIsMobile(
        /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ---------------- COFFEE MODAL RESET ---------------- */

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

  /* ---------------- SIMPLE PRINT FALLBACK (No PDF Required) ---------------- */

  const handlePrintFallback = async () => {
    try {
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        Swal.fire({
          title: "Pop-up Blocked",
          text: "Please allow pop-ups for this site to print.",
          icon: "warning",
          confirmButtonText: "OK"
        });
        return;
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${receiptData.receiptType.toUpperCase()} ${receiptData.receiptNumber}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                .no-print { display: none !important; }
                @page { margin: 0; }
              }
              body {
                font-family: system-ui, -apple-system, sans-serif;
                padding: 20px;
                max-width: 400px;
                margin: 0 auto;
                background: white;
              }
              .print-actions {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 20px;
                padding: 10px;
                background: #f0f0f0;
              }
              .print-btn {
                padding: 10px 20px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div>${printableRef.current?.innerHTML || ""}</div>
            <div class="no-print print-actions">
              <button class="print-btn" onclick="window.print()">🖨️ Print Now</button>
              <button class="print-btn" onclick="window.close()" style="background: #6c757d;">Close</button>
            </div>
            <script>
              setTimeout(() => {
                if (${!isMobile}) {
                  window.print();
                }
              }, 1000);
              
              window.addEventListener('afterprint', function() {
                setTimeout(() => window.close(), 500);
              });
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      return true;
    } catch (error) {
      console.error("Print fallback error:", error);
      throw error;
    }
  };

  /* ---------------- PDF GENERATION WITH COMPATIBILITY FIX ---------------- */

  const generatePDF = async (saveToHistory = true) => {
    if (!isBrowser || useFallback) {
      throw new Error("PDF generation not available");
    }
    
    setIsGenerating(true);
    
    try {
      // Dynamically import to avoid SSR issues
      const { pdf } = await import('@react-pdf/renderer');
      const ReceiptPDF = (await import('./ReceiptPDF')).default;
      
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
      
      if (saveToHistory) {
        saveCurrentReceipt(blob);
      }
      
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      
      return { blob, url };
      
    } catch (error) {
      console.error("PDF Generation Error:", error);
      
      // If React PDF fails, switch to fallback mode
      if (!useFallback) {
        setUseFallback(true);
        Swal.fire({
          title: "PDF Feature Limited",
          text: "Using alternative methods. PDF download may not work.",
          icon: "info",
          timer: 3000
        });
      }
      
      throw new Error("PDF generation failed. Use Print instead.");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------------- DOWNLOAD PDF WITH FALLBACK ---------------- */

  const handleDownloadPDF = async () => {
    try {
      // First try PDF generation
      const result = await generatePDF(true);
      
      const link = document.createElement('a');
      link.href = result.url;
      link.download = `${receiptData.receiptType}-${receiptData.receiptNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(result.url), 1000);
      
      await Swal.fire({
        title: "Success!",
        text: "Receipt downloaded as PDF",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000
      });
      
      showCoffeeModalIfAllowed();
      return true;
      
    } catch (error) {
      console.error("Download error:", error);
      
      // Offer print fallback
      const result = await Swal.fire({
        title: "Download Failed",
        html: `
          <div style="text-align: left;">
            <p>PDF download is not available.</p>
            <p><strong>Alternative:</strong></p>
            <ol>
              <li>Use "Print" button</li>
              <li>In print dialog, select "Save as PDF"</li>
              <li>Choose location and save</li>
            </ol>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Open Print View",
        cancelButtonText: "Cancel"
      });
      
      if (result.isConfirmed) {
        await handlePrintFallback();
      }
      
      throw error;
    }
  };

  /* ---------------- PREVIEW PDF ---------------- */

  const handlePreviewPDF = async () => {
    try {
      if (isMobile || useFallback) {
        // For mobile or when PDF fails, use print fallback
        await handlePrintFallback();
      } else {
        // Try PDF preview
        const result = await generatePDF(false);
        setShowPreview(true);
      }
      
      showCoffeeModalIfAllowed();
      return true;
      
    } catch (error) {
      console.error("Preview error:", error);
      
      // Fallback to print
      Swal.fire({
        title: "Preview Unavailable",
        text: "Opening print view instead...",
        icon: "info",
        timer: 2000,
        showConfirmButton: false
      });
      
      await handlePrintFallback();
      showCoffeeModalIfAllowed();
      return true;
    }
  };

  /* ---------------- PRINT ---------------- */

  const handlePrint = async () => {
    try {
      await handlePrintFallback();
      showCoffeeModalIfAllowed();
      return true;
    } catch (error) {
      console.error("Print error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to print. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
      throw error;
    }
  };

  /* ---------------- COPY TO CLIPBOARD ---------------- */

  const copyToClipboard = async () => {
    try {
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
${receiptData.includeDiscount ? `Discount: -${formatNaira(calculateDiscount())}\n` : ''}
${receiptData.includeVAT ? `VAT: ${formatNaira(calculateVAT())}\n` : ''}
Total: ${formatNaira(calculateTotal())}

Payment: ${receiptData.paymentMethod}
${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? 
  `Amount Paid: ${formatNaira(receiptData.amountPaid)}\nChange: ${formatNaira(calculateChange())}\n` : ''}

${receiptData.customerNotes}

${receiptData.includeSignature ? 'Signed: _________________' : ''}

Thank you for your business!
      `.trim();

      await navigator.clipboard.writeText(text);
      
      await Swal.fire({
        title: "Success!",
        text: "Receipt copied to clipboard!",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000
      });
      
      showCoffeeModalIfAllowed();
      return true;
    } catch (error) {
      console.error("Copy error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to copy. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
      throw error;
    }
  };

  /* ---------------- SHARE ON WHATSAPP ---------------- */

  const shareOnWhatsApp = async () => {
    try {
      const itemsList = receiptData.items.map(item =>
        `${item.quantity}x ${item.name} - ${formatNaira(item.price * item.quantity)}`
      ).join('\n');

      const text = encodeURIComponent(`
*${receiptData.receiptType.toUpperCase()} from ${receiptData.storeName}*

📄 Receipt: ${receiptData.receiptNumber}
📅 Date: ${receiptData.date}
⏰ Time: ${receiptData.time}
👤 Cashier: ${receiptData.cashierName}

🛒 Items:
${itemsList}

💰 Total: ${formatNaira(calculateTotal())}

${receiptData.customerNotes}

${receiptData.includeSignature ? '✍️ Signed' : ''}

Thank you for your business! 🎉
      `.trim());

      window.open(`https://wa.me/?text=${text}`, '_blank');
      
      await Swal.fire({
        title: "Success!",
        text: "WhatsApp share opened",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000
      });
      
      showCoffeeModalIfAllowed();
      return true;
    } catch (error) {
      console.error("Share error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to open WhatsApp. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
      throw error;
    }
  };

  /* ---------------- CLEANUP ---------------- */

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  // Show loading state
  if (!isBrowser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Loading receipt viewer...</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF features...</p>
        </div>
      </div>
    }>
      <div className="space-y-6">
        {/* Fallback Notice */}
        {useFallback && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <FileText className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-yellow-800 mb-1">⚠️ PDF Features Limited</p>
                <p className="text-sm text-yellow-700">
                  PDF download may not work. Use <strong>Print → Save as PDF</strong> as alternative.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Detection Notice */}
        <MobileNotice isMobile={isMobile} />

        {/* Buy Me a Coffee Modal */}
        <BuyMeACoffeeModal
          isOpen={showCoffeeModal}
          onClose={() => setShowCoffeeModal(false)}
        />

        {/* PDF Preview Modal - Desktop Only */}
        {!useFallback && (
          <PDFPreviewModal
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            pdfUrl={pdfUrl}
            isGenerating={isGenerating}
            onDownload={handleDownloadPDF}
            isMobile={isMobile}
          />
        )}

        {/* Action Buttons Component */}
        <ReceiptActions
          onPrint={handlePrint}
          onDownload={handleDownloadPDF}
          onPreview={handlePreviewPDF}
          onShare={shareOnWhatsApp}
          onCopy={copyToClipboard}
          isGenerating={isGenerating}
          isMobile={isMobile}
          receiptData={receiptData}
          savedReceipts={savedReceipts}
          formatNaira={formatNaira}
          calculateTotal={calculateTotal}
          setActionCount={() => {}}
        />

        {/* Printable Receipt (Hidden for print) */}
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
        <ReceiptPreview
          receiptData={receiptData}
          companyLogo={companyLogo}
          formatNaira={formatNaira}
          calculateSubtotal={calculateSubtotal}
          calculateVAT={calculateVAT}
          calculateTotal={calculateTotal}
        />
      </div>
    </Suspense>
  );
};

export default ReceiptDisplay;