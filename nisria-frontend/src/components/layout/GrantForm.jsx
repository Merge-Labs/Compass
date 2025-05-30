import React, { useState } from 'react';
import { Calendar, DollarSign, FileText, Users, Building, MapPin, Tag, Clock, AlertCircle } from 'lucide-react';

const GrantForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fundingAgency: '',
    grantType: '',
    category: '',
    amount: '',
    currency: 'USD',
    applicationDeadline: '',
    projectStartDate: '',
    projectEndDate: '',
    duration: '',
    eligibilityCriteria: '',
    applicationRequirements: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    location: '',
    status: 'active',
    tags: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Grant title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.fundingAgency.trim()) newErrors.fundingAgency = 'Funding agency is required';
    if (!formData.amount) newErrors.amount = 'Grant amount is required';
    if (!formData.applicationDeadline) newErrors.applicationDeadline = 'Application deadline is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    
    // Email validation
    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    // Date validation
    if (formData.projectStartDate && formData.projectEndDate) {
      if (new Date(formData.projectStartDate) >= new Date(formData.projectEndDate)) {
        newErrors.projectEndDate = 'End date must be after start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Grant submitted:', formData);
      alert('Grant added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        fundingAgency: '',
        grantType: '',
        category: '',
        amount: '',
        currency: 'USD',
        applicationDeadline: '',
        projectStartDate: '',
        projectEndDate: '',
        duration: '',
        eligibilityCriteria: '',
        applicationRequirements: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        location: '',
        status: 'active',
        tags: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting grant:', error);
      alert('Error adding grant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-p1 focus:border-p1 transition-colors bg-white text-gray-900 placeholder-gray-500";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";
  const errorClasses = "text-p1 text-sm mt-1 flex items-center gap-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="h2 text-s1 mb-4">Add New Grant</h1>
            <p className="body-1 text-gray-600">Enter the grant details to add it to the system</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Basic Information */}
              <div className="lg:col-span-2">
                <h3 className="h5 text-s1 mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-p1" />
                  Basic Information
                </h3>
              </div>

              {/* Grant Title */}
              <div className="lg:col-span-2">
                <label htmlFor="title" className={labelClasses}>
                  Grant Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter grant title"
                />
                {errors.title && (
                  <p className={errorClasses}>
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label htmlFor="description" className={labelClasses}>
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={inputClasses}
                  placeholder="Describe the grant purpose and objectives"
                />
                {errors.description && (
                  <p className={errorClasses}>
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Funding Agency */}
              <div>
                <label htmlFor="fundingAgency" className={labelClasses}>
                  Funding Agency *
                </label>
                <input
                  type="text"
                  id="fundingAgency"
                  name="fundingAgency"
                  value={formData.fundingAgency}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="e.g., National Science Foundation"
                />
                {errors.fundingAgency && (
                  <p className={errorClasses}>
                    <AlertCircle className="w-4 h-4" />
                    {errors.fundingAgency}
                  </p>
                )}
              </div>

              {/* Grant Type */}
              <div>
                <label htmlFor="grantType" className={labelClasses}>
                  Grant Type
                </label>
                <select
                  id="grantType"
                  name="grantType"
                  value={formData.grantType}
                  onChange={handleInputChange}
                  className={inputClasses}
                >
                  <option value="">Select grant type</option>
                  <option value="research">Research Grant</option>
                  <option value="education">Education Grant</option>
                  <option value="community">Community Grant</option>
                  <option value="startup">Startup Grant</option>
                  <option value="nonprofit">Nonprofit Grant</option>
                  <option value="government">Government Grant</option>
                  <option value="private">Private Foundation Grant</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className={labelClasses}>
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="e.g., Healthcare, Technology, Arts"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className={labelClasses}>
                  Location/Region
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="e.g., United States, Kenya, Global"
                />
              </div>

              {/* Financial Information */}
              <div className="lg:col-span-2 pt-8 border-t border-gray-200">
                <h3 className="h5 text-s1 mb-6 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-p2" />
                  Financial Information
                </h3>
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className={labelClasses}>
                  Grant Amount *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                {errors.amount && (
                  <p className={errorClasses}>
                    <AlertCircle className="w-4 h-4" />
                    {errors.amount}
                  </p>
                )}
              </div>

              {/* Currency */}
              <div>
                <label htmlFor="currency" className={labelClasses}>
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className={inputClasses}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>

              {/* Timeline Information */}
              <div className="lg:col-span-2 pt-8 border-t border-gray-200">
                <h3 className="h5 text-s1 mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-p1" />
                  Timeline Information
                </h3>
              </div>

              {/* Application Deadline */}
              <div>
                <label htmlFor="applicationDeadline" className={labelClasses}>
                  Application Deadline *
                </label>
                <input
                  type="date"
                  id="applicationDeadline"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
                {errors.applicationDeadline && (
                  <p className={errorClasses}>
                    <AlertCircle className="w-4 h-4" />
                    {errors.applicationDeadline}
                  </p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className={labelClasses}>
                  Project Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="e.g., 12 months, 2 years"
                />
              </div>

              {/* Project Start Date */}
              <div>
                <label htmlFor="projectStartDate" className={labelClasses}>
                  Project Start Date
                </label>
                <input
                  type="date"
                  id="projectStartDate"
                  name="projectStartDate"
                  value={formData.projectStartDate}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>

              {/* Project End Date */}
              <div>
                <label htmlFor="projectEndDate" className={labelClasses}>
                  Project End Date
                </label>
                <input
                  type="date"
                  id="projectEndDate"
                  name="projectEndDate"
                  value={formData.projectEndDate}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
                {errors.projectEndDate && (
                  <p className={errorClasses}>
                    <AlertCircle className="w-4 h-4" />
                    {errors.projectEndDate}
                  </p>
                )}
              </div>

              {/* Requirements & Eligibility */}
              <div className="lg:col-span-2 pt-8 border-t border-gray-200">
                <h3 className="h5 text-s1 mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-p2" />
                  Requirements & Eligibility
                </h3>
              </div>

              {/* Eligibility Criteria */}
              <div className="lg:col-span-2">
                <label htmlFor="eligibilityCriteria" className={labelClasses}>
                  Eligibility Criteria
                </label>
                <textarea
                  id="eligibilityCriteria"
                  name="eligibilityCriteria"
                  value={formData.eligibilityCriteria}
                  onChange={handleInputChange}
                  rows={3}
                  className={inputClasses}
                  placeholder="Who is eligible to apply for this grant?"
                />
              </div>

              {/* Application Requirements */}
              <div className="lg:col-span-2">
                <label htmlFor="applicationRequirements" className={labelClasses}>
                  Application Requirements
                </label>
                <textarea
                  id="applicationRequirements"
                  name="applicationRequirements"
                  value={formData.applicationRequirements}
                  onChange={handleInputChange}
                  rows={3}
                  className={inputClasses}
                  placeholder="What documents and information are required for application?"
                />
              </div>

              {/* Contact Information */}
              <div className="lg:col-span-2 pt-8 border-t border-gray-200">
                <h3 className="h5 text-s1 mb-6 flex items-center gap-2">
                  <Building className="w-6 h-6 text-p1" />
                  Contact Information
                </h3>
              </div>

              {/* Contact Email */}
              <div>
                <label htmlFor="contactEmail" className={labelClasses}>
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="contact@fundingagency.org"
                />
                {errors.contactEmail && (
                  <p className={errorClasses}>
                    <AlertCircle className="w-4 h-4" />
                    {errors.contactEmail}
                  </p>
                )}
              </div>

              {/* Contact Phone */}
              <div>
                <label htmlFor="contactPhone" className={labelClasses}>
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Website */}
              <div className="lg:col-span-2">
                <label htmlFor="website" className={labelClasses}>
                  Website URL
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="https://www.fundingagency.org/grants"
                />
              </div>

              {/* Additional Information */}
              <div className="lg:col-span-2 pt-8 border-t border-gray-200">
                <h3 className="h5 text-s1 mb-6 flex items-center gap-2">
                  <Tag className="w-6 h-6 text-p2" />
                  Additional Information
                </h3>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className={labelClasses}>
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={inputClasses}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="closed">Closed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className={labelClasses}>
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="research, education, nonprofit (comma-separated)"
                />
              </div>

              {/* Notes */}
              <div className="lg:col-span-2">
                <label htmlFor="notes" className={labelClasses}>
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className={inputClasses}
                  placeholder="Any additional information or notes about this grant"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors base-bold"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-p1 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-p1 transition-all duration-300 base-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding Grant...
                  </>
                ) : (
                  'Add Grant'
                )}
              </button>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}


export default GrantForm;