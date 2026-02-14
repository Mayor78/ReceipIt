// src/hooks/useTracking.js
import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLocation } from 'react-router-dom';

export const useTracking = (user, store, receiptCount) => {
  const location = useLocation();
  const sessionStartTime = useRef(Date.now());
  const pageStartTime = useRef(Date.now());
  const sessionId = useRef(null);
  const deviceId = useRef(null);

  // Initialize session and device IDs
  useEffect(() => {
    // Get or create device ID
    deviceId.current = localStorage.getItem('device_id');
    if (!deviceId.current) {
      deviceId.current = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('device_id', deviceId.current);
    }

    // Create session ID
    sessionId.current = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStartTime.current = Date.now();

    // Track session start
    trackEvent('session_start', 'session', 'start', 'app_session');

    // Track session end on page unload
    const handleBeforeUnload = () => {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      trackEvent('session_end', 'session', 'end', 'app_session', { session_duration: sessionDuration });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Track page views on route change
  useEffect(() => {
    const timeOnPage = Math.floor((Date.now() - pageStartTime.current) / 1000);
    
    // Track previous page duration
    if (pageStartTime.current) {
      trackEvent('page_exit', 'navigation', 'exit', location.pathname, { time_on_page: timeOnPage });
    }

    // Track new page view
    trackPageView();
    
    // Reset page timer
    pageStartTime.current = Date.now();

    // Track page scroll depth
    const handleScroll = () => {
      const scrollPercent = Math.floor((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > 0 && scrollPercent % 25 === 0) {
        trackEvent('scroll_depth', 'engagement', 'scroll', 'page', { depth: scrollPercent });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  // Get device info
  const getDeviceInfo = useCallback(() => {
    const ua = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
    
    let browser = 'Unknown';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('MSIE') || ua.includes('Trident/')) browser = 'Internet Explorer';

    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'MacOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return {
      user_agent: ua,
      device_type: isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop'),
      browser,
      os,
      screen_size: `${window.screen.width}x${window.screen.height}`
    };
  }, []);

  // Track any event
  const trackEvent = useCallback(async (
    eventType, 
    eventCategory, 
    eventAction, 
    eventLabel, 
    eventValue = {},
    receiptContext = {}
  ) => {
    try {
      const deviceInfo = getDeviceInfo();
      
      const trackingData = {
        user_id: user?.id || deviceId.current,
        store_id: store?.id,
        session_id: sessionId.current,
        event_type: eventType,
        event_category: eventCategory,
        event_action: eventAction,
        event_label: eventLabel,
        event_value: eventValue,
        page_url: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title,
        referrer: document.referrer,
        ...deviceInfo,
        receipt_id: receiptContext.receiptId,
        receipt_count: receiptCount,
        template_used: receiptContext.template,
        is_registered: !!user,
        has_store: !!store,
        timestamp: new Date().toISOString(),
        load_time: performance.now ? Math.floor(performance.now()) : null
      };

      // Send to Supabase
      const { error } = await supabase
        .from('user_tracking')
        .insert([trackingData]);

      if (error) console.error('Tracking error:', error);

      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Track:', { eventType, eventCategory, eventAction, eventLabel, eventValue });
      }

    } catch (error) {
      console.error('Tracking error:', error);
    }
  }, [user, store, receiptCount, getDeviceInfo]);

  // Track page view
  const trackPageView = useCallback(() => {
    trackEvent(
      'page_view',
      'navigation',
      'view',
      window.location.pathname,
      { 
        title: document.title,
        timestamp: Date.now()
      }
    );
  }, [trackEvent]);

  // Track button clicks
  const trackClick = useCallback((buttonName, buttonLocation, additionalData = {}) => {
    trackEvent(
      'click',
      'interaction',
      'click',
      buttonName,
      { location: buttonLocation, ...additionalData }
    );
  }, [trackEvent]);

  // Track receipt actions
  const trackReceiptAction = useCallback((action, receiptData) => {
    trackEvent(
      'receipt_action',
      'receipt',
      action,
      `receipt_${action}`,
      {
        receipt_number: receiptData.receiptNumber,
        total: receiptData.total,
        items_count: receiptData.items?.length
      },
      {
        receiptId: receiptData.receiptNumber,
        template: receiptData.template
      }
    );
  }, [trackEvent]);

  // Track downloads
  const trackDownload = useCallback((fileType, fileName, fileSize) => {
    trackEvent(
      'download',
      'file',
      'download',
      fileType,
      { file_name: fileName, file_size: fileSize }
    );
  }, [trackEvent]);

  // Track shares
  const trackShare = useCallback((platform, content) => {
    trackEvent(
      'share',
      'social',
      'share',
      platform,
      { content_type: content }
    );
  }, [trackEvent]);

  // Track errors
  const trackError = useCallback((errorType, errorMessage, errorStack) => {
    trackEvent(
      'error',
      'error',
      errorType,
      'app_error',
      { message: errorMessage, stack: errorStack }
    );
  }, [trackEvent]);

  // Track feature usage
  const trackFeature = useCallback((featureName, action, details = {}) => {
    trackEvent(
      'feature_usage',
      'feature',
      action,
      featureName,
      details
    );
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackClick,
    trackReceiptAction,
    trackDownload,
    trackShare,
    trackError,
    trackFeature,
    sessionId: sessionId.current,
    deviceId: deviceId.current
  };
};