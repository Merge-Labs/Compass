import React, { useState } from "react";
import {
  CheckSquare,
  Calendar,
  User,
  Flag,
  FileText,
  AlertCircle,
  Tag,
  Clock,
  Target,
  Users,
  X,
} from "lucide-react";

const initialFormData = {
  task_title: "",
  task_description: "",
  priority: "medium",
  status: "todo",
  assigned_to: "",
  due_date: "",
  estimated_hours: "",
  category: "",
  tags: [],
  notes: "",
};

const priorityOptions = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
  { value: "urgent", label: "Urgent" },
];

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Under Review" },
  { value: "completed", label: "Completed" },
  { value: "blocked", label: "Blocked" },
];

const categoryOptions = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "research", label: "Research" },
  { value: "testing", label: "Testing" },
  { value: "documentation", label: "Documentation" },
  { value: "meeting", label: "Meeting" },
  { value: "other", label: "Other" },
];

const tagOptions = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "bug", label: "Bug Fix" },
  { value: "feature", label: "New Feature" },
  { value: "optimization", label: "Optimization" },
  { value: "security", label: "Security" },
  { value: "ui-ux", label: "UI/UX" },
  { value: "api", label: "API" },
];

const TaskForm = ({ isOpen, onClose, onTaskAdded }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleTagChange = (tagValue) => {
    const newTags = formData.tags.includes(tagValue)
      ? formData.tags.filter(tag => tag !== tagValue)
      : [...formData.tags, tagValue];
    
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }));
    if (errors.tags) {
      setErrors((prev) => ({
        ...prev,
        tags: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.task_title.trim())
      newErrors.task_title = "Task title is required";
    else if (formData.task_title.trim().length > 255)
      newErrors.task_title = "Max 255 characters";

    if (!formData.task_description.trim())
      newErrors.task_description = "Task description is required";
    else if (formData.task_description.trim().length > 1000)
      newErrors.task_description = "Max 1000 characters";

    if (!formData.assigned_to.trim())
      newErrors.assigned_to = "Assignee is required";

    if (!formData.due_date)
      newErrors.due_date = "Due date is required";
    else if (new Date(formData.due_date) < new Date().setHours(0, 0, 0, 0))
      newErrors.due_date = "Due date cannot be in the past";

    if (formData.estimated_hours && (isNaN(parseFloat(formData.estimated_hours)) || parseFloat(formData.estimated_hours) <= 0))
      newErrors.estimated_hours = "Must be a positive number";

    if (!formData.category)
      newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const payload = {
      ...formData,
      estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
      notes: formData.notes || null,
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Task submitted:", payload);
      
      // Reset form
      setFormData(initialFormData);
      setErrors({});
      if (onTaskAdded) onTaskAdded(payload);
      onClose();
      
      // Show success message
      alert('Task added successfully!');
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("Error adding task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAndClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  const inputClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";
  const errorClasses = "text-red-500 text-sm mt-1 flex items-center gap-1";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 ease-in-out"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Add New Task</h3>
            <p className="text-sm text-gray-600 mt-1">
              Create a new task and assign it to team members
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-white/50 transition-all duration-200 hover:scale-105"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Task Details */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <CheckSquare className="w-6 h-6 text-blue-500" />
                Task Details
              </h3>
            </div>

            {/* Task Title */}
            <div className="lg:col-span-2">
              <label htmlFor="task_title" className={labelClasses}>
                Task Title *
              </label>
              <input
                type="text"
                id="task_title"
                name="task_title"
                value={formData.task_title}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="Enter task title"
                maxLength={255}
              />
              {errors.task_title && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.task_title}
                </p>
              )}
            </div>

            {/* Task Description */}
            <div className="lg:col-span-2">
              <label htmlFor="task_description" className={labelClasses}>
                Task Description *
              </label>
              <textarea
                id="task_description"
                name="task_description"
                value={formData.task_description}
                onChange={handleInputChange}
                rows={4}
                className={inputClasses}
                placeholder="Describe what needs to be done..."
                maxLength={1000}
              />
              {errors.task_description && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.task_description}
                </p>
              )}
            </div>

            {/* Assignment & Priority */}
            <div className="lg:col-span-2 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-green-500" />
                Assignment & Priority
              </h3>
            </div>

            {/* Assigned To */}
            <div>
              <label htmlFor="assigned_to" className={labelClasses}>
                Assigned To *
              </label>
              <input
                type="text"
                id="assigned_to"
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="Enter assignee name or email"
              />
              {errors.assigned_to && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.assigned_to}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className={labelClasses}>
                Priority <Flag className="inline w-4 h-4 ml-1" />
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className={inputClasses}
              >
                {priorityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeline & Estimation */}
            <div className="lg:col-span-2 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-500" />
                Timeline & Estimation
              </h3>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="due_date" className={labelClasses}>
                Due Date *
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                className={inputClasses}
              />
              {errors.due_date && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.due_date}
                </p>
              )}
            </div>

            {/* Estimated Hours */}
            <div>
              <label htmlFor="estimated_hours" className={labelClasses}>
                Estimated Hours
              </label>
              <input
                type="number"
                id="estimated_hours"
                name="estimated_hours"
                value={formData.estimated_hours}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="e.g., 8"
                min="0.5"
                step="0.5"
              />
              {errors.estimated_hours && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.estimated_hours}
                </p>
              )}
            </div>

            {/* Categorization */}
            <div className="lg:col-span-2 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Tag className="w-6 h-6 text-purple-500" />
                Categorization
              </h3>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className={labelClasses}>
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={inputClasses}
              >
                <option value="">Select a category</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className={labelClasses}>
                Status <Target className="inline w-4 h-4 ml-1" />
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={inputClasses}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="lg:col-span-2">
              <label className={labelClasses}>
                Tags
              </label>
              <div className="border border-gray-300 rounded-lg p-3 bg-white">
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => {
                    const tagOption = tagOptions.find(opt => opt.value === tag);
                    return (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tagOption?.label || tag}
                        <button
                          type="button"
                          onClick={() => handleTagChange(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {tagOptions.map((tag) => (
                    <label
                      key={tag.value}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(tag.value)}
                        onChange={() => handleTagChange(tag.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{tag.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="lg:col-span-2 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-500" />
                Additional Information
              </h3>
            </div>

            {/* Notes */}
            <div className="lg:col-span-2">
              <label htmlFor="notes" className={labelClasses}>
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className={inputClasses}
                placeholder="Any additional information, requirements, or notes about this task..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancelAndClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Task...
                </>
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;