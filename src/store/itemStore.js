import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Simple ID generator function
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper to create a new empty item
const createEmptyItem = (category = 'general') => {
  const newItem = {
    id: generateId(),
    name: '',
    price: 0,
    quantity: 1,
    unit: 'pcs',
    category: category,
    customFields: {},
    isForm: true,
    createdAt: Date.now()
  };
  console.log('🆕 Created new form item:', newItem.id);
  return newItem;
};

const useItemStore = create(
  persist(
    (set, get) => {
      console.log('🏪 ItemStore initializing...');
      
      return {
        // All items (both saved and the active form)
        items: [],
        
        // Initialize with one empty form
        initialize: () => {
          console.log('🔄 Initializing store...');
          const { items } = get();
          console.log('Current items:', items);
          
          if (items.length === 0) {
            const newFormItem = createEmptyItem();
            console.log('📝 Creating initial form item:', newFormItem);
            set({ items: [newFormItem] });
          } else {
            console.log('✅ Items already exist:', items.length);
          }
        },
        
        // Save the current form item and create a new form
        saveFormItem: (formItemId) => {
          console.log('💾 Saving form item:', formItemId);
          const { items } = get();
          const formIndex = items.findIndex(item => item.id === formItemId);
          
          if (formIndex === -1) {
            console.log('❌ Form item not found');
            return false;
          }
          
          const formItem = items[formIndex];
          console.log('Form item data:', formItem);
          
          // Validate
          if (!formItem.name?.trim() || formItem.price <= 0) {
            console.log('❌ Invalid item - name or price missing');
            return false;
          }
          
          // Create saved version (remove isForm flag)
          const savedItem = {
            ...formItem,
            id: generateId(), // New ID for saved item
            isForm: false,
            savedAt: Date.now()
          };
          
          // Create new form item
          const newFormItem = createEmptyItem(formItem.category);
          
          console.log('✅ Saved item:', savedItem);
          console.log('🆕 New form item:', newFormItem);
          
          // Replace the form item with saved item + new form
          const newItems = [...items];
          newItems.splice(formIndex, 1, savedItem, newFormItem);
          
          set({ items: newItems });
          return true;
        },
        
        // Update any item field
        updateItem: (itemId, field, value) => {
          // console.log(`📝 Updating ${field} for ${itemId}:`, value);
          set(state => ({
            items: state.items.map(item =>
              item.id === itemId 
                ? { ...item, [field]: value }
                : item
            )
          }));
        },
        
        // Update custom field
        updateCustomField: (itemId, field, value) => {
          set(state => ({
            items: state.items.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    customFields: {
                      ...item.customFields,
                      [field]: value
                    }
                  }
                : item
            )
          }));
        },
        
        // Remove an item
        removeItem: (itemId) => {
          console.log('🗑️ Removing item:', itemId);
          set(state => {
            const newItems = state.items.filter(item => item.id !== itemId);
            
            // If we removed the form item and there are no items left, add a new form
            if (newItems.length === 0 || !newItems.some(item => item.isForm)) {
              console.log('📝 Adding new form item after removal');
              newItems.push(createEmptyItem());
            }
            
            return { items: newItems };
          });
        },
        
        // Clear all saved items but keep one form
        clearAllItems: () => {
          console.log('🧹 Clearing all items');
          set({ items: [createEmptyItem()] });
        },
        
        // Get the active form item
        getFormItem: () => {
          const formItem = get().items.find(item => item.isForm);
          console.log('🔍 Getting form item:', formItem?.id || 'none');
          return formItem;
        },
        
        // Get all saved items (non-form items)
        getSavedItems: () => {
          const savedItems = get().items.filter(item => !item.isForm);
          console.log('📋 Saved items count:', savedItems.length);
          return savedItems;
        },
        
        // Get all items count
        getTotalCount: () => {
          return get().items.length;
        },
        
        // Calculate total value of saved items
        calculateTotal: () => {
          return get()
            .items
            .filter(item => !item.isForm)
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },
        
        // Load items from receipt data (for draft restore)
        loadFromReceiptData: (items) => {
          console.log('📦 Loading from receipt data:', items);
          
          if (!items || items.length === 0) {
            set({ items: [createEmptyItem()] });
            return;
          }
          
          // Mark the last incomplete item as form if exists
          const processedItems = items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isIncomplete = !item.name?.trim() || item.price <= 0;
            
            return {
              ...item,
              id: item.id || generateId(),
              isForm: isLast && isIncomplete
            };
          });
          
          // If no form item exists, add one
          if (!processedItems.some(item => item.isForm)) {
            console.log('➕ Adding new form item to loaded data');
            processedItems.push(createEmptyItem());
          }
          
          console.log('✅ Processed items:', processedItems.length);
          set({ items: processedItems });
        },
        
        // Export items for saving to receipt
        exportItems: () => {
          const exported = get()
            .items
            .filter(item => !item.isForm)
            .map(({ isForm, createdAt, savedAt, ...item }) => item);
          
          console.log('📤 Exporting items:', exported.length);
          return exported;
        }
      };
    },
    {
      name: 'item-store',
      partialize: (state) => ({
        items: state.items.map(item => ({
          id: item.isForm ? 'form-placeholder' : item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          customFields: item.customFields,
          // Don't persist the isForm flag
        }))
      })
    }
  )
);

export default useItemStore;