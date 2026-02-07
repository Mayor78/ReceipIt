// pages/ReceiptApp.jsx
import React, { useState } from 'react';
import { ReceiptProvider } from '../context/ReceiptContext';


import LogoUpload from '../components/LogoUpload';
import ReceiptForm from '../components/ReceiptForm';
import ReceiptDisplay from '../components/ReceiptDisplay';
import ReceiptHistory from '../components/ReceiptHistory';
import ActionButtons from '../components/ActionButtons';
import { FileText, History, Settings, Receipt } from 'lucide-react';
import TemplateSelector from '../components/receiptTemplates/TemplateSelector';

const ReceiptApp = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <ReceiptProvider>
      <div className="max-w-7xl mx-auto px-4 py-4 md:p-4">
        {/* Simplified Header for Receipt App */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Receipt Generator
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Create, customize, and download professional receipts
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <ActionButtons />
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors text-sm ${
                  activeTab === 'create'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Receipt size={16} />
                <span>Create Receipt</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors text-sm ${
                  activeTab === 'history'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <History size={16} />
                <span>History</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors text-sm ${
                  activeTab === 'settings'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Logo Upload Section */}
              <div className="bg-white rounded-xl shadow-lg p-5">
                <LogoUpload />
              </div>
              
              {/* Template Selector */}
              <div className="bg-white rounded-xl shadow-lg p-5">
                <TemplateSelector />
              </div>
              
              {/* Receipt Form */}
              <div className="bg-white rounded-xl shadow-lg p-5">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Receipt Details
                </h2>
                <ReceiptForm />
              </div>
            </div>

            {/* Right Column: Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <ReceiptDisplay />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <ReceiptHistory />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Settings</h2>
            <div className="space-y-6">
              <LogoUpload />
              {/* Add more settings here */}
            </div>
          </div>
        )}

        {/* Minimal Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Built with ❤️ by mayordev • Version 2.0
          </p>
        </footer>
      </div>
    </ReceiptProvider>
  );
};

export default ReceiptApp;