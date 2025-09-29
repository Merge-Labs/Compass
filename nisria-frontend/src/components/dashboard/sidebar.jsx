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
  Settings,
  WavesLadder,
  ArchiveX,
  ChevronRight,
} from 'lucide-react';

const Sidebar = ({ isSmMenuOpen, toggleSmMenu, onNavigate, activeSection }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isHoveredForMd, setIsHoveredForMd] = useState(false);
  const [isMdScreen, setIsMdScreen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023.98px)');
    const handleChange = (event) => {
      setIsMdScreen(event.matches);
      if (!event.matches) {
        setIsHoveredForMd(false);
      }
    };
    
    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleItemClick = (label) => {
    setActiveItem(label);
    if (onNavigate) onNavigate(label);
    if (isSmMenuOpen && toggleSmMenu) {
      toggleSmMenu(false);
    }
  };

  const showLabelClass = `
    ${isSmMenuOpen ? 'block' : 'hidden'}
    ${isHoveredForMd && isMdScreen ? 'md:block' : 'md:hidden'}
    lg:block
  `;

  const isCollapsed = !isSmMenuOpen && (!isHoveredForMd || !isMdScreen);

  // Group menu items based on user role
  const getMenuGroups = () => {
    const baseGroups = [
      {
        items: [
          { icon: LayoutDashboard, label: 'Dashboard', badge: null },
          { icon: WavesLadder, label: 'Programs', badge: null },
      
          { icon: FileText, label: 'Grants', badge: '3' },
          { icon: FolderOpen, label: 'Documents', badge: null },
          { icon: CheckSquare, label: 'Tasks', badge: '12' },
     
          { icon: Bell, label: 'Notifications', badge: '5' },
        ]
      }
    ];

    // Add admin-specific items
    if (user?.role === 'super_admin') {
      baseGroups.push({
        title: 'Administration',
        items: [
          { icon: Users, label: 'Team', badge: null },
          { icon: ArchiveX, label: 'Bin', badge: null },
        ]
      });
    }

    return baseGroups;
  };

  const menuGroups = getMenuGroups();

  return (
    <>
      {/* Enhanced Overlay */}
      {isSmMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-md md:hidden transition-all duration-300" 
          onClick={() => toggleSmMenu && toggleSmMenu(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col
          transition-all duration-300 ease-out
          ${theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700' 
            : 'bg-gradient-to-br from-slate-50 via-blue-50 to-white border-r border-slate-200'
          }
          shadow-xl relative overflow-hidden
          
          ${isSmMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'} 
          
          md:translate-x-0 md:shadow-lg
          md:relative md:inset-auto 
          ${isHoveredForMd && isMdScreen ? 'md:w-72' : 'md:w-20'}
          lg:w-72 
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
          setHoveredItem(null);
        }}
      >
        {/* Background decorations */}
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-blue-900/10 to-transparent' 
            : 'bg-gradient-to-br from-blue-500/5 to-transparent'
        }`} />
        <div className={`absolute top-0 right-0 w-32 h-32 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-400/5 to-transparent'
            : 'bg-gradient-to-br from-blue-400/10 to-transparent'
        } rounded-full blur-xl`} />

        {/* Scrollable content */}
        <div className={`relative z-10 h-full flex flex-col px-4 pt-4 pb-6
          ${isHoveredForMd && isMdScreen ? '' : 'md:items-center'} lg:items-stretch
        `}>
          {/* Logo Section */}
          <div className={`mb-8 flex items-center justify-center p-4 backdrop-blur-sm rounded-xl shadow-sm border ${
            theme === 'dark'
              ? 'border-slate-700/50 bg-slate-800/30'
              : 'border-white/50 bg-white/30'
          } ${isHoveredForMd && isMdScreen ? 'md:p-4' : 'md:p-2'} lg:p-4`}>
            <div className={`flex items-center gap-3 ${
              isHoveredForMd && isMdScreen ? 'md:flex-row' : 'md:flex-col md:gap-1'
            } lg:flex-row lg:gap-3`}>
              <div className="w-12 h-12 md:w-8 md:h-8 lg:w-12 lg:h-12 shrink-0">
                <img 
                  src="/logo/compass-logo.png" 
                  alt="Dira logo" 
                  className="object-contain w-full h-full filter drop-shadow-sm" 
                />
              </div>
              <div className={`
                font-bold text-xl tracking-tight
                ${theme === 'dark' ? 'text-white' : 'text-slate-800'}
                ${showLabelClass}
              `}>
                <span className="text-red-500">D</span>ira
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          <nav className={`flex-1 overflow-y-auto scroll-hide pr-1 space-y-6
            ${isHoveredForMd && isMdScreen ? 'md:space-y-6' : 'md:space-y-4'} lg:space-y-6
          `}>
            {menuGroups.map((group) => (
              <div key={group.title} className="space-y-2">
                {/* Group Title */}
                <h4 className={`
                  font-semibold text-sm uppercase tracking-wider px-3 py-2 rounded-lg backdrop-blur-sm border
                  ${theme === 'dark'
                    ? 'text-slate-300 bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-slate-600/50'
                    : 'text-slate-600 bg-gradient-to-r from-slate-100/80 to-blue-50/80 border-slate-200/50'
                  }
                  ${showLabelClass}
                `}>
                  {group.title}
                </h4>
                
                {/* Group Items */}
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = (activeSection || activeItem) === item.label;
                    const isHovered = hoveredItem === item.label;
                    
                    return (
                      <li key={item.label}>
                        <button
                          onClick={() => handleItemClick(item.label)}
                          onMouseEnter={() => setHoveredItem(item.label)}
                          onMouseLeave={() => setHoveredItem(null)}
                          title={item.label} 
                          className={`group relative w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-300 ease-out overflow-hidden
                            ${isHoveredForMd && isMdScreen ? '' : 'md:justify-center'} lg:justify-start
                            ${isActive
                              ? theme === 'dark'
                                ? 'text-white scale-[1.02] shadow-lg shadow-blue-500/20'
                                : 'text-white scale-[1.02] shadow-lg shadow-blue-500/20'
                              : theme === 'dark'
                              ? 'text-slate-400 hover:text-white'
                              : 'text-slate-700 hover:text-white'
                            }
                            ${isHovered && !isActive ? 'scale-[1.02] shadow-md' : ''}
                          `}
                        >
                          {/* Background gradient */}
                          <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-400 to-blue-500 opacity-100'
                              : 'bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100'
                          }`} />
                          
                          {/* Content */}
                          <div className="relative z-10 flex items-center w-full">
                            <IconComponent 
                              size={20} 
                              className={`shrink-0 transition-all duration-300 ${
                                isHovered || isActive ? 'scale-110' : ''
                              }`}
                            />
                            
                            <span className={`ml-3 font-medium text-sm whitespace-nowrap ${showLabelClass}`}>
                              {item.label}
                            </span>
                            
                            {/* Badge */}
                            {item.badge && (
                              <div className={`ml-auto shrink-0 ${showLabelClass}`}>
                                <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-300 ${
                                  isActive || isHovered
                                    ? 'bg-white/20 text-white'
                                    : theme === 'dark'
                                    ? 'bg-slate-700 text-slate-300'
                                    : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {item.badge}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Subtle border */}
                          <div className={`absolute inset-0 rounded-xl border transition-colors duration-300 ${
                            isActive || isHovered
                              ? 'border-transparent'
                              : theme === 'dark'
                              ? 'border-slate-700/50'
                              : 'border-slate-200/50'
                          }`} />
                          
                          {/* Arrow indicator for collapsed state */}
                          {isCollapsed && isHovered && (
                            <ChevronRight 
                              size={16} 
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-current md:block lg:hidden z-20" 
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Settings Button */}
          <button
            type="button"
            title="Settings"
            onClick={() => handleItemClick('Settings')}
            className={`w-full flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 group border
              ${isHoveredForMd && isMdScreen ? '' : 'md:justify-center'} lg:justify-start
              ${theme === 'dark'
                ? 'text-slate-400 hover:text-white hover:bg-slate-700 border-slate-600 hover:border-slate-500'
                : 'text-slate-600 hover:text-white hover:bg-blue-500 border-slate-300 hover:border-blue-500'
              }
            `}
          >
            <Settings size={20} className="group-hover:scale-110 transition-transform duration-300 shrink-0" />
            <span className={`ml-3 font-medium text-sm ${showLabelClass}`}>
              Settings
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;