import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Minus, Plus, Edit2, CheckCircle, AlertCircle, Clock, Save } from 'lucide-react';

const ReceiptItem = ({ 
  item, 
  updateItem, 
  removeItem, 
  isFirstItem = false, 
  forceSave = false,
  onSaveComplete 
}) => {
  const [localItem, setLocalItem] = useState({ ...item });
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveTimer, setSaveTimer] = useState(0);
  const [showSaveHint, setShowSaveHint] = useState(false);
  
  const nameInputRef = useRef(null);
  const priceInputRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const saveHintTimerRef = useRef(null);
  const saveTimerIntervalRef = useRef(null);

  // Auto-start editing for new empty items
  useEffect(() => {
    if ((!item.name || item.name === "New Item") && item.price === 0 && isFirstItem) {
      startEditing();
    }
  }, [item.name, item.price, isFirstItem]);

  // Reset local item when prop changes
  useEffect(() => {
    setLocalItem({ ...item });
    setHasUnsavedChanges(false);
    setSaveTimer(0);
    clearTimers();
  }, [item]);

  // Force save from parent (when clicking "Add Another Item")
  useEffect(() => {
    if (forceSave && hasUnsavedChanges && isItemValid(localItem)) {
      saveItem();
    }
  }, [forceSave, hasUnsavedChanges, localItem]);

  // Start inactivity timer when user starts editing
  useEffect(() => {
    if (isEditing && hasUnsavedChanges) {
      startInactivityTimer();
    } else {
      clearTimers();
    }

    return () => {
      clearTimers();
    };
  }, [isEditing, hasUnsavedChanges]);

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0
    }).format(amount);
  };

  const isItemValid = (itemData) => {
    return itemData.name.trim() !== "" && itemData.price > 0;
  };

  const startEditing = () => {
    setIsEditing(true);
    setHasUnsavedChanges(false);
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  };

  const startInactivityTimer = () => {
    clearTimers();
    
    // Start 60-second countdown
    setSaveTimer(60);
    
    saveTimerIntervalRef.current = setInterval(() => {
      setSaveTimer(prev => {
        if (prev <= 1) {
          // Time's up - auto-save if valid
          if (isItemValid(localItem)) {
            saveItem();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Show save hint after 45 seconds
    saveHintTimerRef.current = setTimeout(() => {
      setShowSaveHint(true);
    }, 45000);
  };

  const clearTimers = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (saveHintTimerRef.current) {
      clearTimeout(saveHintTimerRef.current);
    }
    if (saveTimerIntervalRef.current) {
      clearInterval(saveTimerIntervalRef.current);
    }
    setShowSaveHint(false);
  };

  const saveItem = () => {
    if (!isItemValid(localItem)) {
      alert('Please enter item name and price before saving');
      return false;
    }

    updateItem(item.id, 'name', localItem.name.trim());
    updateItem(item.id, 'price', parseFloat(localItem.price) || 0);
    updateItem(item.id, 'quantity', parseInt(localItem.quantity) || 1);
    updateItem(item.id, 'unit', localItem.unit || 'pcs');
    
    setHasUnsavedChanges(false);
    setIsEditing(false);
    clearTimers();
    
    if (onSaveComplete) {
      onSaveComplete();
    }
    
    return true;
  };

  const handleChange = (field, value) => {
    setLocalItem(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (!hasUnsavedChanges) {
      setHasUnsavedChanges(true);
    }
    
    // Reset and restart timer on any change
    if (isEditing) {
      setSaveTimer(60);
      setShowSaveHint(false);
      clearTimers();
      startInactivityTimer();
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, (localItem.quantity || 1) + change);
    handleChange('quantity', newQuantity);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      removeItem(item.id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isEditing) {
      e.preventDefault();
      saveItem();
    }
    if (e.key === 'Escape') {
      if (hasUnsavedChanges) {
        if (window.confirm('Discard changes?')) {
          setIsEditing(false);
          setLocalItem({ ...item });
          setHasUnsavedChanges(false);
          clearTimers();
        }
      } else {
        setIsEditing(false);
        clearTimers();
      }
    }
  };

  const unitOptions = [
    { value: 'pcs', label: 'Pieces' },
    { value: 'kg', label: 'Kg' },
    { value: 'l', label: 'Litre' },
    { value: 'g', label: 'Gram' },
    { value: 'ml', label: 'ML' },
    { value: 'set', label: 'Set' },
    { value: 'box', label: 'Box' },
    { value: 'bag', label: 'Bag' },
    { value: 'pack', label: 'Pack' },
    { value: 'carton', label: 'Carton' },
    { value: 'bottle', label: 'Bottle' },
    { value: 'can', label: 'Can' },
    { value: 'dozen', label: 'Dozen' },
    { value: 'pair', label: 'Pair' },
    { value: 'meter', label: 'Meter' },
  ];

  const isValid = isItemValid(item);
  const isLocalValid = isItemValid(localItem);
  const total = item.price * item.quantity;

  return (
    <div 
      className={`p-3 rounded-lg border transition-all ${
        isEditing 
          ? 'border-blue-300 bg-blue-50' 
          : isValid 
            ? 'border-green-200 bg-green-50' 
            : 'border-amber-200 bg-amber-50'
      }`}
      onKeyDown={handleKeyDown}
    >
      {/* Status Indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {isValid ? (
            <CheckCircle size={14} className="text-green-600" />
          ) : (
            <AlertCircle size={14} className="text-amber-600" />
          )}
          <span className="text-xs font-medium">
            {isValid ? 'Saved' : 'Draft'}
          </span>
          
          {/* Timer Display */}
          {isEditing && hasUnsavedChanges && saveTimer > 0 && (
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <Clock size={10} />
              <span>Auto-save in {saveTimer}s</span>
            </div>
          )}
          
          {showSaveHint && (
            <span className="text-xs text-amber-600 animate-pulse">
              • Item will auto-save soon
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isEditing && hasUnsavedChanges && isLocalValid && (
            <button
              onClick={saveItem}
              className="flex items-center space-x-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
            >
              <Save size={10} />
              <span>Save Now</span>
            </button>
          )}
          
          <button
            onClick={() => isEditing ? setIsEditing(false) : startEditing()}
            className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            {isEditing ? 'View' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Editing View */}
      {isEditing ? (
        <div className="space-y-3">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Item Name *
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={localItem.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Rice 50kg"
            />
            {!localItem.name.trim() && (
              <p className="text-xs text-red-500 mt-1">Item name required</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Price */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Price (₦) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                <input
                  ref={priceInputRef}
                  type="number"
                  value={localItem.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {localItem.price <= 0 && (
                <p className="text-xs text-red-500 mt-1">Price required</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 transition-colors"
                  disabled={(localItem.quantity || 1) <= 1}
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  value={localItem.quantity || 1}
                  onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 1)}
                  className="flex-1 w-2 text-center py-2 text-sm border-x border-gray-300 focus:outline-none focus:border-blue-500"
                  min="1"
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Unit */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                value={localItem.unit || 'pcs'}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {unitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timer Info */}
          <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center space-x-2">
              <Clock size={12} />
              <span>Item will auto-save after 60 seconds of inactivity</span>
            </div>
            <div className="mt-1 text-gray-600">
              <span className="font-medium">Current status:</span> {hasUnsavedChanges ? 'Editing' : 'Saved'} • 
              {isLocalValid ? ' Ready to save' : ' Needs name & price'}
            </div>
          </div>
        </div>
      ) : (
        /* Display View */
        <>
          {/* Mobile/Compact View */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {item.name || 'Unnamed Item'}
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                  <span>{item.quantity} × ₦{item.price === 0 ? '0.00' : formatNaira(item.price)}</span>
                  <span className="text-gray-400">•</span>
                  <span>{item.unit || 'pcs'}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 ml-2">
                <div className="text-right">
                  <div className="font-semibold text-green-700 text-sm">
                    ₦{formatNaira(total)}
                  </div>
                </div>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Delete item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Quick quantity adjust */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const newQty = Math.max(1, item.quantity - 1);
                    updateItem(item.id, 'quantity', newQty);
                  }}
                  disabled={item.quantity <= 1}
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
                >
                  <Minus size={12} />
                </button>
                <span className="text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateItem(item.id, 'quantity', item.quantity + 1)}
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  <Plus size={12} />
                </button>
                <span className="text-xs text-gray-500 ml-2">{item.unit || 'pcs'}</span>
              </div>
              <button
                onClick={startEditing}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Item Name */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">
                {item.name || 'Unnamed Item'}
              </div>
              <div className="text-xs text-gray-500">
                {item.unit || 'pcs'}
              </div>
            </div>

            {/* Price */}
            <div className="w-24">
              <div className="text-sm font-medium">
                ₦{formatNaira(item.price)}
              </div>
            </div>

            {/* Quantity with quick adjust */}
            <div className="w-32">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const newQty = Math.max(1, item.quantity - 1);
                    updateItem(item.id, 'quantity', newQty);
                  }}
                  disabled={item.quantity <= 1}
                  className="p-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
                >
                  <Minus size={12} />
                </button>
                <div className="text-center text-sm font-medium min-w-[40px]">
                  {item.quantity}
                </div>
                <button
                  onClick={() => updateItem(item.id, 'quantity', item.quantity + 1)}
                  className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="w-24 text-right">
              <div className="font-semibold text-green-700 text-sm">
                ₦{formatNaira(total)}
              </div>
            </div>

            {/* Actions */}
            <div className="w-16 flex items-center space-x-2">
              <button
                onClick={startEditing}
                className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                title="Edit item"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Delete item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReceiptItem;