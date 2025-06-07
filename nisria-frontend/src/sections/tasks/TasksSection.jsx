import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  Calendar,
  MoreVertical,
  Filter,
  Search,
  Plus,
  Loader2, // Added for loading state
  AlertTriangle as ErrorIcon, // Added for error state
  Edit3,
  Trash2,
  CheckSquare,
  ChevronDown,
} from 'lucide-react';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import api from '../../services/api'; // Import your API service
import CreateTaskModal from '../../components/tasks/CreateTaskModal'; // Import the new CreateTaskModal
import { useAuth } from '../../context/AuthProvider'; // Import useAuth to check user role
import ConfirmDeleteModal from '../../components/shared/ConfirmDeleteModal'; // Import ConfirmDeleteModal
import UpdateTaskModal from '../../components/tasks/UpdateTaskModal'; // Import UpdateTaskModal

const TasksSection = ({ title = "All Tasks", showHeader = true, appTheme = 'light' }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // State for fetched tasks, loading, and error
  const [allTasks, setAllTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState(null);

  // State for TaskDetailModal
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // State for CreateTaskModal
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const { user } = useAuth(); // Get user from AuthProvider

  // State for ConfirmDeleteModal
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // State for UpdateTaskModal
  const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);

  // Priority colors and icons
  const getPriorityConfig = (priority) => {
    const configs = {
      high: {
        color: appTheme === 'light' ? 'text-red-500' : 'text-red-400',
        bgColor: appTheme === 'light' ? 'bg-red-50' : 'bg-red-900/30',
        dotColor: appTheme === 'light' ? 'bg-red-500' : 'bg-red-400',
        label: 'High'
      },
      medium: {
        color: appTheme === 'light' ? 'text-yellow-500' : 'text-yellow-400',
        bgColor: appTheme === 'light' ? 'bg-yellow-50' : 'bg-yellow-900/30',
        dotColor: appTheme === 'light' ? 'bg-yellow-500' : 'bg-yellow-400',
        label: 'Medium'
      },
      low: {
        color: appTheme === 'light' ? 'text-green-500' : 'text-green-400',
        bgColor: appTheme === 'light' ? 'bg-green-50' : 'bg-green-900/30',
        dotColor: appTheme === 'light' ? 'bg-green-500' : 'bg-green-400',
        label: 'Low'
      }
    };
    return configs[priority.toLowerCase()] || configs.medium;
  };

  // Status colors and icons
  const getStatusConfig = (status) => {
    const configs = {
      todo: {
        icon: Clock,
        color: appTheme === 'light' ? 'text-blue-500' : 'text-blue-400',
        bgColor: appTheme === 'light' ? 'bg-blue-50' : 'bg-blue-900/30',
        label: 'To Do'
      },
      'in-progress': {
        icon: AlertCircle,
        color: appTheme === 'light' ? 'text-orange-500' : 'text-orange-400',
        bgColor: appTheme === 'light' ? 'bg-orange-50' : 'bg-orange-900/30',
        label: 'In Progress'
      },
      completed: {
        icon: CheckCircle2,
        color: appTheme === 'light' ? 'text-green-500' : 'text-green-400',
        bgColor: appTheme === 'light' ? 'bg-green-50' : 'bg-green-900/30',
        label: 'Completed'
      }
    };
    return configs[status.toLowerCase()] || configs.todo;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const now = new Date();
    
    // Clear time part for accurate day difference calculation
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = dateOnly - nowOnly; // Difference in ms
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > -7 && diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7 && diffDays > 0) return `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Check if due date is overdue
  const isOverdue = (dueDateString, status) => {
    if (!dueDateString || status === 'completed') return false;
    const dueDate = new Date(dueDateString);
    const now = new Date();
    // Set time to end of day for due date to ensure tasks due 'today' aren't overdue until tomorrow
    dueDate.setHours(23, 59, 59, 999); 
    return dueDate < now;
  };

  // Fetch tasks from API
  const fetchTasksData = useCallback(async () => {
    setIsLoadingTasks(true);
    setTasksError(null);
    try {
      const response = await api.get("/api/tasks/"); // Adjust endpoint if needed
      const tasksFromApi = response.data.results || response.data;
      if (Array.isArray(tasksFromApi)) {
        // Sort by newest first, or any other default sorting
        setAllTasks(tasksFromApi.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      } else {
        console.error("Tasks API response is not an array:", response.data);
        setAllTasks([]);
        setTasksError("Received an unexpected format for tasks.");
      }
    } catch (error) {
      console.error("Failed to fetch tasks data:", error);
      setTasksError(error.response?.data?.detail || error.message || "Could not load tasks.");
      setAllTasks([]);
    } finally {
      setIsLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    fetchTasksData();
  }, [fetchTasksData]);

  // Filter tasks
  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = (task.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (task.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'assigned') return task.assigned_to_details;
    if (filter === 'unassigned') return !task.assigned_to_details;
    if (filter === 'overdue') return isOverdue(task.due_date, task.status);
    if (filter === 'my_tasks' && user?.email) return task.assigned_to_details?.email === user.email;
    if (filter === 'grant') return task.is_grant_follow_up_task;
    return task.status?.toLowerCase() === filter;
  });

  const transformTaskForModal = (task) => {
    if (!task) return null;
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      assignedTo: task.assigned_to_details?.full_name || "Unassigned",
      dueDate: formatDate(task.due_date), // Use the same formatting as in TaskItem
      status: task.status, // TaskDetailModal's TaskStatusBadge handles capitalization
      category: task.is_grant_follow_up_task ? "Grant" : null,
      isOverdue: isOverdue(task.due_date, task.status),
      priority: task.priority, // TaskDetailModal's PriorityBadge handles capitalization
      date_created: task.created_at, // Assuming 'created_at' is available from API
      date_updated: task.updated_at, // Assuming 'updated_at' is available from API
    };
  };

  const handleOpenTaskModal = (task) => {
    const modalTaskData = transformTaskForModal(task);
    setSelectedTaskForModal(modalTaskData);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskForModal(null);
  };

  const handleOpenUpdateModal = (task) => {
    setTaskToUpdate(task);
    setIsUpdateTaskModalOpen(true);
  };

  const handleTaskUpdated = () => {
    fetchTasksData(); // Refresh tasks list
    // If the detailed modal was open for this task, refresh its data or close it
    if (selectedTaskForModal && taskToUpdate && selectedTaskForModal.id === taskToUpdate.id) {
      // Option 1: Close detail modal
      // handleCloseTaskModal();
      // Option 2: Refetch detail modal data (if it fetches its own data)
      // Or, update selectedTaskForModal directly if possible
      const updatedTaskFromList = allTasks.find(t => t.id === taskToUpdate.id);
      if (updatedTaskFromList) {
        setSelectedTaskForModal(transformTaskForModal(updatedTaskFromList));
      }
    }
  };

  const handleDeleteInitiated = (task) => {
    setTaskToDelete(task);
    setDeleteError(null);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await api.delete(`/api/tasks/${taskToDelete.id}/delete/`);
      setIsConfirmDeleteOpen(false);
      setTaskToDelete(null);
      fetchTasksData(); // Refresh tasks list
       // If the detailed modal was open for this task, close it
      if (selectedTaskForModal && selectedTaskForModal.id === taskToDelete.id) {
        handleCloseTaskModal();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      setDeleteError(error.response?.data?.detail || "Could not delete task. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkComplete = async (taskId) => {
    try {
      await api.post(`/api/tasks/${taskId}/mark_complete/`);
      fetchTasksData(); // Refresh tasks list
    } catch (error) {
      console.error("Failed to mark task complete:", error);
      // Add user feedback, e.g., a toast notification
    }
  };

  const handleChangeStatus = async (taskId, newStatus) => {
    try {
      await api.post(`/api/tasks/${taskId}/change_status/`, { status: newStatus });
      fetchTasksData();
    } catch (error) {
      console.error("Failed to change task status:", error);
      // Add user feedback
    }
  };

  const TaskItem = ({ task }) => {
    const statusConfig = getStatusConfig(task.status);
    const priorityConfig = getPriorityConfig(task.priority);
    const StatusIcon = statusConfig.icon;
    const isTaskOverdue = isOverdue(task.due_date, task.status);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = React.useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsMenuOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className={`flex items-start space-x-3 p-3 rounded-lg transition-colors duration-150 group ${appTheme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700/30'}`}>
        <div className={`${statusConfig.bgColor} p-2 rounded-full flex-shrink-0 mt-0.5`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="flex items-start justify-between cursor-pointer"
            onClick={() => handleOpenTaskModal(task)} // Make title area clickable
          >
            <div className="flex-1">
              <h4 className={`text-sm font-medium truncate ${appTheme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                {task.title}
              </h4>
              <p className={`text-xs mt-1 line-clamp-2 ${appTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                {task.description}
              </p>
            </div>

            <div className="relative flex items-center space-x-2 ml-3 flex-shrink-0" ref={menuRef}>
              <div className={`w-2 h-2 rounded-full ${priorityConfig.dotColor}`}></div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <MoreVertical className={`w-4 h-4 ${appTheme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'}`} />
              </button>
              {isMenuOpen && (
                <div className={`absolute right-0 top-full mt-1 w-48 z-10 rounded-md shadow-lg border ${appTheme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                  <div className="py-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenUpdateModal(task); setIsMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center ${appTheme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                      <Edit3 size={14} className="mr-2" /> Edit Task
                    </button>
                    {task.status !== 'completed' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkComplete(task.id); setIsMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center ${appTheme === 'light' ? 'text-green-600 hover:bg-green-50' : 'text-green-400 hover:bg-green-700/30'}`}
                      >
                        <CheckSquare size={14} className="mr-2" /> Mark Complete
                      </button>
                    )}
                    {/* Basic Change Status - could be a submenu for more options */}
                    {task.status !== 'todo' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleChangeStatus(task.id, 'todo'); setIsMenuOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-xs flex items-center ${appTheme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700'}`}
                        >Mark as To Do</button>
                    )}
                    {task.status !== 'in_progress' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleChangeStatus(task.id, 'in_progress'); setIsMenuOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-xs flex items-center ${appTheme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700'}`}
                        >Mark In Progress</button>
                    )}
                     {task.status !== 'on_hold' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleChangeStatus(task.id, 'on_hold'); setIsMenuOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-xs flex items-center ${appTheme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700'}`}
                        >Mark On Hold</button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteInitiated(task); setIsMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center ${appTheme === 'light' ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-700/30'}`}
                    >
                      <Trash2 size={14} className="mr-2" /> Delete Task
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4">
              {task.assigned_to_details ? (
                <div className="flex items-center space-x-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${appTheme === 'light' ? 'bg-gray-200' : 'bg-gray-600'}`}>
                    <User className={`w-3 h-3 ${appTheme === 'light' ? 'text-gray-600' : 'text-gray-300'}`} />
                  </div>
                  <span className={`text-xs truncate max-w-20 ${appTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {task.assigned_to_details.full_name?.trim() || 'N/A'}
                  </span>
                </div>
              ) : (
                <span className={`text-xs ${appTheme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>Unassigned</span>
              )}

              {task.is_grant_follow_up_task && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${appTheme === 'light' ? 'bg-purple-100 text-purple-800' : 'bg-purple-900/50 text-purple-300'}`}>
                  Grant
                </span>
              )}
            </div>

            <div className={`flex items-center space-x-1 text-xs ${
              isTaskOverdue ? (appTheme === 'light' ? 'text-red-500' : 'text-red-400') : (appTheme === 'light' ? 'text-gray-500' : 'text-gray-400')
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.due_date)}</span>
              {isTaskOverdue && <span className="font-medium">(Overdue)</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`rounded-xl shadow-sm border h-full flex flex-col ${appTheme === 'light' ? 'bg-white border-gray-100' : 'bg-[var(--color-s1)] border-gray-700'}`}>
      {showHeader && (
        <div className={`p-6 border-b ${appTheme === 'light' ? 'border-gray-100' : 'border-gray-700'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${appTheme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>{title}</h3>
            <div className="flex items-center space-x-2">
              <button className={`p-1 rounded ${appTheme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}>
                <Filter className={`w-4 h-4 ${appTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
              </button>
              {user?.role === 'super_admin' && (
                <button
                  onClick={() => setIsCreateTaskModalOpen(true)}
                  className={`p-1 rounded ${appTheme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}
                >
                  <Plus className={`w-4 h-4 ${appTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${appTheme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${appTheme === 'light' ? 'border-gray-200 bg-white text-gray-900' : 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400'}`}
              />
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-1">
              {[
                { key: 'all', label: 'All' }, { key: 'todo', label: 'To Do' }, { key: 'in-progress', label: 'In Progress' },
                { key: 'completed', label: 'Completed' }, { key: 'my_tasks', label: 'My Tasks' },
                { key: 'assigned', label: 'Assigned (All)' }, { key: 'unassigned', label: 'Unassigned' },
                { key: 'overdue', label: 'Overdue' }, { key: 'grant', label: 'Grant Tasks' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    filter === key
                      ? (appTheme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/30 text-blue-300')
                      : (appTheme === 'light' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-gray-700 text-gray-300 hover:bg-gray-600')
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {isLoadingTasks ? (
          <div className={`flex flex-col items-center justify-center h-full ${appTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            <Loader2 className={`w-10 h-10 animate-spin mb-3 ${appTheme === 'light' ? 'text-blue-500' : 'text-blue-400'}`} />
            <p className="text-sm">Loading tasks...</p>
          </div>
        ) : tasksError ? (
          <div className={`flex flex-col items-center justify-center h-full p-6 text-center ${appTheme === 'light' ? 'text-red-600' : 'text-red-400'}`}>
            <ErrorIcon className="w-10 h-10 mb-3" />
            <p className="text-sm font-medium">Error loading tasks</p>
            <p className="text-xs mt-1">{tasksError}</p>
            <button
              onClick={fetchTasksData}
              className={`mt-4 px-4 py-2 text-xs rounded-lg border transition-colors ${appTheme === 'light' ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-red-900/30 text-red-300 border-red-700 hover:bg-red-800/50'}`}
            >
              Retry
            </button>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="p-3">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center h-full ${appTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            <Clock className={`w-8 h-8 mb-2 ${appTheme === 'light' ? 'text-gray-300' : 'text-gray-600'}`} />
            <p className="text-sm">No tasks found for current filter</p>
          </div>
        )}
      </div>
      <div className={`p-4 border-t ${appTheme === 'light' ? 'border-gray-100 bg-gray-50' : 'border-gray-700 bg-gray-800/50'}`}>
        <div className={`flex justify-between text-xs ${appTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          <span>{filteredTasks.length} tasks</span>
          <span>
            {filteredTasks.filter(t => isOverdue(t.due_date, t.status)).length} overdue
          </span>
        </div>
      </div>

      <TaskDetailModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        task={selectedTaskForModal}
        onMarkComplete={handleMarkComplete}
        onDeleteTask={handleDeleteInitiated}
        onEditTask={handleOpenUpdateModal}
        onChangeStatus={handleChangeStatus}
        appTheme={appTheme}
      />

      {user?.role === 'super_admin' && (
        <CreateTaskModal
          isOpen={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          onTaskCreated={fetchTasksData} // To refresh the task list after creation
        />
      )}

      {user?.role === 'super_admin' && taskToUpdate && (
        <UpdateTaskModal
          isOpen={isUpdateTaskModalOpen}
          onClose={() => { setIsUpdateTaskModalOpen(false); setTaskToUpdate(null); }}
          onTaskUpdated={handleTaskUpdated}
          taskData={taskToUpdate}
        />
      )}

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={taskToDelete?.title}
        itemType="task"
        isProcessing={isDeleting}
        customError={deleteError}
      />
    </div>
  );
};

export default TasksSection;