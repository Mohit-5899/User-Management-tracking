// src/pages/Analytics.jsx
import React from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useAnalytics } from '../contexts/AnalyticsContext';

const Analytics = () => {
  const { isLoading } = useAnalytics();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <AnalyticsDashboard />
      )}
    </div>
  );
};

export default Analytics;