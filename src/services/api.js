// src/services/api.js
import { supabase } from '../lib/supabase';

const SAMPLE_SETTINGS = {
  notifications: true,
  locationSharing: false,
  theme: 'light',
  privacyLevel: 'friends'
};

export async function getProfile(email) {
  const { data, error } = await supabase
    .from('user_mgmt_ib27f_profiles')
    .select('*')
    .eq('user_email', email)
    .single();

  if (error && error.code === 'PGRST116') {
    // Profile not found, create one
    return createProfile(email);
  }

  if (error) throw error;
  return data;
}

export async function createProfile(email) {
  const newProfile = {
    user_email: email,
    settings: SAMPLE_SETTINGS,
    location: {
      lat: 40.7128,
      lng: -74.0060,
      city: 'New York'
    },
    last_active: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('user_mgmt_ib27f_profiles')
    .insert([newProfile])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(email, updates) {
  const { data, error } = await supabase
    .from('user_mgmt_ib27f_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('user_email', email)
    .select()
    .single();

  if (error) throw error;
  return data;
}