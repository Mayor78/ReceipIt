import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabaseClient';

// Import pages directly (remove lazy loading temporarily to fix the error)
import HomePage from './pages/HomePage';
import ReceiptApp from './pages/ReceiptApp';


// Import components directly
import InstallPrompt from './components/InstallPrompt';
import SimpleHeader from './components/home/SimplaHeader';
import StoreRegistrationModal from './components/StoreRegistrationModal';

// Import context
import { ReceiptProvider, useReceipt } from './context/ReceiptContext';
import VerificationPage from './pages/VerificationPage';
import HistoryPage from './pages/HistoryPage';

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Navigation Wrapper Component
function NavigationWrapper() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const { syncStoreDataFromRegistration } = useReceipt();

  // Load user and store on mount
  useEffect(() => {
    loadUserAndStore();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadStore(session.user.id);
      } else {
        setUser(null);
        setStore(null);
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
      }
    } catch (error) {
      console.error('Error loading store:', error);
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
    }
  }, [location]);

  const navigateToReceiptApp = () => {
    navigate('/create');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToVerification = () => {
    navigate('/verify');
  };

  const handleModalClose = (action) => {
    setShowModal(false);
    if (action === 'registered' || action === 'signed_in') {
      loadUserAndStore();
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="sticky top-0 left-0 right-0 z-50">
        <SimpleHeader
          isStoreRegistered={!!store}
          storeData={store}
          onRegisterClick={() => setShowModal(true)}
          isSubscribed={!!user}
          onNavigateToVerification={navigateToVerification}
        />
      </div>
      
      <Toaster position="top-right" reverseOrder={false} />
      
      <InstallPrompt />
    
      {/* Store Registration Modal */}
      {showModal && (
        <StoreRegistrationModal
          isOpen={showModal}
          onClose={handleModalClose}
          onRegister={() => {}}
          mode={user ? 'signin' : 'register'}
        />
      )}
    
    
      {/* Routes */}
      <Routes>
        <Route path="/" element={
          <HomePage onGetStarted={navigateToReceiptApp} />
        } />
        <Route path="/create" element={<ReceiptApp />} />
        <Route path="/history" element={<HistoryPage />} />
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
      <ReceiptProvider>
        <NavigationWrapper />
      </ReceiptProvider>
    </Router>
  );
}

export default App;