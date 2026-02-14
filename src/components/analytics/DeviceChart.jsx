import React from 'react';
import { Globe, ArrowUpRight } from 'lucide-react';

const DeviceChart = ({ deviceStats }) => {
  const total = deviceStats.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header Section */}
      <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
            <Globe size={18} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-none">Device Distribution</h3>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Traffic by hardware type</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-slate-900">{total.toLocaleString()}</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Hits</p>
        </div>
      </div>

      {/* Stats List */}
      <div className="p-5 space-y-5 flex-1">
        {deviceStats.map((device) => {
          const Icon = device.icon;
          const percentage = total > 0 ? Math.round((device.count / total) * 100) : 0;
          
          // Define color themes based on device type or index
          const colorClass = device.type === 'Desktop' ? 'bg-blue-600' : 
                             device.type === 'Mobile' ? 'bg-indigo-500' : 'bg-slate-400';
          
          return (
            <div key={device.type} className="group cursor-default">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md transition-colors duration-200 ${
                    device.type === 'Desktop' ? 'bg-blue-50 text-blue-600' : 
                    device.type === 'Mobile' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'
                  }`}>
                    <Icon size={16} className="transition-transform group-hover:scale-110" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                      {device.type}
                    </span>
                    <span className="ml-2 text-[10px] text-slate-400 font-medium">
                      {device.count.toLocaleString()} units
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-black text-slate-900">{percentage}%</span>
                  <ArrowUpRight size={12} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                <div 
                  className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out relative`}
                  style={{ width: `${percentage}%` }}
                >
                  {/* Subtle Glow Overlay */}
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/10" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-50">
        <p className="text-[10px] text-slate-400 font-medium text-center">
          Data updates automatically every 5 minutes
        </p>
      </div>
    </div>
  );
};

export default DeviceChart;