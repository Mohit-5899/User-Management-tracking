// src/components/UserList.jsx
import React from 'react';
import { useRealtime } from '../contexts/RealtimeContext';

function UserList() {
  const { onlineUsers } = useRealtime();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Online Users</h2>
      <div className="space-y-2">
        {onlineUsers.map((user) => (
          <div
            key={user.user_email}
            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
          >
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-700">{user.user_email}</span>
            <span className="text-xs text-gray-500">
              {new Date(user.last_seen).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {onlineUsers.length === 0 && (
          <p className="text-gray-500 text-center">No users online</p>
        )}
      </div>
    </div>
  );
}

export default UserList;