// src/components/LocationMap.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useRealtime } from '../contexts/RealtimeContext';
import { useAuth } from '../contexts/AuthContext';
import { locationService } from '../services/location';

function LocationMap() {
  const { user } = useAuth();
  const { locationEnabled, toggleLocation } = useRealtime();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const canvasRef = useRef(null);
  const mapInterval = useRef(null);

  useEffect(() => {
    if (locationEnabled && user?.email) {
      updateNearbyUsers();
      // Update nearby users every 30 seconds
      mapInterval.current = setInterval(updateNearbyUsers, 30000);
    }

    return () => {
      if (mapInterval.current) {
        clearInterval(mapInterval.current);
      }
    };
  }, [locationEnabled, user]);

  const updateNearbyUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const users = await locationService.getNearbyUsers(user.email);
      setNearbyUsers(users);
      drawMap(users);
    } catch (err) {
      console.error('Error updating nearby users:', err);
      setError('Failed to update nearby users');
    } finally {
      setLoading(false);
    }
  };

  const drawMap = (users) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw map background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw current user
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText('You', centerX, centerY + 20);

    // Draw nearby users
    users.forEach((nearbyUser, index) => {
      const angle = (2 * Math.PI * index) / users.length;
      const distance = 100; // Fixed distance for visualization
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      ctx.fillStyle = '#2196F3';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Draw user email (truncated)
      const truncatedEmail = nearbyUser.email.split('@')[0];
      ctx.fillStyle = '#666';
      ctx.fillText(truncatedEmail, x, y + 15);
    });
  };

  const handleLocationToggle = async (enabled) => {
    try {
      setError('');
      await toggleLocation(enabled);
      if (!enabled) {
        setNearbyUsers([]);
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    } catch (err) {
      console.error('Error toggling location:', err);
      setError('Failed to toggle location services');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Location Map</h2>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={locationEnabled}
            onChange={(e) => handleLocationToggle(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-700">
            {loading ? 'Updating...' : 'Enable Location'}
          </span>
        </label>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width="400"
          height="400"
          className="w-full border rounded bg-gray-50"
        />
        
        {error && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-100 text-red-600 px-4 py-2 rounded">
            {error}
          </div>
        )}
      </div>

      <div className="mt-2 text-sm text-gray-500">
        {locationEnabled
          ? `${nearbyUsers.length} users nearby`
          : 'Enable location to see nearby users'}
      </div>
    </div>
  );
}

export default LocationMap;