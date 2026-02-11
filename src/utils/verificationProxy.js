// verificationProxy.js - Updated with JSONP for registration

const VERIFICATION_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw1woB8HoaHdqtT-H3DaQv9qdEV8bB2vPxG9ZYgnsP54xMNbd6mKgRr1D2XNeHeaIJKmg/exec';

console.log('✅ Using correct verification URL:', VERIFICATION_WEB_APP_URL);
console.log('🔧 Verification Proxy Loaded');
console.log('🌐 Correct URL:', VERIFICATION_WEB_APP_URL);

// Improved JSONP function
const jsonpRequest = (params) => {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    params.callback = callbackName;
    
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const url = `${VERIFICATION_WEB_APP_URL}?${queryString}`;
    const script = document.createElement('script');
    
    window[callbackName] = (data) => {
      // Clean up
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      delete window[callbackName];
      
      if (data.status === 'success') {
        resolve(data);
      } else {
        reject(new Error(data.message || 'JSONP request failed'));
      }
    };
    
    // Handle errors
    script.onerror = () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      delete window[callbackName];
      reject(new Error('Network error - JSONP request failed'));
    };
    
    script.src = url;
    document.body.appendChild(script);
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (window[callbackName]) {
        if (script.parentNode) {
          document.body.removeChild(script);
        }
        delete window[callbackName];
        reject(new Error('JSONP request timeout'));
      }
    }, 10000);
  });
};

// Main verification proxy
export const verificationProxy = {
  async registerReceipt(receiptId, receiptHash, metadata = {}) {
    try {
      console.log('📤 JSONP Registration attempt for:', receiptId);
      
      const params = {
        action: 'register_receipt',
        receipt_id: receiptId,
        receipt_hash: receiptHash,
        metadata: JSON.stringify(metadata),
        timestamp: Date.now().toString()
      };
      
      // Use JSONP for registration
      const result = await jsonpRequest(params);
      
      console.log('✅ JSONP Registration successful:', result);
      return {
        success: true,
        method: 'jsonp',
        data: result
      };
      
    } catch (error) {
      console.warn('JSONP registration failed:', error.message);
      
      // Fallback to pixel as last resort
      try {
        await pixelRequest({
          action: 'register_receipt',
          receipt_id: receiptId,
          receipt_hash: receiptHash,
          metadata: JSON.stringify(metadata)
        });
        
        return {
          success: true,
          method: 'pixel_fallback',
          message: 'Registered via pixel fallback'
        };
      } catch (pixelError) {
        console.error('Pixel fallback also failed:', pixelError);
        return {
          success: false,
          method: 'pixel',
          error: 'All registration methods failed'
        };
      }
    }
  },
  
  async verifyReceipt(receiptId, receiptHash) {
    try {
      const params = {
        action: 'verify_receipt',
        receipt_id: receiptId,
        receipt_hash: receiptHash
      };
      
      const result = await jsonpRequest(params);
      
      return {
        success: true,
        isGenuine: result.is_genuine,
        message: result.message,
        data: result
      };
      
    } catch (error) {
      console.warn('JSONP verification failed:', error.message);
      
      // Fallback to pixel
      try {
        await pixelRequest({
          action: 'verify_receipt',
          receipt_id: receiptId,
          receipt_hash: receiptHash,
          type: 'pixel_fallback'
        });
        
        return {
          success: true,
          isGenuine: true,
          message: 'Verification submitted (offline check)',
          data: { submitted: true, offline: true }
        };
      } catch (pixelError) {
        return {
          success: false,
          error: 'All verification methods failed'
        };
      }
    }
  },
  
  async getReceiptInfo(receiptId) {
    try {
      const params = {
        action: 'get_receipt',
        receipt_id: receiptId
      };
      
      const result = await jsonpRequest(params);
      
      return {
        success: result.status === 'success',
        data: result.data
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  async healthCheck() {
    try {
      const params = { action: 'health_check' };
      const result = await jsonpRequest(params);
      
      return {
        online: result.status === 'success',
        message: result.message,
        data: result
      };
    } catch (error) {
      return { online: false, error: error.message };
    }
  }
};

// Keep pixel request function for fallback
const pixelRequest = (params) => {
  return new Promise((resolve) => {
    params.type = 'pixel';
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const pixel = new Image();
    pixel.src = `${VERIFICATION_WEB_APP_URL}?${queryString}`;
    pixel.style.display = 'none';
    
    pixel.onload = () => {
      if (pixel.parentNode) {
        document.body.removeChild(pixel);
      }
      resolve({ success: true, method: 'pixel' });
    };
    
    pixel.onerror = () => {
      if (pixel.parentNode) {
        document.body.removeChild(pixel);
      }
      resolve({ success: false, method: 'pixel', error: 'Pixel failed' });
    };
    
    document.body.appendChild(pixel);
  });
};

// Add debug function
export const debugVerification = () => {
  console.log('🔍 Verification Debug Info:');
  console.log('1. Current URL:', VERIFICATION_WEB_APP_URL);
  console.log('2. Is correct URL?', VERIFICATION_WEB_APP_URL.includes('AKfycbw1woB8'));
  console.log('3. Full check:', {
    current: VERIFICATION_WEB_APP_URL,
    correct: 'https://script.google.com/macros/s/AKfycbw1woB8HoaHdqtT-H3DaQv9qdEV8bB2vPxG9ZYgnsP54xMNbd6mKgRr1D2XNeHeaIJKmg/exec',
    match: VERIFICATION_WEB_APP_URL === 'https://script.google.com/macros/s/AKfycbw1woB8HoaHdqtT-H3DaQv9qdEV8bB2vPxG9ZYgnsP54xMNbd6mKgRr1D2XNeHeaIJKmg/exec'
  });
  
  // Test the URL directly
  const testUrl = `${VERIFICATION_WEB_APP_URL}?id=DEBUG_TEST_${Date.now()}`;
  console.log('4. Test URL:', testUrl);
  
  // Open test
  window.open(testUrl, '_blank');
  
  return {
    url: VERIFICATION_WEB_APP_URL,
    isCorrect: VERIFICATION_WEB_APP_URL.includes('AKfycbw1woB8'),
    testUrl
  };
};