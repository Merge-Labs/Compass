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
import Team from '../../sections/team/Team'
import Settings from "../../sections/settings/Settings";
import NotificationsPage from "../../sections/notifications/NotificationsPage";
import RecycleBin from "../../sections/bin/RecycleBin"
import { Loader2 } from "lucide-react";
import bgImage from "/bg.jpg";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";

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
  const [isSmSidebarOpen, setIsSmSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Get section from URL: /dashboard/compass/:section
  const section = location.pathname.split("/")[3] || DEFAULT_SECTION;
  const SectionComponent = SECTION_COMPONENTS[section] || DashboardSection;

  useEffect(() => {
    if (user && theme) setIsLoading(false);
  }, [user, theme]);

  // Sidebar navigation handler
  const handleSidebarNav = (sectionLabel) => {
    navigate(`/dashboard/compass/${sectionLabel.toLowerCase()}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isSmMenuOpen={isSmSidebarOpen}
        toggleSmMenu={setIsSmSidebarOpen}
        onNavigate={handleSidebarNav}
        activeSection={section.charAt(0).toUpperCase() + section.slice(1)}
      />
      <div
        className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out
        ${
          isSmSidebarOpen
            ? "blur-sm md:blur-none pointer-events-none md:pointer-events-auto"
            : ""
        }
      `}
      >
        <div className="sticky top-0 z-20">
          <Navbar
            user={user}
            onLogout={handleLogout}
            appTheme={theme}
            onToggleSmSidebar={() => setIsSmSidebarOpen((v) => !v)}
            appName="Nisria's Compass"
          />
        </div>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardSection />} />
            <Route path="grants/*" element={<GrantsDashboard />} />
            {/* <Route path="grants/*" element={<Grants />} /> */}
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