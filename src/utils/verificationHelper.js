// Simple verification helper without complex dependencies
export class VerificationHelper {
  constructor(webAppUrl) {
    this.webAppUrl = webAppUrl;
  }
  
  // Generate hash from receipt data
  generateReceiptHash(receiptData) {
    const criticalData = {
      receiptNumber: receiptData.receiptNumber,
      total: this.calculateTotal(receiptData),
      itemsCount: receiptData.items.length,
      date: receiptData.date,
      storeName: receiptData.storeName,
      timestamp: Date.now()
    };
    
    const dataString = JSON.stringify(criticalData);
    // Simple hash for demo - in production use crypto.subtle.digest
    return btoa(dataString).substring(0, 64);
  }
  
  calculateTotal(receiptData) {
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
  
  async registerReceipt(receiptData) {
    if (!this.webAppUrl) {
      console.warn('No web app URL set for verification');
      return null;
    }
    
    try {
      const receiptHash = this.generateReceiptHash(receiptData);
      const receiptId = receiptData.receiptNumber;
      
      const response = await fetch(this.webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register_receipt',
          receipt_id: receiptId,
          receipt_hash: receiptHash,
          metadata: {
            timestamp: new Date().toISOString(),
            items_count: receiptData.items.length,
            store_name_hash: btoa(receiptData.storeName || '').substring(0, 16)
          }
        }),
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        return {
          success: true,
          receiptId,
          receiptHash,
          verificationUrl: `${this.webAppUrl}?id=${receiptId}`,
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${this.webAppUrl}?id=${receiptId}`)}`,
          timestamp: new Date().toISOString()
        };
      }
      
      return { success: false, error: result.message };
      
    } catch (error) {
      console.error('Verification registration error:', error);
      return { success: false, error: error.message };
    }
  }
  
  async verifyReceipt(receiptId, currentReceiptData) {
    if (!this.webAppUrl) {
      return { success: false, error: 'No verification service URL' };
    }
    
    try {
      const currentHash = this.generateReceiptHash(currentReceiptData);
      
      const response = await fetch(this.webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_receipt',
          receipt_id: receiptId,
          receipt_hash: currentHash
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
      return { success: false, error: error.message };
    }
  }
  
  getVerificationUrl(receiptId) {
    return `${this.webAppUrl}?id=${receiptId}`;
  }
  
  getQRCodeUrl(receiptId) {
    const verificationUrl = this.getVerificationUrl(receiptId);
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;
  }
}

// Create a singleton instance
let verificationHelper = null;

export function getVerificationHelper() {
  if (!verificationHelper) {
    const webAppUrl = localStorage.getItem('verification_web_app_url') || '';
    verificationHelper = new VerificationHelper(webAppUrl);
  }
  return verificationHelper;
}

export function setVerificationWebAppUrl(url) {
  localStorage.setItem('verification_web_app_url', url);
  verificationHelper = new VerificationHelper(url);
}