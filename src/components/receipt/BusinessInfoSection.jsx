import React, { useState, useEffect } from 'react';
import SectionHeader from './SectionHeader';
import { Building2, Edit2, Check } from 'lucide-react';

const BusinessInfoSection = ({ 
  isExpanded, 
  onToggle, 
  data, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    storeAddress: '',
    storePhone: '',
    storeEmail: '',
    tinNumber: '',
    rcNumber: ''
  });

  // Load data from props when available
  useEffect(() => {
    if (data) {
      setFormData({
        storeName: data.storeName || '',
        storeAddress: data.storeAddress || '',
        storePhone: data.storePhone || '',
        storeEmail: data.storeEmail || '',
        tinNumber: data.tinNumber || '',
        rcNumber: data.rcNumber || ''
      });
    }
  }, [data]);

  // Check if business info is complete
  const hasBusinessInfo = () => {
    return !!(formData.storeName && formData.storeAddress && formData.storePhone);
  };

  // Check if field has data from sheet
  const hasStoredData = (field) => {
    return !!data?.[field];
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onUpdate(field, value);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Trigger any save callback if needed
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Determine if fields should be editable
  const canEdit = () => {
    // Can edit if:
    // 1. User explicitly clicked edit button, OR
    // 2. No stored data exists for the field
    return isEditing || !hasBusinessInfo();
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <SectionHeader 
        title="Business Info" 
        details={hasBusinessInfo() ? "Your business information" : "Add Your Business Information"}
        icon={Building2} 
        sectionKey="businessInfo"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ 
          text: hasBusinessInfo() ? 'Saved' : 'Required', 
          className: hasBusinessInfo() ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700' 
        }}
      />
      
      {isExpanded && (
        <div className="pt-4 space-y-4 border-t">
          {/* Business Name - Required */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-700">
                Business Name <span className="text-red-500">*</span>
              </label>
              {hasStoredData('storeName') && !isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
              )}
            </div>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => handleInputChange('storeName', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                !canEdit() && hasStoredData('storeName') 
                  ? 'bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed' 
                  : 'border-gray-300'
              }`}
              placeholder="ABC Stores Limited"
              readOnly={!canEdit() && hasStoredData('storeName')}
              disabled={!canEdit() && hasStoredData('storeName')}
            />
            {!formData.storeName && !isEditing && (
              <p className="text-xs text-amber-600 mt-1">
                No business name found. Please enter your business name.
              </p>
            )}
            {hasStoredData('storeName') && !isEditing && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Check size={12} /> Loaded from your store registration
              </p>
            )}
          </div>
          
          {/* Business Address - Required */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Business Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.storeAddress}
              onChange={(e) => handleInputChange('storeAddress', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                !canEdit() && hasStoredData('storeAddress') 
                  ? 'bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed' 
                  : 'border-gray-300'
              }`}
              placeholder="Shop 15, Allen Avenue, Ikeja, Lagos"
              readOnly={!canEdit() && hasStoredData('storeAddress')}
              disabled={!canEdit() && hasStoredData('storeAddress')}
            />
            {!formData.storeAddress && !isEditing && (
              <p className="text-xs text-amber-600 mt-1">
                No address found. Please enter your business address.
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Phone - Required */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.storePhone}
                onChange={(e) => handleInputChange('storePhone', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !canEdit() && hasStoredData('storePhone') 
                    ? 'bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed' 
                    : 'border-gray-300'
                }`}
                placeholder="0803 456 7890"
                readOnly={!canEdit() && hasStoredData('storePhone')}
                disabled={!canEdit() && hasStoredData('storePhone')}
              />
              {!formData.storePhone && !isEditing && (
                <p className="text-xs text-amber-600 mt-1">
                  No phone number found. Please enter your business phone.
                </p>
              )}
            </div>
            
            {/* Email - From Registration */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.storeEmail}
                onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg ${
                  hasStoredData('storeEmail')
                    ? 'bg-gray-50 border-gray-200 text-gray-700'
                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="info@business.com.ng"
                readOnly={hasStoredData('storeEmail')}
                disabled={hasStoredData('storeEmail')}
              />
              {hasStoredData('storeEmail') && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Check size={12} /> From store registration
                </p>
              )}
            </div>
            
            {/* TIN Number - Optional */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                TIN Number
              </label>
              <input
                type="text"
                value={formData.tinNumber}
                onChange={(e) => handleInputChange('tinNumber', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="TIN: 12345678-0001"
              />
            </div>
            
            {/* RC Number - Optional */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                RC Number
              </label>
              <input
                type="text"
                value={formData.rcNumber}
                onChange={(e) => handleInputChange('rcNumber', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="RC 123456"
              />
            </div>
          </div>

          {/* Edit/Save Controls */}
          {hasBusinessInfo() && !isEditing && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 size={16} />
                Edit Business Info
              </button>
            </div>
          )}

          {isEditing && (
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Check size={16} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessInfoSection;