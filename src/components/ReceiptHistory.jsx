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
  ChevronDown,
  ChevronUp,
  Check,
  FileDown,
  Clock,
  Store,
  Tag,
  Users,
  CreditCard
} from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';

const ReceiptHistory = () => {
  const { savedReceipts, deleteSavedReceipt, clearHistory, formatNaira } = useReceipt();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [expandedReceipt, setExpandedReceipt] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter receipts
  const filteredReceipts = savedReceipts.filter(receipt => {
    const matchesSearch = 
      receipt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (receipt.data?.customerName && receipt.data.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
      receipt.template === selectedFilter ||
      (selectedFilter === 'recent' && isRecent(receipt.date)) ||
      (selectedFilter === 'invoice' && receipt.name.toLowerCase().includes('invoice')) ||
      (selectedFilter === 'receipt' && receipt.name.toLowerCase().includes('receipt')) ||
      (selectedFilter === 'quote' && receipt.name.toLowerCase().includes('quote'));
    
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
    const date = new Date(receipt.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  // Statistics
  const totalValue = savedReceipts.reduce((sum, receipt) => sum + receipt.total, 0);
  const averageValue = savedReceipts.length > 0 ? totalValue / savedReceipts.length : 0;
  const recentCount = savedReceipts.filter(r => isRecent(r.date)).length;

  if (savedReceipts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center py-10 sm:py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
            <History className="text-blue-500" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Receipt History Yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Generated receipts will appear here for easy access, reprinting, and management.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
              <Check size={16} className="mr-2" />
              Auto-saved after generation
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg">
              <FileDown size={16} className="mr-2" />
              Download anytime
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden">
      {/* Header with Stats */}
      <div className="p-5 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-white to-blue-50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <History className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Receipt History</h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <Clock size={14} className="mr-1.5" />
                  {recentCount} recent
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <Tag size={14} className="mr-1.5" />
                  {formatNaira(totalValue)} total
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter size={18} />
              <span>Filter</span>
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, number, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filters - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 min-w-[180px]"
            >
              <option value="all">All Receipts</option>
              <option value="recent">Recent (7 days)</option>
              <option value="invoice">Invoices</option>
              <option value="receipt">Receipts</option>
              <option value="quote">Quotes</option>
              <option value="professional">Professional</option>
              <option value="modern">Modern</option>
              <option value="elegant">Elegant</option>
              <option value="thermal">Thermal</option>
            </select>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="mt-4 lg:hidden">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Receipts</option>
              <option value="recent">Recent (7 days)</option>
              <option value="invoice">Invoices</option>
              <option value="receipt">Receipts</option>
              <option value="quote">Quotes</option>
              <option value="professional">Professional</option>
              <option value="modern">Modern</option>
              <option value="elegant">Elegant</option>
              <option value="thermal">Thermal</option>
            </select>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-50 to-transparent">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-semibold">{filteredReceipts.length}</span> of <span className="font-semibold">{savedReceipts.length}</span> receipts
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Receipts List */}
      <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
        {Object.entries(groupedReceipts).map(([date, receipts]) => (
          <div key={date} className="bg-white">
            {/* Date Header */}
            <div className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center text-gray-700 font-medium">
                <Calendar size={18} className="mr-3 text-blue-600" />
                <span className="text-gray-900">{date}</span>
                <span className="ml-3 px-2 py-1 bg-white rounded-lg text-sm font-normal">
                  {receipts.length} receipt{receipts.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {receipts.map((receipt) => (
              <div key={receipt.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                <div className="px-4 sm:px-6 py-4">
                  {/* Mobile Layout */}
                  <div className="lg:hidden">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                          receipt.template === 'professional' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                          receipt.template === 'modern' ? 'bg-gradient-to-br from-green-100 to-green-200' :
                          receipt.template === 'elegant' ? 'bg-gradient-to-br from-rose-100 to-rose-200' :
                          'bg-gradient-to-br from-amber-100 to-amber-200'
                        }`}>
                          <FileText className={
                            receipt.template === 'professional' ? 'text-blue-600' :
                            receipt.template === 'modern' ? 'text-green-600' :
                            receipt.template === 'elegant' ? 'text-rose-600' :
                            'text-amber-600'
                          } size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base">{receipt.name}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="inline-flex items-center text-xs text-gray-600">
                              <ReceiptIcon size={12} className="mr-1" />
                              {receipt.receiptNumber}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="inline-flex items-center text-xs text-gray-600">
                              <Store size={12} className="mr-1" />
                              {receipt.storeName}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-lg">{formatNaira(receipt.total)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(receipt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* Template Badge and Items */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        receipt.template === 'professional' ? 'bg-blue-100 text-blue-800' :
                        receipt.template === 'modern' ? 'bg-green-100 text-green-800' :
                        receipt.template === 'elegant' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {receipt.template}
                      </span>
                      <span className="text-sm text-gray-600">
                        {receipt.itemsCount} item{receipt.itemsCount !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => toggleExpand(receipt.id)}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {expandedReceipt === receipt.id ? (
                          <>
                            <ChevronUp size={16} />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} />
                            Show Details
                          </>
                        )}
                      </button>
                      
                      <div className="flex items-center gap-2">
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
                          onClick={() => deleteSavedReceipt(receipt.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:flex lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${
                        receipt.template === 'professional' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                        receipt.template === 'modern' ? 'bg-gradient-to-br from-green-100 to-green-200' :
                        receipt.template === 'elegant' ? 'bg-gradient-to-br from-rose-100 to-rose-200' :
                        'bg-gradient-to-br from-amber-100 to-amber-200'
                      }`}>
                        <FileText className={
                          receipt.template === 'professional' ? 'text-blue-600' :
                          receipt.template === 'modern' ? 'text-green-600' :
                          receipt.template === 'elegant' ? 'text-rose-600' :
                          'text-amber-600'
                        } size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{receipt.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <ReceiptIcon size={14} className="mr-1.5" />
                            {receipt.receiptNumber}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Store size={14} className="mr-1.5" />
                            {receipt.storeName}
                          </span>
                          <span>•</span>
                          <span>{receipt.itemsCount} items</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
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

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-xl">{formatNaira(receipt.total)}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(receipt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handlePrintReceipt(receipt)}
                          className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Print"
                        >
                          <Printer size={20} />
                        </button>
                        <button
                          onClick={() => handleDownloadReceipt(receipt)}
                          className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                          title="Download"
                        >
                          <Download size={20} />
                        </button>
                        <button
                          onClick={() => toggleExpand(receipt.id)}
                          className="p-2.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                          title="View Details"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => deleteSavedReceipt(receipt.id)}
                          className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded View */}
                {expandedReceipt === receipt.id && receipt.data && (
                  <div className="px-4 sm:px-6 pb-4 lg:pl-24 lg:pr-6">
                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                              <Tag size={16} className="mr-2 text-blue-600" />
                              Items Summary
                            </h5>
                            <div className="space-y-2">
                              {receipt.data.items?.slice(0, 5).map((item, index) => (
                                <div key={index} className="flex justify-between text-sm py-1.5 border-b border-gray-100 last:border-b-0">
                                  <div>
                                    <span className="text-gray-800 font-medium">{item.quantity}x</span>
                                    <span className="text-gray-600 ml-2">{item.name}</span>
                                  </div>
                                  <span className="font-bold text-gray-900">{formatNaira(item.price * item.quantity)}</span>
                                </div>
                              ))}
                              {receipt.data.items?.length > 5 && (
                                <div className="text-center text-xs text-gray-500 pt-2">
                                  +{receipt.data.items.length - 5} more items
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                              <Users size={16} className="mr-2 text-green-600" />
                              Customer Info
                            </h5>
                            <div className="space-y-3">
                              {receipt.data.customerName ? (
                                <div className="text-sm">
                                  <div className="text-gray-800 font-medium">{receipt.data.customerName}</div>
                                  {receipt.data.customerPhone && (
                                    <div className="text-gray-600 mt-1 flex items-center">
                                      <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                                        📞
                                      </span>
                                      {receipt.data.customerPhone}
                                    </div>
                                  )}
                                  {receipt.data.customerAddress && (
                                    <div className="text-gray-600 mt-1 text-xs">
                                      {receipt.data.customerAddress}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 italic">No customer information</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                              <CreditCard size={16} className="mr-2 text-purple-600" />
                              Payment Details
                            </h5>
                            <div className="space-y-3">
                              <div className="text-sm">
                                <div className="text-gray-800 font-medium mb-1">Method: {receipt.data.paymentMethod}</div>
                                {receipt.data.amountPaid > 0 && (
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-gray-600">Amount Paid:</span>
                                    <span className="font-bold text-green-600">{formatNaira(receipt.data.amountPaid)}</span>
                                  </div>
                                )}
                                {receipt.data.amountPaid > 0 && receipt.data.paymentMethod === 'Cash' && (
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-gray-600">Change:</span>
                                    <span className="font-bold text-blue-600">
                                      {formatNaira((receipt.data.amountPaid || 0) - receipt.total)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="pt-3 border-t border-gray-100">
                                <div className="text-xs text-gray-500">
                                  Generated on {new Date(receipt.date).toLocaleDateString()} at{' '}
                                  {new Date(receipt.date).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {filteredReceipts.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No receipts found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              No receipts match your search criteria. Try a different search term or filter.
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {filteredReceipts.length > 0 && (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredReceipts.length}</span> receipts •{' '}
              <span className="font-bold text-blue-600">{formatNaira(totalValue)}</span> total value
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                ↑ Back to top
              </button>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear all history
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Clear All History?</h3>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-red-700">
                This will permanently delete all <span className="font-bold">{savedReceipts.length}</span> saved receipts 
                with a total value of <span className="font-bold">{formatNaira(totalValue)}</span>.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearHistory();
                  setShowClearConfirm(false);
                }}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-medium shadow-lg transition-all"
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