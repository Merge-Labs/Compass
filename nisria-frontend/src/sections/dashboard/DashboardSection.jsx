import React, { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  Briefcase,
  Mail,
  Award,
  FileText,
  LayoutGrid, // Added for the new card
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"; // Removed DashboardCard as we'll use GradientCard for the top section
import { DashboardCard, GradientCard } from "../../components/layout/card"; // Added GradientCard
import TasksSection from "../../components/dashboard/TasksSection";
import GrantsCalendar from "../../components/dashboard/GrantsCalendar";
import api from "../../services/api";

const DashboardSection = () => {
  // Define colors for the user roles pie chart for better distinction
  // Matching the colors used in DummyDashboard's mock deviceData for variety,
  // or you can define a new set.
  const PIE_COLORS = [
    "var(--color-p1)", // Red
    "var(--color-p2)", // Blue
    "var(--color-s3)", // Medium Blue
  ];
  
  const { theme } = useTheme();


  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);

  const [usersByRoleData, setUsersByRoleData] = useState([]);
  const [isLoadingUsersByRole, setIsLoadingUsersByRole] = useState(true);
  const [usersByRoleError, setUsersByRoleError] = useState(null);

  const [tasksData, setTasksData] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoadingAnalytics(true);
      setAnalyticsError(null);
      try {
        const response = await api.get("/api/analytics/");
        setAnalyticsData(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        const errorMessage =
          error.response?.data?.detail ||
          error.message ||
          "Could not load analytics data.";
        setAnalyticsError(errorMessage);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    const fetchUsersByRole = async () => {
      setIsLoadingUsersByRole(true);
      setUsersByRoleError(null);
      try {
        const response = await api.get("/api/analytics/users/by-role/");
        // Assuming the API returns an array like [{ role: "admin", count: 5 }, ...]
        const users = response.data;
        // Map roles to more readable names
        const mappedUsers = users.map(item => ({
          ...item,
          name: item.role
            .split('_') // Split by underscore
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
            .join(' ') // Join back with space
        }));
        setUsersByRoleData(mappedUsers);
      } catch (error) {
        console.error("Failed to fetch users by role data:", error);
        const errorMessage =
          error.response?.data?.detail ||
          error.message ||
          "Could not load users by role data.";
        setUsersByRoleError(errorMessage);
      } finally {
        setIsLoadingUsersByRole(false);
      }
    };

    const fetchTasks = async () => {
      setIsLoadingTasks(true);
      setTasksError(null);
      try {
        const response = await api.get("/api/tasks/");
        // Assuming the API returns an array directly, or a paginated response with a 'results' array
        const tasks = response.data.results || response.data;
        if (Array.isArray(tasks)) {
          setTasksData(tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))); // Sort by newest first
        } else {
          console.error("Tasks API response is not an array:", response.data);
          setTasksData([]);
        }
      } catch (error) {
        console.error("Failed to fetch tasks data:", error);
        setTasksError(error.response?.data?.detail || error.message || "Could not load tasks.");
      } finally {
        setIsLoadingTasks(false);
      }
    };

    fetchAnalytics();
    fetchUsersByRole();
    fetchTasks();
  }, []);

  return (
    <>
      {/* Scrollable Content Body */}
      <main className="flex-1 p-4 md:p-8">
        {isLoadingAnalytics && (
          <div className="flex justify-center items-center h-full">
            <Loader2
              className={`w-12 h-12 animate-spin ${
                theme === "light" ? "text-blue-600" : "text-blue-400"
              }`}
            />
          </div>
        )}

          {analyticsError && !isLoadingAnalytics && (
            <div
              className={`p-4 rounded-md ${
                theme === "light"
                  ? "bg-red-100 text-red-700"
                  : "bg-red-900/30 text-red-400"
              } flex items-center gap-3`}
            >
              <AlertTriangle size={24} />
              <div>
                <h3 className="font-semibold">Error loading dashboard data</h3>
                <p className="text-sm">{analyticsError}</p>
              </div>
            </div>
          )}

          {!isLoadingAnalytics && !analyticsError && analyticsData && (
            <>
              {/* Main Stats - First 3 cards with gradient backgrounds */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <GradientCard
                  title="Total Users"
                  value={
                    analyticsData.accounts?.total_users?.toString() || "N/A"
                  }
                  icon={Users}
                  gradient="bg-gradient-to-br from-cyan-400 to-blue-500"
                  changeType="up"
                  change="+3" // Dummy trend, represents the text next to the trend icon
                />
                <GradientCard
                  title="Total Programs"
                  value={
                    analyticsData.divisions_programs?.total_programs?.toString() ||
                    "N/A"
                  }
                  icon={Briefcase}
                  gradient="bg-gradient-to-br from-purple-400 to-purple-600"
                  changeType="up"
                  change="+1" // Dummy trend
                />
                <GradientCard
                  title="Email Templates"
                  value={
                    analyticsData.email_templates?.total_templates?.toString() ||
                    "N/A"
                  }
                  icon={Mail}
                  gradient="bg-gradient-to-br from-emerald-400 to-green-500"
                  // No change or changeType props if trend is not applicable
                />
                <GradientCard
                  title="Total Divisions"
                  value={
                    analyticsData.divisions_programs?.total_divisions?.toString() ||
                    "N/A"
                  }
                  icon={LayoutGrid} // Using LayoutGrid as an example, Briefcase is also an option
                  gradient="bg-gradient-to-br from-pink-400 to-rose-500" // Using the fourth gradient style
                  // No change or changeType props if trend is not applicable
                />
              </div>

              {/* Detailed Breakdowns Section */}
              <h2
                className={`text-2xl font-semibold ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                } mb-4 mt-10`}
              >
                Detailed Breakdowns
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <DashboardCard
                  title="Grants by Status"
                  value={
                    analyticsData.grants?.total_grants?.toString() || "N/A"
                  }
                  subtitle="Total active grants"
                  icon={Award}
                  layout="detailed"
                  trend="up" // Dummy trend, or derive from data if possible
                  trendValue={`Requested: $${parseFloat(
                    analyticsData.grants?.total_amount_requested || 0
                  ).toLocaleString()}`}
                  backgroundColor={
                    theme === "light" ? "bg-white" : "bg-[var(--color-black/50)] border-gray-200"
                  }
                  textColor={
                    theme === "light" ? "text-gray-800" : "text-gray-200"
                  }
                  iconBgColor={
                    theme === "light"
                      ? "bg-[var(--color-p4)]"
                      : "bg-[var(--color-p1)]/30"
                  }
                  iconColor={
                    theme === "light"
                      ? "text-[var(--color-p1)]"
                      : "text-[var(--color-p4)]"
                  }
                  customContent={
                    analyticsData.grants?.grants_by_status?.length > 0 && (
                      <div className="mt-2">
                        <DashboardCard.MiniBarChart
                          data={analyticsData.grants.grants_by_status.map(
                            (item) => item.count
                          )}
                          labels={analyticsData.grants.grants_by_status.map(
                            (item) => item.status
                          )}
                          barColor={
                            theme === "light"
                              ? "bg-[var(--color-p1)]/60"
                              : "bg-[var(--color-p3)]/70"
                          }
                          tooltipTextColor={
                            theme === "light" ? "text-gray-700" : "text-white"
                          }
                          tooltipBgColor={
                            theme === "light" ? "bg-white" : "bg-gray-700"
                          }
                        />
                      </div>
                    )
                  }
                />
                <DashboardCard
                  title="Documents by Type"
                  value={
                    analyticsData.documents?.total_documents?.toString() ||
                    "N/A"
                  }
                  subtitle="Categorized documents"
                  icon={FileText}
                  layout="detailed"
                  trend="up" // Dummy trend
                  trendValue="+2 types"
                  backgroundColor={
                    theme === "light" ? "bg-white" : "bg-[var(--color-black/50)] border-gray-200"
                  }
                  textColor={
                    theme === "light" ? "text-gray-800" : "text-gray-200"
                  }
                  iconBgColor={
                    theme === "light"
                      ? "bg-[var(--color-p5)]"
                      : "bg-[var(--color-p2)]/30"
                  }
                  iconColor={
                    theme === "light"
                      ? "text-[var(--color-p2)]"
                      : "text-[var(--color-p5)]"
                  }
                  customContent={
                    analyticsData.documents?.documents_by_type?.length > 0 && (
                      <div className="mt-2">
                        <DashboardCard.MiniBarChart
                          data={analyticsData.documents.documents_by_type.map(
                            (item) => item.count
                          )}
                          labels={analyticsData.documents.documents_by_type.map(
                            (item) => item.document_type
                          )}
                          barColor={
                            theme === "light"
                              ? "bg-[var(--color-p2)]/60"
                              : "bg-[var(--color-s4)]/70"
                          }
                          tooltipTextColor={
                            theme === "light" ? "text-gray-700" : "text-white"
                          }
                          tooltipBgColor={
                            theme === "light" ? "bg-white" : "bg-gray-700"
                          }
                        />
                      </div>
                    )
                  }
                />
              </div>

              {/* Quick Stats Section */}
              <h2
                className={`text-2xl font-semibold ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                } mb-4 mt-10`}
              >
                Quick Stats
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardCard
                  title="Annual Budget & Allocation"
                  value={`$${parseFloat(
                    analyticsData.divisions_programs
                      ?.total_annual_budget_all_programs || 0
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                  subtitle="Overall program funding"
                  className="h-[400px] flex flex-col" // Added explicit height and flex for content stretching
                  icon={DollarSign}
                  layout="detailed" // Changed from compact to detailed
                  trend="up" // Dummy trend
                  trendValue="+10%"
                  backgroundColor={
                    theme === "light" ? "bg-white" : "bg-[var(--color-black/50)] border-gray-200"
                  }
                  textColor={
                    theme === "light" ? "text-gray-800" : "text-gray-200"
                  }
                  iconBgColor={
                    theme === "light"
                      ? "bg-[var(--color-p5)]/70"
                      : "bg-[var(--color-s4)]/40"
                  }
                  iconColor={
                    theme === "light"
                      ? "text-[var(--color-s4)]"
                      : "text-[var(--color-p5)]"
                  }
                  customContent={
                    <div className="mt-2 flex-grow flex flex-col justify-end"> {/* flex-grow to push chart to bottom */}
                      <p
                        className={`text-xs mb-1 ${
                          theme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        Dummy Allocation Breakdown:
                      </p>
                      <DashboardCard.MiniBarChart
                        data={[40, 25, 15, 20]} // Dummy data
                        labels={[
                          "Education",
                          "Microfund",
                          "Rescue",
                          "Vocational",
                        ]} // Dummy labels
                        barColor={
                          theme === "light"
                            ? "bg-[var(--color-s4)]/60"
                            : "bg-[var(--color-p5)]/70"
                        }
                        tooltipTextColor={
                          theme === "light" ? "text-gray-700" : "text-white"
                        }
                        tooltipBgColor={
                          theme === "light" ? "bg-white" : "bg-gray-700"
                        }
                      />
                    </div>
                  }
                />

                {/* Users by Role Pie Chart Section */}
                <div
                  className={`p-4 md:p-6 rounded-xl shadow-lg h-[400px] flex flex-col border-1 border-black/50 ${ // Added explicit height and flex
                    theme === "light" ? "bg-white" : "bg-[var(--color-black/50)] border-gray-200"
                  }`}
                >
                  <h2
                    className={`text-lg font-semibold mb-4 ${ // Matched style of DashboardCard title
                      theme === "light" ? "text-gray-900" : "text-gray-100"
                    }`}
                  >
                    Users by Role
                  </h2>
                  {isLoadingUsersByRole && (
                    <div className="flex justify-center items-center h-64">
                      <Loader2
                        className={`w-10 h-10 animate-spin ${
                          theme === "light"
                            ? "text-[var(--color-p2)]"
                            : "text-[var(--color-p5)]"
                        }`}
                      />
                    </div>
                  )}
                  {usersByRoleError && !isLoadingUsersByRole && (
                    <div
                      className={`p-4 rounded-md ${
                        theme === "light"
                          ? "bg-red-100 text-red-700"
                          : "bg-red-900/30 text-red-400"
                      } flex items-center gap-3`}
                    >
                      <AlertTriangle size={20} />
                      <p className="text-sm">{usersByRoleError}</p>
                    </div>
                  )}
                  {!isLoadingUsersByRole &&
                    !usersByRoleError &&
                    usersByRoleData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%"> {/* Ensure container takes full height */}
                        <PieChart>
                          <defs>
                            {PIE_COLORS.map((color, index) => (
                              <linearGradient key={`gradient-${index}`} id={`roleGradient${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={color} stopOpacity={0.5} />
                              </linearGradient>
                            ))}
                          </defs>
                          <Pie
                            data={usersByRoleData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70} // Increased innerRadius for a larger chart
                            outerRadius={110} // Increased outerRadius for a larger chart
                            paddingAngle={5} // Matching DummyDashboard
                            dataKey="count"
                            nameKey="name" // Use the mapped 'name' property
                          >
                            {usersByRoleData.map((entry, index) => {
                              return (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={`url(#roleGradient${index % PIE_COLORS.length})`}
                                  stroke={theme === 'light' ? '#fff' : 'var(--color-s1)'} // Optional: add a stroke for better segment separation
                                  strokeWidth={1} // Optional: stroke width
                                />
                              );
                            })}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor:
                                theme === "light" ? "#fff" : "var(--color-s1)",
                              border:
                                "1px solid " +
                                (theme === "light"
                                  ? "#ccc"
                                  : "var(--color-s2)"),
                            }}
                            itemStyle={{
                              color: theme === "light" ? "#000000" : "#E0E0E0", // Darker off-white for dark theme
                            }}
                            formatter={(value, name, props) => [`${value} users`, props.payload.name]} // Matching DummyDashboard tooltip format
                          />
                          <Legend
                            wrapperStyle={{
                              color: theme === "light" ? "#374151" : "#D1D5DB", // Dark gray for light, lighter gray for dark
                              // paddingTop: "10px" // Optional: if you need more space above legend
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : null } {/* Render null if no data to prevent errors */}
                  {!isLoadingUsersByRole &&
                    !usersByRoleError &&
                    usersByRoleData.length === 0 && (
                      <p
                        className={`text-center py-10 ${
                          theme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        No user role data available.
                      </p>
                    )}
                </div>
              </div>
            </>
          )}

          {/* Tasks and Calendar Section - Two Column Layout */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks Section Column */}
            <div className="lg:col-span-1">
              {isLoadingTasks && (
                <div className={`flex justify-center items-center h-64 p-6 rounded-xl shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-[var(--color-black/50)]'}`}>
                  <Loader2 className={`w-10 h-10 animate-spin ${theme === 'light' ? 'text-[var(--color-p2)]' : 'text-[var(--color-p5)]'}`} />
                </div>
              )}
              {tasksError && !isLoadingTasks && (
                 <div className={`p-4 rounded-md ${theme === 'light' ? 'bg-red-100 text-red-700' : 'bg-red-900/30 text-red-400'} flex items-center gap-3`}>
                  <AlertTriangle size={20} />
                  <p className="text-sm">{tasksError}</p>
                </div>
              )}
              {!isLoadingTasks && !tasksError && (
                <div className="h-[550px] xl:h-[600px] border-1 border-black/50 rounded-3xl"> {/* Explicit height for TasksSection */}
                  <TasksSection
                    tasks={tasksData}
                    appTheme={theme}
                    showHeader={true}
                  />
                </div>
              )}
            </div>

            {/* Grants Calendar Column */}
            <div className="lg:col-span-1 border-1 border-black/50 rounded-3xl">
              {/* The GrantsCalendar component manages its own title and data fetching */}
              <div className="h-[550px] xl:h-[600px]"> {/* Explicit height for GrantsCalendar */}
                <GrantsCalendar appTheme={theme} />
              </div>
            </div>
          </div>
      </main>
    </>
  );
};

export default DashboardSection;