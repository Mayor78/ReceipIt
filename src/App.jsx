import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabaseClient';

// Import pages directly
import HomePage from './pages/HomePage';
import ReceiptApp from './pages/ReceiptApp';

// Import components directly
import InstallPrompt from './components/InstallPrompt';
import SimpleHeader from './components/home/SimplaHeader';
import StoreRegistrationModal from './components/StoreRegistrationModal';
import FeedbackButton from './components/FeedbackButton';
import FeedbackModal from './components/FeedbackModal';
import PageLoader from "./components/PageLoader"

// Import context
import { ReceiptProvider, useReceipt } from './context/ReceiptContext';
import VerificationPage from './pages/VerificationPage';
import HistoryPage from './pages/HistoryPage';
import { Receipt } from 'lucide-react';
import FeedbackPage from './pages/FeedbackPage';
import AnalyticsDashboard from './components/AnalyticsDashboard';

// Import tracking hook
import { useTracking } from './hooks/useTracking';



// Main Layout with Header
function MainLayout({ children, user, store, onRegisterClick, navigateToVerification, navigateToHistory, navigateToFeedback }) {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="sticky top-0 left-0 right-0 z-50">
        <SimpleHeader
          isStoreRegistered={!!store}
          storeData={store}
          onRegisterClick={onRegisterClick}
          isSubscribed={!!user}
          onNavigateToVerification={navigateToVerification}
          onNavigateToHistory={navigateToHistory}
          onNavigateToFeedback={navigateToFeedback}
        />
      </div>
      
      <Toaster position="top-right" reverseOrder={false} />
      
      <InstallPrompt />
      
      {children}
    </div>
  );
}

// Dashboard Layout (no header)
function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      {children}
    </div>
  );
}

