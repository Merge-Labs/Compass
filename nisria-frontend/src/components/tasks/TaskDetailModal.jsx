import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Loader2,
  AlertTriangle,
  Calendar,
  User,
  Info,
  FileText,
  Tag,
  CheckCircle,
  CheckSquare, // Added import for CheckSquare
  Clock,
  Edit3,
  BarChart, // For priority
  ChevronDown, // For dropdown
  Trash2, // Added import for Trash2 (used in delete button)
} from "lucide-react";

const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return "N/A";
  try {
    const options = { year: "numeric", month: "long", day: "numeric" };
    if (includeTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }
    return new Date(dateString).toLocaleDateString("en-US", options);
  } catch (e) {
    console.error("Invalid date format:", dateString, e);
    return "Invalid Date";
  }
};

const DetailItem = ({
  icon: Icon,
  label,
  value,
  children,
  highlight = false,
}) => (
  <div
    className={`py-3 sm:grid sm:grid-cols-3 sm:gap-4 transition-colors hover:bg-gray-50/50 rounded-lg px-2 -mx-2 ${
      highlight ? "bg-blue-50/30 border-l-2 border-blue-400 pl-3" : ""
    }`}
  >
    <dt className="text-sm font-medium text-gray-600 flex items-center">
      {Icon && (
        <Icon
          className={`w-4 h-4 mr-2.5 ${
            highlight ? "text-blue-500" : "text-gray-400"
          }`}
        />
      )}
      {label}
    </dt>
    <dd className="mt-1 text-sm text-gray-800 sm:mt-0 sm:col-span-2">
      {children || (
        <span
          className={`break-words ${
            value === "N/A" || !value ? "text-gray-400 italic" : ""
          }`}
        >
          {value || "N/A"}
        </span>
      )}
    </dd>
  </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center mb-3 mt-2 pb-2 border-b border-gray-200">
    {Icon && <Icon className="w-5 h-5 text-blue-600 mr-2" />}
    <h4 className="text-md font-semibold text-gray-700">{title}</h4>
  </div>
);

