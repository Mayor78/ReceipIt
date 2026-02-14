// pages/ReceiptHistory.jsx
import React, { useState, useMemo } from 'react';
import { useReceipt } from '../context/ReceiptContext';
import { 
  BarChart3, 
  CheckCircle, 
  Database, 
  Zap, 
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

// Import child components
import HistoryHeader from './ReceiptHistory/HistoryHeader';
import HistoryFilters from './ReceiptHistory/HistoryFilters';
import HistoryList from './ReceiptHistory/HistoryList';
import ExportModal from './ReceiptHistory/ExportModal';
import EmptyHistory from './ReceiptHistory/EmptyHistory';
import ClearConfirm from './ReceiptHistory/ClearComfirm';
import QuickStats from './ReceiptHistory/QuickStats';
import ReceiptShareModal from './ReceiptHistory/ReceiptShareModal';
import BulkActionsBar from './ReceiptHistory/BulkActionsBar';
import ReceiptPreviewModal from './ReceiptHistory/ReceiptPreviewModal';
import SmartSearch from './ReceiptHistory/SmartSearch';

const ReceiptHistory = () => {
  const { 
    savedReceipts, 
    deleteSavedReceipt, 
    clearHistory,
    formatNaira,
    getReceiptPdf 
  } = useReceipt();
  
  // Core state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showQuickStats, setShowQuickStats] = useState(true);
  
  // New features state
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [sortBy, setSortBy] = useState('date-desc'); 
  const [favorites, setFavorites] = useState([]);
  const [smartSearchMode, setSmartSearchMode] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Logic: Load favorites
  React.useEffect(() => {
    const savedFavorites = localStorage.getItem('receipt_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Logic: Toggle favorites
  const toggleFavorite = (receiptId) => {
    const newFavorites = favorites.includes(receiptId)
      ? favorites.filter(id => id !== receiptId)
      : [...favorites, receiptId];
    
    setFavorites(newFavorites);
    localStorage.setItem('receipt_favorites', JSON.stringify(newFavorites));
    
    Swal.fire({
      title: newFavorites.includes(receiptId) ? '⭐ Saved to Vault' : 'Removed from Vault',
      background: '#161b22',
      color: '#fff',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      position: 'bottom-end',
      toast: true
    });
  };

  // Logic: Stats Calculation
  const stats = useMemo(() => {
    if (savedReceipts.length === 0) return null;
    const total = savedReceipts.reduce((sum, r) => sum + r.total, 0);
    const avg = total / savedReceipts.length;
    const thisMonth = savedReceipts.filter(r => {
      const date = new Date(r.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    const monthlyTotal = thisMonth.reduce((sum, r) => sum + r.total, 0);
    
    return {
      totalReceipts: savedReceipts.length,
      totalAmount: total,
      averageAmount: avg,
      monthlyCount: thisMonth.length,
      monthlyTotal: monthlyTotal,
      largestReceipt: Math.max(...savedReceipts.map(r => r.total)),
      storeCount: new Set(savedReceipts.map(r => r.storeName)).size
    };
  }, [savedReceipts]);

  // Logic: Filtering & Sorting
  const filteredReceipts = useMemo(() => {
    let filtered = [...savedReceipts];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.receiptNumber?.toLowerCase().includes(term) ||
        r.storeName?.toLowerCase().includes(term) ||
        r.name?.toLowerCase().includes(term) ||
        r.data?.customerName?.toLowerCase().includes(term)
      );
    }
    switch(selectedFilter) {
      case 'today': filtered = filtered.filter(r => new Date(r.date).toDateString() === new Date().toDateString()); break;
      case 'week':
        const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(r => new Date(r.date) >= weekAgo); break;
      case 'month':
        const monthAgo = new Date(); monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(r => new Date(r.date) >= monthAgo); break;
      case 'favorites': filtered = filtered.filter(r => favorites.includes(r.id)); break;
      case 'large': filtered = filtered.filter(r => r.total > 10000); break;
      default: break;
    }
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(r => {
        const date = new Date(r.date);
        return date >= dateRange.start && date <= dateRange.end;
      });
    }
    switch(sortBy) {
      case 'date-desc': filtered.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
      case 'date-asc': filtered.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case 'amount-desc': filtered.sort((a, b) => b.total - a.total); break;
      case 'amount-asc': filtered.sort((a, b) => a.total - b.total); break;
      default: break;
    }
    return filtered;
  }, [savedReceipts, searchTerm, selectedFilter, dateRange, sortBy, favorites]);

  // Logic: Quick Actions Switch
  const handleQuickActions = async (receipt, action) => {
    switch(action) {
      case 'share': setCurrentReceipt(receipt); setShowShareModal(true); break;
      case 'email':
        window.location.href = `mailto:?subject=Receipt ${receipt.receiptNumber}&body=Total: ${formatNaira(receipt.total)}`; break;
      case 'whatsapp':
        const text = `*Receipt:* ${receipt.receiptNumber}\n*Total:* ${formatNaira(receipt.total)}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'); break;
      case 'download-pdf':
        try {
          const pdf = await getReceiptPdf(receipt);
          pdf.save(`receipt-${receipt.receiptNumber}.pdf`);
        } catch (e) { Swal.fire('Error', 'PDF Generation Failed', 'error'); } break;
      case 'print':
        try {
          const pdf = await getReceiptPdf(receipt);
          const url = URL.createObjectURL(pdf.output('blob'));
          window.open(url).print();
        } catch (e) { Swal.fire('Error', 'Print Failed', 'error'); } break;
      case 'delete':
        const result = await Swal.fire({
          title: 'Purge Record?',
          text: 'This data will be permanently removed.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          background: '#161b22',
          color: '#fff'
        });
        if (result.isConfirmed) deleteSavedReceipt(receipt.id); break;
      default: break;
    }
  };

  // Logic: Bulk Actions
  const handleBulkAction = async (action) => {
    if (selectedReceipts.length === 0) return;
    if (action === 'delete') {
      const confirm = await Swal.fire({ title: `Purge ${selectedReceipts.length} items?`, icon: 'warning', showCancelButton: true, background: '#161b22', color: '#fff' });
      if (confirm.isConfirmed) {
        selectedReceipts.forEach(id => deleteSavedReceipt(id));
        setSelectedReceipts([]);
        setBulkMode(false);
      }
    } else if (action === 'export') {
      const csv = generateCSV(selectedReceipts);
      saveAs(new Blob([csv], { type: 'text/csv' }), `bulk-export-${Date.now()}.csv`);
    }
  };

  // Logic: CSV Generator
  const generateCSV = (receiptIds) => {
    const headers = ['Number', 'Store', 'Date', 'Total'];
    const rows = receiptIds.map(id => {
      const r = savedReceipts.find(r => r.id === id);
      return [r.receiptNumber, r.storeName, new Date(r.date).toLocaleDateString(), r.total];
    });
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term && !recentSearches.includes(term)) {
      const newSearches = [term, ...recentSearches.slice(0, 4)];
      setRecentSearches(newSearches);
      localStorage.setItem('recent_searches', JSON.stringify(newSearches));
    }
  };

  if (savedReceipts.length === 0) return <EmptyHistory />;

  return (
    <div className="bg-[#161b22] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[600px]">
      
      {/* Top Console Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-white/5 bg-white/[0.02] gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/5">
            <Database size={22} className="text-blue-500" />
          </div>
          <HistoryHeader 
            savedReceipts={savedReceipts}
            onClearHistory={() => setShowClearConfirm(true)}
            onExportHistory={() => setShowExportModal(true)}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        </div>
        
        <div className="flex items-center gap-3 bg-[#0d1117] p-1.5 rounded-2xl border border-white/5">
          <button
            onClick={() => setShowQuickStats(!showQuickStats)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              showQuickStats ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 size={14} />
            <span className="hidden sm:inline">Analytics</span>
          </button>
          
          <button
            onClick={() => setBulkMode(!bulkMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              bulkMode ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckCircle size={14} />
            <span className="hidden sm:inline">Bulk Edit</span>
          </button>
        </div>
      </div>

      {/* Analytics Panel */}
      {showQuickStats && stats && (
        <div className="border-b border-white/5 animate-fade-in">
          <QuickStats 
            stats={stats} 
            formatNaira={formatNaira}
            onDateRangeChange={setDateRange}
          />
        </div>
      )}

      {/* Control Surface */}
      <div className="p-6 space-y-6 bg-[#0d1117]/30">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-end">
          <div className="xl:col-span-8">
            <SmartSearch
              searchTerm={searchTerm}
              onSearch={handleSearch}
              recentSearches={recentSearches}
              onClearSearch={() => setSearchTerm('')}
              onToggleSmartMode={() => setSmartSearchMode(!smartSearchMode)}
              smartMode={smartSearchMode}
            />
          </div>
          <div className="xl:col-span-4 flex justify-end">
             <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/5 border border-blue-500/10 rounded-xl">
               <ShieldCheck size={14} className="text-blue-500" />
               <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">End-to-End Encrypted Archive</span>
             </div>
          </div>
        </div>

        <HistoryFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onDateRangeChange={setDateRange}
          dateRange={dateRange}
          totalCount={filteredReceipts.length}
          totalAmount={filteredReceipts.reduce((sum, r) => sum + r.total, 0)}
          formatNaira={formatNaira}
        />
      </div>

      {/* Bulk Controller */}
      {bulkMode && (
        <div className="px-6 py-3 bg-emerald-500/5 border-y border-emerald-500/10 animate-slide-up">
          <BulkActionsBar
            selectedCount={selectedReceipts.length}
            totalCount={filteredReceipts.length}
            onSelectAll={() => setSelectedReceipts(filteredReceipts.map(r => r.id))}
            onClearSelection={() => setSelectedReceipts([])}
            onBulkAction={handleBulkAction}
          />
        </div>
      )}

      {/* Main List Display */}
      <div className="p-6 pt-0 min-h-[400px]">
        <HistoryList
          receipts={filteredReceipts}
          searchTerm={searchTerm}
          selectedFilter={selectedFilter}
          bulkMode={bulkMode}
          selectedReceipts={selectedReceipts}
          onSelectReceipt={(id) => {
            setSelectedReceipts(prev =>
              prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
            );
          }}
          onQuickAction={handleQuickActions}
          onPreview={(receipt) => {
            setCurrentReceipt(receipt);
            setShowPreviewModal(true);
          }}
          onToggleFavorite={toggleFavorite}
          favorites={favorites}
          formatNaira={formatNaira}
        />
      </div>

      {/* Modals Bridge */}
      {showClearConfirm && (
        <ClearConfirm
          onClose={() => setShowClearConfirm(false)}
          onConfirm={() => { clearHistory(); setShowClearConfirm(false); }}
        />
      )}

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          receipts={savedReceipts}
          formatNaira={formatNaira}
          onExport={(format) => {
            if (format === 'csv') {
              const csv = generateCSV(savedReceipts.map(r => r.id));
              saveAs(new Blob([csv], { type: 'text/csv' }), `archive-dump-${Date.now()}.csv`);
            }
            setShowExportModal(false);
          }}
        />
      )}

      {showShareModal && currentReceipt && (
        <ReceiptShareModal
          receipt={currentReceipt}
          onClose={() => setShowShareModal(false)}
          formatNaira={formatNaira}
          onShare={(method) => { handleQuickActions(currentReceipt, method); setShowShareModal(false); }}
        />
      )}

      {showPreviewModal && currentReceipt && (
        <ReceiptPreviewModal
          receipt={currentReceipt}
          onClose={() => setShowPreviewModal(false)}
          onAction={(action) => handleQuickActions(currentReceipt, action)}
          formatNaira={formatNaira}
        />
      )}
    </div>
  );
};

export default ReceiptHistory;