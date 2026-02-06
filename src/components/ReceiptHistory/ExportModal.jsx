import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, FileJson, Mail, Check } from 'lucide-react';
import { useReceipt } from '../../context/ReceiptContext';

const ExportModal = ({ onClose }) => {
  const { savedReceipts, formatNaira } = useReceipt();
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    // Filter receipts based on date range
    let filteredReceipts = [...savedReceipts];
    
    if (dateRange !== 'all') {
      const now = new Date();
      const days = parseInt(dateRange);
      filteredReceipts = filteredReceipts.filter(receipt => {
        const receiptDate = new Date(receipt.date);
        const diffTime = Math.abs(now - receiptDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days;
      });
    }

    // Generate export data
    let exportData;
    let filename;
    let mimeType;

    switch (exportFormat) {
      case 'csv':
        exportData = generateCSV(filteredReceipts, includeDetails);
        filename = `receipts_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv;charset=utf-8;';
        break;
      
      case 'json':
        exportData = generateJSON(filteredReceipts, includeDetails);
        filename = `receipts_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;
      
      case 'excel':
        exportData = generateCSV(filteredReceipts, includeDetails); // Excel can open CSV
        filename = `receipts_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv;charset=utf-8;';
        break;
      
      case 'pdf':
        // For PDF, we'll create a ZIP of all PDFs
        exportPDFZIP(filteredReceipts);
        setIsExporting(false);
        setExportSuccess(true);
        setTimeout(() => {
          setExportSuccess(false);
          onClose();
        }, 2000);
        return;
    }

    // Create and download file
    const blob = new Blob([exportData], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
      onClose();
    }, 2000);
  };

  const generateCSV = (receipts, includeDetails) => {
    const headers = [
      'Receipt Number',
      'Name',
      'Store',
      'Date',
      'Time',
      'Total Amount',
      'Items Count',
      'Template',
      'Payment Method',
      'Customer Name',
      'Customer Phone'
    ];

    if (includeDetails) {
      headers.push('Items Details', 'Notes');
    }

    const rows = receipts.map(receipt => {
      const row = [
        receipt.receiptNumber,
        receipt.name,
        receipt.storeName,
        new Date(receipt.date).toLocaleDateString(),
        new Date(receipt.date).toLocaleTimeString(),
        formatNaira(receipt.total),
        receipt.itemsCount,
        receipt.template,
        receipt.data?.paymentMethod || '',
        receipt.data?.customerName || '',
        receipt.data?.customerPhone || ''
      ];

      if (includeDetails) {
        const itemsDetails = receipt.data?.items?.map(item => 
          `${item.quantity}x ${item.name} @ ${formatNaira(item.price)}`
        ).join('; ') || '';
        const notes = receipt.data?.customerNotes || '';
        row.push(`"${itemsDetails}"`, `"${notes}"`);
      }

      return row.map(cell => `"${cell}"`).join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  };

  const generateJSON = (receipts, includeDetails) => {
    const exportData = receipts.map(receipt => ({
      ...receipt,
      data: includeDetails ? receipt.data : undefined
    }));
    return JSON.stringify(exportData, null, 2);
  };

  const exportPDFZIP = async (receipts) => {
    // Note: For actual ZIP creation, you'd need a library like JSZip
    // This is a simplified version that downloads each PDF individually
    receipts.forEach((receipt, index) => {
      setTimeout(() => {
        if (receipt.pdfBlobUrl) {
          const link = document.createElement('a');
          link.href = receipt.pdfBlobUrl;
          link.download = `${receipt.name.replace(/\s+/g, '_')}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }, index * 100); // Stagger downloads
    });
  };

  const exportOptions = [
    {
      id: 'csv',
      name: 'CSV File',
      description: 'Spreadsheet format, editable in Excel/Google Sheets',
      icon: FileSpreadsheet,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'excel',
      name: 'Excel Format',
      description: 'Optimized for Microsoft Excel',
      icon: FileSpreadsheet,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'Full data backup, can be re-imported',
      icon: FileJson,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'pdf',
      name: 'PDF Bundle',
      description: 'Download all receipts as separate PDF files',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const dateRanges = [
    { id: 'all', label: 'All time' },
    { id: '7', label: 'Last 7 days' },
    { id: '30', label: 'Last 30 days' },
    { id: '90', label: 'Last 90 days' }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <Download className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Export Receipt History</h3>
              <p className="text-sm text-gray-600">
                Export {savedReceipts.length} receipts for backup or analysis
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Success Message */}
        {exportSuccess && (
          <div className="m-4 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Check className="text-green-600" size={20} />
              <div>
                <p className="font-medium text-green-800">Export successful!</p>
                <p className="text-sm text-green-600">
                  File downloaded to your device
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Export Format */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Select Export Format</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setExportFormat(option.id)}
                    className={`p-4 border rounded-xl transition-all ${
                      exportFormat === option.id
                        ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${option.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={option.color} size={20} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-800">{option.name}</div>
                        <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Date Range</h4>
            <div className="flex flex-wrap gap-2">
              {dateRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setDateRange(range.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    dateRange === range.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Export Options</h4>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDetails}
                  onChange={(e) => setIncludeDetails(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-800">Include Detailed Information</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Export item details, customer info, and notes
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-800 mb-3">Export Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Format:</div>
                <div className="font-medium">
                  {exportOptions.find(o => o.id === exportFormat)?.name}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Receipts:</div>
                <div className="font-medium">
                  {dateRange === 'all' 
                    ? savedReceipts.length 
                    : `${savedReceipts.filter(r => {
                      const now = new Date();
                      const receiptDate = new Date(r.date);
                      const diffTime = Math.abs(now - receiptDate);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= parseInt(dateRange);
                    }).length} of ${savedReceipts.length}`}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Date Range:</div>
                <div className="font-medium">
                  {dateRanges.find(r => r.id === dateRange)?.label}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Details:</div>
                <div className="font-medium">
                  {includeDetails ? 'Included' : 'Basic only'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="text-sm text-gray-600">
            {exportFormat === 'pdf' 
              ? 'PDF files will be downloaded individually'
              : 'File will download immediately'}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Export Receipts
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;