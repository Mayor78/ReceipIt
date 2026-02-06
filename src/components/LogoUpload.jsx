import React, { useRef, useState } from 'react';
import { Upload, X, Image, CheckCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
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
      setError('Please select an image file (PNG, JPG, SVG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('File size should be less than 2MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      await handleLogoUpload(file);
    } catch (err) {
      setError('Failed to upload logo. Please try again.');
      console.error('Logo upload error:', err);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect({ target: { files: [file] } });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="border rounded-lg p-2 bg-white">
      {/* Header - Always visible */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
            <Image className="text-blue-600" size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Company Logo</h3>
            <p className="text-xs text-gray-500">
              {companyLogo ? '✓ Logo uploaded' : 'No logo added'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {companyLogo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeLogo();
              }}
              className="text-xs text-red-600 hover:text-red-700 flex items-center px-2 py-1 bg-red-50 rounded"
            >
              <X size={12} className="mr-1" />
              Remove
            </button>
          )}
          {expanded ? (
            <ChevronUp className="text-gray-500" size={20} />
          ) : (
            <ChevronDown className="text-gray-500" size={20} />
          )}
        </div>
      </div>

      {/* Collapsible Content */}
      {expanded && (
        <div className="mt-4 space-y-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Logo Preview - Compact */}
            <div className="md:col-span-1 bg-gray-50 border rounded-lg p-4 flex flex-col items-center justify-center">
              {companyLogo ? (
                <div className="space-y-2">
                  <div className="relative w-24 h-24 mx-auto">
                    <img
                      src={companyLogo}
                      alt="Company Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center text-green-600 text-xs">
                    <CheckCircle size={14} className="mr-1" />
                    Uploaded
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                    <Image className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-500 text-xs">No logo</p>
                </div>
              )}
            </div>

            {/* Upload Area - Compact */}
            <div className="md:col-span-2">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all h-full ${
                  isUploading
                    ? 'border-blue-400 bg-blue-50'
                    : companyLogo
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {isUploading ? (
                  <div className="space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-blue-600 text-sm">Uploading...</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2 w-full">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                        <Upload className="text-blue-600" size={20} />
                      </div>
                    </div>
                    <p className="font-medium text-gray-800 text-sm">
                      {companyLogo ? 'Replace Logo' : 'Upload Logo'}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Click or drag & drop • PNG, JPG, SVG • Max 2MB
                    </p>
                    <button className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium">
                      {companyLogo ? 'Change Logo' : 'Select Logo'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Toggle */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center text-xs text-blue-600 hover:text-blue-700"
            >
              <Info size={14} className="mr-1" />
              {showTips ? 'Hide Tips' : 'Show Tips'}
            </button>
            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}
          </div>

          {/* Tips - Collapsible */}
          {showTips && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Pro Tip:</strong> Use a transparent PNG logo (200×200px min) for best results.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Upload Button (when collapsed) */}
      {!expanded && !companyLogo && (
        <div className="mt-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Upload size={14} />
            <span>Quick Upload Logo</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoUpload;