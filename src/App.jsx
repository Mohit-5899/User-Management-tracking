// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import { RealtimeProvider } from './contexts/RealtimeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <AnalyticsProvider>
            <RealtimeProvider>
              <div className="min-h-screen bg-gray-50">
              <Header />
              <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <div className="px-4 py-6 sm:px-0">
                          <div className="text-2xl font-bold mb-4">Welcome to UserTrack</div>
                          <p className="text-gray-600">
                            Navigate through the application using the links above. View your profile,
                            check analytics, or explore user engagement data.
                          </p>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
            </RealtimeProvider>
          </AnalyticsProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;