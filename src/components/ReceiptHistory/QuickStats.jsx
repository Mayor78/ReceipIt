// components/ReceiptHistory/QuickStats.jsx
import React from 'react';
import { TrendingUp, Calendar, DollarSign, Receipt, Store, Award, Activity } from 'lucide-react';

const QuickStats = ({ stats, formatNaira, onDateRangeChange }) => {
  const statsCards = [
    {
      title: 'Index_Total',
      value: stats.totalReceipts || 0,
      icon: Receipt,
      glow: 'shadow-blue-500/10',
      text: 'text-blue-500',
      border: 'border-blue-500/20'
    },
    {
      title: 'Gross_Value',
      value: formatNaira(stats.totalAmount),
      icon: DollarSign,
      glow: 'shadow-emerald-500/10',
      text: 'text-emerald-500',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Monthly_Log',
      value: formatNaira(stats.monthlyTotal),
      icon: Calendar,
      glow: 'shadow-purple-500/10',
      text: 'text-purple-500',
      border: 'border-purple-500/20',
      subtext: `${stats.monthlyCount} entries`
    },
    {
      title: 'Mean_Velocity',
      value: formatNaira(stats.averageAmount),
      icon: TrendingUp,
      glow: 'shadow-orange-500/10',
      text: 'text-orange-500',
      border: 'border-orange-500/20'
    },
    {
      title: 'Peak_Record',
      value: formatNaira(stats.largestReceipt),
      icon: Award,
      glow: 'shadow-red-500/10',
      text: 'text-red-500',
      border: 'border-red-500/20'
    },
    {
      title: 'Node_Count',
      value: stats.storeCount,
      icon: Store,
      glow: 'shadow-indigo-500/10',
      text: 'text-indigo-500',
      border: 'border-indigo-500/20'
    }
  ];

  return (
    <div className="p-6 bg-[#0d1117] border-b border-white/5">
      {/* Header HUD */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <Activity size={14} className="text-blue-500 animate-pulse" />
          Live Telemetry Feed
        </h3>
        <button
          onClick={() => onDateRangeChange({ start: null, end: null })}
          className="text-[10px] font-black text-blue-400/70 hover:text-blue-400 uppercase tracking-widest transition-colors border-b border-blue-400/20 pb-0.5"
        >
          Reset Timeline
        </button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`relative bg-[#161b22] border ${stat.border} rounded-2xl p-4 transition-all hover:-translate-y-1 hover:bg-[#1c2128] group cursor-pointer overflow-hidden ${stat.glow} shadow-lg`}
              onClick={() => {
                if (stat.title === 'Monthly_Log') {
                  const now = new Date();
                  const start = new Date(now.getFullYear(), now.getMonth(), 1);
                  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                  onDateRangeChange({ start, end });
                }
              }}
            >
              {/* Subtle background scanline effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-xl bg-black/20 ${stat.text}`}>
                  <Icon size={16} />
                </div>
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                  {stat.title}
                </span>
              </div>

              <div className={`text-sm lg:text-base font-mono font-bold tracking-tight ${stat.text}`}>
                {stat.value}
              </div>

              {stat.subtext ? (
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mt-1 group-hover:text-slate-400">
                  {stat.subtext}
                </div>
              ) : (
                <div className="h-4" /> // Spacer for alignment
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickStats;