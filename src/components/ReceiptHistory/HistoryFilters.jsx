// components/ReceiptHistory/HistoryFilters.jsx
import React from 'react';
import { Search, X, Filter, Calendar, TrendingUp, ChevronDown, Layout, FileText, Zap } from 'lucide-react';

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
    { value: 'all', label: 'All Records', icon: '📋' },
    { value: 'today', label: 'Today', icon: '🌞' },
    { value: 'week', label: 'This Week', icon: '📅' },
    { value: 'month', label: 'This Month', icon: '📆' },
    { value: 'favorites', label: 'Favorites', icon: '⭐' },
    { value: 'large', label: 'Large (>₦10k)', icon: '💰' }
  ];

  return (
    <div className="border-b border-white/5 bg-[#161b22]">
      {/* Main HUD */}
      <div className="p-5 sm:p-8">
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Enhanced Search Input */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Query receipt ID, store, or client..."
              className="w-full bg-[#0d1117] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Actions Control */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Control */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-[#0d1117] border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300 pl-4 pr-10 py-4 rounded-2xl focus:outline-none focus:border-blue-500/40 cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-[#161b22] text-white uppercase">{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>

            {/* Filter Control */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full appearance-none bg-[#0d1117] border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300 pl-4 pr-10 py-4 rounded-2xl focus:outline-none focus:border-blue-500/40 cursor-pointer"
              >
                {filterOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-[#161b22] text-white uppercase">{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>

            {/* Advanced Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-4 rounded-2xl border transition-all ${
                showFilters 
                ? 'bg-blue-600/10 border-blue-500 text-blue-500' 
                : 'bg-[#0d1117] border-white/5 text-slate-500 hover:text-white'
              }`}
            >
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Real-time Stats Footer */}
        <div className="flex flex-wrap items-center justify-between mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Index.Count</span>
              <span className="text-sm font-bold text-white tracking-tight">
                {totalCount} <span className="text-slate-600 font-medium">Entries</span>
              </span>
            </div>
            <div className="w-[1px] h-8 bg-white/5" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Valuation.Total</span>
              <span className="text-sm font-bold text-emerald-500 flex items-center gap-2">
                <Zap size={12} className="animate-pulse" />
                {formatNaira(totalAmount)}
              </span>
            </div>
          </div>
          
          {/* Active Range Indicator */}
          {dateRange?.start && dateRange?.end && (
            <button
              onClick={() => onDateRangeChange({ start: null, end: null })}
              className="mt-4 sm:mt-0 flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[10px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-500/20 transition-all"
            >
              <Calendar size={12} />
              {new Date(dateRange.start).toLocaleDateString()} — {new Date(dateRange.end).toLocaleDateString()}
              <X size={12} className="ml-2 text-blue-300" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Drawer */}
      {showFilters && (
        <div className="p-8 bg-[#0d1117]/50 border-t border-white/5 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FilterSelect label="Document Class" options={['All Types', 'Receipts', 'Invoices', 'Quotes']} icon={<FileText size={12}/>} />
            <FilterSelect label="Interface Template" options={['All Styles', 'Professional', 'Modern', 'Elegant', 'Minimal']} icon={<Layout size={12}/>} />
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} /> Start Date
              </label>
              <input 
                type="date" 
                onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value ? new Date(e.target.value) : null })}
                className="w-full bg-[#161b22] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} /> End Date
              </label>
              <input 
                type="date" 
                onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value ? new Date(e.target.value) : null })}
                className="w-full bg-[#161b22] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50" 
              />
            </div>
          </div>
          
          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 mt-8">
            <PresetBtn label="Last 7 Days" onClick={() => {/* range logic */}} />
            <PresetBtn label="Last 30 Days" onClick={() => {/* range logic */}} />
            <PresetBtn label="Year to Date" onClick={() => {/* range logic */}} />
            <button onClick={() => onDateRangeChange({ start: null, end: null })} className="px-4 py-2 text-[9px] font-black uppercase text-red-500/70 hover:text-red-500 transition-colors tracking-[0.2em]">
              Reset Timeline
            </button>
          </div>
        </div>
      )}

      {/* Chips Area */}
      {(selectedFilter !== 'all' || searchTerm || sortBy !== 'date-desc') && (
        <div className="px-8 pb-6 flex flex-wrap gap-2">
          {searchTerm && <Chip label={`Query: ${searchTerm}`} onClear={() => setSearchTerm('')} color="blue" />}
          {selectedFilter !== 'all' && <Chip label={`Class: ${selectedFilter}`} onClear={() => setSelectedFilter('all')} color="emerald" />}
          {sortBy !== 'date-desc' && <Chip label={`Sort: ${sortBy}`} onClear={() => setSortBy('date-desc')} color="slate" />}
        </div>
      )}
    </div>
  );
};

// Sub-components for cleaner code
const FilterSelect = ({ label, options, icon }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
      {icon} {label}
    </label>
    <select className="w-full bg-[#161b22] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 appearance-none">
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

const PresetBtn = ({ label, onClick }) => (
  <button onClick={onClick} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all">
    {label}
  </button>
);

const Chip = ({ label, onClear, color }) => {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    slate: "bg-white/5 text-slate-400 border-white/10"
  };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-lg text-[9px] font-black uppercase tracking-widest ${colors[color]}`}>
      {label}
      <button onClick={onClear} className="hover:text-white transition-colors"><X size={10} /></button>
    </span>
  );
};

export default HistoryFilters;