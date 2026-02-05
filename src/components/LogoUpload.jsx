import React, { useRef, useState } from 'react';
import { Upload, X, Image, CheckCircle } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';

const LogoUpload = () => {
  const { companyLogo, handleLogoUpload, removeLogo } = useReceipt();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, SVG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
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
      event.target.value = ''; // Reset file input
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Image className="mr-2" size={20} />
          Company Logo
        </h3>
        {companyLogo && (
          <button
            onClick={removeLogo}
            className="text-sm text-red-600 hover:text-red-700 flex items-center"
          >
            <X size={14} className="mr-1" />
            Remove Logo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Preview */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px]">
          {companyLogo ? (
            <div className="space-y-4">
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center justify-center text-green-600 text-sm">
                <CheckCircle size={16} className="mr-2" />
                Logo uploaded successfully
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Image className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 text-sm mb-2">No logo uploaded</p>
              <p className="text-gray-400 text-xs">Upload a logo to appear on receipts</p>
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
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
            <div className="space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-blue-600 font-medium">Uploading logo...</p>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Upload className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {companyLogo ? 'Replace Logo' : 'Upload Logo'}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Click or drag & drop
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  PNG, JPG, SVG • Max 2MB
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                {companyLogo ? 'Change Logo' : 'Select Logo'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tips:</strong> For best results, use a transparent PNG logo with a resolution of at least 200×200 pixels. 
          The logo will appear as a watermark on your receipts.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
};

export default LogoUpload;