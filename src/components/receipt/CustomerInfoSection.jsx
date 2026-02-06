import React from 'react';
import { User } from 'lucide-react';
import SectionHeader from './SectionHeader';

const CustomerInfoSection = ({ 
  isExpanded, 
  onToggle, 
  data, 
  onUpdate 
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <SectionHeader 
        title="Customer" 
        icon={User} 
        sectionKey="customerInfo"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ text: 'Optional', className: 'bg-gray-100 text-gray-700' }}
      >
        <div className="flex gap-2">
          <label className="flex items-center space-x-1 cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={data.includeBillTo}
              onChange={(e) => onUpdate('includeBillTo', e.target.checked)}
              className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <span className="text-xs text-gray-600">Bill To</span>
          </label>
          <label className="flex items-center space-x-1 cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={data.includeShipTo}
              onChange={(e) => onUpdate('includeShipTo', e.target.checked)}
              className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <span className="text-xs text-gray-600">Ship To</span>
          </label>
        </div>
      </SectionHeader>
      
      {isExpanded && (
        <div className="pt-4 space-y-4 border-t">
          {/* Bill To Section */}
          {data.includeBillTo && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-4 bg-blue-500 rounded"></div>
                <h4 className="text-xs font-semibold text-gray-700">BILL TO</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={data.billToName}
                  onChange={(e) => onUpdate('billToName', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="Customer Name"
                />
                <input
                  type="tel"
                  value={data.billToPhone}
                  onChange={(e) => onUpdate('billToPhone', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="Phone"
                />
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={data.billToAddress}
                    onChange={(e) => onUpdate('billToAddress', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="Address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Ship To Section */}
          {data.includeShipTo && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-4 bg-green-500 rounded"></div>
                <h4 className="text-xs font-semibold text-gray-700">SHIP TO</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={data.shipToName}
                  onChange={(e) => onUpdate('shipToName', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="Recipient Name"
                />
                <input
                  type="tel"
                  value={data.shipToPhone}
                  onChange={(e) => onUpdate('shipToPhone', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="Phone"
                />
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={data.shipToAddress}
                    onChange={(e) => onUpdate('shipToAddress', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="Delivery Address"
                  />
                </div>
              </div>
            </div>
          )}

          {!data.includeBillTo && !data.includeShipTo && (
            <div className="text-center py-4 text-gray-500 text-sm">
              Enable "Bill To" or "Ship To" to add customer information
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerInfoSection;