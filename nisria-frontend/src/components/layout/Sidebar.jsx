import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { 
  HomeOutlined, 
  DashboardOutlined, 
  UserOutlined, 
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsedWidth, setCollapsedWidth] = useState(80);
  const [isTabletLandscape, setIsTabletLandscape] = useState(false);
  const sidebarRef = useRef(null);

  // Check if we're on a tablet in landscape mode
  const checkTabletLandscape = () => {
    const isLandscape = window.innerWidth > window.innerHeight && 
                       window.innerWidth >= 1180 && 
                       window.innerWidth <= 1366 && 
                       window.innerHeight <= 1024;
    setIsTabletLandscape(isLandscape);
    return isLandscape;
  };

  useEffect(() => {
    const handleResize = () => {
      const isLandscape = checkTabletLandscape();
      
      // On tablet landscape, we want to hide the sidebar by default
      if (isLandscape) {
        document.body.classList.add('tablet-landscape');
        setCollapsedWidth(0);
        if (!collapsed) onCollapse(true);
      } else {
        document.body.classList.remove('tablet-landscape');
        setCollapsedWidth(window.innerWidth < 768 ? 0 : 80);
      }
    };

    // Initial check
    handleResize();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.classList.remove('tablet-landscape');
    };
  }, [collapsed, onCollapse]);

  // Toggle sidebar with special handling for tablet landscape
  const toggleSidebar = () => {
    if (isTabletLandscape) {
      // In landscape mode, show the sidebar as an overlay
      const newCollapsed = !collapsed;
      onCollapse(newCollapsed);
      
      // Add/remove no-scroll class to body when sidebar is open/closed
      if (newCollapsed) {
        document.body.classList.remove('sidebar-open');
      } else {
        document.body.classList.add('sidebar-open');
      }
    } else {
      // Default behavior for other modes
      onCollapse(!collapsed);
    }
  };

  // Close sidebar when clicking outside on tablet landscape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isTabletLandscape && 
        !collapsed && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('.ant-layout-sider-trigger')
      ) {
        onCollapse(true);
        document.body.classList.remove('sidebar-open');
      }
    };

    if (isTabletLandscape && !collapsed) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('sidebar-open');
    };
  }, [isTabletLandscape, collapsed, onCollapse]);

  // Close sidebar when a menu item is clicked on tablet landscape
  const handleMenuClick = () => {
    if (isTabletLandscape) {
      onCollapse(true);
      document.body.classList.remove('sidebar-open');
    }
  };

  return (
    <>
      <Sider 
        ref={sidebarRef}
        collapsible 
        collapsed={collapsed} 
        onCollapse={onCollapse}
        collapsedWidth={collapsedWidth}
        width={250}
        className={`sidebar transition-all duration-200 ${isTabletLandscape ? 'tablet-landscape' : ''} ${!collapsed ? 'sidebar-expanded' : ''}`}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          boxShadow: isTabletLandscape && !collapsed ? '2px 0 10px rgba(0, 0, 0, 0.3)' : 'none',
          transform: isTabletLandscape && collapsed ? 'translateX(-100%)' : 'none',
          transition: 'transform 0.2s ease, width 0.2s',
        }}
        trigger={null}
      >
        <div className="flex items-center justify-between h-16 bg-white dark:bg-gray-800 px-4">
          {!collapsed ? (
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Compass</h1>
          ) : (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
          )}
          
          {isTabletLandscape && !collapsed && (
            <Button
              type="text"
              icon={<CloseOutlined className="text-white" />}
              onClick={toggleSidebar}
              className="md:hidden"
            />
          )}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          className="pt-4"
          onClick={handleMenuClick}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/profile" icon={<UserOutlined />}>
            <Link to="/profile">Profile</Link>
          </Menu.Item>
          <Menu.Item key="/settings" icon={<SettingOutlined />}>
            <Link to="/settings">Settings</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      
      {/* Toggle button for mobile/tablet */}
      {isTabletLandscape && (
        <div 
          className="fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-lg cursor-pointer md:hidden"
          onClick={toggleSidebar}
          style={{
            transition: 'transform 0.2s',
            transform: `translateX(${collapsed ? '0' : '250px'})`
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      )}
    </>
  );
};

export default Sidebar;
