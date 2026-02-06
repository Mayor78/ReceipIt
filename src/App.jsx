// App.js
import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import ReceiptApp from './pages/ReceiptApp';
import InstallPrompt from './components/InstallPrompt';
import { Toaster } from 'react-hot-toast';
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateToReceiptApp = () => {
    setCurrentPage('receipt');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Toaster position="top-right" reverseOrder={false} />
      <InstallPrompt/>
      {/* Navigation Header */}
      {currentPage === 'receipt' && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={navigateToHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </button>
              <span className="text-sm text-gray-500">Receipt Generator</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {currentPage === 'home' ? (
        <HomePage onGetStarted={navigateToReceiptApp} />
      ) : (
        <ReceiptApp />
      )}
    </div>
  );
}

export default App;











