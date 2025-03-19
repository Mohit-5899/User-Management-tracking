// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserList from '../components/UserList';
import LocationMap from '../components/LocationMap';
import EncryptedImageUpload from '../components/EncryptedImageUpload';
import { getProfile, updateProfile } from '../services/api';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError('');

        if (!user?.email) {
          throw new Error('User not authenticated');
        }

        const profileData = await getProfile(user.email);
        setProfile(profileData);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }

    if (user?.email) {
      loadProfile();
    }
  }, [user]);

  const handleToggleSetting = async (settingKey) => {
    try {
      if (!profile?.settings) return;

      const newSettings = {
        ...profile.settings,
        [settingKey]: !profile.settings[settingKey]
      };

      const updatedProfile = await updateProfile(user.email, {
        settings: newSettings
      });

      setProfile(updatedProfile);
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="mt-1 text-gray-900">
                  {profile?.location?.city || 'Location not set'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Settings</label>
                <div className="mt-2 space-y-2">
                  {profile?.settings && Object.entries(profile.settings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <button
                        onClick={() => handleToggleSetting(key)}
                        className={`px-3 py-1 rounded text-sm ${
                          value
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {value ? 'On' : 'Off'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                <p className="mt-1 text-gray-900">
                  {profile?.updated_at
                    ? new Date(profile.updated_at).toLocaleString()
                    : 'Never'}
                </p>
              </div>
            </div>
          </div>

          <EncryptedImageUpload />
        </div>

        <div className="space-y-6">
          <UserList />
          <LocationMap />
        </div>
      </div>
    </div>
  );
}

export default Profile;