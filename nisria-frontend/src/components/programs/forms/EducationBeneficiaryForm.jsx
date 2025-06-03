import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { X, AlertCircle, User, BookOpen, MapPin, Phone, Calendar as CalendarIcon, Briefcase } from 'lucide-react';

const initialFormData = {
  student_name: '',
  education_level: '',
  school_associated: '',
  student_location: '',
  student_contact: '',
  start_date: '',
  end_date: '',
  // program_id will be passed as a prop
};

const EducationBeneficiaryForm = ({ isOpen, onClose, onBeneficiaryAdded, programId, divisionName }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.student_name.trim()) newErrors.student_name = "Student name is required.";
    if (!formData.education_level.trim()) newErrors.education_level = "Education level is required.";
    if (!formData.school_associated.trim()) newErrors.school_associated = "School is required.";
    // Add more validations as needed (e.g., contact format, date logic)
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

    const payload = {
      ...formData,
      program: programId, // Assuming API expects program ID
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
    };

    try {
      const endpoint = `/api/programs/${divisionName.toLowerCase()}/education/`;
      const response = await api.post(endpoint, payload);
      onBeneficiaryAdded(response.data);
      onClose();
    } catch (error) {
      console.error("Error adding education beneficiary:", error.response?.data || error.message);
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
          <h3 className="text-xl font-bold text-gray-800">Add Education Beneficiary</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"><X size={22} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errors.form && <p className={`${errorClasses} p-3 bg-red-50 border border-red-200 rounded-md`}><AlertCircle size={16}/>{errors.form}</p>}
          
          <div>
            <label htmlFor="student_name" className={labelClasses}>Student Name*</label>
            <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="student_name" name="student_name" value={formData.student_name} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Jane Doe" /></div>
            {errors.student_name && <p className={errorClasses}><AlertCircle size={14}/>{errors.student_name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="education_level" className={labelClasses}>Education Level*</label>
              <div className="relative"><BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="education_level" name="education_level" value={formData.education_level} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., High School, University" /></div>
              {errors.education_level && <p className={errorClasses}><AlertCircle size={14}/>{errors.education_level}</p>}
            </div>
            <div>
              <label htmlFor="school_associated" className={labelClasses}>School Associated*</label>
              <div className="relative"><Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="school_associated" name="school_associated" value={formData.school_associated} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., XYZ High School" /></div>
              {errors.school_associated && <p className={errorClasses}><AlertCircle size={14}/>{errors.school_associated}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="student_location" className={labelClasses}>Student Location</label>
            <div className="relative"><MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="student_location" name="student_location" value={formData.student_location} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Nairobi, Kenya" /></div>
            {errors.student_location && <p className={errorClasses}><AlertCircle size={14}/>{errors.student_location}</p>}
          </div>

          <div>
            <label htmlFor="student_contact" className={labelClasses}>Student Contact (Phone/Email)</label>
            <div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="student_contact" name="student_contact" value={formData.student_contact} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., +2547... or student@example.com" /></div>
            {errors.student_contact && <p className={errorClasses}><AlertCircle size={14}/>{errors.student_contact}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="start_date" className={labelClasses}>Start Date</label>
              <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>
              {errors.start_date && <p className={errorClasses}><AlertCircle size={14}/>{errors.start_date}</p>}
            </div>
            <div>
              <label htmlFor="end_date" className={labelClasses}>End Date</label>
              <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="date" id="end_date" name="end_date" value={formData.end_date} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>
              {errors.end_date && <p className={errorClasses}><AlertCircle size={14}/>{errors.end_date}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-5 mt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 font-medium flex items-center justify-center min-w-[150px]">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Adding...
                </>
              ) : (
                "Add Beneficiary"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationBeneficiaryForm;