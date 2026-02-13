import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CheckCircle, XCircle, Receipt } from 'lucide-react';

export default function VerificationPage() {
  const [receiptId, setReceiptId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get ID from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setReceiptId(id);
      handleVerify(id);
    }
  }, []);

  async function handleVerify(id = receiptId) {
    if (!id.trim()) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('public_receipt_verification')
        .select('store_name, total_amount, issued_at')
        .eq('receipt_id', id)
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
          message: 'Receipt not found'
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
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
          <Receipt className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">Verify Receipt</h1>
          <p className="text-gray-600">Enter the receipt number to verify</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <input
            type="text"
            value={receiptId}
            onChange={(e) => setReceiptId(e.target.value)}
            placeholder="e.g., RCT20260213123"
            className="w-full px-4 py-3 border rounded-lg mb-4"
          />
          
          <button
            onClick={() => handleVerify()}
            disabled={loading || !receiptId}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Receipt'}
          </button>
        </div>

        {result && (
          <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${
            result.valid ? 'border-green-500' : 'border-red-500'
          } border-2`}>
            <div className={`p-4 ${result.valid ? 'bg-green-500' : 'bg-red-500'}`}>
              <h2 className="text-white font-bold text-center">
                {result.valid ? '✓ GENUINE RECEIPT' : '✗ INVALID RECEIPT'}
              </h2>
            </div>
            
            {result.valid ? (
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Store</p>
                  <p className="text-lg font-bold">{result.storeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₦{result.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Issued</p>
                  <p>{new Date(result.issuedAt).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-red-600">{result.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}