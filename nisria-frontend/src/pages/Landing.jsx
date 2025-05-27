import React from 'react';
import { useAuth } from '../context/AuthProvider';
import { Link } from 'react-router-dom';

const Landing = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
      <h1 className="text-4xl font-bold text-white mb-4">Welcome to Nisria Grants Portal</h1>
      <p className="text-orange-200 mb-8">
        {isAuthenticated
          ? `You are logged in as ${user?.full_name || user?.email}.`
          : 'Please log in to access your dashboard.'}
      </p>
      {!isAuthenticated && (
        <Link
          to="/login"
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default Landing;