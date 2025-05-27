import React from 'react';
import { useAuth } from '../../context/AuthProvider';
import { BarChart3, CheckCircle, Clock, LogOut } from 'lucide-react';

export const ManagementLeadDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Management Lead Dashboard</h1>
            <p className="text-orange-200">Welcome back, {user?.full_name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">Team Performance</p>
                <p className="text-3xl font-bold text-white">94%</p>
              </div>
              <BarChart3 className="text-orange-400" size={40} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">Approved Grants</p>
                <p className="text-3xl font-bold text-white">127</p>
              </div>
              <CheckCircle className="text-green-400" size={40} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">Pending Reviews</p>
                <p className="text-3xl font-bold text-white">23</p>
              </div>
              <Clock className="text-yellow-400" size={40} />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Management Overview</h2>
          <p className="text-orange-200">
            Oversee team performance, approve grants, and manage strategic initiatives.
          </p>
        </div>
      </div>
    </div>
  );
};
