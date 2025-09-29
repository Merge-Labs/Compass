import React from 'react';
import { Eye, Edit, Trash2, User, Users, BookOpen, Heart, Briefcase as VocationalIcon, DollarSign, UserPlus, List, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeProvider';
 
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Invalid Date';
  }
};

const BeneficiariesTable = ({ beneficiaries, programType, loading, error, onViewDetails, onEditBeneficiary, onDeleteBeneficiary, onViewTrainees, onAddNewBeneficiary, searchTerm }) => {
   const { theme } = useTheme();
  
  const getProgramSpecificColumns = () => {
    switch (programType) {
      case 'education':
        return [
          { header: 'Name', accessor: 'student_name' },
          { header: 'School', accessor: 'school' },
          { header: 'Age', accessor: 'age' },
          { header: 'Grade', accessor: 'grade' },
          { header: 'Guardian', accessor: 'guardian_name' },
        ];
      case 'microfund':
        return [
          { header: 'Person Name', accessor: 'person_name' },
          { header: 'Chama Group', accessor: 'chama_group' },
          { header: 'Location', accessor: 'location' },
          { header: 'Money Received', accessor: 'money_received', render: (data) => data ? `$${Number(data).toLocaleString()}`: 'N/A' },
          { header: 'Status', accessor: 'is_active', render: (data) => data ? 'Active' : 'Inactive' },
        ];
      case 'rescue':
        return [
          { header: 'Child Name', accessor: 'child_name' },
          { header: 'Age', accessor: 'age' },
          { header: 'Date of Rescue', accessor: 'date_of_rescue', render: (data) => formatDate(data) },
          { header: 'Location of Rescue', accessor: 'location_of_rescue' },
          { header: 'Case Type', accessor: 'case_type' },
        ];
      case 'vocational-trainer':
        return [
          { header: 'Trainer Name', accessor: 'trainer_name' },
          { header: 'Association', accessor: 'trainer_association' },
          { header: 'Phone', accessor: 'trainer_phone' },
          { header: 'Email', accessor: 'trainer_email' },
          { header: 'Gender', accessor: 'gender' },
        ];
      case 'vocational-trainee':
        return [
          { header: 'Trainee Name', accessor: 'trainee_name' },
          { header: 'Training Received', accessor: 'training_received' },
          { header: 'Phone', accessor: 'trainee_phone' },
          { header: 'Start Date', accessor: 'start_date', render: (data) => formatDate(data) },
          { 
            header: 'Status', 
            accessor: 'post_training_status', 
            render: (data) => data ? data.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'
          },
        ];
      default:
        return [{ header: 'Name', accessor: 'name' }, { header: 'Details', accessor: 'details' }];
    }
  };

  const columns = [
    ...getProgramSpecificColumns(),
    { header: 'Actions', accessor: 'actions' },
  ];

  if (loading) {
    return <div className="text-center py-10">Loading beneficiaries...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading beneficiaries: {typeof error === 'string' ? error : error.message}</div>;
  }

  // Determine the item type based on programType for the empty state message
  const itemType = programType === 'vocational-trainer' ? 'trainers' 
                 : programType === 'vocational-trainee' ? 'trainees' 
                 : 'beneficiaries';

  if (!beneficiaries || beneficiaries.length === 0) {
    return (
      <div className="text-center py-8 mt-4">
        <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No {itemType} found
        </h3>
        <p className="text-gray-600 mb-6">
          {searchTerm ? 'Try adjusting your search terms or ' : ''}
          Get started by adding a new {itemType.slice(0, -1)} to this program. {/* Remove 's' for singular */}
        </p>
        {onAddNewBeneficiary && (
          <button
            onClick={onAddNewBeneficiary}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          ><Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />Add New {itemType.slice(0, -1)}</button>
        )}
      </div>
    );
  }

  return (
    <div className={`shadow-md rounded-lg overflow-hidden glass-surface ${theme === 'light' ? 'bg-white/70 border border-white/40' : 'bg-gray-800/80 border border-gray-700'}`}>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  scope="col"                  
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}

                >
                  {col.header}
                </th>
              ))}
            </tr>

          </thead>          
          <tbody className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} divide-y divide-gray-200`}>
            {beneficiaries.map((beneficiary) => (
              <tr key={beneficiary.id || beneficiary.temp_id} className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-500'} transition-colors`}>
                {columns.map((col) => (
                  <td key={col.accessor} className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {col.accessor === 'actions' ? (
                    
                      <div className="flex space-x-2">                   
                        <button
                          onClick={() => onViewDetails(beneficiary)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-100"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => onEditBeneficiary && onEditBeneficiary(beneficiary)}
                          className="text-green-600 hover:text-green-800 p-1 rounded-md hover:bg-green-100"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        {programType === 'vocational-trainer' && onViewTrainees && (
                          <button
                            onClick={() => onViewTrainees(beneficiary)}
                            className="text-purple-600 hover:text-purple-800 p-1 rounded-md hover:bg-purple-100"
                            title="View Trainees"
                          >
                            <List size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteBeneficiary && onDeleteBeneficiary(beneficiary)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ) : col.render ? (
                      col.render(beneficiary[col.accessor])
                    ) : (
                      beneficiary[col.accessor] || 'N/A'
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BeneficiariesTable;