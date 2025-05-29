import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { useAuth } from '../../context/AuthProvider';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  CheckSquare, 
  Bell, 
  Users, 
  File,
  Moon,
  Sun,
  Settings,
  WavesLadder,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ isSmMenuOpen, toggleSmMenu, onNavigate, activeSection }) => {
  const { theme, toggleTheme: globalToggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isHoveredForMd, setIsHoveredForMd] = useState(false);
  const [isMdScreen, setIsMdScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023.98px)');
    const handleChange = (event) => {
      setIsMdScreen(event.matches);
      if (!event.matches) { // If not MD screen, reset hover state
        setIsHoveredForMd(false);
      }
    };
    
    handleChange(mediaQuery); // Initial check
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const initialMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: WavesLadder, label: 'Programs' },
    { icon: FileText, label: 'Grants' },
    { icon: FolderOpen, label: 'Documents' },
    { icon: CheckSquare, label: 'Tasks' },
    { icon: Bell, label: 'Notifications' },
    { icon: File, label: 'Templates' },
  ];

  const menuItems = [...initialMenuItems];

  // Conditionally add "Users" item for super_admin
  if (user?.role === 'super_admin') {
    const usersItem = { icon: Users, label: 'Users' };
    // Insert "Users" after "Notifications" or before "Templates"
    const notificationsIndex = menuItems.findIndex(item => item.label === 'Notifications');
    if (notificationsIndex !== -1) {
      menuItems.splice(notificationsIndex + 1, 0, usersItem);
    } else {
      // Fallback: if "Notifications" is not found, try to insert before "Templates"
      const templatesIndex = menuItems.findIndex(item => item.label === 'Templates');
      if (templatesIndex !== -1) {
        menuItems.splice(templatesIndex, 0, usersItem);
      } else {
        menuItems.push(usersItem); // Add to end as last resort
      }
    }
  }

  const handleItemClick = (label) => {
    setActiveItem(label);
    if (onNavigate) onNavigate(label);
    if (isSmMenuOpen && toggleSmMenu) { // Close mobile menu on item click
      toggleSmMenu(false); // Assuming toggleSmMenu(false) closes it
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string' || name.trim() === '') return 'U';
    const names = name.trim().split(/\s+/);
    if (names.length === 1) return names[0].substring(0, Math.min(2, names[0].length)).toUpperCase();
    return (names[0][0] + (names.length > 1 ? names[names.length - 1][0] : '')).toUpperCase();
  };

  const formatRole = (role) => {
    if (!role || typeof role !== 'string') return 'User Role';
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Define showLabelClass in the component scope
  const showLabelClass = `
    ${isSmMenuOpen ? 'block' : 'hidden'} /* Base for xs/sm: show if menu open, else hide */
    ${isHoveredForMd && isMdScreen ? 
      'md:block' : 
      'md:hidden'} /* MD: show if hovered, else hide */
    lg:block /* LG+: always show */
  `;

  return (
    <>
      {/* Overlay for small screens when menu is open */}
      {isSmMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden" 
          onClick={() => toggleSmMenu && toggleSmMenu(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col
          transition-all duration-300 ease-in-out
          ${theme === 'dark' ? 'bg-black border-r border-p2' : 'bg-white border-r border-gray-200'}
          
          ${isSmMenuOpen ? 'translate-x-0 w-64 shadow-xl' : '-translate-x-full w-64'} 
          
          md:translate-x-0 md:shadow-none
          md:relative md:inset-auto 
          ${isHoveredForMd && isMdScreen ? 'md:w-64' : 'md:w-20'}
          lg:w-64 
        `}
        onMouseEnter={() => {
          if (isMdScreen) {
            setIsHoveredForMd(true);
          }
        }}
        onMouseLeave={() => {
          if (isMdScreen) {
            setIsHoveredForMd(false);
          }
        }}
      >
        {/* Scrollable content within the sidebar */}
        <div className={`h-full flex flex-col overflow-y-auto 
          ${isHoveredForMd && isMdScreen ? '' : 'md:items-center'} lg:items-stretch
        `}>
          {/* Header Section */}
          <div className={`p-4 border-b shrink-0
            ${theme === 'dark' ? 'border-p2' : 'border-gray-200'}
            ${isHoveredForMd && isMdScreen ? 'md:p-6' : 'md:p-3 md:py-4'} lg:p-6
          `}>
            {/* Logo and Title */}
            <div className={`flex items-center gap-2 mb-4 pb-2 
              ${isHoveredForMd && isMdScreen ? 'md:pl-2' : 'md:justify-center md:pl-0'} lg:pl-2 lg:justify-start
            `}>
              <div className="w-12 h-12 md:w-10 md:h-10 lg:w-16 lg:h-16 shrink-0">
                <img src="/logo/compass-logo.png" alt="Compass logo" className="object-contain w-full h-full" />
              </div>
              <div className={`
                font-bold text-lg 
                ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                ${showLabelClass}
              `}>
                Compass
              </div>
            </div>

            {/* Profile Section */}
            <div className={`flex items-center gap-3 pt-2 lg:pl-4 cursor-pointer
              ${isHoveredForMd && isMdScreen ? 'md:justify-start' : 'md:flex-col md:items-center md:gap-1'} 
              lg:flex-col lg:justify-start lg:items-start lg:gap-3
            `}>
              {user?.profile_picture_url ? (
                <img 
                  src={user.profile_picture_url} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover shrink-0 
                             md:w-8 md:h-8 lg:w-10 lg:h-10"
                />
              ) : (
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-p2 to-p5 flex items-center justify-center shrink-0
                                 md:w-8 md:h-8 lg:w-10 lg:h-10`}>
                  <span className={`text-white font-medium text-sm
                                    md:text-xs lg:text-sm`}>
                    {getInitials(user?.full_name)}
                  </span>
                </div>
              )}
              <div className={`
                text-left
                ${showLabelClass}
                ${isHoveredForMd && isMdScreen ? 'md:text-left' : ''} `}>
                <p className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user?.full_name || 'User Name'}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatRole(user?.role) || 'User Role'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className={`flex-1 p-4 pt-6 
            ${isHoveredForMd && isMdScreen ? 'md:p-4 md:pt-6' : 'md:p-2 md:pt-4'} lg:p-4 lg:pt-10
          `}>
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = (activeSection || activeItem) === item.label;
            
            return (
              <li key={index}>
                <button
                  onClick={() => handleItemClick(item.label)}
                  title={item.label} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group hover:cursor-pointer
                    ${isHoveredForMd && isMdScreen ? '' : 'md:justify-center'} lg:justify-start
                    ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-p1/20 to-p2/20 text-white border border-p1/30'
                        : 'bg-gradient-to-r from-p1/10 to-p2/10 text-p1 border border-p1/20'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-s3'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent 
                    size={18} 
                    className={`shrink-0 transition-colors ${
                      isActive 
                        ? theme === 'dark' 
                          ? 'text-p1' 
                          : 'text-p2'
                        : ''
                    }`}
                  />
                  <span className={`font-medium text-sm whitespace-nowrap ${showLabelClass}`}>{item.label}</span>
                  {isActive && (
                     <div className={`ml-auto w-2 h-2 rounded-full shrink-0 ${
                      theme === 'dark' ? 'bg-p1' : 'bg-p2'
                    } ${showLabelClass}`}></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className={`p-4 border-t shrink-0
            ${theme === 'dark' ? 'border-p2' : 'border-gray-200'}
            ${isHoveredForMd && isMdScreen ? 'md:p-4' : 'md:p-2 md:py-3'} lg:p-4
          `}>
            <div className={`flex flex-col space-y-2 
              ${isHoveredForMd && isMdScreen ? '' : 'md:items-center'} lg:items-stretch
            `}>
              {/* Settings Button */}
              <button 
                title="Settings"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 hover:cursor-pointer
                  ${isHoveredForMd && isMdScreen ? '' : 'md:justify-center'} lg:justify-start
                  ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-s3' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <Settings size={18} className="shrink-0" />
                <span className={`font-medium text-sm whitespace-nowrap ${showLabelClass}`}>Settings</span>
              </button>
              {/* Theme Toggle Button */}
              <button
                onClick={globalToggleTheme}
                title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 hover:cursor-pointer
                  ${isHoveredForMd && isMdScreen ? '' : 'md:justify-center'} lg:justify-start
                  ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-s3' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                {theme === 'dark' ? <Sun size={18} className="shrink-0" /> : <Moon size={18} className="shrink-0" />}
                <span className={`font-medium text-sm whitespace-nowrap ${showLabelClass}`}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              {/* logout Button */}
              <button 
                title="logout"
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 hover:cursor-pointer
                  ${isHoveredForMd && isMdScreen ? '' : 'md:justify-center'} lg:justify-start
                  ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-s3' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <LogOut size={18} className="shrink-0" />
                <span className={`font-medium text-sm whitespace-nowrap ${showLabelClass}`}>LogOut</span>
              </button>
            </div>
          </div>
          </div>
    </div>
    </>
  );
};

export default Sidebar;