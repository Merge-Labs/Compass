import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { X, AlertCircle, User, Briefcase, Phone, Mail, Users as GenderIcon, Loader2 } from 'lucide-react';

const genderOptions = [
  { value: '', label: 'Select Gender (Optional)' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const initialFormData = {
  trainer_name: '',
  gender: '',
  trainer_association: '',
  trainer_phone: '',
  trainer_email: '',
};

const VocationalTrainerForm = ({ isOpen, onClose, onTrainerAdded, programId, divisionName }) => {
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
    if (!formData.trainer_name.trim()) newErrors.trainer_name = "Trainer name is required.";
    if (!formData.trainer_association.trim()) newErrors.trainer_association = "Trainer association is required.";
    if (!formData.trainer_phone.trim()) newErrors.trainer_phone = "Trainer phone is required.";
    if (!formData.trainer_email.trim()) newErrors.trainer_email = "Trainer email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.trainer_email)) newErrors.trainer_email = "Email address is invalid.";
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
      program_id: programId, // Ensure your backend expects program_id, not program
      gender: formData.gender || null, // Send null if gender is empty
    };

    try {
      const endpoint = `/api/programs/${divisionName.toLowerCase()}/vocational-trainers/`;
      const response = await api.post(endpoint, payload);
      onTrainerAdded(response.data);
      onClose();
    } catch (error) {
      console.error("Error adding vocational trainer:", error.response?.data || error.message);
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
          <h3 className="text-xl font-bold text-gray-800">Add Vocational Trainer</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"><X size={22} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errors.form && <p className={`${errorClasses} p-3 bg-red-50 border border-red-200 rounded-md`}><AlertCircle size={16}/>{errors.form}</p>}
          
          <div><label htmlFor="trainer_name" className={labelClasses}>Trainer Name*</label><div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="trainer_name" name="trainer_name" value={formData.trainer_name} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., John Doe" /></div>{errors.trainer_name && <p className={errorClasses}><AlertCircle size={14}/>{errors.trainer_name}</p>}</div>
          
          <div><label htmlFor="gender" className={labelClasses}>Gender</label><div className="relative"><GenderIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className={`${inputClasses} pl-10`}><option value="" disabled>Select Gender</option>{genderOptions.map(opt => <option key={opt.value} value={opt.value} disabled={opt.value === "" && formData.gender !== ""}>{opt.label}</option>)}</select></div>{errors.gender && <p className={errorClasses}><AlertCircle size={14}/>{errors.gender}</p>}</div>

          <div><label htmlFor="trainer_association" className={labelClasses}>Trainer Association*</label><div className="relative"><Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="trainer_association" name="trainer_association" value={formData.trainer_association} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., National Industrial Training Authority (NITA)" /></div>{errors.trainer_association && <p className={errorClasses}><AlertCircle size={14}/>{errors.trainer_association}</p>}</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label htmlFor="trainer_phone" className={labelClasses}>Trainer Phone*</label><div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="tel" id="trainer_phone" name="trainer_phone" value={formData.trainer_phone} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., +254712345678" /></div>{errors.trainer_phone && <p className={errorClasses}><AlertCircle size={14}/>{errors.trainer_phone}</p>}</div>
            <div><label htmlFor="trainer_email" className={labelClasses}>Trainer Email*</label><div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="email" id="trainer_email" name="trainer_email" value={formData.trainer_email} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., trainer@example.com" /></div>{errors.trainer_email && <p className={errorClasses}><AlertCircle size={14}/>{errors.trainer_email}</p>}</div>
          </div>

          <div className="flex justify-end gap-4 pt-5 mt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium" disabled={isSubmitting}>Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 font-medium flex items-center justify-center min-w-[150px]">
              {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" />Adding...</>) : ("Add Trainer")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VocationalTrainerForm;