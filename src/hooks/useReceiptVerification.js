import { useState, useCallback } from 'react';
import {
  registerReceiptForVerification,
  verifyReceipt,
  getReceiptVerification,
  generateReceiptHash,
  generateVerificationQRUrl,
  checkVerificationService
} from '../services/verificationService';

export function useReceiptVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Register a new receipt for verification
  const registerReceipt = useCallback(async (receiptData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const receiptId = receiptData.receiptNumber || `RCT-${Date.now()}`;
      const result = await registerReceiptForVerification(receiptData, receiptId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to register receipt');
      }
      
      // Store verification info locally
      const verificationInfo = {
        receiptId,
        receiptHash: result.receiptHash,
        verificationUrl: result.verificationUrl,
        registeredAt: new Date().toISOString(),
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(result.verificationUrl)}`
      };
      
      // Save to localStorage
      const savedVerifications = JSON.parse(localStorage.getItem('receiptVerifications') || '{}');
      savedVerifications[receiptId] = verificationInfo;
      localStorage.setItem('receiptVerifications', JSON.stringify(savedVerifications));
      
      return {
        success: true,
        receiptId,
        verificationInfo,
        qrCodeUrl: verificationInfo.qrCodeUrl,
        verificationUrl: result.verificationUrl
      };
      
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Verify a receipt
  const verifyReceiptById = useCallback(async (receiptId, receiptData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate hash from current data
      const currentHash = await generateReceiptHash(receiptData);
      
      // Get stored hash from localStorage
      const savedVerifications = JSON.parse(localStorage.getItem('receiptVerifications') || '{}');
      const storedInfo = savedVerifications[receiptId];
      
      if (!storedInfo) {
        // Try to verify with server
        const result = await verifyReceipt(receiptId, currentHash);
        return {
          success: result.success,
          isGenuine: result.isGenuine,
          message: result.message,
          data: result.data
        };
      }
      
      // Verify with server
      const result = await verifyReceipt(receiptId, currentHash);
      
      return {
        success: result.success,
        isGenuine: result.isGenuine,
        message: result.message,
        data: result.data,
        storedHash: storedInfo.receiptHash,
        currentHash
      };
      
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Get verification info for a receipt
  const getVerificationInfo = useCallback(async (receiptId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check localStorage first
      const savedVerifications = JSON.parse(localStorage.getItem('receiptVerifications') || '{}');
      const localInfo = savedVerifications[receiptId];
      
      if (localInfo) {
        // Also get from server for latest status
        const serverResult = await getReceiptVerification(receiptId);
        
        return {
          success: true,
          localInfo,
          serverInfo: serverResult.success ? serverResult.data : null,
          verificationUrl: localInfo.verificationUrl,
          qrCodeUrl: localInfo.qrCodeUrl
        };
      }
      
      // Try to get from server
      const serverResult = await getReceiptVerification(receiptId);
      
      if (serverResult.success) {
        const verificationUrl = generateVerificationQRUrl(receiptId);
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;
        
        return {
          success: true,
          serverInfo: serverResult.data,
          verificationUrl,
          qrCodeUrl
        };
      }
      
      return {
        success: false,
        message: 'Receipt not found in verification system'
      };
      
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Check if service is online
  const checkServiceStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const status = await checkVerificationService();
      return status;
    } catch (err) {
      setError(err.message);
      return {
        online: false,
        error: err.message
      };
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Get all locally stored verifications
  const getLocalVerifications = useCallback(() => {
    try {
      const savedVerifications = JSON.parse(localStorage.getItem('receiptVerifications') || '{}');
      return Object.values(savedVerifications);
    } catch {
      return [];
    }
  }, []);
  
  // Clear local verification data
  const clearLocalVerifications = useCallback(() => {
    localStorage.removeItem('receiptVerifications');
  }, []);
  
  return {
    isLoading,
    error,
    registerReceipt,
    verifyReceipt: verifyReceiptById,
    getVerificationInfo,
    checkServiceStatus,
    getLocalVerifications,
    clearLocalVerifications,
    generateVerificationQRUrl
  };
}