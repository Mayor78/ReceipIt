import React, { useState, useEffect } from 'react';

import HomePage from './pages/HomePage';
import ReceiptApp from './pages/ReceiptApp';
import VerificationPage from './pages/VerificationPage'; // Add this import
import InstallPrompt from './components/InstallPrompt';
import SimpleHeader from './components/home/SimplaHeader';
import SubscriptionModal from './components/SubscriptionModal';
import { Toaster } from 'react-hot-toast';
import { useSubscription } from './hooks/useSubscription';
import { useLocation, useNavigate, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Navigation Wrapper Component
function NavigationWrapper() {
  const [currentPage, setCurrentPage] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    showModal,
    handleCloseModal,
    handleSubscribe,
    trackEvent,
    getUserId 
  } = useSubscription();

  // Update current page based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrentPage('home');
    } else if (path === '/create') {
      setCurrentPage('receipt');
    } else if (path === '/verify') {
      setCurrentPage('verify');
    }
  }, [location]);

  useEffect(() => {
    trackEvent('page_view', { page: currentPage, path: location.pathname });
  }, [currentPage, location.pathname, trackEvent]);

  const navigateToReceiptApp = () => {
    trackEvent('navigate_to_receipt_app');
    navigate('/create');
  };

  const navigateToHome = () => {
    trackEvent('navigate_to_home');
    navigate('/');
  };

  const navigateToVerification = () => {
    trackEvent('navigate_to_verification');
    navigate('/verify');
  };

  // Track user actions
  useEffect(() => {
    const trackActions = () => {
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
        <SimpleHeader onNavigateToVerification={navigateToVerification} />
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

      {/* Navigation Header - Show on receipt and verification pages */}
      {(currentPage === 'receipt' || currentPage === 'verify') && (
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
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={navigateToReceiptApp}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'receipt' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Create Receipt
                </button>
                <button
                  onClick={navigateToVerification}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'verify' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Verify Receipt
                </button>
              </div>
              
              <span className="text-sm text-gray-500">
                {currentPage === 'receipt' ? 'Receipt Generator' : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<HomePage onGetStarted={navigateToReceiptApp} />} />
        <Route path="/create" element={<ReceiptApp />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/verify/:id" element={<VerificationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <NavigationWrapper />
    </Router>
  );
}

export default App;