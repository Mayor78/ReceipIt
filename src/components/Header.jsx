import React from 'react';
import { Receipt, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="mb-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
            <Receipt size={40} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
           Receipt Generator, Receipt it 
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
          Create professional receipts, invoices, and quotes for your  business
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-green-700 font-medium">
          <Sparkles size={16} />
          <span>VAT Compliant • Naira Currency • Print Ready</span>
          <Sparkles size={16} />
        </div>
      </div>
    </header>
  );
};

export default Header;