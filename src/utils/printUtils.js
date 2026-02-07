// printUtils.js
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
      }
      
      /* === BASE STYLES === */
      body {
        font-family: Arial, sans-serif;
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
    </style>
  `;
};