// Navigation Wrapper Component
function NavigationWrapper() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showModal, setShowModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const { syncStoreDataFromRegistration, savedReceipts, receiptData } = useReceipt();

  // Initialize tracking
  const {
    trackClick,
    trackPageView,
    trackReceiptAction,
    trackDownload,
    trackShare,
    trackFeature,
    trackError
  } = useTracking(user, store, savedReceipts?.length || 0);

  // Track page views on route change
  useEffect(() => {
    trackPageView();
  }, [location.pathname, trackPageView]);

  // Track receipt creation
  useEffect(() => {
    if (receiptData?.receiptNumber) {
      trackReceiptAction('create', receiptData);
    }
  }, [receiptData?.receiptNumber, trackReceiptAction]);

  // Check if user has generated 2+ receipts to show feedback modal
  useEffect(() => {
    const receiptCount = savedReceipts?.length || 0;
    
    if (receiptCount >= 2) {
      const hasSeenFeedback = localStorage.getItem('feedback_seen');
      const lastPrompt = localStorage.getItem('feedback_last_prompt');
      const feedbackDisabled = localStorage.getItem('feedback_disabled');
      
      // Don't show if user disabled or already seen recently
      if (feedbackDisabled === 'true') return;
      
      // Show if they haven't seen it or it's been more than 7 days
      if (!hasSeenFeedback || 
          (lastPrompt && Date.now() - parseInt(lastPrompt) > 7 * 24 * 60 * 60 * 1000)) {
        
        // Wait 3 seconds before showing
        const timer = setTimeout(() => {
          setShowFeedbackModal(true);
          localStorage.setItem('feedback_last_prompt', Date.now().toString());
          trackFeature('feedback_prompt', 'show', { receipt_count: receiptCount });
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [savedReceipts, trackFeature]);

  // Load user and store on mount
  useEffect(() => {
    loadUserAndStore();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadStore(session.user.id);
        trackFeature('auth', 'sign_in', { method: 'session' });
      } else {
        setUser(null);
        setStore(null);
        trackFeature('auth', 'sign_out', {});
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserAndStore = async () => {
    try {
      setLoading(true);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      
      if (currentUser) {
        await loadStore(currentUser.id);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      trackError('user_load', error.message, error.stack);
    } finally {
      setLoading(false);
    }
  };

  const loadStore = async (userId) => {
    try {
      const { data } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      setStore(data);
      if (data) {
        syncStoreDataFromRegistration(data);
        trackFeature('store', 'loaded', { store_name: data.store_name });
      }
    } catch (error) {
      console.error('Error loading store:', error);
      trackError('store_load', error.message, error.stack);
    }
  };

  // Update current page based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrentPage('home');
    } else if (path === '/create') {
      setCurrentPage('receipt');
    } else if (path === '/verify') {
      setCurrentPage('verify');
    } else if (path === '/history') {
      setCurrentPage('history');
    } else if (path === '/feedback') {
      setCurrentPage('feedback');
    } else if (path === '/analytics') {
      setCurrentPage('analytics');
    }
  }, [location]);

  const navigateToReceiptApp = () => {
    trackClick('navigate_create', 'home_button');
    navigate('/create');
  };

  const navigateToVerification = () => {
    trackClick('navigate_verify', 'header_button');
    navigate('/verify');
  };

  const navigateToHistory = () => {
    trackClick('navigate_history', 'navigation');
    navigate('/history');
  };

  const navigateToFeedback = () => {
    trackClick('navigate_feedback', 'navigation');
    navigate('/feedback');
  };

  const navigateToAnalytics = () => {
    trackClick('navigate_analytics', 'navigation');
    navigate('/analytics');
  };

  const handleModalClose = (action) => {
    trackFeature('registration_modal', action, {});
    setShowModal(false);
    if (action === 'registered' || action === 'signed_in') {
      loadUserAndStore();
    }
  };

  const handleRegisterClick = () => {
    trackClick('open_registration', 'header_button', { user_status: user ? 'logged_in' : 'guest' });
    setShowModal(true);
  };

  const handleFeedbackModalClose = (action) => {
    trackFeature('feedback_modal', action, {});
    setShowFeedbackModal(false);
    
    // If user closes without submitting, don't show again for a while
    if (action === 'closed') {
      localStorage.setItem('feedback_last_prompt', Date.now().toString());
    }
    
    // If user submits, mark as seen permanently
    if (action === 'submitted') {
      localStorage.setItem('feedback_seen', 'true');
    }
  };

  // Track downloads (can be passed to child components)
  const handleDownload = (fileType, fileName) => {
    trackDownload(fileType, fileName, 'unknown');
  };

  // Track shares
  const handleShare = (platform, content) => {
    trackShare(platform, content);
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      {/* Store Registration Modal - These are global and should appear on all pages */}
      {showModal && (
        <StoreRegistrationModal
          isOpen={showModal}
          onClose={handleModalClose}
          onRegister={() => {}}
          mode={user ? 'signin' : 'register'}
        />
      )}

      {/* Feedback Modal - Triggered after 2 receipts */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleFeedbackModalClose}
        user={user}
        storeData={store}
        receiptCount={savedReceipts?.length || 0}
      />

      {/* Floating Feedback Button - Global */}
      <FeedbackButton
        user={user}
        storeData={store}
        receiptCount={savedReceipts?.length || 0}
      />
    
      {/* Routes with Layouts */}
      <Routes>
        {/* Routes with Main Layout (with header) */}
        <Route path="/" element={
          <MainLayout 
            user={user}
            store={store}
            onRegisterClick={handleRegisterClick}
            navigateToVerification={navigateToVerification}
            navigateToHistory={navigateToHistory}
            navigateToFeedback={navigateToFeedback}
          >
            <HomePage 
              onGetStarted={navigateToReceiptApp}
              trackClick={trackClick}
            />
          </MainLayout>
        } />
        
        <Route path="/create" element={
          <MainLayout 
            user={user}
            store={store}
            onRegisterClick={handleRegisterClick}
            navigateToVerification={navigateToVerification}
            navigateToHistory={navigateToHistory}
            navigateToFeedback={navigateToFeedback}
          >
            <ReceiptApp 
              trackReceiptAction={trackReceiptAction}
              trackDownload={handleDownload}
              trackShare={handleShare}
              trackFeature={trackFeature}
            />
          </MainLayout>
        } />
        
        <Route path="/feedback" element={
          <MainLayout 
            user={user}
            store={store}
            onRegisterClick={handleRegisterClick}
            navigateToVerification={navigateToVerification}
            navigateToHistory={navigateToHistory}
            navigateToFeedback={navigateToFeedback}
          >
            <FeedbackPage 
              user={user}
              storeData={store}
              receiptCount={savedReceipts?.length || 0}
            />
          </MainLayout>
        } />
        
        <Route path="/history" element={
          <MainLayout 
            user={user}
            store={store}
            onRegisterClick={handleRegisterClick}
            navigateToVerification={navigateToVerification}
            navigateToHistory={navigateToHistory}
            navigateToFeedback={navigateToFeedback}
          >
            <HistoryPage />
          </MainLayout>
        } />
        
        <Route path="/verify" element={
          <MainLayout 
            user={user}
            store={store}
            onRegisterClick={handleRegisterClick}
            navigateToVerification={navigateToVerification}
            navigateToHistory={navigateToHistory}
            navigateToFeedback={navigateToFeedback}
          >
            <VerificationPage />
          </MainLayout>
        } />
        
        <Route path="/verify/:id" element={
          <MainLayout 
            user={user}
            store={store}
            onRegisterClick={handleRegisterClick}
            navigateToVerification={navigateToVerification}
            navigateToHistory={navigateToHistory}
            navigateToFeedback={navigateToFeedback}
          >
            <VerificationPage />
          </MainLayout>
        } />
        
        {/* Dashboard Route - No Header */}
        <Route path="/analytics" element={
          <DashboardLayout>
            <AnalyticsDashboard />
          </DashboardLayout>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <ReceiptProvider>
        <NavigationWrapper />
      </ReceiptProvider>
    </Router>
  );
}

export default App;