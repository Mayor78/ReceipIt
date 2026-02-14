import React, { useState, useEffect } from 'react';
import { Receipt, Shield, Store, Menu, X, User, LogIn, MessageSquare, PlusCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ 
  isStoreRegistered, 
  storeData, 
  onRegisterClick,
  onLoginClick 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navTo = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* HEADER FIX: Changed bg-transparent to a solid/glass color 
          so it is visible even BEFORE scrolling.
      */}
      <header className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0a0c10]/90 backdrop-blur-xl border-b border-emerald-500/20 py-3 shadow-2xl' 
          : 'bg-[#0a0c10] border-b border-white/5 py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            
            {/* LOGO */}
            <button onClick={() => navTo('/')} className="flex items-center gap-3 group">
              <div className="bg-emerald-500 p-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <Receipt className="text-black" size={20} />
              </div>
              <div className="text-left leading-none">
                <span className="block text-xl font-black tracking-tighter text-white">
                  RECEIPT<span className="text-emerald-400">IT</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500">
                  Secure Protocol
                </span>
              </div>
            </button>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => navTo('/verify')} className="text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                <Shield size={16} /> Verify
              </button>
              <button onClick={() => navTo('/feedback')} className="text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                <MessageSquare size={16} /> Feedback
              </button>
              
              <div className="h-4 w-[1px] bg-white/10" />

              {isStoreRegistered ? (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-500 uppercase">Store Active</p>
                    <p className="text-sm font-bold text-white leading-none">{storeData?.store_name}</p>
                  </div>
                  <button onClick={() => navTo('/create')} className="bg-white text-black px-5 py-2 rounded-xl font-black text-xs hover:bg-emerald-400 transition-all">
                    CREATE +
                  </button>
                </div>
              ) : (
                <button onClick={onLoginClick || onRegisterClick} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-2 rounded-xl font-bold text-xs hover:bg-emerald-500 hover:text-black transition-all">
                  PARTNER LOGIN
                </button>
              )}
            </nav>

            {/* MOBILE MENU TOGGLE */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg border border-white/10"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU - FIXED ALIGNMENT */}
      <div className={`fixed inset-0 z-[110] md:hidden transition-all duration-500 ${
        isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
        
        {/* Menu Content */}
        <div className={`absolute top-0 right-0 h-full w-[80%] max-w-[300px] bg-[#0d1117] border-l border-white/10 shadow-2xl transition-transform duration-500 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-end mb-8">
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400"><X size={28}/></button>
            </div>

            {/* Profile Section */}
            <div className="mb-10 p-4 bg-white/5 rounded-2xl border border-white/5">
              {isStoreRegistered ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-black">
                    <Store size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-emerald-500 uppercase">Manager</p>
                    <p className="text-white font-bold truncate">{storeData?.store_name || 'My Store'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-300">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-white font-bold">Guest User</p>
                    <p className="text-xs text-slate-500">Sign in to sync data</p>
                  </div>
                </div>
              )}
            </div>

            {/* Nav Links - Aligned Vertically */}
            <div className="space-y-4 flex-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Main Menu</p>
              
              <button onClick={() => navTo('/')} className="mobile-link">
                <div className="flex items-center gap-3">
                  <Receipt size={20} className="text-emerald-500" />
                  <span>Dashboard</span>
                </div>
                <ChevronRight size={16} className="text-slate-600" />
              </button>

              <button onClick={() => navTo('/create')} className="mobile-link">
                <div className="flex items-center gap-3">
                  <PlusCircle size={20} className="text-emerald-500" />
                  <span>New Receipt</span>
                </div>
                <ChevronRight size={16} className="text-slate-600" />
              </button>

              <button onClick={() => navTo('/verify')} className="mobile-link">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-emerald-500" />
                  <span>Verify Engine</span>
                </div>
                <ChevronRight size={16} className="text-slate-600" />
              </button>

              <button onClick={() => navTo('/feedback')} className="mobile-link">
                <div className="flex items-center gap-3">
                  <MessageSquare size={20} className="text-emerald-500" />
                  <span>Give Feedback</span>
                </div>
                <ChevronRight size={16} className="text-slate-600" />
              </button>
            </div>

            {/* Bottom Action */}
            {!isStoreRegistered && (
              <button 
                onClick={() => { onLoginClick?.(); setIsMobileMenuOpen(false); }}
                className="w-full mt-auto bg-emerald-500 py-4 rounded-2xl text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <LogIn size={18} /> SIGN IN / REGISTER
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .mobile-link {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 1rem;
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .mobile-link:active {
          background: rgba(16,185,129,0.1);
          border-color: rgba(16,185,129,0.2);
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
};

export default Header;