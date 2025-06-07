import React from 'react';
import { X, User, Briefcase, Phone, Calendar, CheckSquare, Users as TrainerIcon } from 'lucide-react';

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500 flex items-center">
      {Icon && <Icon className="w-5 h-5 mr-2 text-gray-400" />}
      {label}
    </dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-words">
      {value || 'N/A'}
    </dd>
  </div>
);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Invalid Date';
  }
};

const VocationalTraineeDetailModal = ({ isOpen, onClose, beneficiary, programName, divisionName, trainerName }) => {
  if (!isOpen || !beneficiary) return null;

  const trainee = beneficiary; // Alias for clarity

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Vocational Trainee Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"><X size={22} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Program Information</h4>
            <p className="text-xs text-gray-600">
              Division: {divisionName || 'N/A'} | Program: {programName || 'N/A'}
              {trainerName && ` | Trainer: ${trainerName}`}
            </p>
          </div>

          <section>
            <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Trainee Profile</h4>
            <dl className="divide-y divide-gray-200">
              <DetailItem icon={User} label="Trainee Name" value={trainee.trainee_name} />
              <DetailItem icon={Briefcase} label="Course Enrolled" value={trainee.course_enrolled} />
              <DetailItem icon={Briefcase} label="Training Center" value={trainee.training_center} />
              <DetailItem icon={Phone} label="Trainee Phone" value={trainee.trainee_phone} />
            </dl>
          </section>

          <section>
            <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Training Details</h4>
            <dl className="divide-y divide-gray-200">
              <DetailItem icon={Calendar} label="Start Date" value={formatDate(trainee.start_date)} />
              <DetailItem icon={Calendar} label="Expected End Date" value={formatDate(trainee.expected_end_date)} />
              <DetailItem 
                icon={CheckSquare} 
                label="Training Status" 
                value={trainee.under_training ? 'Currently Under Training' : 'Training Completed'} 
              />
              {/* Add other trainee-specific fields if any, e.g., performance_notes, attendance_rate */}
            </dl>
          </section>

          <section>
            <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">System Information</h4>
            <dl className="divide-y divide-gray-200">
                <DetailItem icon={Calendar} label="Date Created" value={formatDate(trainee.created_at)} />
                <DetailItem icon={Calendar} label="Last Updated" value={formatDate(trainee.updated_at)} />
            </dl>
          </section>

        </div>

        <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Close
          </button>
          {/* Optional: Add Edit button if edit functionality is separate for trainees */}
          {/* <button 
            type="button" 
            // onClick={() => onEditTrainee(trainee)} 
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Edit Trainee
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default VocationalTraineeDetailModal;