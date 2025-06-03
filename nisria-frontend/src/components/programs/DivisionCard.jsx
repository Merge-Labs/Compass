import React from 'react';
import ProgramBaseCard from './ProgramBaseCard';
import { Building2, ChevronRight, DollarSign, Calendar } from 'lucide-react';

const DivisionCard = ({ division, onSelect }) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <ProgramBaseCard className="p-6 hover:shadow-lg transition-all duration-200" onClick={() => onSelect(division)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">{division.name}</h3>
            <p className="text-sm text-gray-500">Division</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      <p className="text-gray-600 mb-4 text-sm">{division.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(division.total_budget)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">
            {new Date(division.date_created).toLocaleDateString()}
          </span>
        </div>
      </div>
    </ProgramBaseCard>
  );
};
export default DivisionCard;