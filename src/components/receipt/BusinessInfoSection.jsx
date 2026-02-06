import React from 'react';
import SectionHeader from './SectionHeader';
import { Building2 } from 'lucide-react';

const BusinessInfoSection = ({ 
  isExpanded, 
  onToggle, 
  data, 
  onUpdate 
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <SectionHeader 
        title="Business Info" 
        icon={Building2} 
        sectionKey="businessInfo"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ text: 'Required', className: 'bg-blue-100 text-blue-700' }}
      />
      
      {isExpanded && (
        <div className="pt-4 space-y-4 border-t">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={data.storeName}
              onChange={(e) => onUpdate('storeName', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ABC Stores Limited"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Business Address *
            </label>
            <input
              type="text"
              value={data.storeAddress}
              onChange={(e) => onUpdate('storeAddress', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Shop 15, Allen Avenue, Ikeja, Lagos"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={data.storePhone}
                onChange={(e) => onUpdate('storePhone', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0803 456 7890"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={data.storeEmail}
                onChange={(e) => onUpdate('storeEmail', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="info@business.com.ng"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                TIN Number
              </label>
              <input
                type="text"
                value={data.tinNumber}
                onChange={(e) => onUpdate('tinNumber', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="TIN: 12345678-0001"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                RC Number
              </label>
              <input
                type="text"
                value={data.rcNumber}
                onChange={(e) => onUpdate('rcNumber', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="RC 123456"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessInfoSection;