import React from 'react';
import { Activity, Zap, MousePointer2 } from 'lucide-react';

const FeatureUsage = ({ features }) => {
  const maxCount = features[0]?.count || 1;

  // Formats labels like "button_click_export" to "Button Click Export"
  const formatLabel = (label) => {
    return label
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
            <Zap size={18} className="text-amber-500 fill-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-none">Feature Engagement</h3>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Top user interactions</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-md">
           <Activity size={12} className="text-slate-500" />
           <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Live</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-6 flex-1">
        {features.map((feature, index) => {
          const percentage = (feature.count / maxCount) * 100;
          const isTop = index === 0;

          return (
            <div key={feature.event_label} className="group cursor-default">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-1.5 rounded-md transition-colors ${
                    isTop ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <MousePointer2 size={14} className={isTop ? 'animate-bounce' : ''} />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors">
                      {formatLabel(feature.event_label)}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map((i) => (
                          <div 
                            key={i} 
                            className={`w-1 h-1 rounded-full ${
                              i * 25 <= percentage ? 'bg-emerald-400' : 'bg-slate-200'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {feature.count.toLocaleString()} actions
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`text-sm font-black ${isTop ? 'text-slate-900' : 'text-slate-500'}`}>
                    {Math.round(percentage)}%
                  </span>
                </div>
              </div>

              {/* Modern Segmented Progress Bar */}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative border border-slate-50 shadow-inner">
                <div 
                  className={`h-full transition-all duration-1000 ease-out relative ${
                    isTop ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-slate-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                >
                  {/* Subtle glass streaks */}
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] bg-[length:20px_100%] animate-shimmer" />
                </div>
              </div>
            </div>
          );
        })}

        {features.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <Activity size={20} className="text-slate-200" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Awaiting interactions...
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Most used feature:</span>
        <span className="text-[10px] font-black text-emerald-600 uppercase">
          {features[0] ? formatLabel(features[0].event_label) : 'N/A'}
        </span>
      </div>
    </div>
  );
};

export default FeatureUsage;