import React, { useState, useRef, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';
import BuyMeACoffeeModal from './BuyMeACoffeeModal';
import Swal from 'sweetalert2';
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
  const printableRef = useRef();

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

  /* ---------------- IMPROVED PRINT FUNCTION ---------------- */
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
      // Check if it's Android
      const isAndroid = /Android/i.test(navigator.userAgent);
      
      if (isAndroid) {
        // Use Android-specific print method
        await handleAndroidPrint();
        return;
      }
      
      // For iOS and Desktop, use the regular method
      await handleStandardPrint();
      
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
    
    // Create print document (pass isAndroid for Share button on Android)
    const printDocument = createPrintDocument(templateHtml, isAndroid);
    
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

  /* ---------------- ANDROID PRINT SOLUTION ---------------- */
  /* Use new window (same as PC) - adds Share button so users can share receipt to customer */
  const handleAndroidPrint = async () => {
    await handleStandardPrint(true);
  };
  /* ---------------- CREATE PRINT DOCUMENT ---------------- */
  const createPrintDocument = (templateHtml, isAndroid = false) => {
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
          .print-button, .share-button {
            display: none;
          }
          @media screen {
            .print-button, .share-button {
              display: block;
              position: fixed;
              bottom: 20px;
              padding: 12px 24px;
              border: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              z-index: 1000;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .print-button { right: 20px; background: #059669; color: white; }
            .share-button { right: 20px; bottom: 70px; background: #2563eb; color: white; }
          }
        </style>
      </head>
      <body>
        <div id="receipt-content" style="max-width: 210mm; margin: 0 auto; padding: ${isAndroid ? '10mm' : '20mm'};">
          ${templateHtml}
        </div>
        
        <button class="print-button" onclick="window.print()">
          🖨️ Print / Save PDF
        </button>
        ${isAndroid ? `
        <button class="share-button" id="share-btn" onclick="window.shareReceipt()">
          📤 Share to Customer
        </button>
        ` : ''}
        
        <script>
          window.addEventListener('afterprint', function() {
            setTimeout(function() { window.close(); }, 500);
          });
          ${isAndroid ? `
          window.shareReceipt = function() {
            var btn = document.getElementById('share-btn');
            if (btn) { btn.disabled = true; btn.textContent = '⏳ Preparing...'; }
            var script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.onload = function() {
              html2canvas(document.getElementById('receipt-content'), { scale: 2, useCORS: true }).then(function(canvas) {
                canvas.toBlob(function(blob) {
                  var file = new File([blob], 'receipt-' + Date.now() + '.png', { type: 'image/png' });
                  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    navigator.share({ title: 'Receipt', files: [file] }).then(function() {
                      if (btn) { btn.disabled = false; btn.textContent = '📤 Share to Customer'; }
                    }).catch(function(err) {
                      if (btn) { btn.disabled = false; btn.textContent = '📤 Share to Customer'; }
                      if (err.name !== 'AbortError') alert('Share failed. Try 3-dot menu → Share.');
                    });
                  } else {
                    var a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = 'receipt.png';
                    a.click();
                    if (btn) { btn.disabled = false; btn.textContent = '📤 Share to Customer'; }
                    alert('Saved receipt image. Use your gallery or file manager to share it.');
                  }
                }, 'image/png');
              });
            };
            document.head.appendChild(script);
          };
          ` : ''}
        </script>
      </body>
      </html>
    `;
  };

  /* ---------------- DOWNLOAD PDF (IMPROVED FOR ANDROID) ---------------- */
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
      
      const isAndroid = /Android/i.test(navigator.userAgent);
      
      const instructions = isAndroid ? `
        <div style="text-align: left; font-size: 15px;">
          <p style="margin-bottom: 15px; color: #4a5568;">📱 <strong>Android Instructions:</strong></p>
          <div style="background: #f7fafc; padding: 15px; border-radius: 10px; border-left: 4px solid #4299e1;">
            <ol style="margin-left: 20px; color: #4a5568;">
              <li style="margin-bottom: 8px;">Tap the <strong style="color: #2b6cb0;">"Print / Save as PDF"</strong> button</li>
              <li style="margin-bottom: 8px;">In print preview, select <strong style="color: #2b6cb0;">"Save as PDF"</strong></li>
              <li style="margin-bottom: 8px;">Or tap <strong style="color: #2b6cb0;">"⋮" menu → "Share" → Save to Drive/Files</strong></li>
              <li style="margin-bottom: 8px;"><strong>Recommended:</strong> Use Chrome browser</li>
            </ol>
          </div>
        </div>
      ` : `
        <div style="text-align: left; font-size: 15px;">
          <p style="margin-bottom: 15px; color: #4a5568;">Opening print view to save your receipt as PDF...</p>
          <div style="background: #f7fafc; padding: 15px; border-radius: 10px; border-left: 4px solid #4299e1;">
            <p style="font-weight: 600; color: #2d3748; margin-bottom: 10px;">📋 Instructions:</p>
            <ol style="margin-left: 20px; color: #4a5568;">
              <li style="margin-bottom: 8px;">Click <strong style="color: #2b6cb0;">"Print / Save as PDF"</strong> button</li>
              <li style="margin-bottom: 8px;">Select <strong style="color: #2b6cb0;">"Save as PDF"</strong> as printer</li>
              <li style="margin-bottom: 8px;">Choose location and save</li>
            </ol>
          </div>
        </div>
      `;
      
      await Swal.fire({
        title: isAndroid ? "📱 Save PDF on Android" : "📄 Save as PDF",
        html: instructions,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: isAndroid ? "Open Print View" : "Continue",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#4299e1",
        cancelButtonColor: "#a0aec0",
        allowOutsideClick: false
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (isAndroid) {
            await handleAndroidPrint();
          } else {
            await handleStandardPrint();
          }
        }
      });
      
    } catch (error) {
      console.error("Download error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to prepare download. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      setIsGenerating(false);
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
      const isAndroid = /Android/i.test(navigator.userAgent);
      
      if (isAndroid) {
        // For Android, show preview in new tab
        await handleAndroidPrint();
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
                    <li>Use <strong>Share to Customer</strong> to send receipt via WhatsApp, etc.</li>
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
            Live Preview
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              ${receiptData.receiptType.toUpperCase()}
            </span>
            <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              ${selectedTemplate.toUpperCase()} TEMPLATE
            </span>
            {platform === 'android' && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                ANDROID
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            This is how your receipt will look when printed
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
            <p>🎯 Preview only • Click buttons above to print, save, or share</p>
            {platform === 'android' && (
              <p className="mt-1 text-xs text-yellow-600">
                ⚠️ On Android, use "Download PDF" for best results
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDisplay;