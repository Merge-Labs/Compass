import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { X, AlertCircle, User, Users, MapPin, Phone, CheckSquare } from 'lucide-react';

const initialFormData = {
  person_name: '',
  chama_group: '',
  location: '',
  telephone: '',
  is_active: true,
  // program_id will be passed as a prop
};

const MicrofundBeneficiaryForm = ({ isOpen, onClose, onBeneficiaryAdded, programId, divisionName }) => {
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.person_name.trim()) newErrors.person_name = "Person's name is required.";
    if (!formData.chama_group.trim()) newErrors.chama_group = "Chama group is required.";
    if (!formData.telephone.trim()) newErrors.telephone = "Telephone number is required.";
    // Add more specific validation for telephone if needed (e.g., format)
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
      program: programId,
    };

    try {
      const endpoint = `/api/programs/${divisionName.toLowerCase()}/microfund/`;
      const response = await api.post(endpoint, payload);
      onBeneficiaryAdded(response.data);
      onClose();
    } catch (error) {
      console.error("Error adding microfund beneficiary:", error.response?.data || error.message);
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Add Microfund Beneficiary</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"><X size={22} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errors.form && <p className={`${errorClasses} p-3 bg-red-50 border border-red-200 rounded-md`}><AlertCircle size={16}/>{errors.form}</p>}
          
          <div>
            <label htmlFor="person_name" className={labelClasses}>Person's Name*</label>
            <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="person_name" name="person_name" value={formData.person_name} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., John Maina" /></div>
            {errors.person_name && <p className={errorClasses}><AlertCircle size={14}/>{errors.person_name}</p>}
          </div>

          <div>
            <label htmlFor="chama_group" className={labelClasses}>Chama Group*</label>
            <div className="relative"><Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="chama_group" name="chama_group" value={formData.chama_group} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Upendo Women Group" /></div>
            {errors.chama_group && <p className={errorClasses}><AlertCircle size={14}/>{errors.chama_group}</p>}
          </div>

          <div>
            <label htmlFor="location" className={labelClasses}>Location</label>
            <div className="relative"><MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Kiambu Town" /></div>
            {errors.location && <p className={errorClasses}><AlertCircle size={14}/>{errors.location}</p>}
          </div>

          <div>
            <label htmlFor="telephone" className={labelClasses}>Telephone*</label>
            <div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., +254712345678" /></div>
            {errors.telephone && <p className={errorClasses}><AlertCircle size={14}/>{errors.telephone}</p>}
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Is Active</label>
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

export default MicrofundBeneficiaryForm;