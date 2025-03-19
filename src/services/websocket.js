// src/services/websocket.js
import { supabase } from '../lib/supabase';

class WebSocketService {
  constructor() {
    this.channel = null;
    this.presenceChannel = null;
  }

  async initialize(userEmail) {
    // Subscribe to presence changes
    this.presenceChannel = supabase.channel('online-users', {
      config: {
        presence: {
          key: userEmail,
        },
      },
    });

    await this.presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await this.presenceChannel.track({
          user_email: userEmail,
          online_at: new Date().toISOString(),
        });
      }
    });

    // Update presence in database
    await supabase.from('user_mgmt_ib27f_presence')
      .upsert({
        user_email: userEmail,
        status: 'online',
        last_seen: new Date().toISOString(),
      });
  }

  async updateLocation(userEmail, latitude, longitude) {
    await supabase.from('user_mgmt_ib27f_presence')
      .update({
        latitude,
        longitude,
        location_enabled: true,
        last_seen: new Date().toISOString(),
      })
      .eq('user_email', userEmail);
  }

  async disconnect(userEmail) {
    if (this.presenceChannel) {
      await this.presenceChannel.untrack();
      await this.presenceChannel.unsubscribe();
    }

    await supabase.from('user_mgmt_ib27f_presence')
      .update({
        status: 'offline',
        last_seen: new Date().toISOString(),
      })
      .eq('user_email', userEmail);
  }
}

export const websocketService = new WebSocketService();