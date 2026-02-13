import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import Swal from 'sweetalert2';

// console.log('✅ ReceiptContext initialized with Supabase');

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

// Helper function to generate receipt number
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

// ============================================
// UPDATED: Generate receipt hash using HMAC-SHA256
// ============================================
const generateReceiptHash = async (receiptData, storeId, total) => {
  try {
    // Create deterministic input from critical data
    const hashInput = `${storeId}|${receiptData.receiptNumber}|${receiptData.date}|${receiptData.time}|${total}`;
    
    // Use Web Crypto API for HMAC-SHA256
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode('receipt-it-secret-key'), // In production, use env variable
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(hashInput)
    );
    
    // Convert to hex string
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    console.error('Hash generation error:', error);
    // Fallback to simple hash
    const fallbackString = `${storeId}-${receiptData.receiptNumber}-${total}-${Date.now()}`;
    return btoa(fallbackString).substring(0, 64);
  }
};

// ============================================
// UPDATED: Save receipt to Supabase
// ============================================
const saveReceiptToSupabase = async (receiptData, storeId, receiptHash, total) => {
  try {
    const { data, error } = await supabase
      .from('receipts')
      .insert([{
        store_id: storeId,
        receipt_hash: receiptHash,
        receipt_data: receiptData,
        total_amount: total,
        issued_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving receipt to Supabase:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// UPDATED: Verify receipt with Supabase
// ============================================
const verifyReceiptWithSupabase = async (receiptHash) => {
  try {
    // Use the public verification view
    const { data, error } = await supabase
      .from('public_receipt_verification')
      .select('store_name, total_amount, issued_at')
      .eq('receipt_hash', receiptHash)
      .maybeSingle();
    
    if (error) throw error;
    
    if (data) {
      return {
        success: true,
        isGenuine: true,
        data: {
          storeName: data.store_name,
          totalAmount: data.total_amount,
          issuedAt: data.issued_at
        }
      };
    } else {
      return {
        success: true,
        isGenuine: false,
        message: 'Receipt not found in verification system'
      };
    }
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
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
  const [currentStore, setCurrentStore] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
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

  // ============================================
  // NEW: Load user and store data from Supabase
  // ============================================
  useEffect(() => {
    loadUserAndStore();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        loadStore(session.user.id);
      } else {
        setCurrentUser(null);
        setCurrentStore(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserAndStore = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      if (user) {
        await loadStore(user.id);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadStore = async (userId) => {
    try {
      const { data } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      setCurrentStore(data);
      
      // Auto-fill receipt data with store info
      if (data) {
        setReceiptData(prev => ({
          ...prev,
          storeName: data.store_name || prev.storeName,
          storePhone: data.phone || prev.storePhone,
          storeAddress: data.address || prev.storeAddress
        }));
      }
    } catch (error) {
      console.error('Error loading store:', error);
    }
  };

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

  const syncStoreDataFromRegistration = (storeData) => {
    setReceiptData(prev => ({
      ...prev,
      storeName: storeData.store_name || storeData.storeName || prev.storeName,
      storeEmail: storeData.email || prev.storeEmail,
      storePhone: storeData.phone || prev.storePhone,
      storeAddress: storeData.address || prev.storeAddress
    }));
  };

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

  // ============================================
  // UPDATED: Save current receipt to Supabase and history
  // ============================================

  // In ReceiptContext.jsx - UPDATE the generateReceiptHash function

// ============================================
// FIXED: Generate receipt hash using HMAC-SHA256 (matches verification service)
// ============================================
const generateReceiptHash = useCallback(async (receiptData, storeId, total) => {
  try {
    // Create deterministic input from critical data
    const hashInput = `${storeId}|${receiptData.receiptNumber}|${receiptData.date}|${receiptData.time}|${total}`;
    
    // Use Web Crypto API for HMAC-SHA256
    const encoder = new TextEncoder();
    
    // Use the same secret key as in verificationService
    const secretKey = import.meta.env.VITE_RECEIPT_HMAC_SECRET || 'receipt-it-default-secret';
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secretKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(hashInput)
    );
    
    // Convert to hex string (64 characters)
    const hashHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log('✅ Generated HMAC hash:', hashHex.substring(0, 16) + '...');
    return hashHex;
    
  } catch (error) {
    console.error('Hash generation error:', error);
    // Fallback - but this should match the fallback in verificationService
    const fallbackString = `${storeId}-${receiptData.receiptNumber}-${total}-${Date.now()}`;
    return btoa(fallbackString).substring(0, 64);
  }
}, []);
  const saveCurrentReceipt = async (pdfBlob, receiptName = null, options = {}) => {
    console.log('📝 saveCurrentReceipt called for:', receiptData.receiptNumber);
    
    let verificationInfo = null;
    const total = calculateTotal();
      let receiptHash = null;
    
    // Only save to Supabase if user is logged in and has a store
    if (currentUser && currentStore && enableVerification) {
      try {
        // Generate hash
        receiptHash = await generateReceiptHash(receiptData, currentStore.id, total);
        
        // Save to Supabase
        const result = await saveReceiptToSupabase(receiptData, currentStore.id, receiptHash, total);
        
        if (result.success) {
          verificationInfo = {
            receiptHash,
            verified: true,
            storeId: currentStore.id,
            savedAt: new Date().toISOString()
          };
          
          console.log('✅ Receipt saved to Supabase with hash:', receiptHash);
        }
      } catch (error) {
        console.error('❌ Failed to save receipt to Supabase:', error);
      }
    }
    
    // Save to localStorage history (always)
    const receiptToSave = {
      id: Date.now().toString(),
      name: receiptName || `${receiptData.receiptType.toUpperCase()} ${receiptData.receiptNumber}`,
      receiptNumber: receiptData.receiptNumber,
      date: new Date().toISOString(),
      storeName: receiptData.storeName,
      total: total,
      itemsCount: receiptData.items.length,
      template: selectedTemplate,
      data: { ...receiptData },
      pdfBlobUrl: URL.createObjectURL(pdfBlob),
      timestamp: Date.now(),
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
    // Case 1: No items yet - just add first item
    if (prev.items.length === 0) {
      Swal.fire({
        title: '🛍️ Start Adding Items',
        text: 'Enter item name and price to begin',
        icon: 'info',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      return { 
        ...prev, 
        items: [{ id: Date.now(), name: "", price: 0, quantity: 1, unit: "pcs" }] 
      };
    }

    const lastItem = prev.items[prev.items.length - 1];
    
    // Check if the last item is valid
    const nameValue = lastItem.name ? String(lastItem.name).trim() : "";
    const isNameValid = nameValue !== "" && nameValue !== "New Item";
    const isPriceValid = lastItem.price && parseFloat(lastItem.price) > 0;
    const isItemComplete = isNameValid && isPriceValid;

    console.log('Add item check:', { 
      name: nameValue, 
      price: lastItem.price, 
      isNameValid, 
      isPriceValid, 
      isItemComplete,
      itemId: lastItem.id
    });

    // Case 2: Last item is COMPLETE - add new empty item
    if (isItemComplete) {
      const newItem = { 
        id: Date.now(), 
        name: "", 
        price: 0, 
        quantity: 1, 
        unit: lastItem.unit || "pcs" 
      };
      
      // Show success message
      Swal.fire({
        title: '✅ Item Saved!',
        text: `"${nameValue}" added. Now add next item`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      console.log('✅ Adding new item after saving:', nameValue);
      
      return {
        ...prev,
        items: [...prev.items, newItem]
      };
    }
    
    // Case 3: Last item is INCOMPLETE - show helpful message
    let message = "";
    let icon = "info";
    
    if (!isNameValid && !isPriceValid) {
      message = "Enter item name and price first";
      icon = "warning";
    } else if (!isNameValid) {
      message = "Enter item name first";
      icon = "warning";
    } else if (!isPriceValid) {
      message = "Enter price for this item first";
      icon = "warning";
    }
    
    Swal.fire({
      title: '⏳ Complete Current Item',
      text: message,
      icon: icon,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
    
    console.log('⏳ Cannot add new item - current item incomplete');
    return prev;
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

  // ============================================
  // UPDATED: Verify current receipt using Supabase
  // ============================================
  const verifyCurrentReceipt = async () => {
    const total = calculateTotal();
    
    try {
      console.log('🔍 Verifying receipt:', receiptData.receiptNumber);
      
      // If store is registered, generate hash and check
      if (currentStore) {
        const receiptHash = await generateReceiptHash(receiptData, currentStore.id, total);
        const result = await verifyReceiptWithSupabase(receiptHash);
        
        return {
          success: result.success,
          isGenuine: result.isGenuine,
          message: result.message || (result.isGenuine ? 'Receipt is genuine' : 'Receipt not found'),
          data: result.data
        };
      } else {
        // No store registered - can't verify
        return {
          success: true,
          isGenuine: true,
          isNewReceipt: true,
          message: 'Store not registered - receipt saved locally only'
        };
      }
    } catch (error) {
      console.error('Verification error:', error);
      return {
        success: false,
        error: 'Verification failed'
      };
    }
  };
  const verifyReceipt = async (receiptHash) => {
  try {
    const { data, error } = await supabase
      .from('public_receipt_verification')
      .select('store_name, total_amount, issued_at')
      .eq('receipt_hash', receiptHash)
      .maybeSingle();
    
    if (error) throw error;
    
    if (data) {
      return {
        success: true,
        valid: true,
        storeName: data.store_name,
        totalAmount: data.total_amount,
        issuedAt: data.issued_at
      };
    } else {
      return {
        success: true,     
        valid: false,
        message: 'Receipt not found'
      };
    }
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      valid: false,
      error: error.message
    };
  }
};


  // ============================================
  // UPDATED: Verify saved receipt
  // ============================================
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
    
    try {
      // We need the store ID to generate the hash
      // This assumes the saved receipt has store info
      const storeId = currentStore?.id || 'unknown';
      const receiptHash = await generateReceiptHash(receiptData, storeId, total);
      
      return await verifyReceiptWithSupabase(receiptHash);
    } catch (error) {
      console.error('Saved receipt verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Get verification URL (for QR code)
  const getVerificationUrl = (receiptHash) => {
    return `${window.location.origin}/verify?hash=${receiptHash}`;
  };

  // Get QR code URL
  const getQRCodeUrl = (receiptHash) => {
    const verificationUrl = getVerificationUrl(receiptHash);
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;
  };

  // Get hash-based URL
  const getVerificationUrlWithHash = (receiptHash) => {
    return `${window.location.origin}/verify?hash=${receiptHash}`;
  };

  const toggleVerification = () => {
    setEnableVerification(prev => !prev);
  };

  return (
    <ReceiptContext.Provider value={{
      receiptData,
      verifyReceipt,
      getVerificationUrlWithHash,
      updateReceiptData,
      selectedTemplate,
      templates: RECEIPT_TEMPLATES,
      changeTemplate,
      companyLogo,
      handleLogoUpload,
      removeLogo,
      savedReceipts,
      saveCurrentReceipt,
      deleteSavedReceipt,
      getSavedReceipt,
      clearHistory,
      addItem,
      updateItem,
      removeItem,
      syncStoreDataFromRegistration,
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
      // Store and user info
      currentStore,
      currentUser,
      isAuthenticated: !!currentUser,
      hasStore: !!currentStore
    }}>
      {children}
    </ReceiptContext.Provider>
  );
};