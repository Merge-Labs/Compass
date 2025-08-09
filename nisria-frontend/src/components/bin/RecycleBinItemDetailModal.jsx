import React from 'react';
import { X, Info, User, Calendar, Clock, AlertTriangle, Tag, Package, HelpCircle } from 'lucide-react';

const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return "N/A";
  try {
    const options = { year: "numeric", month: "long", day: "numeric" };
    if (includeTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }
    return new Date(dateString).toLocaleDateString("en-US", options);
  } catch (e) {
    console.error("Invalid date format:", dateString, e);
    return "Invalid Date";
  }
};

const DetailItem = ({ icon: Icon, label, value, valueClassName }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500 flex items-center">
      {Icon && <Icon className="w-5 h-5 mr-2 text-gray-400" />}
      {label}
    </dt>
    <dd className={`mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-words ${valueClassName || ''}`}>
      {value || 'N/A'}
    </dd>
  </div>
);

const RecycleBinItemDetailModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  const getOriginalDataPreview = (originalData, itemType) => {
    if (!originalData) return 'No original data available.';
    
    const entries = Object.entries(originalData)
      .filter(([key]) => !['id', 'created_at', 'updated_at', 'created_by', 'updated_by'].includes(key) && key.length < 30) // Filter out common/long keys
      .slice(0, 5); // Show a few key-value pairs

    if (entries.length === 0) return 'Original data has no previewable fields.';

    return (
      <ul className="list-disc list-inside text-xs space-y-1 bg-gray-50 p-3 rounded-md border">
        {entries.map(([key, value]) => (
          <li key={key}>
            <span className="font-semibold">{key}:</span> {String(value).substring(0, 50)}{String(value).length > 50 ? '...' : ''}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass-panel bg-white/70 dark:bg-gray-800/90 border border-white/40 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Item Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 border-b dark:border-gray-600 pb-2">Item Information</h4>
            <dl className="divide-y divide-gray-200 dark:divide-gray-600">
              <DetailItem icon={Package} label="Item Name" value={item.name} valueClassName="font-semibold dark:text-gray-100" />
              <DetailItem icon={Tag} label="Item Type" value={item.type} valueClassName="capitalize dark:text-gray-300" />
              <DetailItem icon={Info} label="Current Status in Bin" value={item.status} valueClassName="dark:text-gray-300" />
            </dl>
          </section>

          <section>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 border-b dark:border-gray-600 pb-2">Deletion Details</h4>
            <dl className="divide-y divide-gray-200 dark:divide-gray-600">
              <DetailItem icon={User} label="Deleted By" value={item.requestedBy} valueClassName="dark:text-gray-300"/>
              <DetailItem icon={Calendar} label="Date Deleted" value={formatDate(new Date(Date.now() - item.daysAgo * 24 * 60 * 60 * 1000), true)} valueClassName="dark:text-gray-300" />
              <DetailItem icon={Clock} label="Days in Bin" value={`${item.daysAgo} days`} valueClassName="dark:text-gray-300"/>
              <DetailItem icon={AlertTriangle} label="Days Left Before Auto-Delete" value={`${item.daysLeft} days`} valueClassName="text-red-600 dark:text-red-400 font-medium" />
            </dl>
          </section>
          
          {item.original_data && (
            <section>
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 border-b dark:border-gray-600 pb-2">Original Data Preview</h4>
              <div className="text-sm text-gray-800 dark:text-gray-300">
                {getOriginalDataPreview(item.original_data, item.type)}
              </div>
            </section>
          )}

           <section>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 border-b dark:border-gray-600 pb-2">System Information</h4>
            <dl className="divide-y divide-gray-200 dark:divide-gray-600">
                <DetailItem icon={HelpCircle} label="Recycle Bin ID" value={item.id} valueClassName="dark:text-gray-300"/>
                {/* You can add more system specific details if available in 'item' */}
            </dl>
          </section>

        </div>

        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecycleBinItemDetailModal;