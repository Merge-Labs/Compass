import React from 'react';
import { useTheme } from '../../context/ThemeProvider'; // Import useTheme

const ProgramBaseCard = ({ children, className = '', onClick }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`rounded-xl shadow-sm border ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'} ${onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-shadow ${className}`}
      onClick={onClick}
    >{children}</div>
  );
};
export default ProgramBaseCard;