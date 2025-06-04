import React, { useState, useEffect } from 'react';
import { Trash2, Users, FileText, Award, Moon, Sun, Search, Filter, RotateCcw, X, Check, Calendar, User, Clock } from 'lucide-react';

const RecycleBin = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [sortBy, setSortBy] = useState('Date Deleted');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const [deletedItems] = useState([
    {
      id: 1,
      type: 'document',
      name: 'Report Draft',
      requestedBy: 'Emma Smith',
      daysAgo: 5,
      daysLeft: 25,
      status: 'Pending Approval',
      icon: FileText
    },
    {
      id: 2,
      type: 'user',
      name: 'Michael Johnson',
      requestedBy: 'Admin',
      daysAgo: 10,
      daysLeft: 20,
      status: 'Approve Deletion',
      icon: Users
    },
    {
      id: 3,
      type: 'grant',
      name: 'Community Initiative',
      requestedBy: 'Jane Doe',
      daysAgo: 18,
      daysLeft: 12,
      status: 'Approve Deletion',
      icon: Award
    },
    {
      id: 4,
      type: 'document',
      name: 'Budget Analysis Q3',
      requestedBy: 'Robert Chen',
      daysAgo: 2,
      daysLeft: 28,
      status: 'Pending Approval',
      icon: FileText
    },
    {
      id: 5,
      type: 'user',
      name: 'Sarah Williams',
      requestedBy: 'HR Team',
      daysAgo: 22,
      daysLeft: 8,
      status: 'Approve Deletion',
      icon: Users
    }
  ]);

  const tabs = [
    { name: 'All', icon: Trash2 },
    { name: 'Users', icon: Users },
    { name: 'Documents', icon: FileText },
    { name: 'Grants', icon: Award }
  ];

  const filteredItems = deletedItems.filter(item => {
    const matchesTab = activeTab === 'All' || 
      (activeTab === 'Users' && item.type === 'user') ||
      (activeTab === 'Documents' && item.type === 'document') ||
      (activeTab === 'Grants' && item.type === 'grant');
    
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status) => {
    if (status === 'Pending Approval') return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
  };

  const getDaysLeftColor = (days) => {
    if (days <= 7) return 'text-red-600 dark:text-red-400';
    if (days <= 14) return 'text-amber-600 dark:text-amber-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Trash2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recycle Bin</h1>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Tabs and Controls */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.name
                        ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>

              {/* Search and Sort */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Sort by: Date Deleted</option>
                  <option>Sort by: Name</option>
                  <option>Sort by: Type</option>
                  <option>Sort by: Days Left</option>
                </select>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          Deleted {item.type.charAt(0).toUpperCase() + item.type.slice(1)}: "{item.name}"
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Requested by {item.requestedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{item.daysAgo} days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getDaysLeftColor(item.daysLeft)}`}>
                        {item.daysLeft} days left
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Auto-delete
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Restore">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Permanently">
                        <X className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Approve Deletion">
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 rounded-b-xl border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Items are automatically deleted after 30 days</span>
              </div>
              <div>
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} in recycle bin
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecycleBin;