import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { X, AlertCircle, DollarSign, Calendar as CalendarIcon } from 'lucide-react'; // Renamed Calendar to CalendarIcon

const GrantExpenditureForm = ({ isOpen, onClose, onExpenditureUpdated, existingExpenditure }) => {
  const [amountUsed, setAmountUsed] = useState('');
  const [estimatedDepletionDate, setEstimatedDepletionDate] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingExpenditure) {
      setAmountUsed(existingExpenditure.amount_used || '');
      setEstimatedDepletionDate(existingExpenditure.estimated_depletion_date ? existingExpenditure.estimated_depletion_date.split('T')[0] : '');
      setErrors({}); // Clear previous errors
    }
  }, [existingExpenditure]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (String(amountUsed).trim() === '') { // Check string representation
      newErrors.amountUsed = 'Amount used is required.';
    } else if (isNaN(parseFloat(amountUsed)) || parseFloat(amountUsed) < 0) {
      newErrors.amountUsed = 'Must be a valid positive number.';
    }
    // estimated_depletion_date is nullable
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !existingExpenditure?.grantId) return;
    setIsSubmitting(true);

    const payload = {
      amount_used: String(amountUsed),
      estimated_depletion_date: estimatedDepletionDate || null,
    };

    try {
      const response = await api.put(`/api/grants/${existingExpenditure.grantId}/expenditure/`, payload);
      onExpenditureUpdated(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating expenditure:', error.response?.data || error.message);
      const backendError = error.response?.data;
      if (typeof backendError === 'object' && backendError !== null) {
        const fieldErrors = {};
        if (backendError.amount_used) fieldErrors.amountUsed = Array.isArray(backendError.amount_used) ? backendError.amount_used.join(', ') : String(backendError.amount_used);
        if (backendError.estimated_depletion_date) fieldErrors.estimatedDepletionDate = Array.isArray(backendError.estimated_depletion_date) ? backendError.estimated_depletion_date.join(', ') : String(backendError.estimated_depletion_date);
        setErrors(prev => ({...prev, ...fieldErrors}));
        
        if (Object.keys(fieldErrors).length === 0 && backendError.detail) {
            alert(`Error: ${backendError.detail}`);
        } else if (Object.keys(fieldErrors).length === 0) {
             alert('An unknown error occurred. Please check the console.');
        }
      } else if (typeof backendError === 'string') {
        alert(`Error: ${backendError}`);
      } else {
        alert('An error occurred while updating. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";
  const errorClasses = "text-red-600 text-sm mt-1 flex items-center gap-1";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Update Expenditure: {existingExpenditure?.grantName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          <div>
            <label htmlFor="amountUsed" className={labelClasses}>Amount Used *</label>
            <div className="relative mt-1"><DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="number" id="amountUsed" value={amountUsed} onChange={(e) => setAmountUsed(e.target.value)} className={`${inputClasses} pl-10`} placeholder="0.00" min="0" step="0.01"/></div>
            {errors.amountUsed && <p className={errorClasses}><AlertCircle className="w-4 h-4" />{errors.amountUsed}</p>}
          </div>
          <div>
            <label htmlFor="estimatedDepletionDate" className={labelClasses}>Estimated Depletion Date</label>
            <div className="relative mt-1"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="date" id="estimatedDepletionDate" value={estimatedDepletionDate} onChange={(e) => setEstimatedDepletionDate(e.target.value)} className={`${inputClasses} pl-10`}/></div>
            {errors.estimatedDepletionDate && <p className={errorClasses}><AlertCircle className="w-4 h-4" />{errors.estimatedDepletionDate}</p>}
          </div>
          <div className="flex justify-end gap-4 pt-4 mt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50" disabled={isSubmitting}>Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center min-w-[120px]">
              {isSubmitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Updating...</> : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default GrantExpenditureForm;