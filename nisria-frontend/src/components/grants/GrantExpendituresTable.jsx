import React from 'react';
import { Edit, AlertCircle, Loader2 } from 'lucide-react';

// Utility Functions (can be moved to a shared utils file)
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
    console.error("Invalid date for display:", dateString, e);
    return 'Invalid Date';
  }
};

const GrantExpendituresTable = ({ expenditures, loading, error, onEditExpenditure }) => {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading grant expenditures...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 rounded-lg p-4 my-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  if (!expenditures || expenditures.length === 0) {
    return <div className="text-center py-10 text-gray-500">No expenditure data found for approved grants.</div>;
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/50">
          <thead className="bg-gray-50/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grant Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Used</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Depletion Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white/30 divide-y divide-gray-200/50">
            {expenditures.map((exp) => (
              <tr key={exp.grantId} className="hover:bg-white/40 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exp.grantName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {exp.isPlaceholder || exp.amount_used == null ? 'N/A' : formatCurrencyDisplay(exp.amount_used, exp.amount_currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {exp.isPlaceholder || !exp.estimated_depletion_date ? 'N/A' : formatDateDisplay(exp.estimated_depletion_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <button onClick={() => onEditExpenditure(exp)} className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-md hover:bg-indigo-50/70" title="Edit Expenditure" disabled={exp.error || exp.isPlaceholder && exp.amount_used == null}><Edit size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

GrantExpendituresTable.defaultProps = {
  expenditures: [],
};

export default GrantExpendituresTable;