import React from 'react';
import { X, AlertTriangle, Loader2, Trash2 } from 'lucide-react';

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = 'item',
  isProcessing = false,
  title = 'Confirm Action',
  message,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  customError, // New prop for displaying specific error messages
}) => {
  if (!isOpen) return null;

  const defaultMessage = `Are you sure you want to proceed with this action for ${itemType} "${itemName || 'this item'}"? This might be irreversible.`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && !isProcessing && onClose()}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            {title}
          </h3>
          <button
            onClick={!isProcessing ? onClose : undefined}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-700 mb-1">
            {message || defaultMessage}
          </p>
          {customError && (
            <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded-md border border-red-200">
              <strong>Error:</strong> {customError}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-70 flex items-center ${confirmButtonClass}`}
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-1.5" />}
            {isProcessing ? 'Processing...' : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;