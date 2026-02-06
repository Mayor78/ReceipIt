import React from 'react';
import { AlertCircle, RotateCcw, Trash2 } from 'lucide-react';

const DraftPrompt = ({ onRestore, onDiscard }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" size={20} />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-yellow-800 mb-1">Unsaved Draft Found</h4>
          <p className="text-xs text-yellow-700 mb-3">
            You have an unsaved receipt draft from your last session. Would you like to restore it or start fresh?
          </p>
          <div className="flex space-x-2">
            <button
              onClick={onRestore}
              className="flex items-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-xs font-medium"
            >
              <RotateCcw size={14} />
              <span>Restore Draft</span>
            </button>
            <button
              onClick={onDiscard}
              className="flex items-center space-x-1 px-3 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-xs font-medium"
            >
              <Trash2 size={14} />
              <span>Start Fresh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftPrompt;