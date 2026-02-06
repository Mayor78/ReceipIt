import React from 'react';
import ReceiptItem from './ReceiptItem';
import { useReceipt } from '../context/ReceiptContext';

const ReceiptList = () => {
  const { receiptData, updateItem, removeItem } = useReceipt();

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header for the box */}
      <div className="flex justify-between items-center mb-3 px-4">
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
          Items List ({receiptData.items.length})
        </h3>
      </div>

      {/* The iPhone Scroll Box */}
      <div className="ios-scroll-box bg-gray-100/30 rounded-[32px] border border-gray-200/50">
        {receiptData.items.map((item, index) => (
          <div key={item.id} className="receipt-card-wrapper">
            <ReceiptItem 
              item={item}
              isFirstItem={index === 0}
              updateItem={updateItem}
              removeItem={removeItem}
            />
          </div>
        ))}
        
        {/* Padding at the bottom so the last item can be scrolled up fully */}
        <div className="h-40 flex-shrink-0" />
      </div>
    </div>
  );
};

export default ReceiptList;