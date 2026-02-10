import React, { useState } from 'react';
import { CreditCard, Tag, Calendar, User, ChevronDown } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { FileText } from 'lucide-react';

const getDocumentConfig = (type) => {
  switch(type) {
    case 'invoice':
      return {
        color: 'bg-purple-100',
        textColor: 'text-purple-600'
      };
    case 'quote':
      return {
        color: 'bg-blue-100',
        textColor: 'text-blue-600'
      };
    case 'receipt':
    default:
      return {
        color: 'bg-green-100',
        textColor: 'text-green-600'
      };
  }
};

// Predefined roles for selection
const PREDEFINED_ROLES = [
  { value: 'owner', label: 'Owner' },
  { value: 'manager', label: 'Manager' },
  { value: 'cashier', label: 'Cashier' },
  { value: 'sales_person', label: 'Sales Person' },
  { value: 'admin', label: 'Admin' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'custom', label: 'Other (Custom)...' }
];

const DocumentDetailsSection = ({ 
  isExpanded, 
  onToggle, 
  data, 
  onUpdate 
}) => {
  const docConfig = getDocumentConfig(data.receiptType);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customRole, setCustomRole] = useState('');
  
  // Initialize selected role based on current cashierName
  const getSelectedRole = () => {
    if (!data.cashierName) return '';
    
    // Check if cashierName matches any predefined role label
    const predefined = PREDEFINED_ROLES.find(role => 
      role.label.toLowerCase() === data.cashierName.toLowerCase() ||
      role.value === data.cashierName.toLowerCase()
    );
    
    return predefined ? predefined.value : 'custom';
  };

  const handleRoleChange = (roleValue) => {
    if (roleValue === 'custom') {
      setShowCustomInput(true);
      // If there's already a custom value, keep it
      if (data.cashierName && !PREDEFINED_ROLES.some(r => 
        r.label.toLowerCase() === data.cashierName.toLowerCase())) {
        setCustomRole(data.cashierName);
      }
    } else {
      setShowCustomInput(false);
      const selectedRole = PREDEFINED_ROLES.find(r => r.value === roleValue);
      if (selectedRole) {
        onUpdate('cashierName', selectedRole.label);
      }
    }
  };

  const handleCustomRoleSave = () => {
    if (customRole.trim()) {
      onUpdate('cashierName', customRole.trim());
      setShowCustomInput(false);
    }
  };

  const handleCustomRoleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCustomRoleSave();
    }
  };

  const handleCancelCustom = () => {
    setShowCustomInput(false);
    setCustomRole('');
    // Revert to last selected predefined role if exists
    const selectedRole = getSelectedRole();
    if (selectedRole && selectedRole !== 'custom') {
      const role = PREDEFINED_ROLES.find(r => r.value === selectedRole);
      if (role) {
        onUpdate('cashierName', role.label);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <SectionHeader 
        title="Document Details" 
        details="Who is filling it"
        icon={FileText}
        sectionKey="documentDetails"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ 
          text: data.receiptType === 'invoice' ? 'Invoice' : 
                data.receiptType === 'quote' ? 'Quote' : 'Receipt',
          className: `${docConfig.color} ${docConfig.textColor}`
        }}
      />
      
      {isExpanded && (
        <div className="pt-4 space-y-4 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                {data.receiptType === 'invoice' ? 'Invoice #' : 
                 data.receiptType === 'quote' ? 'Quote #' : 'Receipt #'} *
              </label>
              <input
                type="text"
                value={data.receiptNumber}
                onChange={(e) => onUpdate('receiptNumber', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={
                  data.receiptType === 'invoice' ? 'INV2024/0001' :
                  data.receiptType === 'quote' ? 'QTE2024/0001' :
                  'RCT000001'
                }
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Document Filled By *
              </label>
              
              {!showCustomInput ? (
                <div className="relative">
                  <select
                    value={getSelectedRole()}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select role...</option>
                    {PREDEFINED_ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                  
                  {/* Show current value preview */}
                  {data.cashierName && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                      <User size={14} />
                      <span className="font-medium">{data.cashierName}</span>
                      <span className="text-gray-400">is filling this document</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      onKeyPress={handleCustomRoleKeyPress}
                      placeholder="Enter custom role (e.g., Assistant Manager)"
                      className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={handleCustomRoleSave}
                      className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelCustom}
                      className="px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Press Enter or click Save to confirm
                  </p>
                </div>
              )}
              
              {/* Help text */}
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500">
                  Select who is filling this document. This helps identify the responsible person.
                </p>
                <div className="flex flex-wrap gap-1">
                  {PREDEFINED_ROLES.slice(0, 4).map((role) => (
                    <button
                      key={role.value}
                      onClick={() => handleRoleChange(role.value)}
                      className={`text-xs px-2 py-1 rounded ${
                        data.cashierName === role.label
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Specific Fields */}
          {data.receiptType === 'invoice' && (
            <div className="space-y-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 text-purple-700 mb-2">
                <CreditCard size={16} />
                <span className="text-sm font-medium">Invoice Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    PO Number
                  </label>
                  <input
                    type="text"
                    value={data.poNumber}
                    onChange={(e) => onUpdate('poNumber', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="PO2024/0001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={data.dueDate}
                    onChange={(e) => onUpdate('dueDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Terms
                  </label>
                  <select
                    value={data.termsAndConditions || 'Net 30'}
                    onChange={(e) => onUpdate('termsAndConditions', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  >
                    <option>Net 15</option>
                    <option>Net 30</option>
                    <option>Net 45</option>
                    <option>Due on Receipt</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Quote Specific Fields */}
          {data.receiptType === 'quote' && (
            <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 text-blue-700 mb-2">
                <Tag size={16} />
                <span className="text-sm font-medium">Quote Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={data.dueDate}
                    onChange={(e) => onUpdate('dueDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Quote Terms
                  </label>
                  <select
                    value={data.termsAndConditions || '30 Days'}
                    onChange={(e) => onUpdate('termsAndConditions', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  >
                    <option>7 Days</option>
                    <option>15 Days</option>
                    <option>30 Days</option>
                    <option>60 Days</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
        
        </div>
      )}
    </div>
  );
};

export default DocumentDetailsSection;