import React, { useState, useEffect, useRef } from 'react';
import { Receipt, Shield, Store, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ 
  isStoreRegistered, 
  storeData, 
  onRegisterClick,
 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const scrollTimeout = useRef(null);
  const resizeTimeout = useRef(null);

  // ✅ FIXED: Throttled scroll handler - NO forced reflow
  useEffect(() => {
    const handleScroll = () => {
      // Cancel previous timeout
      if (scrollTimeout.current) {
        cancelAnimationFrame(scrollTimeout.current);
      }
      
      // Use requestAnimationFrame to batch reads
      scrollTimeout.current = requestAnimationFrame(() => {
        const scrolled = window.scrollY > 10;
        setIsScrolled(scrolled);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        cancelAnimationFrame(scrollTimeout.current);
      }
    };
  }, []);

  // ✅ FIXED: Debounced resize handler
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
      
      resizeTimeout.current = setTimeout(() => {
        if (window.innerWidth >= 768) {
          setIsMobileMenuOpen(false);
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
    };
  }, []);

  // ✅ FIXED: NO forced reflow - use class toggling instead of direct style
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.documentElement.classList.add('mobile-menu-open');
    } else {
      document.documentElement.classList.remove('mobile-menu-open');
    }
    
    return () => {
      document.documentElement.classList.remove('mobile-menu-open');
    };
  }, [isMobileMenuOpen]);

  // ✅ REMOVED: console.log that was causing unnecessary renders
  // useEffect with console.log removed

  const handleVerifyClick = () => {
    navigate('/verify');
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };
  const handleCreateClick = () =>{
    navigate('/create');
    setIsMobileMenuOpen(false)
  }

  const handleStoreClick = () => {
    if (onRegisterClick) {
      onRegisterClick();
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' 
          : 'bg-white border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <button 
              onClick={handleHomeClick}
              className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-lg"
              aria-label="Go to homepage"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-sm" aria-hidden="true"></div>
                <div className="relative bg-green-600 p-2 rounded-xl shadow-md">
                  <Receipt className="text-white" size={20} aria-hidden="true" />
                </div>
              </div>
              
              <div>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-700 via-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  ReceiptIt
                </span>
                <p className="text-[9px] md:text-xs text-gray-500 -mt-0.5">
                  Receipt Generator
                </p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              
              {/* Store Status */}
              {isStoreRegistered ? (
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">
                    {storeData?.storeName || 'Store'} • Verified
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleStoreClick}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Register your store"
                >
                  <Store className="w-4 h-4" aria-hidden="true" />
                  <span className="font-medium text-sm">Register Store</span>
                </button>
              )}

              {/* Verify Receipt Button */}
              <button
                onClick={handleVerifyClick}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Verify a receipt"
              >
                <Shield className="w-4 h-4" aria-hidden="true" />
                <span className="font-medium text-sm">Verify Receipt</span>
              </button>
                <button
                onClick={handleCreateClick}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Verify a receipt"
              >
                <Shield className="w-4 h-4" aria-hidden="true" />
                <span className="font-medium text-sm">Create Receipt</span>
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-gray-700" aria-hidden="true" />
              ) : (
                <Menu size={24} className="text-gray-700" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div
          className={`absolute top-[61px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="px-4 py-6 space-y-3">
            
            {/* Store Status - Mobile */}
            {isStoreRegistered ? (
              <div className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">
                  {storeData?.storeName || 'Store'} • Verified
                </span>
              </div>
            ) : (
              <button
                onClick={handleStoreClick}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Register your store"
              >
                <Store className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">Register Store</span>
              </button>
            )}

            {/* Verify Receipt - Mobile */}
            <button
              onClick={handleVerifyClick}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="Verify a receipt"
            >
              <Shield className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">Verify Receipt</span>
            </button>
               <button
                onClick={handleCreateClick}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Verify a receipt"
              >
                <Shield className="w-4 h-4" aria-hidden="true" />
                <span className="font-medium text-sm">Create Receipt</span>
              </button>
          </div>
        </div>
      </div>

      {/* ✅ Add CSS class instead of inline style */}
      <style>{`
        .mobile-menu-open {
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Header;