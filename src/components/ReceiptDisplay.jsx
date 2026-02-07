import React, { useState, useRef, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';
import BuyMeACoffeeModal from './BuyMeACoffeeModal';
import Swal from 'sweetalert2';
import TemplateSelector from './receiptTemplates/TemplateSelector';
import TemplateRenderer from './receiptTemplates/TemplateRenderer';
import ModernReceipt from './receiptTemplates/ModernReceipt';
import ReceiptActions from './receiptDisplay/ReceiptActions';


// Import new components



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

  /* ---------------- BEAUTIFUL PRINT FUNCTION ---------------- */

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
      
      // Create beautifully styled print document
      printWindow.document.write(`
        <!DOCTYPE html>
    <html>
      <head>
        <title>${receiptData.receiptType.toUpperCase()} ${receiptData.receiptNumber}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* === RESET === */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          /* === PRINT SETTINGS === */
          @page {
            size: A4;
            margin: 15mm;
          }
          
          @media print {
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
            .no-print {
              display: none !important;
            }
            .page-break {
              page-break-after: always;
            }
          }
          
          /* === BODY === */
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Helvetica Neue', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #1a1a1a;
            background: #f5f5f5;
            padding: 20mm;
          }
          
          /* === MAIN CONTAINER === */
          .receipt-page {
            max-width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            padding: 25mm 20mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          
          @media print {
            .receipt-page {
              box-shadow: none;
              padding: 0;
              margin: 0;
            }
          }
          
          /* === HEADER === */
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #059669;
          }
          
          .logo {
            margin-bottom: 15px;
          }
          
          .logo img {
            max-width: 120px;
            max-height: 80px;
            margin: 0 auto;
            display: block;
          }
          
          .company-name {
            font-size: 24pt;
            font-weight: 700;
            color: #059669;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
          }
          
          .company-details {
            font-size: 10pt;
            color: #4a5568;
            line-height: 1.8;
          }
          
          .company-details p {
            margin: 2px 0;
          }
          
          /* === DOCUMENT INFO === */
          .document-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          
          .info-section h3 {
            font-size: 9pt;
            font-weight: 600;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
          }
          
          .info-section p {
            font-size: 10pt;
            color: #1e293b;
            margin: 4px 0;
          }
          
          .info-label {
            font-weight: 600;
            color: #475569;
            display: inline-block;
            min-width: 80px;
          }
          
          /* === CUSTOMER INFO === */
          .customer-info {
            margin-bottom: 25px;
            padding: 15px;
            background: #ecfdf5;
            border-left: 4px solid #059669;
            border-radius: 4px;
          }
          
          .customer-info h3 {
            font-size: 11pt;
            font-weight: 600;
            color: #059669;
            margin-bottom: 8px;
          }
          
          .customer-info p {
            font-size: 10pt;
            color: #1e293b;
            margin: 3px 0;
          }
          
          /* === ITEMS TABLE === */
          .items-table {
            width: 100%;
            margin-bottom: 25px;
            border-collapse: collapse;
            font-size: 10pt;
          }
          
          .items-table thead th {
            background: #059669;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .items-table thead th:nth-child(1) { width: 5%; text-align: center; }
          .items-table thead th:nth-child(2) { width: 45%; }
          .items-table thead th:nth-child(3) { width: 12%; text-align: center; }
          .items-table thead th:nth-child(4) { width: 18%; text-align: right; }
          .items-table thead th:nth-child(5) { width: 20%; text-align: right; }
          
          .items-table tbody td {
            padding: 12px 8px;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .items-table tbody tr:hover {
            background: #f8fafc;
          }
          
          .item-name {
            font-weight: 500;
            color: #1e293b;
          }
          
          .item-description {
            font-size: 9pt;
            color: #64748b;
            margin-top: 3px;
            font-style: italic;
          }
          
          .text-center {
            text-align: center;
          }
          
          .text-right {
            text-align: right;
          }
          
          /* === TOTALS SECTION === */
          .totals-section {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
          }
          
          .totals-grid {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 12px;
            max-width: 400px;
            margin-left: auto;
            font-size: 10pt;
          }
          
          .total-row {
            display: contents;
          }
          
          .total-label {
            text-align: right;
            color: #475569;
            font-weight: 500;
          }
          
          .total-value {
            text-align: right;
            font-weight: 600;
            color: #1e293b;
            min-width: 120px;
          }
          
          .grand-total {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 2px solid #059669;
          }
          
          .grand-total .total-label {
            font-size: 12pt;
            font-weight: 700;
            color: #059669;
          }
          
          .grand-total .total-value {
            font-size: 14pt;
            font-weight: 700;
            color: #059669;
          }
          
          /* === PAYMENT INFO === */
          .payment-info {
            margin: 25px 0;
            padding: 15px;
            background: #fefce8;
            border-left: 4px solid #eab308;
            border-radius: 4px;
          }
          
          .payment-info h3 {
            font-size: 11pt;
            font-weight: 600;
            color: #854d0e;
            margin-bottom: 8px;
          }
          
          .payment-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 10pt;
          }
          
          /* === NOTES & TERMS === */
          .notes-section {
            margin-top: 25px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          
          .notes-section h3 {
            font-size: 10pt;
            font-weight: 600;
            color: #475569;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .notes-section p {
            font-size: 10pt;
            color: #64748b;
            line-height: 1.6;
            white-space: pre-wrap;
          }
          
          /* === SIGNATURE === */
          .signature-section {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
          
          .signature-box {
            text-align: center;
          }
          
          .signature-line {
            border-top: 2px solid #1e293b;
            margin-top: 50px;
            padding-top: 8px;
            font-size: 9pt;
            color: #64748b;
          }
          
          /* === FOOTER === */
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            font-size: 9pt;
            color: #64748b;
          }
          
          .footer p {
            margin: 5px 0;
          }
          
          .barcode {
            margin: 15px 0;
            display: flex;
            justify-content: center;
            gap: 1px;
            height: 40px;
          }
          
          .barcode-bar {
            width: 2px;
            background: #1e293b;
          }
          
          /* === PRINT CONTROLS (SCREEN ONLY) === */
          .print-controls {
            position: fixed;
            bottom: 30px;
            right: 30px;
            display: flex;
            gap: 12px;
            z-index: 1000;
          }
          
          .print-btn {
            padding: 14px 28px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          
          .print-btn-primary {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            color: white;
          }
          
          .print-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(5,150,105,0.3);
          }
          
          .print-btn-secondary {
            background: white;
            color: #475569;
            border: 2px solid #e2e8f0;
          }
          
          .print-btn-secondary:hover {
            background: #f8fafc;
            border-color: #cbd5e1;
          }
          
          @media screen and (max-width: 768px) {
            .print-controls {
              bottom: 20px;
              right: 20px;
              left: 20px;
              flex-direction: column;
            }
            
            .print-btn {
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-page">
          <!-- Header -->
          <div class="header">
            ${companyLogo ? `
              <div class="logo">
                <img src="${companyLogo}" alt="Company Logo">
              </div>
            ` : ''}
            <h1 class="company-name">${receiptData.storeName}</h1>
            <div class="company-details">
              <p>${receiptData.storeAddress}</p>
              <p>Tel: ${receiptData.storePhone} ${receiptData.storeEmail ? `• Email: ${receiptData.storeEmail}` : ''}</p>
              ${receiptData.tinNumber ? `<p><strong>${receiptData.tinNumber}</strong></p>` : ''}
              ${receiptData.rcNumber ? `<p>${receiptData.rcNumber}</p>` : ''}
            </div>
          </div>
          
          <!-- Document Info -->
          <div class="document-info">
            <div class="info-section">
              <h3>${receiptData.receiptType} Details</h3>
              <p><span class="info-label">Receipt #:</span> ${receiptData.receiptNumber}</p>
              ${receiptData.receiptType === 'invoice' && receiptData.invoiceNumber ? 
                `<p><span class="info-label">Invoice #:</span> ${receiptData.invoiceNumber}</p>` : ''}
              ${receiptData.poNumber ? `<p><span class="info-label">PO #:</span> ${receiptData.poNumber}</p>` : ''}
              <p><span class="info-label">Cashier:</span> ${receiptData.cashierName}</p>
            </div>
            <div class="info-section">
              <h3>Date & Time</h3>
              <p><span class="info-label">Date:</span> ${receiptData.date}</p>
              <p><span class="info-label">Time:</span> ${receiptData.time}</p>
              ${receiptData.dueDate ? `<p><span class="info-label">Due Date:</span> ${receiptData.dueDate}</p>` : ''}
            </div>
          </div>
          
          <!-- Customer Info -->
          ${receiptData.includeBillTo && receiptData.billToName ? `
            <div class="customer-info">
              <h3>BILL TO</h3>
              <p><strong>${receiptData.billToName}</strong></p>
              ${receiptData.billToAddress ? `<p>${receiptData.billToAddress}</p>` : ''}
              ${receiptData.billToPhone ? `<p>Tel: ${receiptData.billToPhone}</p>` : ''}
            </div>
          ` : ''}
          
          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>DESCRIPTION</th>
                <th>QTY</th>
                <th>UNIT PRICE</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${receiptData.items.map((item, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td>
                    <div class="item-name">${item.name}</div>
                    ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                    ${item.unit && item.unit !== 'Piece' ? `<div class="item-description">Unit: ${item.unit}</div>` : ''}
                  </td>
                  <td class="text-center">${item.quantity}</td>
                  <td class="text-right">${formatNaira(item.price)}</td>
                  <td class="text-right"><strong>${formatNaira(item.price * item.quantity)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <!-- Totals -->
          <div class="totals-section">
            <div class="totals-grid">
              <div class="total-row">
                <div class="total-label">Subtotal:</div>
                <div class="total-value">${formatNaira(calculateSubtotal())}</div>
              </div>
              
              ${receiptData.includeDiscount && receiptData.discount > 0 ? `
                <div class="total-row">
                  <div class="total-label">Discount:</div>
                  <div class="total-value" style="color: #dc2626;">-${formatNaira(calculateDiscount())}</div>
                </div>
              ` : ''}
              
              ${receiptData.deliveryFee > 0 ? `
                <div class="total-row">
                  <div class="total-label">Delivery:</div>
                  <div class="total-value">${formatNaira(receiptData.deliveryFee)}</div>
                </div>
              ` : ''}
              
              ${receiptData.includeVAT ? `
                <div class="total-row">
                  <div class="total-label">VAT (${receiptData.vatRate}%):</div>
                  <div class="total-value">${formatNaira(calculateVAT())}</div>
                </div>
              ` : ''}
            </div>
            
            <div class="totals-grid grand-total">
              <div class="total-row">
                <div class="total-label">GRAND TOTAL:</div>
                <div class="total-value">${formatNaira(calculateTotal())}</div>
              </div>
            </div>
          </div>
          
          <!-- Payment Info -->
          <div class="payment-info">
            <h3>PAYMENT INFORMATION</h3>
            <div class="payment-details">
              <div>
                <strong>Method:</strong> ${receiptData.paymentMethod}
              </div>
              ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? `
                <div>
                  <strong>Amount Paid:</strong> ${formatNaira(receiptData.amountPaid)}
                </div>
                <div>
                  <strong>Change:</strong> ${formatNaira(calculateChange())}
                </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Notes -->
          ${receiptData.customerNotes || receiptData.termsAndConditions ? `
            <div class="notes-section">
              ${receiptData.customerNotes ? `
                <h3>Notes</h3>
                <p>${receiptData.customerNotes}</p>
              ` : ''}
              ${receiptData.includeTerms && receiptData.termsAndConditions ? `
                <h3 style="margin-top: 15px;">Terms & Conditions</h3>
                <p>${receiptData.termsAndConditions}</p>
              ` : ''}
            </div>
          ` : ''}
          
          <!-- Signature -->
          ${receiptData.includeSignature ? `
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line">
                  Customer Signature
                </div>
              </div>
              <div class="signature-box">
                <div class="signature-line">
                  Authorized Signature
                </div>
              </div>
            </div>
          ` : ''}
          
          <!-- Footer -->
          <div class="footer">
            <div class="barcode">
              ${Array.from({ length: 60 }).map((_, i) => 
                `<div class="barcode-bar" style="height: ${Math.random() * 30 + 10}px"></div>`
              ).join('')}
            </div>
            <p><strong>${receiptData.receiptNumber}</strong></p>
            <p>${receiptData.footerMessage || 'Thank you for your business!'}</p>
            <p style="margin-top: 10px; font-size: 8pt;">
              Generated on ${new Date().toLocaleString('en-GB')} • Powered by ReceiptIt
            </p>
          </div>
        </div>
        
        <!-- Print Controls (Screen Only) -->
        <div class="print-controls no-print">
          <button class="print-btn print-btn-primary" onclick="window.print()">
            🖨️ Print / Save as PDF
          </button>
          <button class="print-btn print-btn-secondary" onclick="window.close()">
            ✕ Close
          </button>
        </div>
        
        <script>
          // Auto-print on desktop (not mobile)
          setTimeout(() => {
            if (${!isMobile} && window.innerWidth > 768) {
              window.print();
            }
          }, 800);
          
          // Close after print
          window.addEventListener('afterprint', () => {
            setTimeout(() => window.close(), 500);
          });
        </script>
      </body>
    </html>
  `);
      printWindow.document.close();
      
      // Show coffee modal on main page
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

  /* ---------------- DOWNLOAD PDF ---------------- */

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
      
      await Swal.fire({
        title: "📄 Save as PDF",
        html: `
          <div style="text-align: left; font-size: 15px;">
            <p style="margin-bottom: 15px; color: #4a5568;">Opening print view to save your receipt as PDF...</p>
            <div style="background: #f7fafc; padding: 15px; border-radius: 10px; border-left: 4px solid #4299e1;">
              <p style="font-weight: 600; color: #2d3748; margin-bottom: 10px;">📋 Instructions:</p>
              <ol style="margin-left: 20px; color: #4a5568;">
                <li style="margin-bottom: 8px;">Click <strong style="color: #2b6cb0;">"Print / Save as PDF"</strong> button</li>
                <li style="margin-bottom: 8px;">Select <strong style="color: #2b6cb0;">"Save as PDF"</strong> as printer</li>
                <li style="margin-bottom: 8px;">Choose location and save</li>
                <li>For mobile: Use browser's share menu</li>
              </ol>
            </div>
          </div>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Open Print View",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#4299e1",
        cancelButtonColor: "#a0aec0",
        timer: 8000
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handlePrint();
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
      // Show loading
      await Swal.fire({
        title: "Opening Preview...",
        text: "Preparing receipt for viewing",
        icon: "info",
        timer: 1500,
        showConfirmButton: false
      });
      
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
      {/* Mobile Detection Notice */}
      {/* <MobileNotic isMobile={isMobile} /> */}

      {/* Buy Me a Coffee Modal */}
      <BuyMeACoffeeModal
        isOpen={showCoffeeModal}
        onClose={() => setShowCoffeeModal(false)}
      />

      {/* Template Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <TemplateSelector />
      </div>

      {/* Modern Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-3">
            <FileText className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">✨ Premium Receipt Experience</h3>
            <p className="text-gray-600 mb-3">
              Choose a design style, then use print to save as high-quality PDF.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Multiple Templates</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Print to PDF</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Mobile Optimized</span>
            </div>
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
      </div>

      {/* Visible Preview */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            Live Preview
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              ${receiptData.receiptType.toUpperCase()}
            </span>
          </h3>
          <p className="text-sm text-gray-500 mt-1">This is how your receipt will look when printed</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDisplay;