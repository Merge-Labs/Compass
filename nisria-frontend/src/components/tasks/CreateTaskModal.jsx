import React, { useState, useEffect } from 'react';
import { X, Calendar, UserPlus, AlertCircle, Loader2, CheckSquare, FileText, Flag, Target, Tag, Building } from 'lucide-react'; // Added Building
import api from '../../services/api';
import UserSelectionModal from './UserSelectionModal';
import { useTheme } from '../../context/ThemeProvider';
import GrantSelectionModal from './GrantSelectionModal'; // Import GrantSelectionModal

const initialFormData = {
  title: '',
  description: '',
  assigned_to: null, // Will store user ID
  status: 'todo',
  priority: 'medium',
  due_date: '',
  grant: '', // Grant ID
};

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState(initialFormData);
  const [selectedUserName, setSelectedUserName] = useState('Assign User');
  const [selectedGrantName, setSelectedGrantName] = useState('Select Grant'); // State for grant name
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserSelectionModalOpen, setIsUserSelectionModalOpen] = useState(false);
  const [isGrantSelectionModalOpen, setIsGrantSelectionModalOpen] = useState(false); // State for grant modal

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setSelectedUserName('Assign User');
      setSelectedGrantName('Select Grant');
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleUserSelect = (userId, userName) => {
    setFormData((prev) => ({ ...prev, assigned_to: userId }));
    setSelectedUserName(userName || 'User Selected');
    setIsUserSelectionModalOpen(false);
    if (errors.assigned_to) {
      setErrors((prev) => ({ ...prev, assigned_to: '' }));
    }
  };

  const handleGrantSelect = (grantId, grantName) => {
    setFormData((prev) => ({ ...prev, grant: grantId }));
    setSelectedGrantName(grantName || 'Grant Selected');
    setIsGrantSelectionModalOpen(false);
    if (errors.grant) {
      setErrors((prev) => ({ ...prev, grant: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    else if (formData.title.trim().length > 255) newErrors.title = 'Title cannot exceed 255 characters.';
    
    // Description is nullable, so no validation unless specific business rules apply
    // assigned_to is nullable
    // grant is nullable

    // Due date validation (optional: can't be in the past)
    if (formData.due_date && new Date(formData.due_date) < new Date().setHours(0,0,0,0)) {
      newErrors.due_date = "Due date cannot be in the past.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    const payload = {
      ...formData,
      description: formData.description || null,
      assigned_to: formData.assigned_to || null,
      due_date: formData.due_date || null,
      grant: formData.grant || null,
    };

    try {
      await api.post('/api/tasks/create/', payload);
      onTaskCreated(); // Callback to refresh the tasks list
      onClose(); // Close this modal
      // Optionally, show a success notification
    } catch (error) {
      console.error('Failed to create task:', error.response?.data || error.message);
      const apiErrors = error.response?.data;
      if (apiErrors && typeof apiErrors === 'object') {
        setErrors(apiErrors);
      } else {
        setErrors({ form: 'Failed to create task. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = `w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    isDark ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;
  const labelClasses = `block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;
  const errorTextClasses = "text-red-500 text-xs mt-1";

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className={`rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col glass-panel ${isDark ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/70 border border-white/40'}`}>
          <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create New Task</h3>
            <button onClick={onClose} className={`p-1 rounded-full ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            {errors.form && <p className={`${errorTextClasses} p-2 bg-red-500/10 rounded-md`}>{errors.form}</p>}
            
            <div>
              <label htmlFor="title" className={labelClasses}>Title <span className="text-red-500">*</span></label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className={inputClasses} placeholder="Enter task title" />
              {errors.title && <p className={errorTextClasses}>{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className={labelClasses}>Description</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows="3" className={inputClasses} placeholder="Enter task description (optional)"></textarea>
              {errors.description && <p className={errorTextClasses}>{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className={labelClasses}>Status</label>
                <select name="status" id="status" value={formData.status} onChange={handleInputChange} className={inputClasses}>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
                {errors.status && <p className={errorTextClasses}>{errors.status}</p>}
              </div>
              <div>
                <label htmlFor="priority" className={labelClasses}>Priority</label>
                <select name="priority" id="priority" value={formData.priority} onChange={handleInputChange} className={inputClasses}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {errors.priority && <p className={errorTextClasses}>{errors.priority}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="assigned_to" className={labelClasses}>Assigned To</label>
              <button
                type="button"
                onClick={() => setIsUserSelectionModalOpen(true)}
                className={`${inputClasses} text-left flex items-center justify-between ${formData.assigned_to ? (isDark ? 'text-blue-300' : 'text-blue-600') : ''}`}
              >
                <span>{selectedUserName}</span>
                <UserPlus size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
              </button>
              {errors.assigned_to && <p className={errorTextClasses}>{errors.assigned_to}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="due_date" className={labelClasses}>Due Date</label>
                <div className="relative">
                  <input type="date" name="due_date" id="due_date" value={formData.due_date} onChange={handleInputChange} className={`${inputClasses} pr-8`} />
                  <Calendar size={16} className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                {errors.due_date && <p className={errorTextClasses}>{errors.due_date}</p>}
              </div>
              <div>
                <label htmlFor="grant" className={labelClasses}>Grant (Optional)</label>
                <button
                  type="button"
                  onClick={() => setIsGrantSelectionModalOpen(true)}
                  className={`${inputClasses} text-left flex items-center justify-between ${formData.grant ? (isDark ? 'text-blue-300' : 'text-blue-600') : ''}`}
                >
                  <span>{selectedGrantName}</span>
                  <Building size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                </button>
                {errors.grant && <p className={errorTextClasses}>{errors.grant}</p>}
              </div>
            </div>

            <div className={`pt-4 border-t flex justify-end space-x-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                  isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm rounded-md flex items-center justify-center font-medium text-white transition-colors ${
                  isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Task'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isUserSelectionModalOpen && (
        <UserSelectionModal
          isOpen={isUserSelectionModalOpen}
          onClose={() => setIsUserSelectionModalOpen(false)}
          onUserSelect={handleUserSelect}
        />
      )}

      {isGrantSelectionModalOpen && (
        <GrantSelectionModal
          isOpen={isGrantSelectionModalOpen}
          onClose={() => setIsGrantSelectionModalOpen(false)}
          onGrantSelect={handleGrantSelect}
        />
      )}
    </>
  );
};

export default CreateTaskModal;