import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Calendar, DollarSign } from 'lucide-react';

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

      // Amount-based suggestions
      if (lowerTerm.includes('>') || lowerTerm.includes('greater')) {
        const amount = lowerTerm.match(/\d+/)?.[0];
        if (amount) {
          newSuggestions.push({
            text: `Amount greater than ₦${amount}`,
            query: `amount>${amount}`,
            icon: TrendingUp
          });
        }
      }

      if (lowerTerm.includes('<') || lowerTerm.includes('less')) {
        const amount = lowerTerm.match(/\d+/)?.[0];
        if (amount) {
          newSuggestions.push({
            text: `Amount less than ₦${amount}`,
            query: `amount<${amount}`,
            icon: TrendingUp
          });
        }
      }

      // Date-based suggestions
      if (lowerTerm.includes('today')) {
        newSuggestions.push({
          text: 'Receipts from today',
          query: 'date:today',
          icon: Calendar
        });
      }

      if (lowerTerm.includes('yesterday')) {
        newSuggestions.push({
          text: 'Receipts from yesterday',
          query: 'date:yesterday',
          icon: Calendar
        });
      }

      if (lowerTerm.includes('this week')) {
        newSuggestions.push({
          text: 'Receipts from this week',
          query: 'date:week',
          icon: Calendar
        });
      }

      if (lowerTerm.includes('this month')) {
        newSuggestions.push({
          text: 'Receipts from this month',
          query: 'date:month',
          icon: Calendar
        });
      }

      // Store name suggestions
      if (lowerTerm.includes('store:')) {
        const store = lowerTerm.split('store:')[1]?.trim();
        if (store) {
          newSuggestions.push({
            text: `Search in store: ${store}`,
            query: `store:${store}`,
            icon: Search
          });
        }
      }

      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  // Close suggestions when clicking outside
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
    <div className="p-4 bg-white border-b relative">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={smartMode ? "Try: 'receipts above 5000' or 'from last week'" : "Search receipts..."}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <button
          onClick={onToggleSmartMode}
          className={`px-4 py-2.5 rounded-lg border transition-colors flex items-center gap-2 ${
            smartMode 
              ? 'bg-purple-100 border-purple-300 text-purple-700' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="text-sm font-medium">Smart Search</span>
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute left-4 right-4 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-medium text-gray-500 px-3 py-2">Recent Searches</p>
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSearch(search);
                    setShowSuggestions(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Smart Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2 border-t">
              <p className="text-xs font-medium text-gray-500 px-3 py-2">Smart Suggestions</p>
              {suggestions.map((suggestion, idx) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Icon size={14} className="text-purple-500" />
                    <span className="text-sm text-gray-700">{suggestion.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Search Tips */}
          {smartMode && suggestions.length === 0 && (
            <div className="p-4 bg-blue-50 rounded-b-lg">
              <p className="text-xs font-medium text-blue-800 mb-2">💡 Search Tips</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• "above 5000" - receipts over ₦5000</li>
                <li>• "last week" - receipts from past 7 days</li>
                <li>• "store: ABC" - search in specific store</li>
                <li>• "today" or "yesterday" - quick date filters</li>
                <li>• "between 1000 and 5000" - amount range</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;