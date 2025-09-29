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
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
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
    "var(--color-p4)", // Another color
    "var(--color-p5)", // And another
  ];
  const BENEFICIARY_PIE_COLORS = [
    "var(--color-p1)", "var(--color-p2)", "var(--color-s3)", 
    "var(--color-p4)", "var(--color-p5)", "#FFBB28", "#FF8042"
  ];
  
  const CustomTooltip = ({ active, payload, theme }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 rounded-lg shadow-lg transition-colors ${theme === 'light' ? 'bg-white/80 backdrop-blur-sm border border-gray-200' : 'bg-gray-800/80 backdrop-blur-sm border border-gray-700'}`}>
          <p className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>{data.name}</p>
          <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            <span style={{ color: payload[0].fill }}>●</span> {data.value} beneficiaries
          </p>
        </div>
      );
    }
  
    return null;
  };

  const { theme } = useTheme();


  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);

  const [beneficiariesByProgramData, setBeneficiariesByProgramData] = useState([]);
  const [isLoadingBeneficiaries, setIsLoadingBeneficiaries] = useState(true);
  const [beneficiariesError, setBeneficiariesError] = useState(null);

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

    const fetchBeneficiariesByProgram = async () => {
      setIsLoadingBeneficiaries(true);
      setBeneficiariesError(null);
      try {
        const response = await api.get("/api/analytics/beneficiaries/by-program/");
        const data = response.data;
        const mappedData = data.map(item => ({
          ...item,
          name: item.program,
          value: item.count,
        }));
        setBeneficiariesByProgramData(mappedData);
      } catch (error) {
        console.error("Failed to fetch beneficiaries by program data:", error);
        setBeneficiariesError(error.response?.data?.detail || error.message || "Could not load beneficiary data.");
      } finally {
        setIsLoadingBeneficiaries(false);
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
    fetchBeneficiariesByProgram();
    fetchTasks();
  }, []);

  const totalBeneficiaries = beneficiariesByProgramData.reduce(
    (sum, item) => sum + item.value, 0
  );

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
                      <ResponsiveContainer width="100%" height={120}>
                        <LineChart data={analyticsData.grants.grants_by_status.map(item => ({ name: item.status, value: item.count }))} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <defs>
                            <linearGradient id="grantsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-p1)" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="var(--color-p1)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: theme === 'light' ? '#6B7280' : '#9CA3AF' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: theme === 'light' ? '#6B7280' : '#9CA3AF' }} axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(31, 41, 55, 0.8)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem' }}
                            labelStyle={{ color: theme === 'light' ? '#111827' : '#F9FAFB' }}
                            formatter={(value, name) => [`${value} grants`, 'Count']}
                          />
                          <Line type="monotone" dataKey="value" stroke="var(--color-p1)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-p1)' }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
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
                      <ResponsiveContainer width="100%" height={120}>
                        <LineChart data={analyticsData.documents.documents_by_type.map(item => ({ name: item.document_type, value: item.count }))} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <defs>
                            <linearGradient id="docsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-p2)" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="var(--color-p2)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: theme === 'light' ? '#6B7280' : '#9CA3AF' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: theme === 'light' ? '#6B7280' : '#9CA3AF' }} axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(31, 41, 55, 0.8)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem' }}
                            labelStyle={{ color: theme === 'light' ? '#111827' : '#F9FAFB' }}
                            formatter={(value, name) => [`${value} documents`, 'Count']}
                          />
                          <Line type="monotone" dataKey="value" stroke="var(--color-p2)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-p2)' }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
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
                  customContent={null}
                />

                {/* Beneficiaries by Program Pie Chart Section */}
                <div
                  className={`p-4 md:p-6 rounded-xl shadow-lg h-[400px] flex flex-col border-1 border-black/50 glass-surface ${ // Added explicit height and flex
                    theme === "light" ? "bg-white" : "bg-[var(--color-black/50)] border-gray-200"
                  }`}
                >
                  <h2
                    className={`text-lg font-semibold mb-4 ${
                      theme === "light" ? "text-gray-900" : "text-gray-100"
                    }`}
                  >
                    Beneficiaries by Program
                  </h2>
                  {isLoadingBeneficiaries && (
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
                  {beneficiariesError && !isLoadingBeneficiaries && (
                    <div
                      className={`p-4 rounded-md ${
                        theme === "light"
                          ? "bg-red-100 text-red-700"
                          : "bg-red-900/30 text-red-400"
                      } flex items-center gap-3`}
                    >
                      <AlertTriangle size={20} />
                      <p className="text-sm">{beneficiariesError}</p>
                    </div>
                  )}
                  {!isLoadingBeneficiaries &&
                    !beneficiariesError &&
                    beneficiariesByProgramData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart 
                          cx="50%" 
                          cy="50%" 
                          innerRadius="20%" 
                          outerRadius="90%" 
                          barSize={15} 
                          data={beneficiariesByProgramData}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <RadialBar
                            minAngle={15}
                            label={{ position: 'insideStart', fill: '#fff', fontSize: '10px' }}
                            background
                            clockWise
                            dataKey="value"
                          >
                            {beneficiariesByProgramData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={BENEFICIARY_PIE_COLORS[index % BENEFICIARY_PIE_COLORS.length]} className="transition-all duration-300" />
                            ))}
                          </RadialBar>
                          <Tooltip content={<CustomTooltip theme={theme} />} cursor={{ stroke: 'none', fill: 'transparent' }} />
                          <Legend 
                            iconSize={10} 
                            layout="vertical" 
                            verticalAlign="middle" 
                            align="right"
                            wrapperStyle={{
                              color: theme === 'light' ? '#374151' : '#D1D5DB',
                              fontSize: '12px',
                              lineHeight: '20px'
                            }}
                            formatter={(value, entry) => (
                              <span className="ml-2">{value} ({entry.payload.value})</span>
                            )}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    ) : (
                      !isLoadingBeneficiaries && !beneficiariesError && (
                        <p
                          className={`text-center py-10 ${
                            theme === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          No beneficiary data available.
                        </p>
                      )
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