const TaskStatusBadge = ({ status }) => {
  let colorClasses = "bg-gray-100 text-gray-700 border-gray-300"; // Default
  const s = status?.toLowerCase();

  if (s === "to do" || s === "pending") colorClasses = "bg-blue-100 text-blue-700 border-blue-300";
  else if (s === "in progress") colorClasses = "bg-yellow-100 text-yellow-700 border-yellow-300";
  else if (s === "completed" || s === "approved") colorClasses = "bg-green-100 text-green-700 border-green-300";
  else if (s === "denied" || s === "rejected") colorClasses = "bg-red-100 text-red-700 border-red-300";


  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  let colorClasses = "bg-gray-100 text-gray-700 border-gray-300"; // Default for undefined/low
  const p = priority?.toLowerCase();

  if (p === "high") colorClasses = "bg-red-100 text-red-700 border-red-300";
  else if (p === "medium") colorClasses = "bg-yellow-100 text-yellow-700 border-yellow-300";
  else if (p === "low") colorClasses = "bg-green-100 text-green-700 border-green-300";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses}`}>
      {priority?.charAt(0).toUpperCase() + priority?.slice(1) || "Normal"}
    </span>
  );
};

const TaskDetailModal = ({
  isOpen,
  onClose,
  task,
  loading,
  error,
  onMarkComplete,
  onDeleteTask,
  onEditTask,
  onChangeStatus,
  appTheme // Added appTheme prop
}) => {
  if (!isOpen) return null;

  const isDark = appTheme === 'dark'; // Determine dark mode from prop
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const statusMenuRef = useRef(null);
  const statusOptions = ['todo', 'in_progress', 'completed', 'on_hold'];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Note: The 'task' object passed here should ideally contain all necessary fields.
  // If fields like 'priority', 'date_created', 'date_updated' are not in the
  // 'transformedTasks' in TasksSection.jsx, they will show as 'N/A'.
  // You might need to adjust the data transformation in TasksSection.jsx.

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setIsStatusMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Task Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className={`w-10 h-10 animate-spin ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-3`}>Loading task details...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-10">
              <AlertTriangle size={28} className={`${isDark ? 'text-red-400' : 'text-red-500'}`} />
              <p className={`font-medium mt-2 ${isDark ? 'text-red-300' : 'text-red-700'}`}>Error loading details</p>
              <p className={`text-sm mt-1 ${isDark ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
            </div>
          )}

          {!loading && !error && task && (
            <>
              <section>
                <SectionHeader icon={Info} title="Overview" /> {/* SectionHeader needs to adapt to isDark if its colors are static */}
                <DetailItem icon={FileText} label="Title" value={task.title} highlight />
                <DetailItem icon={FileText} label="Description">
                  <p className={`text-sm whitespace-pre-wrap leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {task.description || "N/A"}
                  </p>
                </DetailItem>
                 {task.category && (
                  <DetailItem icon={Tag} label="Category" value={task.category} />
                 )}
              </section>

              <section>
                <SectionHeader icon={CheckCircle} title="Status & Priority" />
                <DetailItem icon={Clock} label="Status">
                  <TaskStatusBadge status={task.status} />
                </DetailItem>
                <DetailItem icon={BarChart} label="Priority">
                  {/* Assuming task.priority is available. If not, it will show "Normal" or "N/A" */}
                  <PriorityBadge priority={task.priority} />
                </DetailItem>
              </section>

              <section>
                <SectionHeader icon={User} title="Assignment & Timeline" />
                <DetailItem icon={User} label="Assigned To" value={task.assignedTo} />
                <DetailItem icon={Calendar} label="Due Date">
                  <span className={`${task.isOverdue ? (isDark ? 'text-red-400 font-medium' : 'text-red-600 font-medium') : (isDark ? 'text-gray-200' : 'text-gray-800')}`}>
                    {task.dueDate} {task.isOverdue && '(Overdue)'}
                  </span>
                </DetailItem>
                <DetailItem icon={Clock} label="Date Created" value={formatDate(task.date_created, true)} />
                <DetailItem icon={Edit3} label="Last Updated" value={formatDate(task.date_updated, true)} />
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end p-4 space-x-3 border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} rounded-b-xl`}>
            <button
                onClick={() => { onEditTask(task); onClose(); }}
                className={`px-4 py-2 text-xs rounded-md flex items-center ${isDark ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
                <Edit3 size={14} className="mr-2" /> Edit
            </button>

            {/* Status Change Dropdown */}
            <div className="relative inline-block text-left" ref={statusMenuRef}>
                <div>
                    <button
                        type="button"
                        onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                        className={`px-4 py-2 text-xs rounded-md flex items-center ${isDark ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                    >
                        Change Status <ChevronDown size={14} className="ml-1 -mr-1" />
                    </button>
                </div>
                {isStatusMenuOpen && (
                    <div className={`origin-top-right absolute right-0 bottom-full mb-2 w-40 rounded-md shadow-lg z-20 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200 ring-1 ring-black ring-opacity-5'}`}>
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            {statusOptions.filter(s => s.replace('_', ' ').toLowerCase() !== task.status?.toLowerCase()).map(statusOpt => (
                                <button
                                    key={statusOpt}
                                    onClick={() => { onChangeStatus(task.id, statusOpt); setIsStatusMenuOpen(false); onClose(); }}
                                    className={`block w-full text-left px-4 py-2 text-xs capitalize ${isDark ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                    role="menuitem"
                                >
                                    Mark as {statusOpt.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>


            {task.status?.toLowerCase() !== 'completed' && (
                <button
                    onClick={() => { onMarkComplete(task.id); onClose(); }}
                    className={`px-4 py-2 text-xs rounded-md flex items-center ${isDark ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                    <CheckSquare size={14} className="mr-2" /> Mark Complete
                </button>
            )}
            <button
                onClick={() => { onDeleteTask(task); /* onClose might be handled by TasksSection after delete */ }}
                className={`px-4 py-2 text-xs rounded-md flex items-center ${isDark ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
            >
                <Trash2 size={14} className="mr-2" /> Delete
            </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;