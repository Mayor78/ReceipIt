import React from 'react';
import { Trash2, Download, Mail, Printer, X, CheckSquare, Square } from 'lucide-react';

const BulkActionsBar = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBulkAction
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-0 z-10 bg-purple-50 border-b border-purple-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onSelectAll}
          className="flex items-center gap-2 text-sm text-purple-700 hover:text-purple-900"
        >
          {selectedCount === totalCount ? <Square size={16} /> : <CheckSquare size={16} />}
          {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
        </button>
        <span className="text-sm font-medium text-purple-700">
          {selectedCount} receipt{selectedCount !== 1 ? 's' : ''} selected
        </span>
        <button
          onClick={onClearSelection}
          className="text-sm text-purple-600 hover:text-purple-800"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onBulkAction('delete')}
          className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
          title="Delete Selected"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={() => onBulkAction('export')}
          className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
          title="Export Selected as CSV"
        >
          <Download size={18} />
        </button>
        <button
          onClick={() => onBulkAction('email')}
          className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
          title="Email Selected"
        >
          <Mail size={18} />
        </button>
        <button
          onClick={() => onBulkAction('print')}
          className="p-2 hover:bg-orange-100 rounded-lg text-orange-600 transition-colors"
          title="Print Selected"
        >
          <Printer size={18} />
        </button>
      </div>
    </div>
  );
};

export default BulkActionsBar;