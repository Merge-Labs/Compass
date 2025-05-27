import React from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Shield, Users, BarChart3, Settings, LogOut } from 'lucide-react';

export const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Super Admin Dashboard</h1>
            <p className="text-purple-200">Welcome back, {user?.full_name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">1,234</p>
              </div>
              <Users className="text-purple-400" size={40} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Active Grants</p>
                <p className="text-3xl font-bold text-white">456</p>
              </div>
              <BarChart3 className="text-blue-400" size={40} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">System Health</p>
                <p className="text-3xl font-bold text-green-400">98%</p>
              </div>
              <Shield className="text-green-400" size={40} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Configurations</p>
                <p className="text-3xl font-bold text-white">12</p>
              </div>
              <Settings className="text-orange-400" size={40} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">System Overview</h2>
          <p className="text-purple-200">
            As a Super Admin, you have complete access to all system functions and can manage all aspects of the platform.
          </p>
        </div>
      </div>
    </div>
  );
};

