// components/ReceiptHistory/ReceiptShareModal.jsx
import React from 'react';
import { 
  X, Mail, MessageSquare, Download, Printer, 
  QrCode, Share2, Facebook, Twitter, Link2,
  ShieldCheck, Radio, Send
} from 'lucide-react';
import Swal from 'sweetalert2';

const ReceiptShareModal = ({ receipt, onClose, formatNaira, onShare }) => {
  const shareOptions = [
    { id: 'email', name: 'Protocol_Mail', icon: Mail, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
    { id: 'whatsapp', name: 'Direct_Comms', icon: MessageSquare, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
    { id: 'download-pdf', name: 'Export_Data', icon: Download, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
    { id: 'print', name: 'Physical_Log', icon: Printer, color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10' },
    { id: 'copy', name: 'URL_Mirror', icon: Link2, color: 'text-slate-400', border: 'border-slate-500/30', bg: 'bg-slate-500/10' },
    { id: 'qr', name: 'Node_Scan', icon: QrCode, color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10' },
    { id: 'facebook', name: 'Public_Net_F', icon: Facebook, color: 'text-blue-600', border: 'border-blue-600/30', bg: 'bg-blue-600/10' },
    { id: 'twitter', name: 'Public_Net_X', icon: Twitter, color: 'text-sky-400', border: 'border-sky-400/30', bg: 'bg-sky-400/10' }
  ];

  const handleCopyLink = async () => {
    const verificationHash = receipt.verificationInfo?.receiptHash || '';
    const url = `${window.location.origin}/verify?hash=${verificationHash}`;
    
    await navigator.clipboard.writeText(url);
    Swal.fire({
      title: 'LINK_COPIED',
      text: 'Transmission address secured',
      icon: 'success',
      background: '#161b22',
      color: '#fff',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'bottom-end'
    });
  };

  const handleShare = (method) => {
    method === 'copy' ? handleCopyLink() : onShare(method);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Heavy Backdrop */}
      <div className="fixed inset-0 bg-[#0d1117]/95 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#161b22] border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header HUD */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400 animate-pulse">
              <Radio size={24} />
            </div>
            <div>
              <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Transmission_Hub</h2>
              <p className="text-[10px] font-mono text-slate-500 mt-1">
                REF_{receipt.receiptNumber} // VAL_{formatNaira(receipt.total)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Selected Receipt Context */}
        <div className="px-8 py-4 bg-black/20 flex items-center gap-4">
            <div className="flex-1 py-1 px-3 border-l-2 border-blue-500">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected_Source</p>
                <p className="text-sm font-bold text-slate-200">{receipt.storeName}</p>
            </div>
            <Send size={16} className="text-slate-700" />
        </div>

        {/* Transmission Grid */}
        <div className="p-8">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            Select_Outbound_Node
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {shareOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleShare(option.id)}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className={`w-14 h-14 ${option.bg} border ${option.border} rounded-2xl flex items-center justify-center ${option.color} transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] group-active:scale-90`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter text-center leading-none opacity-60 group-hover:opacity-100 transition-opacity">
                    {option.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Verification Logic HUD */}
        {receipt.verificationInfo?.receiptHash && (
          <div className="mx-8 mb-8 p-5 bg-blue-500/5 border border-blue-500/20 rounded-[1.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <ShieldCheck size={40} className="text-blue-400" />
            </div>
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <QrCode size={14} /> Cryptographic_Integrity
            </h4>
            <p className="text-[9px] font-mono text-blue-300/40 break-all mb-4">
              HASH_SIGNATURE: {receipt.verificationInfo.receiptHash}
            </p>
            <button
              onClick={() => handleShare('qr')}
              className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
            >
              Request_QR_Validation
            </button>
          </div>
        )}

        {/* Global Footer */}
        <div className="p-6 border-t border-white/5 bg-black/40">
          <button
            onClick={onClose}
            className="w-full text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-colors"
          >
            Terminal_Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptShareModal;