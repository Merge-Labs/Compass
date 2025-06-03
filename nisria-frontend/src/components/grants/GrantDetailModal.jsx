import React from "react";
import {
  X,
  Loader2,
  AlertTriangle,
  Link as LinkIcon,
  Calendar,
  DollarSign,
  Info,
  Users,
  FileText,
  Briefcase,
  MapPin,
  Phone,
  Mail,
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
    console.error("Invalid date format:", dateString, e);
    return "Invalid Date";
  }
};

const formatCurrency = (value, currency = "USD") => {
  if (value == null || isNaN(parseFloat(value))) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(parseFloat(value));
};

const DetailItem = ({
  icon: Icon,
  label,
  value,
  isLink = false,
  linkHref,
  highlight = false,
}) => (
  <div
    className={`py-4 sm:grid sm:grid-cols-3 sm:gap-6 transition-colors hover:bg-gray-50 rounded-lg px-2 -mx-2 ${
      highlight ? "bg-blue-50 border-l-4 border-blue-400 pl-4" : ""
    }`}
  >
    <dt className="text-sm font-semibold text-gray-700 flex items-center">
      {Icon && (
        <Icon
          className={`w-5 h-5 mr-3 ${
            highlight ? "text-blue-600" : "text-gray-500"
          }`}
        />
      )}
      {label}
    </dt>
    <dd className="mt-2 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {isLink && value !== "N/A" ? (
        <a
          href={linkHref || value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline break-all font-medium transition-colors"
        >
          {value}
          <LinkIcon className="w-3 h-3 ml-1" />
        </a>
      ) : (
        <span
          className={`break-words ${
            value === "N/A" ? "text-gray-400 italic" : ""
          }`}
        >
          {value || "N/A"}
        </span>
      )}
    </dd>
  </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center mb-4 pb-2 border-b-2 border-gray-100">
    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
      {Icon && <Icon className="w-5 h-5 text-blue-600" />}
    </div>
    <div>
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  </div>
);

const DocumentList = ({ documents, title }) => (
  <div className="mt-4">
    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
      <FileText className="w-4 h-4 mr-2 text-gray-500" />
      {title}
    </h5>
    {documents && documents.length > 0 ? (
      <div className="grid gap-2">
        {documents.map((doc, index) => (
          <div
            key={doc.id || index}
            className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <FileText className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
            {doc.url ? (
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex-1"
              >
                {doc.name || `Document ${index + 1}`}
              </a>
            ) : (
              <span className="text-gray-700 flex-1">
                {doc.name || `Document ${index + 1}`}
              </span>
            )}
            {!doc.url && (
              <span className="text-xs text-gray-400 ml-2">(No link)</span>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-sm text-gray-500">No documents available</p>
      </div>
    )}
  </div>
);

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
      case "denied":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
        status
      )}`}
    >
      {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
    </span>
  );
};

const GrantDetailModal = ({ isOpen, onClose, grant, loading, error }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 ease-in-out"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Grant Details</h3>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive grant information
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <div className="absolute inset-0 w-12 h-12 border-4 border-blue-200 rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-4 font-medium">
                Loading grant details...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16 mx-6">
              <div className="bg-red-50 rounded-full p-4 mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <p className="font-semibold text-red-800 text-lg">
                Error loading details
              </p>
              <p className="text-sm text-red-600 mt-2 text-center max-w-md">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && grant && (
            <div className="p-6 space-y-8">
              {/* Basic Information Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <SectionHeader
                  icon={Briefcase}
                  title="Basic Information"
                  subtitle="Core grant details and status"
                />
                <div className="space-y-1">
                  <DetailItem
                    icon={Briefcase}
                    label="Organization"
                    value={grant.organization_name}
                    highlight={true}
                  />
                  <DetailItem
                    icon={DollarSign}
                    label="Amount"
                    value={formatCurrency(
                      grant.amount_value,
                      grant.amount_currency
                    )}
                    highlight={true}
                  />
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-6">
                    <dt className="text-sm font-semibold text-gray-700 flex items-center">
                      <Info className="w-5 h-5 mr-3 text-gray-500" />
                      Status
                    </dt>
                    <dd className="mt-2 sm:mt-0 sm:col-span-2">
                      <StatusBadge status={grant.status} />
                    </dd>
                  </div>
                  <DetailItem
                    icon={LinkIcon}
                    label="Application Link"
                    value={grant.application_link}
                    isLink={true}
                  />
                  <DetailItem
                    icon={Briefcase}
                    label="Program"
                    value={
                      grant.program_name &&
                      !grant.program_name.includes("<method-wrapper")
                        ? grant.program_name
                        : "N/A"
                    }
                  />
                </div>
              </section>

              {/* Notes Section */}
              {grant.notes && (
                <section className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                  <SectionHeader
                    icon={FileText}
                    title="Notes"
                    subtitle="Additional information and comments"
                  />
                  <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {grant.notes}
                    </p>
                  </div>
                </section>
              )}

              {/* Timeline Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <SectionHeader
                  icon={Calendar}
                  title="Timeline"
                  subtitle="Important dates and deadlines"
                />
                <div className="space-y-1">
                  <DetailItem
                    icon={Calendar}
                    label="Application Deadline"
                    value={formatDate(grant.application_deadline)}
                  />
                  <DetailItem
                    icon={Calendar}
                    label="Award Date"
                    value={formatDate(grant.award_date)}
                  />
                </div>
              </section>

              {/* Contact & Organization Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <SectionHeader
                  icon={Users}
                  title="Contact & Organization"
                  subtitle="Organization details and contact information"
                />
                <div className="space-y-1">
                  <DetailItem
                    icon={Users}
                    label="Submitted By"
                    value={grant.submitted_by?.split("\t - ")[0]}
                  />
                  <DetailItem
                    icon={Info}
                    label="Organization Type"
                    value={grant.organization_type}
                  />
                  <DetailItem
                    icon={MapPin}
                    label="Location"
                    value={grant.location}
                  />
                  <DetailItem
                    icon={Phone}
                    label="Contact Tel"
                    value={grant.contact_tel}
                  />
                  <DetailItem
                    icon={Mail}
                    label="Contact Email"
                    value={grant.contact_email}
                    isLink={true}
                    linkHref={`mailto:${grant.contact_email}`}
                  />
                </div>
              </section>

              {/* Documents Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <SectionHeader
                  icon={FileText}
                  title="Documents"
                  subtitle="Required and submitted documentation"
                />
                <div className="grid md:grid-cols-2 gap-6">
                  <DocumentList
                    documents={grant.required_documents}
                    title="Required Documents"
                  />
                  <DocumentList
                    documents={grant.submitted_documents}
                    title="Submitted Documents"
                  />
                </div>
              </section>

              {/* Expenditure Section */}
              {grant.expenditure && (
                <section className="bg-green-50 rounded-xl border border-green-200 p-6">
                  <SectionHeader
                    icon={DollarSign}
                    title="Expenditure Details"
                    subtitle="Budget usage and projections"
                  />
                  <div className="bg-white p-4 rounded-lg border border-green-200 space-y-1">
                    <DetailItem
                      icon={DollarSign}
                      label="Amount Used"
                      value={formatCurrency(
                        grant.expenditure.amount_used,
                        grant.amount_currency
                      )}
                    />
                    <DetailItem
                      icon={Info}
                      label="Usage Percent"
                      value={`${grant.expenditure.usage_percent || 0}%`}
                    />
                    <DetailItem
                      icon={Calendar}
                      label="Est. Depletion Date"
                      value={formatDate(
                        grant.expenditure.estimated_depletion_date
                      )}
                    />
                  </div>
                </section>
              )}

              {/* System Information Section */}
              <section className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <SectionHeader
                  icon={Info}
                  title="System Information"
                  subtitle="Record creation and modification dates"
                />
                <div className="space-y-1">
                  <DetailItem
                    icon={Calendar}
                    label="Date Created"
                    value={formatDate(grant.date_created, true)}
                  />
                  <DetailItem
                    icon={Calendar}
                    label="Last Updated"
                    value={formatDate(grant.date_updated, true)}
                  />
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrantDetailModal;
