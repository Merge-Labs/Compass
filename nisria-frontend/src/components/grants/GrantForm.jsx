import React, { useState, useEffect } from "react";
import api from "../../services/api";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import Select from "react-select";
import { getData as getCountryData } from "country-list";
import "react-phone-number-input/style.css";
import {
  Building,
  DollarSign,
  FileText,
  MapPin,
  AlertCircle,
  Link,
  Phone,
  Mail,
  Briefcase,
  CalendarClock,
  Award,
  Activity,
  Banknote,
  Users,
  X,
} from "lucide-react";

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

const GrantForm = ({ isOpen, onClose, onGrantAdded }) => {
  // console.log(`GrantForm rendered. isOpen: ${isOpen}`);
  const [formData, setFormData] = useState(initialFormData);
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [currentCountry, setCurrentCountry] = useState("");
  const [currentRegion, setCurrentRegion] = useState("");
  const [programs, setPrograms] = useState([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [programsError, setProgramsError] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const styles = `
    .custom-phone-input .PhoneInputInput {
      width: 100% !important;
      padding: 0.75rem 1rem !important; /* 12px 16px */
      border: 1px solid #D1D5DB !important; /* gray-300 */
      border-radius: 0.5rem !important; /* rounded-lg */
      transition: all 0.2s ease-in-out !important;
      background-color: white !important;
      color: #111827 !important; /* gray-900 */
    }
    .custom-phone-input .PhoneInputInput:focus {
      border-color: #ef4444 !important; /* p1 color (assuming red-500) */
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5) !important; /* focus:ring-p1 */
    }
    .custom-phone-input .PhoneInputCountrySelectArrow {
      opacity: 0.7 !important;
    }
    `;
    const styleTagId = "grant-form-phone-input-styles";
    if (!document.getElementById(styleTagId)) {
      const styleSheet = document.createElement("style");
      styleSheet.id = styleTagId;
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // Fetch programs and documents when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingPrograms(true);
      setIsLoadingDocuments(true);
      setProgramsError(null);
      
      try {
        // Fetch programs
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

  if (!isOpen) return null; // Don't render if not open

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    // This handler is for standard HTML input events that provide e.target
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Specific handler for PhoneInput
  const handlePhoneInputChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      contact_tel: value || "", // Ensure it's an empty string if undefined
    }));
    if (errors.contact_tel) {
      setErrors((prev) => ({
        ...prev,
        contact_tel: "",
      }));
    }
  };

  const updateCombinedLocation = (country, region) => {
    const combined = country && region ? `${country} - ${region}` : (country || region || "");
    setFormData((prev) => ({
        ...prev,
      location: combined,
    }));
    if (errors.location) {
      setErrors((prev) => ({
        ...prev,
        location: "",
      }));
    }
  };

  const handleCountryChange = (selectedOption) => {
    const countryValue = selectedOption ? selectedOption.value : "";
    setCurrentCountry(countryValue);
    updateCombinedLocation(countryValue, currentRegion);
  };

  // Handler for the new Region/City input
  const handleRegionChange = (e) => {
    const regionValue = e.target.value;
    setCurrentRegion(regionValue);
    updateCombinedLocation(currentCountry, regionValue);
  };


  const validateForm = () => {
    const newErrors = {};

    // Required fields from schema
    if (!formData.organization_name.trim())
      newErrors.organization_name = "Organization name is required";
    else if (formData.organization_name.trim().length > 255)
      newErrors.organization_name = "Max 255 chars";

    if (!formData.amount_currency.trim())
      newErrors.amount_currency = "Amount currency is required";
    else if (formData.amount_currency.trim().length > 10)
      newErrors.amount_currency = "Max 10 chars";

    if (
      formData.amount_value === null ||
      formData.amount_value === undefined ||
      String(formData.amount_value).trim() === ""
    )
      newErrors.amount_value = "Amount value is required";
    else if (
      isNaN(parseFloat(formData.amount_value)) ||
      parseFloat(formData.amount_value) < 0
    )
      newErrors.amount_value = "Must be a valid positive number";

    if (formData.contact_tel && formData.contact_tel.trim() !== '') {
      if (!isValidPhoneNumber(formData.contact_tel)) {
        newErrors.contact_tel = "Invalid phone number format";
      } else if (formData.contact_tel.length > 20) {
        // E.164 format can be up to 15 digits + '+'
        newErrors.contact_tel =
          "Phone number seems too long (max 20 chars with code)";
      }
    }

    if (!formData.contact_email.trim())
      newErrors.contact_email = "Contact email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.contact_email))
      newErrors.contact_email = "Invalid email format";
    else if (formData.contact_email.trim().length > 254)
      newErrors.contact_email = "Max 254 chars";

    if (!currentCountry) newErrors.location = "Country is required.";
    else if (!currentRegion.trim()) newErrors.location = "Region/City is required.";
    else if (formData.location.trim().length > 255) // Combined length check
      newErrors.location = "Combined location is too long (max 255 chars)";

    if (!formData.organization_type)
      newErrors.organization_type = "Organization type is required";

    // Optional fields with validation
    if (
      formData.application_link &&
      !/^https?:\/\/.+/.test(formData.application_link)
    ) {
      newErrors.application_link = "Invalid URL format";
    }
    if (formData.application_link && formData.application_link.length > 200) {
      newErrors.application_link = "Max 200 chars";
    }

    if (formData.application_deadline && formData.award_date) {
      if (
        new Date(formData.application_deadline) >= new Date(formData.award_date)
      ) {
        newErrors.award_date = "Award date must be after application deadline";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    // Prepare the payload according to backend requirements
    const payload = {
      organization_name: formData.organization_name,
      amount_currency: formData.amount_currency,
      amount_value: String(formData.amount_value),
      contact_email: formData.contact_email,
      location: formData.location,
      organization_type: formData.organization_type,
      application_link: formData.application_link || null,
      program: formData.program || null,
      notes: formData.notes || null,
      contact_tel: formData.contact_tel || null,
      application_deadline: formData.application_deadline || null,
      award_date: formData.award_date || null,
      required_documents: formData.required_documents,
      status: formData.status,
    };

    try {
      const response = await api.post("/api/grants/", payload);
      console.log("Grant submitted:", response.data);
      // alert('Grant added successfully!'); TODO add pop up
      setFormData(initialFormData);
      setCurrentCountry("");
      setCurrentRegion("");
      setErrors({});
      if (onGrantAdded) onGrantAdded(response.data); // Callback with new grant data
      onClose(); // Close modal on success
    } catch (error) {
      console.error(
        "Error submitting grant:",
        error.response?.data || error.message
      );
      let errorMessage =
        "Error adding grant. Please check the form for errors or try again.";
      if (error.response && error.response.data) {
        const backendErrors = {};
        let specificMessages = [];
        if (
          typeof error.response.data === "object" &&
          error.response.data !== null
        ) {
          for (const key in error.response.data) {
            const message = Array.isArray(error.response.data[key])
              ? error.response.data[key].join(", ")
              : String(error.response.data[key]);
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
          if (specificMessages.length > 0) {
            errorMessage = specificMessages.join("\n");
          } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          }
        } else if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        }
      }
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAndClose = () => {
    setFormData(initialFormData); // Reset form on cancel
    setCurrentCountry("");
    setCurrentRegion("");
    setErrors({});
    onClose();
  };
  const inputClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-p1 focus:border-p1 transition-colors  text-gray-900 placeholder-gray-500";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";
  const errorClasses = "text-p1 text-sm mt-1 flex items-center gap-1";

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: 'calc(1.5em + 1.5rem + 2px)', // Matches py-3 (0.75rem * 2 for top/bottom) + border
      paddingLeft: '0.25rem', 
      paddingRight: '0.25rem',
      borderColor: state.isFocused ? '#ef4444' : (errors.location ? '#ef4444' : '#D1D5DB'), // p1 for focus/error, gray-300 default
      borderRadius: '0.5rem', // rounded-lg
      boxShadow: state.isFocused ? '0 0 0 2px rgba(239, 68, 68, 0.5)' : (errors.location ? '0 0 0 2px rgba(239, 68, 68, 0.5)' : null), // focus:ring-2 focus:ring-p1
      '&:hover': {
        borderColor: state.isFocused ? '#ef4444' : (errors.location ? '#ef4444' : '#A9A9A9'),
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
    }),
    menu: (provided) => ({ ...provided, zIndex: 20 }), // Ensure menu is above other elements if needed
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
            <h3 className="text-2xl font-bold text-gray-800">Add New Grant</h3>
            <p className="text-sm text-gray-600 mt-1">
              Enter the grant details to add it to the system
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Organization & Grant Details */}
            <div className="lg:col-span-2">
              <h3 className="h5 text-s1 mb-6 flex items-center gap-2">
                <Building className="w-6 h-6 text-p1" />
                Organization & Grant Details
              </h3>
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
                  singleValue: (provided) => ({
                    ...provided,
                    color: '#111827',
                    margin: 0,
                    padding: 0,
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

            {/* Organization Name */}
            <div className="lg:col-span-2">
              <label htmlFor="organization_name" className={labelClasses}>
                Organization Name *
              </label>
              <input
                type="text"
                id="organization_name"
                name="organization_name"
                value={formData.organization_name}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="Enter organization name"
                maxLength={255}
              />
              {errors.organization_name && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.organization_name}
                </p>
              )}
            </div>

            {/* Organization Type */}
            <div>
              <label htmlFor="organization_type" className={labelClasses}>
                Organization Type *
              </label>
              <select
                id="organization_type"
                name="organization_type"
                value={formData.organization_type}
                onChange={handleInputChange}
                className={inputClasses}
              >
                {organizationTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.organization_type && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.organization_type}
                </p>
              )}
            </div>

            {/* Country (UI Field) */}
            <div>
              <label htmlFor="currentCountry" className={labelClasses}>
                Country *
              </label>
              <Select
                id="currentCountry" // ID for the UI element
                name="currentCountry"
                options={countryOptions}
                value={countryOptions.find(option => option.value === currentCountry)}
                onChange={handleCountryChange}
                styles={customSelectStyles}
                placeholder="Select or type a country..."
                isClearable
                isSearchable
                classNamePrefix="react-select" // Optional: for global CSS targeting if needed
                isDisabled={isSubmitting}
              />
              {errors.location && ( // Display general location error here
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.location}
                </p>
              )}
            </div>
            
            {/* Region/City */}
            <div>
              <label htmlFor="currentRegion" className={labelClasses}>
                Region/City *
              </label>
              <input
                type="text"
                id="currentRegion" // ID for the UI element
                name="currentRegion"
                value={currentRegion}
                onChange={handleRegionChange}
                className={inputClasses}
                placeholder="e.g., Nairobi, California"
                maxLength={100} // Example max length for region part
                disabled={isSubmitting}
              />
              {/* Error for region is implicitly covered by errors.location check on Country field */}
              {/* Or, if you want a specific message for region if country is filled: */}
              {errors.location && currentCountry && !currentRegion.trim() && (
                <p className={errorClasses}>{errors.location}</p>
              )}
            </div>

            {/* Application Link */}
            <div className="lg:col-span-2">
              <label htmlFor="application_link" className={labelClasses}>
                Application Link
              </label>
              <input
                type="url"
                id="application_link"
                name="application_link"
                value={formData.application_link}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="https://example.com/grant-application"
                maxLength={200}
              />
              {errors.application_link && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.application_link}
                </p>
              )}
            </div>

            {/* Financial Information */}
            <div className="lg:col-span-2 pt-8 border-t border-gray-200">
              <h3 className="h5 text-s1 mb-6 flex items-center gap-2">
                <Banknote className="w-6 h-6 text-p2" />
                Financial Information
              </h3>
            </div>

            {/* Amount Value */}
            <div>
              <label htmlFor="amount_value" className={labelClasses}>
                Amount Value *
              </label>
              <input
                type="number"
                id="amount_value"
                name="amount_value"
                value={formData.amount_value}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="0"
                min="0"
                step="0.01"
              />
              {errors.amount_value && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.amount_value}
                </p>
              )}
            </div>

            {/* Currency */}
            <div>
              <label htmlFor="currency" className={labelClasses}>
                Amount Currency *
              </label>
              <select
                id="amount_currency"
                name="amount_currency"
                value={formData.amount_currency}
                onChange={handleInputChange}
                className={inputClasses}
              >
                {currencyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.amount_currency && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.amount_currency}
                </p>
              )}
            </div>

            {/* Dates & Deadlines */}
            <div className="lg:col-span-2 pt-8 border-t border-gray-200">
              <h3 className="h5 text-s1 mb-6 flex items-center gap-2">
                <CalendarClock className="w-6 h-6 text-p1" />
                Dates & Deadlines
              </h3>
            </div>

            {/* Application Deadline */}
            <div>
              <label htmlFor="applicationDeadline" className={labelClasses}>
                Application Deadline
              </label>
              <input
                type="date"
                id="application_deadline"
                name="application_deadline"
                value={formData.application_deadline}
                onChange={handleInputChange}
                className={inputClasses}
              />
              {errors.application_deadline && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.application_deadline}
                </p>
              )}
            </div>

            {/* Award Date */}
            <div>
              <label htmlFor="award_date" className={labelClasses}>
                Award Date
              </label>
              <input
                type="date"
                id="award_date"
                name="award_date"
                value={formData.award_date}
                onChange={handleInputChange}
                className={inputClasses}
              />
              {errors.award_date && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.award_date}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-2 pt-8 border-t border-gray-200">
              <h3 className="h5 text-s1 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-p1" /> {/* Icon for contacts */}
                Contact Information
              </h3>
            </div>

            {/* Contact Email */}
            <div>
              <label htmlFor="contactEmail" className={labelClasses}>
                Contact Email * <Mail className="inline w-4 h-4 ml-1" />
              </label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="contact@fundingagency.org"
                maxLength={254}
              />
              {errors.contact_email && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.contact_email}
                </p>
              )}
            </div>

            {/* Contact Phone */}
            <div>
              <label htmlFor="contactPhone" className={labelClasses}>
                Contact Phone *
              </label>
              <PhoneInput
                international
                defaultCountry="US" // You can set a default country
                placeholder="Enter phone number"
                id="contact_tel" // For label association
                name="contact_tel"
                value={formData.contact_tel}
                onChange={handlePhoneInputChange}
                className="custom-phone-input" // Add a custom class for styling if needed
              />
              {/* Note: inputClasses might not perfectly style PhoneInput's internal input.
                    You might need specific CSS for .custom-phone-input .PhoneInputInput */}
              {errors.contact_tel && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.contact_tel}
                </p>
              )}
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
                      backgroundColor: !state.isDisabled 
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

            {/* Additional Information */}
            <div className="lg:col-span-2 pt-8 border-t border-gray-200">
              <h3 className="h5 text-s1 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-p2" />
                Additional Information
              </h3>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className={labelClasses}>
                Status <Activity className="inline w-4 h-4 ml-1" />
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={inputClasses}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className={errorClasses}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.status}
                </p>
              )}
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
                rows={4}
                className={inputClasses}
                placeholder="Any additional information or notes about this grant"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancelAndClose}
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
                "Add Grant"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantForm;
