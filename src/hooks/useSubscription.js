// useSubscription.js - FIXED VERSION
import { useState, useEffect } from 'react';

// UPDATE THIS WITH YOUR NEW DEPLOYED URL
const TRACKER_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwZvpQpjuwsA65u0cDMMYnORDSFWtQSs7ZnlWkeGFof0wlRcJyjqB5HEWw3sUtH9t8FpQ/exec';

export const useSubscription = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Helper function: Get user ID
  const getUserId = () => {
    let userId = localStorage.getItem('receiptit_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('receiptit_user_id', userId);
    }
    return userId;
  };

  // FIXED: Simple tracking function
  const trackToScript = (data, type = 'event') => {
    setTimeout(() => {
      try {
        const userId = getUserId();
        
        // Build URL parameters CORRECTLY
        const params = new URLSearchParams();
        params.append('userId', userId);
        params.append('source', 'receiptit_web');
        params.append('t', Date.now().toString());
        
        if (type === 'event') {
          // For events
          params.append('event', data.eventName);
          if (data.eventData && Object.keys(data.eventData).length > 0) {
            params.append('eventData', JSON.stringify(data.eventData));
          }
        } else {
          // For subscribers - THE CRITICAL PART
          params.append('email', data.email || '');
          params.append('status', data.status || 'subscribed');
          // Add platform info
          params.append('platform', navigator.userAgent.substring(0, 100));
        }
        
        const url = `${TRACKER_SCRIPT_URL}?${params.toString()}`;
        console.log(`📤 Sending ${type} to:`, url.substring(0, 150) + '...');
        
        // Use Image pixel method (works best with Google Apps Script)
        const pixel = new Image(1, 1);
        pixel.src = url;
        pixel.style.display = 'none';
        
        document.body.appendChild(pixel);
        
        setTimeout(() => {
          if (pixel.parentNode) {
            pixel.parentNode.removeChild(pixel);
          }
        }, 1000);
        
        console.log(`✅ ${type} sent:`, type === 'event' ? data.eventName : data.email);
        
      } catch (error) {
        console.log(`⚠️ ${type} tracking error:`, error);
      }
    }, 0);
    
    return { success: true };
  };

  // Alias functions
  const trackEvent = (eventName, eventData = {}) => {
    return trackToScript({ eventName, eventData }, 'event');
  };

  const trackSubscription = async (email, status = 'subscribed') => {
    return trackToScript({ email, status }, 'subscriber');
  };

  // Check if modal should be shown
  const checkShouldShowModal = () => {
    const skipUntil = localStorage.getItem('receiptit_skip_until');
    const skipReason = localStorage.getItem('receiptit_skip_reason');
    
    if (skipUntil) {
      const skipDate = new Date(skipUntil);
      const now = new Date();
      
      if (now < skipDate) {
        const hoursLeft = Math.round((skipDate - now) / (1000 * 60 * 60));
        console.log(`Modal skipped (${skipReason}). Showing again in ~${hoursLeft} hours`);
        return false;
      }
    }
    
    return true;
  };

  // Show modal with appropriate delay
  const showModalWithDelay = () => {
    const firstVisit = localStorage.getItem('receiptit_first_visit');
    
    if (!firstVisit) {
      localStorage.setItem('receiptit_first_visit', new Date().toISOString());
      console.log('First visit detected. Showing modal in 2 minutes');
      
      setTimeout(() => {
        if (localStorage.getItem('receiptit_subscribed') !== 'true') {
          setShowModal(true);
          trackEvent('modal_shown', { trigger: 'first_visit_delay' });
        }
      }, 120000);
      
    } else {
      const lastShown = localStorage.getItem('receiptit_modal_last_shown');
      const now = new Date();
      
      if (!lastShown) {
        console.log('Return visit. Showing modal in 10 seconds');
        setTimeout(() => {
          if (localStorage.getItem('receiptit_subscribed') !== 'true') {
            setShowModal(true);
            trackEvent('modal_shown', { trigger: 'return_visit' });
          }
        }, 10000);
        
      } else {
        const lastShownDate = new Date(lastShown);
        const hoursSinceLastShow = (now - lastShownDate) / (1000 * 60 * 60);
        
        if (hoursSinceLastShow >= 24) {
          console.log(`24+ hours since last modal. Showing now`);
          setTimeout(() => {
            if (localStorage.getItem('receiptit_subscribed') !== 'true') {
              setShowModal(true);
              trackEvent('modal_shown', { trigger: 'daily_reminder' });
            }
          }, 5000);
        }
      }
    }
  };

  // Main effect hook
  useEffect(() => {
    const checkAndShowModal = () => {
      if (localStorage.getItem('receiptit_subscribed') === 'true') {
        console.log('User is already subscribed');
        return;
      }
      
      const shouldShow = checkShouldShowModal();
      if (shouldShow) {
        showModalWithDelay();
      }
    };

    // Check if user already subscribed
    const subscribed = localStorage.getItem('receiptit_subscribed') === 'true';
    const email = localStorage.getItem('receiptit_subscriber_email');
    
    if (subscribed && email) {
      setIsSubscribed(true);
      setUserEmail(email);
      console.log('User subscribed:', email);
    }
    
    // Track initial page view
    trackEvent('page_view', {
      path: window.location.pathname,
      referrer: document.referrer || 'direct'
    });
    
    // Initial check
    checkAndShowModal();
    
    // Listen for user activity
    const handleUserActive = () => {
      setTimeout(checkAndShowModal, 1000);
    };
    
    window.addEventListener('focus', handleUserActive);
    window.addEventListener('mousemove', handleUserActive);
    window.addEventListener('keydown', handleUserActive);
    
    return () => {
      window.removeEventListener('focus', handleUserActive);
      window.removeEventListener('mousemove', handleUserActive);
      window.removeEventListener('keydown', handleUserActive);
    };
  }, []);

  // Handle modal close with reason
  const handleCloseModal = (reason = 'closed_without_action') => {
    const now = new Date();
    
    switch(reason) {
      case 'maybe_later':
        const laterDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        localStorage.setItem('receiptit_skip_until', laterDate.toISOString());
        localStorage.setItem('receiptit_skip_reason', 'maybe_later');
        console.log('User clicked "Maybe later". Showing again in 3 days');
        break;
        
      case 'no_thanks':
        const weekDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        localStorage.setItem('receiptit_skip_until', weekDate.toISOString());
        localStorage.setItem('receiptit_skip_reason', 'no_thanks');
        console.log('User clicked "No thanks". Showing again in 7 days');
        break;
        
      case 'closed_without_action':
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        localStorage.setItem('receiptit_skip_until', tomorrow.toISOString());
        localStorage.setItem('receiptit_skip_reason', 'closed');
        console.log('User closed modal. Showing again in 1 day');
        break;
    }
    
    localStorage.setItem('receiptit_modal_last_shown', now.toISOString());
    localStorage.setItem('receiptit_modal_last_action', reason);
    setShowModal(false);
    
    // Track the action
    trackEvent('modal_closed', { action: reason });
  };

  // Handle subscription - FIXED
  const handleSubscribe = async (email) => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    
    setIsSubscribed(true);
    setUserEmail(email);
    setShowModal(false);
    
    // Store subscription
    localStorage.setItem('receiptit_subscribed', 'true');
    localStorage.setItem('receiptit_subscriber_email', email);
    localStorage.setItem('receiptit_subscribed_date', new Date().toISOString());
    
    // Clear any skip preferences
    localStorage.removeItem('receiptit_skip_until');
    localStorage.removeItem('receiptit_skip_reason');
    
    console.log('User subscribed:', email);
    
    // CRITICAL: Track subscription to Google Sheet
    await trackSubscription(email, 'subscribed');
    
    return { success: true };
  };

  // Utility functions
  const triggerModal = () => {
    setShowModal(true);
    trackEvent('modal_triggered_manual');
  };

  const resetPreferences = () => {
    localStorage.removeItem('receiptit_skip_until');
    localStorage.removeItem('receiptit_skip_reason');
    localStorage.removeItem('receiptit_modal_last_shown');
    localStorage.removeItem('receiptit_first_visit');
    localStorage.removeItem('receiptit_subscribed');
    localStorage.removeItem('receiptit_subscriber_email');
    localStorage.removeItem('receiptit_user_id');
    setIsSubscribed(false);
    setUserEmail('');
    console.log('Preferences reset');
  };

  // Test function
  const testConnection = () => {
    // Test 1: Check URL
    console.log('🔗 Tracker URL:', TRACKER_SCRIPT_URL);
    
    // Test 2: Direct fetch test
    fetch(`${TRACKER_SCRIPT_URL}?test=true`)
      .then(res => res.text())
      .then(text => {
        console.log('✅ Test response:', text.substring(0, 200));
      })
      .catch(err => console.error('❌ Test failed:', err));
    
    // Test 3: Send a test subscription
    const testEmail = 'test_' + Date.now() + '@example.com';
    trackSubscription(testEmail, 'test');
    
    return { testing: true };
  };

  return {
    showModal,
    setShowModal,
    isSubscribed,
    userEmail,
    handleCloseModal,
    handleSubscribe,
    trackEvent,
    trackSubscription,
    getUserId,
    triggerModal,
    resetPreferences,
    testConnection
  };
};