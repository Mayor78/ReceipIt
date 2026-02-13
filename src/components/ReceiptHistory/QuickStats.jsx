import React from 'react';
import { TrendingUp, Calendar, DollarSign, Receipt, Store, Award } from 'lucide-react';

const QuickStats = ({ stats, formatNaira, onDateRangeChange }) => {
  const statsCards = [
    {
      title: 'Total Receipts',
      value: stats.totalReceipts,
      icon: Receipt,
      color: 'blue',
      bg: 'bg-blue-50',
      text: 'text-blue-600'
    },
    {
      title: 'Total Amount',
      value: formatNaira(stats.totalAmount),
      icon: DollarSign,
      color: 'green',
      bg: 'bg-green-50',
      text: 'text-green-600'
    },
    {
      title: 'Monthly Total',
      value: formatNaira(stats.monthlyTotal),
      icon: Calendar,
      color: 'purple',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      subtext: `${stats.monthlyCount} this month`
    },
    {
      title: 'Average',
      value: formatNaira(stats.averageAmount),
      icon: TrendingUp,
      color: 'orange',
      bg: 'bg-orange-50',
      text: 'text-orange-600'
    },
    {
      title: 'Largest Receipt',
      value: formatNaira(stats.largestReceipt),
      icon: Award,
      color: 'red',
      bg: 'bg-red-50',
      text: 'text-red-600'
    },
    {
      title: 'Stores',
      value: stats.storeCount,
      icon: Store,
      color: 'indigo',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600'
    }
  ];

  return (
    <div className="p-4 bg-white border-b">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-500" />
          Quick Statistics
        </h3>
        <button
          onClick={() => onDateRangeChange({ start: null, end: null })}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          View All Time
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bg} rounded-lg p-3 transition-transform hover:scale-105 cursor-pointer`}
              onClick={() => {
                if (stat.title === 'Monthly Total') {
                  const now = new Date();
                  const start = new Date(now.getFullYear(), now.getMonth(), 1);
                  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                  onDateRangeChange({ start, end });
                }
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon size={18} className={stat.text} />
                <span className="text-xs text-gray-500">{stat.title}</span>
              </div>
              <div className={`text-lg font-bold ${stat.text}`}>{stat.value}</div>
              {stat.subtext && (
                <div className="text-xs text-gray-500 mt-1">{stat.subtext}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickStats;