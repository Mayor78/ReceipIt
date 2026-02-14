import React from 'react';
import { TrendingUp, ExternalLink, Link2 } from 'lucide-react';

const PopularPages = ({ pages }) => {
  // Find the highest count to calculate relative widths for the background bars
  const maxCount = pages.length > 0 ? Math.max(...pages.map(p => p.count)) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
            <TrendingUp size={18} className="text-emerald-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-none">Popular Pages</h3>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Top performing routes</p>
          </div>
        </div>
        <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 transition-colors">
            <ExternalLink size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-1 overflow-y-auto">
        {pages.map((page, index) => {
          const relativeWidth = maxCount > 0 ? (page.count / maxCount) * 100 : 0;
          const isTopThree = index < 3;

          return (
            <div 
              key={page.page_path} 
              className="group relative flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-slate-50 cursor-default"
            >
              {/* Relative Progress Bar Background */}
              <div 
                className="absolute left-0 top-1 bottom-1 bg-blue-50/50 rounded-r-lg transition-all duration-1000"
                style={{ width: `${relativeWidth}%`, zIndex: 0 }}
              />

              <div className="flex items-center min-w-0 flex-1 relative z-10">
                {/* Rank Badge */}
                <div className={`
                  w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black mr-3 border
                  ${index === 0 ? 'bg-amber-100 border-amber-200 text-amber-700 shadow-sm' : 
                    index === 1 ? 'bg-slate-100 border-slate-200 text-slate-600' : 
                    index === 2 ? 'bg-orange-50 border-orange-100 text-orange-700' : 
                    'bg-white border-slate-100 text-slate-400'}
                `}>
                  {index + 1}
                </div>
                
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Link2 size={12} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-semibold text-slate-700 truncate tracking-tight">
                      {page.page_path === '/' ? '/home' : page.page_path}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 relative z-10 ml-4">
                <div className="text-right">
                  <span className={`text-sm font-black ${isTopThree ? 'text-blue-600' : 'text-slate-500'}`}>
                    {page.count.toLocaleString()}
                  </span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Views</p>
                </div>
              </div>
            </div>
          );
        })}

        {pages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 opacity-60">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <TrendingUp size={20} className="text-slate-300" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Traffic Data</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Real-time stats</p>
        <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse delay-75" />
            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse delay-150" />
        </div>
      </div>
    </div>
  );
};

export default PopularPages;