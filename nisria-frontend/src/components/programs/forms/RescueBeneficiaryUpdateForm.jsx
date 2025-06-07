import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { X, AlertCircle, User, Calendar as CalendarIcon, MapPin, Phone, Info, Users as GenderIcon, Loader2 } from 'lucide-react';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const RescueBeneficiaryUpdateForm = ({ isOpen, onClose, onBeneficiaryUpdated, existingBeneficiary, programId, divisionName }) => {
  const [formData, setFormData] = useState({
    child_name: '',
    age: '',
    gender: 'prefer_not_to_say',
    date_joined: '',
    place_found: '',
    rescuer_contact: '',
    circumstances: '',
    is_reunited: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = (beneficiary) => {
    if (beneficiary) {
      setFormData({
        child_name: beneficiary.child_name || '',
        age: beneficiary.age || '',
        gender: beneficiary.gender || 'prefer_not_to_say',
        date_joined: beneficiary.date_joined ? beneficiary.date_joined.split('T')[0] : '',
        place_found: beneficiary.place_found || '',
        rescuer_contact: beneficiary.rescuer_contact || '',
        circumstances: beneficiary.circumstances || '',
        is_reunited: beneficiary.is_reunited || false,
      });
    } else {
      setFormData({
        child_name: '',
        age: '',
        gender: 'prefer_not_to_say',
        date_joined: '',
        place_found: '',
        rescuer_contact: '',
        circumstances: '',
        is_reunited: false,
      });
    }
    setErrors({});
  };

  useEffect(() => {
    if (isOpen && existingBeneficiary) {
      resetForm(existingBeneficiary);
    }
  }, [isOpen, existingBeneficiary]);

  if (!isOpen || !existingBeneficiary) return null;

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
    if (formData.age === '' || formData.age === null) newErrors.age = "Age is required.";
    else if (isNaN(parseInt(formData.age)) || parseInt(formData.age) < 0) newErrors.age = "Age must be a valid positive number.";
    if (!formData.date_joined) newErrors.date_joined = "Date joined is required.";
    if (!formData.place_found.trim()) newErrors.place_found = "Place found is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !existingBeneficiary?.id || !programId || !divisionName) {
      setErrors(prev => ({ ...prev, form: "Beneficiary ID, Program or Division information is missing." }));
      return;
    }
    setIsSubmitting(true);

    const payload = {
      ...formData,
      program_id: programId,
      age: parseInt(formData.age),
      date_joined: formData.date_joined || null,
    };

    try {
      const endpoint = `/api/programs/${divisionName.toLowerCase()}/rescue/${existingBeneficiary.id}/`;
      const response = await api.put(endpoint, payload);
      if (onBeneficiaryUpdated) onBeneficiaryUpdated(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating rescue beneficiary:", error.response?.data || error.message);
      const backendErrors = error.response?.data;
      if (typeof backendErrors === 'object' && backendErrors !== null) {
        setErrors(prev => ({ ...prev, ...backendErrors, form: backendErrors.detail || "Update failed. Please check fields."}));
      } else {
        setErrors({ form: "An unexpected error occurred." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAndClose = () => {
    resetForm(existingBeneficiary);
    onClose();
  };

  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5";
  const errorClasses = "text-red-600 text-xs mt-1 flex items-center gap-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && handleCancelAndClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Update Rescue Beneficiary</h3>
          <button onClick={handleCancelAndClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"><X size={22} /></button>
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
              <label htmlFor="date_joined" className={labelClasses}>Date Joined*</label>
              <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="date" id="date_joined" name="date_joined" value={formData.date_joined} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>
              {errors.date_joined && <p className={errorClasses}><AlertCircle size={14}/>{errors.date_joined}</p>}
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
            <button type="button" onClick={handleCancelAndClose} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 font-medium flex items-center justify-center min-w-[150px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Beneficiary"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescueBeneficiaryUpdateForm;