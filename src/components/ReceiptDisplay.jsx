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

  /* ---------------- DOWNLOAD PDF ---------------- */

  const handleDownloadPDF = async () => {
    try {
      const { url } = await generatePDF(true);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${receiptData.receiptType}-${receiptData.receiptNumber}.pdf`;
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 5000);

      showCoffeeModalIfAllowed();
      return true;
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  };

  /* ---------------- PREVIEW PDF ---------------- */

  const handlePreviewPDF = async () => {
    try {
      const { url } = await generatePDF(false);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 15000);
      return true;
    } catch (error) {
      console.error("Preview error:", error);
      throw error;
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
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 400px;
              margin: auto;
            }
          </style>
        </head>
        <body>
          <div>${printableRef.current?.innerHTML || ""}</div>
          <script>
            setTimeout(() => window.print(), 500);
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();

    showCoffeeModalIfAllowed();
    return Promise.resolve();
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

const copyToClipboard = () => {
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

  showCoffeeModalIfAllowed();

  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  } else {
    // fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
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

  showCoffeeModalIfAllowed();
};


  return (
    <div className="space-y-6">
      {/* Mobile Detection Notice */}
      <MobileNotice isMobile={isMobile} />

      {/* Buy Me a Coffee Modal */}
      <BuyMeACoffeeModal
        isOpen={showCoffeeModal}
        onClose={() => {
          setShowCoffeeModal(false);
          console.log('Coffee modal closed');
        }}
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