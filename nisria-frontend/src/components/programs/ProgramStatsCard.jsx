import React from 'react';
import ProgramBaseCard from './ProgramBaseCard';
import { useTheme } from '../../context/ThemeProvider'; // Import useTheme


const ProgramStatsCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
    const { theme } = useTheme();
  
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: `text-green-600 border-green-200 ${theme === 'light' ? 'bg-green-50' : 'text-gray-900'}`,
    purple: `text-purple-600 border-purple-200 ${theme === 'light' ? 'bg-purple-50' : 'text-gray-900'}`,
    orange: `text-orange-600 border-orange-200 ${theme === 'light' ? 'bg-orange-50' : 'text-gray-900'}`
  };

  return (
    <ProgramBaseCard className={`p-6 ${colorClasses[color]} border-2`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
        </div>
        {Icon && <Icon className="w-8 h-8 opacity-60" />}
      </div>
    </ProgramBaseCard>
  );
};
export default ProgramStatsCard;