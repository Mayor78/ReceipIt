import React from 'react';
import { Search, X, Filter, Calendar, TrendingUp, ChevronDown } from 'lucide-react';

const HistoryFilters = ({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  showFilters,
  setShowFilters,
  sortBy,
  setSortBy,
  onDateRangeChange,
  dateRange,
  totalCount,
  totalAmount,
  formatNaira
}) => {
  const sortOptions = [
    { value: 'date-desc', label: 'Newest First', icon: '↓' },
    { value: 'date-asc', label: 'Oldest First', icon: '↑' },
    { value: 'amount-desc', label: 'Highest Amount', icon: '💰' },
    { value: 'amount-asc', label: 'Lowest Amount', icon: '💵' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Receipts', icon: '📋' },
    { value: 'today', label: 'Today', icon: '🌞' },
    { value: 'week', label: 'This Week', icon: '📅' },
    { value: 'month', label: 'This Month', icon: '📆' },
    { value: 'favorites', label: 'Favorites', icon: '⭐' },
    { value: 'large', label: 'Large (>₦10,000)', icon: '💰' }
  ];

  const templateOptions = [
    { value: 'all', label: 'All Templates' },
    { value: 'professional', label: 'Professional' },
    { value: 'modern', label: 'Modern' },
    { value: 'elegant', label: 'Elegant' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'bold', label: 'Bold' },
    { value: 'classic', label: 'Classic' }
  ];

  const documentTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'receipt', label: 'Receipts' },
    { value: 'invoice', label: 'Invoices' },
    { value: 'quote', label: 'Quotes' }
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      {/* Main Search Bar with Stats */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
        

          {/* Desktop Quick Filters */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 min-w-[160px] cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 min-w-[160px] cursor-pointer"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle (hidden on desktop) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100"
            >
              <Filter size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mt-3 px-2">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{totalCount}</span> receipt{totalCount !== 1 ? 's' : ''}
            </span>
            {totalCount > 0 && (
              <span className="text-sm text-gray-600">
                Total: <span className="font-semibold text-blue-600">{formatNaira(totalAmount)}</span>
              </span>
            )}
          </div>
          
          {/* Date Range Indicator (if active) */}
          {dateRange?.start && dateRange?.end && (
            <button
              onClick={() => onDateRangeChange({ start: null, end: null })}
              className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <Calendar size={14} />
              {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
              <X size={14} className="ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel (Mobile & Expanded) */}
      {showFilters && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 animate-slideDown">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Document Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Document Type
              </label>
              <select
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                // Add state for this if needed
              >
                {documentTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Template Style
              </label>
              <select
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                // Add state for this if needed
              >
                {templateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Picker (Simplified) */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                From Date
              </label>
              <input
                type="date"
                onChange={(e) => onDateRangeChange({ 
                  ...dateRange, 
                  start: e.target.value ? new Date(e.target.value) : null 
                })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                To Date
              </label>
              <input
                type="date"
                onChange={(e) => onDateRangeChange({ 
                  ...dateRange, 
                  end: e.target.value ? new Date(e.target.value) : null 
                })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Quick Date Presets */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setDate(start.getDate() - 7);
                onDateRangeChange({ start, end });
              }}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 1);
                onDateRangeChange({ start, end });
              }}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              Last 30 Days
            </button>
            <button
              onClick={() => {
                const start = new Date(new Date().getFullYear(), 0, 1);
                const end = new Date();
                onDateRangeChange({ start, end });
              }}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              This Year
            </button>
            <button
              onClick={() => onDateRangeChange({ start: null, end: null })}
              className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs hover:bg-red-100 transition-colors"
            >
              Clear Dates
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Chips */}
      {(selectedFilter !== 'all' || searchTerm || sortBy !== 'date-desc') && (
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {selectedFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              {filterOptions.find(f => f.value === selectedFilter)?.icon} {filterOptions.find(f => f.value === selectedFilter)?.label}
              <button onClick={() => setSelectedFilter('all')} className="ml-1 hover:text-blue-900">
                <X size={12} />
              </button>
            </span>
          )}
          
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
              🔍 "{searchTerm}"
              <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-purple-900">
                <X size={12} />
              </button>
            </span>
          )}
          
          {sortBy !== 'date-desc' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              <TrendingUp size={12} /> {sortOptions.find(s => s.value === sortBy)?.label}
              <button onClick={() => setSortBy('date-desc')} className="ml-1 hover:text-gray-900">
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryFilters;