import React from 'react';
import { useAuth } from '../../context/AuthProvider';
import { FileText, Clock, CheckCircle2, LogOut } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle'; 
import { useTheme } from '../../context/ThemeProvider';

export const GrantOfficerDashboard = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

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
              Grant Officer Dashboard
            </h1>
            <p className={`${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
              Welcome back, {user?.full_name || 'Officer'}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Applications */}
          <div className={`rounded-xl p-6 shadow-lg transition-all duration-300 ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-800/70 backdrop-blur-md border border-slate-700'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Applications</p>
                <p className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>156</p>
              </div>
              <FileText className={`${theme === 'light' ? 'text-sky-500' : 'text-sky-400'}`} size={36} />
            </div>
          </div>

          {/* Card 2: In Progress */}
          <div className={`rounded-xl p-6 shadow-lg transition-all duration-300 ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-800/70 backdrop-blur-md border border-slate-700'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>In Progress</p>
                <p className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>34</p>
              </div>
              <Clock className={`${theme === 'light' ? 'text-amber-500' : 'text-amber-400'}`} size={36} />
            </div>
          </div>

          {/* Card 3: Processed */}
          <div className={`rounded-xl p-6 shadow-lg transition-all duration-300 ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-800/70 backdrop-blur-md border border-slate-700'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Processed</p>
                <p className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>89</p>
              </div>
              <CheckCircle2 className={`${theme === 'light' ? 'text-emerald-500' : 'text-emerald-400'}`} size={36} />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`rounded-xl p-6 shadow-lg transition-all duration-300 ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-800/70 backdrop-blur-md border border-slate-700'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>
            Grant Processing
          </h2>
          <p className={`${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
            Process grant applications, review documentation, and manage grant workflows.
          </p>
        </div>
      </div>
    </div>
  );
};
