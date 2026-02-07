// printUtils.js

// Get print styles
export const getPrintStyles = () => {
  return `
    <style>
      /* === PRINT OPTIMIZED STYLES === */
      @page {
        size: auto;
        margin: 15mm;
      }
      
      @media print {
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .no-print {
          display: none !important;
        }
        
        .page-break {
          page-break-after: always;
        }
        
        /* Ensure all text is black for printing */
        * {
          color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
        }
        
        /* Hide manual print button */
        .print-button {
          display: none !important;
        }
      }
      
      /* === BASE STYLES === */
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 12pt;
        line-height: 1.4;
        color: #000;
        background: white;
        margin: 0;
        padding: 0;
      }
      
      /* === MOBILE RESPONSIVE PRINT === */
      @media print and (max-width: 768px) {
        body {
          font-size: 10pt;
        }
        
        @page {
          margin: 10mm;
        }
        
        img {
          max-width: 100% !important;
          height: auto !important;
        }
        
        table {
          width: 100% !important;
          table-layout: fixed !important;
        }
      }
      
      /* === ANDROID SPECIFIC === */
      @media print and (max-width: 480px) {
        body {
          font-size: 9pt !important;
        }
        
        @page {
          margin: 5mm !important;
        }
      }
      
      /* === PRINT SAFE COLORS === */
      .print-safe {
        color: black !important;
      }
      
      /* === RECEIPT CONTAINER === */
      .receipt-container {
        max-width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        padding: 20mm;
        background: white;
      }
      
      @media print {
        .receipt-container {
          padding: 0;
          margin: 0;
          box-shadow: none !important;
        }
      }
      
      /* === PREVENT TEXT CUTTING === */
      .avoid-break {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      /* === BETTER TABLE PRINTING === */
      table {
        page-break-inside: auto;
      }
      
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      
      /* === IMAGE OPTIMIZATION === */
      img {
        max-width: 150px !important;
        height: auto !important;
      }
    </style>
  `;
};

// Detect platform
export const detectPlatform = () => {
  const ua = navigator.userAgent;
  
  if (/Android/i.test(ua)) {
    return 'android';
  } else if (/iPad|iPhone|iPod/.test(ua)) {
    return 'ios';
  } else if (/Mac/i.test(ua)) {
    return 'mac';
  } else if (/Windows/i.test(ua)) {
    return 'windows';
  } else if (/Linux/i.test(ua)) {
    return 'linux';
  }
  
  return 'desktop';
};

// Check if browser supports advanced printing
export const supportsAdvancedPrint = () => {
  try {
    return typeof window.print === 'function' && 
           !/Android.*Chrome\/[.0-9]* Mobile/.test(navigator.userAgent);
  } catch (e) {
    return false;
  }
};

// Generate blob URL for PDF download (alternative method)
export const generatePDFBlob = (htmlContent) => {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      resolve(url);
    } catch (error) {
      reject(error);
    }
  });
};

// Android-specific print helper
// printUtils.js

// Android-specific print helper - FIXED VERSION
export const printForAndroid = (htmlContent) => {
  return new Promise((resolve, reject) => {
    try {
      // Create hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      
      document.body.appendChild(iframe);
      
      // FIX: Use proper variable declaration
      let iframeDoc;
      if (iframe.contentWindow && iframe.contentWindow.document) {
        iframeDoc = iframe.contentWindow.document;
      } else if (iframe.contentDocument) {
        iframeDoc = iframe.contentDocument;
      } else {
        // Fallback: use srcdoc
        iframe.srcdoc = htmlContent;
        iframe.onload = () => {
          try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            resolve(true);
          } catch (error) {
            reject(error);
          }
        };
        return;
      }
      
      // Write content to iframe
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      
      // Wait for content to load
      iframe.onload = () => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      
      // Fallback timeout
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          resolve(true);
        } catch (error) {
          reject(error);
        }
      }, 1000);
      
    } catch (error) {
      reject(error);
    }
  });
};

// Generate simple HTML for better Android compatibility
export const generateSimpleHTML = (receiptData, companyLogo, formatNaira, calculations) => {
  const { subtotal, discount, vat, total, change } = calculations;
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 210mm; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 50px; margin-bottom: 10px;">` : ''}
        <h1 style="margin: 10px 0; color: #111827; font-size: 20px;">${receiptData.storeName}</h1>
        <p style="margin: 5px 0; color: #4a5568;">${receiptData.storeAddress}</p>
        <p style="margin: 5px 0; color: #4a5568;">${receiptData.storePhone}</p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <p style="margin: 5px 0;"><strong>Receipt:</strong> ${receiptData.receiptNumber}</p>
        <p style="margin: 5px 0;"><strong>Date:</strong> ${receiptData.date}</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> ${receiptData.time}</p>
        <p style="margin: 5px 0;"><strong>Cashier:</strong> ${receiptData.cashierName}</p>
      </div>
      
      <div style="border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 15px 0; margin-bottom: 20px;">
        ${receiptData.items.map(item => `
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <div>
              <div style="font-weight: 500;">${item.name}</div>
              <div style="font-size: 12px; color: #4a5568;">${item.quantity} × ${formatNaira(item.price)}</div>
            </div>
            <div style="font-weight: 600;">${formatNaira(item.price * item.quantity)}</div>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Subtotal:</span>
          <span>${formatNaira(subtotal)}</span>
        </div>
        ${receiptData.includeDiscount && receiptData.discount > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #e53e3e;">
            <span>Discount:</span>
            <span>-${formatNaira(discount)}</span>
          </div>
        ` : ''}
        ${receiptData.includeVAT ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>VAT (${receiptData.vatRate}%):</span>
            <span>${formatNaira(vat)}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; margin-top: 15px; padding-top: 15px; border-top: 2px solid #4a5568;">
          <span>Total:</span>
          <span>${formatNaira(total)}</span>
        </div>
      </div>
      
      <div style="background: #f7fafc; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
        <p><strong>Payment:</strong> ${receiptData.paymentMethod}</p>
        ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? `
          <p><strong>Paid:</strong> ${formatNaira(receiptData.amountPaid)}</p>
          <p><strong>Change:</strong> ${formatNaira(change)}</p>
        ` : ''}
      </div>
      
      <div style="text-align: center; color: #4a5568; font-size: 12px;">
        <p>${receiptData.footerMessage || 'Thank you for your business!'}</p>
        <p style="margin-top: 10px;">${receiptData.receiptNumber}</p>
      </div>
    </div>
  `;
};