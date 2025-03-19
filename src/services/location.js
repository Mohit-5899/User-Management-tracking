// src/services/location.js
import { supabase } from '../lib/supabase';

class LocationService {
  constructor() {
    this.watchId = null;
    this.hasPermission = false;
  }

  async requestPermission() {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser');
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      this.hasPermission = permission.state === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  async enableTracking(userEmail) {
    if (!this.hasPermission) {
      const granted = await this.requestPermission();
      if (!granted) {
        throw new Error('Location permission denied');
      }
    }

    // Start watching position
    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update user's location in the database
        const { error } = await supabase
          .from('user_mgmt_ib27f_profiles')
          .update({
            location: { lat: latitude, lng: longitude },
            last_active: new Date().toISOString()
          })
          .eq('user_email', userEmail);

        if (error) {
          console.error('Error updating location:', error);
        }
      },
      (error) => {
        console.error('Error tracking location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }

  async disableTracking(userEmail) {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    // Clear user's location in the database
    const { error } = await supabase
      .from('user_mgmt_ib27f_profiles')
      .update({
        location: null,
        last_active: new Date().toISOString()
      })
      .eq('user_email', userEmail);

    if (error) {
      console.error('Error clearing location:', error);
    }
  }

  async getNearbyUsers(userEmail, radiusKm = 10) {
    try {
      // Get current user's location
      const { data: currentUser } = await supabase
        .from('user_mgmt_ib27f_profiles')
        .select('location')
        .eq('user_email', userEmail)
        .single();

      if (!currentUser?.location) {
        return [];
      }

      // Get all users with location data
      const { data: users } = await supabase
        .from('user_mgmt_ib27f_profiles')
        .select('user_email, location')
        .not('location', 'is', null)
        .neq('user_email', userEmail);

      // Calculate distances and filter nearby users
      const nearbyUsers = users
        ?.filter(user => this.calculateDistance(
          currentUser.location.lat,
          currentUser.location.lng,
          user.location.lat,
          user.location.lng
        ) <= radiusKm)
        .map(user => ({
          email: user.user_email,
          location: user.location
        })) || [];

      return nearbyUsers;
    } catch (error) {
      console.error('Error getting nearby users:', error);
      return [];
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}

export const locationService = new LocationService();