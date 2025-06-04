import React, { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  Briefcase,
  Mail,
  Award,
  FileText,
  Loader2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  Target,
  Calendar,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";

import TasksSection from '../../components/dashboard/TasksSection';
import GrantsCalendar from '../../components/dashboard/GrantsCalendar';

// Mock API data based on your JSON structure
const mockAnalyticsData = {
  accounts: {
    total_users: 2,
    users_by_role: [
      { role: "admin", count: 1, name: "Admin" }, // Added name for tooltip
      { role: "super_admin", count: 1, name: "Super Admin" }, // Added name for tooltip
    ],
    active_users: 2,
    inactive_users: 0,
  },
  documents: {
    total_documents: 0,
    documents_by_type: [],
    documents_by_format: [],
    documents_by_division_origin: [],
    bank_statement_access: {
      total_requests: 0,
      granted_requests: 0,
      pending_requests: 0,
    },
  },
  divisions_programs: {
    total_divisions: 2,
    total_programs: 1,
    programs_per_division: [
      { name: "maisha", program_count: 1 },
      { name: "nisria", program_count: 0 },
    ],
    total_annual_budget_all_programs: "360000.00",
    education_program: {
      total_students: 0,
      students_by_gender: [],
      students_by_level: [],
    },
    microfund_program: {
      total_beneficiaries: 0,
      beneficiaries_by_gender: [],
      active_beneficiaries: 0,
    },
    rescue_program: {
      total_children: 0,
      children_by_gender: [],
      reunited_children: 0,
      children_under_care: 0,
    },
    vocational_program: {
      total_trainers: 0,
      trainers_by_gender: [],
      total_trainees: 0,
      trainees_by_gender: [],
      trainees_under_training: 0,
    },
  },
  email_templates: { total_templates: 0, templates_by_type: [] },
  grants: {
    total_grants: 1,
    grants_by_status: [{ status: "pending", count: 1 }],
    total_amount_requested: "50000.00",
    total_amount_approved: "0.00",
  },
  task_manager: {
    total_tasks: 2,
    tasks_by_status: [{ status: "todo", count: 2 }],
    tasks_by_priority: [
      { priority: "high", count: 1 },
      { priority: "medium", count: 1 },
    ],
    overdue_tasks: 1,
    tasks_per_user: [ // This can be used for tasksData
      {
        id: "task1", // Added id for key prop
        user_id: "b202ae45-ae8d-47cf-a9db-50e801ffdfe9",
        user_full_name: "Wahome Jeremy",
        task_count: 1,
        title: "Review Grant Proposal X", // Example task detail
        dueDate: "2023-10-28", // Example task detail
        priority: "high", // Example task detail
        status: "todo", // Example task detail
      },
      {
        id: "task2", // Added id for key prop
        user_id: "889b947f-6e60-4286-b939-1ab558a7dae7",
        user_full_name: "Manasseh Kimani",
        task_count: 1,
        title: "Follow up on Document Y", // Example task detail
        dueDate: "2023-10-25", // Example task detail (overdue)
        priority: "medium", // Example task detail
        status: "todo", // Example task detail
      },
    ],
    grant_follow_up_tasks: 1,
  },
};

// Mock trend data for charts
const mockTrendData = [
  { month: "Jan", revenue: 11000, users: 45, grants: 8 },
  { month: "Feb", revenue: 15000, users: 52, grants: 12 },
  { month: "Mar", revenue: 18000, users: 48, grants: 15 },
  { month: "Apr", revenue: 22000, users: 61, grants: 18 },
  { month: "May", revenue: 25000, users: 55, grants: 22 },
  { month: "Jun", revenue: 28000, users: 67, grants: 25 },
];

const deviceData = [
  { name: "Mobile", value: 45, color: "#8B5CF6" },
  { name: "Desktop", value: 35, color: "#06B6D4" },
  { name: "Tablet", value: 20, color: "#10B981" },
];

const channelSpendData = [
  { channel: "Jan", spend: 5000, resonance: 78 },
  { channel: "Feb", spend: 7500, resonance: 82 },
  { channel: "Mar", spend: 12000, resonance: 85 },
  { channel: "Apr", spend: 8500, resonance: 79 },
  { channel: "May", spend: 15000, resonance: 88 },
  { channel: "Jun", spend: 11000, resonance: 84 },
  { channel: "Jul", spend: 9500, resonance: 81 },
  { channel: "Aug", spend: 13500, resonance: 86 },
];

// Gradient Card Component
const GradientCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  gradient,
  // trend, // trend prop was defined but not used
}) => (
  <div
    className={`relative overflow-hidden rounded-2xl p-6 text-white ${gradient}`}
  >
    <div className="absolute inset-0 bg-black/10"></div>
    <div className="relative z-10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && changeType && (
            <div className="flex items-center mt-2 gap-1">
              {changeType === "up" ? (
                <TrendingUp className="w-4 h-4 text-white/90" />
              ) : (
                <TrendingDown className="w-4 h-4 text-white/90" />
              )}
              <span className="text-xs text-white/90">{change}</span>
            </div>
          )}
        </div>
        <div className="bg-white/20 p-3 rounded-xl">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </div>
);

