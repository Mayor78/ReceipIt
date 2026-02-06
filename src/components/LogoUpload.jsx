import React, { useRef, useState } from 'react';
import { Upload, X, Image, CheckCircle, ChevronDown, ChevronUp, Info, Loader2 } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';

const LogoUpload = () => {
  const { companyLogo, handleLogoUpload, removeLogo } = useReceipt();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image (PNG, JPG, SVG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('File must be under 2MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      await handleLogoUpload(file);
      if (!expanded) setExpanded(true); // Expand to show success
    } catch (err) {
      setError('Upload failed. Try again.');
      console.error('Logo upload error:', err);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect({ target: { files: [file] } });
  };

  return (
    <div className={`transition-all duration-300 rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden ${expanded ? 'ring-1 ring-blue-100' : ''}`}>
      {/* HEADER: Always Visible */}
      <div 
        className="p-3 sm:p-4 flex items-center justify-between cursor-pointer active:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
            <Image size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 tracking-tight leading-none mb-1">Company Logo</h3>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${companyLogo ? 'text-green-500' : 'text-gray-400'}`}>
              {companyLogo ? '✓ Brand identity set' : 'Logo not added'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {companyLogo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeLogo();
              }}
              className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100 active:scale-90 transition-all"
              title="Remove logo"
            >
              <X size={14} />
            </button>
          )}
          <div className="p-2 text-gray-400">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* COLLAPSIBLE CONTENT */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            {/* Logo Preview */}
            <div className="sm:col-span-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-4 flex flex-col items-center justify-center min-h-[140px]">
              {companyLogo ? (
                <div className="text-center animate-in zoom-in-95 duration-300">
                  <div className="relative w-20 h-20 bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-2">
                    <img
                      src={companyLogo}
                      alt="Brand Logo"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[9px] font-black uppercase">
                    <CheckCircle size={10} className="mr-1" />
                    Active
                  </div>
                </div>
              ) : (
                <div className="text-center opacity-40">
                  <div className="w-12 h-12 mx-auto mb-2 border-2 border-gray-300 rounded-full flex items-center justify-center border-dotted">
                    <Image size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Preview Area</p>
                </div>
              )}
            </div>

            {/* Upload Zone */}
            <div className="sm:col-span-8 group">
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-full min-h-[140px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden ${
                  isUploading ? 'bg-blue-50 border-blue-300' : 
                  companyLogo ? 'bg-white border-gray-200 hover:border-blue-400' : 
                  'bg-gray-50/30 border-gray-300 hover:border-blue-500 hover:bg-white'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {isUploading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Processing...</p>
                  </div>
                ) : (
                  <div className="text-center p-6 w-full space-y-2">
                    <div className="w-10 h-10 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                      <Upload size={18} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">
                        {companyLogo ? 'Change Brand Image' : 'Click to Upload'}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        PNG, JPG, SVG • Max 2MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips and Errors Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center text-[10px] font-black uppercase tracking-tighter text-blue-500 hover:text-blue-700"
            >
              <Info size={12} className="mr-1" />
              {showTips ? 'Hide Requirements' : 'Image Requirements'}
            </button>
            
            {error && (
              <div className="px-3 py-1 bg-red-50 rounded-lg text-[10px] font-bold text-red-600 border border-red-100 animate-bounce">
                ⚠️ {error}
              </div>
            )}
          </div>

          {showTips && (
            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 animate-in slide-in-from-bottom-2 duration-300">
              <p className="text-[11px] text-blue-800 leading-relaxed">
                <strong>Best Practice:</strong> Use a high-resolution logo with a <strong>transparent background</strong> (PNG). For best receipt layout, a 1:1 square or 3:1 horizontal aspect ratio works best.
              </p>
            </div>
          )}
        </div>
      )}

      {/* QUICK UPLOAD: Visible only when collapsed and empty */}
      {!expanded && !companyLogo && !isUploading && (
        <div className="px-3 pb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all active:scale-95"
          >
            <Upload size={14} />
            <span className="text-xs font-black uppercase tracking-tight">Quick Add Logo</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoUpload;