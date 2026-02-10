import React, { useState } from 'react';
import { X, Mail, Check, Sparkles, Gift, Zap } from 'lucide-react';
import Swal from 'sweetalert2';

const SubscriptionModal = ({ isOpen, onClose, onSubscribe, trackEvent, getUserId }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const SUBSCRIBERS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwZvpQpjuwsA65u0cDMMYnORDSFWtQSs7ZnlWkeGFof0wlRcJyjqB5HEWw3sUtH9t8FpQ/exec';

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
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        title: 'Invalid Email',
        text: 'Please enter a valid email address',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#059669'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await trackUserAction('subscribed', email);
      
      localStorage.setItem('receiptit_subscribed', 'true');
      localStorage.setItem('receiptit_subscriber_email', email);
      localStorage.setItem('receiptit_subscribed_date', new Date().toISOString());
      
      setIsSubmitted(true);
      
      await Swal.fire({
        title: '🎉 Welcome!',
        text: "You're now subscribed to ReceiptIt updates",
        icon: 'success',
        confirmButtonText: 'Get Started',
        confirmButtonColor: '#059669',
        timer: 3000
      });
      
      if (onSubscribe) await onSubscribe(email);
      
      setTimeout(() => {
        if (typeof onClose === 'function') onClose('subscribed');
      }, 1000);
      
    } catch (error) {
      console.error('Error:', error);
      
      localStorage.setItem('receiptit_subscribed', 'true');
      localStorage.setItem('receiptit_subscriber_email', email);
      setIsSubmitted(true);
      
      Swal.fire({
        title: 'Subscribed!',
        text: 'Your subscription has been recorded.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#059669',
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
    if (typeof onClose === 'function') onClose('maybe_later');
  };

  const handleNoThanks = () => {
    trackUserAction('no_thanks');
    if (typeof onClose === 'function') onClose('no_thanks');
  };

  const handleClose = () => {
    trackUserAction('closed');
    if (typeof onClose === 'function') onClose('closed_without_action');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X size={20} className="text-gray-600" />
          </button>

          {isSubmitted ? (
            /* Success State */
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">You're All Set! 🎉</h3>
              <p className="text-gray-600 mb-4">
                Welcome to the ReceiptIt community
              </p>
              <div className="bg-green-50 rounded-lg p-4 text-sm text-green-800">
                Check your email for a confirmation message
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center border-b">
                <div className="mx-auto w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mb-4">
                  <Sparkles size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Stay Updated
                </h2>
                <p className="text-gray-600">
                  Get the latest features and templates
                </p>
              </div>
              
              {/* Content */}
              <div className="p-8">
                
                {/* Benefits */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Zap size={14} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        <strong className="text-gray-900">Early Access</strong> to new features
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Gift size={14} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        <strong className="text-gray-900">Free Templates</strong> every month
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check size={14} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        <strong className="text-gray-900">No Spam</strong> - unsubscribe anytime
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        required
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                  </div>
                  
                  {/* Primary Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subscribing...
                      </span>
                    ) : (
                      'Subscribe for Free'
                    )}
                  </button>
                  
                  {/* Secondary Actions */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleMaybeLater}
                      className="w-full py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                    >
                      Maybe later
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleNoThanks}
                      className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      No thanks
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Footer */}
              <div className="px-8 py-4 bg-gray-50 border-t text-center">
                <p className="text-xs text-gray-500">
                  We respect your privacy. Unsubscribe anytime. 
                  <a href="#" className="text-green-600 hover:underline ml-1">Privacy Policy</a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;