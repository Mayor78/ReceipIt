import React, { createContext, useState, useContext, useEffect } from 'react';

const ReceiptContext = createContext();

// Define templates here
const RECEIPT_TEMPLATES = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean layout for invoices and official receipts',
    headerColor: '#3B82F6',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Sleek design with gradients and modern typography',
    headerColor: '#10B981',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Classic design with red accents for premium look',
    headerColor: '#EF4444',
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Simple business receipt with all essential details',
    headerColor: '#6B7280',
  },
  {
    id: 'thermal',
    name: 'Thermal',
    description: '58mm format optimized for POS printers',
    headerColor: '#F59E0B',
  },
];

export const useReceipt = () => {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error('useReceipt must be used within ReceiptProvider');
  }
  return context;
};

export const ReceiptProvider = ({ children }) => {
  // Load saved receipts from localStorage on init
  const loadSavedReceipts = () => {
    try {
      const saved = localStorage.getItem('receipt-history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [companyLogo, setCompanyLogo] = useState(null);
  const [savedReceipts, setSavedReceipts] = useState(loadSavedReceipts());
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [receiptData, setReceiptData] = useState({
    receiptType: 'receipt',
    storeName: "ABC Stores Limited",
    storeAddress: "Shop 15, Allen Avenue, Ikeja, Lagos",
    storePhone: "0803 456 7890",
    storeEmail: "info@abcstores.com.ng",
    tinNumber: "TIN: 12345678-0001",
    rcNumber: "RC 123456",
    cashierName: "Chidi Okafor",
    receiptNumber: generateReceiptNumber(),
    invoiceNumber: "INV" + new Date().getFullYear() + "/" + Math.floor(Math.random() * 1000).toString().padStart(4, '0'),
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    time: new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    includeCustomerInfo: false,
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    items: [
      { id: 1, name: "Rice (50kg)", price: 45000, quantity: 1, unit: "bag" },
      { id: 2, name: "Vegetable Oil (5L)", price: 9500, quantity: 2, unit: "bottle" },
      { id: 3, name: "Sugar (1kg)", price: 1200, quantity: 5, unit: "bag" },
      { id: 4, name: "Salt (1kg)", price: 500, quantity: 3, unit: "bag" },
    ],
    includeVAT: false,
    vatRate: 7.5,
    includeDiscount: false,
    discountType: 'percentage',
    discount: 0,
    deliveryFee: 0,
    paymentMethod: "Cash",
    amountPaid: 0,
    customerNotes: "Thank you for your patronage!",
    footerMessage: "Goods sold are not returnable",
    includeSignature: false,
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
  });

  // Helper to generate receipt number
  function generateReceiptNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RCT${year}${month}${day}${random}`;
  }

  // Save receipts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('receipt-history', JSON.stringify(savedReceipts));
    } catch (error) {
      console.error('Failed to save receipts:', error);
    }
  }, [savedReceipts]);

  // Handle logo upload
  const handleLogoUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = e.target.result;
        setCompanyLogo(logoData);
        // Also save to localStorage
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

  // Load logo from localStorage on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem('company-logo');
    if (savedLogo) {
      setCompanyLogo(savedLogo);
    }
  }, []);

  // Save current receipt to history
  const saveCurrentReceipt = (pdfBlob, receiptName = null) => {
    const receiptToSave = {
      id: Date.now().toString(),
      name: receiptName || `${receiptData.receiptType.toUpperCase()} ${receiptData.receiptNumber}`,
      receiptNumber: receiptData.receiptNumber,
      date: new Date().toISOString(),
      storeName: receiptData.storeName,
      total: calculateTotal(),
      itemsCount: receiptData.items.length,
      template: selectedTemplate,
      data: { ...receiptData }, // Deep copy of receipt data
      pdfBlobUrl: URL.createObjectURL(pdfBlob),
      timestamp: Date.now(),
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
  const updateReceiptData = (field, value) => {
    setReceiptData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const changeTemplate = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: "New Item",
      price: 0,
      quantity: 1,
      unit: "pcs"
    };
    setReceiptData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (id, field, value) => {
    setReceiptData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItem = (id) => {
    setReceiptData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const calculateSubtotal = () => {
    return receiptData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (receiptData.includeDiscount && receiptData.discount > 0) {
      if (receiptData.discountType === 'percentage') {
        return (subtotal * receiptData.discount) / 100;
      }
      return receiptData.discount;
    }
    return 0;
  };

  const calculateVAT = () => {
    const subtotal = calculateSubtotal() - calculateDiscount();
    if (receiptData.includeVAT) {
      return (subtotal * receiptData.vatRate) / 100;
    }
    return 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const vat = calculateVAT();
    return subtotal - discount + vat + (receiptData.deliveryFee || 0);
  };

  const calculateChange = () => {
    if (receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0) {
      const total = calculateTotal();
      return Math.max(0, receiptData.amountPaid - total);
    }
    return 0;
  };

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2
    }).format(amount);
  };

  const resetReceipt = () => {
    setReceiptData({
      ...receiptData,
      receiptNumber: generateReceiptNumber(),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      items: receiptData.items.map(item => ({ ...item, quantity: 1 })),
      amountPaid: 0,
    });
  };

  return (
    <ReceiptContext.Provider value={{
      receiptData,
      updateReceiptData,
      selectedTemplate,
      templates: RECEIPT_TEMPLATES, // Add this line
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
      calculateSubtotal,
      calculateDiscount,
      calculateVAT,
      calculateTotal,
      calculateChange,
      formatNaira,
      resetReceipt,
      generateReceiptNumber,
    }}>
      {children}
    </ReceiptContext.Provider>
  );
};