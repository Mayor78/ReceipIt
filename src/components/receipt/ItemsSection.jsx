import React from 'react';
import { Plus, CheckCircle, AlertCircle, Package, Layers, Sparkles } from 'lucide-react';
import SectionHeader from './SectionHeader';
import ReceiptItem from '../ReceiptItem';

const ItemsSection = ({ 
  isExpanded, 
  onToggle, 
  items, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem
}) => {
  const completeItems = items.filter(item => 
    item.name.trim() !== "" && item.name !== "New Item" && item.price > 0
  );
  
  const incompleteItems = items.filter(item => 
    !item.name.trim() || item.name === "New Item" || item.price === 0
  );

  const totalValue = completeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddItem = () => { onAddItem(); };
  const handleItemSaved = (itemId) => { /* Logic Preserved */ };

  return (
    <div className="bg-[#11141b]   border border-white/5 overflow-hidden transition-all duration-300 shadow-xl">
      <SectionHeader 
        title="Items" 
        details="Products & Services"
        icon={Package} 
        sectionKey="items"
        isExpanded={isExpanded}
        onClick={onToggle} 
        badge={{ 
          text: `${completeItems.length} item${completeItems.length !== 1 ? 's' : ''}`, 
          className: incompleteItems.length === 0 && items.length > 0 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }}
      >
        {incompleteItems.length === 0 && (
          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 transition-all text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Plus size={14} strokeWidth={3} />
            <span className="hidden sm:inline">Add Item</span>
          </button>
        )}
      </SectionHeader>
      
      {isExpanded && (
        <div className="  space-y-6 border-t border-white/5 animate-in fade-in duration-500">
          
          {/* Neon Stats Bar */}
          {items.length > 0 && (
            <div className="p-2 my-2 bg-white/[0.02]  border border-white/5 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{completeItems.length} Saved</span>
                </div>
                {incompleteItems.length > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-amber-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{incompleteItems.length} Drafting</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Running Total</span>
                <div className="text-lg font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                  ₦{totalValue.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-12 px-6 rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
              <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                <Layers className="text-slate-700" size={32} />
              </div>
              <p className="text-sm font-black text-slate-300 uppercase tracking-widest">Cart is Empty</p>
              <p className="text-xs text-slate-500 mt-2 mb-6">Add products or services to this document</p>
              <button
                onClick={handleAddItem}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl hover:bg-slate-200 font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-lg"
              >
                <Plus size={16} strokeWidth={3} />
                <span>Add First Item</span>
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Drafting Area */}
              {incompleteItems.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                    <h3 className="text-[10px] font-black text-amber-500/80 uppercase tracking-[0.3em]">
                      Drafting Area
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                  </div>
                  
                  <div className="space-y-4">
                    {incompleteItems.map((item, index) => (
                      <div key={item.id} className="animate-in slide-in-from-top-4 duration-300">
                        <ReceiptItem
                          item={item}
                          updateItem={onUpdateItem}
                          removeItem={onRemoveItem}
                          isFirstItem={index === 0}
                          keepFormOpen={true} 
                          onSaveComplete={() => handleItemSaved(item.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Items List */}
              {completeItems.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                    <h3 className="text-[10px] font-black text-emerald-500/80 uppercase tracking-[0.3em]">
                      Inventory List ({completeItems.length})
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                  </div>
                  
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {completeItems.map((item) => (
                      <div key={item.id} className="group">
                        <ReceiptItem
                          item={item}
                          updateItem={onUpdateItem}
                          removeItem={onRemoveItem}
                          isFirstItem={false}
                          keepFormOpen={false}  
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Another Button */}
              {incompleteItems.length === 0 && (
                <button
                  onClick={handleAddItem}
                  className="w-full flex items-center justify-center gap-3 px-4 py-5 border-2 border-dashed border-white rounded-2xl text-white-500 hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all group"
                >
                  <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Add Another Item</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemsSection;