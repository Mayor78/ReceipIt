import React, { useState, useEffect, useRef } from 'react';
import { 
  Trash2, Minus, Plus, Edit2, CheckCircle, AlertCircle, 
  Save, X, Package, Smartphone, Book, Wheat, Scissors, 
  Droplets, Truck, Home, Shirt, Coffee, Activity 
} from 'lucide-react';
import toast from 'react-hot-toast';

const PRODUCT_CATEGORIES = [
  { id: 'electronics', name: '📱 Electronics', icon: Smartphone, fields: ['imei', 'serial', 'model', 'warranty'] },
  { id: 'books', name: '📚 Books & Media', icon: Book, fields: ['isbn', 'author', 'publisher', 'edition'] },
  { id: 'agriculture', name: '🌾 Agriculture', icon: Wheat, fields: ['weight', 'grade', 'moisture', 'origin'] },
  { id: 'clothing', name: '👕 Clothing', icon: Shirt, fields: ['size', 'color', 'material', 'brand'] },
  { id: 'food', name: '🍞 Food Items', icon: Coffee, fields: ['weight', 'expiry', 'batch', 'ingredients'] },
  { id: 'services', name: '✂️ Services', icon: Scissors, fields: ['duration', 'service_type', 'professional', 'notes'] },
  { id: 'liquids', name: '💧 Liquids', icon: Droplets, fields: ['volume', 'container', 'density', 'ph'] },
  { id: 'construction', name: '🏗️ Construction', icon: Home, fields: ['dimensions', 'material', 'grade', 'coating'] },
  { id: 'logistics', name: '🚚 Logistics', icon: Truck, fields: ['weight', 'distance', 'vehicle', 'insurance'] },
  { id: 'general', name: '📦 General Goods', icon: Package, fields: ['description'] }
];

const UNIT_OPTIONS = {
  general: ['pcs', 'box', 'pack', 'set', 'dozen'],
  electronics: ['pcs', 'set', 'unit', 'pair'],
  books: ['pcs', 'set', 'volume', 'series'],
  agriculture: ['kg', 'bag', 'ton', 'bundle', 'crate'],
  clothing: ['pcs', 'pair', 'set', 'dozen'],
  food: ['kg', 'g', 'litre', 'ml', 'pack', 'bottle'],
  services: ['hour', 'session', 'project', 'visit'],
  liquids: ['litre', 'ml', 'gallon', 'barrel', 'bottle'],
  construction: ['pcs', 'kg', 'bag', 'ton', 'sheet'],
  logistics: ['kg', 'km', 'trip', 'container']
};

