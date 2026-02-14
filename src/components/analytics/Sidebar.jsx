import React from 'react';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Store, 
  FileText,
  Settings,
  X,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';

const Sidebar = ({ activeView, setActiveView, mobileOpen, setMobileOpen }) => {
  // Grouping items makes the UI look more organized/professional
  const navSections = [
    {
      group: "Main",
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
      ]
    },
    {
      group: "Management",
      items: [
        { id: 'feedback', label: 'Feedback', icon: MessageSquare },
        { id: 'stores', label: 'Stores', icon: Store },
        { id: 'receipts', label: 'Receipts', icon: FileText },
      ]
    },
    {
      group: "System",
      items: [
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const handleNavClick = (id) => {
    setActiveView(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay with Blur */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-100 z-50
          transform transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header/Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
              <BarChart3 size={20} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-lg">Analytics</span>
          </div>
          
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Wrapper */}
        <div className="flex flex-col h-[calc(100%-4rem)] justify-between">
          <nav className="p-4 overflow-y-auto custom-scrollbar">
            {navSections.map((section, idx) => (
              <div key={idx} className="mb-6 last:mb-0">
                <h3 className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                  {section.group}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`
                          w-full flex items-center group relative px-4 py-2.5 rounded-xl
                          text-sm font-medium transition-all duration-200
                          ${isActive 
                            ? 'bg-blue-50 text-blue-700 shadow-sm' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }
                        `}
                      >
                        {/* Active Indicator Pill */}
                        {isActive && (
                          <div className="absolute left-0 w-1 h-5 bg-blue-600 rounded-r-full" />
                        )}
                        
                        <Icon 
                          size={19} 
                          className={`mr-3 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                        />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User/Footer Section */}
          <div className="p-4 border-t border-slate-50 bg-slate-50/50">
            <div className="flex items-center gap-3 px-2 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">Administrator</p>
                <p className="text-[10px] text-slate-400 font-medium">v2.0.4 • Stable</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Basic styles for the scrollbar if the list grows long */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
};

export default Sidebar;