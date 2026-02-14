// components/analytics/StatCard.jsx
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, trend, iconBgColor, iconColor }) => {
  const hasTrend = trend !== undefined && trend !== null;
  const trendValue = Math.abs(trend);
  const isPositive = trend > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 ${iconBgColor} rounded-lg`}>
          <Icon size={18} className={iconColor} />
        </div>
        {hasTrend && (
          <span className={`text-xs font-semibold flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {trendValue}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
};

export default StatCard;