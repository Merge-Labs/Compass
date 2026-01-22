import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { X, AlertCircle, User, Calendar as CalendarIcon, MapPin, Phone, Info, CheckSquare, Users as GenderIcon, Image as ImageIcon, FileText, Heart, Shield, BookOpen, Home, Briefcase } from 'lucide-react';

const initialFormData = {
  child_name: '',
  age: '',
  date_of_birth: '',
  gender: '',
  pictures: null,
  date_of_rescue: '',
  location_of_rescue: '',
  background: '',
  case_referral_description: '',
  case_referred_from: '',
  case_type: 'other',
  case_type_other: '',
  ob_number: '',
  children_office_case_number: '',
  guardian_name: '',
  guardian_phone_number: '',
  guardian_residence: '',
  post_rescue_description: '',
  urgent_needs: '',
  educational_background: '',
  health_status: '',
  medical_support_details: '',
  family_reunification_efforts: '',
  date_of_exit: '',
};

const genderOptions = [
  { value: '', label: 'Select Gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const RescueBeneficiaryForm = ({ isOpen, onClose, onBeneficiaryAdded, programId, divisionName }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, pictures: file }));
    setFileName(file ? file.name : '');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.child_name.trim()) newErrors.child_name = "Child's name is required.";
    if (!formData.age) newErrors.age = "Age is required.";
    else if (isNaN(parseInt(formData.age)) || parseInt(formData.age) < 0) newErrors.age = "Age must be a valid positive number.";
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

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        submissionData.append(key, formData[key]);
      }
    });
    submissionData.append('program_id', programId);

    try {
      const endpoint = `/api/programs/${divisionName.toLowerCase()}/rescue/`;
      const response = await api.post(endpoint, submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label htmlFor="date_of_birth" className={labelClasses}>Date of Birth</label><div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="date" id="date_of_birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div></div>
            <div><label htmlFor="gender" className={labelClasses}>Gender</label><select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className={`${inputClasses}`}>{genderOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Rescue Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label htmlFor="date_of_rescue" className={labelClasses}>Date of Rescue</label><div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="date" id="date_of_rescue" name="date_of_rescue" value={formData.date_of_rescue} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div></div>
              <div><label htmlFor="location_of_rescue" className={labelClasses}>Location of Rescue</label><div className="relative"><MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="location_of_rescue" name="location_of_rescue" value={formData.location_of_rescue} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div></div>
            </div>
            <div className="mt-5"><label htmlFor="background" className={labelClasses}>Background</label><textarea id="background" name="background" value={formData.background} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`} placeholder="A short background of the child’s situation before rescue..."></textarea></div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Case Referral</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label htmlFor="case_referred_from" className={labelClasses}>Case Referred From</label><div className="relative"><Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="case_referred_from" name="case_referred_from" value={formData.case_referred_from} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div></div>
              <div>
                <label htmlFor="case_type" className={labelClasses}>Case Type</label>
                <select id="case_type" name="case_type" value={formData.case_type} onChange={handleInputChange} className={`${inputClasses}`}>
                  <option value="lost_and_found">Lost and Found</option><option value="other">Other</option>
                </select>
              </div>
            </div>
            {formData.case_type === 'other' && <div className="mt-5"><label htmlFor="case_type_other" className={labelClasses}>Specify Other Case Type</label><input type="text" id="case_type_other" name="case_type_other" value={formData.case_type_other} onChange={handleInputChange} className={`${inputClasses}`} /></div>}
            <div className="mt-5"><label htmlFor="case_referral_description" className={labelClasses}>Case Referral Description</label><textarea id="case_referral_description" name="case_referral_description" value={formData.case_referral_description} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`}></textarea></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div><label htmlFor="ob_number" className={labelClasses}>OB Number</label><input type="text" id="ob_number" name="ob_number" value={formData.ob_number} onChange={handleInputChange} className={`${inputClasses}`} /></div>
              <div><label htmlFor="children_office_case_number" className={labelClasses}>Children's Office Case Number</label><input type="text" id="children_office_case_number" name="children_office_case_number" value={formData.children_office_case_number} onChange={handleInputChange} className={`${inputClasses}`} /></div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Guardian / Parent Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label htmlFor="guardian_name" className={labelClasses}>Guardian's Name</label><div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="guardian_name" name="guardian_name" value={formData.guardian_name} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div></div>
              <div><label htmlFor="guardian_phone_number" className={labelClasses}>Guardian's Phone</label><div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="tel" id="guardian_phone_number" name="guardian_phone_number" value={formData.guardian_phone_number} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div></div>
            </div>
            <div className="mt-5"><label htmlFor="guardian_residence" className={labelClasses}>Guardian's Residence</label><div className="relative"><Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="guardian_residence" name="guardian_residence" value={formData.guardian_residence} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div></div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Post-Rescue Details</h4>
            <div className="mt-5"><label htmlFor="urgent_needs" className={labelClasses}>Urgent Needs</label><textarea id="urgent_needs" name="urgent_needs" value={formData.urgent_needs} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`}></textarea></div>
            <div className="mt-5"><label htmlFor="educational_background" className={labelClasses}>Educational Background</label><textarea id="educational_background" name="educational_background" value={formData.educational_background} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`}></textarea></div>
            <div className="mt-5"><label htmlFor="health_status" className={labelClasses}>Health Status</label><textarea id="health_status" name="health_status" value={formData.health_status} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`}></textarea></div>
            <div className="mt-5"><label htmlFor="medical_support_details" className={labelClasses}>Medical Support Details</label><textarea id="medical_support_details" name="medical_support_details" value={formData.medical_support_details} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`}></textarea></div>
            <div className="mt-5"><label htmlFor="family_reunification_efforts" className={labelClasses}>Family Reunification Efforts</label><textarea id="family_reunification_efforts" name="family_reunification_efforts" value={formData.family_reunification_efforts} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`}></textarea></div>
            <div className="mt-5"><label htmlFor="post_rescue_description" className={labelClasses}>Post-Rescue Description</label><textarea id="post_rescue_description" name="post_rescue_description" value={formData.post_rescue_description} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`}></textarea></div>
            <div className="mt-5"><label htmlFor="date_of_exit" className={labelClasses}>Date of Exit</label><div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="date" id="date_of_exit" name="date_of_exit" value={formData.date_of_exit} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div></div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <label htmlFor="pictures" className={labelClasses}>Pictures</label>
            <div className="relative">
              <label htmlFor="pictures" className="cursor-pointer flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                <ImageIcon className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600">{fileName || "Click to upload an image"}</span>
              </label>
              <input type="file" id="pictures" name="pictures" onChange={handleFileChange} className="sr-only" accept="image/*" />
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

export default RescueBeneficiaryForm;