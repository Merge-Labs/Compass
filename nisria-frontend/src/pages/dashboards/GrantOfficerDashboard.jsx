import React from 'react';
import { useAuth } from '../../context/AuthProvider';
import { FileText, Clock, CheckCircle2, LogOut } from 'lucide-react';

export const GrantOfficerDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Grant Officer Dashboard</h1>
            <p className="text-blue-200">Welcome back, {user?.full_name}</p>
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
                <p className="text-blue-200 text-sm">Applications</p>
                <p className="text-3xl font-bold text-white">156</p>
              </div>
              <FileText className="text-blue-400" size={40} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-white">34</p>
              </div>
              <Clock className="text-yellow-400" size={40} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Processed</p>
                <p className="text-3xl font-bold text-white">89</p>
              </div>
              <CheckCircle2 className="text-green-400" size={40} />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Grant Processing</h2>
          <p className="text-blue-200">
            Process grant applications, review documentation, and manage grant workflows.
          </p>
        </div>
      </div>
    </div>
  );
};
