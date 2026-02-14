// src/components/AnalyticsDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Import components
import Sidebar from './analytics/Sidebar';
import DashboardHeader from './analytics/DashboardHeader';
import DashboardSkeleton from './analytics/DashboardSkeleton';

// Import views
import OverviewView from './analytics/views/OverviewView';
import UsersView from './analytics/views/UsersView';
import FeedbackView from './analytics/views/FeedbackView';

const AnalyticsDashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [timeframe, setTimeframe] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const [stats, setStats] = useState({});
  const [trends, setTrends] = useState({});
  const [recentEvents, setRecentEvents] = useState([]);
  const [popularPages, setPopularPages] = useState([]);
  const [deviceStats, setDeviceStats] = useState([]);
  const [featureUsage, setFeatureUsage] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({});
  
  const refreshInterval = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    if (activeView === 'overview') {
      fetchAllStats();
    } else {
      setLoading(false);
    }

    refreshInterval.current = setInterval(() => {
      if (isMounted.current && activeView === 'overview') {
        refreshStats();
      }
    }, 120000);

    return () => {
      isMounted.current = false;
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [timeframe, activeView]);

  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch(timeframe) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'all':
        startDate = new Date(2020, 0, 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    return { 
      start: startDate.toISOString(), 
      end: now.toISOString() 
    };
  };

  const refreshStats = async () => {
    setRefreshing(true);
    await fetchAllStats(true);
    setRefreshing(false);
  };

  const fetchAllStats = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    
    const dateRange = getDateRange();

    try {
      const [
        overview,
        trendData,
        events,
        pages,
        devices,
        features,
        feedback
      ] = await Promise.all([
        fetchOverviewStats(dateRange),
        fetchTrends(dateRange),
        fetchRecentEvents(),
        fetchPopularPages(dateRange),
        fetchDeviceStats(dateRange),
        fetchFeatureUsage(dateRange),
        fetchFeedbackStats(dateRange)
      ]);

      if (isMounted.current) {
        setStats(overview);
        setTrends(trendData);
        setRecentEvents(events);
        setPopularPages(pages);
        setDeviceStats(devices);
        setFeatureUsage(features);
        setFeedbackStats(feedback);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  // All fetch functions remain the same as before
  const fetchOverviewStats = async (dateRange) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todayUsers } = await supabase
        .from('user_tracking')
        .select('user_id')
        .gte('timestamp', today.toISOString());

      const uniqueUserIds = new Set();
      todayUsers?.forEach(item => {
        if (item.user_id) uniqueUserIds.add(item.user_id);
      });
      
      const activeToday = uniqueUserIds.size;

      const { data: allUsers } = await supabase
        .from('user_tracking')
        .select('user_id')
        .lte('timestamp', dateRange.end);

      const uniqueAllUsers = new Set();
      allUsers?.forEach(item => {
        if (item.user_id) uniqueAllUsers.add(item.user_id);
      });
      
      const totalUsers = uniqueAllUsers.size;

      const { count: pageViews } = await supabase
        .from('user_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_view')
        .gte('timestamp', dateRange.start);

      const { count: receiptsCreated } = await supabase
        .from('user_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'receipt_action')
        .eq('event_action', 'create')
        .gte('timestamp', dateRange.start);

      const { count: downloads } = await supabase
        .from('receipts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end);

      return {
        totalUsers,
        activeToday,
        pageViews: pageViews || 0,
        receiptsCreated: receiptsCreated || 0,
        downloads: downloads || 0
      };
    } catch (error) {
      console.error('Error in fetchOverviewStats:', error);
      return {
        totalUsers: 0,
        activeToday: 0,
        pageViews: 0,
        receiptsCreated: 0,
        downloads: 0
      };
    }
  };

  const fetchTrends = async (dateRange) => {
    try {
      const { data } = await supabase
        .from('user_tracking')
        .select('timestamp')
        .eq('event_type', 'page_view')
        .gte('timestamp', dateRange.start)
        .lte('timestamp', dateRange.end)
        .limit(5000);

      const daily = {};
      const now = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      
      while (now <= end) {
        const day = now.toISOString().split('T')[0];
        daily[day] = 0;
        now.setDate(now.getDate() + 1);
      }

      data?.forEach(event => {
        const day = new Date(event.timestamp).toISOString().split('T')[0];
        if (daily[day] !== undefined) {
          daily[day]++;
        }
      });

      const chartData = Object.entries(daily).map(([date, count]) => ({
        date,
        count
      }));

      const values = chartData.map(d => d.count);
      const recent = values.slice(-3).reduce((a, b) => a + b, 0) / 3;
      const previous = values.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
      const growth = previous > 0 ? ((recent - previous) / previous) * 100 : 0;

      return {
        daily: chartData.slice(-7),
        growth: Math.round(growth * 10) / 10
      };
    } catch (error) {
      console.error('Error in fetchTrends:', error);
      return { daily: [], growth: 0 };
    }
  };

  const fetchRecentEvents = async () => {
    try {
      const { data } = await supabase
        .from('user_tracking')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);
      return data || [];
    } catch (error) {
      return [];
    }
  };

  const fetchPopularPages = async (dateRange) => {
    try {
      const { data } = await supabase
        .from('user_tracking')
        .select('page_path')
        .eq('event_type', 'page_view')
        .gte('timestamp', dateRange.start)
        .lte('timestamp', dateRange.end)
        .limit(5000);

      const pageCounts = {};
      data?.forEach(item => {
        const path = item.page_path || '/';
        pageCounts[path] = (pageCounts[path] || 0) + 1;
      });

      return Object.entries(pageCounts)
        .map(([page_path, count]) => ({ page_path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    } catch (error) {
      return [];
    }
  };

  const fetchDeviceStats = async (dateRange) => {
    try {
      const { data } = await supabase
        .from('user_tracking')
        .select('device_type, user_id')
        .gte('timestamp', dateRange.start)
        .lte('timestamp', dateRange.end)
        .limit(5000);

      const uniqueUsers = {};
      data?.forEach(item => {
        const device = item.device_type || 'desktop';
        if (!uniqueUsers[device]) uniqueUsers[device] = new Set();
        uniqueUsers[device].add(item.user_id);
      });

      return [
        { type: 'Desktop', count: uniqueUsers.desktop?.size || 0, icon: require('lucide-react').Laptop },
        { type: 'Mobile', count: uniqueUsers.mobile?.size || 0, icon: require('lucide-react').Smartphone },
        { type: 'Tablet', count: uniqueUsers.tablet?.size || 0, icon: require('lucide-react').Tablet }
      ];
    } catch (error) {
      return [];
    }
  };

  const fetchFeatureUsage = async (dateRange) => {
    try {
      const { data } = await supabase
        .from('user_tracking')
        .select('event_label')
        .eq('event_category', 'feature')
        .gte('timestamp', dateRange.start)
        .lte('timestamp', dateRange.end)
        .limit(5000);

      const featureCounts = {};
      data?.forEach(item => {
        const feature = item.event_label || 'unknown';
        featureCounts[feature] = (featureCounts[feature] || 0) + 1;
      });

      return Object.entries(featureCounts)
        .map(([event_label, count]) => ({ event_label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    } catch (error) {
      return [];
    }
  };

  const fetchFeedbackStats = async (dateRange) => {
    try {
      const { data: feedbackData } = await supabase
        .from('feedback')
        .select('rating')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end);

      const total = feedbackData?.length || 0;
      const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let sum = 0;
      
      feedbackData?.forEach(f => {
        if (f.rating >= 1 && f.rating <= 5) {
          ratings[f.rating]++;
          sum += f.rating;
        }
      });

      const avgRating = total > 0 ? sum / total : 0;

      return {
        total,
        avgRating: Math.round(avgRating * 10) / 10,
        ratings: Object.entries(ratings).map(([rating, count]) => ({ rating: parseInt(rating), count }))
      };
    } catch (error) {
      return { total: 0, avgRating: 0, ratings: [] };
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const renderView = () => {
    if (loading) {
      return <DashboardSkeleton />;
    }

    switch (activeView) {
      case 'overview':
        return (
          <OverviewView 
            stats={stats}
            trends={trends}
            deviceStats={deviceStats}
            popularPages={popularPages}
            feedbackStats={feedbackStats}
            featureUsage={featureUsage}
            recentEvents={recentEvents}
            formatNumber={formatNumber}
          />
        );
      case 'users':
        return <UsersView />;
      case 'feedback':
        return <FeedbackView />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={20} />
              </button>

              {/* Timeframe (only show on overview) */}
              {activeView === 'overview' && (
                <DashboardHeader 
                  timeframe={timeframe}
                  setTimeframe={setTimeframe}
                  refreshing={refreshing}
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                />
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {renderView()}

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            {activeView === 'overview' && 'Data updates every 2 minutes • '}
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;