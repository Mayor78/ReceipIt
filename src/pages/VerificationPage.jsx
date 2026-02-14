import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CheckCircle, XCircle, Receipt, Search, ShieldCheck, ShieldAlert, Calendar, Store, CreditCard, RefreshCw } from 'lucide-react';

export default function VerificationPage() {
  const [receiptId, setReceiptId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ============================================
  // LOGIC (UNTOUCHED)
  // ============================================
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
        setResult({ valid: false, message: 'Receipt not found' });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setResult({ valid: false, message: 'Verification failed' });
    } finally {
      setLoading(false);
    }
  }

  // ============================================
  // MODERN RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-[#0a0c10] text-white selection:bg-emerald-500/30">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{
            backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        ></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative max-w-2xl mx-auto py-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 mb-6 animate-pulse">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-3">
            Trust <span className="text-emerald-400">Scanner</span>
          </h1>
          <p className="text-slate-400 font-medium">Verified Receipt Authentication System</p>
        </div>
        
        {/* Search Input Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl mb-8">
          <div className="relative flex flex-col md:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                value={receiptId}
                onChange={(e) => setReceiptId(e.target.value)}
                placeholder="Enter Receipt ID (e.g. RCT...)"
                className="w-full bg-transparent pl-12 pr-4 py-5 outline-none font-bold text-lg placeholder:text-slate-600 border-none focus:ring-0"
              />
            </div>
            <button
              onClick={() => handleVerify()}
              disabled={loading || !receiptId}
              className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-black px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : 'VERIFY NOW'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className={`animate-in slide-in-from-bottom-4 duration-500`}>
            {result.valid ? (
              <div className="relative overflow-hidden bg-white rounded-[2.5rem] text-slate-900 shadow-2xl">
                {/* Genuine Badge Overlay */}
                <div className="absolute top-0 right-0 bg-emerald-500 text-black px-6 py-2 rounded-bl-3xl font-black text-xs tracking-widest uppercase">
                  Verified Genuine
                </div>

                <div className="p-8 pt-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="text-emerald-600" size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tight">Receipt Validated</h2>
                      <p className="text-slate-500 text-sm font-medium">Transaction is legally recorded</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Store size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Issuing Store</span>
                      </div>
                      <p className="text-lg font-black text-slate-800">{result.storeName}</p>
                    </div>

                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-2 text-emerald-600/60 mb-1">
                        <CreditCard size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Total Paid</span>
                      </div>
                      <p className="text-2xl font-black text-emerald-700">
                        ₦{result.totalAmount?.toLocaleString()}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 md:col-span-2">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Calendar size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Date & Time of Issue</span>
                      </div>
                      <p className="font-bold text-slate-700">
                        {new Date(result.issuedAt).toLocaleDateString('en-NG', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-dashed border-slate-200 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                      SECURED BY RECEIPTIT BLOCK-VERIFY
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-[2.5rem] p-8 text-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldAlert className="text-red-500" size={40} />
                </div>
                <h2 className="text-2xl font-black text-red-500 uppercase tracking-tight mb-2">Verification Failed</h2>
                <p className="text-red-300/70 font-medium mb-6">{result.message}</p>
                <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                  <p className="text-xs text-red-400/80 leading-relaxed">
                    This receipt ID does not exist in our secure database. If you believe this is an error, please contact the issuing store.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}