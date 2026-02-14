// src/components/FeedbackButton.jsx
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

const FeedbackButton = ({ user, storeData, receiptCount }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-0 right-6 z-40 flex items-center space-x-2 bg-gradient-to-r from-green-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
        aria-label="Give feedback"
      >
        <MessageSquare size={22} className="group-hover:rotate-12 transition-transform" />
       
      </button>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        storeData={storeData}
        receiptCount={receiptCount}
      />
    </>
  );
};

export default FeedbackButton;