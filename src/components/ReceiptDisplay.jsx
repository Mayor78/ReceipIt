// ReceiptDisplay.jsx - ENHANCED VERSION WITH CATEGORY DATA SUPPORT
import React, { useState, useRef, useEffect } from 'react';
import { FileText, Package, Smartphone, Book, Wheat, Scissors, Droplets, Truck, Home, Shirt, Coffee } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';
import BuyMeACoffeeModal from './BuyMeACoffeeModal';
import Swal from 'sweetalert2';
import html2pdf from 'html2pdf.js';
import ReceiptActions from './receiptDisplay/ReceiptActions';
import { generatePrintHTML } from './receiptTemplates/printTemplates';
import { getPrintStyles, detectPlatform } from '../utils/printUtils';
import TemplateRenderer from "../components/receiptTemplates/TemplateRenderer"

// Category icons mapping
const CATEGORY_ICONS = {
  electronics: Smartphone,
  books: Book,
  agriculture: Wheat,
  clothing: Shirt,
  food: Coffee,
  services: Scissors,
  liquids: Droplets,
  construction: Home,
  logistics: Truck,
  general: Package
};

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
  const [isClient, setIsClient] = useState(false);

  /* ---------------- CHECK ENVIRONMENT ---------------- */
  useEffect(() => {
    setIsClient(true);
    
    const checkDevice = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      setIsMobile(isMobileDevice);
      
      const detectedPlatform = detectPlatform();
      setPlatform(detectedPlatform);
    };
    
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  /* ---------------- COFFEE MODAL RESET ---------------- */
  const showCoffeeModalIfAllowed = () => {
    if (!isClient) return;
    setTimeout(() => setShowCoffeeModal(true), 1500);
    localStorage.setItem("coffeeModalShownToday", "true");
  };

  /* ---------------- ENHANCED DATA PROCESSING ---------------- */
  
  // Get category icon for an item
  const getCategoryIcon = (category = 'general') => {
    const IconComponent = CATEGORY_ICONS[category] || Package;
    return <IconComponent size={14} />;
  };

  // Format custom fields for display
  const formatCustomFields = (customFields) => {
    if (!customFields || Object.keys(customFields).length === 0) return null;
    
    return Object.entries(customFields)
      .filter(([key, value]) => value && value.toString().trim() !== '')
      .map(([key, value]) => ({
        key: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
        value: value.toString()
      }));
  };

  // Enhanced receipt data with category information
  const getEnhancedReceiptData = () => {
    const baseData = { ...receiptData };
    
    // Add category information to items
    const enhancedItems = baseData.items.map(item => ({
      ...item,
      categoryIcon: getCategoryIcon(item.category),
      formattedCustomFields: formatCustomFields(item.customFields),
      categoryName: item.category ? 
        item.category.charAt(0).toUpperCase() + item.category.slice(1) : 
        'General'
    }));
    
    return {
      ...baseData,
      items: enhancedItems,
      hasCategoryData: enhancedItems.some(item => 
        item.category && item.category !== 'general'
      ),
      hasCustomFields: enhancedItems.some(item => 
        item.customFields && Object.keys(item.customFields).length > 0
      )
    };
  };

  // Get important custom fields summary
  const getImportantFieldsSummary = () => {
    const fields = [];
    const enhancedData = getEnhancedReceiptData();
    
    enhancedData.items.forEach((item, index) => {
      if (item.formattedCustomFields) {
        item.formattedCustomFields.forEach(field => {
          // Only show critical fields
          if (['IMEI', 'Serial', 'Warranty', 'Expiry', 'Weight', 'Size'].includes(field.key)) {
            fields.push({
              itemIndex: index + 1,
              itemName: item.name,
              field: field.key,
              value: field.value
            });
          }
        });
      }
    });
    
    return fields;
  };

  /* ---------------- PRINT FUNCTIONS ---------------- */
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

  /* ---------------- STANDARD PRINT ---------------- */
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
    
    const enhancedData = getEnhancedReceiptData();
    const calculations = {
      subtotal: calculateSubtotal(),
      discount: calculateDiscount(),
      vat: calculateVAT(),
      total: calculateTotal(),
      change: calculateChange(),
      deliveryFee: receiptData.deliveryFee || 0
    };
    
    // Generate template with enhanced data
    const templateHtml = generatePrintHTML(
      selectedTemplate,
      enhancedData,
      companyLogo,
      formatNaira,
      calculations,
      getImportantFieldsSummary()
    );
    
    const printDocument = createPrintDocument(templateHtml, { isAndroid });
    
    printWindow.document.write(printDocument);
    printWindow.document.close();
    
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

    const doPrintWhenReady = () => {
      const doc = printWindow.document;
      const imgs = doc.querySelectorAll('img');
      const imgPromises = Array.from(imgs).map(img =>
        img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
      );
      Promise.all(imgPromises).then(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(triggerPrint, 500);
          });
        });
      });
    };
    
    printWindow.onload = doPrintWhenReady;
    showCoffeeModalIfAllowed();
  };

  /* ---------------- ANDROID VIEW ---------------- */
  const handleAndroidView = () => {
    const viewWindow = window.open('', '_blank');
    if (!viewWindow) {
      Swal.fire({ title: "Pop-up Blocked", text: "Please allow pop-ups for this site.", icon: "warning", confirmButtonText: "OK" });
      return;
    }
    const enhancedData = getEnhancedReceiptData();
    const calculations = { 
      subtotal: calculateSubtotal(), 
      discount: calculateDiscount(), 
      vat: calculateVAT(), 
      total: calculateTotal(), 
      change: calculateChange(), 
      deliveryFee: receiptData.deliveryFee || 0 
    };
    const templateHtml = generatePrintHTML(
      selectedTemplate, 
      enhancedData, 
      companyLogo, 
      formatNaira, 
      calculations,
      getImportantFieldsSummary()
    );
    const doc = createPrintDocument(templateHtml, { isAndroid: true, showDownloadInsteadOfPrint: true });
    viewWindow.document.write(doc);
    viewWindow.document.close();
    showCoffeeModalIfAllowed();
  };

  /* ---------------- CREATE PRINT DOCUMENT ---------------- */
  const createPrintDocument = (templateHtml, options = {}) => {
    const { isAndroid = false, showDownloadInsteadOfPrint = false } = typeof options === 'boolean' ? { isAndroid: options } : options;
    const printStyles = getPrintStyles();
    const enhancedData = getEnhancedReceiptData();
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${enhancedData.receiptType.toUpperCase()} ${enhancedData.receiptNumber}</title>
        <meta name="description" content="Receipt generated by ReceiptIt - Professional Business Receipts">
        ${printStyles}
        <style>
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
          
          ${isAndroid ? `
            body {
              font-size: 14px !important;
              line-height: 1.5 !important;
            }
            img {
              max-width: 100% !important;
              height: auto !important;
            }
          ` : ''}
          
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
          
          /* Category styling in print */
          .category-badge {
            display: inline-block;
            padding: 2px 6px;
            background: #f3f4f6;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
            color: #6b7280;
            margin-left: 6px;
          }
          
          .custom-fields {
            margin-top: 4px;
            font-size: 11px;
            color: #4b5563;
          }
          
          .custom-field {
            display: inline-block;
            margin-right: 8px;
            padding: 1px 4px;
            background: #f9fafb;
            border-radius: 3px;
            border-left: 2px solid #059669;
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

  /* ---------------- DOWNLOAD PDF ---------------- */
  const handleDownloadPDF = async () => {
    if (!isClient) {
      Swal.fire({ title: "Error", text: "Please refresh the page and try again.", icon: "error", confirmButtonText: "OK" });
      return;
    }
    try {
      setIsGenerating(true);
      const enhancedData = getEnhancedReceiptData();
      const calculations = {
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(),
        vat: calculateVAT(),
        total: calculateTotal(),
        change: calculateChange(),
        deliveryFee: receiptData.deliveryFee || 0
      };
      
      const templateHtml = generatePrintHTML(
        selectedTemplate, 
        enhancedData, 
        companyLogo, 
        formatNaira, 
        calculations,
        getImportantFieldsSummary()
      );
      
      const printStyles = getPrintStyles();
      const container = document.createElement('div');
      container.style.cssText = 'position:absolute;left:-9999px;top:0;width:210mm;background:white;';
      container.innerHTML = `${printStyles}<div id="pdf-receipt" style="max-width:210mm;margin:0 auto;padding:20mm;background:white;">${templateHtml}</div>`;
      document.body.appendChild(container);
      const el = container.querySelector('#pdf-receipt');
      const imgs = el.querySelectorAll('img');
      
      await Promise.all(Array.from(imgs).map(img => 
        img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
      ));
      
      const opt = {
        margin: 10,
        filename: `receipt-${enhancedData.receiptNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css'] }
      };
      
      const pdfOutput = await html2pdf().set(opt).from(el).toContainer().toCanvas().toImg().toPdf().outputPdf('blob');
      const pdfBlob = pdfOutput instanceof Blob ? pdfOutput : new Blob([pdfOutput], { type: 'application/pdf' });
      document.body.removeChild(container);
      
      const isAndroid = /Android/i.test(navigator.userAgent);
      const file = new File([pdfBlob], `receipt-${enhancedData.receiptNumber}.pdf`, { type: 'application/pdf' });
      
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

  /* ---------------- COPY TO CLIPBOARD (ENHANCED) ---------------- */
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
      const enhancedData = getEnhancedReceiptData();
      
      let text = `
${enhancedData.storeName}
${enhancedData.receiptType.toUpperCase()}: ${enhancedData.receiptNumber}
Date: ${enhancedData.date} | Time: ${enhancedData.time}
Cashier: ${enhancedData.cashierName}
Template: ${selectedTemplate.toUpperCase()}

ITEMS:
`;

      // Add items with category info
      enhancedData.items.forEach((item, index) => {
        text += `${index + 1}. ${item.quantity}x ${item.name}`;
        
        if (item.category && item.category !== 'general') {
          text += ` [${item.categoryName}]`;
        }
        
        text += ` @ ${formatNaira(item.price)} = ${formatNaira(item.price * item.quantity)}\n`;
        
        // Add custom fields
        if (item.formattedCustomFields && item.formattedCustomFields.length > 0) {
          item.formattedCustomFields.forEach(field => {
            text += `   ${field.key}: ${field.value}\n`;
          });
        }
      });

      text += `
Subtotal: ${formatNaira(calculateSubtotal())}
${enhancedData.includeDiscount ? `Discount: -${formatNaira(calculateDiscount())}\n` : ''}
${enhancedData.includeVAT ? `VAT: ${formatNaira(calculateVAT())}\n` : ''}
Total: ${formatNaira(calculateTotal())}

Payment: ${enhancedData.paymentMethod}
${enhancedData.paymentMethod === 'Cash' && enhancedData.amountPaid > 0 ? 
  `Amount Paid: ${formatNaira(enhancedData.amountPaid)}\nChange: ${formatNaira(calculateChange())}\n` : ''}

${enhancedData.customerNotes}

${enhancedData.includeSignature ? 'Signed: _________________' : ''}

--- IMPORTANT DETAILS ---
`;

      // Add important custom fields summary
      const importantFields = getImportantFieldsSummary();
      if (importantFields.length > 0) {
        text += `\nImportant Item Details:\n`;
        importantFields.forEach(field => {
          text += `Item ${field.itemIndex} (${field.itemName}): ${field.field} = ${field.value}\n`;
        });
      }

      text += `
Thank you for your business!
      `.trim();

      await navigator.clipboard.writeText(text);
      
      await Swal.fire({
        title: "✅ Copied!",
        text: "Enhanced receipt text copied to clipboard",
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

  /* ---------------- SHARE ON WHATSAPP (ENHANCED) ---------------- */
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
      const enhancedData = getEnhancedReceiptData();
      const importantFields = getImportantFieldsSummary();
      
      let text = `
*${enhancedData.receiptType.toUpperCase()} from ${enhancedData.storeName}*
📄 Receipt: ${enhancedData.receiptNumber}
🎨 Template: ${selectedTemplate.toUpperCase()}
📅 Date: ${enhancedData.date}
⏰ Time: ${enhancedData.time}
👤 Cashier: ${enhancedData.cashierName}

🛒 Items:`;

      enhancedData.items.forEach((item, index) => {
        text += `
${index + 1}. ${item.quantity}x ${item.name}`;
        
        if (item.category && item.category !== 'general') {
          text += ` (${item.categoryName})`;
        }
        
        text += ` - ${formatNaira(item.price * item.quantity)}`;
        
        // Add key custom fields inline
        if (item.formattedCustomFields) {
          const keyFields = item.formattedCustomFields.filter(f => 
            ['IMEI', 'Serial', 'Warranty', 'Size'].includes(f.key)
          ).slice(0, 2);
          
          if (keyFields.length > 0) {
            text += ` [${keyFields.map(f => `${f.key}: ${f.value}`).join(', ')}]`;
          }
        }
      });

      text += `

💰 Total: ${formatNaira(calculateTotal())}`;

      // Add important fields summary
      if (importantFields.length > 0) {
        text += `\n\n🔍 Important Details:`;
        importantFields.forEach(field => {
          text += `\n• ${field.field}: ${field.value}`;
        });
      }

      text += `

${enhancedData.customerNotes}

${enhancedData.includeSignature ? '✍️ Signed' : ''}

Thank you for your business! 🎉
      `.trim();

      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      
      await Swal.fire({
        title: "✅ Shared!",
        text: "Enhanced receipt shared on WhatsApp",
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

  /* ---------------- LISTEN FOR DOWNLOAD PDF ---------------- */
  const handleDownloadPDFRef = useRef(() => {});
  handleDownloadPDFRef.current = handleDownloadPDF;
  useEffect(() => {
    const onMessage = (e) => {
      if (e.data?.type === 'receiptit-download-pdf') handleDownloadPDFRef.current();
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

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

  const enhancedData = getEnhancedReceiptData();
  const importantFields = getImportantFieldsSummary();

  return (
    <div className="space-y-6">
      {/* Buy Me a Coffee Modal */}
      <BuyMeACoffeeModal
        isOpen={showCoffeeModal}
        onClose={() => setShowCoffeeModal(false)}
      />

      {/* Category Data Summary */}
      {enhancedData.hasCategoryData && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                📋 Category Details Included
              </h3>
              <div className="mt-2">
                <p className="text-sm text-blue-700 mb-2">
                  Your receipt includes category-specific information. This will appear in prints and PDFs.
                </p>
                {importantFields.length > 0 && (
                  <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
                    <strong>Important details:</strong>
                    <div className="mt-1 space-y-1">
                      {importantFields.slice(0, 3).map((field, idx) => (
                        <div key={idx} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          <span>Item {field.itemIndex}: <strong>{field.field}</strong> = {field.value}</span>
                        </div>
                      ))}
                      {importantFields.length > 3 && (
                        <div className="text-blue-500 text-[10px]">
                          +{importantFields.length - 3} more details
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Action Buttons */}
      <ReceiptActions
        onPrint={handlePrint}
        onDownload={handleDownloadPDF}
        onPreview={handlePreviewPDF}
        onShare={shareOnWhatsApp}
        onCopy={copyToClipboard}
        isGenerating={isGenerating}
        isMobile={isMobile}
        platform={platform}
        receiptData={enhancedData}
        savedReceipts={savedReceipts}
        formatNaira={formatNaira}
        calculateTotal={calculateTotal}
        setActionCount={() => {}}
      />

      {/* Enhanced Preview */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-800">Enhanced Live Preview</span>
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
              {enhancedData.receiptType.toUpperCase()}
            </span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-md">
              {selectedTemplate.toUpperCase()} TEMPLATE
            </span>
            {enhancedData.hasCategoryData && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-md">
                CATEGORY DATA
              </span>
            )}
            {platform === 'android' && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-md">
                ANDROID
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {enhancedData.hasCategoryData 
              ? 'Category-specific details included in this receipt' 
              : platform === 'android' 
                ? 'Use View to preview, then Download or Share' 
                : 'This is how your receipt will look when printed'}
          </p>
        </div>
        
        {/* Custom Template Renderer - You'll need to update TemplateRenderer to accept enhancedData */}
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
             showCategoryData={enhancedData}
          />
          {/* Quick summary of category data */}
          {enhancedData.hasCategoryData && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-xs font-bold text-gray-700 mb-2">📋 Included Category Details:</h4>
              <div className="space-y-2">
                {enhancedData.items.map((item, idx) => (
                  item.formattedCustomFields && item.formattedCustomFields.length > 0 && (
                    <div key={idx} className="text-xs">
                      <div className="font-medium text-gray-800">{item.name}:</div>
                      <div className="ml-3 text-gray-600">
                        {item.formattedCustomFields.slice(0, 2).map((field, fIdx) => (
                          <div key={fIdx} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                            <span>{field.key}: <strong>{field.value}</strong></span>
                          </div>
                        ))}
                        {item.formattedCustomFields.length > 2 && (
                          <div className="text-gray-500 text-[10px] mt-1">
                            +{item.formattedCustomFields.length - 2} more details
                          </div>
                        )}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
              {enhancedData.hasCategoryData 
                ? 'All category details will appear in print/PDF/download' 
                : platform === 'android' 
                  ? 'Use View, Download PDF, or Share above' 
                  : 'Preview only • Click buttons above to print, save, or share'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDisplay;