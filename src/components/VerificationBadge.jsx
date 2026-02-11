import React, { useState } from 'react';
import { useReceiptVerification } from '../hooks/useReceiptVerification';

export function VerificationBadge({ receiptId, receiptData, showDetails = false }) {
  const { getVerificationInfo, verifyReceipt, isLoading } = useReceiptVerification();
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationInfo, setVerificationInfo] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  
  const handleVerify = async () => {
    if (!receiptId || !receiptData) return;
    
    const result = await verifyReceipt(receiptId, receiptData);
    setVerificationResult(result);
    setIsVerified(true);
  };
  
  const handleGetInfo = async () => {
    if (!receiptId) return;
    
    const info = await getVerificationInfo(receiptId);
    setVerificationInfo(info);
  };
  
  if (!receiptId) {
    return (
      <div className="verification-badge warning">
        <span>⚠️ No receipt ID</span>
      </div>
    );
  }
  
  return (
    <div className="verification-badge">
      <div className="badge-header">
        <h4>🔒 Receipt Verification</h4>
        <button 
          onClick={handleVerify}
          disabled={isLoading}
          className="verify-btn"
        >
          {isLoading ? 'Checking...' : 'Verify Now'}
        </button>
      </div>
      
      {verificationResult && (
        <div className={`verification-result ${verificationResult.isGenuine ? 'genuine' : 'modified'}`}>
          {verificationResult.isGenuine ? (
            <div className="result genuine">
              <span>✅ GENUINE RECEIPT</span>
              <p>This receipt matches the original record.</p>
            </div>
          ) : (
            <div className="result modified">
              <span>⚠️ MODIFIED RECEIPT</span>
              <p>This receipt has been altered from the original.</p>
            </div>
          )}
        </div>
      )}
      
      {showDetails && verificationInfo && (
        <div className="verification-details">
          <h5>Verification Details</h5>
          {verificationInfo.verificationUrl && (
            <p>
              <strong>Verify at:</strong>{' '}
              <a href={verificationInfo.verificationUrl} target="_blank" rel="noopener noreferrer">
                {verificationInfo.verificationUrl}
              </a>
            </p>
          )}
          {verificationInfo.qrCodeUrl && (
            <div className="qr-code">
              <img src={verificationInfo.qrCodeUrl} alt="QR Code for verification" />
              <small>Scan to verify</small>
            </div>
          )}
        </div>
      )}
      
      {!isVerified && (
        <div className="verification-hint">
          <small>Click "Verify Now" to check authenticity</small>
        </div>
      )}
    </div>
  );
}

// Add CSS to your styles
const styles = `
.verification-badge {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background: #f9f9f9;
}

.verification-badge.warning {
  border-color: #ffc107;
  background: #fff8e1;
}

.badge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.badge-header h4 {
  margin: 0;
  color: #333;
}

.verify-btn {
  background: #4a86e8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.verify-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.verification-result {
  padding: 12px;
  border-radius: 6px;
  margin: 12px 0;
}

.verification-result.genuine {
  background: #d4edda;
  border: 1px solid #c3e6cb;
}

.verification-result.modified {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
}

.result span {
  font-weight: bold;
  font-size: 16px;
}

.result.genuine span {
  color: #155724;
}

.result.modified span {
  color: #721c24;
}

.result p {
  margin: 8px 0 0 0;
  font-size: 14px;
}

.verification-details {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #ddd;
}

.verification-details h5 {
  margin: 0 0 12px 0;
  color: #555;
}

.qr-code {
  text-align: center;
  margin: 16px 0;
}

.qr-code img {
  width: 120px;
  height: 120px;
}

.qr-code small {
  display: block;
  margin-top: 8px;
  color: #666;
}

.verification-hint {
  text-align: center;
  color: #666;
  font-size: 12px;
  margin-top: 8px;
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}