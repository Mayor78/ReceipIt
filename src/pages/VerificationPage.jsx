import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const  VerificationPage = () => {
  const [hash, setHash] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get hash from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParam = params.get('hash');
    if (hashParam) {
      setHash(hashParam);
      handleVerify(hashParam);
    }
  }, []);

  async function handleVerify(verifyHash = hash) {
    if (!verifyHash) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Query the public verification view
      const { data, error } = await supabase
        .from('public_receipt_verification')
        .select('store_name, total_amount, issued_at')
        .eq('receipt_hash', verifyHash)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setResult({
          valid: true,
          storeName: data.store_name,
          totalAmount: data.total_amount,
          issuedAt: data.issued_at
        });
      } else {
        setResult({
          valid: false,
          message: 'Receipt not found in verification system'
        });
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message);
      setResult({
        valid: false,
        message: 'Verification failed'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Receipt</h1>
          <p className="text-gray-600">Enter the receipt hash to verify authenticity</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receipt Hash
            </label>
            <input
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="Enter 64-character hash"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Found at the bottom of your receipt (64-character code)
            </p>
          </div>
          
          <button
            onClick={() => handleVerify()}
            disabled={loading || !hash.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : 'Verify Receipt'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className={`rounded-xl shadow-lg overflow-hidden ${
            result.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`p-6 ${
              result.valid ? 'bg-green-600' : 'bg-red-600'
            }`}>
              <h2 className="text-xl font-bold text-white text-center">
                {result.valid ? '✓ GENUINE RECEIPT' : '✗ INVALID RECEIPT'}
              </h2>
            </div>
            
            <div className="p-6">
              {result.valid ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Store Name</label>
                    <p className="text-lg font-semibold text-gray-900">{result.storeName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Amount</label>
                    <p className="text-2xl font-bold text-gray-900">
                      ₦{result.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Issued Date</label>
                    <p className="text-gray-700">
                      {new Date(result.issuedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      This receipt has been verified and is authentic
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-red-700 mb-2">
                    {result.message || 'This receipt could not be verified'}
                  </p>
                  <p className="text-sm text-gray-500">
                    The receipt may be counterfeit or not registered in our system.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info box */}
        {!result && !error && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">How verification works</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Each receipt has a unique 64-character hash</li>
              <li>• The hash is generated from receipt data + store ID</li>
              <li>• Any change to the receipt creates a different hash</li>
              <li>• Genuine receipts match our database records</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerificationPage