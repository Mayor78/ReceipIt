import React, { useState } from 'react';
import { X, Mail, Check, Users, Download, Coffee, Bell, Zap, Shield } from 'lucide-react';
import Swal from 'sweetalert2';

const SubscriptionModal = ({ isOpen, onClose, onSubscribe, trackEvent, getUserId }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const SUBSCRIBERS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwZvpQpjuwsA65u0cDMMYnORDSFWtQSs7ZnlWkeGFof0wlRcJyjqB5HEWw3sUtH9t8FpQ/exec';

  

  // Simplified tracking - just track the action
  const trackUserAction = async (action, userEmail = '') => {
    try {
      const userId = getUserId ? getUserId() : 'unknown';
      
      const params = new URLSearchParams({
        userId: userId,
        email: userEmail,
        status: action,
        platform: navigator.userAgent.substring(0, 100),
        timestamp: Date.now().toString(),
        source: 'receiptit_modal',
        v: '2.0'
      }).toString();
      
      const pixel = new Image(1, 1);
      pixel.src = `${SUBSCRIBERS_SCRIPT_URL}?${params}`;
      document.body.appendChild(pixel);
      
      setTimeout(() => {
        if (pixel.parentNode) pixel.parentNode.removeChild(pixel);
      }, 2000);
      
      console.log(`Tracked: ${action}`, userEmail ? 'with email' : '');
      
    } catch (error) {
      console.log('Tracking error (non-critical):', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        title: 'Invalid Email',
        text: 'Please enter a valid email address',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Track subscription
      await trackUserAction('subscribed', email);
      
      // Store locally
      localStorage.setItem('receiptit_subscribed', 'true');
      localStorage.setItem('receiptit_subscriber_email', email);
      localStorage.setItem('receiptit_subscribed_date', new Date().toISOString());
      
      setIsSubmitted(true);
      
      // Show success
      await Swal.fire({
        title: '🎉 Welcome to ReceiptIt!',
        html: `
          <div style="text-align: center; padding: 10px;">
            <p>You'll receive:</p>
            <ul style="text-align: left; display: inline-block;">
              <li>✨ New template announcements</li>
              <li>🚀 Early access to features</li>
              <li>💡 Productivity tips</li>
            </ul>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Get Started',
        timer: 4000
      });
      
      // Call parent
      if (onSubscribe) await onSubscribe(email);
      
      // Close
      setTimeout(() => {
        if (typeof onClose === 'function') onClose('subscribed');
      }, 1000);
      
    } catch (error) {
      console.error('Error:', error);
      
      // Still mark as subscribed locally
      localStorage.setItem('receiptit_subscribed', 'true');
      localStorage.setItem('receiptit_subscriber_email', email);
      setIsSubmitted(true);
      
      Swal.fire({
        title: 'Subscribed!',
        text: 'Your subscription has been recorded.',
        icon: 'info',
        confirmButtonText: 'OK',
        timer: 3000
      });
      
      setTimeout(() => {
        if (typeof onClose === 'function') onClose('subscribed');
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaybeLater = () => {
    trackUserAction('maybe_later');
    
    // Use the enhanced onClose with reason
    if (typeof onClose === 'function') {
      onClose('maybe_later');
    }
  };

  const handleNoThanks = () => {
    trackUserAction('no_thanks');
    
    // Use the enhanced onClose with reason
    if (typeof onClose === 'function') {
      onClose('no_thanks');
    }
  };

  const handleClose = () => {
    trackUserAction('closed');
    
    // Use the enhanced onClose with reason
    if (typeof onClose === 'function') {
      onClose('closed_without_action');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Bell size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Don't Miss Updates!</h2>
                  <p className="text-blue-100 text-sm">Join our community</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You! 🎉</h3>
                <p className="text-gray-600 mb-4">
                  You're now subscribed to ReceiptIt updates.
                </p>
                <div className="text-sm text-gray-500">
                  <p>Check your email for confirmation.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Benefits with icons */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Subscribe for:
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg mt-1">
                        <Zap size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">New Features</h4>
                        <p className="text-sm text-gray-600">Be first to try new templates and tools</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-purple-50 rounded-lg mt-1">
                        <Download size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Free Templates</h4>
                        <p className="text-sm text-gray-600">Get exclusive receipt templates monthly</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-50 rounded-lg mt-1">
                        <Shield size={16} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">No Spam</h4>
                        <p className="text-sm text-gray-600">1-2 emails per month, unsubscribe anytime</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Email Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Your best email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@work.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-6 text-center">
                    Join 2,500+ professionals already subscribed
                  </div>
                  
                  {/* Primary Action */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg mb-3"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subscribing...
                      </span>
                    ) : (
                      'Subscribe for Updates'
                    )}
                  </button>
                  
                  {/* Secondary Actions */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleMaybeLater}
                      className="w-full py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Maybe later
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleNoThanks}
                      className="w-full py-2.5 text-gray-500 hover:text-gray-700 text-sm hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      No thanks, I don't want updates
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="text-center text-xs text-gray-500">
              <p>We respect your privacy. No spam, unsubscribe anytime.</p>
              <p className="mt-1">
                By subscribing, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;