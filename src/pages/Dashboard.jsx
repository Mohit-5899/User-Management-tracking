// src/pages/Dashboard.jsx
import React from 'react';
import UserMap from '../components/UserMap';
import ProfileManager from '../components/ProfileManager';
import { useUser } from '../contexts/UserContext';

const Dashboard = () => {
  const { currentUser } = useUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome, {currentUser?.name}</h1>
          <UserMap />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProfileManager />
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Active Users</h2>
            {/* Active users list component could go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;