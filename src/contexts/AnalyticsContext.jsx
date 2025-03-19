// src/contexts/AnalyticsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Demo engagement data for the past week
  const [engagementData, setEngagementData] = useState([
    { date: '2024-01-15', value: 85 },
    { date: '2024-01-16', value: 76 },
    { date: '2024-01-17', value: 92 },
    { date: '2024-01-18', value: 88 },
    { date: '2024-01-19', value: 95 },
    { date: '2024-01-20', value: 82 },
    { date: '2024-01-21', value: 89 }
  ]);

  // Demo profile views data
  const [profileViews] = useState([
    { profile: 'John Doe', views: 245 },
    { profile: 'Alice Smith', views: 189 },
    { profile: 'Bob Johnson', views: 167 },
    { profile: 'Carol Williams', views: 203 },
    { profile: 'Dave Brown', views: 156 }
  ]);

  // Demo trend metrics
  const [trends] = useState([
    { category: 'User Growth', value: 27 },
    { category: 'Engagement Rate', value: 84 },
    { category: 'Task Completion', value: 92 }
  ]);

  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Real-time engagement simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      const randomValue = Math.floor(Math.random() * 20) + 75; // Random value between 75-95
      
      setEngagementData(prev => {
        const newData = [...prev];
        newData[newData.length - 1] = {
          date: currentDate.toISOString().split('T')[0],
          value: randomValue
        };
        return newData;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const value = {
    isLoading,
    engagementData,
    profileViews,
    trends
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsContext;