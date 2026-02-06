import React from 'react';
import { Percent, TruckIcon } from 'lucide-react';
import SectionHeader from './SectionHeader';

const TaxDiscountSection = ({ 
  isExpanded, 
  onToggle, 
  data, 
  onUpdate 
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <SectionHeader 
        title="Tax & Charges" 
        icon={Percent} 
        sectionKey="taxDiscount"
        isExpanded={isExpanded}
        onClick={onToggle}
        badge={{ text: 'Optional', className: 'bg-gray-100 text-gray-700' }}
      />
      
      {isExpanded && (
        <div className="pt-4 space-y-4 border-t">
          {/* VAT Section */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.includeVAT}
                onChange={(e) => onUpdate('includeVAT', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">VAT</span>
            </label>
            {data.includeVAT && (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={data.vatRate}
                  onChange={(e) => onUpdate('vatRate', parseFloat(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                  step="0.1"
                  min="0"
                  placeholder="7.5"
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
            )}
          </div>

          {/* Discount Section */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.includeDiscount}
                onChange={(e) => onUpdate('includeDiscount', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Discount</span>
            </label>
            {data.includeDiscount && (
              <div className="flex items-center space-x-2">
                <select
                  value={data.discountType}
                  onChange={(e) => onUpdate('discountType', e.target.value)}
                  className="w-24 px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">₦</option>
                </select>
                <input
                  type="number"
                  value={data.discount}
                  onChange={(e) => onUpdate('discount', parseFloat(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                  step={data.discountType === 'percentage' ? '0.1' : '100'}
                  min="0"
                  placeholder="0"
                />
              </div>
            )}
          </div>

          {/* Additional Charges */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <TruckIcon size={16} />
              <span>Additional Charges</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Delivery Fee (₦)</label>
                <input
                  type="number"
                  value={data.deliveryFee}
                  onChange={(e) => onUpdate('deliveryFee', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  step="100"
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Service Charge (₦)</label>
                <input
                  type="number"
                  value={data.serviceCharge}
                  onChange={(e) => onUpdate('serviceCharge', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  step="100"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxDiscountSection;