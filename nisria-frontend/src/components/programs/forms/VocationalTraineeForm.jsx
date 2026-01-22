import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  X,
  AlertCircle,
  User,
  Briefcase,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Loader2,
  Home,
  Image as ImageIcon,
} from 'lucide-react';
import ModalPortal from '../../common/ModalPortal';

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

const VocationalTraineeForm = ({
  isOpen,
  onClose,
  onTraineeAdded,
  programId,
  divisionName,
  trainerId,
  trainerAssociationFromProps,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (!trainerId || !trainerAssociationFromProps) {
          newErrors.form =
            'Trainer details (ID or Association) are missing. Cannot add trainee.';
        } else {
          delete newErrors.form;
        }
        return newErrors;
      });
      setFileName('');
    }
  }, [isOpen, trainerId, trainerAssociationFromProps]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, pictures: 'Please upload an image file' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        pictures: 'File size should be less than 5MB',
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, pictures: file }));
    setFileName(file.name);
    if (errors.pictures) setErrors((prev) => ({ ...prev, pictures: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.trainee_name.trim())
      newErrors.trainee_name = 'Trainee name is required.';
    if (!formData.trainee_phone.trim())
      newErrors.trainee_phone = 'Trainee phone is required.';
    if (!formData.trainee_email.trim())
      newErrors.trainee_email = 'Trainee email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.trainee_email))
      newErrors.trainee_email = 'Email address is invalid.';
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

    if (!trainerId || !trainerAssociationFromProps) {
      setErrors((prev) => ({
        ...prev,
        form: 'Trainer information is missing.',
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
    submissionData.append('trainer', trainerId);

    try {
      const endpoint = `/api/programs/${divisionName.toLowerCase()}/vocational/`;
      const response = await api.post(endpoint, submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onTraineeAdded(response.data);
      onClose();
    } catch (error) {
      const backendErrors = error.response?.data;
      if (typeof backendErrors === 'object' && backendErrors !== null) {
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
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500';
  const labelClasses = 'block text-sm font-semibold text-gray-700 mb-1.5';
  const errorClasses = 'text-red-600 text-xs mt-1 flex items-center gap-1';

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative w-full max-w-3xl max-h-[90vh]">
          <div className="bg-white rounded-xl shadow-2xl w-full h-full flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">Add Vocational Trainee</h3>
              <button onClick={onClose}>
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {errors.form && (
                <p className={`${errorClasses} p-3 bg-red-50 border rounded`}>
                  <AlertCircle size={16} />
                  {errors.form}
                </p>
              )}

              <div>
                <label className={labelClasses}>Trainee Name*</label>
                <input
                  name="trainee_name"
                  value={formData.trainee_name}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Pictures</label>
                <label className="cursor-pointer block border-dashed border-2 p-4 rounded">
                  <ImageIcon className="inline mr-2" />
                  {fileName || 'Click to upload an image'}
                  <input
                    type="file"
                    name="pictures"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                {errors.pictures && (
                  <p className={errorClasses}>
                    <AlertCircle size={14} />
                    {errors.pictures}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    'Add Trainee'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default VocationalTraineeForm;