// Chart Card Component
const ChartCard = ({ title, subtitle, children, height = "h-80" }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-lg ${height}`}>
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {children}
  </div>
);

// Stats Grid Component
const StatsGrid = ({ data }) => {
  const totalFund = parseFloat(
    data.divisions_programs.total_annual_budget_all_programs
  );
  const totalGrants = parseFloat(data.grants.total_amount_requested);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <GradientCard
        title="Total Fund"
        value={`$${(totalFund / 1000).toFixed(1)}K`}
        change="+55.36% ↗" // Example: consider making this dynamic
        changeType="up"
        icon={DollarSign}
        gradient="bg-gradient-to-br from-cyan-400 to-blue-500"
      />

      <GradientCard
        title="Conversions"
        value="47,403" // Example: consider making this dynamic
        change="+12.6% ↗"
        changeType="up"
        icon={Target}
        gradient="bg-gradient-to-br from-purple-400 to-purple-600"
      />

      <GradientCard
        title="Page Impressions"
        value="55,093" // Example: consider making this dynamic
        change="+10% ↗"
        changeType="up"
        icon={Users}
        gradient="bg-gradient-to-br from-emerald-400 to-green-500"
      />

      <GradientCard
        title="Total Grant Requests"
        value={`$${(totalGrants / 1000).toFixed(0)}K`}
        change="+1.56% ↗" // Example: consider making this dynamic
        changeType="up"
        icon={Award}
        gradient="bg-gradient-to-br from-pink-400 to-rose-500"
      />
    </div>
  );
};

const DashboardSection = ({ theme = "light" }) => { // Renamed and added theme prop
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasksData, setTasksData] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState(null);

  useEffect(() => {
    // Simulate API call for general analytics
    const fetchAnalytics = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      setAnalyticsData(mockAnalyticsData);
      setIsLoading(false);
    };

    fetchAnalytics();
  }, []);

  useEffect(() => {
    // Simulate API call for tasks data
    const fetchTasks = async () => {
      setIsLoadingTasks(true);
      setTasksError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate network delay
        // Assuming tasks are in mockAnalyticsData.task_manager.tasks_per_user
        // You might want a more specific mock or endpoint for tasks
        setTasksData(mockAnalyticsData.task_manager.tasks_per_user || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasksError("Failed to load tasks. Please try again.");
      } finally {
        setIsLoadingTasks(false);
      }
    };

    if (analyticsData) { // Optionally, fetch tasks after analytics data is loaded
        fetchTasks();
    }
    // Or fetch independently: fetchTasks();
  }, [analyticsData]); // Dependency array ensures this runs if analyticsData changes, or remove if independent

  if (isLoading || !analyticsData) { // Ensure analyticsData is loaded before rendering dependent components
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Define colors for the user roles pie chart for better distinction
  const roleColors = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>

        {/* Stats Cards */}
        <StatsGrid data={analyticsData} />

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Contextual Chart - Users by Role */}
          <ChartCard title="User Roles" subtitle="Distribution by role">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.accounts.users_by_role}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="name" // Use 'name' for tooltip if available in data
                  >
                    {analyticsData.accounts.users_by_role.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-role-${index}`}
                          fill={roleColors[index % roleColors.length]} // Cycle through colors
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} users`, props.payload.name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Device Type Chart */}
          <ChartCard title="Device Type" subtitle="Traffic by device category">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-device-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Impression Measurement */}
          <ChartCard
            title="Impression Measurement"
            subtitle="46,607.22 average impressions" // Consider making this dynamic
          >
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTrendData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    name="Impressions"
                  />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spend by Channel */}
          <ChartCard
            title="Spend by Channel"
            subtitle="Monthly spending analysis"
            height="h-96"
          >
            <div className="h-64"> {/* Adjusted height for chart itself */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={channelSpendData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }} // Adjusted margins
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="channel" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, "Spend"]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="spend" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Monthly Spend"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Resonance Score */}
          <ChartCard
            title="Resonance Score by Creative"
            subtitle="Performance metrics"
            height="h-96"
          >
            <div className="space-y-4">
              {/* Creative Performance Items - Consider making this dynamic */}
              {[
                { name: "Creative A", score: 78, color: "bg-cyan-400", widthClass: "w-3/4" },
                { name: "Creative B", score: 85, color: "bg-emerald-400", widthClass: "w-5/6" },
                { name: "Creative C", score: 92, color: "bg-purple-400", widthClass: "w-full" },
              ].map(creative => (
                <div key={creative.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 ${creative.color} rounded-full`}></div>
                    <span className="text-sm font-medium">{creative.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{creative.score}</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className={`h-2 ${creative.color} ${creative.widthClass} rounded-full`}></div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Circular Progress Chart - Consider making this dynamic */}
              <div className="mt-6 flex justify-center">
                <div className="relative w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ name: 'Achieved', value: 85 }, { name: 'Remaining', value: 15 }]} // Made data more descriptive
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={50}
                        startAngle={90}
                        endAngle={-270} // (90 + 360 * 0.85) for 85%
                        dataKey="value"
                        cornerRadius={5}
                      >
                        <Cell fill="#06B6D4" />
                        <Cell fill="#E5E7EB" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Additional Stats Row */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.task_manager.total_tasks}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue Tasks</p>
                <p className="text-2xl font-bold text-orange-600">
                  {analyticsData.task_manager.overdue_tasks}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Divisions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.divisions_programs.total_divisions}
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Grant Follow-ups</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.task_manager.grant_follow_up_tasks}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tasks and Calendar Section - Two Column Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks Section Column */}
          <div className="lg:col-span-1">
            {isLoadingTasks && (
              <div
                className={`flex justify-center items-center h-64 p-6 rounded-xl shadow-lg ${
                  theme === "light" ? "bg-white" : "bg-[var(--color-s1)]" // Assuming var(--color-s1) is defined
                }`}
              >
                <Loader2
                  className={`w-10 h-10 animate-spin ${
                    theme === "light"
                      ? "text-[var(--color-p2)]" // Assuming var(--color-p2) is defined
                      : "text-[var(--color-p5)]" // Assuming var(--color-p5) is defined
                  }`}
                />
              </div>
            )}
            {tasksError && !isLoadingTasks && (
              <div
                className={`p-4 rounded-md ${
                  theme === "light"
                    ? "bg-red-100 text-red-700"
                    : "bg-red-900/30 text-red-400"
                } flex items-center gap-3`}
              >
                <AlertTriangle size={20} />
                <p className="text-sm">{tasksError}</p>
              </div>
            )}
            {!isLoadingTasks && !tasksError && (
              <div className="h-[550px] xl:h-[600px]">
                <TasksSection tasks={tasksData} appTheme={theme} showHeader={true} />
              </div>
            )}
          </div>

          {/* Grants Calendar Column */}
          <div className="lg:col-span-1">
            <div className="h-[550px] xl:h-[600px]">
              <GrantsCalendar appTheme={theme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
