import React from 'react';
import {
  Eye,
  Edit,
  Trash2,
  Calendar,
  Building,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from 'lucide-react';

// Utility Functions
const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    applied: 'bg-blue-100 text-blue-800 border-blue-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    denied: 'bg-red-100 text-red-800 border-red-200',
    expired: 'bg-gray-200 text-gray-800 border-gray-300', 
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const formatCurrencyDisplay = (value, currency) => {
  if (value == null || isNaN(parseFloat(value))) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(value));
};

const formatDateDisplay = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    console.error(e);
    return 'Invalid Date';
  }
};

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'N/A';
  const words = name.split(' ').filter(Boolean);
  if (words.length === 0) return 'N/A';
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + (words[1][0] || '')).toUpperCase();
};

const parseSubmittedBy = (submittedByString) => {
  if (!submittedByString || typeof submittedByString !== 'string') return { name: 'N/A', role: '' };
  const parts = submittedByString.split('\t - ');
  return { name: parts[0]?.trim() || 'N/A', role: parts[1]?.trim() || '' };
};

const GrantsTable = ({
  grants,
  loading,
  error,
  selectedGrants,
  onSelectGrant,
  onSelectAll,
  onStatusChange,
  onViewDetails,
  onEditGrant,
  onDeleteGrant,
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
}) => {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading grants data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 rounded-lg p-4 my-6">
        <div className="flex items-center">
          <XCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
          <span className="text-red-700 text-sm">{typeof error === 'object' ? JSON.stringify(error) : error}</span>
        </div>
      </div>
    );
  }

  if (!grants || grants.length === 0) {
    return <div className="text-center py-10 text-gray-500">No grants found.</div>;
  }

  const currentItemsOnPage = grants.length;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200/50">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              aria-label="Select all grants on this page"
              checked={currentItemsOnPage > 0 && selectedGrants.length === currentItemsOnPage}
              onChange={onSelectAll}
              disabled={currentItemsOnPage === 0}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs sm:text-sm text-gray-600">
              {selectedGrants.length} of {currentItemsOnPage} selected
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {totalResults} Results
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/50">
          <thead className="bg-gray-50/50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white/30 divide-y divide-gray-200/50">
            {grants.map((grant) => (
              <tr key={grant.id} className="hover:bg-white/40 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      aria-label={`Select grant ${grant.organization_name}`}
                      checked={selectedGrants.includes(grant.id)}
                      onChange={() => onSelectGrant(grant.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <div className="flex items-center">
                      <div className="w-7 h-7 mr-2 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-semibold flex-shrink-0" title={grant.organization_name}>
                        {getInitials(grant.organization_name)}
                      </div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {/* <Building className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0 hidden sm:inline-block" /> */}
                        {grant.organization_name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-xs" title={grant.notes}>
                    {grant.notes || 'No notes'}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatCurrencyDisplay(grant.amount_value, grant.amount_currency)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <select
                    value={grant.status}
                    onChange={(e) => onStatusChange(grant.id, e.target.value)}
                    className={`text-xs font-medium border cursor-pointer rounded-full py-1 pl-2 pr-7 appearance-none ${getStatusColor(grant.status)}`}
                    aria-label={`Status of grant ${grant.organization_name}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="applied">Applied</option>
                    <option value="approved">Approved</option>
                    <option value="denied">Denied</option>
                    <option value="expired">Expired</option>
                  </select>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
                    {formatDateDisplay(grant.application_deadline)}
                  </div>
                  {grant.award_date && (
                     <div className="text-xs text-gray-500 mt-1 ml-5">
                       Award: {formatDateDisplay(grant.award_date)}
                     </div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    {grant.program_name && !grant.program_name.includes('<method-wrapper') ? grant.program_name : 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-7 h-7 mr-2 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                      <User size={14} />
                    </div>
                    <div className="text-sm text-gray-900">
                      {parseSubmittedBy(grant.submitted_by).name}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                  {(grant.required_documents?.length > 0 || grant.submitted_documents?.length > 0) ? (
                    <div className="flex flex-col space-y-1">
                      {grant.required_documents?.map(doc => (
                        <a key={doc.id || doc.name} href={doc.url || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center" onClick={(e) => { if (!doc.url) e.preventDefault(); console.log("View required doc:", doc); }}>
                          <FileText size={14} className="mr-1 flex-shrink-0" /> {doc.name || 'Required Doc'}
                        </a>
                      ))}
                      {grant.submitted_documents?.map(doc => (
                        <a key={doc.id || doc.name} href={doc.url || '#'} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline flex items-center" onClick={(e) => { if (!doc.url) e.preventDefault(); console.log("View submitted doc:", doc); }}>
                          <FileText size={14} className="mr-1 flex-shrink-0" /> {doc.name || 'Submitted Doc'}
                        </a>
                      ))}
                    </div>
                  ) : (<span className="text-xs">None</span>)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-1">
                    <button onClick={() => onViewDetails(grant.id)} className="text-gray-400 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50/70" title="View Details"><Eye size={16} /></button>
                    <button onClick={() => onEditGrant(grant.id)} className="text-gray-400 hover:text-green-600 p-1.5 rounded-md hover:bg-green-50/70" title="Edit Grant"><Edit size={16} /></button>
                    <button onClick={() => onDeleteGrant(grant.id)} className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50/70" title="Delete Grant"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200/50">
          <div className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-0">
            Page {currentPage} of {totalPages}. Showing {currentItemsOnPage} of {totalResults} results.
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft size={16} /></button>
            <span className="p-2 text-xs sm:text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md">{currentPage}</span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrantsTable;