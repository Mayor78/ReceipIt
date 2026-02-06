import React, { useState, useEffect } from 'react';
import { Receipt } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled more than 10px
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md border-b border-gray-100/80 shadow-sm' 
        : 'bg-white border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center sm:justify-start">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            {/* Icon with subtle animation */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-600/30 rounded-xl blur-md"></div>
              <div className={`relative p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-md' 
                  : 'bg-gradient-to-br from-green-600 to-emerald-600'
              }`}>
                <Receipt className="text-white" size={22} />
              </div>
            </div>
            
            {/* Brand */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                <span className={`bg-gradient-to-r transition-all duration-300 ${
                  isScrolled 
                    ? 'from-green-600 via-emerald-600 to-teal-500' 
                    : 'from-green-700 via-emerald-700 to-teal-600'
                } bg-clip-text text-transparent`}>
                  ReceiptIt
                </span>
              </h1>
              <p className={`text-[10px] ml-3 md:text-xs font-medium -mt-0.5 text-end transition-colors duration-300 ${
                isScrolled ? 'text-gray-600' : 'text-gray-500'
              }`}>
                Receipt Generator
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;