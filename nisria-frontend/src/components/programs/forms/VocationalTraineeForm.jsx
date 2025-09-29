import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { X, AlertCircle, User, Briefcase, Phone, Mail, Calendar as CalendarIcon, CheckSquare, Loader2, Home, FileText, Gift, MessageSquare, BarChart, Star, Image as ImageIcon } from 'lucide-react';

const initialFormData = {
  trainee_name: '',
  age: '',
  gender: '',
  trainee_phone: '',
  trainee_email: '',
  address: '',
  training_received: '',
  start_date: '',
  end_date: '',
  background: '',
  additional_support: '',
  post_training_status: '',
  quarterly_follow_up: '',
  testimonial: '',
  emergency_contact_name: '',
  emergency_contact_number: '',
  pictures: null,
};

const VocationalTraineeForm = ({ isOpen, onClose, onTraineeAdded, programId, divisionName, trainerId, trainerAssociationFromProps }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');

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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!formData.trainee_name.trim()) newErrors.trainee_name = "Trainee name is required.";
    if (!formData.trainee_phone.trim()) newErrors.trainee_phone = "Trainee phone is required.";
    if (!formData.trainee_email.trim()) newErrors.trainee_email = "Trainee email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.trainee_email)) newErrors.trainee_email = "Email address is invalid.";
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

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        submissionData.append(key, formData[key]);
      }
    });
    submissionData.append('program_id', programId);
    submissionData.append('trainer', trainerId);

    try {
      const endpoint = `/api/programs/${divisionName.toLowerCase()}/vocational-trainers/${trainerId}/trainees/`;
      const response = await api.post(endpoint, submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errors.form && <p className={`${errorClasses} p-3 bg-red-50 border border-red-200 rounded-md`}><AlertCircle size={16}/>{errors.form}</p>}
          
          <div>
            <label htmlFor="trainee_name" className={labelClasses}>Trainee Name*</label>
            <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="trainee_name" name="trainee_name" value={formData.trainee_name} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Mary Wanjiku" /></div>
            {errors.trainee_name && <p className={errorClasses}><AlertCircle size={14}/>{errors.trainee_name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="age" className={labelClasses}>Age</label>
              <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>
              {errors.age && <p className={errorClasses}><AlertCircle size={14}/>{errors.age}</p>}
            </div>
            <div>
              <label htmlFor="gender" className={labelClasses}>Gender</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className={`${inputClasses}`}>
                <option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
              </select>
              {errors.gender && <p className={errorClasses}><AlertCircle size={14}/>{errors.gender}</p>}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Contact Information</h4>
            <div><label htmlFor="trainee_phone" className={labelClasses}>Phone Number*</label><div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="tel" id="trainee_phone" name="trainee_phone" value={formData.trainee_phone} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>{errors.trainee_phone && <p className={errorClasses}><AlertCircle size={14}/>{errors.trainee_phone}</p>}</div>
            <div className="mt-5"><label htmlFor="trainee_email" className={labelClasses}>Email Address*</label><div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="email" id="trainee_email" name="trainee_email" value={formData.trainee_email} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>{errors.trainee_email && <p className={errorClasses}><AlertCircle size={14}/>{errors.trainee_email}</p>}</div>
            <div className="mt-5"><label htmlFor="address" className={labelClasses}>Address</label><div className="relative"><Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>{errors.address && <p className={errorClasses}><AlertCircle size={14}/>{errors.address}</p>}</div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label htmlFor="emergency_contact_name" className={labelClasses}>Contact Name</label><div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="emergency_contact_name" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>{errors.emergency_contact_name && <p className={errorClasses}><AlertCircle size={14}/>{errors.emergency_contact_name}</p>}</div>
              <div><label htmlFor="emergency_contact_number" className={labelClasses}>Contact Number</label><div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="tel" id="emergency_contact_number" name="emergency_contact_number" value={formData.emergency_contact_number} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>{errors.emergency_contact_number && <p className={errorClasses}><AlertCircle size={14}/>{errors.emergency_contact_number}</p>}</div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Training & Background</h4>
            <div><label htmlFor="training_received" className={labelClasses}>Training Received</label><div className="relative"><Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="training_received" name="training_received" value={formData.training_received} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Plumbing, Tailoring" /></div>{errors.training_received && <p className={errorClasses}><AlertCircle size={14}/>{errors.training_received}</p>}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div><label htmlFor="start_date" className={labelClasses}>Start Date</label><div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>{errors.start_date && <p className={errorClasses}><AlertCircle size={14}/>{errors.start_date}</p>}</div>
              <div><label htmlFor="end_date" className={labelClasses}>End Date</label><div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="date" id="end_date" name="end_date" value={formData.end_date} onChange={handleInputChange} className={`${inputClasses} pl-10`} /></div>{errors.end_date && <p className={errorClasses}><AlertCircle size={14}/>{errors.end_date}</p>}</div>
            </div>
            <div className="mt-5"><label htmlFor="background" className={labelClasses}>Background</label><textarea id="background" name="background" value={formData.background} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`} placeholder="Provide a brief background..."></textarea>{errors.background && <p className={errorClasses}><AlertCircle size={14}/>{errors.background}</p>}</div>
            <div className="mt-5"><label htmlFor="additional_support" className={labelClasses}>Additional Support</label><textarea id="additional_support" name="additional_support" value={formData.additional_support} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`} placeholder="Details of any other support received..."></textarea>{errors.additional_support && <p className={errorClasses}><AlertCircle size={14}/>{errors.additional_support}</p>}</div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Follow-up & Media</h4>
            <div>
              <label htmlFor="post_training_status" className={labelClasses}>Post-Training Status</label>
              <select id="post_training_status" name="post_training_status" value={formData.post_training_status} onChange={handleInputChange} className={`${inputClasses}`}>
                <option value="">Select Status</option>
                <option value="self_employed">Self-Employed</option>
                <option value="employed">Employed</option>
                <option value="further_education">Further Education</option>
                <option value="unemployed">Unemployed</option>
                <option value="unknown">Unknown</option>
              </select>
              {errors.post_training_status && <p className={errorClasses}><AlertCircle size={14}/>{errors.post_training_status}</p>}
            </div>
            <div className="mt-5"><label htmlFor="quarterly_follow_up" className={labelClasses}>Quarterly Follow-up Notes</label><textarea id="quarterly_follow_up" name="quarterly_follow_up" value={formData.quarterly_follow_up} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`}></textarea>{errors.quarterly_follow_up && <p className={errorClasses}><AlertCircle size={14}/>{errors.quarterly_follow_up}</p>}</div>
            <div className="mt-5"><label htmlFor="testimonial" className={labelClasses}>Testimonial</label><textarea id="testimonial" name="testimonial" value={formData.testimonial} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`}></textarea>{errors.testimonial && <p className={errorClasses}><AlertCircle size={14}/>{errors.testimonial}</p>}</div>
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