const ReceiptItem = ({ 
  item, 
  updateItem, 
  removeItem, 
  isFirstItem = false, 
  forceSave = false,
  onSaveComplete,
  keepFormOpen = false  // NEW PROP
}) => {
  const [localItem, setLocalItem] = useState({ 
    ...item,
    category: item.category || 'general',
    customFields: item.customFields || {}
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  
  const nameInputRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    if ((!item.name || item.name === "") && item.price === 0 && isFirstItem) {
      startEditing();
    }
  }, [isFirstItem]);

  useEffect(() => {
    setLocalItem({ 
      ...item,
      category: item.category || 'general',
      customFields: item.customFields || {}
    });
    setHasUnsavedChanges(false);
  }, [item]);

  const currentCategory = PRODUCT_CATEGORIES.find(cat => cat.id === localItem.category) || PRODUCT_CATEGORIES[0];
  const IconComponent = currentCategory.icon || Package;

  const getUnitOptions = () => {
    return UNIT_OPTIONS[localItem.category] || UNIT_OPTIONS.general;
  };

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG').format(amount);
  };

  const isItemValid = (itemData) => {
    return itemData.name.trim() !== "" && parseFloat(itemData.price) > 0;
  };

  const startEditing = () => {
    setIsEditing(true);
    setHasUnsavedChanges(false);
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const saveItem = () => {
    if (!isItemValid(localItem)) {
      toast.error('Enter a name and price > 0');
      return false;
    }

    const updatedItem = {
      name: localItem.name.trim(),
      price: parseFloat(localItem.price),
      quantity: parseInt(localItem.quantity),
      unit: localItem.unit || 'pcs',
      category: localItem.category,
      customFields: localItem.customFields
    };

    Object.keys(updatedItem).forEach(field => {
      updateItem(item.id, field, updatedItem[field]);
    });
    
    // If keepFormOpen is true, clear the form but stay in edit mode
    if (keepFormOpen) {
      setLocalItem({
        name: '',
        price: '',
        quantity: 1,
        unit: 'pcs',
        category: 'general',
        customFields: {}
      });
      setHasUnsavedChanges(false);
      setTimeout(() => nameInputRef.current?.focus(), 100);
    } else {
      setIsEditing(false);
      setHasUnsavedChanges(false);
    }
    
    toast.success('Saved');
    if (onSaveComplete) onSaveComplete();
    return true;
  };

  const handleChange = (field, value) => {
    setLocalItem(prev => ({ 
      ...prev, 
      [field]: value,
      ...(field === 'category' ? { unit: getUnitOptions()[0] } : {})
    }));
    setHasUnsavedChanges(true);
  };

  const handleCustomFieldChange = (field, value) => {
    setLocalItem(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleQuantityChange = (change) => {
    const newQty = Math.max(1, (localItem.quantity || 1) + change);
    handleChange('quantity', newQty);
  };

  const selectCategory = (categoryId) => {
    handleChange('category', categoryId);
    setShowCategoryMenu(false);
  };

  const isValid = isItemValid(item);
  const total = item.price * item.quantity;

  const renderCustomFields = () => {
    const fields = currentCategory.fields;
    
    if (!fields || fields.length === 0) return null;

    return (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-700 mb-3 flex items-center">
          <Activity size={12} className="mr-1" />
          {currentCategory.name} Details
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map(field => {
            const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
            const fieldValue = localItem.customFields?.[field] || '';
            
            const isIMEI = field === 'imei';
            const isWeight = field === 'weight' || field === 'volume';
            const isExpiry = field === 'expiry';
            
            return (
              <div key={field}>
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  {fieldLabel}
                  {isIMEI && ' (15 digits)'}
                  {isWeight && ` (${localItem.unit === 'kg' ? 'kg' : 'g'})`}
                </label>
                
                {isExpiry ? (
                  <input
                    type="date"
                    value={fieldValue}
                    onChange={(e) => handleCustomFieldChange(field, e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                ) : (
                  <input
                    type="text"
                    value={fieldValue}
                    onChange={(e) => handleCustomFieldChange(field, e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder={getPlaceholder(field)}
                    maxLength={isIMEI ? 15 : undefined}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getPlaceholder = (field) => {
    const placeholders = {
      imei: 'Enter 15-digit IMEI',
      serial: 'Serial number',
      model: 'Model number',
      warranty: 'Warranty period',
      isbn: 'ISBN number',
      author: 'Author name',
      publisher: 'Publisher',
      weight: 'Weight in kg',
      grade: 'Quality grade',
      size: 'Size (S, M, L)',
      color: 'Color',
      material: 'Material type',
      volume: 'Volume',
      expiry: 'Expiry date',
      batch: 'Batch number',
      duration: 'Service duration',
      service_type: 'Type of service',
      dimensions: 'Dimensions (L×W×H)',
      distance: 'Distance in km'
    };
    return placeholders[field] || `Enter ${field}`;
  };

  return (
    <div className={`group relative p-4 rounded-xl border transition-all duration-200 shadow-sm ${
      isEditing 
        ? 'border-blue-400 bg-white ring-2 ring-blue-50' 
        : isValid 
          ? 'border-gray-200 bg-white' 
          : 'border-amber-300 bg-amber-50 animate-pulse-slow'
    }`}>
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isValid ? (
            <CheckCircle size={16} className="text-green-500" />
          ) : (
            <AlertCircle size={16} className="text-amber-500" />
          )}
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isValid ? 'text-green-600' : 'text-amber-600'}`}>
            {isValid ? 'Ready' : 'Incomplete'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              Editing...
            </div>
          ) : (
            <>
              <button onClick={startEditing} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Edit2 size={16} />
              </button>
              <button onClick={() => removeItem(item.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        /* EDIT MODE */
        <div className="space-y-4">
          {/* CATEGORY SELECTOR */}
          <div className="relative" ref={categoryRef}>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Product Category</label>
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="w-full mt-1 flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <IconComponent size={16} className="mr-2" />
                <span className="text-sm font-medium">{currentCategory.name}</span>
              </div>
              <span className="text-gray-400 text-xs">▼</span>
            </button>
            
            {showCategoryMenu && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {PRODUCT_CATEGORIES.map(category => {
                  const CatIcon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => selectCategory(category.id)}
                      className={`w-full flex items-center px-3 py-2.5 hover:bg-gray-50 ${
                        localItem.category === category.id ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      <CatIcon size={16} className="mr-2" />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Item Name</label>
              <input
                ref={nameInputRef}
                type="text"
                value={localItem.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder={`${currentCategory.name} name...`}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Price (₦)</label>
              <input
                type="number"
                value={localItem.price || ''}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* QUANTITY & UNIT */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Quantity</label>
              <div className="flex items-center mt-1 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => handleQuantityChange(-1)} 
                  className="p-2.5 hover:bg-gray-200"
                >
                  <Minus size={14}/>
                </button>
                <span className="flex-1 text-center text-sm font-bold">{localItem.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)} 
                  className="p-2.5 hover:bg-gray-200"
                >
                  <Plus size={14}/>
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Unit</label>
              <select
                value={localItem.unit || getUnitOptions()[0]}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm"
              >
                {getUnitOptions().map(unit => (
                  <option key={unit} value={unit}>
                    {unit.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CATEGORY-SPECIFIC FIELDS */}
          {renderCustomFields()}

          {/* SAVE BUTTONS AT BOTTOM */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={saveItem}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-sm transition-colors"
            >
              <Save size={18} />
              <span>Save Item</span>
            </button>
            
            {!keepFormOpen && (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        /* VIEW MODE */
        <div 
          className="flex items-center justify-between group-hover:opacity-90 transition-opacity cursor-pointer" 
          onClick={startEditing}
        >
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center mb-1">
              <IconComponent size={14} className="mr-2 text-gray-400" />
              <h4 className="text-sm font-bold text-gray-900 truncate">
                {item.name || <span className="text-amber-400 italic font-normal">Tap to set name...</span>}
              </h4>
            </div>
            <div className="flex items-center text-xs text-gray-500 space-x-3">
              <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px]">
                {currentCategory.name.split(' ')[0]}
              </span>
              <span>
                {item.quantity} {item.unit} × ₦{formatNaira(item.price)}
              </span>
            </div>
            
            {item.customFields && Object.keys(item.customFields).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {Object.entries(item.customFields).slice(0, 2).map(([key, value]) => (
                  value && (
                    <span key={key} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {key}: {value}
                    </span>
                  )
                ))}
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-sm font-black text-blue-700">
              ₦{formatNaira(total)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptItem;