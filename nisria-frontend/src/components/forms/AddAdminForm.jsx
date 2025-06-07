import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

const roleOptions = [
  ['super_admin', 'Super Admin'],
  ['management_lead', 'Admin (Management Lead)'],
  ['grant_officer', 'Admin (Grant Officer)'],
  ['admin', 'Admin']
];

const AddAdminForm = ({ isOpen, onClose, onAdminAdded, darkMode }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    location: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        location: '',
        password: '',
        confirmPassword: '',
        role: ''
      });
      setProfilePicture(null);
      setIsSubmitting(false);
      setError(null);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const requiredFields = ['full_name', 'email', 'password', 'role'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`"${field.replace('_', ' ')}" is required.`);
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    const data = new FormData();
    data.append('full_name', formData.full_name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('role', formData.role);

    if (formData.phone_number) data.append('phone_number', formData.phone_number);
    if (formData.location) data.append('location', formData.location);
    if (profilePicture) data.append('profile_picture', profilePicture);

    try {
      await api.post('/api/accounts/register/', data);
      onAdminAdded();
      onClose();
    } catch (err) {
      const res = err.response?.data;
      const message = res
        ? Object.entries(res).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; ')
        : err.message;
      setError(message || "Failed to create admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} w-full max-w-2xl rounded-xl shadow-lg transition-all`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add New Admin</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition">
              <X />
            </button>
          </div>

          {error && (
            <div className={`flex items-center gap-2 p-3 mb-4 rounded text-sm ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}`}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name*" name="full_name" value={formData.full_name} onChange={handleChange} darkMode={darkMode} />
            <Input label="Email*" type="email" name="email" value={formData.email} onChange={handleChange} darkMode={darkMode} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Password*" type="password" name="password" value={formData.password} onChange={handleChange} darkMode={darkMode} />
              <Input label="Confirm Password*" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} darkMode={darkMode} />
            </div>

            <Select label="Role*" name="role" value={formData.role} onChange={handleChange} options={roleOptions} darkMode={darkMode} />

            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={`w-full text-sm border rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:cursor-pointer 
                  ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 file:bg-gray-600 file:text-gray-200' : 'bg-white border-gray-300 text-gray-800 file:bg-gray-100 file:text-gray-800'}`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} darkMode={darkMode} />
              <Input label="Location" name="location" value={formData.location} onChange={handleChange} darkMode={darkMode} />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className={`flex-1 py-2 rounded-lg border font-semibold ${darkMode ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Add Admin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable input component
const Input = ({ label, name, type = 'text', value, onChange, darkMode }) => (
  <div>
    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 rounded-lg border focus:ring-1 focus:ring-blue-500 focus:border-blue-500
        ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
      required={label.includes('*')}
    />
  </div>
);

// Reusable select component
const Select = ({ label, name, value, onChange, options, darkMode }) => (
  <div>
    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 rounded-lg border focus:ring-1 focus:ring-blue-500 focus:border-blue-500
        ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
      required
    >
      <option value="">Select Role</option>
      {options.map(([val, text]) => (
        <option key={val} value={val}>{text}</option>
      ))}
    </select>
  </div>
);

export default AddAdminForm;
