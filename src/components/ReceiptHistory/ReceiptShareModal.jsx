import React from 'react';
import { 
  X, Mail, MessageSquare, Download, Printer, Copy, 
  QrCode, Share2, Facebook, Twitter, Linkedin, Link2 
} from 'lucide-react';
import Swal from 'sweetalert2';

const ReceiptShareModal = ({ receipt, onClose, formatNaira, onShare }) => {
  const shareOptions = [
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-blue-500',
      hover: 'hover:bg-blue-600'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'bg-green-500',
      hover: 'hover:bg-green-600'
    },
    {
      id: 'download-pdf',
      name: 'Download PDF',
      icon: Download,
      color: 'bg-purple-500',
      hover: 'hover:bg-purple-600'
    },
    {
      id: 'print',
      name: 'Print',
      icon: Printer,
      color: 'bg-orange-500',
      hover: 'hover:bg-orange-600'
    },
    {
      id: 'copy',
      name: 'Copy Link',
      icon: Link2,
      color: 'bg-gray-500',
      hover: 'hover:bg-gray-600'
    },
    {
      id: 'qr',
      name: 'QR Code',
      icon: QrCode,
      color: 'bg-indigo-500',
      hover: 'hover:bg-indigo-600'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-700',
      hover: 'hover:bg-blue-800'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500',
      hover: 'hover:bg-sky-600'
    }
  ];

  const handleCopyLink = async () => {
    const verificationHash = receipt.verificationInfo?.receiptHash || '';
    const url = `${window.location.origin}/verify?hash=${verificationHash}`;
    
    await navigator.clipboard.writeText(url);
    Swal.fire({
      title: '✅ Copied!',
      text: 'Verification link copied to clipboard',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'bottom-end'
    });
  };

  const handleShare = (method) => {
    if (method === 'copy') {
      handleCopyLink();
    } else {
      onShare(method);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Share Receipt</h2>
              <p className="text-sm text-gray-500 mt-1">
                {receipt.receiptNumber} • {formatNaira(receipt.total)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Receipt Preview */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Share2 size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{receipt.storeName}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(receipt.date).toLocaleString()} • {receipt.itemsCount} items
                </p>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Share via</h3>
            <div className="grid grid-cols-4 gap-3">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleShare(option.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-xs text-gray-600">{option.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verification Info */}
          {receipt.verificationInfo?.receiptHash && (
            <div className="p-6 bg-blue-50 border-t">
              <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                <QrCode size={16} />
                Verification Available
              </h4>
              <p className="text-xs text-blue-600 break-all mb-3">
                Hash: {receipt.verificationInfo.receiptHash}
              </p>
              <button
                onClick={() => handleShare('qr')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Show QR Code
              </button>
            </div>
          )}

          {/* Close Button */}
          <div className="p-6 border-t">
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptShareModal;