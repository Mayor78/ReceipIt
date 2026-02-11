import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
const VERIFICATION_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw1woB8HoaHdqtT-H3DaQv9qdEV8bB2vPxG9ZYgnsP54xMNbd6mKgRr1D2XNeHeaIJKmg/exec';

console.log('✅ Using correct verification URL:', VERIFICATION_WEB_APP_URL);
const ReceiptContext = createContext();

// Updated templates with all 6 styles
const RECEIPT_TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, minimalist design with subtle gradients and shadows',
    previewColor: '#3B82F6',
    icon: 'sparkles',
    category: 'premium',
    features: ['Gradient accents', 'Card layout', 'Modern typography']
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate style with clean lines and formal layout',
    previewColor: '#10B981',
    icon: 'briefcase',
    category: 'business',
    features: ['Corporate branding', 'Formal layout', 'Clean structure']
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with serif fonts and decorative elements',
    previewColor: '#8B5CF6',
    icon: 'diamond',
    category: 'luxury',
    features: ['Serif fonts', 'Decorative lines', 'Premium feel']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-simple design focusing on essential information',
    previewColor: '#6B7280',
    icon: 'minimize',
    category: 'simple',
    features: ['No distractions', 'Essential info only', 'Clean whitespace']
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'High-contrast design with strong typography and colors',
    previewColor: '#EF4444',
    icon: 'zap',
    category: 'creative',
    features: ['High contrast', 'Bold typography', 'Color accents']
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional receipt style with familiar layout',
    previewColor: '#F59E0B',
    icon: 'receipt',
    category: 'standard',
    features: ['Traditional layout', 'Easy to read', 'Familiar format']
  }
];

// Template configuration function
export const getTemplateConfig = (templateId) => {
  const configs = {
    modern: {
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      bgColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      borderRadius: '16px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    professional: {
      primaryColor: '#10B981',
      secondaryColor: '#059669',
      bgColor: '#FFFFFF',
      borderColor: '#D1D5DB',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    elegant: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#7C3AED',
      bgColor: '#F9FAFB',
      borderColor: '#E5E7EB',
      shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      fontFamily: "'Playfair Display', serif"
    },
    minimal: {
      primaryColor: '#6B7280',
      secondaryColor: '#4B5563',
      bgColor: '#FFFFFF',
      borderColor: '#F3F4F6',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    },
    bold: {
      primaryColor: '#EF4444',
      secondaryColor: '#DC2626',
      bgColor: '#FFFFFF',
      borderColor: '#000000',
      shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      borderRadius: '20px',
      fontFamily: "'Montserrat', sans-serif"
    },
    classic: {
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      bgColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      borderRadius: '0px',
      fontFamily: "'Courier New', monospace"
    }
  };
  
  return configs[templateId] || configs.modern;
};

// Helper function to generate receipt number (outside component)
const generateReceiptNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RCT${year}${month}${day}${random}`;
};

// Helper to format date and time
const getCurrentDateTime = () => {
  const now = new Date();
  return {
    date: now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    time: now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  };
};

// Helper to generate invoice number
const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(4, '0');
  return `INV${year}/${random}`;
};

// Simple verification helper
const generateReceiptHash = (receiptData, total) => {
  // Create a verification string from critical, unchangeable data
  const verificationString = `${receiptData.receiptNumber}-${total}-${receiptData.items.length}-${receiptData.date}-${receiptData.time}`;
  // Simple hash - in production use crypto.subtle.digest
  return btoa(verificationString).substring(0, 32);
};

// Register receipt with verification system
const registerReceiptVerification = async (receiptData, total) => {
  try {
    console.log('📤 registerReceiptVerification called for:', receiptData.receiptNumber);
    
    // Import the proxy
    const { verificationProxy } = await import('../utils/verificationProxy');
    
    const receiptHash = generateReceiptHash(receiptData, total);
    console.log('🔑 Generated hash:', receiptHash);
    console.log('💰 Total used for hash:', total);
    
    // Register using proxy
    const result = await verificationProxy.registerReceipt(
      receiptData.receiptNumber,
      receiptHash,
      {
        timestamp: new Date().toISOString(),
        items_count: receiptData.items.length,
        store_name_hash: btoa(receiptData.storeName || '').substring(0, 16),
        total_amount: total
      }
    );
    
    console.log('📨 Registration result:', result);
    
    if (result.success) {
      const verificationUrl = `${VERIFICATION_WEB_APP_URL}?id=${receiptData.receiptNumber}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;
      
      return {
        verificationId: receiptData.receiptNumber,
        verificationHash: receiptHash,
        verificationUrl,
        qrCodeUrl,
        registeredAt: new Date().toISOString(),
        method: result.method
      };
    }
    
    console.warn('Registration failed:', result);
    return null;
    
  } catch (error) {
    console.error('❌ Verification registration failed:', error);
    return null;
  }
};

// Verify receipt function
const verifyReceipt = async (receiptId, receiptData, total) => {
  const currentHash = generateReceiptHash(receiptData, total);
  
  // Use JSONP directly
  const url = `${VERIFICATION_WEB_APP_URL}?action=verify_receipt&receipt_id=${receiptId}&receipt_hash=${currentHash}&callback=callback`;
  
  return new Promise((resolve) => {
    const script = document.createElement('script');
    const callbackName = `callback_${Date.now()}`;
    
    window[callbackName] = (data) => {
      document.body.removeChild(script);
      delete window[callbackName];
      
      resolve({
        success: data.status === 'success',
        isGenuine: data.is_genuine,
        message: data.message,
        data: data
      });
    };
    
    script.src = url.replace('callback=callback', `callback=${callbackName}`);
    document.body.appendChild(script);
    
    // Fallback if no response
    setTimeout(() => {
      if (window[callbackName]) {
        document.body.removeChild(script);
        delete window[callbackName];
        resolve({
          success: true,
          isGenuine: true,
          message: 'Verification submitted',
          data: { submitted: true }
        });
      }
    }, 5000);
  });
};

export const useReceipt = () => {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error('useReceipt must be used within ReceiptProvider');
  }
  return context;
};

export const ReceiptProvider = ({ children }) => {
  // Load saved receipts from localStorage
  const loadSavedReceipts = useCallback(() => {
    try {
      const saved = localStorage.getItem('receipt-history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  // Load draft from localStorage
  const loadDraft = useCallback(() => {
    try {
      const savedData = localStorage.getItem('receiptData_draft');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Check if data is recent (within last 7 days)
        if (parsed.timestamp && Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
    return null;
  }, []);

  const [companyLogo, setCompanyLogo] = useState(null);
  const [savedReceipts, setSavedReceipts] = useState(loadSavedReceipts());
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [enableVerification, setEnableVerification] = useState(true);
  
  // Check for existing draft
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  
  // Initial receipt data
  const initialReceiptData = useMemo(() => {
    const { date, time } = getCurrentDateTime();
    return {
      receiptType: 'receipt',
      storeName: "",
      storeAddress: "",
      storePhone: "",
      storeEmail: "",
      tinNumber: "",
      rcNumber: "",
      cashierName: "",
      includeSignature: false,
      signatureData: null,
      receiptNumber: generateReceiptNumber(),
      invoiceNumber: generateInvoiceNumber(),
      date,
      time,
      items: [], // Start with empty items
      includeVAT: false,
      vatRate: 7.5,
      includeDiscount: false,
      discountType: 'percentage',
      discount: 0,
      deliveryFee: 0,
      serviceCharge: 0,
      paymentMethod: "Cash",
      amountPaid: 0,
      customerNotes: "",
      footerMessage: "",
      includeTerms: false,
      termsAndConditions: "",
      includeBillTo: false,
      billToName: "",
      billToAddress: "",
      billToPhone: "",
      includeShipTo: false,
      shipToName: "",
      shipToAddress: "",
      shipToPhone: "",
      poNumber: "",
      dueDate: "",
    };
  }, []);

  const [receiptData, setReceiptData] = useState(() => {
    const draft = loadDraft();
    return draft || initialReceiptData;
  });

  // Show draft prompt on mount if draft exists
  useEffect(() => {
    const draft = loadDraft();
    if (draft && draft.items && draft.items.length > 0) {
      setShowDraftPrompt(true);
    }
  }, [loadDraft]);

  // Auto-save to localStorage
  useEffect(() => {
    const saveDraft = () => {
      try {
        const draftData = {
          data: receiptData,
          timestamp: Date.now(),
        };
        localStorage.setItem('receiptData_draft', JSON.stringify(draftData));
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
    };

    const timeoutId = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timeoutId);
  }, [receiptData]);

  // Save receipts history
  useEffect(() => {
    try {
      localStorage.setItem('receipt-history', JSON.stringify(savedReceipts));
    } catch (error) {
      console.error('Failed to save receipts:', error);
    }
  }, [savedReceipts]);

  // Load logo from localStorage
  useEffect(() => {
    const savedLogo = localStorage.getItem('company-logo');
    if (savedLogo) {
      setCompanyLogo(savedLogo);
    }
  }, []);

  // Handle logo upload
  const handleLogoUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = e.target.result;
        setCompanyLogo(logoData);
        localStorage.setItem('company-logo', logoData);
        resolve(logoData);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Remove logo
  const removeLogo = () => {
    setCompanyLogo(null);
    localStorage.removeItem('company-logo');
  };

  // Save current receipt to history - NOW ASYNC
  const saveCurrentReceipt = async (pdfBlob, receiptName = null) => {
    console.log('📝 saveCurrentReceipt called for:', receiptData.receiptNumber);
    
    let verificationInfo = null;
    
    // Only register for verification if enabled and webAppUrl is set
    if (enableVerification && VERIFICATION_WEB_APP_URL) {
      try {
        console.log('🔒 Attempting to register receipt for verification...');
        console.log('🌐 Using URL:', VERIFICATION_WEB_APP_URL);
        
        // Calculate total first
        const total = calculateTotal();
        console.log('💰 Total for verification:', total);
        
        verificationInfo = await registerReceiptVerification(receiptData, total);
        
        if (verificationInfo) {
          console.log('✅ Receipt registered for verification:', verificationInfo);
        } else {
          console.warn('⚠️ Registration returned null');
        }
      } catch (error) {
        console.error('❌ Failed to register receipt for verification:', error);
        // Continue without verification if it fails
      }
    } else {
      console.warn('⚠️ Verification not enabled or URL not configured');
      console.log('enableVerification:', enableVerification);
      console.log('VERIFICATION_WEB_APP_URL:', VERIFICATION_WEB_APP_URL);
    }
    
    const receiptToSave = {
      id: Date.now().toString(),
      name: receiptName || `${receiptData.receiptType.toUpperCase()} ${receiptData.receiptNumber}`,
      receiptNumber: receiptData.receiptNumber,
      date: new Date().toISOString(),
      storeName: receiptData.storeName,
      total: calculateTotal(),
      itemsCount: receiptData.items.length,
      template: selectedTemplate,
      data: { ...receiptData },
      pdfBlobUrl: URL.createObjectURL(pdfBlob),
      timestamp: Date.now(),
      // Add verification info if available
      ...(verificationInfo && { verificationInfo })
    };

    setSavedReceipts(prev => [receiptToSave, ...prev]);
    return receiptToSave;
  };

  // Delete a saved receipt
  const deleteSavedReceipt = (id) => {
    setSavedReceipts(prev => {
      const receipt = prev.find(r => r.id === id);
      if (receipt?.pdfBlobUrl) {
        URL.revokeObjectURL(receipt.pdfBlobUrl);
      }
      return prev.filter(r => r.id !== id);
    });
  };

  // Get a saved receipt by ID
  const getSavedReceipt = (id) => {
    return savedReceipts.find(r => r.id === id);
  };

  // Clear all history
  const clearHistory = () => {
    savedReceipts.forEach(receipt => {
      if (receipt.pdfBlobUrl) {
        URL.revokeObjectURL(receipt.pdfBlobUrl);
      }
    });
    setSavedReceipts([]);
  };

  // Update receipt data
  const updateReceiptData = useCallback((field, value) => {
    setReceiptData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const changeTemplate = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const addItem = useCallback(() => {
    setReceiptData(prev => {
      if (prev.items.length === 0) {
        return { ...prev, items: [{ id: Date.now(), name: "", price: 0, quantity: 1, unit: "pcs" }] };
      }

      const lastItem = prev.items[prev.items.length - 1];

      // Check if the fields are actually empty
      const nameValue = lastItem.name ? String(lastItem.name).trim() : "";
      const isNameEmpty = nameValue === "" || nameValue === "New Item";
      const isPriceEmpty = !lastItem.price || parseFloat(lastItem.price) <= 0;

      if (isNameEmpty || isPriceEmpty) {
        alert("Please enter a valid Name and Price before adding a new item.");
        return prev; 
      }

      return {
        ...prev,
        items: [...prev.items, { id: Date.now(), name: "", price: 0, quantity: 1, unit: "pcs" }]
      };
    });
  }, []);

  const updateItem = useCallback((id, field, value) => {
    setReceiptData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  }, []);

  const removeItem = useCallback((id) => {
    setReceiptData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  }, []);

  // Clear draft
  const clearDraft = useCallback(() => {
    localStorage.removeItem('receiptData_draft');
  }, []);

  // Start fresh
  const startNewReceipt = useCallback(() => {
    const { date, time } = getCurrentDateTime();
    const newReceipt = {
      ...initialReceiptData,
      receiptNumber: generateReceiptNumber(),
      invoiceNumber: generateInvoiceNumber(),
      date,
      time,
      items: [],
    };
    
    setReceiptData(newReceipt);
    clearDraft();
    setShowDraftPrompt(false);
  }, [initialReceiptData, clearDraft]);

  // Restore draft
  const restoreDraft = useCallback(() => {
    const draft = loadDraft();
    if (draft) {
      setReceiptData(draft);
    }
    setShowDraftPrompt(false);
  }, [loadDraft]);

  // Discard draft
  const discardDraft = useCallback(() => {
    clearDraft();
    setShowDraftPrompt(false);
    startNewReceipt();
  }, [clearDraft, startNewReceipt]);

  // Calculation functions
  const calculateSubtotal = useCallback(() => {
    return receiptData.items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return sum + (price * quantity);
    }, 0);
  }, [receiptData.items]);

  const calculateDiscount = useCallback(() => {
    const subtotal = calculateSubtotal();
    if (receiptData.includeDiscount && receiptData.discount > 0) {
      if (receiptData.discountType === 'percentage') {
        return (subtotal * receiptData.discount) / 100;
      }
      return receiptData.discount;
    }
    return 0;
  }, [receiptData.includeDiscount, receiptData.discount, receiptData.discountType, calculateSubtotal]);

  const calculateVAT = useCallback(() => {
    const subtotal = calculateSubtotal() - calculateDiscount();
    if (receiptData.includeVAT) {
      return (subtotal * receiptData.vatRate) / 100;
    }
    return 0;
  }, [receiptData.includeVAT, receiptData.vatRate, calculateSubtotal, calculateDiscount]);

  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const vat = calculateVAT();
    const delivery = parseFloat(receiptData.deliveryFee) || 0;
    const service = parseFloat(receiptData.serviceCharge) || 0;
    return subtotal - discount + vat + delivery + service;
  }, [calculateSubtotal, calculateDiscount, calculateVAT, receiptData.deliveryFee, receiptData.serviceCharge]);

  const calculateChange = useCallback(() => {
    if (receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0) {
      const total = calculateTotal();
      return Math.max(0, receiptData.amountPaid - total);
    }
    return 0;
  }, [receiptData.paymentMethod, receiptData.amountPaid, calculateTotal]);

  const formatNaira = useCallback((amount) => {
    const formattedAmount = new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(amount);
    
    return `₦ ${formattedAmount}`;
  }, []);

  const resetReceipt = useCallback(() => {
    const { date, time } = getCurrentDateTime();
    setReceiptData(prev => ({
      ...prev,
      receiptNumber: generateReceiptNumber(),
      date,
      time,
      invoiceNumber: generateInvoiceNumber(),
      items: prev.items.map(item => ({ ...item, quantity: 1 })),
      amountPaid: 0,
    }));
  }, []);

  const generateNewReceiptNumber = () => {
    return generateReceiptNumber();
  };

  // Verification functions
 // In ReceiptContext.jsx, update verifyCurrentReceipt function:

const verifyCurrentReceipt = async () => {
  const total = calculateTotal();
  const receiptHash = generateReceiptHash(receiptData, total);
  
  try {
    console.log('🔍 Verifying receipt:', receiptData.receiptNumber);
    
    // First, check if receipt exists in database
    const receiptInfo = await checkReceiptExists(receiptData.receiptNumber);
    
    if (!receiptInfo || receiptInfo.status !== 'success') {
      // Receipt not found - it's a NEW receipt
      return {
        success: true,
        isGenuine: true,
        isNewReceipt: true, // Add this flag
        message: 'New receipt - not yet registered for verification',
        data: { is_new: true }
      };
    }
    
    // Receipt exists - verify against stored hash
    const result = await verifyReceipt(receiptData.receiptNumber, receiptData, total);
    
    return {
      ...result,
      isNewReceipt: false
    };
    
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      error: 'Verification failed',
      isNewReceipt: false
    };
  }
};

// Add this helper function
const checkReceiptExists = async (receiptId) => {
  try {
    const { verificationProxy } = await import('../utils/verificationProxy');
    const result = await verificationProxy.getReceiptInfo(receiptId);
    return result;
  } catch (error) {
    console.log('Receipt not found:', error);
    return null;
  }
};

  const verifySavedReceipt = async (receiptId, receiptData) => {
    // Calculate total for the saved receipt
    const calculateSavedTotal = (data) => {
      const subtotal = data.items.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        return sum + (price * quantity);
      }, 0);
      
      let discount = 0;
      if (data.includeDiscount && data.discount > 0) {
        if (data.discountType === 'percentage') {
          discount = (subtotal * data.discount) / 100;
        } else {
          discount = data.discount;
        }
      }
      
      let vat = 0;
      if (data.includeVAT) {
        const subtotalAfterDiscount = subtotal - discount;
        vat = (subtotalAfterDiscount * data.vatRate) / 100;
      }
      
      const delivery = parseFloat(data.deliveryFee) || 0;
      const service = parseFloat(data.serviceCharge) || 0;
      
      return subtotal - discount + vat + delivery + service;
    };
    
    const total = calculateSavedTotal(receiptData);
    return await verifyReceipt(receiptId, receiptData, total);
  };

  const getVerificationUrl = (receiptId) => {
    // return `${VERIFICATION_WEB_APP_URL}?id=${receiptId}`;
     return `${window.location.origin}/verify`;
  };

  const getQRCodeUrl = (receiptId) => {
    const verificationUrl = getVerificationUrl(receiptId);
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;
  };
  // Add a new function to get hash-based URL
const getVerificationUrlWithHash = (receiptHash) => {
  return `${window.location.origin}/verify?hash=${receiptHash}`;
};

  const toggleVerification = () => {
    setEnableVerification(prev => !prev);
  };

  // Also export getTemplateConfig from context
  return (
    <ReceiptContext.Provider value={{
      receiptData,
      
      getVerificationUrlWithHash, 
      updateReceiptData,
      selectedTemplate,
      templates: RECEIPT_TEMPLATES,
      changeTemplate,
      companyLogo,
      handleLogoUpload,
      removeLogo,
      savedReceipts,
      saveCurrentReceipt, // Now async
      deleteSavedReceipt,
      getSavedReceipt,
      clearHistory,
      addItem,
      updateItem,
      removeItem,
      calculateSubtotal,
      calculateDiscount,
      calculateVAT,
      calculateTotal,
      calculateChange,
      formatNaira,
      resetReceipt,
      generateReceiptNumber: generateNewReceiptNumber,
      // Template configuration
      getTemplateConfig,
      // Draft management
      showDraftPrompt,
      restoreDraft,
      discardDraft,
      startNewReceipt,
      clearDraft,
      // Verification features
      enableVerification,
      toggleVerification,
      verifyCurrentReceipt,
      verifySavedReceipt,
      getVerificationUrl,
      getQRCodeUrl,
      VERIFICATION_WEB_APP_URL
    }}>
      {children}
    </ReceiptContext.Provider>
  );
};