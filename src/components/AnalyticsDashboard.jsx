// src/components/AnalyticsDashboard.jsx
import React from 'react';
import { useAnalytics } from '../contexts/AnalyticsContext';

const AnalyticsDashboard = () => {
  const { engagementData, profileViews, trends } = useAnalytics();

  return (
    <div className="space-y-8">
      {/* User Engagement Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">User Engagement</h2>
        <div className="space-y-2">
          {engagementData.map((data, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50">
              <span className="text-gray-600 w-24">{data.date}</span>
              <div className="flex items-center flex-1 ml-4">
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${data.value}%` }}
                  />
                </div>
                <span className="ml-3 text-blue-600 font-medium w-16">{data.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Views Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Profile Views</h2>
        <div className="space-y-4">
          {profileViews.map((view, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-700 w-24">{view.profile}</span>
              <div className="flex items-center flex-1 ml-4">
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 transition-all duration-500"
                    style={{ width: `${(view.views / Math.max(...profileViews.map(v => v.views)) * 100)}%` }}
                  />
                </div>
                <span className="ml-3 text-gray-600 w-20">{view.views} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trends Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trends.map((trend, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-3">{trend.category}</h3>
            <div className="text-3xl font-bold text-blue-600 mb-3">{trend.value}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${trend.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;