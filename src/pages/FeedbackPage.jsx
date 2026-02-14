import React, { useState } from 'react';
import { MessageSquare, Star, Send, ArrowLeft, Sparkles, CheckCircle2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Swal from 'sweetalert2';
import usePageMeta from '../hooks/usePageMeta';

const FeedbackPage = ({user, storeData, receiptCount}) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [experience, setExperience] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  usePageMeta(
    "Share Your Feedback - ReceiptIt",
    "Help us improve ReceiptIt by sharing your experience and suggestions."
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      Swal.fire({
        title: 'Select a rating',
        text: 'Please select a rating to continue',
        icon: 'info',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

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
            rating,
            is_registered: !!user,
            experience,
            feedback,
            receipt_count: receiptCount || 0,
            suggestions,
            device_info: navigator.userAgent,
            url: window.location.href,
            created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      setSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to submit feedback. Please try again.',
        icon: 'error',
        confirmButtonColor: '#4f46e5'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100 p-10 border border-slate-100">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 animate-pulse">
                <CheckCircle2 size={48} />
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">You're Awesome! 🎉</h1>
            <p className="text-slate-500 mb-8 font-medium">
              Your feedback helps us build the future of ReceiptIt. We appreciate your time!
            </p>

            <div className="space-y-3 mb-10">
              {['Feedback Recorded', 'Suggestions Sent to Devs', 'Experience Logged'].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Heart size={16} className="text-indigo-500 fill-indigo-500" />
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
            >
              <ArrowLeft size={18} />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white shadow-xl shadow-indigo-100 rounded-3xl mb-6 border border-slate-100">
            <MessageSquare size={32} className="text-indigo-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter uppercase">Feedback</h1>
          <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
            Help us shape ReceiptIt. Your insights are our roadmap to excellence.
          </p>
        </div>

        {/* Form Surface */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* High Impact Rating Section */}
            <div className="text-center">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                Overall Experience <span className="text-indigo-500">*</span>
              </label>
              <div className="flex justify-center gap-2 md:gap-4 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="group relative p-2 transition-all"
                  >
                    <Star
                      size={44}
                      className={`${
                        star <= (hoverRating || rating)
                          ? 'fill-indigo-500 text-indigo-500 scale-110'
                          : 'text-slate-200 group-hover:text-indigo-200'
                      } transition-all duration-300 ease-out`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-300 px-4 uppercase tracking-widest">
                <span>Novice</span>
                <span>Pro</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* Select Input */}
              <div className="group">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">
                  Discovery Route
                </label>
                <div className="relative">
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-100 text-slate-900 py-4 px-5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium outline-none cursor-pointer"
                  >
                    <option value="">How did you find us?</option>
                    <option value="search">Search Engine (Google, Bing, etc.)</option>
                    <option value="social">Social Media</option>
                    <option value="friend">Friend/Colleague Recommendation</option>
                    <option value="ad">Online Advertisement</option>
                    <option value="article">Article/Blog Post</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Text Area 1 */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">
                  What Shines?
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-100 py-4 px-5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium outline-none placeholder:text-slate-300"
                  placeholder="What are we doing right?"
                />
              </div>

              {/* Text Area 2 */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">
                  Constructive Suggestions
                </label>
                <textarea
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-100 py-4 px-5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium outline-none placeholder:text-slate-300"
                  placeholder="What could be better?"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full group relative flex items-center justify-center gap-3 bg-indigo-600 text-white py-5 px-8 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100 active:scale-95 overflow-hidden"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>Ship Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Brand Indicators */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Happy Users', val: '100+' },
            { label: 'Avg Rating', val: '4.8/5' },
            { label: 'Response Rate', val: '100%' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white/50 backdrop-blur-sm border border-white p-6 rounded-3xl text-center shadow-sm">
              <div className="text-2xl font-black text-slate-900 mb-1 tracking-tight">{stat.val}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;