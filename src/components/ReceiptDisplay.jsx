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
      setIsMobile(/iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      // Detailed error reporting for mobile debugging
      const errorMsg = error.message || "Unknown PDF Generation Error";
      console.error("Error generating PDF:", error);
      throw new Error(`PDF Gen Error: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------------- IMPROVED DOWNLOAD / SHARE ---------------- */
  const handleDownloadPDF = async () => {
    try {
      const result = await generatePDF(true);
      const fileName = `${receiptData.receiptType}-${receiptData.receiptNumber}.pdf`;

      // NATIVE MOBILE SHARING (The "No Error" way for Mobile)
      if (isMobile && navigator.share) {
        const file = new File([result.blob], fileName, { type: 'application/pdf' });
        await navigator.share({
          files: [file],
          title: 'Receipt PDF',
          text: 'Here is your receipt'
        }).catch((err) => {
           if (err.name !== 'AbortError') throw err;
        });
      } else {
        // DESKTOP DOWNLOAD
        const link = document.createElement('a');
        link.href = result.url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      await Swal.fire({
        title: "Success!",
        text: "Receipt processed successfully",
        icon: "success",
        timer: 2000
      });
      
      showCoffeeModalIfAllowed();
    } catch (error) {
      Swal.fire({
        title: "Download/Share Error",
        text: `Source: ${error.message}`,
        icon: "error",
        confirmButtonText: "Close"
      });
    }
  };

  /* ---------------- IMPROVED PREVIEW ---------------- */
  const handlePreviewPDF = async () => {
    try {
      const result = await generatePDF(false);
      
      if (isMobile) {
        // Many mobile browsers block blob URLs in new tabs. 
        // We use window.location.href or a better alternative is to just use handleDownloadPDF's share logic.
        // For now, we attempt to open in a way mobile handles best:
        const newWindow = window.open(result.url, '_blank');
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
           // If blocked by popup blocker, fall back to direct navigation
           window.location.href = result.url;
        }
      } else {
        setShowPreview(true);
      }
    } catch (error) {
      Swal.fire({
        title: "Preview Error",
        text: `Source: ${error.message}`,
        icon: "error"
      });
    }
  };

  /* ---------------- PRINT HANDLING ---------------- */
  const handlePrint = async () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) throw new Error("Popup blocked! Please allow popups to print.");

      const htmlContent = printableRef.current.innerHTML;
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Receipt</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              setTimeout(() => { window.print(); window.close(); }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      Swal.fire({ title: "Print Error", text: error.message, icon: "error" });
    }
  };

  /* ---------------- UTILS ---------------- */
  const showCoffeeModalIfAllowed = () => {
    if (!localStorage.getItem("coffeeModalShownToday")) {
      setTimeout(() => setShowCoffeeModal(true), 1500);
      localStorage.setItem("coffeeModalShownToday", "true");
    }
  };

  const shareOnWhatsApp = async () => { /* ... existing WhatsApp logic ... */ };
  const copyToClipboard = async () => { /* ... existing Copy logic ... */ };

  return (
    <div className="space-y-6">
      <MobileNotice isMobile={isMobile} />
      <BuyMeACoffeeModal isOpen={showCoffeeModal} onClose={() => setShowCoffeeModal(false)} />
      
      <PDFPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        pdfUrl={pdfUrl}
        isGenerating={isGenerating}
        onDownload={handleDownloadPDF}
        isMobile={isMobile}
      />

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