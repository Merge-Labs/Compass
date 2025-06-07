import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Adjust path as needed
import { Loader2, AlertTriangle, X } from 'lucide-react';

// Re-using constants from DocumentUploadForm.jsx
// In a larger app, these could be moved to a shared constants file.
const DOCUMENT_TYPES = [
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'cbo_cert', label: 'CBO Certificate' },
  { value: 'ngo_cert', label: 'NGO Certificate' },
  { value: 'impact_report', label: 'Impact Report' },
  { value: 'pitch_deck', label: 'Pitch Deck' },
  { value: 'monthly_budget_nisria', label: 'Monthly Budget Nisria' },
  { value: 'monthly_budget_maisha', label: 'Monthly Budget Maisha' },
  { value: 'yearly_budget_nisria', label: 'Yearly Budget Nisria' },
  { value: 'yearly_budget_maisha', label: 'Yearly Budget Maisha' },
  { value: 'overall_budget', label: 'Overall Budget' },
  // Add other types as needed, ensure they match backend choices
];

const DOCUMENT_FORMATS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'excel', label: 'Excel (XLSX, XLS)' },
  { value: 'docx', label: 'Word (DOCX, DOC)' },
  { value: 'canva', label: 'Canva Link' },
  { value: 'pptx', label: 'PowerPoint (PPTX)' },
  { value: 'jpg', label: 'JPG Image' },
  { value: 'png', label: 'PNG Image' },
  // Add other formats as needed
];

const DIVISIONS = [
  { value: 'overall', label: 'Overall' },
  { value: 'nisira', label: 'Nisria' }, // Assuming 'nisira' is the correct value for Nisria
  { value: 'maisha', label: 'Maisha' },
  // Add other divisions as needed
];

const DocumentUpdateForm = ({ isOpen, onClose, onUpdateSuccess, isDark, existingDocument }) => {
  const initialFormData = {
    name: '',
    description: '',
    document_type: '',
    document_format: '',
    document_link: '',
    division: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (existingDocument) {
      setFormData({
        name: existingDocument.name || '',
        description: existingDocument.description || '',
        document_type: existingDocument.document_type || '', // Ensure this matches the value in DOCUMENT_TYPES
        document_format: existingDocument.document_format || '', // Ensure this matches the value in DOCUMENT_FORMATS
        document_link: existingDocument.document_link || '',
        division: existingDocument.division || '', // Ensure this matches the value in DIVISIONS
      });
      setError(null);
      setFieldErrors({});
    } else {
      setFormData(initialFormData); // Reset if no document or document becomes null
    }
  }, [existingDocument]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required.';
    if (formData.name.length > 255) errors.name = 'Name cannot exceed 255 characters.';
    if (!formData.document_type) errors.document_type = 'Document type is required.';
    if (!formData.document_format) errors.document_format = 'Document format is required.';
    if (!formData.document_link.trim()) errors.document_link = 'Document link is required.';
    if (formData.document_link.length > 200) errors.document_link = 'Document link cannot exceed 200 characters.';
    try {
        new URL(formData.document_link);
    } catch (e) {
        console.error(e);
        if (!errors.document_link) errors.document_link = 'Document link must be a valid URL.';
    }
    if (!formData.division) errors.division = 'Division is required.';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm() || !existingDocument?.id) {
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/api/documents/${existingDocument.id}/`, formData);
      onUpdateSuccess();
      onClose(); // Close form on success
    } catch (err) {
      console.error('Update failed:', err);
      const apiError = err.response?.data;
      if (apiError && typeof apiError === 'object') {
        const backendFieldErrors = {};
        let generalError = 'Update failed. Please check the details and try again.';
        Object.keys(apiError).forEach(key => {
          if (Object.keys(initialFormData).includes(key)) {
            backendFieldErrors[key] = Array.isArray(apiError[key]) ? apiError[key].join(' ') : apiError[key];
          } else if (key === 'detail' || typeof apiError[key] === 'string') {
            generalError = apiError[key];
          }
        });
        setFieldErrors(prev => ({ ...prev, ...backendFieldErrors }));
        setError(generalError);
      } else {
         setError(err.response?.data?.detail || err.message || 'An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = `w-full p-2 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`;
  const labelClass = `block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;
  const errorClass = 'text-red-500 text-xs mt-1';

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ease-in-out" onClick={handleBackdropClick}>
      <div className={`rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Update Document
          </h3>
          <button onClick={onClose} className={`p-1 rounded-md ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}>
            <X size={20} />
          </button>
        </div>

        {error && !Object.keys(fieldErrors).some(key => fieldErrors[key]) && (
          <div className={`p-3 mb-4 rounded-md text-sm ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'} flex items-center gap-2`}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Form fields are identical to DocumentUploadForm, so they are omitted for brevity but should be copied here */}
            {/* Name */}
            <div>
              <label htmlFor="name" className={labelClass}>Name*</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} maxLength="255" required />
              {fieldErrors.name && <p className={errorClass}>{fieldErrors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClass}>Description</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" className={inputClass}></textarea>
              {fieldErrors.description && <p className={errorClass}>{fieldErrors.description}</p>}
            </div>

            {/* Document Type */}
            <div>
              <label htmlFor="document_type" className={labelClass}>Document Type*</label>
              <select name="document_type" id="document_type" value={formData.document_type} onChange={handleChange} className={inputClass} required>
                <option value="">Select type...</option>
                {DOCUMENT_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
              {fieldErrors.document_type && <p className={errorClass}>{fieldErrors.document_type}</p>}
            </div>

            {/* Document Format */}
            <div>
              <label htmlFor="document_format" className={labelClass}>Document Format*</label>
              <select name="document_format" id="document_format" value={formData.document_format} onChange={handleChange} className={inputClass} required>
                <option value="">Select format...</option>
                {DOCUMENT_FORMATS.map(format => <option key={format.value} value={format.value}>{format.label}</option>)}
              </select>
              {fieldErrors.document_format && <p className={errorClass}>{fieldErrors.document_format}</p>}
            </div>
            
            {/* Document Link */}
            <div>
              <label htmlFor="document_link" className={labelClass}>Document Link (URL)*</label>
              <input type="url" name="document_link" id="document_link" value={formData.document_link} onChange={handleChange} placeholder="https://example.com/document.pdf" className={inputClass} maxLength="200" required />
              {fieldErrors.document_link && <p className={errorClass}>{fieldErrors.document_link}</p>}
            </div>

            {/* Division */}
            <div>
              <label htmlFor="division" className={labelClass}>Division*</label>
              <select name="division" id="division" value={formData.division} onChange={handleChange} className={inputClass} required>
                <option value="">Select division...</option>
                {DIVISIONS.map(div => <option key={div.value} value={div.value}>{div.label}</option>)}
              </select>
              {fieldErrors.division && <p className={errorClass}>{fieldErrors.division}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDark ? 'text-gray-300 hover:bg-gray-700 disabled:bg-gray-700' : 'text-gray-600 hover:bg-gray-100 disabled:bg-gray-100'
              } disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center min-w-[80px] transition-colors disabled:bg-blue-400"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpdateForm;