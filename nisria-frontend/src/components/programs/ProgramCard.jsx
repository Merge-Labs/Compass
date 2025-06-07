import React from 'react';
import ProgramBaseCard from './ProgramBaseCard';
import { BookOpen, DollarSign, Heart, Briefcase, Users, ChevronRight, Edit } from 'lucide-react';

const ProgramCard = ({ program, onSelect, onEdit }) => { // Added onEdit prop
  const programIcons = {
    education: BookOpen,
    microfund: DollarSign,
    rescue: Heart,
    vocational: Briefcase
  };

  const programColors = {
    education: 'blue',
    microfund: 'green',
    rescue: 'red',
    vocational: 'purple'
  };

  // Safely access program.name and provide a fallback
  const programNameString = typeof program.name === 'string' ? program.name : '';
  const programDescriptionString = typeof program.description === 'string' ? program.description : 'No description available.';
  const divisionNameDisplayString = typeof program.division_name_display === 'string' ? program.division_name_display : 'N/A';

  const Icon = programIcons[programNameString.toLowerCase()] || Users;
  const color = programColors[programNameString.toLowerCase()] || 'gray';

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    gray: 'bg-gray-50 text-gray-600'
  };

  return (
    <ProgramBaseCard className="p-6 hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">{programNameString || 'Unnamed Program'}</h3>
            <p className="text-sm text-gray-500">{divisionNameDisplayString} Division</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Edit Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(program); }} // Prevent card click when editing
            className="p-1 rounded-full text-gray-400 hover:text-blue-600 hover:bg-gray-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => onSelect(program)} /> {/* Keep Chevron for navigation */}
        </div>

      </div>

      <p className="text-gray-600 mb-4 text-sm">{programDescriptionString}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Monthly Budget</span>
          <span className="text-sm font-medium text-gray-900">
            ${parseFloat(program.monthly_budget).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Annual Budget</span>
          <span className="text-sm font-medium text-gray-900">
            ${parseFloat(program.annual_budget).toLocaleString()}
          </span>
        </div>
      </div>
    </ProgramBaseCard>
  );
};
export default ProgramCard;