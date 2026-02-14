import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare, Send, Sparkles, ArrowRight, ChevronLeft, CheckCircle2, Heart } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Swal from 'sweetalert2';

const FeedbackModal = ({ isOpen, onClose, user, storeData, receiptCount }) => {
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [experience, setExperience] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setRating(0);
      setFeedback('');
      setExperience('');
      setSuggestions('');
    }
  }, [isOpen]);

  const handleRatingSubmit = () => {
    if (rating === 0) {
      Swal.fire({
        title: 'Choose a Star',
        text: 'Please select a rating to help us improve.',
        icon: 'warning',
        confirmButtonColor: '#6366f1'
      });
      return;
    }
    setStep(2);
  };

  const handleSubmitFeedback = async () => {
    setIsSubmitting(true);
    try {
      const userId = user?.id || localStorage.getItem('device_id') || 'anonymous';
      const userEmail = user?.email || storeData?.storeEmail || 'anonymous@user.com';
      
      const { error } = await supabase
        .from('feedback')
        .insert([{
          user_id: userId,
          user_email: userEmail,
          store_name: storeData?.store_name || 'Not Registered',
          receipt_count: receiptCount || 0,
          rating,
          experience,
          feedback,
          suggestions,
          is_registered: !!user,
          device_info: navigator.userAgent,
          url: window.location.href
        }]);

      if (error) throw error;
      setStep(3);
      setTimeout(onClose, 4000);
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire({ icon: 'error', title: 'Submission Failed', text: 'Please try again in a moment.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transition-all transform scale-100">
        
        {/* Header Section */}
        <div className={`relative p-8 text-white transition-colors duration-500 ${
          step === 3 ? 'bg-emerald-600' : rating >= 4 ? 'bg-indigo-600' : rating > 0 && rating < 3 ? 'bg-rose-500' : 'bg-slate-900'
        }`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              {step === 3 ? <CheckCircle2 size={24} /> : <MessageSquare size={24} />}
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              {step === 3 ? "Sent Successfully!" : "Share Feedback"}
            </h2>
          </div>
          
          <p className="text-white/80 text-sm font-medium">
            {step === 1 && "Your thoughts help us shape the future of ReceiptIt."}
            {step === 2 && "We value the details. Tell us more!"}
            {step === 3 && "You're awesome! We've received your notes."}
          </p>

          {/* Progress Indicator */}
          <div className="flex gap-1.5 mt-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1 rounded-full transition-all duration-300 ${
                s === step ? 'w-8 bg-white' : s < step ? 'w-4 bg-white/40' : 'w-4 bg-white/20'
              }`} />
            ))}
          </div>
        </div>

        <div className="p-8">
          {/* STEP 1: Rating & Origin */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Rating</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="group relative p-1 transition-transform hover:scale-125 active:scale-95"
                    >
                      <Star
                        size={42}
                        className={`${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        } transition-colors duration-200`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-3 px-2">
                   <span className="text-[10px] font-bold text-slate-400 uppercase">Not great</span>
                   <span className="text-[10px] font-bold text-indigo-600 uppercase">Amazing</span>
                </div>
              </div>

              {receiptCount === 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">How did you find us?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Search', 'Friend', 'Social', 'Other'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setExperience(opt)}
                        className={`py-2 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${
                          experience === opt 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-slate-100 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleRatingSubmit}
                disabled={rating === 0}
                className="w-full group flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-xl shadow-indigo-200"
              >
                Continue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* STEP 2: Detailed Feedback */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tight">What do you love?</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="3"
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 text-sm"
                  placeholder="The ease of use, the design..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tight">Suggestions</label>
                <textarea
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  rows="3"
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 text-sm"
                  placeholder="Maybe add PDF export?"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="p-4 rounded-2xl border-2 border-slate-100 text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? "Sending..." : "Submit Feedback"}
                  {!isSubmitting && <Send size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <div className="text-center py-6 animate-in zoom-in-95 duration-500">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" />
                <div className="relative w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                  <Heart size={40} className="text-emerald-500 fill-emerald-500" />
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2">You're The Best!</h3>
              <p className="text-slate-500 text-sm px-6">
                Your feedback is already with our product team. We're working on the things you mentioned!
              </p>

              <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 inline-block">
                <p className="text-xs font-bold text-indigo-700">
                   Check your email soon for a surprise! 🎁
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;