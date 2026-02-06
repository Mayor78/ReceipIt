import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Minus, Plus, Edit2, CheckCircle, AlertCircle, Clock, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

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
  
  const nameInputRef = useRef(null);
  const priceInputRef = useRef(null);
  const saveTimerIntervalRef = useRef(null);

  useEffect(() => {
    if ((!item.name || item.name === "") && item.price === 0 && isFirstItem) {
      startEditing();
    }
  }, [isFirstItem]);

  useEffect(() => {
    setLocalItem({ ...item });
    setHasUnsavedChanges(false);
    clearTimers();
  }, [item]);

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

  const clearTimers = () => {
    if (saveTimerIntervalRef.current) clearInterval(saveTimerIntervalRef.current);
    setSaveTimer(0);
  };

  const saveItem = () => {
    if (!isItemValid(localItem)) {
      toast.error('Enter a name and price > 0');
      return false;
    }

    updateItem(item.id, 'name', localItem.name.trim());
    updateItem(item.id, 'price', parseFloat(localItem.price));
    updateItem(item.id, 'quantity', parseInt(localItem.quantity));
    updateItem(item.id, 'unit', localItem.unit);
    
    setIsEditing(false);
    setHasUnsavedChanges(false);
    toast.success('Saved');
    if (onSaveComplete) onSaveComplete();
    return true;
  };

  const handleChange = (field, value) => {
    setLocalItem(prev => ({ ...prev, [field]: value }));
    updateItem(item.id, field, value); // Real-time sync to prevent "Add Item" alerts
    setHasUnsavedChanges(true);
  };

  const handleQuantityChange = (change) => {
    const newQty = Math.max(1, (localItem.quantity || 1) + change);
    handleChange('quantity', newQty);
  };

  const isValid = isItemValid(item);
  const total = item.price * item.quantity;

  return (
    <div className={`group relative p-4 rounded-xl border transition-all duration-200 shadow-sm ${
      isEditing 
        ? 'border-blue-400 bg-white ring-2 ring-blue-50' 
        : isValid 
          ? 'border-gray-200 bg-white' 
          : 'border-amber-300 bg-amber-50 animate-pulse-slow'
    }`}>
      
      {/* HEADER: Status and Top Actions */}
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
            <button onClick={saveItem} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Save size={16} />
            </button>
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
        /* EDIT MODE: Responsive Grid */
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Item Name</label>
            <input
              ref={nameInputRef}
              type="text"
              value={localItem.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="What are you selling?"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Price (₦)</label>
              <input
                type="number"
                value={localItem.price || ''}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Qty</label>
              <div className="flex items-center mt-1 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => handleQuantityChange(-1)} className="p-2.5 hover:bg-gray-200"><Minus size={14}/></button>
                <span className="flex-1 text-center text-sm font-bold">{localItem.quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="p-2.5 hover:bg-gray-200"><Plus size={14}/></button>
              </div>
            </div>

            <div className="col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Unit</label>
              <select
                value={localItem.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="w-full mt-1 px-2 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm"
              >
                <option value="pcs">Pcs</option>
                <option value="kg">Kg</option>
                <option value="pack">Pack</option>
                <option value="carton">Ctn</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW MODE: Minimal & Clean */
        <div className="flex items-center justify-between group-hover:opacity-90 transition-opacity" onClick={startEditing}>
          <div className="flex-1 min-w-0 pr-4">
            <h4 className="text-sm font-bold text-gray-900 truncate">
              {item.name || <span className="text-amber-400 italic font-normal">Tap to set name...</span>}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {item.quantity} {item.unit} × ₦{formatNaira(item.price)}
            </p>
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