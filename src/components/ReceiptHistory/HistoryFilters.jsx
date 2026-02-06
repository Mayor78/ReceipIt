import React from 'react';
import { Search, X, Filter } from 'lucide-react';

const HistoryFilters = ({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  showFilters,
  setShowFilters
}) => {
  return (
    <>
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, number, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filters - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 min-w-[180px]"
            >
              <option value="all">All Receipts</option>
              <option value="recent">Recent (7 days)</option>
              <option value="invoice">Invoices</option>
              <option value="receipt">Receipts</option>
              <option value="quote">Quotes</option>
              <option value="professional">Professional</option>
              <option value="modern">Modern</option>
              <option value="elegant">Elegant</option>
              <option value="thermal">Thermal</option>
            </select>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="mt-4 lg:hidden">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Receipts</option>
              <option value="recent">Recent (7 days)</option>
              <option value="invoice">Invoices</option>
              <option value="receipt">Receipts</option>
              <option value="quote">Quotes</option>
              <option value="professional">Professional</option>
              <option value="modern">Modern</option>
              <option value="elegant">Elegant</option>
              <option value="thermal">Thermal</option>
            </select>
          </div>
        )}
      </div>
    </>
  );
};

export default HistoryFilters;