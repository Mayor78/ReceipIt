import React, { useRef, useState } from 'react';
import { Upload, X, Image, CheckCircle, ChevronDown, ChevronUp, Info, Loader2, Target } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';

const LogoUpload = () => {
  const { companyLogo, handleLogoUpload, removeLogo } = useReceipt();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // LOGIC UNTOUCHED
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Invalid format: Use PNG, JPG, SVG');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Size limit: Under 2MB');
      return;
    }
    setIsUploading(true);
    setError('');
    try {
      await handleLogoUpload(file);
      if (!expanded) setExpanded(true);
    } catch (err) {
      setError('Upload failed.');
      console.error('Logo upload error:', err);
    } finally {
      setIsUploading(false);
      if (event.target) event.target.value = '';
    }
  };

  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect({ target: { files: [file] } });
  };

  return (
    <div className={`transition-all duration-500 rounded-3xl border ${expanded ? 'bg-[#11141b] border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'bg-[#11141b]/50 border-white/5 shadow-sm hover:border-white/10'} overflow-hidden`}>
      
      {/* HEADER */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer group transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${companyLogo ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
            {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Image size={22} />}
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-tight uppercase leading-none mb-1.5">Asset Management</h3>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${companyLogo ? 'bg-emerald-500' : 'bg-slate-600'}`} />
              <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${companyLogo ? 'text-emerald-500' : 'text-slate-500'}`}>
                {companyLogo ? 'Brand Identity Active' : 'Logo Required'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {companyLogo && (
            <button
              onClick={(e) => { e.stopPropagation(); removeLogo(); }}
              className="p-2.5 text-red-400 bg-red-400/5 border border-red-400/10 rounded-xl hover:bg-red-400/20 active:scale-90 transition-all"
            >
              <X size={14} />
            </button>
          )}
          <div className={`p-1.5 rounded-lg transition-colors ${expanded ? 'bg-emerald-500 text-black' : 'text-slate-500 bg-white/5'}`}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>

      {/* COLLAPSIBLE CONTENT */}
      {expanded && (
        <div className="px-5 pb-5 space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Logo Preview (The "Display" Unit) */}
            <div className="md:col-span-5 relative group overflow-hidden bg-black/40 rounded-[2rem] border border-white/5 p-6 flex flex-col items-center justify-center min-h-[180px]">
              {/* Internal Grid Pattern for Preview */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:10px_10px]" />
              
              {companyLogo ? (
                <div className="relative z-10 text-center animate-in zoom-in-95 duration-500">
                  <div className="relative group/img">
                    <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-2xl opacity-0 group-hover/img:opacity-100 transition-opacity" />
                    <div className="relative w-28 h-28 bg-white/5 backdrop-blur-md p-3 rounded-[2rem] border border-white/10 mb-4 shadow-2xl">
                      <img
                        src={companyLogo}
                        alt="Brand Logo"
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                    Verified Asset
                  </span>
                </div>
              ) : (
                <div className="text-center relative z-10 opacity-20">
                  <Target size={32} className="text-white mx-auto mb-3" />
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Target Area</p>
                </div>
              )}
            </div>

            {/* Upload Zone (The "Interaction" Unit) */}
            <div className="md:col-span-7">
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative h-full min-h-[180px] border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${
                  isUploading ? 'bg-emerald-500/5 border-emerald-500/50' : 
                  companyLogo ? 'bg-white/[0.02] border-white/10 hover:border-emerald-500/40' : 
                  'bg-white/[0.01] border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]'
                }`}
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

                {isUploading ? (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Uploading...</p>
                  </div>
                ) : (
                  <div className="text-center p-8 w-full space-y-4">
                    <div className="w-14 h-14 mx-auto bg-emerald-500 text-black rounded-[1.25rem] flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.3)] group-hover:scale-110 group-hover:-translate-y-1 transition-all">
                      <Upload size={24} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-black text-white uppercase tracking-wider">
                        {companyLogo ? 'Replace Identity' : 'Initialize Upload'}
                      </p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                        Drag & Drop • Max 2MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer UI */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/5">
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center text-[9px] font-black uppercase tracking-[0.1em] text-slate-500 hover:text-emerald-400 transition-colors"
            >
              <Info size={14} className="mr-1.5" />
              Technical Specs
            </button>
            
            {error && (
              <div className="px-4 py-2 bg-red-500/10 rounded-xl text-[10px] font-black text-red-400 border border-red-500/20 animate-pulse">
                ERR_SYSTEM: {error}
              </div>
            )}
          </div>

          {showTips && (
            <div className="bg-emerald-500/[0.03] p-4 rounded-2xl border border-emerald-500/10 animate-in slide-in-from-bottom-2 duration-500">
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                <strong className="text-emerald-400 uppercase text-[9px] tracking-widest mr-2">Optimization:</strong> 
                Use a transparent PNG. Square (1:1) ratios ensure perfectly centered alignment on the final receipt output.
              </p>
            </div>
          )}
        </div>
      )}

      {/* QUICK UPLOAD (Collapsed State) */}
      {!expanded && !companyLogo && !isUploading && (
        <div className="px-4 pb-4">
          <button
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="w-full flex items-center justify-center space-x-3 py-4 bg-white/[0.02] rounded-2xl border border-dashed border-white/10 text-slate-400 hover:bg-emerald-500/[0.05] hover:border-emerald-500/30 hover:text-emerald-400 transition-all active:scale-[0.98] group"
          >
            <Upload size={14} className="group-hover:animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quick Boot Identity</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoUpload;