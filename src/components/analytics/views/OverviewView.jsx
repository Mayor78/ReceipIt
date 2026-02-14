// components/analytics/views/OverviewView.jsx
import React from 'react';
import { Users, FileText, Download, Eye } from 'lucide-react';
import StatCard from '../StatCard';
import DeviceChart from '../DeviceChart';
import PopularPages from '../PopularPages';
import FeedbackStats from '../FeedbackStats';
import FeatureUsage from '../FeatureUsage';
import RecentActivity from '../RecentActivity';

const OverviewView = ({ stats, trends, deviceStats, popularPages, feedbackStats, featureUsage, recentEvents, formatNumber }) => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Users}
          title="Active Today"
          value={formatNumber(stats.activeToday)}
          trend={trends.growth}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard 
          icon={FileText}
          title="Receipts Created"
          value={formatNumber(stats.receiptsCreated)}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard 
          icon={Eye}
          title="Page Views"
          value={formatNumber(stats.pageViews)}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard 
          icon={Download}
          title="Downloads"
          value={formatNumber(stats.downloads)}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DeviceChart deviceStats={deviceStats} />
        <PopularPages pages={popularPages} />
        <FeedbackStats feedbackStats={feedbackStats} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureUsage features={featureUsage} />
        <RecentActivity events={recentEvents} />
      </div>
    </div>
  );
};

export default OverviewView;