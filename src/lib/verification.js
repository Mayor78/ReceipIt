import { supabase } from './supabase';

const HMAC_SECRET = import.meta.env.VITE_RECEIPT_HMAC_SECRET;

// Simple HMAC implementation for browser
async function generateHMAC(message, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  );
  
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function calculateTotal(receiptData) {
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

export async function generateReceiptHash(receiptData, storeId) {
  const total = calculateTotal(receiptData);
  
  // Create deterministic input
  const hashInput = `${storeId}|${receiptData.receiptNumber}|${receiptData.date}|${receiptData.time}|${total}`;
  
  // Generate HMAC-SHA256
  return await generateHMAC(hashInput, HMAC_SECRET);
}