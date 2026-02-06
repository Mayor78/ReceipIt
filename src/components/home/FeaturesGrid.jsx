// components/home/FeaturesGrid.jsx
import React from 'react';
import { FileText, Download, History } from 'lucide-react';

const FeaturesGrid = () => {
  return (
    <div className="px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
            <FileText className="text-green-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Multiple Formats</h3>
          <p className="text-gray-600 mb-4">
            Create receipts, invoices, and quotes with professional templates designed for Nigerian businesses.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Receipts</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Invoices</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Quotes</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
            <Download className="text-blue-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Print & Export</h3>
          <p className="text-gray-600 mb-4">
            Download as PDF, print directly, or share via WhatsApp. All documents are print-ready.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">PDF Export</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Print</span>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">WhatsApp</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
            <History className="text-purple-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">History & Save</h3>
          <p className="text-gray-600 mb-4">
            Save all your generated receipts. Access them anytime, even after closing your browser.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Save History</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Auto-save</span>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">Search</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesGrid;