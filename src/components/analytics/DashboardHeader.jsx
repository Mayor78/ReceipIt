// components/analytics/DashboardHeader.jsx
import React from 'react';
import { BarChart3, RefreshCw, Menu, X } from 'lucide-react';

const DashboardHeader = ({ timeframe, setTimeframe, refreshing, mobileMenuOpen, setMobileMenuOpen }) => {
  const timeframes = [
    { value: '24h', label: '24h' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left - Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
              {refreshing && (
                <div className="flex items-center space-x-1 text-xs text-blue-600">
                  <RefreshCw size={12} className="animate-spin" />
                  <span>Updating...</span>
                </div>
              )}
            </div>
          </div>

          {/* Right - Timeframe + Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Desktop Timeframe */}
            <div className="hidden md:flex gap-2">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setTimeframe(tf.value)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                    timeframe === tf.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Timeframe Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2 flex flex-wrap gap-2">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => {
                  setTimeframe(tf.value);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  timeframe === tf.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 bg-gray-100'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;