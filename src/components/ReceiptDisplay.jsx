import React, { useState, useRef, useEffect } from 'react';
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

// Don't import PDF components at top level - causes SSR issues

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
  const [pdfAvailable, setPdfAvailable] = useState(true);
  const printableRef = useRef();

  /* ---------------- CHECK ENVIRONMENT ONCE ---------------- */

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
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
    if (!isClient) return;
    
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem("coffeeModalLastShown");

    if (lastShown !== today) {
      localStorage.removeItem("coffeeModalShownToday");
      localStorage.setItem("coffeeModalLastShown", today);
    }
  }, [isClient]);

  const showCoffeeModalIfAllowed = () => {
    if (!isClient) return;
    
    if (!localStorage.getItem("coffeeModalShownToday")) {
      setTimeout(() => setShowCoffeeModal(true), 1500);
      localStorage.setItem("coffeeModalShownToday", "true");
    }
  };

  /* ---------------- PRINT FALLBACK (ALWAYS WORKS) ---------------- */

  const handlePrint = async () => {
    if (!isClient) {
      Swal.fire({
        title: "Error",
        text: "Please refresh the page and try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

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
      
      // Success message
      Swal.fire({
        title: "Success!",
        text: "Print dialog opened. Use 'Save as PDF' to download.",
        icon: "success",
        confirmButtonText: "OK",
        timer: 3000
      });
      
      showCoffeeModalIfAllowed();
      
    } catch (error) {
      console.error("Print error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to open print dialog. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  /* ---------------- PDF GENERATION (CLIENT-SIDE ONLY) ---------------- */

  const generatePDF = async (saveToHistory = true) => {
    if (!isClient) {
      throw new Error("Please refresh page and try again");
    }
    
    setIsGenerating(true);
    
    try {
      // Dynamically import PDF libraries ONLY on client side
      const { pdf } = await import('@react-pdf/renderer');
      const ReceiptPDFModule = await import('./ReceiptPDF');
      const ReceiptPDF = ReceiptPDFModule.default;
      
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
      
      // Mark PDF as unavailable
      setPdfAvailable(false);
      
      // Show user-friendly error
      if (error.message.includes("Cannot read properties") || 
          error.message.includes("__CLIENT_INTERNALS")) {
        throw new Error("PDF feature not available. Please use Print instead.");
      } else {
        throw new Error("Failed to generate PDF. Please try Print option.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------------- DOWNLOAD PDF WITH GRACEFUL FALLBACK ---------------- */

  const handleDownloadPDF = async () => {
    if (!isClient) {
      Swal.fire({
        title: "Error",
        text: "Please refresh the page and try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    try {
      // Try PDF generation
      const result = await generatePDF(true);
      
      // Download the PDF
      const link = document.createElement('a');
      link.href = result.url;
      link.download = `${receiptData.receiptType}-${receiptData.receiptNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(result.url), 1000);
      
      // Success message
      Swal.fire({
        title: "Success!",
        text: "Receipt downloaded as PDF",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000
      });
      
      showCoffeeModalIfAllowed();
      
    } catch (error) {
      console.error("Download error:", error);
      
      // Offer print as alternative
      const result = await Swal.fire({
        title: "PDF Download Not Available",
        html: `
          <div style="text-align: left;">
            <p>${error.message}</p>
            <p><strong>Alternative Method:</strong></p>
            <ol>
              <li>Click "Print" button</li>
              <li>In print dialog, select "Save as PDF"</li>
              <li>Choose location and save</li>
            </ol>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Open Print",
        cancelButtonText: "Cancel"
      });
      
      if (result.isConfirmed) {
        await handlePrint();
      }
    }
  };

  /* ---------------- PREVIEW PDF ---------------- */

  const handlePreviewPDF = async () => {
    if (!isClient) {
      Swal.fire({
        title: "Error",
        text: "Please refresh the page and try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    try {
      if (isMobile || !pdfAvailable) {
        // For mobile or when PDF fails, use print
        await handlePrint();
      } else {
        // Try PDF preview
        const result = await generatePDF(false);
        setShowPreview(true);
        
        Swal.fire({
          title: "Success!",
          text: "PDF preview opened",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000
        });
      }
      
      showCoffeeModalIfAllowed();
      
    } catch (error) {
      console.error("Preview error:", error);
      
      // Fallback to print
      Swal.fire({
        title: "Preview Not Available",
        text: "Opening print view instead...",
        icon: "info",
        timer: 2000,
        showConfirmButton: false
      });
      
      setTimeout(() => handlePrint(), 2000);
    }
  };

  /* ---------------- COPY TO CLIPBOARD ---------------- */

  const copyToClipboard = async () => {
    if (!isClient) {
      Swal.fire({
        title: "Error",
        text: "Please refresh the page and try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

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
      
      Swal.fire({
        title: "Success!",
        text: "Receipt copied to clipboard!",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000
      });
      
      showCoffeeModalIfAllowed();
      
    } catch (error) {
      console.error("Copy error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to copy. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  /* ---------------- SHARE ON WHATSAPP ---------------- */

  const shareOnWhatsApp = async () => {
    if (!isClient) {
      Swal.fire({
        title: "Error",
        text: "Please refresh the page and try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

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
      
      Swal.fire({
        title: "Success!",
        text: "WhatsApp share opened",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000
      });
      
      showCoffeeModalIfAllowed();
      
    } catch (error) {
      console.error("Share error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to open WhatsApp. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  /* ---------------- CLEANUP ---------------- */

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading receipt viewer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PDF Availability Notice */}
      {!pdfAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <FileText className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-yellow-800 mb-1">⚠️ PDF Features Limited</p>
              <p className="text-sm text-yellow-700">
                PDF download may not work in this browser. Use <strong>Print → Save as PDF</strong> as alternative.
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
      {pdfAvailable && !isMobile && (
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
  );
};

export default ReceiptDisplay;