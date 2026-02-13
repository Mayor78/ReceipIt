

// ReceiptDisplay.jsx - FIXED VERSION
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { FileText, Package, Smartphone, Book, Wheat, Scissors, Droplets, Truck, Home, Shirt, Coffee, Shield, QrCode } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';
import BuyMeACoffeeModal from './BuyMeACoffeeModal';
import Swal from 'sweetalert2';
import html2pdf from 'html2pdf.js';
import ReceiptActions from './receiptDisplay/ReceiptActions';
import { generatePrintHTML } from './receiptTemplates/printTemplates';
import { getPrintStyles, detectPlatform } from '../utils/printUtils';
import TemplateRenderer from "../components/receiptTemplates/TemplateRenderer";
import { generateReceiptHash } from '../services/verificationService';

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
    selectedTemplate,
    enableVerification,
    verifyCurrentReceipt,
    getVerificationUrl,
    getQRCodeUrl,
    currentStore,
    currentUser
  } = useReceipt();

  const [isGenerating, setIsGenerating] = useState(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [platform, setPlatform] = useState('desktop');
  const [isClient, setIsClient] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showVerificationQR, setShowVerificationQR] = useState(false);

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

  /* ---------------- FIXED: Get Current Receipt Number ---------------- */
  const getCurrentReceiptNumber = () => {
    // Just return the receipt number - it's already unique!
    return receiptData.receiptNumber;
  };

  /* ---------------- VERIFICATION FUNCTIONS ---------------- */
  const handleVerifyReceipt = async () => {
    setIsVerifying(true);
    try {
      const result = await verifyCurrentReceipt();
      setVerificationResult(result);
      
      if (result.success) {
        if (result.isNewReceipt) {
          await Swal.fire({
            title: "📤 New Receipt",
            html: `
              <div style="text-align: center; padding: 10px;">
                <div style="font-size: 60px; color: #4a86e8;">📄</div>
                <p style="font-size: 16px; margin: 15px 0;">This receipt is not yet registered in the verification system.</p>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; margin: 15px 0;">
                  <p style="margin: 5px 0;"><strong>Receipt:</strong> ${receiptData.receiptNumber}</p>
                  <p style="margin: 5px 0;"><strong>Status:</strong> ⏳ LOCAL ONLY</p>
                </div>
              </div>
            `,
            icon: "info",
            confirmButtonText: "OK"
          });
        } else if (result.isGenuine) {
          await Swal.fire({
            title: "✅ GENUINE RECEIPT",
            html: `
              <div style="text-align: center; padding: 10px;">
                <div style="font-size: 60px; color: #28a745;">✓</div>
                <p style="font-size: 16px; margin: 15px 0;">This receipt matches the original record.</p>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; margin: 15px 0;">
                  <p style="margin: 5px 0;"><strong>Receipt:</strong> ${receiptData.receiptNumber}</p>
                  <p style="margin: 5px 0;"><strong>Total:</strong> ${formatNaira(calculateTotal())}</p>
                  <p style="margin: 5px 0;"><strong>Status:</strong> ✅ VERIFIED</p>
                </div>
              </div>
            `,
            icon: "success",
            confirmButtonText: "OK"
          });
        } else {
          await Swal.fire({
            title: "⚠️ MODIFIED RECEIPT",
            html: `
              <div style="text-align: center; padding: 10px;">
                <div style="font-size: 60px; color: #dc3545;">⚠️</div>
                <p style="font-size: 16px; margin: 15px 0;">This receipt has been altered from the original.</p>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; margin: 15px 0;">
                  <p style="margin: 5px 0;"><strong>Receipt:</strong> ${receiptData.receiptNumber}</p>
                  <p style="margin: 5px 0;"><strong>Warning:</strong> Amounts or items may have been changed</p>
                  <p style="margin: 5px 0;"><strong>Status:</strong> ⚠️ FRAUD DETECTED</p>
                </div>
              </div>
            `,
            icon: "warning",
            confirmButtonText: "Got it"
          });
        }
      } else {
        await Swal.fire({
          title: "❌ Verification Failed",
          text: result.error || "Could not verify receipt",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      await Swal.fire({
        title: "❌ Error",
        text: "Failed to verify receipt. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleShowVerificationQR = () => {
    const receiptNumber = getCurrentReceiptNumber();
    if (!receiptNumber) {
      Swal.fire({
        title: "⚠️ No Receipt Number",
        text: "Unable to generate QR code",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }
    setShowVerificationQR(true);
  };

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
    
    // Get the receipt number
    const receiptNumber = getCurrentReceiptNumber();
    const verificationUrl = receiptNumber ? `${window.location.origin}/verify?id=${receiptNumber}` : null;
    const qrCodeUrl = receiptNumber ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}` : null;
    
    // Generate template with enhanced data including verification
    const templateHtml = generatePrintHTML(
      selectedTemplate,
      enhancedData,
      companyLogo,
      formatNaira,
      calculations,
      getImportantFieldsSummary(),
      verificationUrl,
      qrCodeUrl,
      receiptNumber
    );
    
    const printDocument = createPrintDocument(templateHtml, { isAndroid, receiptNumber, verificationUrl, qrCodeUrl });
    
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
      getImportantFieldsSummary(),
      null,
      null,
      null
    );
    const doc = createPrintDocument(templateHtml, { isAndroid: true, showDownloadInsteadOfPrint: true });
    viewWindow.document.write(doc);
    viewWindow.document.close();
    showCoffeeModalIfAllowed();
  };

  /* ---------------- CREATE PRINT DOCUMENT ---------------- */
  const createPrintDocument = (templateHtml, options = {}) => {
    const { 
      isAndroid = false, 
      showDownloadInsteadOfPrint = false,
      receiptNumber = null,
      verificationUrl = null,
      qrCodeUrl = null
    } = options;
    
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
          
          .verification-section {
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #4a86e8;
            font-size: 11px;
          }
          
          .verification-qr {
            text-align: center;
            margin: 10px 0;
          }
          
          .verification-qr img {
            width: 80px;
            height: 80px;
          }
          
          .verification-link {
            word-break: break-all;
            font-size: 10px;
            color: #4a86e8;
            text-decoration: none;
          }
          
          .verification-note {
            font-size: 10px;
            color: #666;
            margin-top: 5px;
          }
          
          .receipt-number {
            font-family: monospace;
            font-size: 9px;
            color: #666;
            word-break: break-all;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px dashed #ccc;
          }
        </style>
      </head>
      <body>
        <div style="max-width: 210mm; margin: 0 auto; padding: ${isAndroid ? '10mm' : '20mm'};">
          ${templateHtml}
          
          ${receiptNumber ? `
          <div class="receipt-number">
            <strong>Receipt Number:</strong><br>
            ${receiptNumber}
          </div>
          ` : ''}
          
          ${verificationUrl ? `
          <div class="verification-section">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <svg style="width: 12px; height: 12px; margin-right: 5px;" fill="#4a86e8" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <strong style="font-size: 11px;">VERIFY THIS RECEIPT</strong>
            </div>
            
            ${qrCodeUrl ? `
            <div class="verification-qr">
              <img src="${qrCodeUrl}" alt="Verify Receipt QR Code">
              <div class="verification-note">Scan to verify</div>
            </div>
            ` : ''}
            
            <div style="margin-top: 8px;">
              <div style="font-weight: bold; font-size: 10px;">Verify online:</div>
              <a href="${verificationUrl}" class="verification-link" target="_blank">
                ${verificationUrl}
              </a>
            </div>
          </div>
          ` : ''}
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
      
      // Get the receipt number
      const receiptNumber = getCurrentReceiptNumber();
      console.log('🔑 Using receipt number for PDF:', receiptNumber);
      
      const verificationUrl = receiptNumber ? `${window.location.origin}/verify?id=${receiptNumber}` : null;
      const qrCodeUrl = receiptNumber ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}` : null;
      
      // Generate template with verification info
      const templateHtml = generatePrintHTML(
        selectedTemplate, 
        enhancedData, 
        companyLogo, 
        formatNaira, 
        calculations,
        getImportantFieldsSummary(),
        verificationUrl,
        qrCodeUrl,
        receiptNumber
      );
      
      const printStyles = getPrintStyles();
      const container = document.createElement('div');
      container.style.cssText = 'position:absolute;left:-9999px;top:0;width:210mm;background:white;';
      
      const verificationSection = receiptNumber ? `
        <div class="verification-section" style="margin-top:20px;padding:15px;background:#f8f9fa;border-radius:8px;border-left:4px solid #4a86e8;font-family:Arial,sans-serif;">
          <div style="display:flex;align-items:center;margin-bottom:12px;">
            <svg style="width:16px;height:16px;margin-right:6px;" fill="#4a86e8" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <strong style="font-size:12px;color:#1a1a1a;">🔐 VERIFY THIS RECEIPT</strong>
          </div>
          
          <div style="display:flex;flex-wrap:wrap;gap:15px;">
            <div style="flex:0 0 80px;text-align:center;">
              ${qrCodeUrl ? `
                <img src="${qrCodeUrl}" alt="Verification QR Code" style="width:80px;height:80px;border-radius:4px;" />
                <div style="font-size:8px;color:#666;margin-top:4px;">Scan to Verify</div>
              ` : ''}
            </div>
            
            <div style="flex:1;">
              <div style="font-weight:bold;font-size:11px;color:#333;margin-bottom:6px;">
                🔑 Receipt Number:
              </div>
              <div style="font-family:'Courier New',monospace;font-size:10px;color:#4a86e8;background:#fff;padding:6px;border-radius:4px;border:1px solid #e0e0e0;margin-bottom:8px;word-break:break-all;">
                ${receiptNumber}
              </div>
              <div style="font-size:10px;color:#666;margin-bottom:4px;">
                <span style="font-weight:bold;">Verify online:</span>
              </div>
              <div style="word-break:break-all;font-size:9px;color:#4a86e8;background:#fff;padding:6px;border-radius:4px;border:1px solid #e0e0e0;margin-bottom:6px;">
                ${verificationUrl}
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="font-size:9px;color:#666;">
                  📅 Generated: ${new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : '';
      
      container.innerHTML = `${printStyles}<div id="pdf-receipt" style="max-width:210mm;margin:0 auto;padding:20mm;background:white;">${templateHtml}${verificationSection}</div>`;
      document.body.appendChild(container);
      const el = container.querySelector('#pdf-receipt');
      
      // Wait for images (QR codes) to load
      const imgs = el.querySelectorAll('img');
      await Promise.all(Array.from(imgs).map(img => {
        if (img.src.includes('qrcode') || img.src.includes('qrserver')) {
          if (!img.src.includes('?')) {
            img.src = `${img.src}?t=${Date.now()}`;
          }
        }
        return new Promise((resolve) => {
          if (img.complete && img.naturalHeight !== 0) {
            resolve();
          } else {
            const timeout = setTimeout(() => {
              img.onload = null;
              img.onerror = null;
              resolve();
            }, 3000);
            img.onload = () => { clearTimeout(timeout); resolve(); };
            img.onerror = () => { clearTimeout(timeout); resolve(); };
          }
        });
      }));
      
      const opt = {
        margin: 10,
        filename: `receipt-${receiptNumber || enhancedData.receiptNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, allowTaint: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css'] }
      };
      
      const pdfOutput = await html2pdf().set(opt).from(el).toContainer().toCanvas().toImg().toPdf().outputPdf('blob');
      const pdfBlob = pdfOutput instanceof Blob ? pdfOutput : new Blob([pdfOutput], { type: 'application/pdf' });
      document.body.removeChild(container);
      
      // Save to history
      try {
        const savedReceipt = await saveCurrentReceipt(pdfBlob, 'Receipt');
        console.log('Receipt saved:', savedReceipt);
      } catch (saveError) {
        console.error('Failed to save receipt to history:', saveError);
      }
      
      const isAndroid = /Android/i.test(navigator.userAgent);
      const fileName = `receipt-${receiptNumber || enhancedData.receiptNumber}.pdf`;
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
      
      if (isAndroid && navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ 
            title: 'Receipt', 
            text: `Receipt Number: ${receiptNumber}`,
            files: [file] 
          });
          await Swal.fire({ title: "✅ Shared!", text: "Receipt PDF shared successfully", icon: "success", confirmButtonText: "OK", timer: 2000 });
        } catch (shareErr) {
          if (shareErr.name !== 'AbortError') downloadBlob(pdfBlob, fileName);
        }
      } else {
        downloadBlob(pdfBlob, fileName);
        await Swal.fire({ 
          title: "✅ Downloaded!", 
          text: "Receipt saved as PDF", 
          icon: "success", 
          confirmButtonText: "OK", 
          timer: 2000 
        });
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
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      const enhancedData = getEnhancedReceiptData();
      const receiptNumber = getCurrentReceiptNumber();
      const verificationUrl = receiptNumber ? `${window.location.origin}/verify?id=${receiptNumber}` : null;
      
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
`;

      // Add verification info if enabled
      if (verificationUrl) {
        text += `
--- VERIFY THIS RECEIPT ---
Verify online: ${verificationUrl}
Receipt Number: ${receiptNumber}
Scan QR code or visit link to verify
`;
      }

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
        text: verificationUrl ? "Receipt with verification link copied" : "Receipt text copied to clipboard",
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
      const enhancedData = getEnhancedReceiptData();
      const importantFields = getImportantFieldsSummary();
      const receiptNumber = getCurrentReceiptNumber();
      const verificationUrl = receiptNumber ? `${window.location.origin}/verify?id=${receiptNumber}` : null;
      
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

      // Add verification info
      if (verificationUrl) {
        text += `

🔒 VERIFY THIS RECEIPT
Receipt: ${receiptNumber}
Verify: ${verificationUrl}`;
      }

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
        text: "Receipt shared on WhatsApp",
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


  const enhancedData = getEnhancedReceiptData();
  const importantFields = getImportantFieldsSummary();
  const receiptNumber = getCurrentReceiptNumber();
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

  // const enhancedData = getEnhancedReceiptData();
 

  return (
    <div className="space-y-6">
      {/* Verification QR Modal */}
      {showVerificationQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">🔒 Verify Receipt</h3>
              <button 
                onClick={() => setShowVerificationQR(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${window.location.origin}/verify?hash=${receiptNumber}`)}`} 
                  alt="Verification QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mb-2">Scan to verify this receipt's authenticity</p>
              <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded-lg break-all">
                {`${window.location.origin}/verify?hash=${receiptNumber}`}
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => window.open(`${window.location.origin}/verify?hash=${receiptNumber}`, '_blank')}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Open Link
                </button>
                <button
                  onClick={() => setShowVerificationQR(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Action Buttons */}
      <ReceiptActions
        onPrint={handlePrint}
        onDownload={handleDownloadPDF}
        onPreview={handlePreviewPDF}
        onShare={shareOnWhatsApp}
        onCopy={copyToClipboard}
        onVerify={handleVerifyReceipt}
        onShowQR={handleShowVerificationQR}
        isGenerating={isGenerating}
        isMobile={isMobile}
        platform={platform}
        receiptData={enhancedData}
        savedReceipts={savedReceipts}
        formatNaira={formatNaira}
        calculateTotal={calculateTotal}
        setActionCount={() => {}}
        enableVerification={enableVerification && !!currentStore}
        isVerifying={isVerifying}
        verificationUrl={null}
      />

      {/* Enhanced Preview */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="font-bold text-gray-800 flex flex-wrap items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-800">Preview</span>
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
              {enhancedData.receiptType.toUpperCase()}
            </span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-md">
              {selectedTemplate.toUpperCase()} TEMPLATE
            </span>
            {enableVerification && currentStore && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-md flex items-center">
                <Shield size={10} className="mr-1" />
                ANTI-FRAUD
              </span>
            )}
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
            {enableVerification && currentStore
              ? 'This receipt is protected against fraud with digital verification' 
              : enhancedData.hasCategoryData 
                ? 'Category-specific details included in this receipt' 
                : platform === 'android' 
                  ? 'Use View to preview, then Download or Share' 
                  : 'This is how your receipt will look when printed'}
          </p>
        </div>
        
        {/* Custom Template Renderer */}
        <div className="p-4 sm:p-6">
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
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
          </Suspense>
          
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
              {enableVerification && currentStore
                ? 'All prints and PDFs will include verification QR codes and links' 
                : enhancedData.hasCategoryData 
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