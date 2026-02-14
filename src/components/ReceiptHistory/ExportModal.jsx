// components/ReceiptHistory/ExportModal.jsx
import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, FileJson, Check, Database, Cpu, Calendar } from 'lucide-react';
import { useReceipt } from '../../context/ReceiptContext';

const ExportModal = ({ onClose }) => {
  const { savedReceipts, formatNaira } = useReceipt();
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // LOGIC PRESERVED: Handle Export
  const handleExport = () => {
    setIsExporting(true);
    let filteredReceipts = [...savedReceipts];
    
    if (dateRange !== 'all') {
      const now = new Date();
      const days = parseInt(dateRange);
      filteredReceipts = filteredReceipts.filter(receipt => {
        const receiptDate = new Date(receipt.date);
        const diffDays = Math.ceil(Math.abs(now - receiptDate) / (1000 * 60 * 60 * 24));
        return diffDays <= days;
      });
    }

    let exportData;
    let filename;
    let mimeType;

    switch (exportFormat) {
      case 'csv':
      case 'excel':
        exportData = generateCSV(filteredReceipts, includeDetails);
        filename = `receipt_dump_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv;charset=utf-8;';
        break;
      case 'json':
        exportData = generateJSON(filteredReceipts, includeDetails);
        filename = `receipt_backup_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;
      case 'pdf':
        exportPDFZIP(filteredReceipts);
        finalizeExport();
        return;
      default: break;
    }

    const blob = new Blob([exportData], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    finalizeExport();
  };

  const finalizeExport = () => {
    setIsExporting(false);
    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
      onClose();
    }, 2000);
  };

  // LOGIC PRESERVED: Data Generators
  const generateCSV = (receipts, includeDetails) => {
    const headers = ['Receipt No', 'Name', 'Store', 'Date', 'Time', 'Total', 'Items Count', 'Payment'];
    if (includeDetails) headers.push('Details', 'Notes');
    
    const rows = receipts.map(r => {
      const row = [r.receiptNumber, r.name, r.storeName, new Date(r.date).toLocaleDateString(), new Date(r.date).toLocaleTimeString(), formatNaira(r.total), r.itemsCount, r.data?.paymentMethod || ''];
      if (includeDetails) {
        const details = r.data?.items?.map(i => `${i.quantity}x ${i.name}`).join('; ') || '';
        row.push(`"${details}"`, `"${r.data?.customerNotes || ''}"`);
      }
      return row.map(cell => `"${cell}"`).join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  };

  const generateJSON = (receipts, includeDetails) => {
    const data = receipts.map(r => ({ ...r, data: includeDetails ? r.data : undefined }));
    return JSON.stringify(data, null, 2);
  };

  const exportPDFZIP = async (receipts) => {
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
      }, index * 150);
    });
  };

  const exportOptions = [
    { id: 'csv', name: 'CSV Engine', desc: 'Standard spreadsheet format', icon: FileSpreadsheet, color: 'text-emerald-500', glow: 'shadow-emerald-500/10' },
    { id: 'excel', name: 'Excel Pro', desc: 'Optimized for MS Excel', icon: Database, color: 'text-blue-500', glow: 'shadow-blue-500/10' },
    { id: 'json', name: 'JSON Backup', desc: 'Raw developer-ready data', icon: FileJson, color: 'text-purple-500', glow: 'shadow-purple-500/10' },
    { id: 'pdf', name: 'PDF Bundle', desc: 'Individual visual records', icon: FileText, color: 'text-red-500', glow: 'shadow-red-500/10' }
  ];

  return (
    <div className="fixed inset-0 bg-[#0d1117]/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-[#161b22] border border-white/10 rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/5">
              <Cpu className="text-blue-500" size={28} />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">Data.Export_Module</h3>
              <h2 className="text-2xl font-bold text-white tracking-tight">Export History</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-white border border-transparent hover:border-white/10">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Format Selection */}
          <section>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Database size={12} /> Output Protocol
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exportOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setExportFormat(opt.id)}
                  className={`relative p-5 rounded-2xl border transition-all text-left group overflow-hidden ${
                    exportFormat === opt.id 
                    ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                    : 'bg-[#0d1117] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/5 ${opt.color}`}>
                      <opt.icon size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm tracking-tight">{opt.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">{opt.desc}</div>
                    </div>
                  </div>
                  {exportFormat === opt.id && (
                    <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Calendar size={12} /> Temporal Range
              </h4>
              <div className="flex flex-wrap gap-2">
                {['all', '7', '30', '90'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      dateRange === range 
                      ? 'bg-white text-black shadow-lg shadow-white/10' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {range === 'all' ? 'Full Archive' : `Last ${range}D`}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Check size={12} /> Detail Level
              </h4>
              <label className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/5 transition-all">
                <input
                  type="checkbox"
                  checked={includeDetails}
                  onChange={(e) => setIncludeDetails(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-white/10 bg-black text-blue-600 focus:ring-offset-0 focus:ring-blue-500"
                />
                <div>
                  <div className="text-[11px] font-black text-white uppercase tracking-wider">Extended Metadata</div>
                  <div className="text-[10px] text-slate-500 uppercase mt-0.5">Include item lists & notes</div>
                </div>
              </label>
            </section>
          </div>

          {/* Summary Box */}
          <div className="bg-[#0d1117] rounded-[1.5rem] p-6 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
              {[
                { label: 'Payload', val: exportFormat.toUpperCase() },
                { label: 'Records', val: savedReceipts.length },
                { label: 'Range', val: dateRange === 'all' ? 'Infinite' : `${dateRange} Days` },
                { label: 'Status', val: 'Ready' }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-xs font-bold text-white">{stat.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">Terminal Ready for Stream</span>
          </div>
          
          <div className="flex gap-4 w-full sm:w-auto">
            <button onClick={onClose} className="flex-1 sm:flex-none px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 hover:bg-blue-500 disabled:opacity-50 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              {isExporting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Streaming...
                </>
              ) : exportSuccess ? (
                <>
                  <Check size={14} />
                  Complete
                </>
              ) : (
                <>
                  <Download size={14} />
                  Initiate Export
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