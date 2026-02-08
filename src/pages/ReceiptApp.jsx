// pages/ReceiptApp.jsx
import React, { useState } from 'react';
import { ReceiptProvider } from '../context/ReceiptContext';
import LogoUpload from '../components/LogoUpload';
import ReceiptForm from '../components/ReceiptForm';
import ReceiptDisplay from '../components/ReceiptDisplay';
import ReceiptHistory from '../components/ReceiptHistory';
import ActionButtons from '../components/ActionButtons';
import { Receipt, History, Settings } from 'lucide-react';
import TemplateSelector from '../components/receiptTemplates/TemplateSelector';

const ReceiptApp = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <ReceiptProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          
          {/* Minimal Header */}
          <div className="bg-white border-b sticky top-0 z-10">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                    <Receipt className="text-white" size={18} />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">Receipt Generator</h1>
                    <p className="text-xs text-gray-500">Create professional receipts</p>
                  </div>
                </div>
                <ActionButtons />
              </div>
            </div>

            {/* Minimal Tabs */}
            <div className="flex border-t">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'create'
                    ? 'border-green-600 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Receipt size={16} />
                <span>Create</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'history'
                    ? 'border-green-600 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <History size={16} />
                <span>History</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-green-600 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* CREATE TAB */}
            {activeTab === 'create' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4">
                  
                  {/* Logo Upload */}
                  <div className="bg-white ">
                    <div className="px-4 py-2 border-b bg-gray-50">
                      <h2 className="text-sm font-semibold text-gray-900">Company Logo</h2>
                    </div>
                    <div className="p-4">
                      <LogoUpload />
                    </div>
                  </div>
                  
                  {/* Template Selector */}
                  <div className="bg-white ">
                    <div className="px-4 py-2 border-b bg-gray-50">
                      <h2 className="text-sm font-semibold text-gray-900">Choose Template</h2>
                    </div>
                    <div className="p-4">
                      <TemplateSelector />
                    </div>
                  </div>
                  
                  {/* Receipt Form */}
                  <div className="bg-white ">
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
                  <div className="sticky top-20">
                    <div className="bg-white ">
                      <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900">Preview</h2>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
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
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
              <div className="bg-white ">
                <div className="px-4 py-2 border-b bg-gray-50">
                  <h2 className="text-sm font-semibold text-gray-900">Receipt History</h2>
                </div>
                <div className="p-4">
                  <ReceiptHistory />
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="bg-white ">
                <div className="px-4 py-2 border-b bg-gray-50">
                  <h2 className="text-sm font-semibold text-gray-900">Settings</h2>
                </div>
                <div className="p-4">
                  <LogoUpload />
                </div>
              </div>
            )}
          </div>

          {/* Minimal Footer */}
          <div className="px-4 py-3 border-t bg-white">
            <p className="text-center text-xs text-gray-500">
              Built by mayordev • v2.0
            </p>
          </div>
        </div>
      </div>
    </ReceiptProvider>
  );
};

export default ReceiptApp;