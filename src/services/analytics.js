// src/services/analytics.js
import { supabase } from '../lib/supabase';

export const analyticsService = {
  async trackEvent(userEmail, eventType, metadata = {}) {
    await supabase.from('user_mgmt_ib27f_analytics')
      .insert({
        user_email: userEmail,
        event_type: eventType,
        metadata,
      });
  },

  async getUserBehavior(userEmail) {
    try {
      const modelResponse = await fetch('/src/ml_models/realtime/user_tracking.pkl');
      const behaviorData = await modelResponse.json();
      return behaviorData;
    } catch (error) {
      console.error('Error loading behavior model:', error);
      return null;
    }
  },

  async processLocation(latitude, longitude) {
    try {
      const modelResponse = await fetch('/src/ml_models/location/geo_processor.pkl');
      const locationData = await modelResponse.json();
      return locationData;
    } catch (error) {
      console.error('Error loading location model:', error);
      return null;
    }
  },

  async getRealtimeAnalytics() {
    try {
      const modelResponse = await fetch('/src/ml_models/analytics/realtime_pipeline.pkl');
      const analyticsData = await modelResponse.json();
      return analyticsData;
    } catch (error) {
      console.error('Error loading analytics model:', error);
      return null;
    }
  }
};