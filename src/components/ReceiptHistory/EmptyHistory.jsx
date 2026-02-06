import React from 'react';
import { History, Check, FileDown } from 'lucide-react';

const EmptyHistory = () => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 sm:p-8">
      <div className="text-center py-10 sm:py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
          <History className="text-blue-500" size={48} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">No Receipt History Yet</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Generated receipts will appear here for easy access, reprinting, and management.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
            <Check size={16} className="mr-2" />
            Auto-saved after generation
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            <FileDown size={16} className="mr-2" />
            Download anytime
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyHistory;