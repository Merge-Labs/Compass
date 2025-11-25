import React, { useState, useEffect } from "react";
import api from "../../services/api";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import Select from "react-select";
import { getData as getCountryData } from "country-list";
import "react-phone-number-input/style.css"; // Ensure this is handled globally or scoped
import {
  Building,
  DollarSign,
  FileText,
  // MapPin, // Not used directly in form, but good for consistency
  AlertCircle,
  // Link, // Icon for links, not directly used in form fields
  // Phone, // Icon for phone, not directly used in form fields
  // Mail, // Icon for mail, not directly used in form fields
  // Briefcase, // Icon for org type, not directly used in form fields
  CalendarClock,
  // Award, // Icon for award date, not directly used in form fields
  Activity,
  Banknote,
  Users,
  X,
} from "lucide-react";

// Constants (can be moved to a shared file later)
const initialFormData = {
  organization_name: "",
  amount_currency: "USD",
  amount_value: "",
  contact_email: "",
  location: "",
  organization_type: "normal",
  application_link: "",
  program: "",
  notes: "",
  status: "pending",
  contact_tel: "",
  application_deadline: "",
  award_date: "",
  required_documents: [],
};

const organizationTypeOptions = [
  { value: "normal", label: "Normal Organization" },
  { value: "grant_awarder", label: "Grant Awarder" },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "applied", label: "Applied" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
  { value: "expired", label: "Expired" },
];

const currencyOptions = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "KES", label: "KES - Kenyan Shilling" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
];

const countryOptions = getCountryData().map((country) => ({
  value: country.name,
  label: country.name,
}));

const GrantFormUpdate = ({ isOpen, onClose, onGrantUpdated, existingGrant }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [currentCountry, setCurrentCountry] = useState("");
  const [currentRegion, setCurrentRegion] = useState("");
  const [programs, setPrograms] = useState([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [programsError, setProgramsError] = useState(null);
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch programs and documents when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingPrograms(true);
      setIsLoadingDocuments(true);
      setProgramsError(null);
      
      try {
        // Fetch programs and documents in parallel
        const [programsResponse, documentsResponse] = await Promise.all([
          api.get('/api/programs/programs/'),
          api.get('/api/documents/') // Adjust this endpoint as per your API
        ]);
        
        setPrograms(programsResponse.data.results || []);
        setAvailableDocuments(documentsResponse.data.results || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProgramsError('Failed to load required data. Please refresh the page.');
      } finally {
        setIsLoadingPrograms(false);
        setIsLoadingDocuments(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (existingGrant) {
      let country = "";
      let region = "";
      if (existingGrant.location) {
        const parts = existingGrant.location.split(" - ");
        country = parts[0] || "";
        region = parts.length > 1 ? parts.slice(1).join(" - ") : "";
      }
      setCurrentCountry(country);
      setCurrentRegion(region);

      setFormData({
        organization_name: existingGrant.organization_name || "",
        amount_currency: existingGrant.amount_currency || "USD",
        amount_value: existingGrant.amount_value || "",
        contact_email: existingGrant.contact_email || "",
        location: existingGrant.location || "",
        organization_type: (existingGrant.organization_type || "normal").toLowerCase(),
        application_link: existingGrant.application_link || "",
        program: existingGrant.program || "",
        notes: existingGrant.notes || "",
        status: (existingGrant.status || "pending").toLowerCase(),
        contact_tel: existingGrant.contact_tel || "",
        application_deadline: existingGrant.application_deadline ? existingGrant.application_deadline.split('T')[0] : "",
        award_date: existingGrant.award_date ? existingGrant.award_date.split('T')[0] : "",
        required_documents: existingGrant.required_documents || [],
      });
    } else {
      setFormData(initialFormData);
      setCurrentCountry("");
      setCurrentRegion("");
    }
  }, [existingGrant]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhoneInputChange = (value) => {
    setFormData((prev) => ({ ...prev, contact_tel: value || "" }));
    if (errors.contact_tel) setErrors((prev) => ({ ...prev, contact_tel: "" }));
  };

  const updateCombinedLocation = (country, region) => {
    const combined = country && region ? `${country} - ${region}` : (country || region || "");
    setFormData((prev) => ({ ...prev, location: combined }));
    if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));
  };

  const handleCountryChange = (selectedOption) => {
    const countryValue = selectedOption ? selectedOption.value : "";
    setCurrentCountry(countryValue);
    updateCombinedLocation(countryValue, currentRegion);
  };

  const handleRegionChange = (e) => {
    const regionValue = e.target.value;
    setCurrentRegion(regionValue);
    updateCombinedLocation(currentCountry, regionValue);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.organization_name.trim()) newErrors.organization_name = "Organization name is required";
    else if (formData.organization_name.trim().length > 255) newErrors.organization_name = "Max 255 chars";
    if (!formData.amount_currency.trim()) newErrors.amount_currency = "Amount currency is required";
    if (String(formData.amount_value).trim() === "") newErrors.amount_value = "Amount value is required";
    else if (isNaN(parseFloat(formData.amount_value)) || parseFloat(formData.amount_value) < 0) newErrors.amount_value = "Must be a valid positive number";
    if (formData.contact_tel && formData.contact_tel.trim() !== '') {
      if (!isValidPhoneNumber(formData.contact_tel)) {
        newErrors.contact_tel = "Invalid phone number format";
      } else if (formData.contact_tel.length > 20) {
        newErrors.contact_tel = "Phone number seems too long (max 20 chars with code)";
      }
    }
    if (!formData.contact_email.trim()) newErrors.contact_email = "Contact email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) newErrors.contact_email = "Invalid email format";
    if (!currentCountry) newErrors.location = "Country is required.";
    else if (!currentRegion.trim()) newErrors.location = "Region/City is required.";
    else if (formData.location.trim().length > 255) newErrors.location = "Combined location is too long (max 255 chars)";
    if (!formData.organization_type) newErrors.organization_type = "Organization type is required";
    if (formData.application_link && !/^https?:\/\/.+/.test(formData.application_link)) newErrors.application_link = "Invalid URL format";
    if (formData.application_deadline && formData.award_date && new Date(formData.application_deadline) >= new Date(formData.award_date)) {
      newErrors.award_date = "Award date must be after application deadline";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !existingGrant?.id) return;
    setIsSubmitting(true);

    const payload = {
      ...formData,
      application_link: formData.application_link || null,
      notes: formData.notes || null,
      application_deadline: formData.application_deadline || null,
      award_date: formData.award_date || null,
      amount_value: String(formData.amount_value),
    };

    try {
      const response = await api.put(`/api/grants/${existingGrant.id}/`, payload);
      console.log("Grant updated:", response.data);
      setErrors({});
      if (onGrantUpdated) onGrantUpdated(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating grant:", error.response?.data || error.message);
      let errorMessage = "Error updating grant. Please check the form for errors or try again.";
      if (error.response && error.response.data) {
        const backendErrors = {};
        let specificMessages = [];
        if (typeof error.response.data === "object" && error.response.data !== null) {
          for (const key in error.response.data) {
            const message = Array.isArray(error.response.data[key]) ? error.response.data[key].join(", ") : String(error.response.data[key]);
            if (Object.prototype.hasOwnProperty.call(initialFormData, key)) {
              backendErrors[key] = message;
            } else {
              specificMessages.push(`${key}: ${message}`);
            }
          }
          if (Object.keys(backendErrors).length > 0) {
            setErrors((prevErrors) => ({ ...prevErrors, ...backendErrors }));
            errorMessage = "Please check the form for errors.";
          }
          if (specificMessages.length > 0) errorMessage = specificMessages.join("\n");
          else if (error.response.data.detail) errorMessage = error.response.data.detail;
        } else if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        }
      }
      alert(errorMessage); // Consider using a more integrated notification system
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAndClose = () => {
    // Reset to existingGrant data if available, otherwise initialFormData
    if (existingGrant) {
        let country = "";
        let region = "";
        if (existingGrant.location) {
            const parts = existingGrant.location.split(" - ");
            country = parts[0] || "";
            region = parts.length > 1 ? parts.slice(1).join(" - ") : "";
        }
        setCurrentCountry(country);
        setCurrentRegion(region);
        setFormData({
            organization_name: existingGrant.organization_name || "",
            application_link: existingGrant.application_link || "",
            amount_currency: existingGrant.amount_currency || "USD",
            amount_value: existingGrant.amount_value || "",
            notes: existingGrant.notes || "",
            status: existingGrant.status || "PENDING",
            contact_tel: existingGrant.contact_tel || "",
            contact_email: existingGrant.contact_email || "",
            location: existingGrant.location || "",
            organization_type: existingGrant.organization_type || "NORMAL",
            application_deadline: existingGrant.application_deadline ? existingGrant.application_deadline.split('T')[0] : "",
            award_date: existingGrant.award_date ? existingGrant.award_date.split('T')[0] : "",
        });
    } else {
        setFormData(initialFormData);
        setCurrentCountry("");
        setCurrentRegion("");
    }
    setErrors({});
    onClose();
  };

  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-p1 focus:border-p1 transition-colors bg-white text-gray-900 placeholder-gray-500";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";
  const errorClasses = "text-p1 text-sm mt-1 flex items-center gap-1";

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: 'calc(1.5em + 1.5rem + 2px)',
      paddingLeft: '0.25rem',
      paddingRight: '0.25rem',
      borderColor: state.isFocused ? '#ef4444' : (errors.location ? '#ef4444' : '#D1D5DB'),
      borderRadius: '0.5rem',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(239, 68, 68, 0.5)' : (errors.location ? '0 0 0 2px rgba(239, 68, 68, 0.5)' : null),
      '&:hover': {
        borderColor: state.isFocused ? '#ef4444' : (errors.location ? '#ef4444' : '#A9A9A9'),
      },
      backgroundColor: 'white',
      transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    }),
    valueContainer: (provided) => ({ ...provided, padding: '2px 8px' }),
    input: (provided) => ({ ...provided, color: '#111827', margin: '0px', paddingTop: '0px', paddingBottom: '0px' }),
    placeholder: (provided) => ({ ...provided, color: '#6B7280' }),
    singleValue: (provided) => ({ ...provided, color: '#111827' }),
    menu: (provided) => ({ ...provided, zIndex: 20 }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#ef4444' : state.isFocused ? '#FEE2E2' : 'white',
      color: state.isSelected ? 'white' : '#111827',
      '&:active': {
        backgroundColor: !state.isDisabled ? (state.isSelected ? '#ef4444' : '#FCA5A5') : undefined,
      },
    }),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 ease-in-out"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Update Grant Details</h3>
            <p className="text-sm text-gray-600 mt-1">
              Modify the grant information below
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-white/50 transition-all duration-200 hover:scale-105"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2">
              <h3 className="h5 text-s1 mb-6 flex items-center gap-2">
                <Building className="w-6 h-6 text-p1" />
                Organization & Grant Details
              </h3>
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="organization_name" className={labelClasses}>Organization Name *</label>
              <input type="text" id="organization_name" name="organization_name" value={formData.organization_name} onChange={handleInputChange} className={inputClasses} placeholder="Enter organization name" maxLength={255} />
              {errors.organization_name && <p className={errorClasses}><AlertCircle className="w-4 h-4" />{errors.organization_name}</p>}
            </div>

            <div>
              <label htmlFor="organization_type" className={labelClasses}>Organization Type *</label>
              <select id="organization_type" name="organization_type" value={formData.organization_type} onChange={handleInputChange} className={inputClasses}>
                {organizationTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {errors.organization_type && <p className={errorClasses}><AlertCircle className="w-4 h-4" />{errors.organization_type}</p>}
            </div>

            {/* Program Selection */}
            <div className="lg:col-span-2">
              <label htmlFor="program" className={labelClasses}>
                Associated Program
              </label>
              <Select
                id="program"
                name="program"
                options={programs.map(program => ({
                  value: program.id,
                  label: program.name,
                  division: program.division_name_display
                }))}
                value={programs
                  .map(program => ({
                    value: program.id,
                    label: program.name,
                    division: program.division_name_display
                  }))
                  .find(option => String(option.value) === String(formData.program))}
                onChange={(selectedOption) => {
                  setFormData(prev => ({
                    ...prev,
                    program: selectedOption ? selectedOption.value : ""
                  }));
                  if (errors.program) {
                    setErrors(prev => ({
                      ...prev,
                      program: ""
                    }));
                  }
                }}
                isClearable
                isSearchable
                placeholder="Select a program (optional)"
                isLoading={isLoadingPrograms}
                loadingMessage={() => "Loading programs..."}
                noOptionsMessage={() => programsError || "No programs found"}
                className="text-sm"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    minHeight: 'calc(1.5em + 1.5rem + 2px)',
                    paddingLeft: '0.25rem',
                    paddingRight: '0.25rem',
                    borderColor: state.isFocused ? '#3b82f6' : (errors.program ? '#3b82f6' : '#D1D5DB'),
                    borderRadius: '0.5rem',
                    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : (errors.program ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : null),
                    '&:hover': {
                      borderColor: state.isFocused ? '#3b82f6' : (errors.program ? '#3b82f6' : '#A9A9A9'),
                    },
                    backgroundColor: 'white',
                    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    padding: '2px 8px',
                  }),
                  input: (provided) => ({
                    ...provided,
                    color: '#111827',
                    margin: '0px',
                    paddingTop: '0px',
                    paddingBottom: '0px',
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: '#6B7280',
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: '#111827',
                    margin: 0,
                    padding: 0,
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected 
                      ? '#3b82f6' 
                      : state.isFocused ? '#dbeafe' : 'white',
                    color: state.isSelected ? 'white' : '#111827',
                    '&:active': {
                      backgroundColor: !state.isDisabled 
                        ? (state.isSelected ? '#3b82f6' : '#93c5fd') 
                        : undefined,
                    },
                  }),
                }}
              />
              {errors.program && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.program}
                </p>
              )}
              {programsError && (
                <p className="text-yellow-600 text-sm mt-1">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  {programsError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="currentCountry" className={labelClasses}>Country *</label>
              <Select id="currentCountry" name="currentCountry" options={countryOptions} value={countryOptions.find(option => option.value === currentCountry)} onChange={handleCountryChange} styles={customSelectStyles} placeholder="Select or type a country..." isClearable isSearchable isDisabled={isSubmitting} />
              {errors.location && <p className={errorClasses}><AlertCircle className="w-4 h-4" />{errors.location}</p>}
            </div>
            
            <div>
              <label htmlFor="currentRegion" className={labelClasses}>Region/City *</label>
              <input type="text" id="currentRegion" name="currentRegion" value={currentRegion} onChange={handleRegionChange} className={inputClasses} placeholder="e.g., Nairobi, California" maxLength={100} disabled={isSubmitting} />
              {errors.location && currentCountry && !currentRegion.trim() && <p className={errorClasses}>{errors.location}</p>}
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="application_link" className={labelClasses}>Application Link</label>
              <input type="url" id="application_link" name="application_link" value={formData.application_link} onChange={handleInputChange} className={inputClasses} placeholder="https://example.com/grant-application" maxLength={200} />
              {errors.application_link && <p className={errorClasses}><AlertCircle className="w-4 h-4" />{errors.application_link}</p>}
            </div>

            <div className="lg:col-span-2 pt-8 border-t border-gray-200">
              <h3 className="h5 text-s1 mb-6 flex items-center gap-2"><Banknote className="w-6 h-6 text-p2" />Financial Information</h3>
            </div>

            <div>
              <label htmlFor="amount_value" className={labelClasses}>Amount Value *</label>
              <input type="number" id="amount_value" name="amount_value" value={formData.amount_value} onChange={handleInputChange} className={inputClasses} placeholder="0" min="0" step="0.01" />
              {errors.amount_value && <p className={errorClasses}><AlertCircle className="w-4 h-4" />{errors.amount_value}</p>}
            </div>

            <div>
              <label htmlFor="amount_currency" className={labelClasses}>Amount Currency *</label>
              <select id="amount_currency" name="amount_currency" value={formData.amount_currency} onChange={handleInputChange} className={inputClasses}>
                {currencyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {errors.amount_currency && <p className={errorClasses}><AlertCircle className="w-4 h-4" />{errors.amount_currency}</p>}
            </div>

            <div className="lg:col-span-2 pt-8 border-t border-gray-200">
              <h3 className="h5 text-s1 mb-6 flex items-center gap-2"><CalendarClock className="w-6 h-6 text-p1" />Dates & Deadlines</h3>
            </div>

            <div>
              <label htmlFor="application_deadline" className={labelClasses}>Application Deadline</label>
              <input type="date" id="application_deadline" name="application_deadline" value={formData.application_deadline} onChange={handleInputChange} className={inputClasses} />
              {errors.application_deadline && <p className={errorClasses}><AlertCircle className="w-4 h-4" />{errors.application_deadline}</p>}
            </div>

            <div>
              <label htmlFor="award_date" className={labelClasses}>Award Date</label>
              <input type="date" id="award_date" name="award_date" value={formData.award_date} onChange={handleInputChange} className={inputClasses} />
              {errors.award_date && <p className={errorClasses}><AlertCircle className="w-4 h-4" />{errors.award_date}</p>}
            </div>

            <div className="lg:col-span-2 pt-8 border-t border-gray-200">
              <h3 className="h5 text-s1 mb-6 flex items-center gap-2"><Users className="w-6 h-6 text-p1" />Contact Information</h3>
            </div>

            <div>
              <label htmlFor="contact_email" className={labelClasses}>Contact Email *</label>
              <input type="email" id="contact_email" name="contact_email" value={formData.contact_email} onChange={handleInputChange} className={inputClasses} placeholder="contact@example.org" maxLength={254} />
              {errors.contact_email && <p className={errorClasses}><AlertCircle className="w-4 h-4" />{errors.contact_email}</p>}
            </div>

            <div>
              <label htmlFor="contact_tel" className={labelClasses}>Contact Phone *</label>
              <PhoneInput international defaultCountry="US" placeholder="Enter phone number" id="contact_tel" name="contact_tel" value={formData.contact_tel} onChange={handlePhoneInputChange} className="custom-phone-input" />
              {errors.contact_tel && <p className={errorClasses}><AlertCircle className="w-4 h-4" />{errors.contact_tel}</p>}
            </div>

            {/* Required Documents */}
            <div className="lg:col-span-2">
              <label htmlFor="required_documents" className={labelClasses}>
                Required Documents
              </label>
              <Select
                id="required_documents"
                name="required_documents"
                isMulti
                options={availableDocuments.map(doc => ({
                  value: doc.id,
                  label: doc.name || `Document ${doc.id}`
                }))}
                value={formData.required_documents?.map(docId => ({
                  value: docId,
                  label: availableDocuments.find(d => d.id === docId)?.name || `Document ${docId}`
                }))}
                onChange={(selectedOptions) => {
                  setFormData(prev => ({
                    ...prev,
                    required_documents: selectedOptions ? selectedOptions.map(opt => opt.value) : []
                  }));
                }}
                isClearable
                isSearchable
                placeholder="Select required documents..."
                isLoading={isLoadingDocuments}
                loadingMessage={() => "Loading documents..."}
                noOptionsMessage={() => "No documents found"}
                className="text-sm"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: 'calc(1.5em + 1.5rem + 2px)',
                    borderColor: '#D1D5DB',
                    '&:hover': {
                      borderColor: '#A9A9A9',
                    },
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected 
                      ? '#3b82f6' 
                      : state.isFocused ? '#dbeafe' : 'white',
                    color: state.isSelected ? 'white' : '#111827',
                    '&:active': {
                      backgroundColor: !state.disabled 
                        ? (state.isSelected ? '#3b82f6' : '#93c5fd') 
                        : undefined,
                    },
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: '#F3F4F6',
                  }),
                  multiValueLabel: (provided) => ({
                    ...provided,
                    color: '#111827',
                  }),
                }}
              />
            </div>

            <div className="lg:col-span-2 pt-8 border-t border-gray-200">
              <h3 className="h5 text-s1 mb-6 flex items-center gap-2"><FileText className="w-6 h-6 text-p2" />Additional Information</h3>
            </div>

            <div>
              <label htmlFor="status" className={labelClasses}>Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleInputChange} className={inputClasses}>
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {errors.status && <p className={errorClasses}><AlertCircle className="w-4 h-4" />{errors.status}</p>}
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="notes" className={labelClasses}>Additional Notes</label>
              <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={4} className={inputClasses} placeholder="Any additional information..." />
            </div>

            <div className="lg:col-span-2 flex justify-end gap-4 mt-8 pt-8 border-t border-gray-200">
              <button type="button" onClick={handleCancelAndClose} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors base-bold" disabled={isSubmitting}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-gradient-to-r from-p1 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-p1 transition-all duration-300 base-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {isSubmitting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Updating Grant...</>) : ("Update Grant")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// The PhoneInput CSS is assumed to be handled globally as in GrantForm.jsx
// If not, ensure the styles are applied here as well.
/*
const styles = `
.custom-phone-input .PhoneInputInput { ... }
...
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
*/

export default GrantFormUpdate;