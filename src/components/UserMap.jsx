// src/components/UserMap.jsx
import React, { useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const UserMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { activeUsers } = useUser();

  useEffect(() => {
    // Simulated user locations for demo
    const demoUsers = [
      { name: 'User 1', latitude: 40.7128, longitude: -74.0060 },
      { name: 'User 2', latitude: 34.0522, longitude: -118.2437 },
      { name: 'User 3', latitude: 51.5074, longitude: -0.1278 }
    ];

    // Create a simple map visualization using HTML and CSS
    const mapDiv = mapContainer.current;
    mapDiv.innerHTML = `
      <div class="p-4 bg-blue-50 rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Active Users Location</h3>
        <div class="space-y-2">
          ${demoUsers.map(user => `
            <div class="flex items-center space-x-2 p-2 bg-white rounded shadow-sm">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>${user.name}</span>
              <span class="text-gray-500 text-sm">(${user.latitude.toFixed(2)}, ${user.longitude.toFixed(2)})</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }, []);

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default UserMap;