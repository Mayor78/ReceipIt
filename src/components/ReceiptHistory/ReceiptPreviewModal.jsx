// components/ReceiptHistory/ReceiptPreviewModal.jsx
import React from 'react';
import { 
  X, Download, Printer, Share2, Trash2, 
  Mail, MessageSquare, Copy, QrCode, ShieldCheck, 
  Cpu, Activity, Globe, Database
} from 'lucide-react';
import Swal from 'sweetalert2';

const ReceiptPreviewModal = ({ receipt, onClose, onAction, formatNaira }) => {
  const handleCopyReceiptNumber = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(receipt.receiptNumber);
    Swal.fire({
      title: 'DATA COPIED',
      text: 'Receipt reference stored to clipboard',
      icon: 'success',
      background: '#161b22',
      color: '#fff',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'bottom-end'
    });
  };

  const quickActions = [
    { id: 'download-pdf', icon: Download, label: 'Export PDF', color: 'text-blue-400', bg: 'hover:bg-blue-500/10 border-blue-500/20' },
    { id: 'print', icon: Printer, label: 'Hard Copy', color: 'text-orange-400', bg: 'hover:bg-orange-500/10 border-orange-500/20' },
    { id: 'share', icon: Share2, label: 'Uplink', color: 'text-purple-400', bg: 'hover:bg-purple-500/10 border-purple-500/20' },
    { id: 'email', icon: Mail, label: 'Protocol', color: 'text-emerald-400', bg: 'hover:bg-emerald-500/10 border-emerald-500/20' },
    { id: 'whatsapp', icon: MessageSquare, label: 'Direct', color: 'text-green-400', bg: 'hover:bg-green-500/10 border-green-500/20' },
    { id: 'qr', icon: QrCode, label: 'Scan Code', color: 'text-indigo-400', bg: 'hover:bg-indigo-500/10 border-indigo-500/20' },
    { id: 'copy', icon: Copy, label: 'Duplicate', color: 'text-slate-400', bg: 'hover:bg-slate-500/10 border-slate-500/20' },
    { id: 'delete', icon: Trash2, label: 'Purge', color: 'text-red-400', bg: 'hover:bg-red-500/10 border-red-500/20' }
  ];

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop with Heavy Blur */}
      <div className="fixed inset-0 bg-[#0d1117]/90 backdrop-blur-xl transition-opacity" onClick={onClose} />
      
      <div className="relative bg-[#161b22] border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header HUD */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-500/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
              <Cpu className="text-blue-400" size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">File_Decryption_Viewer</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-mono text-slate-500">{receipt.receiptNumber}</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Action Grid HUD */}
        <div className="p-6 bg-black/20 border-b border-white/5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => onAction(action.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 border rounded-xl transition-all group ${action.bg}`}
                >
                  <Icon size={14} className={`${action.color} group-hover:scale-110 transition-transform`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${action.color}`}>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          
          {/* Brand Identity */}
          <div className="text-center relative py-4">
             <div className="absolute inset-0 flex items-center justify-center opacity-5">
                <Globe size={120} />
             </div>
             <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{receipt.storeName}</h3>
             <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-2">{receipt.storeAddress || 'Main Node Address'}</p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <DataField label="Registry_ID" value={receipt.receiptNumber} canCopy onCopy={handleCopyReceiptNumber} />
            <DataField label="Timestamp" value={new Date(receipt.date).toLocaleString()} />
            <DataField label="Template_Ref" value={receipt.template || 'Modern'} />
            <DataField label="Entity_Count" value={`${receipt.itemsCount} Items`} />
          </div>

          {/* Items Log */}
          <div className="bg-black/40 border border-white/5 rounded-[2rem] p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <Database size={14} className="text-blue-500" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry_Log</h4>
            </div>
            <div className="space-y-4">
              {receipt.data?.items?.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <div>
                    <p className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{item.name}</p>
                    <p className="text-[9px] font-mono text-slate-500">{item.quantity} units @ {formatNaira(item.price)}</p>
                  </div>
                  <p className="font-mono text-xs font-bold text-white">{formatNaira(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals HUD */}
          <div className="bg-blue-600 rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(37,99,235,0.2)]">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-blue-100 uppercase tracking-[0.2em]">Gross_Amount</p>
                <p className="text-3xl font-black text-white tracking-tighter mt-1">{formatNaira(receipt.total)}</p>
              </div>
              <Activity className="text-blue-300 opacity-50" size={32} />
            </div>
          </div>

          {/* Verification Protocol */}
          {receipt.verificationInfo?.receiptHash && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Integrity_Verified</span>
              </div>
              <p className="text-[9px] font-mono text-emerald-500/60 break-all leading-relaxed">
                HASH::{receipt.verificationInfo.receiptHash}
              </p>
            </div>
          )}
        </div>

        {/* Footer HUD */}
        <div className="p-6 border-t border-white/5 bg-black/40 flex gap-3">
          <button
            onClick={() => onAction('download-pdf')}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            Execute_Export
          </button>
          <button
            onClick={() => onAction('share')}
            className="px-8 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl border border-white/10 transition-all active:scale-95"
          >
            Uplink
          </button>
        </div>
      </div>
    </div>
  );
};

const DataField = ({ label, value, canCopy, onCopy }) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-center justify-between">
      <p className="text-xs font-bold text-slate-200 truncate">{value}</p>
      {canCopy && (
        <button onClick={onCopy} className="text-blue-500 hover:text-blue-400 transition-colors ml-2">
          <Copy size={12} />
        </button>
      )}
    </div>
  </div>
);

export default ReceiptPreviewModal;