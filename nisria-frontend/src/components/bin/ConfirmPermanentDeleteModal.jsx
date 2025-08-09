import React from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmPermanentDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isProcessing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass-panel bg-white/70 dark:bg-gray-800/90 border border-white/40 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Confirm Permanent Deletion
          </h3>
          <button onClick={onClose} disabled={isProcessing} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Are you sure you want to permanently delete the item:
          </p>
          <p className="text-md font-semibold text-gray-900 dark:text-white mb-6 break-words">
            "{itemName || 'this item'}"?
          </p>
          <p className="text-xs text-red-700 dark:text-red-500 font-bold">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-4 p-5 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
          <button type="button" onClick={onClose} disabled={isProcessing} className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium disabled:opacity-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={isProcessing} className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 font-medium flex items-center justify-center disabled:opacity-70">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {isProcessing ? 'Deleting...' : 'Permanently Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPermanentDeleteModal;