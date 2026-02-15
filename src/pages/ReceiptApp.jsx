// pages/ReceiptApp.jsx - DEBUG VERSION
import React, { useState, useEffect } from 'react';
import { ReceiptProvider } from '../context/ReceiptContext';
import { useNavigate } from 'react-router-dom';
import { History, Settings, LayoutDashboard, Zap } from 'lucide-react';

// Unified Skeleton Component
const Skeleton = ({ height = "100px", className = "" }) => (
  <div className={`w-full animate-pulse bg-slate-800/50 rounded-xl relative overflow-hidden ${className}`} style={{ height }}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" 
         style={{ transform: 'skewX(-20deg)' }} />
  </div>
);

// CSS for the shimmer effect
const SkeletonStyles = () => (
  <style>{`
    @keyframes shimmer {
      100% { transform: translateX(100%) skewX(-20deg); }
    }
  `}</style>
);

const SafeComponent = ({ children, name }) => {
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log(`📱 Attempting to load: ${name}`);
    setLoaded(true);
  }, []);

  if (error) {
    return (
      <div style={{ 
        background: '#ff000020', 
        border: '1px solid red', 
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px'
      }}>
        <h3 style={{ color: 'red' }}>❌ Error in {name}</h3>
        <pre style={{ color: 'red', fontSize: '12px' }}>{error.message}</pre>
      </div>
    );
  }

  try {
    return children;
  } catch (err) {
    console.error(`❌ Error in ${name}:`, err);
    setError(err);
    return null;
  }
};

const ReceiptApp = () => {
  const navigate = useNavigate();
  const [components, setComponents] = useState({
    logo: false,
    template: false,
    form: false,
    display: false
  });

  console.log('🔥 ReceiptApp rendering');

  useEffect(() => {
    const loadSequence = async () => {
      console.log('📱 Starting component load sequence...');
      
      setTimeout(() => {
        console.log('📱 Loading LogoUpload...');
        setComponents(prev => ({ ...prev, logo: true }));
      }, 500);
      
      setTimeout(() => {
        console.log('📱 Loading TemplateSelector...');
        setComponents(prev => ({ ...prev, template: true }));
      }, 1000);
      
      setTimeout(() => {
        console.log('📱 Loading ReceiptForm...');
        setComponents(prev => ({ ...prev, form: true }));
      }, 1500);
      
      setTimeout(() => {
        console.log('📱 Loading ReceiptDisplay...');
        setComponents(prev => ({ ...prev, display: true }));
      }, 2000);
    };

    loadSequence();
  }, []);

  const LogoUpload = components.logo ? React.lazy(() => import('../components/LogoUpload').catch(err => {
    console.error('❌ Failed to load LogoUpload:', err);
    return { default: () => <div style={{color:'red'}}>LogoUpload failed to load</div> };
  })) : () => <div className="p-4"><Skeleton height="120px" /></div>;

  const TemplateSelector = components.template ? React.lazy(() => import('../components/receiptTemplates/TemplateSelector').catch(err => {
    console.error('❌ Failed to load TemplateSelector:', err);
    return { default: () => <div style={{color:'red'}}>TemplateSelector failed</div> };
  })) : () => <div className="p-4"><Skeleton height="120px" /></div>;

  const ReceiptForm = components.form ? React.lazy(() => import('../components/ReceiptForm').catch(err => {
    console.error('❌ Failed to load ReceiptForm:', err);
    return { default: () => <div style={{color:'red'}}>ReceiptForm failed</div> };
  })) : () => <div className="p-4 space-y-4">
      <Skeleton height="40px" />
      <Skeleton height="200px" />
      <Skeleton height="40px" />
    </div>;

  const ReceiptDisplay = components.display ? React.lazy(() => import('../components/ReceiptDisplay').catch(err => {
    console.error('❌ Failed to load ReceiptDisplay:', err);
    return { default: () => <div style={{color:'red'}}>ReceiptDisplay failed</div> };
  })) : () => <div className="p-4"><Skeleton height="600px" /></div>;

  return (
    <ReceiptProvider>
      <SkeletonStyles />
      <div className="min-h-screen bg-[#0d1117] text-slate-300 font-sans">
        <div className="max-w-[1600px] mx-auto">
          
          <header className="bg-[#161b22]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[100]">
            <div className="px-2 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Zap size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xs font-black text-white uppercase tracking-[0.2em]">SmartReceipt</h1>
                </div>
              </div>
              
              <div className="text-[10px] text-slate-400 font-mono">
                SYNC_STATUS: {Object.values(components).filter(Boolean).length}/4
              </div>
            </div>
          </header>

          <main className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <section className="bg-[#161b22] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="px-3 py-3 border-b border-white/5 bg-white/[0.02]">
                      <h2 className="text-[10px] font-black text-white uppercase tracking-wider">Brand Identity</h2>
                    </div>
                    <div>
                      <SafeComponent name="LogoUpload">
                        <React.Suspense fallback={<div className="p-4"><Skeleton height="120px" /></div>}>
                          <LogoUpload />
                        </React.Suspense>
                      </SafeComponent>
                    </div>
                  </section>
                  
                  <section className="bg-[#161b22] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="px-3 py-3 border-b border-white/5 bg-white/[0.02]">
                      <h2 className="text-[10px] font-black text-white uppercase tracking-wider">Visual Style</h2>
                    </div>
                    <div>
                      <SafeComponent name="TemplateSelector">
                        <React.Suspense fallback={<div className="p-4"><Skeleton height="120px" /></div>}>
                          <TemplateSelector />
                        </React.Suspense>
                      </SafeComponent>
                    </div>
                  </section>
                </div>
                
                <section className="bg-[#161b22] rounded-2xl border border-white/5 overflow-hidden">
                  <div className="px-3 py-3 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-[10px] font-black text-white uppercase tracking-wider">Transaction Data</h2>
                  </div>
                  <div>
                    <SafeComponent name="ReceiptForm">
                      <React.Suspense fallback={<div className="p-4 space-y-4"><Skeleton height="40px" /><Skeleton height="200px" /></div>}>
                        <ReceiptForm />
                      </React.Suspense>
                    </SafeComponent>
                  </div>
                </section>
              </div>

              <div className="lg:col-span-5 xl:col-span-4">
                <section className="bg-[#161b22] rounded-2xl border border-white/10 overflow-hidden">
                  <div className="px-3 py-3 border-b border-white/5 bg-white/[0.04]">
                    <h2 className="text-[10px] font-black text-white uppercase tracking-wider">Preview</h2>
                  </div>
                  <div>
                    <SafeComponent name="ReceiptDisplay">
                      <React.Suspense fallback={<div className="p-4"><Skeleton height="600px" /></div>}>
                        <ReceiptDisplay />
                      </React.Suspense>
                    </SafeComponent>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ReceiptProvider>
  );
};

export default ReceiptApp;