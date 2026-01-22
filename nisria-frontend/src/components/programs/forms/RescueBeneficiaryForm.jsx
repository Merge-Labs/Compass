import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  X,
  AlertCircle,
  User,
  Calendar as CalendarIcon,
  MapPin,
  Phone,
  Briefcase,
  Home,
  Image as ImageIcon,
} from 'lucide-react';
import ModalPortal from '../../common/ModalPortal';

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

const RescueBeneficiaryForm = ({
  isOpen,
  onClose,
  onBeneficiaryAdded,
  programId,
  divisionName,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
      setFileName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, pictures: 'Please upload an image file' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, pictures: 'File size should be less than 5MB' }));
      return;
    }

    setFormData((prev) => ({ ...prev, pictures: file }));
    setFileName(file.name);
    setErrors((prev) => ({ ...prev, pictures: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.child_name.trim()) newErrors.child_name = "Child's name is required.";
    if (!formData.age) newErrors.age = 'Age is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !programId || !divisionName) {
      setErrors((prev) => ({
        ...prev,
        form: 'Program or Division information is missing.',
      }));
      return;
    }

    setIsSubmitting(true);

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        submissionData.append(key, value);
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
      const backendErrors = error.response?.data;
      if (backendErrors && typeof backendErrors === 'object') {
        setErrors((prev) => ({
          ...prev,
          ...backendErrors,
          form: backendErrors.detail || 'Submission failed.',
        }));
      } else {
        setErrors({ form: 'An unexpected error occurred.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white';
  const labelClasses = 'block text-sm font-semibold text-gray-700 mb-1.5';
  const errorClasses = 'text-red-600 text-xs mt-1 flex items-center gap-1';

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative w-full max-w-3xl max-h-[90vh]">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">Add Rescue Beneficiary</h3>
              <button onClick={onClose}>
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              {errors.form && (
                <p className={`${errorClasses} p-3 bg-red-50 border rounded`}>
                  <AlertCircle size={16} />
                  {errors.form}
                </p>
              )}

              {/* Child Info */}
              <div>
                <label className={labelClasses}>Child's Name*</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="child_name"
                    value={formData.child_name}
                    onChange={handleInputChange}
                    className={`${inputClasses} pl-10`}
                  />
                </div>
                {errors.child_name && (
                  <p className={errorClasses}>
                    <AlertCircle size={14} />
                    {errors.child_name}
                  </p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className={labelClasses}>Age*</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>

              {/* Pictures */}
              <div>
                <label className={labelClasses}>Pictures</label>
                <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed rounded cursor-pointer">
                  <ImageIcon className="mr-2" />
                  {fileName || 'Click to upload image'}
                  <input
                    type="file"
                    name="pictures"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                {errors.pictures && (
                  <p className={errorClasses}>
                    <AlertCircle size={14} />
                    {errors.pictures}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border rounded"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded"
                >
                  {isSubmitting ? 'Adding...' : 'Add Beneficiary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default RescueBeneficiaryForm;
