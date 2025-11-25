import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, User, Loader2, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeProvider';

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dfjet61yc/";

const UserSelectionModal = ({ isOpen, onClose, onUserSelect }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/accounts/users/');
      const apiUsers = response.data.results || response.data;
      if (Array.isArray(apiUsers)) {
        setUsers(apiUsers.map(user => ({
          id: user.id,
          fullName: user.full_name || user.username || 'N/A',
          email: user.email,
          profilePicture: user.profile_picture
            ? (user.profile_picture.startsWith('http') ? user.profile_picture : CLOUDINARY_BASE_URL + user.profile_picture)
            : null,
        })));
      } else {
        setError("Received an unexpected format for users.");
        setUsers([]);
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Could not load users.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setSearchTerm(''); // Reset search term when modal opens
    }
  }, [isOpen, fetchUsers]);

  if (!isOpen) return null;

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 1).toUpperCase();
    return (names[0][0] + (names.length > 1 ? names[names.length - 1][0] : '')).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-200 backdrop-blur-md">
      <div className={`rounded-lg shadow-xl w-full max-w-md max-h-[70vh] flex flex-col glass-panel ${isDark ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/70 border border-white/40'}`}>
        <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Select User</h3>
          <button onClick={onClose} className={`p-1 rounded-full ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading && <div className="flex justify-center items-center py-10"><Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-blue-300' : 'text-blue-500'}`} /></div>}
          {error && <div className={`text-center py-10 ${isDark ? 'text-red-400' : 'text-red-600'}`}><AlertTriangle className="mx-auto w-8 h-8 mb-2" />{error}</div>}
          {!isLoading && !error && filteredUsers.length === 0 && (
            <p className={`text-center py-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No users found.</p>
          )}
          {!isLoading && !error && filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => onUserSelect(user.id, user.fullName)}
              className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.fullName} className="w-10 h-10 rounded-full object-cover mr-3" />
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mr-3 ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}>
                  {getInitials(user.fullName)}
                </div>
              )}
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.fullName}</p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSelectionModal;