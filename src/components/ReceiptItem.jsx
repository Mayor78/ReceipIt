import React, { useState } from 'react';
import { Trash2, Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const ReceiptItem = ({ item, updateItem, removeItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, item.quantity + change);
    updateItem(item.id, 'quantity', newQuantity);
  };

  return (
    <div className="p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      {/* Mobile/Compact View */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none font-medium text-gray-800 text-sm truncate"
              placeholder="Item name"
            />
            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
              <span>{item.quantity} × ₦{item.price}</span>
              <span className="text-gray-400">•</span>
              <span>{item.unit || 'pcs'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 ml-2">
            <div className="text-right">
              <div className="font-semibold text-green-700 text-sm">
                {formatNaira(item.price * item.quantity)}
              </div>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Expanded Controls */}
        {isExpanded ? (
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Price */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Price (₦)</label>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  className="w-full px-3  py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:text-gray-300"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    className="flex-1 w-2 text-center py-2 text-sm border-x border-gray-300 focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Unit Select */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Unit</label>
              <select
                value={item.unit || 'pcs'}
                onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="pcs">Pieces</option>
                <option value="kg">Kg</option>
                <option value="l">Litre</option>
                <option value="set">Set</option>
                <option value="box">Box</option>
              </select>
            </div>
          </div>
        ) : null}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center w-full mt-2 text-xs text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={14} className="mr-1" />
              Hide details
            </>
          ) : (
            <>
              <ChevronDown size={14} className="mr-1" />
              Edit item
            </>
          )}
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex md:items-center md:space-x-4">
        {/* Item Name */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={item.name}
            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none font-medium text-gray-800 text-sm"
            placeholder="Item name"
          />
        </div>

        {/* Unit */}
        <div className="w-24">
          <select
            value={item.unit || 'pcs'}
            onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="pcs">Pieces</option>
            <option value="kg">Kg</option>
            <option value="l">Litre</option>
            <option value="set">Set</option>
            <option value="box">Box</option>
          </select>
        </div>

        {/* Price */}
        <div className="w-32">
          <div className="flex items-center border border-gray-300 rounded px-2 py-1.5">
            <span className="text-gray-500 mr-1">₦</span>
            <input
              type="number"
              value={item.price}
              onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent border-none focus:outline-none text-right text-sm"
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        {/* Quantity */}
        <div className="w-28">
          <div className="flex items-cente border border-gray-300 rounded">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="px-2 py-1.5 text-gray-600 hover:bg-gray-100 disabled:text-gray-300"
              disabled={item.quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
              className="flex-1 text-center py-1.5 text-sm border-x border-gray-300 focus:outline-none"
              min="1"
            />
            <button
              onClick={() => handleQuantityChange(1)}
              className="px-2 py-1.5 text-gray-600 hover:bg-gray-100"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="w-24 text-right">
          <div className="font-semibold text-green-700 text-sm">
            {formatNaira(item.price * item.quantity)}
          </div>
        </div>

        {/* Delete */}
        <div className="w-8">
          <button
            onClick={() => removeItem(item.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptItem;