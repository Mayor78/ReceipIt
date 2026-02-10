import React, { useEffect } from 'react';
import { User } from 'lucide-react';
import SectionHeader from './SectionHeader';

const CustomerInfoSection = ({ 
  isExpanded, 
  onToggle, 
  data, 
  onUpdate 
}) => {
  // Auto-expand when either Bill To or Ship To is checked
  useEffect(() => {
    if ((data.includeBillTo || data.includeShipTo) && !isExpanded) {
      // Add a small delay to ensure smooth animation
      const timer = setTimeout(() => {
        onToggle('customerInfo');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [data.includeBillTo, data.includeShipTo, isExpanded, onToggle]);

  // Handle checkbox changes with auto-expand
  const handleCheckboxChange = (field, checked) => {
    onUpdate(field, checked);
    
    // If checking either box and section is collapsed, expand it
    if (checked && !isExpanded) {
      setTimeout(() => {
        onToggle('customerInfo');
      }, 50);
    }
  };

  // Prevent the checkbox labels from triggering section toggle
  const handleCheckboxClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="bg-white rounded-md p-4 shadow-sm">
      <SectionHeader 
        title="Customer" 
        details="Details of customer"
        icon={User} 
        sectionKey="customerInfo"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ 
          text: data.includeBillTo || data.includeShipTo ? 'Active' : 'Optional', 
          className: data.includeBillTo || data.includeShipTo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700' 
        }}
      >
        <div className="flex gap-2" onClick={handleCheckboxClick}>
          <label className="flex items-center space-x-1 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.includeBillTo}
              onChange={(e) => handleCheckboxChange('includeBillTo', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 group-hover:ring-2 group-hover:ring-blue-200 transition-all"
            />
            <span className={`text-xs ${data.includeBillTo ? 'font-medium text-blue-700' : 'text-gray-600 group-hover:text-blue-600'} transition-colors`}>
              Bill To
            </span>
          </label>
          <label className="flex items-center space-x-1 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.includeShipTo}
              onChange={(e) => handleCheckboxChange('includeShipTo', e.target.checked)}
              className="w-4 h-4 text-green-600 rounded focus:ring-green-500 group-hover:ring-2 group-hover:ring-green-200 transition-all"
            />
            <span className={`text-xs ${data.includeShipTo ? 'font-medium text-green-700' : 'text-gray-600 group-hover:text-green-600'} transition-colors`}>
              Ship To
            </span>
          </label>
        </div>
      </SectionHeader>
      
      {/* Always show content when either option is selected, even if not expanded yet (for smooth transition) */}
      {(isExpanded || data.includeBillTo || data.includeShipTo) && (
        <div className={`pt-4 space-y-4 border-t transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          {/* Bill To Section */}
          {data.includeBillTo && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-4 bg-blue-500 rounded"></div>
                <h4 className="text-xs font-semibold text-gray-700">BILL TO</h4>
                {data.billToName && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    ✓ Added
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={data.billToName}
                    onChange={(e) => onUpdate('billToName', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Customer Name"
                    autoFocus={data.includeBillTo && !data.billToName}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={data.billToPhone}
                    onChange={(e) => onUpdate('billToPhone', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phone number"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={data.billToAddress}
                    onChange={(e) => onUpdate('billToAddress', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Ship To Section */}
          {data.includeShipTo && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-4 bg-green-500 rounded"></div>
                <h4 className="text-xs font-semibold text-gray-700">SHIP TO</h4>
                {data.shipToName && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    ✓ Added
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={data.shipToName}
                    onChange={(e) => onUpdate('shipToName', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Recipient Name"
                    autoFocus={data.includeShipTo && !data.shipToName}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={data.shipToPhone}
                    onChange={(e) => onUpdate('shipToPhone', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Recipient phone"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={data.shipToAddress}
                    onChange={(e) => onUpdate('shipToAddress', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Full delivery address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* No options selected message */}
          {!data.includeBillTo && !data.includeShipTo && isExpanded && (
            <div className="text-center py-4 text-gray-500 text-sm">
              <p className="mb-2">Enable "Bill To" or "Ship To" to add customer information</p>
              <p className="text-xs text-gray-400">This section will automatically expand when you select an option</p>
            </div>
          )}

          {/* Help text when both options are selected */}
          {data.includeBillTo && data.includeShipTo && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700">
                💡 <strong>Pro Tip:</strong> Use "Bill To" for billing address and "Ship To" for shipping/delivery address when they're different.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add some CSS for the fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CustomerInfoSection;