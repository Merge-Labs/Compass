import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit, Trash2, Shield, Users, FileText, Settings, Loader2, AlertTriangle } from 'lucide-react';
import api from '../../services/api'; // Assuming api service is setup
import AddAdminForm from '../../components/forms/AddAdminForm'; // Import the new form component

// --- Static Data ---
// Static data for responsibilities, matched by API role string
const roleResponsibilitiesMap = new Map([
  ['super_admin', 'Full domain access. Can add, remove, and edit any document or user. Has overall system control and management authority.'],
  ['management_lead', 'Oversees platform performance, user management, system maintenance, and operational efficiency. In charge of Compass operations and grants management.'],
  ['grant_officer', 'Manages grant-related documentation, sourcing, applications, research, and database integrity. Updates grant sections and tracks application statuses.'],
  ['admin', 'Access to view, edit, and upload documents relevant to all programs. General administrative duties.'],
  ['user', 'General user access with limited permissions. Specific responsibilities vary based on assignment.'] // Default for 'user' role or unmapped roles
]);

// Mapping from API role string to human-readable display name
const roleDisplayNameMap = new Map([
  ['super_admin', 'Super Admin'],
  ['management_lead', 'Admin (Management Lead)'],
  ['grant_officer', 'Admin (Grant Officer)'],
  ['admin', 'Admin'],
  ['user', 'User'] // Default display name
]);

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dfjet61yc/";

const Team = () => {
  const [darkMode, setDarkMode] = useState(false); // Keep darkMode for the Team page itself
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // formData state is removed as it's now managed by AddAdminForm.jsx

  const fetchTeamMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming the endpoint is /api/accounts/users/ based on DashboardSection
      const response = await api.get('/api/accounts/users/');
      const apiUsers = response.data.results || response.data; // Adjust if API response structure differs

      if (Array.isArray(apiUsers)) {
        const processedMembers = apiUsers.map(apiUser => {
          const apiRole = apiUser.role || 'user'; // Default to 'user' if role is missing
          const displayRole = roleDisplayNameMap.get(apiRole) || roleDisplayNameMap.get('user') || 'User';
          const staticResponsibilities = roleResponsibilitiesMap.get(apiRole) || roleResponsibilitiesMap.get('user') || 'General administrative duties.';
          const profilePictureUrl = apiUser.profile_picture
            ? (apiUser.profile_picture.startsWith('http') ? apiUser.profile_picture : CLOUDINARY_BASE_URL + apiUser.profile_picture)
            : null;

          return {
            id: apiUser.id, // From schema
            name: apiUser.full_name || apiUser.username || 'N/A', // Use full_name from schema, fallback to username
            profile_picture: profilePictureUrl, // Updated to use full URL
            email: apiUser.email || 'N/A', // From schema
            phone_number: apiUser.phone_number || 'N/A', // From schema
            location: apiUser.location || 'N/A', // From schema
            accessLevel: displayRole, // Store the human-readable name for display and filtering
            responsibilities: staticResponsibilities, // Static responsibilities based on API role string
            dateAdded: apiUser.date_joined ? new Date(apiUser.date_joined).toISOString().split('T')[0] : 'N/A', // From schema
            status: apiUser.is_active ? 'Active' : 'Inactive', // From schema
            lastLogin: apiUser.last_login ? new Date(apiUser.last_login).toISOString().split('T')[0] : 'N/A', // From schema
          };
        });
        setTeamMembers(processedMembers);
      } else {
        console.error("API response is not an array:", apiUsers);
        setError("Received an unexpected format for team members.");
        setTeamMembers([]);
      }
    } catch (err) {
      console.error("Failed to fetch team members:", err);
      setError(err.response?.data?.detail || err.message || "Could not load team members.");
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const handleAdminAdded = () => {
    fetchTeamMembers(); // Refetch team members to include the new one
  };
  // handleInputChange and handleSubmit are removed as they are now in AddAdminForm.jsx

  const filteredAdmins = teamMembers.filter(admin =>
    // Filter using the human-readable accessLevel stored in state
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) || // Add email to search
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.accessLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.responsibilities.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (admin.phone_number && admin.phone_number.toLowerCase().includes(searchTerm.toLowerCase())) || // Add phone_number to search, check if exists
    (admin.location && admin.location.toLowerCase().includes(searchTerm.toLowerCase())) // Add location to search, check if exists
  );

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await api.delete(`/api/accounts/users/${adminId}/delete/`);
        fetchTeamMembers(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete admin:", err);
        setError(err.response?.data?.detail || err.message || "Could not delete admin.");
      }
    }
  };

  const getAccessLevelIcon = (level) => {
    // Match human-readable strings
    if (level.includes('Super Admin')) return <Shield className="text-red-500" size={16} />;
    if (level.includes('Management Lead')) return <Users className="text-blue-500" size={16} />;
    if (level.includes('Grant Officer')) return <FileText className="text-green-500" size={16} />;
    return <Settings className="text-gray-500" size={16} />;
  };

  const getAccessLevelColor = (level) => {
    // Match human-readable strings
    if (level.includes('Super Admin')) return 'bg-red-100 text-red-800 border-red-200';
    if (level.includes('Management Lead')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (level.includes('Grant Officer')) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
    // Add dark mode classes here if needed, similar to the table row hover
  };

  const countByAccessLevel = (levelSubstring) => {
    if (!teamMembers) return 0;
    // Use human-readable accessLevel for counting
    return teamMembers.filter(member => member.accessLevel.includes(levelSubstring)).length;
  }

  return (
    <div className={`min-h-screen transition-all duration-300`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className={`glass-surface ${darkMode ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/70 border border-white/40'} rounded-xl shadow-lg p-6 mb-6 transition-all duration-300`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Admin Management System
            </h1>
            <div className="flex items-center gap-4">
              {/* Dark mode toggle for the Team page itself can remain if desired, or be part of a global theme provider */}
              {/* <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all duration-300 hover:shadow-lg ${
                  darkMode
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600 hover:shadow-yellow-400/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-blue-500/20'
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button> */}
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
              >
                <Plus size={16} />
                Add Admin
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-64">
              <Search className={`absolute left-3 top-3 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                }`}
              />
            </div>
            {/* Filter by Access Level - Use human-readable names */}
            <select className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
            }`}>
              <option value="">All Access Levels</option>
              {/* Filter out 'User' role from the filter options if you only want to show admin roles */}
              {Array.from(roleDisplayNameMap.values()).filter(name => name !== 'User').map(name => (
                 <option key={name} value={name}>{name}</option>
              ))}
            </select>
            {/* Filter by Status - Use human-readable names (Optional, based on API data) */}
            {/* You might want to remove this filter if status is not a primary filter for admins */}
            {/* <select className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
            }`}>
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              {/* Add other statuses if your API supports them */}
              {/* <option value="Suspended">Suspended</option> */}
            {/* </select> */}
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className={`w-12 h-12 animate-spin ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
        )}

        {error && !isLoading && (
          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-red-900/30' : 'bg-red-100'} flex flex-col items-center justify-center text-center`}>
            <AlertTriangle className={`w-12 h-12 mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Failed to Load Admins</h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
            <button
              onClick={fetchTeamMembers}
              className={`mt-4 px-4 py-2 text-sm rounded-lg border transition-colors ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && filteredAdmins.length === 0 && searchTerm && (
          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} text-center`}>
            <Search className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>No Admins Found</h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your search for "{searchTerm}" did not match any admins.</p>
          </div>
        )}

        {!isLoading && !error && (filteredAdmins.length > 0 || !searchTerm) && (
           <div className={`glass-surface ${darkMode ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/70 border border-white/40'} rounded-xl shadow-lg overflow-hidden transition-all duration-300`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-all duration-300`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Admin Name</th> {/* Includes Image/Initials */}
                  <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Email</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Access Level</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Responsibilities</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Phone Number</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Location</th>
                  {/* Removed Status, Date Added, Last Login headers */}
                  <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className={`transition-all duration-300 hover:shadow-lg ${
                      darkMode
                        ? 'hover:bg-gray-700 hover:shadow-blue-500/10'
                        : 'hover:bg-gray-50 hover:shadow-blue-500/10'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {/* Image or Initials */}
                        {admin.profile_picture ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover mr-3"
                            src={admin.profile_picture}
                            alt={admin.name}
                          />
                        ) : (
                          <div className={`h-10 w-10 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center text-white font-medium mr-3`}>
                            {admin.name ? admin.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'N/A'}
                          </div>
                        )}
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {admin.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{admin.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {/* Display icon based on human-readable accessLevel */}
                        {getAccessLevelIcon(admin.accessLevel)}
                        {/* Display human-readable accessLevel */}
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                          darkMode ? 'bg-gray-700 border-gray-600' : getAccessLevelColor(admin.accessLevel)
                        }`}>
                          {admin.accessLevel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-md`}>
                        <p className="line-clamp-3">{admin.responsibilities}</p>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {admin.phone_number || 'N/A'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {admin.location || 'N/A'}
                    </td>
                    {/* Removed Status, Date Added, Last Login cells */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button className={`p-2 rounded-lg transition-all duration-300 ${
                          darkMode
                            ? 'text-red-400 hover:bg-gray-700 hover:shadow-lg hover:shadow-red-400/20'
                            : 'text-red-600 hover:bg-red-50 hover:shadow-lg hover:shadow-red-500/20'
                        }`}
                        onClick={() => handleDeleteAdmin(admin.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className={`glass-surface ${darkMode ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/70 border border-white/40'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100 mr-4">
                <Shield className="text-red-600" size={24} />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Super Admins</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{countByAccessLevel('Super Admin')}</p>
              </div>
            </div>
          </div>

          <div className={`glass-surface ${darkMode ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/70 border border-white/40'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 mr-4">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Management Leads</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{countByAccessLevel('Admin (Management Lead)')}</p> {/* Use full display name for count */}
              </div>
            </div>
          </div>

          <div className={`glass-surface ${darkMode ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/70 border border-white/40'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 mr-4">
                <FileText className="text-green-600" size={24} />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Grant Officers</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{countByAccessLevel('Admin (Grant Officer)')}</p> {/* Use full display name for count */}
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 mr-4">
                <Settings className="text-purple-600" size={24} />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Admins</p>
                {/* Count all members whose role is NOT 'User' */}
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{teamMembers.filter(member => member.accessLevel !== 'User').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
          <div className={`glass-surface ${darkMode ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/70 border border-white/40'} rounded-xl shadow-lg p-4 mt-6 transition-all duration-300`}>
          <div className="flex justify-between items-center">
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Showing {filteredAdmins.length > 0 ? 1 : 0} to {filteredAdmins.length} of {teamMembers.length} entries
            </div>
            <div className="flex gap-2">
              {/* Dummy pagination - replace with actual pagination logic */}
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                    page === 1
                      ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'} shadow-lg shadow-blue-500/30`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'} hover:shadow-lg`
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Use the new AddAdminForm component */}
      <AddAdminForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onAdminAdded={handleAdminAdded}
        darkMode={darkMode}
        // roleDisplayNameMap is defined within AddAdminForm, but could be passed as a prop if needed elsewhere
      />
    </div>
  );
};

export default Team;
