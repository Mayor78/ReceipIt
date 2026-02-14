import React from 'react';
import { Clock, Eye, FileText, Activity, DownloadCloud, Share2, User, UserPlus } from 'lucide-react';

const RecentActivity = ({ events }) => {
  const getEventIcon = (event) => {
    if (event.event_type === 'page_view') return { Icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' };
    if (event.event_type === 'receipt_action') return { Icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' };
    if (event.event_type === 'click') return { Icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' };
    if (event.event_category === 'file') return { Icon: DownloadCloud, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' };
    if (event.event_category === 'social') return { Icon: Share2, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' };
    return { Icon: Activity, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-100' };
  };

  // Simple relative time formatter
  const formatTime = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
            <Clock size={18} className="text-slate-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-none">Live Activity</h3>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Real-time event stream</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-100 rounded-full">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">Live</span>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="p-4 overflow-y-auto max-h-[450px] scrollbar-hide">
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100" />

          <div className="space-y-6 relative">
            {events.map((event, index) => {
              const { Icon, color, bg, border } = getEventIcon(event);
              
              return (
                <div key={index} className="flex items-start gap-4 group">
                  {/* Icon with Ring */}
                  <div className={`relative z-10 p-2 rounded-xl border-2 border-white shadow-sm ${bg} ${color} transition-transform group-hover:scale-110`}>
                    <Icon size={16} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {event.event_label || event.event_action || 'Unknown Event'}
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded-full">
                        {formatTime(event.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1">
                      {/* User Badge */}
                      <div className="flex items-center gap-1">
                        {event.is_registered ? (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                            <User size={10} />
                            <span>MEMBER</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            <UserPlus size={10} />
                            <span>GUEST</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium truncate italic">
                        {event.page_path || 'Direct interaction'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-slate-200">
              <Activity size={24} className="text-slate-200" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Silence is golden</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[180px]">We're waiting for the first events to roll in.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-50">
        <button className="w-full py-2 text-[11px] font-bold text-slate-500 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all uppercase tracking-widest">
          Download Activity Log
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;