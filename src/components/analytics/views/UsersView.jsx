import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, UserCheck, UserX, Search, Filter, 
  Calendar, Clock, Smartphone, Laptop, Tablet,
  Eye, FileText, Download, Share2, Activity,
  ChevronDown, ChevronUp, RefreshCw, Mail, Store,
  Receipt, ChevronLeft, ChevronRight
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

const ITEMS_PER_PAGE = 10;

const UsersView = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('lastActive');
  const [expandedUser, setExpandedUser] = useState(null);
  const [dateRange, setDateRange] = useState('7d');
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    totalUsers: 0,
    registeredUsers: 0,
    guestUsers: 0,
    activeToday: 0,
    totalReceipts: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [dateRange]);

  useEffect(() => {
    filterAndSortUsers();
    setCurrentPage(1); // Reset to page 1 on new search/filter
  }, [users, searchTerm, filterType, sortBy]);

  // --- Logic for Pagination ---
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  // Your original getDateRange Logic
  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date();
    switch(dateRange) {
      case '24h': startDate.setHours(now.getHours() - 24); break;
      case '7d': startDate.setDate(now.getDate() - 7); break;
      case '30d': startDate.setDate(now.getDate() - 30); break;
      case 'all': startDate = new Date(2020, 0, 1); break;
      default: startDate.setDate(now.getDate() - 7);
    }
    return { start: startDate.toISOString(), end: now.toISOString() };
  };

  // Your original Fetch Logic (Untouched)
  const fetchUsers = async () => {
    setLoading(true);
    const range = getDateRange();
    try {
      const { data: receipts } = await supabase.from('receipts').select('store_id, created_at').gte('created_at', range.start).lte('created_at', range.end);
      const receiptsByStore = {};
      receipts?.forEach(r => { receiptsByStore[r.store_id] = (receiptsByStore[r.store_id] || 0) + 1; });

      const { data: stores } = await supabase.from('stores').select('id, user_id, store_name');
      const storeToUser = {};
      const storeNames = {};
      stores?.forEach(s => { storeToUser[s.id] = s.user_id; storeNames[s.id] = s.store_name; });

      const { data: trackingData } = await supabase.from('user_tracking').select('*').gte('timestamp', range.start).lte('timestamp', range.end).order('timestamp', { ascending: false });

      const userMap = new Map();
      Object.keys(receiptsByStore).forEach(storeId => {
        const userId = storeToUser[storeId];
        if (userId && !userMap.has(userId)) {
          userMap.set(userId, {
            id: userId, type: 'registered', storeName: storeNames[storeId] || 'Unknown Store', storeId,
            firstSeen: null, lastActive: null, totalEvents: 0, deviceType: 'unknown',
            browser: 'unknown', os: 'unknown', pageViews: 0, receiptsCreated: receiptsByStore[storeId],
            downloads: receiptsByStore[storeId], shares: 0, events: []
          });
        }
      });

      trackingData?.forEach(event => {
        if (!event.user_id) return;
        if (!userMap.has(event.user_id)) {
          userMap.set(event.user_id, {
            id: event.user_id, type: event.is_registered ? 'registered' : 'guest', email: event.user_id.includes('@') ? event.user_id : null,
            storeName: event.store_name || null, storeId: null, firstSeen: event.timestamp, lastActive: event.timestamp,
            totalEvents: 0, deviceType: event.device_type || 'desktop', browser: event.browser || 'Unknown',
            os: event.os || 'Unknown', pageViews: 0, receiptsCreated: 0, downloads: 0, shares: 0, events: []
          });
        }
        const user = userMap.get(event.user_id);
        if (!user.firstSeen || event.timestamp < user.firstSeen) user.firstSeen = event.timestamp;
        if (!user.lastActive || event.timestamp > user.lastActive) user.lastActive = event.timestamp;
        user.totalEvents++;
        if (event.event_type === 'page_view') user.pageViews++;
        if (event.event_category === 'social') user.shares++;
        if (user.events.length < 10) {
          user.events.push({ type: event.event_type, action: event.event_action, label: event.event_label, timestamp: event.timestamp, page: event.page_path });
        }
      });

      const usersList = Array.from(userMap.values());
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const activeToday = usersList.filter(u => u.lastActive && new Date(u.lastActive) >= today).length;
      const totalReceipts = usersList.reduce((sum, u) => sum + (u.receiptsCreated || 0), 0);

      setStats({
        totalUsers: usersList.length,
        registeredUsers: usersList.filter(u => u.type === 'registered').length,
        guestUsers: usersList.filter(u => u.type === 'guest').length,
        activeToday, totalReceipts
      });
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.id.toLowerCase().includes(term) ||
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u.storeName && u.storeName.toLowerCase().includes(term))
      );
    }
    if (filterType !== 'all') filtered = filtered.filter(u => u.type === filterType);
    filtered.sort((a, b) => {
      if (sortBy === 'lastActive') return new Date(b.lastActive || 0) - new Date(a.lastActive || 0);
      if (sortBy === 'totalEvents') return (b.totalEvents || 0) - (a.totalEvents || 0);
      if (sortBy === 'receiptsCreated') return (b.receiptsCreated || 0) - (a.receiptsCreated || 0);
      if (sortBy === 'registrationDate') return new Date(b.firstSeen || 0) - new Date(a.firstSeen || 0);
      return 0;
    });
    setFilteredUsers(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins/60)}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
            <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Synchronizing User Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
                <Users size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">User Insights</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => { setRefreshing(true); fetchUsers(); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                <RefreshCw size={18} className={refreshing ? "animate-spin text-blue-600" : ""} />
            </button>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-100 border-none text-sm font-semibold rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="24h">24h</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Users', val: stats.totalUsers, icon: Users, color: 'blue' },
            { label: 'Registered', val: stats.registeredUsers, icon: UserCheck, color: 'green' },
            { label: 'Guests', val: stats.guestUsers, icon: UserX, color: 'slate' },
            { label: 'Active Today', val: stats.activeToday, icon: Activity, color: 'purple' },
            { label: 'Receipts', val: stats.totalReceipts, icon: Receipt, color: 'orange' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className={`w-8 h-8 rounded-lg bg-${stat.color}-50 flex items-center justify-center mb-3`}>
                <stat.icon size={16} className={`text-${stat.color}-600`} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.val.toLocaleString()}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users or stores..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-slate-50 border-none text-sm rounded-xl px-4 py-2 flex-1 md:flex-none">
                <option value="all">All Types</option>
                <option value="registered">Registered</option>
                <option value="guest">Guests</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-slate-50 border-none text-sm rounded-xl px-4 py-2 flex-1 md:flex-none">
                <option value="lastActive">Recently Active</option>
                <option value="totalEvents">Most Active</option>
                <option value="receiptsCreated">Top Issuers</option>
            </select>
          </div>
        </div>

        {/* User List */}
        <div className="space-y-3">
          {paginatedUsers.map((user) => (
            <div key={user.id} className={`bg-white rounded-2xl border transition-all duration-200 ${expandedUser === user.id ? 'ring-2 ring-blue-500 border-transparent shadow-lg' : 'border-slate-100 shadow-sm hover:border-slate-300'}`}>
              <div 
                className="p-4 cursor-pointer flex items-center justify-between gap-4"
                onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${user.type === 'registered' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600'}`}>
                    {user.type === 'registered' ? <UserCheck size={24} /> : <UserX size={24} />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 truncate">
                            {user.type === 'registered' ? (user.email || 'Registered User') : 'Guest User'}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-mono hidden sm:block">
                            {user.id.slice(0, 8)}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        {user.storeName && (
                            <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                                <Store size={12} /> {user.storeName}
                            </span>
                        )}
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} /> {formatDate(user.lastActive)}
                        </span>
                        <div className="flex items-center gap-2 sm:hidden">
                             <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-bold">{user.receiptsCreated} Rx</span>
                             <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{user.pageViews} View</span>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-900">{user.receiptsCreated}</p>
                            <p className="text-[10px] text-slate-400 uppercase">Receipts</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-900">{user.pageViews}</p>
                            <p className="text-[10px] text-slate-400 uppercase">Views</p>
                        </div>
                    </div>
                    {expandedUser === user.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </div>
              </div>

              {expandedUser === user.id && (
                <div className="p-4 border-t border-slate-50 bg-slate-50/50 rounded-b-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Identity Info */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Identification</h4>
                        <div className="bg-white p-3 rounded-xl border border-slate-100 text-sm space-y-2">
                            <div className="flex justify-between"><span className="text-slate-500">Full ID:</span> <span className="font-mono text-[10px] break-all ml-4">{user.id}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">First Seen:</span> <span className="text-slate-900">{new Date(user.firstSeen).toLocaleDateString()}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Browser:</span> <span className="text-slate-900">{user.browser}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">OS:</span> <span className="text-slate-900">{user.os}</span></div>
                        </div>
                    </div>

                    {/* Activity Summary */}
                    <div className="md:col-span-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Activity Stream</h4>
                        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                            {user.events.length > 0 ? (
                                <div className="divide-y divide-slate-50">
                                    {user.events.map((ev, i) => (
                                        <div key={i} className="p-3 flex items-center justify-between text-sm hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-lg ${ev.type === 'page_view' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                                    {ev.type === 'page_view' ? <Eye size={14} /> : <Receipt size={14} />}
                                                </div>
                                                <span className="font-medium text-slate-700 capitalize">{ev.action || ev.type.replace('_', ' ')}</span>
                                            </div>
                                            <span className="text-xs text-slate-400">{new Date(ev.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-400 text-sm italic">No recent events recorded.</div>
                            )}
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300" size={32} />
              </div>
              <h3 className="text-slate-900 font-bold text-lg">No matches found</h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm mt-1">Try adjusting your search terms or filters to find what you're looking for.</p>
            </div>
          )}
        </div>

        {/* --- Pagination Controls --- */}
        {filteredUsers.length > ITEMS_PER_PAGE && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">
              Showing <span className="font-bold text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-bold text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> of <span className="font-bold text-slate-900">{filteredUsers.length}</span> users
            </p>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Only show first, last, and pages around current
                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-8 h-8 text-sm font-bold rounded-lg transition-all ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                            >
                                {pageNum}
                            </button>
                        );
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                        return <span key={pageNum} className="text-slate-300">...</span>;
                    }
                    return null;
                })}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersView;