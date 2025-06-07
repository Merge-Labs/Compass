import React from 'react';
import { X, User, Briefcase, Phone, Mail, Users as GenderIcon, Calendar } from 'lucide-react';

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

const VocationalTrainerDetailModal = ({ isOpen, onClose, beneficiary, programName, divisionName }) => {
  if (!isOpen || !beneficiary) return null;

  const trainer = beneficiary; // Alias for clarity

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Vocational Trainer Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"><X size={22} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Program Information</h4>
            <p className="text-xs text-gray-600">Division: {divisionName || 'N/A'} | Program: {programName || 'N/A'}</p>
          </div>

          <section>
            <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Trainer Profile</h4>
            <dl className="divide-y divide-gray-200">
              <DetailItem icon={User} label="Trainer Name" value={trainer.trainer_name} />
              <DetailItem icon={GenderIcon} label="Gender" value={trainer.gender} />
              <DetailItem icon={Briefcase} label="Trainer Association" value={trainer.trainer_association} />
              <DetailItem icon={Phone} label="Trainer Phone" value={trainer.trainer_phone} />
              <DetailItem icon={Mail} label="Trainer Email" value={trainer.trainer_email} />
              {/* Add other trainer-specific fields if any, e.g., years_of_experience, certifications */}
            </dl>
          </section>

          <section>
            <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">System Information</h4>
            <dl className="divide-y divide-gray-200">
                <DetailItem icon={Calendar} label="Date Created" value={formatDate(trainer.created_at)} />
                <DetailItem icon={Calendar} label="Last Updated" value={formatDate(trainer.updated_at)} />
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
          {/* Optional: Add Edit button if edit functionality is separate for trainers */}
          {/* <button 
            type="button" 
            // onClick={() => onEditTrainer(trainer)} 
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Edit Trainer
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default VocationalTrainerDetailModal;