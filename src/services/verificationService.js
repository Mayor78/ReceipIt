/**
 * Verification Service for Receipt Anti-Fraud System
 * Uses Google Apps Script as backend
 */

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw1woB8HoaHdqtT-H3DaQv9qdEV8bB2vPxG9ZYgnsP54xMNbd6mKgRr1D2XNeHeaIJKmg/exec'; // Replace with your web app URL

// Generate a secure hash from receipt data
export async function generateReceiptHash(receiptData) {
  try {
    // Extract verification-critical data (exclude editable fields)
    const verificationData = {
      receiptNumber: receiptData.receiptNumber,
      invoiceNumber: receiptData.invoiceNumber,
      total: calculateTotalFromReceipt(receiptData),
      itemsCount: receiptData.items.length,
      date: receiptData.date,
      time: receiptData.time,
      storeName: receiptData.storeName,
      // Add other critical fields that shouldn't change
    };
    
    // Convert to string and hash
    const dataString = JSON.stringify(verificationData);
    const encoder = new TextEncoder();
    const data = encoder.encode(dataString);
    
    // Use Web Crypto API for secure hashing
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
    
  } catch (error) {
    console.error('Hash generation error:', error);
    // Fallback to simple hash
    const fallbackData = `${receiptData.receiptNumber}-${receiptData.total}-${receiptData.date}`;
    return btoa(fallbackData).substring(0, 64);
  }
}

// Helper function to calculate total from receipt data
function calculateTotalFromReceipt(receiptData) {
  const subtotal = receiptData.items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return sum + (price * quantity);
  }, 0);
  
  let discount = 0;
  if (receiptData.includeDiscount && receiptData.discount > 0) {
    if (receiptData.discountType === 'percentage') {
      discount = (subtotal * receiptData.discount) / 100;
    } else {
      discount = receiptData.discount;
    }
  }
  
  let vat = 0;
  if (receiptData.includeVAT) {
    const subtotalAfterDiscount = subtotal - discount;
    vat = (subtotalAfterDiscount * receiptData.vatRate) / 100;
  }
  
  const delivery = parseFloat(receiptData.deliveryFee) || 0;
  const service = parseFloat(receiptData.serviceCharge) || 0;
  
  return subtotal - discount + vat + delivery + service;
}

// Register receipt with verification system
export async function registerReceiptForVerification(receiptData, receiptId) {
  try {
    const receiptHash = await generateReceiptHash(receiptData);
    
    // Create store hash (anonymous identifier for the store)
    const storeHash = generateStoreHash(receiptData.storeName, receiptData.storeAddress);
    
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'register_receipt',
        receipt_id: receiptId,
        receipt_hash: receiptHash,
        store_hash: storeHash,
        metadata: {
          timestamp: new Date().toISOString(),
          items_count: receiptData.items.length,
          total_amount: calculateTotalFromReceipt(receiptData),
          // Don't store sensitive data
        }
      }),
    });
    
    const result = await response.json();
    return {
      success: result.status === 'success',
      data: result,
      receiptHash,
      verificationUrl: `${WEB_APP_URL}?id=${receiptId}`
    };
    
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Verify a receipt
export async function verifyReceipt(receiptId, receiptHash) {
  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'verify_receipt',
        receipt_id: receiptId,
        receipt_hash: receiptHash
      }),
    });
    
    const result = await response.json();
    return {
      success: result.status === 'success',
      isGenuine: result.is_genuine,
      message: result.message,
      data: result
    };
    
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get receipt verification info
export async function getReceiptVerification(receiptId) {
  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'get_receipt',
        receipt_id: receiptId
      }),
    });
    
    const result = await response.json();
    return {
      success: result.status === 'success',
      data: result.data
    };
    
  } catch (error) {
    console.error('Get receipt error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Generate store hash (anonymous)
function generateStoreHash(storeName, storeAddress) {
  const storeIdentifier = `${storeName}-${storeAddress}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(storeIdentifier);
  
  // Simple hash for store identification
  return crypto.subtle.digest('SHA-256', data)
    .then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
    })
    .catch(() => {
      // Fallback
      return btoa(storeIdentifier).substring(0, 16);
    });
}

// Generate QR code URL for verification
export function generateVerificationQRUrl(receiptId) {
  return `${WEB_APP_URL}?id=${receiptId}`;
}

// Health check
export async function checkVerificationService() {
  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'health_check'
      }),
    });
    
    const result = await response.json();
    return {
      online: result.status === 'success',
      message: result.message,
      timestamp: result.timestamp
    };
    
  } catch (error) {
    return {
      online: false,
      error: error.message
    };
  }
}