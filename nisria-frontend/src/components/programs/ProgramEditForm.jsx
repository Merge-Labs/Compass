import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  X,
  Building2,
  DollarSign,
  Users,
  AlertCircle,
  Loader2,
} from "lucide-react";

const ProgramEditForm = ({ isOpen, onClose, program, onProgramUpdated }) => {
  const [formData, setFormData] = useState({
    description: "",
    monthly_budget: "",
    annual_budget: "",
    // maintainers: [], // Placeholder for now, assuming it's a list of IDs
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when program prop changes or modal opens
  useEffect(() => {
    if (isOpen && program) {
      setFormData({
        description: program.description || "",
        monthly_budget: program.monthly_budget || "",
        annual_budget: program.annual_budget || "",
        // maintainers: program.maintainers || [], // Initialize maintainers if available
      });
      setErrors({}); // Clear errors when opening for a new program
    }
  }, [isOpen, program]);

  if (!isOpen || !program) return null; // Don't render if not open or no program data

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

  const validateForm = () => {
    const newErrors = {};

    // Basic validation (adjust based on your backend requirements)
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length > 500) {
      newErrors.description = "Max 500 characters";
    }

    if (
      formData.monthly_budget === null ||
      formData.monthly_budget === undefined ||
      String(formData.monthly_budget).trim() === ""
    ) {
      newErrors.monthly_budget = "Monthly budget is required";
    } else if (
      isNaN(parseFloat(formData.monthly_budget)) ||
      parseFloat(formData.monthly_budget) < 0
    ) {
      newErrors.monthly_budget = "Must be a valid positive number";
    }

    if (
      formData.annual_budget === null ||
      formData.annual_budget === undefined ||
      String(formData.annual_budget).trim() === ""
    ) {
      newErrors.annual_budget = "Annual budget is required";
    } else if (
      isNaN(parseFloat(formData.annual_budget)) ||
      parseFloat(formData.annual_budget) < 0
    ) {
      newErrors.annual_budget = "Must be a valid positive number";
    }

    // Add validation for maintainers if needed later

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const payload = {
      description: formData.description,
      monthly_budget: String(formData.monthly_budget), // Ensure string for decimal
      annual_budget: String(formData.annual_budget), // Ensure string for decimal
      // maintainers: formData.maintainers, // Include maintainers in payload
    };

    try {
      const response = await api.patch(`/api/programs/programs/${program.id}/`, payload);
      console.log("Program updated:", response.data);
      // alert('Program updated successfully!'); // TODO add pop up
      if (onProgramUpdated) onProgramUpdated(response.data); // Callback with updated program data
      onClose(); // Close modal on success
    } catch (error) {
      console.error(
        "Error updating program:",
        error.response?.data || error.message
      );
      let errorMessage =
        "Error updating program. Please check the form for errors or try again.";
      if (error.response && error.response.data) {
        const backendErrors = {};
        let specificMessages = [];
        if (
          typeof error.response.data === "object" &&
          error.response.data !== null
        ) {
          for (const key in error.response.data) {
            const message = Array.isArray(error.response.data[key])
              ? error.response.data[key].join(", ")
              : String(error.response.data[key]);
            // Check if the key is one of the form fields
            if (Object.prototype.hasOwnProperty.call(formData, key)) {
                 backendErrors[key] = message;
            } else {
                 specificMessages.push(`${key}: ${message}`);
            }
          }
          if (Object.keys(backendErrors).length > 0) {
            setErrors((prevErrors) => ({ ...prevErrors, ...backendErrors }));
            errorMessage = "Please check the form for errors.";
          }
          if (specificMessages.length > 0) {
            errorMessage = specificMessages.join("\n");
          } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          }
        } else if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        }
      }
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAndClose = () => {
    setErrors({}); // Clear errors on cancel
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Edit Program: {program.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Update the details for this program
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
          <div className="grid grid-cols-1 gap-6">
            {/* Program Details */}
            <div>
              <h3 className="h5 text-s1 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Program Details
              </h3>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClasses}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={inputClasses}
                placeholder="Enter program description"
                maxLength={500}
              />
              {errors.description && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Monthly Budget */}
            <div>
              <label htmlFor="monthly_budget" className={labelClasses}>
                Monthly Budget *
              </label>
              <input
                type="number"
                id="monthly_budget"
                name="monthly_budget"
                value={formData.monthly_budget}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.monthly_budget && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.monthly_budget}
                </p>
              )}
            </div>

            {/* Annual Budget */}
            <div>
              <label htmlFor="annual_budget" className={labelClasses}>
                Annual Budget *
              </label>
              <input
                type="number"
                id="annual_budget"
                name="annual_budget"
                value={formData.annual_budget}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.annual_budget && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.annual_budget}
                </p>
              )}
            </div>

            {/* Maintainers (Placeholder) */}
            {/* You would replace this with a proper user selection component later */}
            {/*
            <div>
              <label htmlFor="maintainers" className={labelClasses}>
                Maintainers
              </label>
              <input
                type="text" // Placeholder input
                id="maintainers"
                name="maintainers"
                value={formData.maintainers.join(', ')} // Display as comma-separated string
                onChange={(e) => {
                    // Simple parsing for placeholder, replace with actual logic
                    setFormData(prev => ({ ...prev, maintainers: e.target.value.split(',').map(id => id.trim()).filter(id => id) }));
                }}
                className={inputClasses}
                placeholder="Enter maintainer IDs (comma-separated)"
              />
               {errors.maintainers && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.maintainers}
                </p>
              )}
            </div>
            */}

          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancelAndClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors base-bold"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors base-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Program"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramEditForm;