import React, { useState } from 'react';
import { 
  History, 
  Download, 
  Eye, 
  Trash2, 
  Search, 
  Filter, 
  Calendar, 
  FileText,
  Receipt as ReceiptIcon,
  X,
  Printer,
  ChevronDown
} from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';

const ReceiptHistory = () => {
  const { savedReceipts, deleteSavedReceipt, clearHistory, formatNaira } = useReceipt();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [expandedReceipt, setExpandedReceipt] = useState(null);

  // Filter receipts
  const filteredReceipts = savedReceipts.filter(receipt => {
    const matchesSearch = 
      receipt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.storeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
      receipt.template === selectedFilter ||
      (selectedFilter === 'recent' && isRecent(receipt.date));
    
    return matchesSearch && matchesFilter;
  });

  const isRecent = (date) => {
    const receiptDate = new Date(date);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return receiptDate > oneWeekAgo;
  };

  // Group by date
  const groupedReceipts = filteredReceipts.reduce((groups, receipt) => {
    const date = new Date(receipt.date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(receipt);
    return groups;
  }, {});

  const handleDownloadReceipt = (receipt) => {
    if (receipt.pdfBlobUrl) {
      const link = document.createElement('a');
      link.href = receipt.pdfBlobUrl;
      link.download = `${receipt.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrintReceipt = (receipt) => {
    if (receipt.pdfBlobUrl) {
      const printWindow = window.open(receipt.pdfBlobUrl, '_blank');
      printWindow?.addEventListener('load', function() {
        printWindow.print();
      });
    }
  };

  const toggleExpand = (id) => {
    setExpandedReceipt(expandedReceipt === id ? null : id);
  };

  if (savedReceipts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <History className="text-gray-400" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Receipt History</h3>
          <p className="text-gray-600 mb-6">
            Generated receipts will appear here for easy access and reprinting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <History className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Receipt History</h2>
              <p className="text-gray-600">
                {savedReceipts.length} saved receipt{savedReceipts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search receipts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Receipts</option>
              <option value="recent">Recent (Last 7 days)</option>
              <option value="professional">Professional</option>
              <option value="modern">Modern</option>
              <option value="elegant">Elegant</option>
              <option value="thermal">Thermal</option>
            </select>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Receipts List */}
      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {Object.entries(groupedReceipts).map(([date, receipts]) => (
          <div key={date}>
            <div className="px-6 py-3 bg-gray-50">
              <div className="flex items-center text-gray-700">
                <Calendar size={16} className="mr-2" />
                <span className="font-medium">{date}</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({receipts.length} receipt{receipts.length !== 1 ? 's' : ''})
                </span>
              </div>
            </div>

            {receipts.map((receipt) => (
              <div key={receipt.id} className="hover:bg-gray-50 transition-colors">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <FileText className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{receipt.name}</h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <ReceiptIcon size={14} className="mr-1" />
                            {receipt.receiptNumber}
                          </span>
                          <span>•</span>
                          <span>{receipt.storeName}</span>
                          <span>•</span>
                          <span>{receipt.itemsCount} items</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            receipt.template === 'professional' ? 'bg-blue-100 text-blue-800' :
                            receipt.template === 'modern' ? 'bg-green-100 text-green-800' :
                            receipt.template === 'elegant' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {receipt.template}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formatNaira(receipt.total)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(receipt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePrintReceipt(receipt)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Print"
                        >
                          <Printer size={18} />
                        </button>
                        <button
                          onClick={() => handleDownloadReceipt(receipt)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => toggleExpand(receipt.id)}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => deleteSavedReceipt(receipt.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded View */}
                  {expandedReceipt === receipt.id && receipt.data && (
                    <div className="mt-4 pl-14 pr-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Items Summary</h5>
                            <div className="space-y-1">
                              {receipt.data.items?.slice(0, 3).map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-gray-600 truncate">{item.quantity}x {item.name}</span>
                                  <span className="font-medium">{formatNaira(item.price * item.quantity)}</span>
                                </div>
                              ))}
                              {receipt.data.items?.length > 3 && (
                                <div className="text-xs text-gray-500">
                                  +{receipt.data.items.length - 3} more items
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Customer Info</h5>
                            <div className="text-sm space-y-1">
                              <p className="text-gray-600">{receipt.data.customerName || 'No customer info'}</p>
                              {receipt.data.customerPhone && (
                                <p className="text-gray-600">📞 {receipt.data.customerPhone}</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Payment</h5>
                            <div className="text-sm space-y-1">
                              <p className="text-gray-600">Method: {receipt.data.paymentMethod}</p>
                              {receipt.data.amountPaid > 0 && (
                                <p className="text-gray-600">Paid: {formatNaira(receipt.data.amountPaid)}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Clear All History?</h3>
              <button onClick={() => setShowClearConfirm(false)}>
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              This will permanently delete all {savedReceipts.length} saved receipts. 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearHistory();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear All Receipts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptHistory;