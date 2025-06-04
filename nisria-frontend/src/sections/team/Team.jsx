import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Moon, Sun, X, Shield, Users, FileText, Settings } from 'lucide-react';

const Team = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: 'Nur M\'Nasria',
      accessLevel: 'Super Admin',
      responsibilities: 'Full domain access. Can add, remove, and edit any document or user. Has overall system control and management authority.',
      dateAdded: '2023-01-15',
      status: 'Active',
      lastLogin: '2024-06-01'
    },
    {
      id: 2,
      name: 'Mr Paul',
      accessLevel: 'Admin',
      responsibilities: 'Access to view, edit, and upload documents relevant to all programs.',
      dateAdded: '2023-03-20',
      status: 'Active',
      lastLogin: '2024-05-30'
    },
    {
      id: 3,
      name: 'Cynthia Mwangi',
      accessLevel: 'Admin',
      responsibilities: 'Access to view, edit, and upload documents relevant to all programs.',
      dateAdded: '2023-04-10',
      status: 'Active',
      lastLogin: '2024-05-28'
    },
    {
      id: 4,
      name: 'Malek Joseph',
      accessLevel: 'Admin (Management Lead)',
      responsibilities: 'In charge of Compass operations and grants management. Ensures platform optimization and operational efficiency.',
      dateAdded: '2023-05-05',
      status: 'Active',
      lastLogin: '2024-06-02'
    },
    {
      id: 5,
      name: 'Wahome Jeremy',
      accessLevel: 'Admin (Management Lead)',
      responsibilities: 'Shares operational responsibility with Malek. Oversees platform performance, user management, and system maintenance.',
      dateAdded: '2023-06-12',
      status: 'Active',
      lastLogin: '2024-06-01'
    },
    {
      id: 5,
      name: 'Manasseh Kimani',
      accessLevel: 'Admin (Management Lead)',
      responsibilities: 'Shares operational responsibility with Malek and Wahome. Oversees platform performance, user management, and system maintenance.',
      dateAdded: '2023-06-12',
      status: 'Active',
      lastLogin: '2024-06-01'
    },
    {
      id: 6,
      name: 'Mohamad',
      accessLevel: 'Admin (Grant Officer)',
      responsibilities: 'Focused on grant sourcing, matching, and applications. Updates grant sections and manages grant-related documentation.',
      dateAdded: '2023-07-18',
      status: 'Active',
      lastLogin: '2024-05-29'
    },
    {
      id: 7,
      name: 'Mervat',
      accessLevel: 'Admin (Grant Officer)',
      responsibilities: 'Focused on grant research, documentation uploads, and application status tracking. Maintains grant database integrity.',
      dateAdded: '2023-08-22',
      status: 'Active',
      lastLogin: '2024-05-31'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    accessLevel: '',
    responsibilities: '',
    status: 'Active',
    dateAdded: '',
    lastLogin: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.accessLevel || !formData.responsibilities || !formData.dateAdded) {
      return;
    }
    const newAdmin = {
      ...formData,
      id: admins.length + 1
    };
    setAdmins(prev => [...prev, newAdmin]);
    setFormData({
      name: '',
      accessLevel: '',
      responsibilities: '',
      status: 'Active',
      dateAdded: '',
      lastLogin: ''
    });
    setShowForm(false);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.accessLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.responsibilities.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAccessLevelIcon = (level) => {
    if (level.includes('Super Admin')) return <Shield className="text-red-500" size={16} />;
    if (level.includes('Management Lead')) return <Users className="text-blue-500" size={16} />;
    if (level.includes('Grant Officer')) return <FileText className="text-green-500" size={16} />;
    return <Settings className="text-gray-500" size={16} />;
  };

  const getAccessLevelColor = (level) => {
    if (level.includes('Super Admin')) return 'bg-red-100 text-red-800 border-red-200';
    if (level.includes('Management Lead')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (level.includes('Grant Officer')) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-6 transition-all duration-300`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Admin Management System
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all duration-300 hover:shadow-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600 hover:shadow-yellow-400/20' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-blue-500/20'
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
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
            <select className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
            }`}>
              <option>All Access Levels</option>
              <option>Super Admin</option>
              <option>Admin</option>
              <option>Management Lead</option>
              <option>Grant Officer</option>
            </select>
            <select className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
            }`}>
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        {/* Admin Cards/Table */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transition-all duration-300`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-all duration-300`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Admin Name</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Access Level</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Responsibilities</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Date Added</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Last Login</th>
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
                        <div className={`h-10 w-10 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center text-white font-medium mr-3`}>
                          {admin.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {admin.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getAccessLevelIcon(admin.accessLevel)}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        admin.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : admin.status === 'Inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {admin.dateAdded}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {admin.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button className={`p-2 rounded-lg transition-all duration-300 ${
                          darkMode 
                            ? 'text-blue-400 hover:bg-gray-700 hover:shadow-lg hover:shadow-blue-400/20' 
                            : 'text-blue-600 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/20'
                        }`}>
                          <Edit size={16} />
                        </button>
                        <button className={`p-2 rounded-lg transition-all duration-300 ${
                          darkMode 
                            ? 'text-red-400 hover:bg-gray-700 hover:shadow-lg hover:shadow-red-400/20' 
                            : 'text-red-600 hover:bg-red-50 hover:shadow-lg hover:shadow-red-500/20'
                        }`}>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100 mr-4">
                <Shield className="text-red-600" size={24} />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Super Admins</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>1</p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 mr-4">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Management Leads</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>2</p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 mr-4">
                <FileText className="text-green-600" size={24} />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Grant Officers</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>2</p>
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
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{admins.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4 mt-6 transition-all duration-300`}>
          <div className="flex justify-between items-center">
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Showing 1 to {filteredAdmins.length} of {admins.length} entries
            </div>
            <div className="flex gap-2">
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

      {/* Add Admin Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl w-full max-w-2xl transition-all duration-300`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Add New Admin
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    darkMode 
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Admin Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Access Level
                  </label>
                  <select
                    name="accessLevel"
                    value={formData.accessLevel}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                    }`}
                  >
                    <option value="">Select Access Level</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Admin (Management Lead)">Admin (Management Lead)</option>
                    <option value="Admin (Grant Officer)">Admin (Grant Officer)</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Responsibilities
                  </label>
                  <textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                    }`}
                    placeholder="Describe the admin's responsibilities and access permissions..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Date Added
                    </label>
                    <input
                      type="date"
                      name="dateAdded"
                      value={formData.dateAdded}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Last Login
                    </label>
                    <input
                      type="date"
                      name="lastLogin"
                      value={formData.lastLogin}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-all duration-300 ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    Add Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;