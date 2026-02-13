import React, { useState, useMemo } from 'react';
import { useReceipt } from '../context/ReceiptContext';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Share2, 
  Printer,
  BarChart3,
  Calendar,
  Tag,
  TrendingUp,
  Clock,
  Archive,
  Star,
  FileText,
  Copy,
  QrCode,
  Mail,
  MessageSquare,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Eye,
  DownloadCloud
} from 'lucide-react';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc
  const [favorites, setFavorites] = useState([]);
  const [smartSearchMode, setSmartSearchMode] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load favorites from localStorage
  React.useEffect(() => {
    const savedFavorites = localStorage.getItem('receipt_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (receiptId) => {
    const newFavorites = favorites.includes(receiptId)
      ? favorites.filter(id => id !== receiptId)
      : [...favorites, receiptId];
    
    setFavorites(newFavorites);
    localStorage.setItem('receipt_favorites', JSON.stringify(newFavorites));
    
    Swal.fire({
      title: newFavorites.includes(receiptId) ? '⭐ Added to Favorites' : '⭐ Removed from Favorites',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      position: 'bottom-end',
      toast: true
    });
  };

  // Calculate quick stats
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

  // Filter and sort receipts
  const filteredReceipts = useMemo(() => {
    let filtered = [...savedReceipts];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.receiptNumber?.toLowerCase().includes(term) ||
        r.storeName?.toLowerCase().includes(term) ||
        r.name?.toLowerCase().includes(term) ||
        r.data?.customerName?.toLowerCase().includes(term)
      );
    }

    // Apply filter
    switch(selectedFilter) {
      case 'today':
        filtered = filtered.filter(r => 
          new Date(r.date).toDateString() === new Date().toDateString()
        );
        break;
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(r => new Date(r.date) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(r => new Date(r.date) >= monthAgo);
        break;
      case 'favorites':
        filtered = filtered.filter(r => favorites.includes(r.id));
        break;
      case 'large':
        filtered = filtered.filter(r => r.total > 10000);
        break;
    }

    // Apply date range
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(r => {
        const date = new Date(r.date);
        return date >= dateRange.start && date <= dateRange.end;
      });
    }

    // Apply sorting
    switch(sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'amount-desc':
        filtered.sort((a, b) => b.total - a.total);
        break;
      case 'amount-asc':
        filtered.sort((a, b) => a.total - b.total);
        break;
    }

    return filtered;
  }, [savedReceipts, searchTerm, selectedFilter, dateRange, sortBy, favorites]);

  // Quick actions for a receipt
  const handleQuickActions = async (receipt, action) => {
    switch(action) {
      case 'share':
        setCurrentReceipt(receipt);
        setShowShareModal(true);
        break;
        
      case 'email':
        // Open email client with receipt details
        const subject = `Receipt ${receipt.receiptNumber}`;
        const body = `Receipt from ${receipt.storeName}\nTotal: ${formatNaira(receipt.total)}\nDate: ${new Date(receipt.date).toLocaleString()}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        break;
        
      case 'whatsapp':
        const text = `*Receipt from ${receipt.storeName}*\n📄 No: ${receipt.receiptNumber}\n💰 Total: ${formatNaira(receipt.total)}\n📅 Date: ${new Date(receipt.date).toLocaleString()}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        break;
        
      case 'download-pdf':
        try {
          const pdf = await getReceiptPdf(receipt);
          pdf.save(`receipt-${receipt.receiptNumber}.pdf`);
          Swal.fire({
            title: '✅ PDF Downloaded',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire('Error', 'Failed to download PDF', 'error');
        }
        break;
        
      case 'print':
        try {
          const pdf = await getReceiptPdf(receipt);
          const blob = pdf.output('blob');
          const url = URL.createObjectURL(blob);
          const printWindow = window.open(url);
          printWindow.onload = () => {
            printWindow.print();
          };
        } catch (error) {
          Swal.fire('Error', 'Failed to print', 'error');
        }
        break;
        
      case 'duplicate':
        // Create new receipt based on this one
        // This would need to be implemented in context
        Swal.fire({
          title: '📋 Duplicate Receipt',
          text: 'Creating a new receipt based on this one...',
          timer: 1500,
          showConfirmButton: false
        });
        break;
        
      case 'qr':
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${window.location.origin}/verify?hash=${receipt.verificationInfo?.receiptHash || ''}`)}`;
        Swal.fire({
          title: '📱 Verification QR Code',
          html: `<img src="${qrUrl}" alt="QR Code" class="mx-auto" />`,
          showConfirmButton: true
        });
        break;
        
      case 'delete':
        const result = await Swal.fire({
          title: 'Delete Receipt?',
          text: 'This action cannot be undone',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Delete'
        });
        if (result.isConfirmed) {
          deleteSavedReceipt(receipt.id);
          Swal.fire('Deleted!', 'Receipt has been deleted.', 'success');
        }
        break;
    }
  };

  // Bulk actions
  const handleBulkAction = async (action) => {
    if (selectedReceipts.length === 0) {
      Swal.fire('No Selection', 'Please select receipts first', 'warning');
      return;
    }

    switch(action) {
      case 'delete':
        const confirm = await Swal.fire({
          title: `Delete ${selectedReceipts.length} receipts?`,
          text: 'This action cannot be undone',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33'
        });
        if (confirm.isConfirmed) {
          selectedReceipts.forEach(id => deleteSavedReceipt(id));
          setSelectedReceipts([]);
          setBulkMode(false);
          Swal.fire('Deleted!', `${selectedReceipts.length} receipts deleted`, 'success');
        }
        break;
        
      case 'export':
        // Export selected as CSV
        const csv = generateCSV(selectedReceipts);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `receipts-export-${Date.now()}.csv`);
        break;
        
      case 'email':
        const emailList = selectedReceipts.map(r => 
          `${r.receiptNumber}: ${formatNaira(r.total)}`
        ).join('\n');
        window.location.href = `mailto:?subject=Receipts Export&body=${encodeURIComponent(emailList)}`;
        break;
        
      case 'print':
        // Print selected receipts
        selectedReceipts.forEach(async (id) => {
          const receipt = savedReceipts.find(r => r.id === id);
          if (receipt) {
            const pdf = await getReceiptPdf(receipt);
            const blob = pdf.output('blob');
            const url = URL.createObjectURL(blob);
            window.open(url);
          }
        });
        break;
    }
  };

  // Generate CSV for export
  const generateCSV = (receiptIds) => {
    const headers = ['Receipt Number', 'Store', 'Date', 'Total', 'Items'];
    const rows = receiptIds.map(id => {
      const r = savedReceipts.find(r => r.id === id);
      return [
        r.receiptNumber,
        r.storeName,
        new Date(r.date).toLocaleDateString(),
        r.total,
        r.itemsCount
      ];
    });
    
    return [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
  };

  // Save recent search
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term && !recentSearches.includes(term)) {
      const newSearches = [term, ...recentSearches.slice(0, 4)];
      setRecentSearches(newSearches);
      localStorage.setItem('recent_searches', JSON.stringify(newSearches));
    }
  };

  if (savedReceipts.length === 0) {
    return <EmptyHistory />;
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden">
      {/* Header with Quick Stats Toggle */}
      <div className="flex items-center justify-between p-4 border-b">
        <HistoryHeader 
          savedReceipts={savedReceipts}
          onClearHistory={() => setShowClearConfirm(true)}
          onExportHistory={() => setShowExportModal(true)}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuickStats(!showQuickStats)}
            className={`p-2 rounded-lg transition-colors ${
              showQuickStats ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="Toggle Statistics"
          >
            <BarChart3 size={20} />
          </button>
          <button
            onClick={() => setBulkMode(!bulkMode)}
            className={`p-2 rounded-lg transition-colors ${
              bulkMode ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
            }`}
            title="Bulk Actions"
          >
            <CheckCircle size={20} />
          </button>
        </div>
      </div>

      {/* Quick Stats Panel */}
      {showQuickStats && stats && (
        <QuickStats 
          stats={stats} 
          formatNaira={formatNaira}
          onDateRangeChange={setDateRange}
        />
      )}

      {/* Smart Search */}
      <SmartSearch
        searchTerm={searchTerm}
        onSearch={handleSearch}
        recentSearches={recentSearches}
        onClearSearch={() => setSearchTerm('')}
        onToggleSmartMode={() => setSmartSearchMode(!smartSearchMode)}
        smartMode={smartSearchMode}
      />

      {/* Search and Filters */}
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

      {/* Bulk Actions Bar */}
      {bulkMode && (
        <BulkActionsBar
          selectedCount={selectedReceipts.length}
          totalCount={filteredReceipts.length}
          onSelectAll={() => setSelectedReceipts(filteredReceipts.map(r => r.id))}
          onClearSelection={() => setSelectedReceipts([])}
          onBulkAction={handleBulkAction}
        />
      )}

      {/* Receipts List - Enhanced with actions */}
      <HistoryList
        receipts={filteredReceipts}
        searchTerm={searchTerm}
        selectedFilter={selectedFilter}
        bulkMode={bulkMode}
        selectedReceipts={selectedReceipts}
        onSelectReceipt={(id) => {
          setSelectedReceipts(prev =>
            prev.includes(id)
              ? prev.filter(r => r !== id)
              : [...prev, id]
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

      {/* Modals */}
      {showClearConfirm && (
        <ClearConfirm
          onClose={() => setShowClearConfirm(false)}
          onConfirm={() => {
            clearHistory();
            setShowClearConfirm(false);
            Swal.fire('Cleared!', 'All receipts have been deleted.', 'success');
          }}
        />
      )}

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          receipts={savedReceipts}
          formatNaira={formatNaira}
          onExport={(format) => {
            // Handle different export formats
            if (format === 'csv') {
              const csv = generateCSV(savedReceipts.map(r => r.id));
              const blob = new Blob([csv], { type: 'text/csv' });
              saveAs(blob, `all-receipts-${Date.now()}.csv`);
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
          onShare={(method) => {
            // Handle different sharing methods
            handleQuickActions(currentReceipt, method);
            setShowShareModal(false);
          }}
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