/**
 * Verification Service for Receipt Anti-Fraud System
 * Uses Supabase as backend
 */

import { supabase } from '../lib/supabaseClient';

// Generate a secure hash from receipt data (HMAC-SHA256)
export async function generateReceiptHash(receiptData, storeId) {
  try {
    // Calculate total
    const total = calculateTotalFromReceipt(receiptData);
    
    // Create deterministic input from critical data (same as server would use)
    const hashInput = `${storeId}|${receiptData.receiptNumber}|${receiptData.date}|${receiptData.time}|${total}`;
    
    // Use Web Crypto API for HMAC-SHA256
    const encoder = new TextEncoder();
    
    // In production, use a proper secret key from environment
    // This should match the server-side secret
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
    
    // Convert to hex string
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
  } catch (error) {
    console.error('Hash generation error:', error);
    // Fallback to simple hash
    const fallbackData = `${receiptData.receiptNumber}-${receiptData.total}-${receiptData.date}`;
    return btoa(fallbackData).substring(0, 64);
  }
}

// Helper function to calculate total from receipt data
export function calculateTotalFromReceipt(receiptData) {
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

// Register receipt with Supabase
export async function registerReceiptForVerification(receiptData, storeId) {
  try {
    const receiptHash = await generateReceiptHash(receiptData, storeId);
    const receiptId = receiptData.receiptNumber;
    const total = calculateTotalFromReceipt(receiptData);
    
    // Insert into Supabase
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
    
    return {
      success: true,
      data,
      receiptHash,
      receiptId,
      verificationUrl: `${window.location.origin}/verify?hash=${receiptHash}`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${window.location.origin}/verify?hash=${receiptHash}`)}`
    };
    
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Verify a receipt by hash
export async function verifyReceipt(receiptHash) {
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
        message: 'Receipt is genuine',
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
        message: 'Receipt not found in verification system',
        data: null
      };
    }
    
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      isGenuine: false,
      error: error.message
    };
  }
}

// Get receipt verification info by hash
export async function getReceiptVerification(receiptHash) {
  try {
    const { data, error } = await supabase
      .from('public_receipt_verification')
      .select('store_name, total_amount, issued_at')
      .eq('receipt_hash', receiptHash)
      .maybeSingle();
    
    if (error) throw error;
    
    return {
      success: true,
      data: data || null
    };
    
  } catch (error) {
    console.error('Get receipt error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Generate QR code URL for verification
export function generateVerificationQRUrl(receiptHash) {
  const verificationUrl = `${window.location.origin}/verify?hash=${receiptHash}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;
}

// Health check (verify Supabase connection)
export async function checkVerificationService() {
  try {
    // Simple query to check if we can access the public view
    const { data, error } = await supabase
      .from('public_receipt_verification')
      .select('receipt_hash')
      .limit(1);
    
    if (error) throw error;
    
    return {
      online: true,
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    return {
      online: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Get receipts by store ID (authenticated)
export async function getStoreReceipts(storeId) {
  try {
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('store_id', storeId)
      .order('issued_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
    
  } catch (error) {
    console.error('Get store receipts error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}