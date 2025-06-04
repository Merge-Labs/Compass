import React, { useState } from 'react';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Calendar, User, Clock } from 'lucide-react';

const TasksSection = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMonth, setCurrentMonth] = useState(5); // June (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(null);

  const tabs = ['All', 'To Do', 'In Progress', 'Completed', 'Assigned', 'Unassigned', 'Overdue', 'Grant Tasks'];

  const tasks = [
    {
      id: 1,
      title: "Follow up: Grant 'Loreal' is pending",
      description: "The grant application for 'Loreal' (ID: 949b84a4-0910-4987-a008-d8792b8fd450) has been marked as 'pending' on 2025-06-03 11:59. Please review and take necessary actions.",
      assignedTo: "Wahome Jere...",
      dueDate: "Jul 12",
      status: "pending",
      category: "Grant"
    },
    {
      id: 2,
      title: "Update bank statement",
      description: "update to the newest bank statement",
      assignedTo: "Manasseh Ki...",
      dueDate: "Dec 31, 2024",
      status: "overdue",
      category: null,
      isOverdue: true
    }
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`h-8 w-8 flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100 rounded ${
            selectedDate === day ? 'bg-blue-500 text-white' : 'text-gray-700'
          }`}
          onClick={() => setSelectedDate(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-400';
      case 'applied': return 'bg-blue-400';
      case 'approved': return 'bg-green-400';
      case 'denied': return 'bg-red-400';
      case 'expired': return 'bg-gray-400';
      case 'award-date': return 'bg-purple-400';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status, isOverdue) => {
    if (isOverdue) {
      return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
    }
    return <div className={`w-2 h-2 ${getStatusColor(status)} rounded-full`}></div>;
  };

  const filteredTasks = tasks.filter(task => {
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    switch (activeTab) {
      case 'Overdue':
        return task.isOverdue;
      case 'Grant Tasks':
        return task.category === 'Grant';
      default:
        return true;
    }
  });

  const overdueTasks = tasks.filter(task => task.isOverdue).length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Tasks Overview */}
      <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-800">Tasks Overview</h1>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500 cursor-pointer" />
              <Plus className="w-5 h-5 text-gray-500 cursor-pointer" />
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4 text-gray-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-gray-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-6 border-b border-gray-100 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="mt-2">
                  {getStatusIcon(task.status, task.isOverdue)}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{task.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{task.assignedTo}</span>
                      </div>
                      {task.category && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {task.category}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm ${task.isOverdue ? 'text-red-500' : 'text-gray-600'}`}>
                        {task.dueDate} {task.isOverdue && '(Overdue)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>{filteredTasks.length} tasks</span>
            <span className="text-red-500">{overdueTasks} overdue</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Grants Calendar */}
      <div className="w-1/2 bg-white flex flex-col">
        {/* Calendar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-800">Grants Calendar</h2>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentMonth(currentMonth - 1);
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="font-medium text-gray-800 min-w-[120px] text-center">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button 
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentMonth(currentMonth + 1);
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Status Legend */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Status Legend</h3>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-600">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-gray-600">Applied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-600">Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-gray-600">Denied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600">Expired</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-gray-600">Award Date</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1 p-6">
          {/* Calendar Grid */}
          <div className="mb-6">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>

          {/* Select a date section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Select a date</h3>
            <div className="border border-gray-300 rounded-lg p-4 text-center">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click on a date to view grant details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksSection;