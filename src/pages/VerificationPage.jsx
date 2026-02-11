// VerificationPage.jsx - MINIMAL & POWERFUL
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  QrCode, 
  Share2,
  Receipt,
  AlertTriangle,
  FileDiff
} from 'lucide-react';
import Swal from 'sweetalert2';

const VERIFICATION_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw1woB8HoaHdqtT-H3DaQv9qdEV8bB2vPxG9ZYgnsP54xMNbd6mKgRr1D2XNeHeaIJKmg/exec';

export default function VerificationPage() {
  const [receiptHash, setReceiptHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get hash from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash');
    if (hash) {
      setReceiptHash(hash);
      setTimeout(() => handleVerify(), 500);
    }
  }, []);
  
  // JSONP helper function
  const jsonpRequest = (params) => {
    return new Promise((resolve, reject) => {
      const callbackName = `jsonp_${Date.now()}`;
      params.callback = callbackName;
      
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      
      const url = `${VERIFICATION_WEB_APP_URL}?${queryString}`;
      const script = document.createElement('script');
      
      window[callbackName] = (data) => {
        if (script.parentNode) {
          document.body.removeChild(script);
        }
        delete window[callbackName];
        resolve(data);
      };
      
      script.onerror = () => {
        if (script.parentNode) {
          document.body.removeChild(script);
        }
        delete window[callbackName];
        reject(new Error('Network error'));
      };
      
      script.src = url;
      document.body.appendChild(script);
      
      setTimeout(() => {
        if (window[callbackName]) {
          if (script.parentNode) {
            document.body.removeChild(script);
          }
          delete window[callbackName];
          reject(new Error('Request timeout'));
        }
      }, 10000);
    });
  };
  
  // Analyze differences between original and modified
  const analyzeDifferences = (originalHash, providedHash) => {
    try {
      // Decode both hashes to see what changed
      const originalStr = atob(originalHash + '='.repeat((4 - originalHash.length % 4) % 4));
      const providedStr = atob(providedHash + '='.repeat((4 - providedHash.length % 4) % 4));
      
      // Parse the format: RCT20260210181-20900-3-Feb 10, 2026-23:54
      const originalParts = originalStr.split('-');
      const providedParts = providedStr.split('-');
      
      if (originalParts.length >= 3 && providedParts.length >= 3) {
        const differences = [];
        
        // Check receipt number
        if (originalParts[0] !== providedParts[0]) {
          differences.push({
            field: 'Receipt Number',
            original: originalParts[0],
            modified: providedParts[0],
            type: 'changed'
          });
        }
        
        // Check total amount
        const originalAmount = parseFloat(originalParts[1]);
        const providedAmount = parseFloat(providedParts[1]);
        if (originalAmount !== providedAmount) {
          differences.push({
            field: 'Total Amount',
            original: `₦${originalAmount.toLocaleString()}`,
            modified: `₦${providedAmount.toLocaleString()}`,
            type: 'amount_changed',
            difference: providedAmount - originalAmount
          });
        }
        
        // Check items count
        const originalItems = parseInt(originalParts[2]);
        const providedItems = parseInt(providedParts[2]);
        if (originalItems !== providedItems) {
          differences.push({
            field: 'Items Count',
            original: `${originalItems} item${originalItems !== 1 ? 's' : ''}`,
            modified: `${providedItems} item${providedItems !== 1 ? 's' : ''}`,
            type: 'items_changed',
            difference: providedItems - originalItems
          });
        }
        
        // Check date
        if (originalParts[3] !== providedParts[3]) {
          differences.push({
            field: 'Date',
            original: originalParts[3],
            modified: providedParts[3],
            type: 'date_changed'
          });
        }
        
        // Check time
        if (originalParts[4] !== providedParts[4]) {
          differences.push({
            field: 'Time',
            original: originalParts[4],
            modified: providedParts[4],
            type: 'time_changed'
          });
        }
        
        return {
          originalData: originalStr,
          providedData: providedStr,
          differences,
          summary: getSummary(differences, originalAmount, providedAmount, originalItems, providedItems)
        };
      }
    } catch (error) {
      console.error('Analysis error:', error);
    }
    
    return null;
  };
  
  const getSummary = (differences, originalAmount, providedAmount, originalItems, providedItems) => {
    if (differences.length === 0) return 'No changes detected';
    
    const amountDiff = providedAmount - originalAmount;
    const itemsDiff = providedItems - originalItems;
    
    const changes = [];
    
    if (amountDiff !== 0) {
      changes.push(`Amount ${amountDiff > 0 ? 'increased' : 'decreased'} by ₦${Math.abs(amountDiff).toLocaleString()}`);
    }
    
    if (itemsDiff !== 0) {
      changes.push(`${itemsDiff > 0 ? 'Added' : 'Removed'} ${Math.abs(itemsDiff)} item${Math.abs(itemsDiff) !== 1 ? 's' : ''}`);
    }
    
    return changes.join(', ');
  };
  
  const handleVerify = async () => {
    if (!receiptHash.trim()) {
      Swal.fire('Error', 'Please enter the verification code', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Extract receipt ID from hash
      let receiptId = '';
      try {
        const decoded = atob(receiptHash + '='.repeat((4 - receiptHash.length % 4) % 4));
        const receiptIdMatch = decoded.match(/RCT\d+/);
        if (receiptIdMatch) receiptId = receiptIdMatch[0];
      } catch (e) {
        console.log('Decode error:', e);
      }
      
      if (!receiptId) {
        Swal.fire({
          title: 'Invalid Code',
          text: 'This verification code is not valid.',
          icon: 'error'
        });
        setIsLoading(false);
        return;
      }
      
      // First check if receipt exists
      const receiptInfo = await jsonpRequest({
        action: 'get_receipt',
        receipt_id: receiptId
      });
      
      if (receiptInfo.status !== 'success') {
        // NEW RECEIPT - not in system yet
        Swal.fire({
          title: '📝 New Receipt',
          html: `
            <div class="text-center">
              <div class="text-6xl mb-4">📄</div>
              <p class="text-lg mb-4">This receipt is <strong>not yet registered</strong> in our verification system.</p>
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="font-bold">Receipt: ${receiptId}</p>
                <p class="text-sm text-gray-600 mt-2">
                  This could mean:
                </p>
                <ul class="text-left text-sm mt-2">
                  <li>• The receipt was just created</li>
                  <li>• Verification wasn't enabled when saving</li>
                  <li>• It's a different receipt system</li>
                </ul>
              </div>
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'OK'
        });
        
        setVerificationResult({
          is_genuine: true,
          isNewReceipt: true,
          receiptId,
          message: 'New receipt - not yet registered'
        });
        setIsLoading(false);
        return;
      }
      
      // Existing receipt - verify hash
      const originalHash = receiptInfo.data?.receipt_hash;
      
      if (!originalHash) {
        Swal.fire({
          title: '⚠️ No Verification Data',
          text: 'This receipt exists but has no verification data.',
          icon: 'warning'
        });
        setIsLoading(false);
        return;
      }
      
      // Verify with current hash
      const verifyResult = await jsonpRequest({
        action: 'verify_receipt',
        receipt_id: receiptId,
        receipt_hash: receiptHash
      });
      
      // Analyze differences if modified
      let analysis = null;
      if (!verifyResult.is_genuine && originalHash) {
        analysis = analyzeDifferences(originalHash, receiptHash);
      }
      
      setVerificationResult({
        ...verifyResult,
        receiptId,
        originalHash,
        analysis,
        isNewReceipt: false
      });
      
      // Show appropriate alert
      if (verifyResult.is_genuine) {
        Swal.fire({
          title: '✅ Genuine',
          text: 'This receipt matches the original.',
          icon: 'success'
        });
      } else {
        const summary = analysis?.summary || 'Receipt has been modified';
        Swal.fire({
          title: '⚠️ Modified',
          text: summary,
          icon: 'warning'
        });
      }
      
    } catch (error) {
      console.error('Verification error:', error);
      Swal.fire('Error', 'Failed to verify. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShare = () => {
    if (!verificationResult) return;
    
    const url = `${window.location.origin}/verify?hash=${receiptHash}`;
    let message = '';
    
    if (verificationResult.is_genuine) {
      message = `✅ Genuine Receipt ${verificationResult.receiptId}\nVerified at: ${url}`;
    } else {
      const summary = verificationResult.analysis?.summary || 'Modified receipt';
      message = `⚠️ MODIFIED: ${summary}\nReceipt: ${verificationResult.receiptId}\nVerify: ${url}`;
    }
    
    if (navigator.share) {
      navigator.share({
        title: verificationResult.is_genuine ? 'Genuine Receipt' : 'Modified Receipt',
        text: message,
        url: url
      });
    } else {
      navigator.clipboard.writeText(message).then(() => {
        Swal.fire('Copied!', 'Link copied to clipboard', 'success');
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow mb-3">
            <Receipt className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Receipt Verification</h1>
          <p className="text-gray-600">Check if a receipt has been modified</p>
        </div>
        
        {/* Input Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={receiptHash}
              onChange={(e) => setReceiptHash(e.target.value)}
              placeholder="Paste the 32-character code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">
              Found at the bottom of your receipt
            </p>
          </div>
          
          <button
            onClick={handleVerify}
            disabled={isLoading || !receiptHash.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify Receipt'}
          </button>
        </div>
        
        {/* Results */}
        {verificationResult && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* Status Header */}
            <div className={`p-6 ${
              verificationResult.isNewReceipt ? 'bg-blue-50' :
              verificationResult.is_genuine ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex items-center justify-center mb-3">
                {verificationResult.isNewReceipt ? (
                  <div className="text-6xl">📄</div>
                ) : verificationResult.is_genuine ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-600" />
                )}
              </div>
              <h2 className="text-xl font-bold text-center mb-2">
                {verificationResult.isNewReceipt ? '📄 New Receipt' :
                 verificationResult.is_genuine ? '✅ Genuine Receipt' : '⚠️ Modified Receipt'}
              </h2>
              <p className="text-center text-gray-700">
                {verificationResult.receiptId}
              </p>
            </div>
            
            {/* New Receipt Message */}
            {verificationResult.isNewReceipt && (
              <div className="p-6 border-t">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-bold text-blue-800 mb-2">ℹ️ About New Receipts</h3>
                  <p className="text-blue-700 text-sm">
                    This receipt is <strong>not yet registered</strong> in our verification system.
                    This is normal for:
                  </p>
                  <ul className="list-disc pl-5 text-blue-700 text-sm mt-2 space-y-1">
                    <li>Receipts that were just created</li>
                    <li>Receipts saved without verification enabled</li>
                    <li>Test or draft receipts</li>
                  </ul>
                  <p className="text-blue-600 text-sm mt-3">
                    <strong>To register this receipt:</strong> Save/Download it with verification enabled.
                  </p>
                </div>
              </div>
            )}
            
            {/* Differences Analysis */}
            {!verificationResult.isNewReceipt && !verificationResult.is_genuine && verificationResult.analysis && (
              <div className="p-6 border-t">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <FileDiff className="w-4 h-4 mr-2 text-orange-500" />
                  What Was Changed
                </h3>
                
                <div className="space-y-4">
                  {verificationResult.analysis.differences.map((diff, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">{diff.field}:</span>
                        <span className={`text-sm font-bold ${
                          diff.type === 'amount_changed' && diff.difference > 0 ? 'text-red-600' : 
                          diff.type === 'amount_changed' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {diff.type === 'amount_changed' && diff.difference > 0 ? 'INCREASED' : 
                           diff.type === 'amount_changed' ? 'DECREASED' : 'CHANGED'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white p-2 rounded border">
                          <div className="text-xs text-gray-500 mb-1">Original</div>
                          <div className="font-medium">{diff.original}</div>
                        </div>
                        <div className="bg-white p-2 rounded border border-red-200">
                          <div className="text-xs text-gray-500 mb-1">Modified</div>
                          <div className="font-medium text-red-600">{diff.modified}</div>
                        </div>
                      </div>
                      
                      {/* Show difference amount */}
                      {diff.difference !== undefined && (
                        <div className={`mt-2 text-sm font-bold ${
                          diff.difference > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {diff.difference > 0 ? '+' : ''}{diff.type === 'amount_changed' ? '₦' : ''}{Math.abs(diff.difference).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Summary */}
                {verificationResult.analysis.summary && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-red-800">Summary of Changes</p>
                        <p className="text-red-700 text-sm mt-1">{verificationResult.analysis.summary}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Verification Info */}
            <div className="p-6 border-t bg-gray-50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Verifications</p>
                  <p className="font-medium">{verificationResult.verification_count || 1}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className={`font-bold ${
                    verificationResult.isNewReceipt ? 'text-blue-600' :
                    verificationResult.is_genuine ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {verificationResult.isNewReceipt ? 'NEW RECEIPT' :
                     verificationResult.is_genuine ? 'GENUINE' : 'MODIFIED'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleShare}
                  className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-900 flex items-center justify-center"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/verify?hash=${receiptHash}`;
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
                    
                    Swal.fire({
                      title: 'Scan to Verify',
                      html: `
                        <div class="text-center">
                          <img src="${qrUrl}" alt="QR Code" class="mx-auto" />
                          <p class="text-sm text-gray-600 mt-3">Scan to verify this receipt</p>
                        </div>
                      `,
                      showConfirmButton: false,
                      showCloseButton: true
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 flex items-center"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Instructions */}
        {!verificationResult && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
            <h3 className="font-bold text-blue-800 mb-2">How It Works</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Each receipt has a unique verification code</li>
              <li>• The code contains: Amount, Items, Date, Time</li>
              <li>• Any change to the receipt = Different code</li>
              <li>• Protects against price/item changes</li>
            </ul>
          </div>
        )}
        
        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>ReceiptIt Verification System</p>
          <p className="mt-1">Detects modifications instantly</p>
        </div>
      </div>
    </div>
  );
}