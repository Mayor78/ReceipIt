import React, { useState, useEffect } from 'react';
import { Receipt, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleVerifyClick = () => {
    navigate('/verify');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md border-b border-gray-100/80 shadow-sm' 
        : 'bg-white border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Clickable to go home */}
          <button 
            onClick={handleHomeClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
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
          </button>

          {/* Verification Button */}
          <button
            onClick={handleVerifyClick}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${
              isScrolled
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100'
                : 'bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 text-green-800 hover:from-green-200 hover:to-emerald-200'
            } shadow-sm hover:shadow`}
          >
            <Shield className="w-4 h-4" />
            <span className="font-medium text-sm">Verify Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;