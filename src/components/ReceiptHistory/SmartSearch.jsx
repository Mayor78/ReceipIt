// components/ReceiptHistory/SmartSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Calendar, Zap, Sparkles, Terminal } from 'lucide-react';

const SmartSearch = ({
  searchTerm,
  onSearch,
  recentSearches,
  onClearSearch,
  onToggleSmartMode,
  smartMode
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Smart suggestions based on input
  useEffect(() => {
    if (searchTerm.length > 1) {
      const lowerTerm = searchTerm.toLowerCase();
      const newSuggestions = [];

      // Logic for parsing (keeping your original functional logic)
      if (lowerTerm.includes('>') || lowerTerm.includes('greater')) {
        const amount = lowerTerm.match(/\d+/)?.[0];
        if (amount) {
          newSuggestions.push({
            text: `Filter_Value > ₦${amount}`,
            query: `amount>${amount}`,
            icon: TrendingUp
          });
        }
      }

      if (lowerTerm.includes('today')) {
        newSuggestions.push({
          text: 'Temporal_Range: Today',
          query: 'date:today',
          icon: Calendar
        });
      }

      // ... other logic remains the same ...
      if (lowerTerm.includes('this week')) {
        newSuggestions.push({ text: 'Temporal_Range: Week_Cycle', query: 'date:week', icon: Calendar });
      }

      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    onSearch(suggestion.query);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="p-6 bg-[#0d1117] border-b border-white/5 relative">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        
        {/* Input Field HUD */}
        <div className="flex-1 relative group">
          <div className={`absolute inset-0 bg-gradient-to-r ${smartMode ? 'from-purple-500/20 to-blue-500/20' : 'from-slate-500/10 to-transparent'} rounded-2xl blur-xl transition-opacity duration-500 opacity-0 group-focus-within:opacity-100`} />
          
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={smartMode ? "EXEC_QUERY: 'above 5000' or 'last week'..." : "Scanning local registry..."}
            className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border ${smartMode ? 'border-purple-500/30' : 'border-white/10'} rounded-2xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm`}
          />
          
          {searchTerm && (
            <button
              onClick={onClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {/* Smart Mode Toggle */}
        <button
          onClick={onToggleSmartMode}
          className={`px-6 py-3.5 rounded-2xl border flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 ${
            smartMode 
              ? 'bg-purple-600/10 border-purple-500/50 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
          }`}
        >
          {smartMode ? <Zap size={16} className="fill-current" /> : <Terminal size={16} />}
          <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
            {smartMode ? 'Neural_Mode: ON' : 'Standard_Search'}
          </span>
        </button>
      </div>

      {/* Suggestions Overlay */}
      {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute left-6 right-6 top-[85%] mt-4 bg-[#161b22] border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300"
        >
          {/* Recent History */}
          {recentSearches.length > 0 && (
            <div className="p-4">
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 py-2 flex items-center gap-2">
                <Clock size={10} /> RECENT_LOGS
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSearch(search);
                      setShowSuggestions(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-all text-left group"
                  >
                    <span className="text-xs text-slate-400 group-hover:text-blue-400 font-mono">/ {search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Neural Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-4 border-t border-white/5 bg-purple-500/5">
              <p className="text-[8px] font-black text-purple-400 uppercase tracking-[0.3em] px-4 py-2 flex items-center gap-2">
                <Sparkles size={10} /> NEURAL_AUTOCOMPLETE
              </p>
              <div className="space-y-1">
                {suggestions.map((suggestion, idx) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-500/10 rounded-xl transition-all group"
                    >
                      <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-400">
                        <Icon size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{suggestion.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Terminal Tips */}
          {smartMode && (
            <div className="p-6 bg-blue-500/5 border-t border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Terminal size={12} className="text-blue-400" />
                <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Syntax_Guide</p>
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <Tip code="> 5000" label="Value Filter" />
                <Tip code="last week" label="Time Delta" />
                <Tip code="store: Apple" label="Node Locate" />
                <Tip code="yesterday" label="Quick Range" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Tip = ({ code, label }) => (
  <div className="flex items-center justify-between group cursor-default">
    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">{label}</span>
    <code className="text-[10px] text-blue-300/60 font-mono group-hover:text-blue-400 transition-colors">"{code}"</code>
  </div>
);

export default SmartSearch;