import React, { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Shield, Users, BarChart3, Settings, LogOut, Menu as MenuIcon } from 'lucide-react'; // Added MenuIcon
import { useTheme } from '../../context/ThemeProvider';
import Sidebar from '../../components/dashboard/sidebar'; // Import the Sidebar component

export const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [isSmSidebarOpen, setIsSmSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleSmSidebar = () => {
    setIsSmSidebarOpen(!isSmSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden"> {/* Added overflow-hidden to parent */}
      <Sidebar isSmMenuOpen={isSmSidebarOpen} toggleSmMenu={setIsSmSidebarOpen} />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out ${
        theme === 'light' 
          ? 'bg-gray-50' 
          : 'bg-black/95' // Changed to match sidebar dark mode
      }
        ${isSmSidebarOpen ? 'blur-sm md:blur-none pointer-events-none md:pointer-events-auto' : ''}
      `}>
        {/* Sticky Header for Main Content (includes Hamburger) */}
        <header className={`sticky top-0 z-20 p-4 md:px-6 flex justify-between items-center
          ${theme === 'light' ? 'bg-white/80 backdrop-blur-md border-b border-gray-200' : 'bg-black/70 backdrop-blur-md border-b border-slate-800'}
          md:border-none md:bg-transparent md:backdrop-blur-none 
        `}>
          <button 
            onClick={toggleSmSidebar}
            className={`p-2 rounded-md md:hidden ${theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 hover:bg-slate-700'}`}
            aria-label="Open sidebar"
          >
            <MenuIcon size={24} />
          </button>
          
          {/* Spacer to push logout button to the right on MD+ when hamburger is hidden */}
          <div className="hidden md:block flex-grow"></div>

          <div className="flex items-center space-x-3">
            {/* ThemeToggle is in Sidebar */}
            <button
              onClick={handleLogout}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                theme === 'light' 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="flex-1 p-4 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                Super Admin Dashboard
              </h1>
              <p className={`${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                Welcome back, {user?.full_name || 'Admin'}
              </p>
            </div>
            {/* Logout button moved to the sticky header */}
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
        </main>
      </div>
    </div>
  );
};
