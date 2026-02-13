// pages/ReceiptApp.jsx
import React from 'react';
import { ReceiptProvider } from '../context/ReceiptContext';
import LogoUpload from '../components/LogoUpload';
import ReceiptForm from '../components/ReceiptForm';
import ReceiptDisplay from '../components/ReceiptDisplay';
import TemplateSelector from '../components/receiptTemplates/TemplateSelector';
import { useNavigate } from 'react-router-dom';
import { History, Settings } from 'lucide-react';

const ReceiptApp = () => {
  const navigate = useNavigate();

  return (
    <ReceiptProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          
          {/* Simple Header */}
          <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
            <div className="px-4 py-3 flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Create Receipt</h1>
              
              {/* Navigation Icons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate('/history')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="View history"
                >
                  <History size={20} className="text-gray-700" />
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Settings"
                >
                  <Settings size={20} className="text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-3 md:p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
              
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-3 md:space-y-4">
                
                {/* Logo Upload */}
                <div className="bg-white rounded-lg border shadow-sm">
                  <div className="px-4 py-2 border-b bg-gray-50 rounded-t-lg">
                    <h2 className="text-sm font-semibold text-gray-900">Company Logo</h2>
                  </div>
                  <div className="p-4">
                    <LogoUpload />
                  </div>
                </div>
                
                {/* Template Selector */}
                <div className="bg-white rounded-lg border shadow-sm">
                  <div className="px-4 py-2 border-b bg-gray-50">
                    <h2 className="text-sm font-semibold text-gray-900">Choose Template</h2>
                  </div>
                  <div className="p-4">
                    <TemplateSelector />
                  </div>
                </div>
                
                {/* Receipt Form */}
                <div className="bg-white rounded-lg border shadow-sm">
                  <div className="px-4 py-2 border-b bg-gray-50">
                    <h2 className="text-sm font-semibold text-gray-900">Receipt Details</h2>
                  </div>
                  <div className="p-4">
                    <ReceiptForm />
                  </div>
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24">
                  <div className="bg-white rounded-lg border shadow-sm">
                    <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between rounded-t-lg">
                      <h2 className="text-sm font-semibold text-gray-900">Preview</h2>
                      <div className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-500">Live</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <ReceiptDisplay />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Footer */}
          <div className="px-4 py-4 border-t bg-white mt-4">
            <p className="text-center text-xs text-gray-500">
              Built with 💚 by <span className="font-semibold text-gray-700">mayordev</span>
            </p>
          </div>
        </div>
      </div>
    </ReceiptProvider>
  );
};

export default ReceiptApp;