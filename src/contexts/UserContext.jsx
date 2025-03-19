// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser] = useState({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Senior Developer'
  });

  const [activeUsers] = useState([
    {
      id: '2',
      name: 'Alice Smith',
      location: { lat: 40.7128, lng: -74.0060 },
      lastActive: new Date(),
      status: 'online'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      location: { lat: 34.0522, lng: -118.2437 },
      lastActive: new Date(),
      status: 'online'
    },
    {
      id: '4',
      name: 'Carol Williams',
      location: { lat: 51.5074, lng: -0.1278 },
      lastActive: new Date(),
      status: 'online'
    }
  ]);

  const [onlineCount, setOnlineCount] = useState(activeUsers.length);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const randomChange = Math.random() > 0.5 ? 1 : -1;
      setOnlineCount(prev => Math.max(3, Math.min(10, prev + randomChange)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    currentUser,
    activeUsers,
    onlineCount
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;