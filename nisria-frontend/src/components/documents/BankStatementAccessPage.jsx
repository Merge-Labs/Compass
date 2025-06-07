import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeProvider';
import { Loader2, AlertTriangle, Send, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const BankStatementAccessPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState({}); // Tracks status per item: { [id]: { status: 'requesting' | 'success' | 'error', message: '' } }

  useEffect(() => {
    const fetchPreviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/documents/bank-statements/previews/');
        setPreviews(response.data.results || []);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || 'Failed to load bank statement previews.');
        console.error("Error fetching previews:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreviews();
  }, []);

  const handleRequestAccess = async (statementId) => {
    setRequestStatus(prev => ({ ...prev, [statementId]: { status: 'requesting' } }));
    try {
      // The endpoint is /api/documents/access/request/{document_id}/ (POST)
      // Assuming statementId from previews is the document_id
      await api.post(`/api/documents/access/request/${statementId}/`);
      setRequestStatus(prev => ({ ...prev, [statementId]: { status: 'success', message: 'Access requested successfully!' } }));
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to request access.';
      setRequestStatus(prev => ({ ...prev, [statementId]: { status: 'error', message: errorMessage } }));
      console.error(`Error requesting access for ${statementId}:`, err);
    }
  };

  const cardClasses = isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const buttonBase = 'px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium flex items-center justify-center space-x-1 sm:space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const primaryButton = `${buttonBase} bg-blue-600 hover:bg-blue-700 text-white`;

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className={`w-12 h-12 animate-spin ${isDark ? 'text-blue-300' : 'text-blue-600'}`} /></div>;
  }

  if (error) {
    return (
      <div className={`p-4 m-6 rounded-md ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'} flex items-center gap-3`}>
        <AlertTriangle size={24} />
        <div><h3 className="font-semibold">Error</h3><p>{error}</p></div>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)} // Or use Link to="/dashboard/compass/documents"
          className={`flex items-center text-sm hover:underline mb-2 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </button>
        <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Bank Statement Previews
        </h1>
        <p className={`${textMuted} text-xs sm:text-sm`}>These bank statements require special access. You can request access below.</p>
      </div>

      {previews.length === 0 && !isLoading && (
        <p className={textMuted}>No bank statement previews available at this time.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {previews.map(statement => (
          <div key={statement.id} className={`p-4 rounded-lg border shadow-md ${cardClasses}`}>
            <h2 className="text-md sm:text-lg font-semibold mb-1 truncate" title={statement.name}>{statement.name}</h2>
            {statement.description && <p className={`text-xs sm:text-sm mb-2 ${textMuted} line-clamp-2`}>{statement.description}</p>}
            <p className={`text-xs mb-3 ${textMuted}`}>
              Division: {statement.division} | Uploaded: {new Date(statement.date_uploaded).toLocaleDateString()}
            </p>
            
            {(!requestStatus[statement.id] || requestStatus[statement.id]?.status === 'error') && (
              <button
                onClick={() => handleRequestAccess(statement.id)}
                disabled={requestStatus[statement.id]?.status === 'requesting'}
                className={`${primaryButton}`}
              >
                {requestStatus[statement.id]?.status === 'requesting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3 h-3 sm:w-4 sm:h-4" />}
                <span className="ml-1 sm:ml-2">Request Access</span>
              </button>
            )}

            {requestStatus[statement.id]?.status === 'success' && (
              <div className="mt-2 flex items-center text-green-500 text-xs sm:text-sm">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span>{requestStatus[statement.id]?.message || 'Access Requested!'}</span>
              </div>
            )}
            {requestStatus[statement.id]?.status === 'error' && requestStatus[statement.id]?.message && (
               <div className="mt-2 text-red-500 text-xs sm:text-sm flex items-center">
                 <XCircle size={16} className="inline mr-1" />
                 <span>{requestStatus[statement.id]?.message}</span>
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BankStatementAccessPage;