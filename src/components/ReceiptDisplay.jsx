 import React, { useState, useRef } from 'react';
import { Printer, Download, Share2, Copy, FileText, Eye, X, CheckCircle } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';
import ReceiptPDF from './ReceiptPDF';
import { pdf } from '@react-pdf/renderer';

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
  const [showSuccess, setShowSuccess] = useState(false);
  const printableRef = useRef();

  // Generate PDF
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
      
      // Save to history if requested
      if (saveToHistory) {
        saveCurrentReceipt(blob);
      }
      
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return { blob, url };
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Download PDF
  const handleDownloadPDF = async () => {
    const result = await generatePDF(true);
    if (result) {
      const link = document.createElement('a');
      link.href = result.url;
      link.download = `${receiptData.receiptType}-${receiptData.receiptNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Handle Print
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${receiptData.receiptType.toUpperCase()} ${receiptData.receiptNumber}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              @page { margin: 0; }
            }
            body {
              font-family: Arial, sans-serif;
              max-width: 400px;
              margin: 0 auto;
            }
            .receipt {
              border: 1px solid #ccc;
              padding: 20px;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            ${printableRef.current.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Handle Preview PDF
  const handlePreviewPDF = async () => {
    setShowPreview(true);
    await generatePDF(false);
  };

  // Copy receipt details as text
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

Thank you for your business!
    `.trim();
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Receipt copied to clipboard!');
    });
  };

  // Share on WhatsApp
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

Thank you for your business! 🎉
    `.trim());
    
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="font-semibold text-green-800">Receipt Saved!</p>
                <p className="text-sm text-green-600">PDF saved to your history</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <FileText className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">PDF Preview</h2>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              {pdfUrl ? (
                <iframe 
                  src={pdfUrl} 
                  className="w-full h-full min-h-[70vh] border rounded-lg"
                  title="PDF Preview"
                />
              ) : isGenerating ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Generating PDF preview...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <FileText className="text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">Click generate to preview PDF</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
              {pdfUrl && (
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Download PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={handlePrint}
          disabled={isGenerating}
          className="group relative overflow-hidden bg-gradient-to-r from-gray-900 to-black text-white rounded-xl p-3 flex items-center justify-center space-x-2 hover:shadow-xl transition-all duration-300 font-medium disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Printer size={18} />
              <span>Print</span>
            </>
          )}
        </button>
        
        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-3 flex items-center justify-center space-x-2 hover:shadow-xl transition-all duration-300 font-medium disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Download size={18} />
              <span>Download PDF</span>
            </>
          )}
        </button>
        
        <button
          onClick={handlePreviewPDF}
          disabled={isGenerating}
          className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-3 flex items-center justify-center space-x-2 hover:shadow-xl transition-all duration-300 font-medium disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Eye size={18} />
              <span>Preview PDF</span>
            </>
          )}
        </button>
        
        <button
          onClick={shareOnWhatsApp}
          className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl p-3 flex items-center justify-center space-x-2 hover:shadow-xl transition-all duration-300 font-medium"
        >
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <FileText className="text-blue-600" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {receiptData.receiptType.toUpperCase()} #{receiptData.receiptNumber}
              </p>
              <p className="text-xs text-gray-600">{savedReceipts.length} saved in history</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center space-x-2"
            >
              <Copy size={14} />
              <span>Copy Text</span>
            </button>
            
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">
                {formatNaira(calculateTotal())}
              </p>
              <p className="text-xs text-gray-500">Grand Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Receipt (Hidden for print) */}
      <div ref={printableRef} className="hidden">
        <div className="p-8 max-w-md mx-auto">
          {companyLogo && (
            <div className="text-center mb-4">
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                style={{ height: '60px', margin: '0 auto' }}
              />
            </div>
          )}
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{receiptData.storeName}</h1>
            <p className="text-gray-600">{receiptData.storeAddress}</p>
            <p className="text-gray-600 text-sm">Phone: {receiptData.storePhone}</p>
            {receiptData.tinNumber && <p className="text-sm">{receiptData.tinNumber}</p>}
          </div>

          <div className="border-t border-b py-4 my-4">
            <div className="flex justify-between mb-2">
              <span>Receipt #{receiptData.receiptNumber}</span>
              <span>{receiptData.date}</span>
            </div>
            <div className="text-sm text-gray-600">
              Cashier: {receiptData.cashierName} | Time: {receiptData.time}
            </div>
          </div>

          <div className="mb-6">
            <div className="font-semibold border-b pb-2 mb-2">ITEMS</div>
            {receiptData.items.map(item => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <div>
                  <div className="font-medium">{item.quantity}x {item.name}</div>
                  {item.unit && <div className="text-sm text-gray-600">Unit: {item.unit}</div>}
                </div>
                <div className="text-right">
                  <div>{formatNaira(item.price * item.quantity)}</div>
                  <div className="text-sm text-gray-600">{formatNaira(item.price)} each</div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{formatNaira(calculateSubtotal())}</span>
            </div>
            
            {receiptData.includeDiscount && receiptData.discount > 0 && (
              <div className="flex justify-between mb-2 text-red-600">
                <span>Discount</span>
                <span>-{formatNaira(calculateDiscount())}</span>
              </div>
            )}
            
            {receiptData.includeVAT && (
              <div className="flex justify-between mb-2">
                <span>VAT ({receiptData.vatRate}%)</span>
                <span>{formatNaira(calculateVAT())}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
              <span>TOTAL</span>
              <span>{formatNaira(calculateTotal())}</span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t text-center text-sm">
            <p className="mb-2">{receiptData.customerNotes}</p>
            <p className="font-semibold">{receiptData.footerMessage}</p>
            <p className="text-gray-600 mt-4">Thank you for your business!</p>
          </div>
        </div>
      </div>

      {/* Visible Preview */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            {companyLogo && (
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                className="h-16 mx-auto mb-4"
              />
            )}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{receiptData.storeName}</h2>
            <p className="text-gray-600">{receiptData.storeAddress}</p>
            <p className="text-gray-600 text-sm">Phone: {receiptData.storePhone}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Receipt #</p>
              <p className="font-semibold">{receiptData.receiptNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{receiptData.date}</p>
            </div>
          </div>

          <div className="border-t border-b py-4 mb-6">
            {receiptData.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between py-1">
                <span className="text-sm">
                  {item.quantity}x {item.name}
                  {item.unit && <span className="text-gray-500 ml-2">({item.unit})</span>}
                </span>
                <span className="text-sm font-medium">
                  {formatNaira(item.price * item.quantity)}
                </span>
              </div>
            ))}
            {receiptData.items.length > 3 && (
              <div className="text-center text-sm text-gray-500 mt-2">
                +{receiptData.items.length - 3} more items
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatNaira(calculateSubtotal())}</span>
            </div>
            
            {receiptData.includeVAT && (
              <div className="flex justify-between">
                <span className="text-gray-600">VAT ({receiptData.vatRate}%)</span>
                <span className="font-medium">{formatNaira(calculateVAT())}</span>
              </div>
            )}
            
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-blue-600">{formatNaira(calculateTotal())}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-sm text-gray-500">
              This is a preview. Use buttons above to print or save PDF.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDisplay;