import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useTheme } from "../../context/ThemeProvider";
import DashboardSection from "../../sections/dashboard/DashboardSection";
import GrantsSection from "../../sections/GrantsSection";
import Sidebar from "../../components/dashboard/sidebar";
import Navbar from "../../components/dashboard/Navbar";
import { Loader2 } from "lucide-react"; 

const SECTION_COMPONENTS = {
  Dashboard: DashboardSection,
  Grants: GrantsSection,

  // Add more mappings as you add more sections
};

export const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [isSmSidebarOpen, setIsSmSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading (replace with your real loading logic if needed)
  useEffect(() => {
    if (user && theme) {
      setIsLoading(false);
    }
  }, [user, theme]);


  // Dynamically select the section component
  const SectionComponent =
    SECTION_COMPONENTS[activeSection] || DashboardSection;

  // Pass a handler to Sidebar to update the section
  const handleSidebarNav = (section) => setActiveSection(section);

  const handleLogout = async () => {
    await logout();
  };

    if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-p1 dark:text-p2" />
        <span className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-200">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {" "}
      {/* Added overflow-hidden to parent */}
      <Sidebar
        isSmMenuOpen={isSmSidebarOpen}
        toggleSmMenu={setIsSmSidebarOpen}
        onNavigate={handleSidebarNav}
        activeSection={activeSection}
      />
      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out ${
          theme === "light" ? "bg-gray-50" : "bg-black/95" 
        }
        ${
          isSmSidebarOpen
            ? "blur-sm md:blur-none pointer-events-none md:pointer-events-auto"
            : ""
        }
      `}
      >
        {/* Sticky Navbar replacing old header */}
        <div className="sticky top-0 z-20">
          {" "}
          {/* Wrapper to ensure stickiness and z-index */}
          <Navbar
            user={user}
            onLogout={handleLogout}
            appTheme={theme}
            onToggleSmSidebar={() => setIsSmSidebarOpen((v) => !v)}
            appName="Nisria's Compass" 
          />
        </div>
        <main className="flex-1">
          <SectionComponent />
        </main>
      </div>
    </div>
  );
};
