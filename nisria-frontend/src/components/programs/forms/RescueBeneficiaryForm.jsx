import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { X, AlertCircle, User, Calendar as CalendarIcon, MapPin, Phone, Info, CheckSquare, Users as GenderIcon } from 'lucide-react';

const initialFormData = {
  child_name: '',
  age: '',
  gender: 'Unknown', // Default to 'Unknown' or make it selectable
  date_found: '',
  place_found: '',
  rescuer_contact: '',
  circumstances: '',
  is_reunited: false,
  // program_id will be passed as a prop
};

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'Unknown', label: 'Unknown' },
];

const RescueBeneficiaryForm = ({ isOpen, onClose, onBeneficiaryAdded, programId, divisionName }) => {
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
    if (!formData.child_name.trim()) newErrors.child_name = "Child's name is required.";
    if (!formData.age.trim()) newErrors.age = "Age is required.";
    else if (isNaN(parseInt(formData.age)) || parseInt(formData.age) < 0) newErrors.age = "Age must be a valid number.";
    if (!formData.date_found) newErrors.date_found = "Date found is required.";
    if (!formData.place_found.trim()) newErrors.place_found = "Place found is required.";
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
      age: parseInt(formData.age),
    };

    try {
      const endpoint = `/api/programs/${divisionName.toLowerCase()}/rescue/`;
      const response = await api.post(endpoint, payload);
      onBeneficiaryAdded(response.data);
      onClose();
    } catch (error) {
      console.error("Error adding rescue beneficiary:", error.response?.data || error.message);
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
          <h3 className="text-xl font-bold text-gray-800">Add Rescue Beneficiary</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"><X size={22} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errors.form && <p className={`${errorClasses} p-3 bg-red-50 border border-red-200 rounded-md`}><AlertCircle size={16}/>{errors.form}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="child_name" className={labelClasses}>Child's Name*</label>
              <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="child_name" name="child_name" value={formData.child_name} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Baby John" /></div>
              {errors.child_name && <p className={errorClasses}><AlertCircle size={14}/>{errors.child_name}</p>}
            </div>
            <div>
              <label htmlFor="age" className={labelClasses}>Age*</label>
              <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., 5" /></div>
              {errors.age && <p className={errorClasses}><AlertCircle size={14}/>{errors.age}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="gender" className={labelClasses}>Gender</label>
            <div className="relative"><GenderIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className={`${inputClasses} pl-10`}>
                {genderOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            {errors.gender && <p className={errorClasses}><AlertCircle size={14}/>{errors.gender}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="date_found" className={labelClasses}>Date Found*</label>
              <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="date" id="date_found" name="date_found" value={formData.date_found} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>
              {errors.date_found && <p className={errorClasses}><AlertCircle size={14}/>{errors.date_found}</p>}
            </div>
            <div>
              <label htmlFor="place_found" className={labelClasses}>Place Found*</label>
              <div className="relative"><MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="place_found" name="place_found" value={formData.place_found} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Bus Station" /></div>
              {errors.place_found && <p className={errorClasses}><AlertCircle size={14}/>{errors.place_found}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="rescuer_contact" className={labelClasses}>Rescuer Contact</label>
            <div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="tel" id="rescuer_contact" name="rescuer_contact" value={formData.rescuer_contact} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., +254700000000" /></div>
            {errors.rescuer_contact && <p className={errorClasses}><AlertCircle size={14}/>{errors.rescuer_contact}</p>}
          </div>

          <div>
            <label htmlFor="circumstances" className={labelClasses}>Circumstances of Rescue</label>
            <div className="relative"><Info className="absolute left-3 top-3 text-gray-400 w-5 h-5" /><textarea id="circumstances" name="circumstances" value={formData.circumstances} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-10`} placeholder="Brief description of how the child was found..."></textarea></div>
            {errors.circumstances && <p className={errorClasses}><AlertCircle size={14}/>{errors.circumstances}</p>}
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="is_reunited" name="is_reunited" checked={formData.is_reunited} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="is_reunited" className="ml-2 block text-sm text-gray-900">Is Reunited</label>
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

export default RescueBeneficiaryForm;