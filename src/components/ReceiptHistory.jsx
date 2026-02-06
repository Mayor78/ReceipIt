import React, { useState } from 'react';

import HistoryHeader from './ReceiptHistory/HistoryHeader';
import HistoryFilters from './ReceiptHistory/HistoryFilters';
import HistoryList from './ReceiptHistory/HistoryList';

import ExportModal from './ReceiptHistory/ExportModal';
import EmptyHistory from './ReceiptHistory/EmptyHistory';
import { useReceipt } from '../context/ReceiptContext';
import ClearConfirm from './ReceiptHistory/ClearComfirm';

const ReceiptHistory = () => {
  const { savedReceipts } = useReceipt();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  if (savedReceipts.length === 0) {
    return <EmptyHistory />;
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <HistoryHeader 
        savedReceipts={savedReceipts}
        onClearHistory={() => setShowClearConfirm(true)}
        onExportHistory={() => setShowExportModal(true)}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* Search and Filters */}
      <HistoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {/* Receipts List */}
      <HistoryList
        searchTerm={searchTerm}
        selectedFilter={selectedFilter}
      />

      {/* Modals */}
      {showClearConfirm && (
        <ClearConfirm
          onClose={() => setShowClearConfirm(false)}
        />
      )}

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

export default ReceiptHistory;