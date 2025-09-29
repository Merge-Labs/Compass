import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { X, AlertCircle, User, BookOpen, MapPin, Phone, Calendar as CalendarIcon, Briefcase, Heart, Users, FileText, Image as ImageIcon, Info, Loader2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeProvider'; // Import useTheme

const EducationBeneficiaryUpdateForm = ({ isOpen, onClose, onBeneficiaryUpdated, existingBeneficiary, programId, divisionName }) => {
  const initialFormData = {
    student_name: '',
    school: '',
    age: '',
    grade: '',
    gender: '',
    start_year: '',
    graduation_year: '',
    guardian_name: '',
    guardian_relationship: '',
    guardian_contact: '',
    address: '',
    medical_status: '',
    other_support_details: '',
    background: '',
    pictures: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const { theme } = useTheme(); // Use the theme

  const resetForm = (beneficiary) => {
    if (beneficiary) {
      setFormData({
        student_name: beneficiary.student_name || '',
        school: beneficiary.school || '', // Use 'school' from backend
        age: beneficiary.age || '',
        grade: beneficiary.grade || '',
        gender: beneficiary.gender || '',
        start_year: beneficiary.start_year || '',
        graduation_year: beneficiary.graduation_year || '',
        guardian_name: beneficiary.guardian_name || '',
        guardian_relationship: beneficiary.guardian_relationship || '',
        guardian_contact: beneficiary.guardian_contact || '',
        address: beneficiary.address || '',
        medical_status: beneficiary.medical_status || '',
        other_support_details: beneficiary.other_support_details || '',
        background: beneficiary.background || '', // Use 'background' from backend
        pictures: null, // File inputs are not pre-filled
      });

      setImagePreview(beneficiary.picture_url || null); // Use 'picture_url' from backend
      setFileName('');
    } else {
      setFormData(initialFormData);
      setImagePreview(null);
      setFileName('');
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, pictures: file }));
      setFileName(file.name);
      setImagePreview(URL.createObjectURL(file));
      if (errors.pictures) setErrors(prev => ({ ...prev, pictures: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.student_name.trim()) newErrors.student_name = "Student name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !existingBeneficiary?.id || !programId || !divisionName) {
      setErrors(prev => ({ ...prev, form: 'Beneficiary ID, Program or Division information is missing.' }));
      return;
    }
    setIsSubmitting(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      // Only append if the value is not null/empty, or if it's the file input
      if (formData[key] !== null && formData[key] !== '') {
        submissionData.append(key, formData[key]);
      }
    });
    submissionData.append('program_id', programId);

    try {
      const endpoint = `/api/programs/${divisionName.toLowerCase()}/education/${existingBeneficiary.id}/`;
      // Use PATCH for partial updates, especially with file uploads
      const response = await api.patch(endpoint, submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (onBeneficiaryUpdated) onBeneficiaryUpdated(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating education beneficiary:', error.response?.data || error.message);
      const backendErrors = error.response?.data;
      if (typeof backendErrors === 'object' && backendErrors !== null) {
        setErrors(prev => ({ ...prev, ...backendErrors, form: backendErrors.detail || 'Update failed. Please check fields.' }));
      } else {
        setErrors({ form: 'An unexpected error occurred.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAndClose = () => {
    onClose();
  };

  const inputClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500' : 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300'}`;
  const labelClasses = `block text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`;
  const errorClasses = 'text-red-600 text-xs mt-1 flex items-center gap-1';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && handleCancelAndClose()}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Update Education Beneficiary</h3>
          <button onClick={handleCancelAndClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"><X size={22} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errors.form && <p className={`${errorClasses} p-3 bg-red-50 border border-red-200 rounded-md`}><AlertCircle size={16}/>{errors.form}</p>}
          
          <div>
            <label htmlFor="student_name" className={labelClasses}>Student Name*</label>
            <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="student_name" name="student_name" value={formData.student_name} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Jane Doe" /></div>
            {errors.student_name && <p className={errorClasses}><AlertCircle size={14}/>{errors.student_name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="age" className={labelClasses}>Age</label>
              <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., 14" /></div>
              {errors.age && <p className={errorClasses}><AlertCircle size={14}/>{errors.age}</p>}
            </div>
            <div>
              <label htmlFor="grade" className={labelClasses}>Grade</label>
              <div className="relative"><BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="grade" name="grade" value={formData.grade} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Grade 8" /></div>
              {errors.grade && <p className={errorClasses}><AlertCircle size={14}/>{errors.grade}</p>}
            </div>
            <div>
              <label htmlFor="gender" className={labelClasses}>Gender</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className={`${inputClasses}`}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className={errorClasses}><AlertCircle size={14}/>{errors.gender}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="start_year" className={labelClasses}>Start Year</label>
              <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="start_year" name="start_year" value={formData.start_year} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., 2022" /></div>
              {errors.start_year && <p className={errorClasses}><AlertCircle size={14}/>{errors.start_year}</p>}
            </div>
            <div>
              <label htmlFor="graduation_year" className={labelClasses}>Graduation Year</label>
              <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="graduation_year" name="graduation_year" value={formData.graduation_year} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., 2026" /></div>
              {errors.graduation_year && <p className={errorClasses}><AlertCircle size={14}/>{errors.graduation_year}</p>}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Guardian Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="guardian_name" className={labelClasses}>Guardian's Name</label>
                <div className="relative"><Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="guardian_name" name="guardian_name" value={formData.guardian_name} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., John Smith" /></div>
                {errors.guardian_name && <p className={errorClasses}><AlertCircle size={14}/>{errors.guardian_name}</p>}
              </div>
              <div>
                <label htmlFor="guardian_relationship" className={labelClasses}>Nature of Relationship</label>
                <div className="relative"><Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="guardian_relationship" name="guardian_relationship" value={formData.guardian_relationship} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Parent, Aunt" /></div>
                {errors.guardian_relationship && <p className={errorClasses}><AlertCircle size={14}/>{errors.guardian_relationship}</p>}
              </div>
            </div>
            <div className="mt-5">
              <label htmlFor="guardian_contact" className={labelClasses}>Contact of The Guardian</label>
              <div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="guardian_contact" name="guardian_contact" value={formData.guardian_contact} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., +2547..." /></div>
              {errors.guardian_contact && <p className={errorClasses}><AlertCircle size={14}/>{errors.guardian_contact}</p>}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Additional Information</h4>
            <div>
              <label htmlFor="address" className={labelClasses}>Address</label>
              <div className="relative"><MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., 123 Main St, Nairobi" /></div>
              {errors.address && <p className={errorClasses}><AlertCircle size={14}/>{errors.address}</p>}
            </div>
            <div className="mt-5">
              <label htmlFor="medical_status" className={labelClasses}>Medical Status</label>
              <div className="relative"><Info className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="medical_status" name="medical_status" value={formData.medical_status} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., Healthy, Allergies" /></div>
              {errors.medical_status && <p className={errorClasses}><AlertCircle size={14}/>{errors.medical_status}</p>}
            </div>
            <div className="mt-5">
              <label htmlFor="other_support_details" className={labelClasses}>Support (Apart from Program)</label>
              <textarea id="other_support_details" name="other_support_details" value={formData.other_support_details} onChange={handleInputChange} rows="3" className={`${inputClasses} pl-4`} placeholder="Describe any other support the beneficiary receives..."></textarea>
              {errors.other_support_details && <p className={errorClasses}><AlertCircle size={14}/>{errors.other_support_details}</p>}
            </div>
            <div className="mt-5">
              <label htmlFor="school" className={labelClasses}>School</label>
              <div className="relative"><Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" id="school" name="school" value={formData.school} onChange={handleInputChange} className={`${inputClasses} pl-10`} placeholder="e.g., XYZ High School" /></div>
              {errors.school && <p className={errorClasses}><AlertCircle size={14}/>{errors.school}</p>}
            </div>
            <div className="mt-5">
              <label htmlFor="background" className={labelClasses}>Background</label>
              <textarea id="background" name="background" value={formData.background} onChange={handleInputChange} rows="4" className={`${inputClasses} pl-4`} placeholder="Provide a brief background of the beneficiary..."></textarea>
              {errors.background && <p className={errorClasses}><AlertCircle size={14}/>{errors.background}</p>}
            </div>
            <div className="mt-5">
              <label htmlFor="pictures" className={labelClasses}>Update Picture</label>
              <div className="flex items-center gap-4">
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />}
                <label htmlFor="pictures" className="cursor-pointer flex-1 flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                  <ImageIcon className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">{fileName || "Click to upload a new image"}</span>
                </label>
                <input type="file" id="pictures" name="pictures" onChange={handleFileChange} className="sr-only" accept="image/*" />
              </div>
              {errors.pictures && <p className={errorClasses}><AlertCircle size={14}/>{errors.pictures}</p>}
            </div>
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

export default EducationBeneficiaryUpdateForm;