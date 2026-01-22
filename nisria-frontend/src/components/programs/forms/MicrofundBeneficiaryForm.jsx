import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { X, AlertCircle, User, Users, Phone, MapPin, DollarSign, CheckSquare, FileText, Image as ImageIcon, Info, Briefcase, MessageSquare, BarChart, Home, Star } from 'lucide-react';

const initialFormData = {
  person_name: '',
  gender: '',
  chama_group: '',
  age: '',
  story: '',
  role_in_group: '',
  money_received: '',
  project_done: '',
  progress_notes: '',
  address: '',
  background: '',
  pictures: null,
  site_visit_notes: '',
  testimonials: '',
  additional_support: '',
  is_active: true,
  location: '',
  telephone: '',
};

const MicrofundBeneficiaryForm = ({ isOpen, onClose, onBeneficiaryAdded, programId, divisionName }) => {
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, pictures: file }));
    setFileName(file ? file.name : '');
    if (errors.pictures) setErrors(prev => ({ ...prev, pictures: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.person_name.trim()) newErrors.person_name = "Person's name is required.";
    if (!formData.chama_group?.trim()) newErrors.chama_group = "Chama group is required for new beneficiaries.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.telephone.trim()) newErrors.telephone = "Telephone is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    const submissionData = new FormData();
    
    // Only append fields that have values
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        submissionData.append(key, value);
      }
    });
    
    submissionData.append('program_id', programId);

    try {
      const endpoint = `/api/programs/${divisionName.toLowerCase()}/microfund/`;
      const response = await api.post(endpoint, submissionData);
      
      onBeneficiaryAdded(response.data);
      onClose();
    } catch (error) {
      console.error("Error adding microfund beneficiary:", error.response?.data || error.message);
      const backendErrors = error.response?.data;
      if (typeof backendErrors === 'object' && backendErrors !== null) {
        setErrors(prev => ({ 
          ...prev, 
          ...backendErrors, 
          form: backendErrors.detail || "Submission failed. Please check fields."
        }));
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
    <ModalPortal>
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto" 
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative w-full max-w-3xl max-h-[90vh]">
          <div className="bg-white rounded-xl shadow-2xl w-full h-full flex flex-col relative">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <h3 className="text-lg font-semibold text-gray-800">Add Microfund Beneficiary</h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {isSubmitting && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50 rounded-b-xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              {errors.form && <p className={`${errorClasses} p-3 bg-red-50 border border-red-200 rounded-md`}><AlertCircle size={16}/>{errors.form}</p>}

              {/* Person Name */}
              <div>
                <label htmlFor="chama_group" className={labelClasses}>Chama Group*</label>
                <div className="relative"><Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="chama_group" name="chama_group" value={formData.chama_group} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Visionary Women" /></div>
                {errors.chama_group && <p className={errorClasses}><AlertCircle size={14}/>{errors.chama_group}</p>}
              </div>
              <div>
                <label htmlFor="role_in_group" className={labelClasses}>Role in Group</label>
                <div className="relative"><Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="role_in_group" name="role_in_group" value={formData.role_in_group} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Treasurer" /></div>
                {errors.role_in_group && <p className={errorClasses}><AlertCircle size={14}/>{errors.role_in_group}</p>}
              </div>
            </div>
            <div className="mt-5">
              <label htmlFor="money_received" className={labelClasses}>Money Received</label>
              <div className="relative"><DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="number" step="0.01" id="money_received" name="money_received" value={formData.money_received} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., 50000.00" /></div>
              {errors.money_received && <p className={errorClasses}><AlertCircle size={14}/>{errors.money_received}</p>}
            </div>
            <div className="mt-5">
              <label htmlFor="project_done" className={labelClasses}>Project Done</label>
              <textarea id="project_done" name="project_done" value={formData.project_done} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`} placeholder="Describe the project undertaken with the funds..."></textarea>
              {errors.project_done && <p className={errorClasses}><AlertCircle size={14}/>{errors.project_done}</p>}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Personal & Location Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="address" className={labelClasses}>Address</label>
                <div className="relative"><Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., 123 Main St" /></div>
                {errors.address && <p className={errorClasses}><AlertCircle size={14}/>{errors.address}</p>}
              </div>
              <div>
                <label htmlFor="location" className={labelClasses}>Location*</label>
                <div className="relative"><MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Nairobi, Kenya" /></div>
                {errors.location && <p className={errorClasses}><AlertCircle size={14}/>{errors.location}</p>}
              </div>
            </div>
            <div className="mt-5">
              <label htmlFor="story" className={labelClasses}>Story</label>
              <textarea id="story" name="story" value={formData.story} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`} placeholder="Share the beneficiary's story..."></textarea>
              {errors.story && <p className={errorClasses}><AlertCircle size={14}/>{errors.story}</p>}
            </div>
            <div className="mt-5">
              <label htmlFor="background" className={labelClasses}>Background</label>
              <textarea id="background" name="background" value={formData.background} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`} placeholder="Provide background information..."></textarea>
              {errors.background && <p className={errorClasses}><AlertCircle size={14}/>{errors.background}</p>}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Notes & Media</h4>
            <div className="mt-5">
              <label htmlFor="progress_notes" className={labelClasses}>Progress Notes</label>
              <textarea id="progress_notes" name="progress_notes" value={formData.progress_notes} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`} placeholder="Record progress notes..."></textarea>
              {errors.progress_notes && <p className={errorClasses}><AlertCircle size={14}/>{errors.progress_notes}</p>}
            </div>
            <div className="mt-5">
              <label htmlFor="site_visit_notes" className={labelClasses}>Site Visit Notes</label>
              <textarea id="site_visit_notes" name="site_visit_notes" value={formData.site_visit_notes} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`} placeholder="Record notes from site visits..."></textarea>
              {errors.site_visit_notes && <p className={errorClasses}><AlertCircle size={14}/>{errors.site_visit_notes}</p>}
            </div>
            <div className="mt-5">
              <label htmlFor="testimonials" className={labelClasses}>Testimonials</label>
              <textarea id="testimonials" name="testimonials" value={formData.testimonials} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`} placeholder="Record any testimonials..."></textarea>
              {errors.testimonials && <p className={errorClasses}><AlertCircle size={14}/>{errors.testimonials}</p>}
            </div>
            <div className="mt-5">
              <label htmlFor="additional_support" className={labelClasses}>Additional Support</label>
              <textarea id="additional_support" name="additional_support" value={formData.additional_support} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`} placeholder="Details of any other support received..."></textarea>
              {errors.additional_support && <p className={errorClasses}><AlertCircle size={14}/>{errors.additional_support}</p>}
            </div>
            <div className="mt-5">
              <label htmlFor="pictures" className={labelClasses}>Pictures</label>
              <div className="relative">
                <label htmlFor="pictures" className="cursor-pointer flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                  <ImageIcon className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">{fileName || "Click to upload an image"}</span>
                </label>
                <input type="file" id="pictures" name="pictures" onChange={handleFileChange} className="sr-only" accept="image/*" />
              </div>
              {errors.pictures && <p className={errorClasses}><AlertCircle size={14}/>{errors.pictures}</p>}
            </div>
          </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Saving...' : 'Save Beneficiary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default MicrofundBeneficiaryForm;