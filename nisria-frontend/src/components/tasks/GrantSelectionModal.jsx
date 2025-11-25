import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, FileText, Loader2, AlertTriangle, Building } from 'lucide-react';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeProvider';

// Utility from GrantsTable.jsx (or define locally if preferred)
const getStatusColor = (status, isDark) => {
  const s = status?.toLowerCase();
  if (isDark) {
    // Dark theme colors (adjust as needed)
    const colors = {
      pending: 'bg-yellow-700/30 text-yellow-300 border-yellow-600',
      applied: 'bg-blue-700/30 text-blue-300 border-blue-600',
      approved: 'bg-green-700/30 text-green-300 border-green-600',
      denied: 'bg-red-700/30 text-red-300 border-red-600',
      expired: 'bg-gray-600/30 text-gray-400 border-gray-500',
    };
    return colors[s] || 'bg-gray-700/30 text-gray-300 border-gray-600';
  }
  // Light theme colors
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    applied: 'bg-blue-100 text-blue-800 border-blue-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    denied: 'bg-red-100 text-red-800 border-red-200',
    expired: 'bg-gray-200 text-gray-800 border-gray-300',
  };
  return colors[s] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const GrantSelectionModal = ({ isOpen, onClose, onGrantSelect }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [grants, setGrants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGrants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming your grants API endpoint is /api/grants/
      // And it returns a list of grants, possibly paginated
      const response = await api.get('/api/grants/');
      const apiGrants = response.data.results || response.data;
      if (Array.isArray(apiGrants)) {
        setGrants(apiGrants.map(grant => ({
          id: grant.id,
          organizationName: grant.organization_name || 'N/A',
          status: grant.status || 'unknown',
          // Add any other relevant details you want to display or use
        })));
      } else {
        setError("Received an unexpected format for grants.");
        setGrants([]);
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Could not load grants.");
      setGrants([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchGrants();
      setSearchTerm('');
    }
  }, [isOpen, fetchGrants]);

  if (!isOpen) return null;

  const filteredGrants = grants.filter(grant =>
    grant.organizationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-100 backdrop-blur"> {/* Increased z-index */}
      <div className={`rounded-lg shadow-xl w-full max-w-lg max-h-[70vh] flex flex-col glass-panel ${isDark ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/70 border border-white/40'}`}>
        <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Select Grant</h3>
          <button onClick={onClose} className={`p-1 rounded-full ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search grants by organization name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading && <div className="flex justify-center items-center py-10"><Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-blue-300' : 'text-blue-500'}`} /></div>}
          {error && <div className={`text-center py-10 ${isDark ? 'text-red-400' : 'text-red-600'}`}><AlertTriangle className="mx-auto w-8 h-8 mb-2" />{error}</div>}
          {!isLoading && !error && filteredGrants.length === 0 && (
            <p className={`text-center py-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No grants found.</p>
          )}
          {!isLoading && !error && filteredGrants.map(grant => (
            <div
              key={grant.id}
              onClick={() => onGrantSelect(grant.id, grant.organizationName)}
              className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <div className="flex items-center">
                <Building size={18} className={`mr-3 ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{grant.organizationName}</p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(grant.status, isDark)}`}>
                {grant.status.charAt(0).toUpperCase() + grant.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrantSelectionModal;