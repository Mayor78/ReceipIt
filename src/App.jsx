import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import ReceiptApp from './pages/ReceiptApp';
import InstallPrompt from './components/InstallPrompt';
import SimpleHeader from './components/home/SimplaHeader';
import SubscriptionModal from './components/SubscriptionModal';
import { Toaster } from 'react-hot-toast';
import { useSubscription } from './hooks/useSubscription';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const {
    showModal,
    handleCloseModal,
    handleSubscribe,
    trackEvent,
    getUserId 
  } = useSubscription();

  useEffect(() => {
    // Track page views
    trackEvent('page_view', { page: currentPage });
  }, [currentPage, trackEvent]);

  const navigateToReceiptApp = () => {
    trackEvent('navigate_to_receipt_app');
    setCurrentPage('receipt');
  };

  const navigateToHome = () => {
    trackEvent('navigate_to_home');
    setCurrentPage('home');
  };

  // Track user actions
  useEffect(() => {
    const trackActions = () => {
      // Track print/download actions
      const originalPrint = window.print;
      window.print = function() {
        trackEvent('print_receipt');
        return originalPrint.apply(this, arguments);
      };
    };

    trackActions();
  }, [trackEvent]);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="sticky top-0 left-0 right-0 z-50">
        <SimpleHeader/>
      </div>
      
      <Toaster position="top-right" reverseOrder={false} />
      <InstallPrompt/>
      
      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubscribe={handleSubscribe}
        getUserId={getUserId}  
      />

      {/* Navigation Header */}
      {currentPage === 'receipt' && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={navigateToHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => trackEvent('click_back_to_home')}
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