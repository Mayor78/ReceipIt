import React, { useState, useEffect, useRef } from 'react';
import { 
  Trash2, Minus, Plus, Edit2, CheckCircle, AlertCircle, 
  Save, X, Package, Smartphone, Book, Wheat, Scissors, 
  Droplets, Truck, Home, Shirt, Coffee, Activity, ChevronDown
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
  keepFormOpen = false
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

  const renderCustomFields = () => {
    const fields = currentCategory.fields;
    if (!fields || fields.length === 0) return null;

    return (
      <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Activity size={12} className="text-blue-400" />
          {currentCategory.name.split(' ')[1]} Specifications
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(field => {
            const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
            const fieldValue = localItem.customFields?.[field] || '';
            const isIMEI = field === 'imei';
            const isWeight = field === 'weight' || field === 'volume';
            const isExpiry = field === 'expiry';
            
            return (
              <div key={field} className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-tighter ml-1">
                  {fieldLabel} {isIMEI && '(15 DIGITS)'}
                </label>
                {isExpiry ? (
                  <input
                    type="date"
                    value={fieldValue}
                    onChange={(e) => handleCustomFieldChange(field, e.target.value)}
                    className="w-full bg-white/[0.03] border-white/10 px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                  />
                ) : (
                  <input
                    type="text"
                    value={fieldValue}
                    onChange={(e) => handleCustomFieldChange(field, e.target.value)}
                    className="w-full bg-white/[0.03] border-white/10 px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
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

  return (
    <div className={`group relative p-5 rounded-[2rem] border transition-all duration-300 ${
      isEditing 
        ? 'border-blue-500/50 bg-[#161b22] shadow-[0_20px_40px_rgba(0,0,0,0.4)] scale-[1.01] z-10' 
        : isValid 
          ? 'border-white/5 bg-[#11141b] hover:bg-[#161b22] hover:border-white/10 shadow-lg' 
          : 'border-amber-500/30 bg-amber-500/[0.02] animate-pulse'
    }`}>
      
      {/* STATUS HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isValid ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isValid ? 'text-emerald-500/80' : 'text-amber-500/80'}`}>
            {isValid ? 'Ready for Receipt' : 'Awaiting Entry'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {isEditing ? (
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
              Live Editing
            </span>
          ) : (
            <div className="flex gap-1">
              <button onClick={startEditing} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Edit2 size={16} />
              </button>
              <button onClick={() => removeItem(item.id)} className="p-2 text-red-600 hover:text-rose-400 hover:bg-rose-400/5 rounded-xl transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        /* EDIT MODE UI */
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {/* CATEGORY SELECTOR */}
          <div className="relative" ref={categoryRef}>
            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1 mb-2 block">Classification</label>
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-white/20 transition-all text-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <IconComponent size={18} />
                </div>
                <span className="text-sm font-bold tracking-tight">{currentCategory.name}</span>
              </div>
              <ChevronDown size={16} className={`text-slate-500 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showCategoryMenu && (
              <div className="absolute z-[100] w-full mt-2 bg-[#1c2128] border border-white/10 rounded-[1.5rem] shadow-2xl max-h-[300px] overflow-y-auto p-2 scrollbar-hide animate-in slide-in-from-top-2">
                {PRODUCT_CATEGORIES.map(category => {
                  const CatIcon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => selectCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        localItem.category === category.id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <CatIcon size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Item Label</label>
              <input
                ref={nameInputRef}
                type="text"
                value={localItem.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-white/[0.03] border-white/10 px-4 py-3.5 rounded-2xl text-sm text-white outline-none focus:border-blue-500 transition-all"
                placeholder="Ex: iPhone 15 Pro..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Unit Price (₦)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs">₦</span>
                <input
                  type="number"
                  value={localItem.price || ''}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="w-full bg-white/[0.03] border-white/10 pl-8 pr-4 py-3.5 rounded-2xl text-sm text-white font-black outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Quantity</label>
              <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden h-[52px]">
                <button onClick={() => handleQuantityChange(-1)} className="w-12 h-full flex items-center justify-center hover:bg-white/5 text-slate-400 transition-all"><Minus size={16}/></button>
                <span className="flex-1 text-center text-sm font-black text-white">{localItem.quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="w-12 h-full flex items-center justify-center hover:bg-white/5 text-slate-400 transition-all"><Plus size={16}/></button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Metric</label>
              <div className="relative">
                <select
                  value={localItem.unit || getUnitOptions()[0]}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 px-4 h-[52px] rounded-2xl outline-none text-sm font-bold text-white appearance-none cursor-pointer"
                >
                  {getUnitOptions().map(unit => (
                    <option key={unit} value={unit} className="bg-[#1c2128]">{unit.toUpperCase()}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {renderCustomFields()}

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button
              onClick={saveItem}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 text-black rounded-2xl hover:bg-emerald-400 font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-all"
            >
              <Save size={18} /> Commit Changes
            </button>
            
            {!keepFormOpen && (
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-4 bg-white/5 text-slate-400 rounded-2xl hover:bg-white/10 font-bold uppercase text-[10px] tracking-widest border border-white/5 transition-all"
              >
                Discard
              </button>
            )}
          </div>
        </div>
      ) : (
        /* VIEW MODE UI */
        <div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer" 
          onClick={startEditing}
        >
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                <IconComponent size={20} />
              </div>
              <div className="flex flex-col">
                <h4 className={`text-base font-bold truncate tracking-tight ${item.name ? 'text-white' : 'text-amber-500/50 italic'}`}>
                  {item.name || 'Untitled Inventory Item'}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    {currentCategory.name.split(' ')[1]}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-slate-800" />
                  <span className="text-[10px] font-bold text-slate-500">
                    {item.quantity} {item.unit} @ ₦{formatNaira(item.price)}
                  </span>
                </div>
              </div>
            </div>
            
            {item.customFields && Object.keys(item.customFields).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {Object.entries(item.customFields).slice(0, 3).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex items-center gap-1.5 bg-blue-500/5 border border-blue-500/10 px-2 py-1 rounded-lg">
                      <span className="text-[8px] font-black text-blue-500/60 uppercase">{key}</span>
                      <span className="text-[10px] font-bold text-blue-400">{value}</span>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end justify-center px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Total Value</span>
            <div className="text-xl font-black text-emerald-400 tracking-tighter shadow-emerald-500/20 drop-shadow-md">
              ₦{formatNaira(total)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptItem;