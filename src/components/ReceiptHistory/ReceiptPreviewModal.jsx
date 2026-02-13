import React from 'react';
import { 
  X, Download, Printer, Share2, Trash2, 
  Star, Mail, MessageSquare, Copy, QrCode 
} from 'lucide-react';
import Swal from 'sweetalert2';

const ReceiptPreviewModal = ({ receipt, onClose, onAction, formatNaira }) => {
  const handleCopyReceiptNumber = () => {
    navigator.clipboard.writeText(receipt.receiptNumber);
    Swal.fire({
      title: '✅ Copied!',
      text: 'Receipt number copied',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'bottom-end'
    });
  };

  const quickActions = [
    {
      id: 'download-pdf',
      icon: Download,
      label: 'Download',
      color: 'text-blue-600',
      bg: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      id: 'print',
      icon: Printer,
      label: 'Print',
      color: 'text-orange-600',
      bg: 'bg-orange-50 hover:bg-orange-100'
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      color: 'text-purple-600',
      bg: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      color: 'text-green-600',
      bg: 'bg-green-50 hover:bg-green-100'
    },
    {
      id: 'whatsapp',
      icon: MessageSquare,
      label: 'WhatsApp',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 hover:bg-emerald-100'
    },
    {
      id: 'qr',
      icon: QrCode,
      label: 'QR Code',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 hover:bg-indigo-100'
    },
    {
      id: 'copy',
      icon: Copy,
      label: 'Copy',
      color: 'text-gray-600',
      bg: 'bg-gray-50 hover:bg-gray-100'
    },
    {
      id: 'delete',
      icon: Trash2,
      label: 'Delete',
      color: 'text-red-600',
      bg: 'bg-red-50 hover:bg-red-100'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="sticky top-0 bg-white border-b z-10 p-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Receipt Preview</h2>
              <p className="text-sm text-gray-500 mt-1">{receipt.receiptNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => onAction(action.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${action.bg} ${action.color}`}
                  >
                    <Icon size={16} />
                    <span className="text-sm">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Receipt Preview */}
          <div className="p-6">
            {/* Store Info */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{receipt.storeName}</h3>
              <p className="text-gray-600">{receipt.storeAddress || 'Store Address'}</p>
            </div>

            {/* Receipt Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Receipt Number</p>
                  <p className="font-medium flex items-center gap-2">
                    {receipt.receiptNumber}
                    <button
                      onClick={handleCopyReceiptNumber}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Copy size={14} />
                    </button>
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{new Date(receipt.date).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Items</p>
                  <p className="font-medium">{receipt.itemsCount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Template</p>
                  <p className="font-medium capitalize">{receipt.template || 'Modern'}</p>
                </div>
              </div>
            </div>

            {/* Items List */}
            {receipt.data?.items && receipt.data.items.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
                <div className="space-y-2">
                  {receipt.data.items.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} x {formatNaira(item.price)}</p>
                      </div>
                      <p className="font-semibold">{formatNaira(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  {receipt.data.items.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{receipt.data.items.length - 5} more items
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatNaira(receipt.total)}
                </span>
              </div>
            </div>

            {/* Verification Info */}
            {receipt.verificationInfo?.receiptHash && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode size={16} className="text-green-600" />
                  <span className="font-medium text-green-800">Verified Receipt</span>
                </div>
                <p className="text-xs text-green-700 break-all">
                  Hash: {receipt.verificationInfo.receiptHash}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t p-4">
            <div className="flex gap-3">
              <button
                onClick={() => onAction('download-pdf')}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </button>
              <button
                onClick={() => onAction('share')}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreviewModal;