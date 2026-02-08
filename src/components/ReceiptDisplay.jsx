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

  /* ---------------- STANDARD PRINT (iOS/Desktop) ---------------- */
  const handleStandardPrint = async () => {
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
    
    // Create simplified print document for better compatibility
    const printDocument = createPrintDocument(templateHtml, false);
    
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
 /* ---------------- ANDROID PRINT SOLUTION ---------------- */
const handleAndroidPrint = async () => {
  setIsGenerating(true);
  
  try {
    // Show loading message
    const loadingSwal = Swal.fire({
      title: "Preparing for Android...",
      text: "Creating print-friendly document",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
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
    
    // Create Android-optimized print document
    const printDocument = createPrintDocument(templateHtml, true);
    
    // Close loading
    await loadingSwal.close();
    
    // For Android, use iframe method
    // NOTE: Don't use visibility:hidden or opacity:0 - some printers skip hidden iframe content!
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    iframe.style.border = 'none';
    
    document.body.appendChild(iframe);
    
    // FIXED: Proper iframe document handling
    let iframeDoc;
    try {
      // Try to get the document from contentWindow first
      if (iframe.contentWindow && iframe.contentWindow.document) {
        iframeDoc = iframe.contentWindow.document;
      } else if (iframe.contentDocument) {
        iframeDoc = iframe.contentDocument;
      } else {
        throw new Error('Could not access iframe document');
      }
      
      // Open and write to iframe
      iframeDoc.open();
      iframeDoc.write(printDocument);
      iframeDoc.close();
      
    } catch (iframeError) {
      console.error("Iframe document error:", iframeError);
      // Fallback: use srcdoc attribute
      iframe.srcdoc = printDocument;
      await new Promise(resolve => {
        iframe.onload = resolve;
        iframe.onerror = resolve;
        setTimeout(resolve, 1000);
      });
    }
    
    // Wait for iframe load + images before print (fixes blank PDF)
    await new Promise(resolve => {
      iframe.onload = resolve;
      setTimeout(resolve, 2000); // fallback
    });
    
    const waitForImages = (doc) => {
      const imgs = doc.querySelectorAll('img');
      return Promise.all(Array.from(imgs).map(img =>
        img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
      ));
    };
    
    const iframeDocEl = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDocEl) await waitForImages(iframeDocEl);
    await new Promise(r => setTimeout(r, 500)); // allow paint
    
    try {
      // Try to print from iframe
      if (iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      }
      
      // Remove iframe after print attempt
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 5000);
      
      // Show success message with instructions
      await Swal.fire({
        title: "✅ Print Dialog Opened",
        html: `
          <div style="text-align: left;">
            <p style="margin-bottom: 15px; color: #059669;">Print dialog should be visible now.</p>
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-top: 15px;">
              <p style="font-weight: 600; color: #0369a1; margin-bottom: 10px;">📱 Android Tips:</p>
              <ul style="margin-left: 20px; color: #475569;">
                <li>Select <strong>"Save as PDF"</strong> to save</li>
                <li>Or choose a printer if connected</li>
                <li>If dialog doesn't appear, use 3-dot menu → "Print"</li>
              </ul>
            </div>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Got it",
        showCancelButton: true,
        cancelButtonText: "Try Download Instead",
        confirmButtonColor: "#059669",
        cancelButtonColor: "#4a5568",
        timer: 10000
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          handleDownloadPDF();
        }
      });
      
    } catch (iframeError) {
      console.error("Iframe print error:", iframeError);
      
      // Clean up iframe
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      
      // Fallback 1: Open in new window
      try {
        const fallbackWindow = window.open();
        if (fallbackWindow) {
          fallbackWindow.document.write(printDocument);
          fallbackWindow.document.close();
          
          await Swal.fire({
            title: "📄 Opened in New Tab",
            html: `
              <div style="text-align: left;">
                <p>Receipt opened in new tab. Please:</p>
                <ol style="margin-left: 20px;">
                  <li>Tap the 3-dot menu (⋮) in top right</li>
                  <li>Select "Print"</li>
                  <li>Choose "Save as PDF" to save</li>
                </ol>
              </div>
            `,
            icon: "info",
            confirmButtonText: "OK",
            showCancelButton: true,
            cancelButtonText: "Download PDF",
            confirmButtonColor: "#3B82F6",
            cancelButtonColor: "#059669"
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
              handleDownloadPDF();
            }
          });
        } else {
          throw new Error('Could not open new window');
        }
      } catch (windowError) {
        // Fallback 2: Direct download
        await Swal.fire({
          title: "⚠️ Print Not Available",
          html: `
            <div style="text-align: left;">
              <p style="margin-bottom: 15px;">Your browser's pop-up blocker may be active.</p>
              <p>Please try:</p>
              <ol style="margin-left: 20px;">
                <li>Allow pop-ups for this site</li>
                <li>Or use the Download PDF option below</li>
                <li>Use Chrome browser for best results</li>
              </ol>
            </div>
          `,
          icon: "warning",
          confirmButtonText: "Download PDF",
          cancelButtonText: "Cancel",
          showCancelButton: true,
          confirmButtonColor: "#059669"
        }).then((result) => {
          if (result.isConfirmed) {
            handleDownloadPDF();
          }
        });
      }
    }
    
    showCoffeeModalIfAllowed();
    
  } catch (error) {
    console.error("Android print error:", error);
    await Swal.fire({
      title: "Print Failed",
      html: `
        <div style="text-align: left;">
          <p style="margin-bottom: 15px;">There was an error preparing the print.</p>
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px;">
            <p style="color: #dc2626; font-weight: 600;">Suggested fix:</p>
            <p>Use the "Download PDF" option for reliable saving.</p>
          </div>
        </div>
      `,
      icon: "error",
      confirmButtonText: "Download PDF",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      confirmButtonColor: "#059669"
    }).then((result) => {
      if (result.isConfirmed) {
        handleDownloadPDF();
      }
    });
  } finally {
    setIsGenerating(false);
  }
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
        
        <!-- Manual print button (visible on screen only) -->
        <button class="print-button" onclick="window.print()">
          🖨️ Print / Save PDF
        </button>
        
        <script>
          // Close window after user finishes print/PDF (print triggered by parent)
          window.addEventListener('afterprint', function() {
            setTimeout(function() { window.close(); }, 500);
          });
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
                  For best printing results on Android:
                  <ul className="list-disc ml-4 mt-1">
                    <li>Use Chrome browser</li>
                    <li>Allow pop-ups for this site</li>
                    <li>Use "Download PDF" option if printing fails</li>
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