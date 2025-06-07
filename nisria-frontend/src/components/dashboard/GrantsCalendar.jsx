/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon, 
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Info,
  Loader2
} from 'lucide-react';
import api from '../../services/api'; 

const GrantsCalendar = ({ className = '', appTheme = 'light' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWeekStartDate, setSelectedWeekStartDate] = useState(null); // State to hold the start date of the selected week
  const [grantsData, setGrantsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Status configurations with colors and icons
  const statusConfig = {
    pending: { color: 'bg-yellow-400', glowColor: 'shadow-yellow-400/50', textColor: 'text-yellow-800', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', icon: Clock, label: 'Pending' },
    applied: { color: 'bg-blue-400', glowColor: 'shadow-blue-400/50', textColor: 'text-blue-800', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', icon: FileText, label: 'Applied' },
    approved: { color: 'bg-green-400', glowColor: 'shadow-green-400/50', textColor: 'text-green-800', bgColor: 'bg-green-50', borderColor: 'border-green-200', icon: CheckCircle, label: 'Approved' },
    denied: { color: 'bg-red-400', glowColor: 'shadow-red-400/50', textColor: 'text-red-800', bgColor: 'bg-red-50', borderColor: 'border-red-200', icon: XCircle, label: 'Denied' },
    expired: { color: 'bg-gray-400', glowColor: 'shadow-gray-400/50', textColor: 'text-gray-800', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', icon: AlertTriangle, label: 'Expired' },
    award: { color: 'bg-purple-400', glowColor: 'shadow-purple-400/50', textColor: 'text-purple-800', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', icon: Award, label: 'Award Date' }
  };

  // Theme-aware status config
  const getThemedStatusConfig = (statusKey) => {
    const baseConfig = statusConfig[statusKey.toLowerCase()] || statusConfig.pending;
    if (appTheme === 'dark') {
      return {
        ...baseConfig,
        textColor: `text-${baseConfig.color.split('-')[1]}-300`, // e.g. text-yellow-300
        bgColor: `${baseConfig.color.split('bg-')[1].split('-')[0]}-900/30`, // e.g. bg-yellow-900/30
        borderColor: `border-${baseConfig.color.split('-')[1]}-700`,
      };
    }
    return baseConfig;
  };

  useEffect(() => {
    const fetchGrantsForMonth = async () => {
      setIsLoading(true);
      setError(null);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // API likely expects 1-12 for month
      try {
        const response = await api.get(`/api/grants/by-month/${year}/${String(month).padStart(2, '0')}/`);
        setGrantsData(response.data);
      } catch (err) {
        console.error("Failed to fetch grants data:", err);
        setError(err.response?.data?.detail || err.message || "Could not load grants for this month.");
        setGrantsData(null); // Clear old data on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchGrantsForMonth();
  }, [currentDate]);

  const grantsByDate = useMemo(() => {
    if (!grantsData) return {};
    const dateMap = {};
    grantsData.grants_with_deadline_in_month?.forEach(grant => {
      if (grant.application_deadline) {
        const dateKey = grant.application_deadline;
        if (!dateMap[dateKey]) dateMap[dateKey] = [];
        dateMap[dateKey].push({ ...grant, type: 'deadline', statusConfig: getThemedStatusConfig(grant.status) });
      }
    });
    grantsData.grants_with_award_date_in_month?.forEach(grant => {
      if (grant.award_date) {
        const dateKey = grant.award_date;
        if (!dateMap[dateKey]) dateMap[dateKey] = [];
        dateMap[dateKey].push({ ...grant, type: 'award', statusConfig: getThemedStatusConfig('award') });
      }
    });
    return dateMap;
  }, [grantsData, appTheme]);

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = lastDayOfMonth.getDate();
    const days = [];
    for (let i = 0; i < firstDayWeekday; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(1); // Avoid issues with month lengths
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedWeekStartDate(null); // Clear selected week when changing month
  };

  const getGrantsForDate = (day) => {
    if (!day) return [];
    const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return grantsByDate[dateKey] || [];
  };

  const hasGrants = (day) => getGrantsForDate(day).length > 0;

  const getDominantStatus = (day) => {
    // Only calculate dominant status for days with grants
    if (!day || !hasGrants(day)) return null;

    const grants = getGrantsForDate(day);
    if (grants.length === 0) return null;
    // Prioritize award date, then standard statuses
    const priorities = ['award', 'approved', 'applied', 'pending', 'denied', 'expired'];
    for (const priority of priorities) {
      const grant = grants.find(g => (g.type === 'award' && priority === 'award') || g.status === priority);
      if (grant) return grant.statusConfig;
    }
    // Fallback to the first grant's status config if no priority match (shouldn't happen with 'pending' fallback)
    return grants[0].statusConfig;
  };

  // Helper to get the start date (Sunday) of a week
  const getWeekStartDate = (date) => {
    const d = new Date(date);
    const dayOfWeek = d.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = dayOfWeek; // Difference to get to Sunday
    d.setDate(d.getDate() - diff);
    return d;
  };

  // Memoized function to get all grants for the selected week
  const getGrantsForSelectedWeek = useMemo(() => {
    if (!selectedWeekStartDate) return [];
    const grantsInWeek = [];
    const weekStart = new Date(selectedWeekStartDate);

    for (let i = 0; i < 7; i++) {
      const currentDateInWeek = new Date(weekStart);
      currentDateInWeek.setDate(weekStart.getDate() + i);
      const dateKey = currentDateInWeek.toISOString().split('T')[0]; // YYYY-MM-DD
      if (grantsByDate[dateKey]) {
        grantsInWeek.push(...grantsByDate[dateKey]);
      }
    }
    // Sort grants by date and then maybe type (deadline before award) for better readability
    grantsInWeek.sort((a, b) => {
      const dateA = new Date(a.application_deadline || a.award_date);
      const dateB = new Date(b.application_deadline || b.award_date);
      if (dateA - dateB !== 0) return dateA - dateB;
      if (a.type === 'deadline' && b.type === 'award') return -1;
      if (a.type === 'award' && b.type === 'deadline') return 1;
      return 0;
    });
    return grantsInWeek;
  }, [selectedWeekStartDate, grantsByDate]); // Depend on selectedWeekStartDate and grantsByDate

  const formatCurrency = (amount, currency) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const mainBgColor = appTheme === 'light' ? 'bg-white' : 'bg-[var(--color-black/70)] ';
  const textColor = appTheme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const subTextColor = appTheme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const mutedTextColor = appTheme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const borderColor = appTheme === 'light' ? 'border-gray-100' : 'border-gray-200';
  const hoverBgColor = appTheme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700/50';

  return (
    <div className={`${mainBgColor} rounded-xl shadow-sm border ${borderColor} ${className} h-full flex flex-col`}>
      <div className={`p-4 md:p-6 border-b ${borderColor}`}>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center space-x-3">
            <CalendarIcon className={`w-5 h-5 md:w-6 md:h-6 ${subTextColor}`} />
            <h3 className={`text-md md:text-xl font-semibold ${textColor}`}>Grants Calendar</h3>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <button onClick={() => navigateMonth(-1)} className={`p-1.5 md:p-2 ${hoverBgColor} rounded-lg transition-colors`}>
              <ChevronLeft className={`w-4 h-4 md:w-5 md:h-5 ${mutedTextColor}`} />
            </button>
            <h4 className={`text-sm md:text-lg font-medium ${textColor} min-w-[120px] md:min-w-[160px] text-center`}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h4>
            <button onClick={() => navigateMonth(1)} className={`p-1.5 md:p-2 ${hoverBgColor} rounded-lg transition-colors`}>
              <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 ${mutedTextColor}`} />
            </button>
          </div>
        </div>
        <div className={`${appTheme === 'light' ? 'bg-gray-50' : 'bg-gray-800/50'} rounded-lg p-3 md:p-4`}>
          <h5 className={`text-xs md:text-sm font-medium ${subTextColor} mb-2 md:mb-3`}>Status Legend</h5>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-center space-x-1.5 md:space-x-2">
                <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${config.color} shadow-md ${config.glowColor}`}></div>
                <span className={`text-xs ${mutedTextColor}`}>{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 flex-grow overflow-hidden">
        {isLoading && <div className="flex justify-center items-center h-full"><Loader2 className={`w-8 h-8 animate-spin ${appTheme === 'light' ? 'text-blue-500' : 'text-blue-400'}`} /></div>}
        {error && <div className={`text-center py-8 ${appTheme === 'light' ? 'text-red-500' : 'text-red-400'}`}><AlertTriangle className="w-8 h-8 mx-auto mb-2" />{error}</div>}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full">
            <div className="space-y-2 md:space-y-4 flex flex-col"> {/* Removed h-full */}
              <div className="grid grid-cols-7 gap-1">
                {weekdays.map(day => <div key={day} className={`text-center text-xs md:text-sm font-medium ${mutedTextColor} py-1 md:py-2`}>{day}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1"> {/* Removed flex-grow to make the day grid compact */}
                {getCalendarDays().map((day, index) => {
                  const grants = getGrantsForDate(day);
                  const dominantStatus = getDominantStatus(day);
                  const dayDate = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
                  const weekStartForDay = dayDate ? getWeekStartDate(dayDate) : null;
                  // Check if the day's week matches the selected week
                  const isSelectedWeek = selectedWeekStartDate && weekStartForDay && weekStartForDay.getTime() === selectedWeekStartDate.getTime();
                  return (
                    <button
                      key={index}
                      onClick={() => day && setSelectedWeekStartDate(getWeekStartDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)))}
                      disabled={!day}
                      className={`relative aspect-square flex items-center justify-center text-xs md:text-sm font-medium rounded-md md:rounded-lg transition-all duration-200
                        ${!day ? 'invisible' : (appTheme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700/50')}
                        ${isSelectedWeek ? (appTheme === 'light' ? 'ring-2 ring-blue-500 bg-blue-50' : 'ring-2 ring-blue-400 bg-blue-900/30') : ''}
                        ${hasGrants(day) && dominantStatus ? `${dominantStatus.color} text-white shadow-lg ${dominantStatus.glowColor} hover:shadow-xl` : (appTheme === 'light' ? 'text-gray-700' : 'text-gray-300')}
                      `}
                    >
                      {day}
                      {hasGrants(day) && (
                        <div className={`absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold ${appTheme === 'light' ? 'bg-white text-gray-700 border border-gray-300' : 'bg-gray-700 text-gray-200 border border-gray-600'}`}>
                          {grants.length}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 md:space-y-4 flex flex-col"> {/* Removed h-full */}
              <h5 className={`text-md md:text-lg font-semibold ${textColor}`}>
                {selectedWeekStartDate ?
                  `Grants for the week of ${monthNames[selectedWeekStartDate.getMonth()]} ${selectedWeekStartDate.getDate()}`
                  : 'Select a date'}
              </h5>
              {/* Scrollable container for grants list or messages - Added max-h-full */}
              <div className="space-y-3 flex-grow overflow-y-auto pr-1 min-h-0 max-h-full">
                {selectedWeekStartDate ? (
                  getGrantsForSelectedWeek.length > 0 ? (
                    // Map and display grants for the entire selected week
                    getGrantsForSelectedWeek.map((grant, index) => {
                      const IconComponent = grant.statusConfig.icon;
                      return (
                        <div key={grant.id || index} className={`p-3 md:p-4 rounded-lg border-2 ${grant.statusConfig.bgColor} ${grant.statusConfig.borderColor}`}>
                          <div className="flex items-start space-x-3">
                            <div className={`p-1.5 md:p-2 rounded-full ${grant.statusConfig.color} ${appTheme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-sm`}>
                              <IconComponent className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h6 className={`font-medium ${grant.statusConfig.textColor} text-sm`}>{grant.organization_name}</h6>
                              <p className={`text-xs ${mutedTextColor} mt-0.5 md:mt-1`}>{grant.type === 'deadline' ? 'Application Deadline' : 'Award Date'}</p>
                              {grant.amount_value && <p className={`text-sm font-semibold ${textColor} mt-0.5 md:mt-1`}>{formatCurrency(grant.amount_value, grant.amount_currency)}</p>}
                              <div className="flex items-center space-x-2 mt-1 md:mt-2">
                                <span className={`inline-flex items-center px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${grant.statusConfig.bgColor} ${grant.statusConfig.textColor} border ${grant.statusConfig.borderColor}`}>
                                  {grant.statusConfig.label}
                                </span>
                                {grant.location && <span className={`text-xs ${mutedTextColor}`}>{grant.location}</span>}
                              </div>
                            </div>
                          </div>
                          {grant.notes && <p className={`text-xs ${mutedTextColor} mt-2 pl-10 md:pl-11`}>{grant.notes}</p>}
                        </div>);
                    })
                  ) : (
                    <div className={`text-center py-8 ${mutedTextColor}`}>
                      <Info className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 ${appTheme === 'light' ? 'text-gray-300' : 'text-gray-600'}`} />
                      <p className="text-sm">No grants scheduled for this week.</p>
                    </div>)
                ) : (
                  <div className={`text-center py-8 ${mutedTextColor}`}>
                    <CalendarIcon className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 ${appTheme === 'light' ? 'text-gray-300' : 'text-gray-600'}`} />
                    <p className="text-sm">Click on a date to view grant details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrantsCalendar;