import React from "react";
import {
  X,
  Loader2,
  AlertTriangle,
  User,
  Users,
  MapPin,
  Phone,
  Calendar,
  CheckCircle,
  Briefcase,
  Building2,
  Info,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  BarChart,
  Home,
  Star,
  Gift,
  Shield,
  DollarSign,
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

const DetailItem = ({ icon: Icon, label, value, children, highlight = false }) => (
  <div
    className={`py-3 sm:grid sm:grid-cols-3 sm:gap-4 transition-colors hover:bg-gray-50/50 rounded-lg px-2 -mx-2 ${
      highlight ? "bg-blue-50/30 border-l-2 border-blue-400 pl-3" : ""
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
          value === "N/A" || value === undefined || value === null
            ? "text-gray-400 italic"
            : ""
        }`}
      >
        {children ??
          (value === undefined || value === null ? "N/A" : String(value))}
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

const MicrofundBeneficiaryDetailModal = ({ isOpen, onClose, beneficiary, loading, error, programName, divisionName }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h3 className="text-lg font-semibold text-gray-800">
            Microfund Beneficiary Details
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
              {/* Main Info Section with Picture */}
              <section className="flex flex-col sm:flex-row items-start gap-6 p-4 bg-gray-50/70 rounded-lg">
                {typeof beneficiary.picture_url === "string" &&
                beneficiary.picture_url ? (
                  <img
                    src={beneficiary.picture_url}
                    alt={beneficiary.person_name}
                    className="w-32 h-32 object-cover rounded-xl border-2 border-white shadow-md flex-shrink-0"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {beneficiary.person_name}
                  </h2>
                  <p className="text-gray-500">
                    Member of {beneficiary.chama_group}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <DetailItem icon={User} label="Age" value={beneficiary.age} />
                    <DetailItem icon={User} label="Gender" value={beneficiary.gender} />
                    <DetailItem icon={Phone} label="Telephone" value={beneficiary.telephone} />
                    <DetailItem icon={MapPin} label="Location" value={beneficiary.location} />
                  </div>
                </div>
              </section>

              <section>
                <SectionHeader icon={FileText} title="Personal Story & Background" />
                <DetailItem icon={MessageSquare} label="Story">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed text-gray-800">{beneficiary.story || "N/A"}</p>
                </DetailItem>
                <DetailItem icon={Info} label="Background">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed text-gray-800">{beneficiary.background || "N/A"}</p>
                </DetailItem>
              </section>

              <section>
                <SectionHeader icon={Users} title="Group & Project Details" />
                <DetailItem icon={Briefcase} label="Role in Group" value={beneficiary.role_in_group} />
                <DetailItem icon={DollarSign} label="Money Received" value={beneficiary.money_received ? `$${Number(beneficiary.money_received).toLocaleString()}` : 'N/A'} />
                <DetailItem icon={BarChart} label="Project Done">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed text-gray-800">{beneficiary.project_done || "N/A"}</p>
                </DetailItem>
              </section>

              <section>
                <SectionHeader icon={Info} title="Notes & Support" />
                <DetailItem icon={BarChart} label="Progress Notes" value={beneficiary.progress_notes} />
                <DetailItem icon={Home} label="Site Visit Notes" value={beneficiary.site_visit_notes} />
                <DetailItem icon={Star} label="Testimonials" value={beneficiary.testimonials} />
                <DetailItem icon={Gift} label="Additional Support" value={beneficiary.additional_support} />
              </section>

              <section>
                <SectionHeader icon={Briefcase} title="Program Association" />
                <DetailItem icon={Briefcase} label="Program" value={programName || "N/A"} />
                <DetailItem icon={Building2} label="Division" value={divisionName || "N/A"} />
                <DetailItem icon={CheckCircle} label="Status">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${beneficiary.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {beneficiary.is_active ? 'Active' : 'Inactive'}
                  </span>
                </DetailItem>
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

export default MicrofundBeneficiaryDetailModal;