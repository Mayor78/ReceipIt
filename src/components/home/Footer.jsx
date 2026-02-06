// components/home/Footer.jsx
import React from 'react';
import { Receipt, Coffee, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="pt-12 pb-8 px-4 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Receipt className="text-green-600" size={20} />
              </div>
              <span className="text-xl font-bold text-gray-800">ReceiptIt</span>
            </div>
            <p className="text-gray-600 text-sm">
              Professional receipt generator for Nigerian businesses
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => window.open('https://paystack.shop/pay/mvvrth6y8d', '_blank')}
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Coffee size={18} />
              <span className="text-sm">Buy Coffee</span>
            </button>
            <div className="text-gray-500 text-sm">
              Made with <Heart className="inline text-red-400" size={14} /> by mayordev
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ReceiptIt. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Version 2.0 • 100% Browser Processed • No Server Storage • Your Data Stays Private
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;