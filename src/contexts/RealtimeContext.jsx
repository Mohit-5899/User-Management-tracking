// src/contexts/RealtimeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { websocketService } from '../services/websocket';
import { locationService } from '../services/location';
import { analyticsService } from '../services/analytics';
import { supabase } from '../lib/supabase';

const RealtimeContext = createContext();

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

export function RealtimeProvider({ children }) {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [locationEnabled, setLocationEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeRealtime = async () => {
      if (!user?.email) return;

      await websocketService.initialize(user.email);
      
      // Subscribe to presence changes
      const { data: presenceData } = await supabase
        .from('user_mgmt_ib27f_presence')
        .select('*')
        .eq('status', 'online');

      // Subscribe to location updates
      const locationChannel = supabase
        .channel('location_updates')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_mgmt_ib27f_profiles',
          filter: 'location=neq.null'
        }, payload => {
          if (mounted && payload.new.user_email !== user.email) {
            setNearbyUsers(current => {
              const others = current.filter(u => u.email !== payload.new.user_email);
              if (payload.new.location) {
                return [...others, {
                  email: payload.new.user_email,
                  location: payload.new.location
                }];
              }
              return others;
            });
          }
        })
        .subscribe();

      if (mounted) {
        setOnlineUsers(presenceData || []);
      }

      return () => {
        locationChannel.unsubscribe();
      };
    };

    initializeRealtime();

    return () => {
      mounted = false;
      if (user?.email) {
        websocketService.disconnect(user.email);
      }
    };
  }, [user]);

  const toggleLocation = async (enable) => {
    if (!user?.email) return;

    try {
      if (enable) {
        const hasPermission = await locationService.requestPermission();
        if (hasPermission) {
          await locationService.enableTracking(user.email);
          setLocationEnabled(true);
        }
      } else {
        await locationService.disableTracking(user.email);
        setLocationEnabled(false);
      }

      await analyticsService.trackEvent(user.email, 'location_toggle', { enabled: enable });
    } catch (error) {
      console.error('Error toggling location:', error);
    }
  };

  const value = {
    onlineUsers,
    nearbyUsers,
    locationEnabled,
    toggleLocation,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}