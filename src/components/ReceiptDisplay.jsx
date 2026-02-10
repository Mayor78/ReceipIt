import React, { useState, useRef, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';
import BuyMeACoffeeModal from './BuyMeACoffeeModal';
import Swal from 'sweetalert2';
import html2pdf from 'html2pdf.js';
import TemplateSelector from './receiptTemplates/TemplateSelector';
import TemplateRenderer from './receiptTemplates/TemplateRenderer';
import ReceiptActions from './receiptDisplay/ReceiptActions';
import { generatePrintHTML } from './receiptTemplates/printTemplates';
import { getPrintStyles, detectPlatform } from '../utils/printUtils';

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
    formatNaira,
    selectedTemplate
  } = useReceipt();

  const [isGenerating, setIsGenerating] = useState(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [platform, setPlatform] = useState('desktop');
  

  /* ---------------- CHECK ENVIRONMENT ---------------- */
  useEffect(() => {
    setIsClient(true);
    
    const checkDevice = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      setIsMobile(isMobileDevice);
      
      // Detect specific platform
      const detectedPlatform = detectPlatform();
      setPlatform(detectedPlatform);
    };
    
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  /* ---------------- COFFEE MODAL RESET ---------------- */
  useEffect(() => {
  setIsClient(true);
  // Remove the daily reset logic if you want to show every time
}, []);

const showCoffeeModalIfAllowed = () => {
  if (!isClient) return;
  
  // Show modal every time (remove the localStorage check)
  setTimeout(() => setShowCoffeeModal(true), 1500);
  
  // Optional: Still track that it was shown today, but don't prevent showing again
  localStorage.setItem("coffeeModalShownToday", "true");
};

  /* ---------------- PRINT (iOS/PC only - Print hidden on Android) ---------------- */
  const handlePrint = async () => {
    if (!isClient) {
      Swal.fire({ title: "Error", text: "Please refresh the page and try again.", icon: "error", confirmButtonText: "OK" });
      return;
    }
    try {
      await handleStandardPrint(false);
      
    } catch (error) {
      console.error("Print error:", error);
      Swal.fire({
        title: "Print Error",
        html: `
          <div style="text-align: left;">
            <p style="margin-bottom: 15px;">Failed to print. Please try:</p>
            <ol style="margin-left: 20px;">
              <li>Allow pop-ups for this site</li>
              <li>Try the download PDF option instead</li>
              <li>Use Chrome browser for best results</li>
            </ol>
          </div>
        `,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  /* ---------------- STANDARD PRINT (iOS/Desktop/Android) ---------------- */
  const handleStandardPrint = async (isAndroid = false) => {
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
    
    // Calculate all values
    const calculations = {
      subtotal: calculateSubtotal(),
      discount: calculateDiscount(),
      vat: calculateVAT(),
      total: calculateTotal(),
      change: calculateChange(),
      deliveryFee: receiptData.deliveryFee || 0
    };
    
    // Generate the selected template HTML
    const templateHtml = generatePrintHTML(
      selectedTemplate,
      receiptData,
      companyLogo,
      formatNaira,
      calculations
    );
    
    const printDocument = createPrintDocument(templateHtml, { isAndroid });
    
    printWindow.document.write(printDocument);
    printWindow.document.close();
    
    // CRITICAL: Wait for full load + images before print - fixes blank PDF
    const triggerPrint = () => {
      printWindow.focus();
      try {
        printWindow.print();
      } catch (e) {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          Swal.fire({
            title: "Print Instructions",
            html: `
              <div style="text-align: left;">
                <p>On iOS, please:</p>
                <ol style="margin-left: 20px;">
                  <li>Tap the Share button (📤)</li>
                  <li>Scroll and select "Print"</li>
                  <li>Choose your printer or "Save to PDF"</li>
                </ol>
              </div>
            `,
            icon: "info",
            confirmButtonText: "Got it"
          });
        }
      }
    };

    // Wait for document load, then images, then paint - prevents blank PDF
    const doPrintWhenReady = () => {
      const doc = printWindow.document;
      const imgs = doc.querySelectorAll('img');
      const imgPromises = Array.from(imgs).map(img =>
        img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
      );
      Promise.all(imgPromises).then(() => {
        // Extra delay for layout/paint - Chrome PDF capture needs content fully rendered
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(triggerPrint, 500);
          });
        });
      });
    };
    
    printWindow.onload = doPrintWhenReady;
    
    // Show coffee modal on main page
    showCoffeeModalIfAllowed();
  };

  /* ---------------- ANDROID VIEW (receipt in new tab with Download button - print doesn't work on Android) ---------------- */
  const handleAndroidView = () => {
    const viewWindow = window.open('', '_blank');
    if (!viewWindow) {
      Swal.fire({ title: "Pop-up Blocked", text: "Please allow pop-ups for this site.", icon: "warning", confirmButtonText: "OK" });
      return;
    }
    const calculations = { subtotal: calculateSubtotal(), discount: calculateDiscount(), vat: calculateVAT(), total: calculateTotal(), change: calculateChange(), deliveryFee: receiptData.deliveryFee || 0 };
    const templateHtml = generatePrintHTML(selectedTemplate, receiptData, companyLogo, formatNaira, calculations);
    const doc = createPrintDocument(templateHtml, { isAndroid: true, showDownloadInsteadOfPrint: true });
    viewWindow.document.write(doc);
    viewWindow.document.close();
    showCoffeeModalIfAllowed();
  };

  /* ---------------- CREATE PRINT DOCUMENT ---------------- */
  const createPrintDocument = (templateHtml, options = {}) => {
    const { isAndroid = false, showDownloadInsteadOfPrint = false } = typeof options === 'boolean' ? { isAndroid: options } : options;
    const printStyles = getPrintStyles();
    
    // Simplified HTML structure for better compatibility
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${receiptData.receiptType.toUpperCase()} ${receiptData.receiptNumber}</title>
        <meta name="description" content="Receipt generated by ReceiptIt">
        ${printStyles}
        <style>
          /* Additional print-safe styles */
          @media print {
            body {
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
          
          /* Android-specific optimizations */
          ${isAndroid ? `
            body {
              font-size: 14px !important;
              line-height: 1.5 !important;
            }
            img {
              max-width: 100% !important;
              height: auto !important;
            }
            table {
              width: 100% !important;
              table-layout: fixed !important;
            }
          ` : ''}
          
          /* Print button styling */
          .print-button {
            display: none;
          }
          @media screen {
            .print-button {
              display: block;
              position: fixed;
              bottom: 20px;
              right: 20px;
              padding: 12px 24px;
              background: #059669;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              z-index: 1000;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
          }
        </style>
      </head>
      <body>
        <div style="max-width: 210mm; margin: 0 auto; padding: ${isAndroid ? '10mm' : '20mm'};">
          ${templateHtml}
        </div>
        ${showDownloadInsteadOfPrint ? `
        <button class="print-button" onclick="if(window.opener){window.opener.postMessage({type:'receiptit-download-pdf'},'*');}">
          📥 Download PDF
        </button>
        ` : `
        <button class="print-button" onclick="window.print()">
          🖨️ Print / Save PDF
        </button>
        <script>
          window.addEventListener('afterprint', function() {
            setTimeout(function() { window.close(); }, 500);
          });
        </script>
        `}
      </body>
      </html>
    `;
  };

  /* ---------------- DOWNLOAD PDF (html2pdf - works everywhere, crisp multi-page) ---------------- */
  const handleDownloadPDF = async () => {
    if (!isClient) {
      Swal.fire({ title: "Error", text: "Please refresh the page and try again.", icon: "error", confirmButtonText: "OK" });
      return;
    }
    try {
      setIsGenerating(true);
      const calculations = {
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(),
        vat: calculateVAT(),
        total: calculateTotal(),
        change: calculateChange(),
        deliveryFee: receiptData.deliveryFee || 0
      };
      const templateHtml = generatePrintHTML(selectedTemplate, receiptData, companyLogo, formatNaira, calculations);
      const printStyles = getPrintStyles();
      const container = document.createElement('div');
      container.style.cssText = 'position:absolute;left:-9999px;top:0;width:210mm;background:white;';
      container.innerHTML = `${printStyles}<div id="pdf-receipt" style="max-width:210mm;margin:0 auto;padding:20mm;background:white;">${templateHtml}</div>`;
      document.body.appendChild(container);
      const el = container.querySelector('#pdf-receipt');
      const imgs = el.querySelectorAll('img');
      await Promise.all(Array.from(imgs).map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })));
      const opt = {
        margin: 10,
        filename: `receipt-${receiptData.receiptNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css'], before: '.page-break-before', after: '.page-break-after', avoid: 'img' }
      };
      const pdfOutput = await html2pdf().set(opt).from(el).toContainer().toCanvas().toImg().toPdf().outputPdf('blob');
      const pdfBlob = pdfOutput instanceof Blob ? pdfOutput : new Blob([pdfOutput], { type: 'application/pdf' });
      document.body.removeChild(container);
      const isAndroid = /Android/i.test(navigator.userAgent);
      const file = new File([pdfBlob], `receipt-${receiptData.receiptNumber}.pdf`, { type: 'application/pdf' });
      if (isAndroid && navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ title: 'Receipt', files: [file] });
          await Swal.fire({ title: "✅ Shared!", text: "Receipt PDF shared successfully", icon: "success", confirmButtonText: "OK", timer: 2000 });
        } catch (shareErr) {
          if (shareErr.name !== 'AbortError') downloadBlob(pdfBlob, file.name);
        }
      } else {
        downloadBlob(pdfBlob, file.name);
        await Swal.fire({ title: "✅ Downloaded!", text: "Receipt saved as PDF", icon: "success", confirmButtonText: "OK", timer: 2000 });
      }
      showCoffeeModalIfAllowed();
    } catch (error) {
      console.error("PDF error:", error);
      Swal.fire({ title: "Error", text: "Failed to generate PDF. Please try again.", icon: "error", confirmButtonText: "OK" });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadBlob = (blob, filename) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  /* ---------------- Listen for Download PDF from Android view window ---------------- */
  const handleDownloadPDFRef = useRef(() => {});
  handleDownloadPDFRef.current = handleDownloadPDF;
  useEffect(() => {
    const onMessage = (e) => {
      if (e.data?.type === 'receiptit-download-pdf') handleDownloadPDFRef.current();
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  /* ---------------- PREVIEW PDF ---------------- */
  const handlePreviewPDF = async () => {
    if (!isClient) {
      Swal.fire({ title: "Error", text: "Please refresh the page and try again.", icon: "error", confirmButtonText: "OK" });
      return;
    }
    try {
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid) {
        handleAndroidView();
        return;
      } else {
        // Show loading for desktop/iOS
        await Swal.fire({
          title: "Opening Preview...",
          text: "Preparing receipt for viewing",
          icon: "info",
          timer: 1500,
          showConfirmButton: false
        });
        
        await handleStandardPrint();
      }
      
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
Template: ${selectedTemplate.toUpperCase()}

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
        title: "✅ Copied!",
        text: "Receipt text copied to clipboard",
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
🎨 Template: ${selectedTemplate.toUpperCase()}
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
        title: "✅ Shared!",
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
      {/* Buy Me a Coffee Modal */}
      <BuyMeACoffeeModal
        isOpen={showCoffeeModal}
        onClose={() => setShowCoffeeModal(false)}
      />

      

      {/* Platform-specific notice */}
      {platform === 'android' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Android Device Detected
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  For best results on Android:
                  <ul className="list-disc ml-4 mt-1">
                    <li>Use <strong>Download PDF</strong> for crisp, shareable receipts</li>
                    <li>Allow pop-ups for this site</li>
                    <li>Use Chrome browser</li>
                  </ul>
                </p>
              </div>
            </div>
          </div>
        </div>
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
        platform={platform}
        receiptData={receiptData}
        savedReceipts={savedReceipts}
        formatNaira={formatNaira}
        calculateTotal={calculateTotal}
        setActionCount={() => {}}
      />

      {/* Visible Preview */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
           <span className="text-sm font-medium text-gray-800"> Live Preview</span>
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
              {receiptData.receiptType.toUpperCase()}
            </span>
            <span className="text-center px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-md">
              {selectedTemplate.toUpperCase()} TEMPLATE
            </span>
            {platform === 'android' && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-md">
                ANDROID
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {platform === 'android' ? 'Use View to preview, then Download or Share' : 'This is how your receipt will look when printed'}
          </p>
        </div>
        <div className="p-4 sm:p-6">
          <TemplateRenderer
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
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>{platform === 'android' ? 'Use View, Download PDF, or Share above' : 'Preview only • Click buttons above to print, save, or share'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDisplay;