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

 /* ---------------- THE "LOADER-FIRST" PREVIEW ---------------- */
  const handlePreviewPDF = async () => {
    let remoteWindow = null;

    if (isMobile) {
      // 1. Open window IMMEDIATELY to bypass popup blockers
      remoteWindow = window.open('', '_blank');
      
      if (!remoteWindow) {
        Swal.fire({
          title: "Popup Blocked",
          text: "Please enable popups to view the receipt.",
          icon: "warning"
        });
        return;
      }

      // 2. Inject a nice loader into the new window
      remoteWindow.document.write(`
        <div id="loader-container" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
          <div style="border: 8px solid #f3f3f3; border-top: 8px solid #3498db; border-radius: 50%; width: 60px; height: 60px; animation: spin 2s linear infinite;"></div>
          <p style="margin-top: 20px; font-size: 18px; color: #555;">Generating Your Receipt...</p>
          <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </div>
      `);
    }

    try {
      // 3. Generate the PDF
      const result = await generatePDF(false);
      
      if (isMobile && remoteWindow) {
        // 4. Swap loader for the PDF
        remoteWindow.location.href = result.url;
      } else if (!isMobile) {
        setShowPreview(true);
      }
    } catch (error) {
      if (remoteWindow) remoteWindow.close();
      Swal.fire({
        title: "Error",
        text: `Source: ${error.message}`,
        icon: "error"
      });
    }
  };

  /* ---------------- SHARE / DOWNLOAD WITH LOADER ---------------- */
  const handleDownloadPDF = async () => {
    // Show a loading overlay on the main screen
    Swal.fire({
      title: 'Preparing PDF',
      html: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const result = await generatePDF(true);
      const fileName = `${receiptData.receiptType}-${receiptData.receiptNumber}.pdf`;

      if (isMobile && navigator.share) {
        const file = new File([result.blob], fileName, { type: 'application/pdf' });
        
        // Native Share sheet
        await navigator.share({
          files: [file],
          title: 'Receipt',
        });
        Swal.close(); 
      } else {
        // Desktop Download logic
        const link = document.createElement('a');
        link.href = result.url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        Swal.fire({ title: "Success!", icon: "success", timer: 1500 });
      }
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error" });
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