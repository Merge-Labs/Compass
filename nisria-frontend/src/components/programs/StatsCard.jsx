import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  chartType = 'area',
  data = [],
  color = '#3b82f6',
  icon: Icon,
  loading = false,
  formatAsCurrency = false
}) => {
  const formatCurrency = (val) => {
    if (typeof val !== 'number') return val;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatNumber = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val;
  };

  const renderChart = () => {
    if (loading || !data.length) {
      return (
        <div className="h-24 flex items-center justify-center text-gray-400">
          {loading ? 'Loading...' : 'No data available'}
        </div>
      );
    }

    const chartProps = {
      data,
      margin: { top: 5, right: 5, left: 0, bottom: 5 },
    };

    const commonProps = {
      stroke: color,
      fillOpacity: 1,
      fill: `url(#color${title.replace(/\s+/g, '')})`,
      strokeWidth: 2,
    };

    return (
      <div className="h-24 -mx-2 -mb-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart {...chartProps}>
              <defs>
                <linearGradient id={`color${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" {...commonProps} />
            </AreaChart>
          ) : chartType === 'bar' ? (
            <BarChart {...chartProps}>
              <defs>
                <linearGradient id={`color${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Bar dataKey="value" {...commonProps} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart {...chartProps}>
              <defs>
                <linearGradient id={`color${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Line type="monotone" dataKey="value" {...commonProps} dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="bg-white/30 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-white/20 dark:border-gray-700/50 transition-all hover:shadow-xl hover:shadow-blue-500/10">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {Icon && (
              <div className={`p-1.5 rounded-lg bg-${color}-100 dark:bg-opacity-20 text-${color}-600 dark:text-${color}-400`}>
                <Icon className="w-4 h-4" />
              </div>
            )}
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</p>
          </div>
          <div className="flex items-baseline mt-1">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {typeof value === 'number' && !isNaN(value) ? (formatAsCurrency ? formatCurrency(value) : value.toLocaleString()) : value}
            </p>
            {change !== undefined && (
              <span className={`ml-1.5 text-xs font-medium ${change >= 0 ? 'text-green-500 bg-green-100 dark:bg-green-900/30' : 'text-red-500 bg-red-100 dark:bg-red-900/30'} px-1.5 py-0.5 rounded-full`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
              </span>
            )}
          </div>
        </div>
      </div>
      {renderChart()}
    </div>
  );
};

export default StatsCard;
