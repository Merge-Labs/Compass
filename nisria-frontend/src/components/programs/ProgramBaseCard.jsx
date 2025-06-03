import React from 'react';

const ProgramBaseCard = ({ children, className = '', onClick }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-shadow ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);
export default ProgramBaseCard;