import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Star, Search, Download, UserCheck, UserX,
  ThumbsUp, ThumbsDown, Calendar, ChevronDown, ChevronUp,
  Mail, Store, RefreshCw, Filter, ArrowUpRight, Info
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

const FeedbackView = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [stats, setStats] = useState({
    total: 0, averageRating: 0, fiveStar: 0, fourStar: 0, 
    threeStar: 0, twoStar: 0, oneStar: 0, registeredFeedback: 0, guestFeedback: 0
  });

  useEffect(() => { fetchFeedback(); }, [dateRange]);
  useEffect(() => { filterFeedback(); }, [feedback, searchTerm, ratingFilter, userTypeFilter]);

  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date();
    if (dateRange === '7d') startDate.setDate(now.getDate() - 7);
    else if (dateRange === '30d') startDate.setDate(now.getDate() - 30);
    else startDate = new Date(2020, 0, 1);
    return { start: startDate.toISOString(), end: now.toISOString() };
  };

  const fetchFeedback = async () => {
    setLoading(true);
    const range = getDateRange();
    try {
      const { data: feedbackData, error } = await supabase
        .from('feedback')
        .select('*')
        .gte('created_at', range.start)
        .lte('created_at', range.end)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enrichedFeedback = await Promise.all((feedbackData || []).map(async (item) => {
        let userType = 'guest';
        let storeName = null;
        if (item.user_id && item.user_id.includes('@')) {
          userType = 'registered';
          const { data: storeData } = await supabase.from('stores').select('store_name').eq('user_id', item.user_id).maybeSingle();
          if (storeData) storeName = storeData.store_name;
        }
        return {
          ...item,
          userType,
          storeName,
          formattedDate: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          sentiment: item.rating >= 4 ? 'positive' : (item.rating === 3 ? 'neutral' : 'negative')
        };
      }));

      setFeedback(enrichedFeedback);
      calculateStats(enrichedFeedback);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const avgRating = total > 0 ? (data.reduce((acc, f) => acc + (f.rating || 0), 0) / total).toFixed(1) : 0;
    setStats({
      total,
      averageRating: avgRating,
      fiveStar: data.filter(f => f.rating === 5).length,
      fourStar: data.filter(f => f.rating === 4).length,
      threeStar: data.filter(f => f.rating === 3).length,
      twoStar: data.filter(f => f.rating === 2).length,
      oneStar: data.filter(f => f.rating === 1).length,
    });
  };

  const filterFeedback = () => {
    let filtered = [...feedback];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.feedback?.toLowerCase().includes(term) || 
        item.user_email?.toLowerCase().includes(term) ||
        item.store_name?.toLowerCase().includes(term)
      );
    }
    if (ratingFilter !== 'all') filtered = filtered.filter(item => item.rating === parseInt(ratingFilter));
    if (userTypeFilter !== 'all') filtered = filtered.filter(item => item.userType === userTypeFilter);
    setFilteredFeedback(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Rating', 'User', 'Store', 'Feedback'];
    const csvContent = [headers, ...filteredFeedback.map(f => [f.formattedDate, f.rating, f.user_email || f.user_id, f.storeName || '', f.feedback || ''])]
      .map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "feedback.csv";
    link.click();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Analyzing feedback...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Feedback Center</h1>
            <p className="text-slate-500 mt-1 font-medium">Monitor and analyze user experience trends</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setRefreshing(true); fetchFeedback(); }}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-all shadow-sm"
            >
              <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold transition-all shadow-sm"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 border-none cursor-pointer hover:bg-blue-700 transition-all outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <StatCard label="Total Reviews" val={stats.total} icon={<MessageSquare size={18}/>} color="blue" />
          <StatCard label="Avg Rating" val={stats.averageRating} icon={<Star size={18}/>} color="yellow" isStar />
          {[5,4,3,2,1].map(s => (
            <StatCard key={s} label={`${s} Stars`} val={stats[`${['one','two','three','four','five'][s-1]}Star`]} color={s > 3 ? 'green' : s === 3 ? 'yellow' : 'red'} />
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search feedback, email, or stores..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <FilterSelect icon={<Star size={16}/>} value={ratingFilter} onChange={setRatingFilter} options={[
              {v:'all', l:'All Ratings'}, {v:'5', l:'5 Stars'}, {v:'4', l:'4 Stars'}, {v:'3', l:'3 Stars'}, {v:'2', l:'2 Stars'}, {v:'1', l:'1 Star'}
            ]} />
            <FilterSelect icon={<UserCheck size={16}/>} value={userTypeFilter} onChange={setUserTypeFilter} options={[
              {v:'all', l:'All Users'}, {v:'registered', l:'Registered'}, {v:'guest', l:'Guests'}
            ]} />
          </div>
        </div>

        {/* Feedback Cards */}
        <div className="grid gap-4">
          {filteredFeedback.map((item) => (
            <div 
              key={item.id} 
              className={`bg-white border transition-all duration-200 rounded-2xl overflow-hidden ${expandedFeedback === item.id ? 'ring-2 ring-blue-500 border-transparent shadow-xl' : 'border-slate-200 hover:border-blue-300 shadow-sm'}`}
            >
              <div 
                className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center gap-5"
                onClick={() => setExpandedFeedback(expandedFeedback === item.id ? null : item.id)}
              >
                {/* Rating Visual */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xl font-black text-slate-900">{item.rating}</span>
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < item.rating ? 'bg-yellow-400' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                      item.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-700' : 
                      item.sentiment === 'neutral' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {item.sentiment === 'positive' ? <ThumbsUp size={12}/> : item.sentiment === 'neutral' ? <Info size={12}/> : <ThumbsDown size={12}/>}
                      {item.sentiment}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${item.userType === 'registered' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                      {item.userType === 'registered' ? 'REGISTERED USER' : 'GUEST'}
                    </span>
                    {item.storeName && (
                      <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1">
                        <Store size={12} /> {item.storeName}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 font-medium line-clamp-1 italic">"{item.feedback || 'No comments provided'}"</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><Mail size={14}/> {item.user_email || 'anonymous'}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14}/> {item.formattedDate}</span>
                  </div>
                </div>

                <div className="hidden md:block">
                  {expandedFeedback === item.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </div>
              </div>

              {/* Expanded Area */}
              {expandedFeedback === item.id && (
                <div className="px-6 pb-6 pt-2 bg-slate-50/50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Feedback Details</h4>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-slate-800 leading-relaxed">{item.feedback || <span className="text-slate-400 italic">No feedback provided</span>}</p>
                      </div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggestions</h4>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-slate-800 leading-relaxed">{item.suggestions || <span className="text-slate-400 italic">No suggestions provided</span>}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Metadata</h4>
                      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
                        <MetaRow label="User ID" value={item.user_id} isMono />
                        <MetaRow label="Source" value={item.experience || 'Not specified'} />
                        <MetaRow label="Receipts" value={item.receipt_count || 0} />
                        <div className="p-3">
                          <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Device Info</p>
                          <p className="text-[10px] font-mono bg-slate-50 p-2 rounded text-slate-500 break-all">{item.device_info || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredFeedback.length === 0 && (
            <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching feedback</h3>
              <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const StatCard = ({ label, val, icon, color, isStar }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    yellow: 'bg-amber-50 text-amber-600 border-amber-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    red: 'bg-rose-50 text-rose-600 border-rose-100'
  };
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 border ${colors[color]}`}>
        {icon || <span className="text-[10px] font-bold">★</span>}
      </div>
      <p className="text-2xl font-black text-slate-900">{val}{isStar && <span className="text-sm text-slate-400 ml-1">/ 5</span>}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  );
};

const FilterSelect = ({ icon, value, onChange, options }) => (
  <div className="relative flex-1 min-w-[140px]">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
      {icon}
    </div>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-semibold text-slate-600 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all"
    >
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>
);

const MetaRow = ({ label, value, isMono }) => (
  <div className="flex justify-between items-center p-3">
    <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{label}</span>
    <span className={`text-xs font-semibold text-slate-700 ${isMono ? 'font-mono' : ''}`}>{value}</span>
  </div>
);

export default FeedbackView;