import React, { useState, useEffect } from 'react';
import { X, Store, Mail, Phone, Lock, Shield, RefreshCw, AlertCircle, Eye, EyeOff, ArrowRight, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../lib/supabaseClient';

const StoreRegistrationModal = ({ 
  isOpen, 
  onClose, 
  onRegister,
  mode = 'register' 
}) => {
  // ============================================
  // LOGIC REMAINS UNTOUCHED
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
  const [isSignInMode, setIsSignInMode] = useState(mode === 'signin');

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

  const checkStoreAvailability = async (name) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('id')
        .ilike('store_name', name.trim())
        .maybeSingle();
      if (error) throw error;
      return !data;
    } catch (error) {
      console.error('Availability check error:', error);
      return false;
    }
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { data: storeData } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', authData.user.id)
          .single();
        localStorage.setItem('receiptit_store_name', storeName.trim());
        localStorage.setItem('receiptit_store_email', email.trim().toLowerCase());
        localStorage.setItem('receiptit_store_phone', phoneNumber.trim());
        localStorage.setItem('receiptit_store_address', address.trim());
        localStorage.setItem('receiptit_store_registered', 'true');
        localStorage.setItem('receiptit_store_id', storeData?.id || '');
        localStorage.setItem('receiptit_store_registered_date', new Date().toISOString());
        await Swal.fire({
          title: '✅ Store Registered!',
          html: `<div style="text-align: center;"><div style="font-size: 48px; margin-bottom: 16px;">🏪</div><h3>${storeName.trim()}</h3><p style="color: #666;">Protected against fraud.</p></div>`,
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
      Swal.fire({ title: '❌ Registration Failed', text: errorMessage, icon: 'error', confirmButtonColor: '#4f46e5' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });
      if (error) throw error;
      const { data: storeData } = await supabase.from('stores').select('*').eq('user_id', data.user.id).single();
      if (storeData) {
        localStorage.setItem('receiptit_store_name', storeData.store_name);
        localStorage.setItem('receiptit_store_email', email.trim().toLowerCase());
        localStorage.setItem('receiptit_store_phone', storeData.phone || '');
        localStorage.setItem('receiptit_store_address', storeData.address || '');
        localStorage.setItem('receiptit_store_registered', 'true');
        localStorage.setItem('receiptit_store_id', storeData.id);
      }
      await Swal.fire({
        title: '✅ Welcome Back!',
        html: `<div style="text-align: center;"><div style="font-size: 48px; margin-bottom: 16px;">👋</div><h3>${storeData?.store_name || 'Your Store'}</h3><p style="color: #666;">Signed in.</p></div>`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      if (onRegister) await onRegister(data);
      onClose('signed_in');
    } catch (error) {
      console.error('Sign in error:', error);
      Swal.fire({ title: '❌ Sign In Failed', text: error.message || 'Invalid email or password', icon: 'error', confirmButtonColor: '#4f46e5' });
    } finally {
      setIsLoading(false);
    }
  };

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
      Swal.fire({ title: '📧 Reset Sent', text: `Check ${email} for instructions.`, icon: 'success', confirmButtonColor: '#4f46e5' });
    } catch (error) {
      Swal.fire({ title: '❌ Failed', text: error.message, icon: 'error', confirmButtonColor: '#4f46e5' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isSignInMode) { await handleSignIn(); } else { await handleRegister(); }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) { newErrors.email = 'Email is required'; } else if (!validateEmail(email)) { newErrors.email = 'Invalid email'; }
    if (!password) { newErrors.password = 'Password is required'; } else if (!isSignInMode && password.length < 6) { newErrors.password = 'Password must be at least 6 characters'; }
    if (!isSignInMode) {
      if (!storeName.trim()) { newErrors.storeName = 'Store name is required'; } else if (storeName.trim().length < 3) { newErrors.storeName = 'At least 3 characters'; }
      if (password !== confirmPassword) { newErrors.confirmPassword = 'Passwords do not match'; }
      if (!acceptTerms) { newErrors.terms = 'You must accept the terms'; }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  // ============================================
  // MODERN UI RENDER
  // ============================================
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Animated Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" 
        onClick={() => onClose('closed')} 
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[480px] overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Decorative Top Accent */}
        <div className={`h-2 w-full ${isSignInMode ? 'bg-indigo-600' : 'bg-emerald-600'} transition-colors duration-500`} />

        <button 
          onClick={() => onClose('closed')}
          className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-all active:scale-90 z-20"
        >
          <X size={18} className="text-gray-400" />
        </button>
        
        {/* Modern Header Section */}
        <div className="p-8 pb-4 text-center">
          <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 shadow-lg ${isSignInMode ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {isSignInMode ? <Lock size={32} /> : <Store size={32} />}
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {isSignInMode ? 'Welcome Back' : 'Create Your Store'}
          </h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            {isSignInMode 
              ? 'Enter your credentials to manage your receipts' 
              : 'Join thousands of businesses securing their transactions'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          <div className="grid grid-cols-1 gap-4">
            {/* Store Name */}
            {!isSignInMode && (
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-gray-700 ml-1 uppercase tracking-wider">Store Identity</label>
                <div className="relative group">
                  <Store size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Enter store name"
                    className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:ring-4 transition-all outline-none ${
                      errors.storeName ? 'border-red-100 ring-red-50 focus:border-red-500' : 'border-transparent focus:ring-emerald-50 focus:border-emerald-500'
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.storeName && <p className="text-xs text-red-500 font-bold ml-2">{errors.storeName}</p>}
              </div>
            )}
            
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-gray-700 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@store.com"
                  className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:ring-4 transition-all outline-none ${
                    errors.email ? 'border-red-100 ring-red-50 focus:border-red-500' : 'border-transparent focus:ring-indigo-50 focus:border-indigo-500'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 font-bold ml-2">{errors.email}</p>}
            </div>
            
            {/* Password Grid */}
            <div className={`grid gap-4 ${!isSignInMode ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-gray-700 ml-1 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border-2 rounded-2xl focus:bg-white transition-all outline-none ${
                      errors.password ? 'border-red-500' : 'border-transparent focus:border-indigo-500'
                    }`}
                    disabled={isLoading}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isSignInMode && (
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-700 ml-1 uppercase tracking-wider">Confirm</label>
                  <div className="relative group">
                    <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 transition-all outline-none"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}
            </div>

            {!isSignInMode && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">Phone</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-11 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">Location</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-11 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isSignInMode && (
            <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-5 h-5 text-emerald-600 border-emerald-200 rounded-lg focus:ring-emerald-500"
              />
              <label htmlFor="terms" className="text-xs text-emerald-900 leading-relaxed font-medium">
                I verify that I am the authorized owner of this business entity.
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full relative py-4 px-6 rounded-2xl font-black text-white shadow-xl transform transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 overflow-hidden ${
              isSignInMode ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
            }`}
          >
            {isLoading ? (
              <RefreshCw size={22} className="animate-spin" />
            ) : (
              <>
                <span className="uppercase tracking-widest">{isSignInMode ? 'Sign In' : 'Register Store'}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-100">
            {isSignInMode && (
              <button
                type="button"
                onClick={handlePasswordReset}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Forgot Security Password?
              </button>
            )}
            
            <button
              type="button"
              onClick={() => {
                setIsSignInMode(!isSignInMode);
                setErrors({});
              }}
              className={`text-sm font-black transition-colors ${isSignInMode ? 'text-emerald-600 hover:text-emerald-800' : 'text-indigo-600 hover:text-indigo-800'}`}
            >
              {isSignInMode ? "CREATE A NEW STORE ACCOUNT" : "ALREADY REGISTERED? SIGN IN"}
            </button>
          </div>
        </form>
      </div>
      
      {/* Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default StoreRegistrationModal;