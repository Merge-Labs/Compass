import React from "react";
import {
  X,
  Loader2,
  AlertTriangle,
  User,
  BookOpen,
  MapPin,
  Phone,
  Calendar,
  Briefcase, // For school
  Building2, // For division
  Info,
} from "lucide-react";

const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return "N/A";
  try {
    const options = { year: "numeric", month: "long", day: "numeric" };
    if (includeTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }
    return new Date(dateString).toLocaleDateString("en-US", options);
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid Date";
  }
};

const DetailItem = ({ icon: Icon, label, value, highlight = false }) => (
  <div
    className={`py-3 sm:grid sm:grid-cols-3 sm:gap-4 transition-colors hover:bg-gray-50 rounded-lg px-2 -mx-2 ${
      highlight ? "bg-blue-50 border-l-4 border-blue-400 pl-3" : ""
    }`}
  >
    <dt className="text-sm font-semibold text-gray-700 flex items-center">
      {Icon && (
        <Icon
          className={`w-5 h-5 mr-2.5 ${
            highlight ? "text-blue-600" : "text-gray-500"
          }`}
        />
      )}
      {label}
    </dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      <span
        className={`break-words ${
          value === "N/A" || value === undefined || value === null ? "text-gray-400 italic" : ""
        }`}
      >
        {value === undefined || value === null ? "N/A" : String(value)}
      </span>
    </dd>
  </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
    {Icon && <Icon className="w-5 h-5 text-blue-600 mr-3" />}
    <h4 className="text-md font-semibold text-gray-700">{title}</h4>
  </div>
);

const EducationBeneficiaryDetailModal = ({ isOpen, onClose, beneficiary, loading, error, programName, divisionName }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h3 className="text-lg font-semibold text-gray-800">
            Education Beneficiary Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-gray-500 mt-3">Loading details...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertTriangle size={32} className="text-red-500 mb-3" />
              <p className="font-medium text-red-700">Error loading details</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && beneficiary && (
            <div className="space-y-6">
              <section>
                <SectionHeader icon={User} title="Student Information" />
                <DetailItem icon={User} label="Student Name" value={beneficiary.student_name} highlight />
                <DetailItem icon={BookOpen} label="Education Level" value={beneficiary.education_level} />
                <DetailItem icon={Briefcase} label="School Associated" value={beneficiary.school_associated} />
                <DetailItem icon={MapPin} label="Student Location" value={beneficiary.student_location} />
                <DetailItem icon={Phone} label="Student Contact" value={beneficiary.student_contact} />
              </section>

              <section>
                <SectionHeader icon={Calendar} title="Enrollment Timeline" />
                <DetailItem icon={Calendar} label="Start Date" value={formatDate(beneficiary.start_date)} />
                <DetailItem icon={Calendar} label="End Date" value={formatDate(beneficiary.end_date)} />
              </section>

              <section>
                <SectionHeader icon={Briefcase} title="Program Association" />
                <DetailItem icon={Briefcase} label="Program" value={programName || "N/A"} />
                <DetailItem icon={Building2} label="Division" value={divisionName || "N/A"} />
              </section>

              <section>
                <SectionHeader icon={Info} title="System Information" />
                <DetailItem icon={Calendar} label="Date Created" value={formatDate(beneficiary.created_at, true)} />
                <DetailItem icon={Calendar} label="Last Updated" value={formatDate(beneficiary.updated_at, true)} />
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationBeneficiaryDetailModal;