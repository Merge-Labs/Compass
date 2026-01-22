import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useTheme } from "../../context/ThemeProvider";
import DashboardSection from "../../sections/dashboard/DashboardSection";
import GrantsDashboard from "../../sections/grants/GrantsSection";
import ProgramsDashboard from "../../sections/programs/ProgramsDashboard";
import Sidebar from "../../components/dashboard/sidebar";
import Navbar from "../../components/dashboard/Navbar";
import TasksSection from "../../sections/tasks/TasksSection";
import DocumentsPage from "../../sections/documents/DocumentsPage";
import Team from '../../sections/team/Team';
import Settings from "../../sections/settings/Settings";
import NotificationsPage from "../../sections/notifications/NotificationsPage";
import RecycleBin from "../../sections/bin/RecycleBin";
import { Loader2, Menu } from "lucide-react";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import "../../styles/dashboard.css";
import { useMediaQuery } from "react-responsive";

const SECTION_COMPONENTS = {
  dashboard: DashboardSection,
  grants: GrantsDashboard,
  programs: ProgramsDashboard,
  documents: DocumentsPage,
  team: Team,
  tasks: TasksSection,
  settings: Settings,
  notifications: NotificationsPage,
  bin: RecycleBin
  // Add more mappings as you add more sections
};

const DEFAULT_SECTION = "dashboard";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isTabletLandscape = useMediaQuery({
    query: '(min-width: 1180px) and (max-height: 1024px) and (orientation: landscape)'
  });
  const isMobile = useMediaQuery({ maxWidth: 991 });

  const navigate = useNavigate();
  const location = useLocation();

  // Get section from URL: /dashboard/compass/:section
  const section = location.pathname.split("/")[3] || DEFAULT_SECTION;
  const SectionComponent = SECTION_COMPONENTS[section] || DashboardSection;

  useEffect(() => {
    if (user && theme) setIsLoading(false);
    
    // Close mobile menu when navigating
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [user, theme, location.pathname]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sidebar navigation handler
  const handleSidebarNav = (sectionLabel) => {
    navigate(`/dashboard/compass/${sectionLabel.toLowerCase()}`);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="glass-surface rounded-2xl px-6 py-4">
          <Loader2 className="w-12 h-12 animate-spin text-p1" />
        </div>
        <span className="mt-4 text-lg font-medium text-gray-800">Loading dashboard...</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="glass-surface rounded-2xl px-6 py-4">
          <Loader2 className="w-12 h-12 animate-spin text-p1" />
        </div>
        <span className="mt-4 text-lg font-medium text-gray-800">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Mobile menu toggle button */}
      <button 
        className="sidebar-toggle md:hidden" 
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>
      
      {/* Sidebar */}
      <div 
        className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'open' : ''}`}
        style={{
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
          color: theme === 'dark' ? '#fff' : '#333'
        }}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          onNavigate={handleSidebarNav}
          activeSection={section.charAt(0).toUpperCase() + section.slice(1)}
        />
      </div>
      
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay visible md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Main content */}
      <div className="dashboard-content">
        <Navbar
          user={user}
          onLogout={handleLogout}
          appTheme={theme}
          onToggleSidebar={toggleSidebar}
          appName="Nisria's Compass"
        />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardSection />} />
            <Route path="grants/*" element={<GrantsDashboard />} />
            <Route path="programs/*" element={<ProgramsDashboard />} />
            <Route path="documents/*" element={<DocumentsPage />} />
            <Route path="team/*" element={<Team />} />
            <Route path="tasks/*" element={<TasksSection />} />
            <Route path="settings/*" element={<Settings />} />
            <Route path="notifications/*" element={<NotificationsPage />} />
            <Route path="bin/*" element={<RecycleBin />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;