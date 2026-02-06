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

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      setIsMobile(/iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset modal tracking daily
  useEffect(() => {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('coffeeModalLastShown');
    
    if (lastShown !== today) {
      console.log('Resetting coffee modal for new day');
      localStorage.removeItem('coffeeModalShownToday');
      localStorage.setItem('coffeeModalLastShown', today);
    }
  }, []);

  // Function to show coffee modal (with daily limit)
  const showCoffeeModalIfAllowed = () => {
    const hasShownToday = localStorage.getItem('coffeeModalShownToday');
    
    if (!hasShownToday) {
      console.log('Showing coffee modal - first time today');
      setTimeout(() => {
        setShowCoffeeModal(true);
        // localStorage.setItem('coffeeModalShownToday', 'true');
      }, 1500); // Show after 1.5 seconds
    } else {
      console.log('Coffee modal already shown today');
    }
  };

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
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // MOBILE-FRIENDLY PDF DOWNLOAD
  const handleDownloadPDF = async () => {
    try {
      const result = await generatePDF(true);
      if (result) {
        if (isMobile) {
          const reader = new FileReader();
          reader.onload = function(e) {
            const mobileUrl = e.target.result;
            const link = document.createElement('a');
            link.href = mobileUrl;
            link.download = `${receiptData.receiptType}-${receiptData.receiptNumber}.pdf`;
            link.target = '_blank';
            
            document.body.appendChild(link);
            
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
              window.open(mobileUrl, '_blank');
            } else {
              link.click();
            }
            
            setTimeout(() => {
              document.body.removeChild(link);
              URL.revokeObjectURL(result.url);
            }, 100);
          };
          reader.readAsDataURL(result.blob);
        } else {
          const link = document.createElement('a');
          link.href = result.url;
          link.download = `${receiptData.receiptType}-${receiptData.receiptNumber}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        setTimeout(() => {
          if (result.url) URL.revokeObjectURL(result.url);
        }, 1000);
        
        // Show coffee modal after download (except preview)
        showCoffeeModalIfAllowed();
        
        return true;
      }
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  };

  // MOBILE-FRIENDLY PDF PREVIEW
  const handlePreviewPDF = async () => {
    if (isMobile) {
      try {
        const result = await generatePDF(false);
        if (result) {
          const reader = new FileReader();
          reader.onload = function(e) {
            const dataUrl = e.target.result;
            const newWindow = window.open();
            newWindow.document.write(`
              <html>
                <head>
                  <title>Receipt ${receiptData.receiptNumber}</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { margin: 0; padding: 20px; background: #f5f5f5; }
                    iframe { width: 100%; height: calc(100vh - 40px); border: none; }
                    .mobile-actions {
                      position: fixed;
                      bottom: 0;
                      left: 0;
                      right: 0;
                      background: white;
                      padding: 15px;
                      border-top: 1px solid #ddd;
                      display: flex;
                      gap: 10px;
                    }
                    .mobile-actions button {
                      flex: 1;
                      padding: 12px;
                      border: none;
                      border-radius: 8px;
                      font-weight: bold;
                      cursor: pointer;
                    }
                    .download-btn { background: #2563eb; color: white; }
                    .share-btn { background: #10b981; color: white; }
                    .close-btn { background: #6b7280; color: white; }
                  </style>
                </head>
                <body>
                  <iframe src="${dataUrl}"></iframe>
                  <div class="mobile-actions">
                    <button class="download-btn" onclick="window.open('${dataUrl}', '_blank')">Download</button>
                    <button class="share-btn" onclick="window.open('https://wa.me/?text=${encodeURIComponent('Check out my receipt: ' + window.location.href)}', '_blank')">Share</button>
                    <button class="close-btn" onclick="window.close()">Close</button>
                  </div>
                </body>
              </html>
            `);
            newWindow.document.close();
          };
          reader.readAsDataURL(result.blob);
          
          setTimeout(() => {
            if (result.url) URL.revokeObjectURL(result.url);
          }, 10000);
          
          return true;
        }
      } catch (error) {
        console.error('Preview error:', error);
        throw error;
      }
      return;
    }
    
    // Desktop preview - DON'T show coffee modal for preview
    setShowPreview(true);
    try {
      await generatePDF(false);
      return true;
    } catch (error) {
      console.error('Preview error:', error);
      throw error;
    }
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${receiptData.receiptType.toUpperCase()} ${receiptData.receiptNumber}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            @media print {
              body { margin: 0; padding: 10px; font-size: 14px; }
              @page { margin: 0; }
              .no-print { display: none !important; }
            }
            @media screen {
              body { max-width: 400px; margin: 0 auto; padding: 20px; }
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              line-height: 1.4;
            }
            .receipt {
              border: ${isMobile ? 'none' : '1px solid #ccc'};
              padding: ${isMobile ? '10px' : '15px'};
              border-radius: 8px;
            }
            .signature-container {
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px solid #ccc;
            }
            .signature-line {
              width: ${isMobile ? '120px' : '150px'};
              border-bottom: 1px solid #000;
              margin: 10px auto;
              padding-bottom: 3px;
            }
            .signature-image {
              max-width: ${isMobile ? '120px' : '150px'};
              max-height: 40px;
              margin: 0 auto;
            }
            img { max-width: 100%; height: auto; }
            .print-header {
              text-align: center;
              margin-bottom: 15px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .print-actions {
              margin-top: 20px;
              text-align: center;
              padding: 10px;
              background: #f5f5f5;
              border-radius: 5px;
            }
            .print-btn {
              background: #2563eb;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              margin: 0 5px;
              cursor: pointer;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="no-print print-header">
            <h2>Print Preview</h2>
            <p>Receipt #${receiptData.receiptNumber}</p>
          </div>
          <div class="receipt">
            ${printableRef.current?.innerHTML || ''}
          </div>
          <div class="no-print print-actions">
            <button class="print-btn" onclick="window.print()">🖨️ Print Now</button>
            <button class="print-btn" onclick="window.close()" style="background: #6b7280;">Close</button>
          </div>
          <script>
            setTimeout(() => {
              if (${!isMobile}) {
                window.print();
              }
            }, 1000);
            
            window.onafterprint = function() {
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Show coffee modal after print
    showCoffeeModalIfAllowed();
    
    return Promise.resolve();
  };

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
    
    // Show coffee modal after copy
    showCoffeeModalIfAllowed();
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    } else {
      return fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    return new Promise((resolve, reject) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textArea);
      }
    });
  };

  const shareOnWhatsApp = () => {
    const itemsList = receiptData.items.map(item => 
      `${item.quantity}x ${item.name} - ${formatNaira(item.price * item.quantity)}`
    ).join('\n');
    
    const totalAmount = formatNaira(calculateTotal());
    const storeName = receiptData.storeName;
    const receiptNumber = receiptData.receiptNumber;
    
    const text = encodeURIComponent(`
*${receiptData.receiptType.toUpperCase()} from ${storeName}*

📄 Receipt: ${receiptNumber}
📅 Date: ${receiptData.date}
⏰ Time: ${receiptData.time}
👤 Cashier: ${receiptData.cashierName}

🛒 Items:
${itemsList}

💰 Total: ${totalAmount}

${receiptData.customerNotes}

${receiptData.includeSignature ? '✍️ Signed' : ''}

Thank you for your business! 🎉
    `.trim());
    
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
    
    // Show coffee modal after share
    showCoffeeModalIfAllowed();
    
    return Promise.resolve();
  };

  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

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