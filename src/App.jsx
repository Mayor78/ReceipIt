import React, { useState } from 'react';
import { ReceiptProvider } from './context/ReceiptContext';
import Header from './components/Header';
import TemplateSelector from './components/TemplateSelector';
import LogoUpload from './components/LogoUpload';
import ReceiptForm from './components/ReceiptForm';
import ReceiptDisplay from './components/ReceiptDisplay';
import ReceiptHistory from './components/ReceiptHistory';
import ActionButtons from './components/ActionButtons';
import { FileText, History, Settings, Receipt } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <ReceiptProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Header />
          
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === 'create'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Receipt size={20} />
                <span>Create Receipt</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <History size={20} />
                <span>History ({/* Add count here */})</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Controls */}
              <div className="lg:col-span-2 space-y-8">
                {/* Logo Upload Section */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <LogoUpload />
                </div>
                
                {/* Template Selector */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <TemplateSelector />
                </div>
                
                {/* Receipt Form */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Receipt Details
                    </h2>
                    <ActionButtons />
                  </div>
                  <ReceiptForm />
                </div>
              </div>

              {/* Right Column: Preview */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <ReceiptDisplay />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-8">
              <ReceiptHistory />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
              <div className="space-y-6">
                <LogoUpload />
                {/* Add more settings here */}
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Built with ❤️ using Vite, React & Tailwind CSS
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Features: Logo Upload • PDF Export • Receipt History • Multiple Templates
            </p>
          </footer>
        </div>
      </div>
    </ReceiptProvider>
  );
}

export default App;