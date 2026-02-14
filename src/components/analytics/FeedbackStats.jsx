import React from 'react';
import { MessageSquare, Star, TrendingUp } from 'lucide-react';

const FeedbackStats = ({ feedbackStats }) => {
  const total = feedbackStats.total || 0;
  const avg = feedbackStats.avgRating || 0;

  // Helper to get bar color based on rating intensity
  const getRatingColor = (rating) => {
    if (rating >= 4) return 'bg-emerald-500';
    if (rating === 3) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
            <MessageSquare size={18} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-none">Feedback Stats</h3>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Customer satisfaction</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
           <TrendingUp size={12} />
           <span className="text-[10px] font-bold">Active</span>
        </div>
      </div>

      <div className="p-6 flex-1">
        {/* Hero Rating Display */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center">
            <span className="text-5xl font-black text-slate-900 tracking-tighter">{avg}</span>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={`${
                    star <= Math.round(avg) 
                      ? 'fill-amber-400 text-amber-400' 
                      : 'fill-slate-100 text-slate-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Based on {total.toLocaleString()} reviews
            </p>
          </div>
        </div>

        {total > 0 ? (
          <div className="space-y-4">
            {[...feedbackStats.ratings].reverse().map((r) => {
              const percentage = total > 0 ? Math.round((r.count / total) * 100) : 0;
              
              return (
                <div key={r.rating} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600 w-3">{r.rating}</span>
                      <Star size={10} className="fill-slate-400 text-slate-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {r.count} votes
                      </span>
                      <span className="text-xs font-black text-slate-900 w-8 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full ${getRatingColor(r.rating)} rounded-full transition-all duration-700 ease-out relative`}
                      style={{ width: `${percentage}%` }}
                    >
                      {/* Reflection effect for premium feel */}
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <Star size={20} className="text-slate-200" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
              No reviews yet
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-50 text-center">
        <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider transition-colors">
          View all comments →
        </button>
      </div>
    </div>
  );
};

export default FeedbackStats;