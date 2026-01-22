import React from 'react';

const FormContainer = ({ 
  title, 
  subtitle = '',
  onClose, 
  children, 
  maxWidth = 'max-w-2xl',
  className = ''
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal content */}
        <div className={`inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${maxWidth} sm:w-full sm:p-6 ${className}`}>
          {/* Header */}
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="mt-1 text-sm text-gray-500">
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Form content */}
              <div className="mt-4">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
