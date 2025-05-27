import React from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Shield, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle'; // Assuming ThemeToggle is in components folder
import { useTheme } from '../../context/ThemeProvider';

export const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-slate-100 via-gray-100 to-stone-100' 
        : 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
              Super Admin Dashboard
            </h1>
            <p className={`${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
              Welcome back, {user?.full_name || 'Admin'}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                theme === 'light' 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Total Users */}
          <div className={`rounded-xl p-6 shadow-lg transition-all duration-300 ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-800/70 backdrop-blur-md border border-slate-700'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Total Users</p>
                <p className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>1,234</p>
              </div>
              <Users className={`${theme === 'light' ? 'text-blue-500' : 'text-blue-400'}`} size={36} />
            </div>
          </div>

          {/* Card 2: Active Grants */}
          <div className={`rounded-xl p-6 shadow-lg transition-all duration-300 ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-800/70 backdrop-blur-md border border-slate-700'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Active Grants</p>
                <p className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>456</p>
              </div>
              <BarChart3 className={`${theme === 'light' ? 'text-indigo-500' : 'text-indigo-400'}`} size={36} />
            </div>
          </div>

          {/* Card 3: System Health */}
          <div className={`rounded-xl p-6 shadow-lg transition-all duration-300 ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-800/70 backdrop-blur-md border border-slate-700'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>System Health</p>
                <p className={`text-3xl font-bold ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>98%</p>
              </div>
              <Shield className={`${theme === 'light' ? 'text-green-500' : 'text-green-400'}`} size={36} />
            </div>
          </div>

          {/* Card 4: Configurations */}
          <div className={`rounded-xl p-6 shadow-lg transition-all duration-300 ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-800/70 backdrop-blur-md border border-slate-700'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Configurations</p>
                <p className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>12</p>
              </div>
              <Settings className={`${theme === 'light' ? 'text-amber-500' : 'text-orange-400'}`} size={36} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`rounded-xl p-6 shadow-lg transition-all duration-300 ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-800/70 backdrop-blur-md border border-slate-700'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>
            System Overview
          </h2>
          <p className={`${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
            As a Super Admin, you have complete access to all system functions and can manage all aspects of the platform.
          </p>
        </div>
      </div>
    </div>
  );
};
