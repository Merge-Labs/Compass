import React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Eye,
  BarChart3,
  Activity,
  Target,
  Award,
} from "lucide-react";

// Main DashboardCard component
export const DashboardCard = ({
  title,
  value,
  subtitle,
  // eslint-disable-next-line no-unused-vars
  icon: IconComponent = DollarSign,
  trend,
  trendValue,
  backgroundColor = "bg-white",
  textColor = "text-gray-800",
  iconBgColor = "bg-blue-50",
  iconColor = "text-blue-500",
  size = "medium", // small, medium, large
  layout = "default", // default, compact, detailed
  showTrend = true,
  customContent,
  className = "",
}) => {
  const sizeClasses = {
    small: "p-4",
    medium: "p-6",
    large: "p-8",
  };

  const iconSizes = {
    small: "w-8 h-8 p-1.5",
    medium: "w-10 h-10 p-2",
    large: "w-12 h-12 p-2.5",
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getTrendColor = () => {
    return trend === "up" ? "text-green-500" : "text-red-500";
  };

  if (layout === "compact") {
    return (
      <div
        className={`${backgroundColor} ${textColor} rounded-xl shadow-sm border border-gray-100 ${sizeClasses[size]} ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`${iconBgColor} ${iconSizes[size]} rounded-lg flex items-center justify-center`}
            >
              <IconComponent className={`${iconColor} w-5 h-5`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          {showTrend && trend && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (layout === "detailed") {
    return (
      <div
        className={`${backgroundColor} ${textColor} rounded-xl shadow-sm border border-gray-100 ${sizeClasses[size]} ${className}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className={`${iconBgColor} ${iconSizes[size]} rounded-lg flex items-center justify-center`}
          >
            <IconComponent className={`${iconColor} w-6 h-6`} />
          </div>
          {showTrend && trend && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {customContent && <div className="mt-4">{customContent}</div>}
        </div>
      </div>
    );
  }

  // Default layout
  return (
    <div
      className={`${backgroundColor} ${textColor} rounded-xl shadow-sm border border-gray-100 ${sizeClasses[size]} ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`${iconBgColor} ${iconSizes[size]} rounded-lg flex items-center justify-center`}
        >
          <IconComponent className={`${iconColor} w-6 h-6`} />
        </div>
        {showTrend && trend && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-200">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {customContent && <div className="mt-4">{customContent}</div>}
    </div>
  );
};

// Mini chart component for custom content
// eslint-disable-next-line no-unused-vars
DashboardCard.MiniBarChart = function MiniBarChart({ data = [], labels = [], barColor = 'bg-blue-200', tooltipTextColor = 'text-gray-700', tooltipBgColor = 'bg-white' }) {
  // This is a simplified version based on previous discussions.
  // Ensure this matches the more complete version with tooltips if you have it.
  if (!data || data.length === 0) return <div className="text-xs text-center italic opacity-70">No data.</div>;
  const maxValue = Math.max(...data, 1);
  return (
    <div className="flex items-end space-x-1 h-16 md:h-20">
      {data.map((value, index) => (
        <div
          key={index}
          className={`${barColor} rounded-t-sm flex-1 transition-all duration-200 ease-out hover:opacity-75`}
          style={{ height: `${(value / maxValue) * 100}%` }}
          title={labels[index] ? `${labels[index]}: ${value}` : `${value}`} // Basic title tooltip
        />
      ))}
    </div>
  );
};

DashboardCard.MiniLineChart = function MiniLineChart ({ data = [], lineColor = 'stroke-blue-500' }) {
  if (!data || data.length < 2) return <div className="text-xs text-center italic opacity-70">Not enough data.</div>;
  const points = data.map((val, i) => `${(i / (data.length -1)) * 100},${15 - (val / Math.max(...data, 1)) * 12}`).join(' ');
  return (
    <svg className="w-full h-8" viewBox="0 0 100 20">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={lineColor}
        points={points || "0,15 20,10 40,12 60,8 80,5 100,3"} // Fallback points
      />
    </svg>
  );
};