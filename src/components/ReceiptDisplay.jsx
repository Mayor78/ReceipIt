import React, { useState, useRef, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';
import BuyMeACoffeeModal from './BuyMeACoffeeModal';
import Swal from 'sweetalert2';

// Import new components
import ReceiptActions from './receiptDisplay/ReceiptActions';
import MobileNotice from './receiptDisplay/MobileNotice';
import PrintableReceipt from './receiptDisplay/PrintableReceipt';
import ReceiptPreview from './receiptDisplay/ReceiptPreview';

// Remove PDFPreviewModal import since we won't use it

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

  const [isGenerating, setIsGenerating] = useState(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const printableRef = useRef();

  /* ---------------- CHECK ENVIRONMENT ---------------- */

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

  /* ---------------- UNIVERSAL PRINT FUNCTION (ALWAYS WORKS) ---------------- */

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
      
      // Create a clean print document
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${receiptData.receiptType.toUpperCase()} ${receiptData.receiptNumber}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta charset="UTF-8">
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                .no-print { display: none !important; }
                @page { margin: 0; }
              }
              @media screen {
                body { 
                  background: #f5f5f5;
                  padding: 20px;
                }
              }
              body {
                font-family: system-ui, -apple-system, sans-serif;
                max-width: 400px;
                margin: 0 auto;
                color: #333;
                line-height: 1.4;
              }
              .print-container {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .print-actions {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
              }
              .print-btn {
                padding: 10px 20px;
                background: #2563eb;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.2s;
              }
              .print-btn:hover {
                background: #1d4ed8;
              }
              .print-btn.secondary {
                background: #6b7280;
              }
              .print-btn.secondary:hover {
                background: #4b5563;
              }
              .print-instructions {
                text-align: center;
                margin-top: 15px;
                color: #6b7280;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${printableRef.current?.innerHTML || ""}
            </div>
            <div class="print-actions no-print">
              <button class="print-btn" onclick="window.print()">
                🖨️ Print / Save as PDF
              </button>
              <button class="print-btn secondary" onclick="window.close()">
                Close
              </button>
            </div>
            <div class="print-instructions no-print">
              <p><strong>To save as PDF:</strong> In print dialog, select "Save as PDF" as destination</p>
            </div>
            <script>
              // Auto-open print dialog after 1 second (for desktop)
              setTimeout(() => {
                if (${!isMobile}) {
                  window.print();
                }
              }, 1000);
              
              // Close window after printing
              window.addEventListener('afterprint', function() {
                setTimeout(() => window.close(), 1000);
              });
              
              // Focus the print button for better UX
              document.querySelector('.print-btn').focus();
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Success message
      Swal.fire({
        title: "Print View Opened!",
        html: `
          <div style="text-align: left;">
            <p><strong>To download as PDF:</strong></p>
            <ol>
              <li>Click "Print / Save as PDF" button</li>
              <li>In print dialog, select "Save as PDF"</li>
              <li>Choose location and save</li>
            </ol>
            <p style="color: #666; font-size: 14px; margin-top: 10px;">
              This method works on all browsers and devices.
            </p>
          </div>
        `,
        icon: "info",
        confirmButtonText: "Got it!",
        timer: 5000
      });
      
      showCoffeeModalIfAllowed();
      
    } catch (error) {
      console.error("Print error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to open print view. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  /* ---------------- DOWNLOAD PDF (USES PRINT METHOD) ---------------- */

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
      setIsGenerating(true);
      
      // Show instructions for downloading via print
      await Swal.fire({
        title: "Download Receipt",
        html: `
          <div style="text-align: left;">
            <p><strong>How to download as PDF:</strong></p>
            <ol>
              <li>A print view will open</li>
              <li>Click "Print / Save as PDF" button</li>
              <li>In print dialog, select "Save as PDF"</li>
              <li>Choose location and save</li>
            </ol>
            <p style="color: #666; font-size: 14px; margin-top: 10px;">
              This method works reliably on all browsers and devices.
            </p>
          </div>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Open Print View",
        cancelButtonText: "Cancel",
        timer: 10000
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handlePrint();
        }
      });
      
    } catch (error) {
      console.error("Download error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to prepare download. Please try the Print option.",
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------------- PREVIEW PDF (USES PRINT METHOD) ---------------- */

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
      // Just use the print function for preview
      await handlePrint();
      
    } catch (error) {
      console.error("Preview error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to open preview. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
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

  /* ---------------- DON'T RENDER UNTIL CLIENT-SIDE ---------------- */

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
      {/* Mobile Detection Notice */}
      <MobileNotice isMobile={isMobile} />

      {/* Buy Me a Coffee Modal */}
      <BuyMeACoffeeModal
        isOpen={showCoffeeModal}
        onClose={() => setShowCoffeeModal(false)}
      />

      {/* Simple Info Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <FileText className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-blue-800 mb-1">📄 How to Download PDF:</p>
            <p className="text-sm text-blue-700">
              Click any button below and use <strong>"Save as PDF"</strong> in the print dialog.
              This works on all browsers and devices.
            </p>
          </div>
        </div>
      </div>

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