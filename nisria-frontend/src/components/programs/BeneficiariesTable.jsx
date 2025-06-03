import React from 'react';
import { Eye, Edit, Trash2, MapPin, Phone, AlertCircle, Loader2, Calendar, User, Plus } from 'lucide-react';

// Utility function to format date (can be moved to a shared utils file if needed)
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

// Utility function to get display data based on program type
const getDisplayData = (beneficiary, programType) => {
  const type = programType?.toLowerCase();

  switch (type) {
    case 'education':
      return {
        name: beneficiary.student_name || 'N/A',
        subtitle: `${beneficiary.education_level || 'N/A'} • ${beneficiary.school_associated || 'N/A'}`,
        location: beneficiary.student_location || 'N/A',
        contact: beneficiary.student_contact || 'N/A',
        extra: `${beneficiary.start_date || 'N/A'} - ${beneficiary.end_date || 'N/A'}`,
        created_at: beneficiary.created_at,
        // Add other relevant fields if needed
      };
    case 'microfund':
      return {
        name: beneficiary.person_name || 'N/A',
        subtitle: beneficiary.chama_group || 'N/A',
        location: beneficiary.location || 'N/A',
        contact: beneficiary.telephone || 'N/A',
        extra: beneficiary.is_active !== undefined ? (beneficiary.is_active ? 'Active' : 'Inactive') : 'N/A',
        created_at: beneficiary.created_at,
        // Add other relevant fields if needed
      };
    case 'rescue':
      return {
        name: beneficiary.child_name || 'N/A',
        subtitle: `Age ${beneficiary.age || 'N/A'} • ${beneficiary.place_found || 'N/A'}`,
        location: beneficiary.place_found || 'N/A',
        contact: beneficiary.rescuer_contact || 'N/A',
        extra: beneficiary.is_reunited !== undefined ? (beneficiary.is_reunited ? 'Reunited' : 'Under Care') : 'N/A',
        created_at: beneficiary.created_at,
        // Add other relevant fields if needed
      };
    case 'vocational': // Assuming vocational-trainers endpoint returns these fields
      return {
        name: beneficiary.trainee_name || beneficiary.trainer_name || 'N/A',
        subtitle: beneficiary.trainee_association || beneficiary.trainer_association || 'N/A',
        location: beneficiary.location || 'N/A', // Assuming location might exist
        contact: beneficiary.trainee_phone || beneficiary.trainer_phone || 'N/A',
        extra: beneficiary.under_training !== undefined ? (beneficiary.under_training ? 'In Training' : 'Completed') : 'N/A',
        created_at: beneficiary.created_at,
        // Add other relevant fields if needed
      };
    default:
      return {
        name: beneficiary.name || 'Unknown Beneficiary',
        subtitle: 'N/A',
        location: 'N/A',
        contact: 'N/A',
        extra: 'N/A',
        created_at: beneficiary.created_at,
      };
  }
};

const BeneficiariesTable = ({
  beneficiaries,
  programType,
  loading,
  error,
  // Add action handlers as props if needed later
  onViewDetails,
  onEditBeneficiary,
  onDeleteBeneficiary,
  onAddNewBeneficiary, // New prop for the add button
}) => {
  if (loading) {
    return (
      <div className="text-center py-10">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading beneficiaries...</p>
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

  if (!beneficiaries || beneficiaries.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No beneficiaries found for this program.</p>
        {/* Optionally, show Add button even if table is empty, if onAddNewBeneficiary is provided */}
      </div>
    );
  }

  // Define table columns - can be made dynamic based on programType if needed
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'subtitle', label: 'Details' },
    { key: 'location', label: 'Location', icon: MapPin },
    { key: 'contact', label: 'Contact', icon: Phone },
    { key: 'extra', label: 'Status/Extra' },
    { key: 'created_at', label: 'Added On', icon: Calendar },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm overflow-hidden">
      {/* Table Header with Add Button */}
      {onAddNewBeneficiary && (
        <div className="p-4 border-b border-gray-200/50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Beneficiaries List</h3>
          <button
            onClick={onAddNewBeneficiary}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Add New</span>
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/50">
          <thead className="bg-gray-50/50">
            <tr>
              {columns.map(col => (
                <th key={col.key} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.icon && <col.icon className="w-4 h-4 inline-block mr-1" />} {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white/30 divide-y divide-gray-200/50">
            {beneficiaries.map((beneficiary) => {
              const data = getDisplayData(beneficiary, programType);
              return (
                <tr key={beneficiary.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{data.subtitle}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{data.location}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{data.contact}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{data.extra}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{formatDateDisplay(data.created_at)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex items-center space-x-1">
                      {/* Placeholder buttons - implement onClick handlers later */}
                      <button onClick={() => onViewDetails && onViewDetails(beneficiary.id)} className="text-gray-400 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50/70" title="View Details"><Eye size={16} /></button>
                      <button onClick={() => onEditBeneficiary && onEditBeneficiary(beneficiary.id)} className="text-gray-400 hover:text-green-600 p-1.5 rounded-md hover:bg-green-50/70" title="Edit Beneficiary"><Edit size={16} /></button>
                      <button onClick={() => onDeleteBeneficiary && onDeleteBeneficiary(beneficiary.id)} className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50/70" title="Delete Beneficiary"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination can be added here if needed */}
    </div>
  );
};

BeneficiariesTable.defaultProps = {
  beneficiaries: [],
};

export default BeneficiariesTable;