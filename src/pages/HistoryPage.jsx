// pages/HistoryPage.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReceiptHistory from '../components/ReceiptHistory';

const HistoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/create')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Receipt History</h1>
        </div>

        {/* History Content */}
        <div className="bg-white rounded-xl border shadow-sm">
          <ReceiptHistory />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;