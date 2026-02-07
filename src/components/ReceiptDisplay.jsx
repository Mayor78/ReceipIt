import React, { useState, useRef, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';
import ReceiptPDF from './ReceiptPDF';
import { pdf } from '@react-pdf/renderer';
import BuyMeACoffeeModal from './BuyMeACoffeeModal';
import Swal from 'sweetalert2';

// Import new components
import ReceiptActions from './receiptDisplay/ReceiptActions';
import PDFPreviewModal from './receiptDisplay/PDFPreviewModal';
import MobileNotice from './receiptDisplay/MobileNotice';
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

  /* ---------------- MOBILE DETECTION ---------------- */

  useEffect(() => {
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

  /* ---------------- PDF GENERATION ---------------- */

  const generatePDF = async (saveToHistory = true) => {
    setIsGenerating(true);
    try {
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
      console.error("Error generating PDF:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------------- DOWNLOAD PDF (WORKING FOR BOTH MOBILE & DESKTOP) ---------------- */

  const handleDownloadPDF = async () => {
    try {
      const result = await generatePDF(true);
      
      // SIMPLE APPROACH THAT WORKS ON ALL DEVICES
      const link = document.createElement('a');
      link.href = result.url;
      link.download = `${receiptData.receiptType}-${receiptData.receiptNumber}.pdf`;
      
      // Append to body
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(result.url);
      }, 100);
      
      // Show success message
      await Swal.fire({
        title: "Success!",
        text: "Receipt downloaded successfully",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000
      });
      
      // Show coffee modal
      showCoffeeModalIfAllowed();
      
      return true;
    } catch (error) {
      console.error("Download error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to download. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
      throw error;
    }
  };

  /* ---------------- PREVIEW PDF (WORKING FOR BOTH MOBILE & DESKTOP) ---------------- */

  const handlePreviewPDF = async () => {
    try {
      const result = await generatePDF(false);
      
      if (isMobile) {
        // On mobile, open in new tab
        window.open(result.url, '_blank');
        
        // Clean up after some time
        setTimeout(() => {
          URL.revokeObjectURL(result.url);
        }, 30000); // 30 seconds
      } else {
        // On desktop, show preview modal
        setShowPreview(true);
      }
      
      // Show success message
      await Swal.fire({
        title: "Success!",
        text: "Receipt preview opened",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000
      });
      
      // Show coffee modal
      showCoffeeModalIfAllowed();
      
      return true;
    } catch (error) {
      console.error("Preview error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to preview. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
      throw error;
    }
  };

  /* ---------------- PRINT (WORKING FOR BOTH MOBILE & DESKTOP) ---------------- */

  const handlePrint = async () => {
    try {
      // Generate print HTML
      const printContent = `
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
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px;
                max-width: 400px;
                margin: 0 auto;
              }
              @media screen {
                body {
                  background: #f5f5f5;
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
                }
              }
            </style>
          </head>
          <body>
            <div>${printableRef.current?.innerHTML || ""}</div>
            <div class="no-print print-actions">
              <button class="print-btn" onclick="window.print()">Print Now</button>
              <button class="print-btn" onclick="window.close()" style="background: #6c757d;">Close</button>
            </div>
            <script>
              // Auto-print after a short delay
              setTimeout(() => {
                if (${!isMobile}) {
                  window.print();
                }
              }, 500);
              
              // Close after print
              window.addEventListener('afterprint', function() {
                setTimeout(() => window.close(), 500);
              });
            </script>
          </body>
        </html>
      `;

      // Open print window
      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Show success message
      await Swal.fire({
        title: "Success!",
        text: "Print dialog opened",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000
      });
      
      // Show coffee modal
      showCoffeeModalIfAllowed();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Print error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to open print dialog. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
      throw error;
    }
  };

  /* ---------------- CLEANUP ---------------- */

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

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

      // Use modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
        } catch (err) {
          throw new Error('Copy failed');
        }
        
        document.body.removeChild(textArea);
      }

      // Show success message
      await Swal.fire({
        title: "Success!",
        text: "Receipt copied to clipboard!",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000
      });
      
      // Show coffee modal
      showCoffeeModalIfAllowed();
      
      return Promise.resolve();
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

      // Open WhatsApp
      window.open(`https://wa.me/?text=${text}`, '_blank');
      
      // Show success message
      await Swal.fire({
        title: "Success!",
        text: "WhatsApp share opened",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000
      });
      
      // Show coffee modal
      showCoffeeModalIfAllowed();
      
      return Promise.resolve();
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

  return (
    <div className="space-y-6">
      {/* Mobile Detection Notice */}
      <MobileNotice isMobile={isMobile} />

      {/* Buy Me a Coffee Modal */}
      <BuyMeACoffeeModal
        isOpen={showCoffeeModal}
        onClose={() => setShowCoffeeModal(false)}
      />

      {/* PDF Preview Modal - Desktop Only */}
      <PDFPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        pdfUrl={pdfUrl}
        isGenerating={isGenerating}
        onDownload={handleDownloadPDF}
        isMobile={isMobile}
      />

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
        setActionCount={() => {}} // Not needed anymore
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