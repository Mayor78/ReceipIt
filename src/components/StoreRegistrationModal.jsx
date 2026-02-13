import React, { useState, useEffect } from 'react';
import { X, Store, Mail, Phone, Lock, Shield, RefreshCw, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../lib/supabaseClient';

const StoreRegistrationModal = ({ 
  isOpen, 
  onClose, 
  onRegister,
  mode = 'register' // 'register' or 'signin'
}) => {
  // ============================================
  // STATE
  // ============================================
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Mode toggle
  const [isSignInMode, setIsSignInMode] = useState(mode === 'signin');

  // ============================================
  // RESET FORM WHEN OPENED
  // ============================================
  useEffect(() => {
    if (isOpen) {
      setStoreName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPhoneNumber('');
      setAddress('');
      setAcceptTerms(false);
      setErrors({});
      setIsLoading(false);
      setIsSignInMode(mode === 'signin');
    }
  }, [isOpen, mode]);

  // ============================================
  // CHECK STORE AVAILABILITY
  // ============================================
  const checkStoreAvailability = async (name) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('id')
        .ilike('store_name', name.trim())
        .maybeSingle();
      
      if (error) throw error;
      return !data; // Available if no store found
    } catch (error) {
      console.error('Availability check error:', error);
      return false;
    }
  };

  // ============================================
  // HANDLE REGISTRATION
  // ============================================
  const handleRegister = async () => {
    try {
      setIsLoading(true);
      
      // Check if store name is available
      const available = await checkStoreAvailability(storeName);
      if (!available) {
        Swal.fire({
          title: '❌ Store Name Taken',
          text: 'This store name is already registered. Please choose a different name.',
          icon: 'error',
          confirmButtonColor: '#4f46e5'
        });
        setIsLoading(false);
        return;
      }
      
      // Sign up with Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            store_name: storeName.trim(),
            phone: phoneNumber.trim(),
            address: address.trim()
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      if (authData.user) {
        // Wait a moment for the trigger to create the store
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fetch the store data that was created by trigger
        const { data: storeData } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', authData.user.id)
          .single();
        
        // Save to localStorage for backward compatibility
        localStorage.setItem('receiptit_store_name', storeName.trim());
        localStorage.setItem('receiptit_store_email', email.trim().toLowerCase());
        localStorage.setItem('receiptit_store_phone', phoneNumber.trim());
        localStorage.setItem('receiptit_store_address', address.trim());
        localStorage.setItem('receiptit_store_registered', 'true');
        localStorage.setItem('receiptit_store_id', storeData?.id || '');
        localStorage.setItem('receiptit_store_registered_date', new Date().toISOString());
        
        await Swal.fire({
          title: '✅ Store Registered!',
          html: `
            <div style="text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px;">🏪</div>
              <h3 style="margin-bottom: 8px;">${storeName.trim()}</h3>
              <p style="color: #666; margin-bottom: 16px;">
                Your store is now protected against fraud.
              </p>
            </div>
          `,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        if (onRegister) await onRegister(authData);
        onClose('registered');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = error.message;
      if (error.message.includes('User already registered')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
      }
      
      Swal.fire({
        title: '❌ Registration Failed',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#4f46e5'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // HANDLE SIGN IN
  // ============================================
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });
      
      if (error) throw error;
      
      // Get store details
      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', data.user.id)
        .single();
      
      if (storeData) {
        // Save to localStorage
        localStorage.setItem('receiptit_store_name', storeData.store_name);
        localStorage.setItem('receiptit_store_email', email.trim().toLowerCase());
        localStorage.setItem('receiptit_store_phone', storeData.phone || '');
        localStorage.setItem('receiptit_store_address', storeData.address || '');
        localStorage.setItem('receiptit_store_registered', 'true');
        localStorage.setItem('receiptit_store_id', storeData.id);
      }
      
      await Swal.fire({
        title: '✅ Welcome Back!',
        html: `
          <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">👋</div>
            <h3 style="margin-bottom: 8px;">${storeData?.store_name || 'Your Store'}</h3>
            <p style="color: #666;">
              Successfully signed in.
            </p>
          </div>
        `,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      if (onRegister) await onRegister(data);
      onClose('signed_in');
      
    } catch (error) {
      console.error('Sign in error:', error);
      
      Swal.fire({
        title: '❌ Sign In Failed',
        text: error.message || 'Invalid email or password',
        icon: 'error',
        confirmButtonColor: '#4f46e5'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // HANDLE PASSWORD RESET
  // ============================================
  const handlePasswordReset = async () => {
    if (!email) {
      setErrors({ email: 'Email is required to reset password' });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      Swal.fire({
        title: '📧 Password Reset Email Sent',
        html: `
          <div style="text-align: center;">
            <p>Check your email at <strong>${email}</strong> for reset instructions.</p>
            <p class="text-sm text-gray-500 mt-2">The link expires in 1 hour.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#4f46e5'
      });
      
    } catch (error) {
      console.error('Password reset error:', error);
      Swal.fire({
        title: '❌ Failed to Send Reset Email',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#4f46e5'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // HANDLE SUBMIT
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (isSignInMode) {
      await handleSignIn();
    } else {
      await handleRegister();
    }
  };

  // ============================================
  // VALIDATION
  // ============================================
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!isSignInMode && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isSignInMode) {
      if (!storeName.trim()) {
        newErrors.storeName = 'Store name is required';
      } else if (storeName.trim().length < 3) {
        newErrors.storeName = 'At least 3 characters';
      }
      
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!acceptTerms) {
        newErrors.terms = 'You must accept the terms';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={() => onClose('closed')} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
          
          <button 
            onClick={() => onClose('closed')}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X size={20} className="text-gray-500" />
          </button>
          
          {/* Header */}
          <div className="p-6 pb-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Shield size={24} className="text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isSignInMode ? 'Sign In to Your Store' : 'Register Your Store'}
              </h2>
            </div>
            <p className="text-sm text-gray-500 ml-2">
              {isSignInMode 
                ? 'Access your store to create verified receipts' 
                : 'Get protected against receipt fraud'}
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
            
            {/* Store Name - Only for registration */}
            {!isSignInMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Store size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g., ABC Electronics"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.storeName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                    autoFocus={!isSignInMode}
                  />
                </div>
                {errors.storeName && (
                  <p className="text-xs text-red-500 mt-1">{errors.storeName}</p>
                )}
              </div>
            )}
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@yourstore.com"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                  autoFocus={isSignInMode}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignInMode ? "Enter your password" : "At least 6 characters"}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
            
            {/* Confirm Password - Only for registration */}
            {!isSignInMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}
            
            {/* Phone Number - Only for registration */}
            {!isSignInMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+234 123 456 7890"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
            
            {/* Address - Only for registration */}
            {!isSignInMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Business St, City, Country"
                  rows="2"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              </div>
            )}
            
            {/* Terms - Only for registration */}
            {!isSignInMode && (
              <>
                <div className="flex items-start pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 mr-3 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-600">
                    I confirm that I own this business and have the right to register this store name.
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-xs text-red-500 -mt-2">{errors.terms}</p>
                )}
              </>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>
                  {isSignInMode ? 'Sign In →' : 'Register Store →'}
                </span>
              )}
            </button>
            
            {/* Forgot Password - Only for sign in */}
            {isSignInMode && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={isLoading}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Forgot your password?
                </button>
              </div>
            )}
            
            {/* Toggle between Register/Sign In */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignInMode(!isSignInMode);
                  setErrors({});
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {isSignInMode 
                  ? '← Need a store? Register here' 
                  : 'Already have a store? Sign in'}
              </button>
            </div>
            
            {/* Cancel */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => onClose('cancelled')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default StoreRegistrationModal;