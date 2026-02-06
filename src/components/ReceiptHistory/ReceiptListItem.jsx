import React from 'react';
import { 
  Download, 
  Eye, 
  Trash2, 
  FileText,
  Receipt as ReceiptIcon,
  Printer,
  ChevronDown,
  ChevronUp,
  Store,
  Tag,
  Users,
  CreditCard
} from 'lucide-react';
import { useReceipt } from '../../context/ReceiptContext';

const ReceiptListItem = ({ receipt, isExpanded, onToggleExpand }) => {
  const { deleteSavedReceipt, formatNaira } = useReceipt();

  const handleDownloadReceipt = () => {
    if (receipt.pdfBlobUrl) {
      const link = document.createElement('a');
      link.href = receipt.pdfBlobUrl;
      link.download = `${receipt.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrintReceipt = () => {
    if (receipt.pdfBlobUrl) {
      const printWindow = window.open(receipt.pdfBlobUrl, '_blank');
      printWindow?.addEventListener('load', function() {
        printWindow.print();
      });
    }
  };

  return (
    <div className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
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
              onClick={onToggleExpand}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {isExpanded ? (
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
                onClick={handlePrintReceipt}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Print"
              >
                <Printer size={18} />
              </button>
              <button
                onClick={handleDownloadReceipt}
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
                onClick={handlePrintReceipt}
                className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Print"
              >
                <Printer size={20} />
              </button>
              <button
                onClick={handleDownloadReceipt}
                className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                title="Download"
              >
                <Download size={20} />
              </button>
              <button
                onClick={onToggleExpand}
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
      {isExpanded && receipt.data && (
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
  );
};

export default ReceiptListItem;