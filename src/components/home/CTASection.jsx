// components/home/CTASection.jsx
import React from 'react';

const CTASection = ({ onGetStarted }) => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 md:p-12 shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Create Professional Receipts?
        </h2>
        <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of businesses using ReceiptIt to streamline their documentation
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Creating Free Now
          </button>
          <button
            onClick={onGetStarted}
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
          >
            Try Demo First
          </button>
        </div>
        <p className="text-green-200 text-sm mt-6">
          No credit card required • 100% free forever • 100% private
        </p>
      </div>
    </div>
  );
};

export default CTASection;