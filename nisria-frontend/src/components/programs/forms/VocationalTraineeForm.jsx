import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { X, AlertCircle, User, Briefcase, Phone, Mail, Calendar as CalendarIcon, CheckSquare, Loader2 } from 'lucide-react';

const initialFormData = {
  trainee_name: '',
  course_enrolled: '',
  training_center: '',
  trainee_phone: '',
  trainee_email: '', // Added
  date_enrolled: '', // Added
  start_date: '',
  expected_end_date: '',
  under_training: true,
  // trainee_association will be derived from props or set in payload
  // trainer (ID) will be from props
};

const VocationalTraineeForm = ({ isOpen, onClose, onTraineeAdded, programId, divisionName, trainerId, trainerAssociationFromProps }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      // Clear previous errors, but check for essential props immediately
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        if (!trainerId || !trainerAssociationFromProps) {
          newErrors.form = "Trainer details (ID or Association) are missing. Cannot add trainee.";
        } else if (newErrors.form === "Trainer details (ID or Association) are missing. Cannot add trainee.") {
          // Clear this specific error if props are now available
          delete newErrors.form;
        }
        return newErrors;
      });
    }
  }, [isOpen, trainerId, trainerAssociationFromProps]); // Add trainerId and trainerAssociationFromProps to dependencies

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.trainee_name.trim()) newErrors.trainee_name = "Trainee name is required.";
    if (!formData.course_enrolled.trim()) newErrors.course_enrolled = "Course is required.";
    if (!formData.training_center.trim()) newErrors.training_center = "Training center is required.";
    if (!formData.trainee_email.trim()) newErrors.trainee_email = "Trainee email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.trainee_email)) newErrors.trainee_email = "Email address is invalid.";
    if (!formData.date_enrolled) newErrors.date_enrolled = "Date enrolled is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !programId || !divisionName) {
      setErrors(prev => ({ ...prev, form: "Program or Division information is missing." }));
      return;
    }
    setIsSubmitting(true);
    if (!trainerId) {
      setErrors(prev => ({ ...prev, form: "Trainer information is missing." }));
      setIsSubmitting(false);
      return;
    }
    if (!trainerAssociationFromProps) {
      setErrors(prev => ({ ...prev, form: "Trainer association is missing. Cannot submit." }));
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      program_id: programId, // Changed from 'program' to 'program_id'
      trainer: trainerId,    // Added trainer ID
      trainee_association: trainerAssociationFromProps || '', // Added trainee_association from props
      start_date: formData.start_date || null,
      expected_end_date: formData.expected_end_date || null,
      // date_enrolled is already in formData
    };

    try {
      const endpoint = `/api/programs/${divisionName.toLowerCase()}/vocational-trainers/${trainerId}/trainees/`;
      const response = await api.post(endpoint, payload);
      onTraineeAdded(response.data);
      onClose();
    } catch (error) {
      console.error("Error adding vocational trainee:", error.response?.data || error.message);
      const backendErrors = error.response?.data;
      if (typeof backendErrors === 'object' && backendErrors !== null) {
        setErrors(prev => ({ ...prev, ...backendErrors, form: backendErrors.detail || "Submission failed. Please check fields."}));
      } else {
        setErrors({ form: "An unexpected error occurred." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5";
  const errorClasses = "text-red-600 text-xs mt-1 flex items-center gap-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Add Vocational Trainee</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"><X size={22} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errors.form && <p className={`${errorClasses} p-3 bg-red-50 border border-red-200 rounded-md`}><AlertCircle size={16}/>{errors.form}</p>}
          
          <div>
            <label htmlFor="trainee_name" className={labelClasses}>Trainee Name*</label>
            <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="trainee_name" name="trainee_name" value={formData.trainee_name} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Mary Wanjiku" /></div>
            {errors.trainee_name && <p className={errorClasses}><AlertCircle size={14}/>{errors.trainee_name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="course_enrolled" className={labelClasses}>Course Enrolled*</label>
              <div className="relative"><Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="course_enrolled" name="course_enrolled" value={formData.course_enrolled} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Plumbing, Tailoring" /></div>
              {errors.course_enrolled && <p className={errorClasses}><AlertCircle size={14}/>{errors.course_enrolled}</p>}
            </div>
            <div>
              <label htmlFor="training_center" className={labelClasses}>Training Center*</label>
              <div className="relative"><Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="training_center" name="training_center" value={formData.training_center} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., NITA, Local Polytechnic" /></div>
              {errors.training_center && <p className={errorClasses}><AlertCircle size={14}/>{errors.training_center}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="trainee_email" className={labelClasses}>Trainee Email*</label>
            <div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="email" id="trainee_email" name="trainee_email" value={formData.trainee_email} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., trainee@example.com" /></div>
            {errors.trainee_email && <p className={errorClasses}><AlertCircle size={14}/>{errors.trainee_email}</p>}
          </div>

          <div>
            <label htmlFor="trainee_phone" className={labelClasses}>Phone Number</label>
            <div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="tel" id="trainee_phone" name="trainee_phone" value={formData.trainee_phone} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., +254712345678" /></div>
            {errors.trainee_phone && <p className={errorClasses}><AlertCircle size={14}/>{errors.trainee_phone}</p>}
          </div>

          <div>
            <label htmlFor="date_enrolled" className={labelClasses}>Date Enrolled*</label>
            <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="date" id="date_enrolled" name="date_enrolled" value={formData.date_enrolled} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>
            {errors.date_enrolled && <p className={errorClasses}><AlertCircle size={14}/>{errors.date_enrolled}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="start_date" className={labelClasses}>Start Date</label>
              <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>
              {errors.start_date && <p className={errorClasses}><AlertCircle size={14}/>{errors.start_date}</p>}
            </div>
            <div>
              <label htmlFor="expected_end_date" className={labelClasses}>Expected End Date</label>
              <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="date" id="expected_end_date" name="expected_end_date" value={formData.expected_end_date} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>
              {errors.expected_end_date && <p className={errorClasses}><AlertCircle size={14}/>{errors.expected_end_date}</p>}
            </div>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="under_training" name="under_training" checked={formData.under_training} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="under_training" className="ml-2 block text-sm text-gray-900">Currently Under Training</label>
          </div>

          <div className="flex justify-end gap-4 pt-5 mt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || !trainerId || !trainerAssociationFromProps} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 font-medium flex items-center justify-center min-w-[150px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                "Add Trainee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VocationalTraineeForm;