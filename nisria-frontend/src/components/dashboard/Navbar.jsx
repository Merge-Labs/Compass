import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, LogOut, Menu as MenuIcon, Bell } from 'lucide-react';
import api from '../../services/api'; // Import the configured Axios instance

const Navbar = ({ user, onLogout, onToggleSmSidebar, appTheme, appName = "Nisria's Compass" }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState(null);

  const categories = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'tasks', label: 'Tasks' },
    { value: 'documents', label: 'Documents' },
    { value: 'programs', label: 'Programs' },
    { value: 'users', label: 'Users' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'templates', label: 'Templates' }
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
    setIsSearchOpen(false);
    // Implement your search logic here
  };

  // --- Notifications Logic ---
  const fetchNotifications = async () => {
    const token = localStorage.getItem('access_token'); // Check token from localStorage

    if (!token) {
      setNotificationError("Authentication token not found. Please login again.");
      setIsLoadingNotifications(false);
      return;
    }
    setIsLoadingNotifications(true);
    setNotificationError(null);
    try {
      
      const response = await api.get('/api/notifications/');
      const data = response.data; // Axios nests response data under 'data'

      // Check if the response is paginated and has a 'results' array
      if (data && Array.isArray(data.results)) {
        // Sort by created_at descending to get latest first
        const sortedNotifications = data.results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setNotifications(sortedNotifications);
      } else if (Array.isArray(data)) { // Fallback for non-paginated array response
        const sortedNotifications = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setNotifications(sortedNotifications);
      } else {
        // Log the actual data structure if it's not an array
        console.error("API response for notifications is not an array. Received:", data);
        setNotificationError("Received an unexpected format for notifications. Please check console.");
        setNotifications([]); // Clear or handle as appropriate
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Axios errors often have more specific messages in error.response.data
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || "An unexpected error occurred.";
      setNotificationError(errorMessage);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleNotificationsDropdown = () => {
    const willBeOpen = !isNotificationsOpen;
    setIsNotificationsOpen(willBeOpen);
    if (willBeOpen) {
      fetchNotifications(); // Fetch fresh notifications when opening
    }
  };

  const formatNotificationDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
      });
    } catch (e) {
      console.error(e);
      return dateString; // fallback to original string if date is invalid
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read_status).length;
  // --- End Notifications Logic ---

  return (
    <nav className={`w-full px-6 py-4 border-b transition-colors duration-200 ${
      appTheme === 'dark'
        ? 'bg-black/95 border-gray-800' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center max-md:space-x-10">
          {/* Hamburger Menu for small screens */}
          {onToggleSmSidebar && (
            <button
              onClick={onToggleSmSidebar}
              className={`p-2 rounded-md md:hidden mr-3 ${
                appTheme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 hover:bg-slate-700'
              }`}
              aria-label="Open sidebar"
            >
              <MenuIcon size={24} />
            </button>
          )}

          {/* Left side - User info and date */}
          <div className="flex flex-col space-y-1 max-md:mx-auto">
            <div className={`text-lg font-semibold ${
              appTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Hey, {user?.full_name || 'User'}
            </div>
            <div className={`max-md:hidden text-sm ${
              appTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Welcome to {appName}
            </div>
          </div>
        </div>

        {/* Right side - Search and buttons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search Section */}
          <div className="relative">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                appTheme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
              <ChevronDown size={14} />
            </button>

            {/* Search Dropdown */}
            {isSearchOpen && (
              <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg border z-50 ${
                appTheme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="p-4">
                  {/* Category Selection */}
                  <div className="mb-3">
                    <label className={`block text-xs font-medium mb-2 ${
                      appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`w-full px-3 py-2 text-sm rounded-md border transition-colors ${
                        appTheme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Search Input */}
                  <div className="mb-3">
                    <label className={`block text-xs font-medium mb-2 ${
                      appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Search Query
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter search terms..."
                      className={`w-full px-3 py-2 text-sm rounded-md border transition-colors ${
                        appTheme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                  </div>

                  {/* Search Button */}
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Search
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Icon & Dropdown */}
          <div className="relative">
            <button
              onClick={toggleNotificationsDropdown}
              className={`p-2 rounded-lg border relative transition-colors ${
                appTheme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              aria-label="View notifications"
            >
              <Bell size={20} />
              {unreadNotificationsCount > 0 && (
                <span className={`absolute top-0 right-0 block h-2.5 w-2.5 transform translate-x-1/3 -translate-y-1/3 rounded-full ring-2 ${appTheme === 'dark' ? 'ring-gray-800' : 'ring-white'} bg-red-500`}></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div
                className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-lg shadow-xl border z-50 overflow-hidden ${
                  appTheme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className={`p-3 border-b ${appTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`text-sm font-semibold ${appTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    Notifications
                  </h3>
                </div>
                {isLoadingNotifications && (
                  <div className={`p-4 text-center text-sm ${appTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</div>
                )}
                {notificationError && (
                  <div className={`p-4 text-center text-sm text-red-500`}>{notificationError}</div>
                )}
                {!isLoadingNotifications && !notificationError && notifications.length === 0 && (
                  <div className={`p-4 text-center text-sm ${appTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No new notifications.</div>
                )}
                {!isLoadingNotifications && !notificationError && notifications.length > 0 && (
                  <ul className="max-h-96 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.slice(0, 3).map((notification) => (
                      <li key={notification.id} className={`p-3 transition-colors ${appTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-start space-x-2.5">
                          {!notification.read_status && (
                            <span className="mt-1.5 flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full" aria-label="Unread"></span>
                          )}
                          <div className={`flex-grow ${notification.read_status ? 'ml-[18px]' : ''}`}> {/* Ensure alignment if dot is not present */}
                            <p className={`text-sm font-medium ${appTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {notification.title}
                            </p>
                            <p className={`text-xs mt-0.5 line-clamp-2 ${appTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                            {notification.assigner_full_name && (
                              <p className={`text-xs mt-0.5 ${appTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                From: {notification.assigner_full_name}
                              </p>
                            )}
                            <div className="flex justify-between items-center mt-1">
                              <p className={`text-xs ${appTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                {formatNotificationDate(notification.created_at)}
                              </p>
                              {notification.link && (
                                <a
                                  href={notification.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-500 hover:underline"
                                >
                                  View
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                appTheme === 'dark'
                  ? 'bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/30'
                  : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
              }`}>
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Click outside to close search */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      {/* Click outside to close notifications dropdown */}
      {isNotificationsOpen && (
        <div
          className="fixed inset-0 z-40" // Ensure this is below the dropdown (z-50)
          onClick={() => setIsNotificationsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;