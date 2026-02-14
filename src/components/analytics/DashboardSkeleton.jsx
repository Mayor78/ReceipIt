// components/analytics/DashboardSkeleton.jsx
import React from 'react';
import { BarChart3 } from 'lucide-react';

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Title */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg animate-pulse">
                <BarChart3 size={20} className="text-gray-300" />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Right - Timeframe Buttons */}
            <div className="hidden md:flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gray-100 rounded-lg w-10 h-10 animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-100 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Charts Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Chart Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Pages Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
              <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-40 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-8 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="text-center mb-4">
              <div className="h-10 w-16 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-100 rounded mx-auto animate-pulse"></div>
            </div>
            <div className="flex justify-center mb-4 space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-8 h-3 bg-gray-100 rounded animate-pulse"></div>
                  <div className="flex-1 h-2 bg-gray-100 rounded mx-2 animate-pulse"></div>
                  <div className="w-8 h-3 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature Usage Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
              <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-start space-x-3 p-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-3 w-1/2 bg-gray-50 rounded animate-pulse"></div>
                  </div>
                  <div className="w-6 h-6 bg-gray-50 rounded animate-pulse flex-shrink-0"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="text-center">
          <div className="h-3 w-64 bg-gray-100 rounded mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;