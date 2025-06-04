import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Moon, Sun, X } from 'lucide-react';

const EmployeeManagement = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'James Wilson',
      position: 'Operations',
      department: 'Executive',
      experience: '14 years',
      status: 'OPEN',
      startDate: '2014-11-13',
      salary: '+91 9876 4563 14'
    },
    {
      id: 2,
      name: 'Robert Garcia',
      position: 'Operations',
      department: 'Executive',
      experience: '10 years',
      status: 'OPEN',
      startDate: '2014-11-13',
      salary: '+91 9876 4563 14'
    },
    {
      id: 3,
      name: 'Alexandra Rose',
      position: 'Operations',
      department: 'Executive',
      experience: '14 years',
      status: 'OPEN',
      startDate: '2014-03-04',
      salary: '+91 9876 4563 14'
    },
    {
      id: 4,
      name: 'Adrian Stevens',
      position: 'Operations',
      department: 'Executive',
      experience: '14 years',
      status: 'OPEN',
      startDate: '2014-01-09',
      salary: '+91 9876 4563 14'
    },
    {
      id: 5,
      name: 'Anik Smith',
      position: 'Operations',
      department: 'Executive',
      experience: '14 years',
      status: 'OPEN',
      startDate: '2014-01-09',
      salary: '+91 9876 4563 14'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    experience: '',
    status: 'OPEN',
    startDate: '',
    salary: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    if (!formData.name || !formData.position || !formData.department || !formData.experience || !formData.startDate || !formData.salary) {
      return;
    }
    const newEmployee = {
      ...formData,
      id: employees.length + 1
    };
    setEmployees(prev => [...prev, newEmployee]);
    setFormData({
      name: '',
      position: '',
      department: '',
      experience: '',
      status: 'OPEN',
      startDate: '',
      salary: ''
    });
    setShowForm(false);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const theme = darkMode ? 'dark' : '';

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`${theme}`}>
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-6 transition-all duration-300`}>
            <div className="flex justify-between items-center mb-4">
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Employee Management
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
                  Add Employee
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-64">
                <Search className={`absolute left-3 top-3 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search employees..."
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
                <option>All Departments</option>
                <option>Executive</option>
                <option>Operations</option>
              </select>
              <select className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
              }`}>
                <option>All Status</option>
                <option>OPEN</option>
                <option>CLOSED</option>
              </select>
            </div>
          </div>

          {/* Employee Table */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transition-all duration-300`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-all duration-300`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Name</th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>ID</th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Department</th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Role</th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Experience</th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Living St</th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Date of joining</th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Phone</th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {filteredEmployees.map((employee) => (
                    <tr 
                      key={employee.id} 
                      className={`transition-all duration-300 hover:shadow-lg ${
                        darkMode 
                          ? 'hover:bg-gray-700 hover:shadow-blue-500/10' 
                          : 'hover:bg-gray-50 hover:shadow-blue-500/10'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center text-white font-medium mr-3`}>
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {employee.name}
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {employee.id.toString().padStart(4, '0')}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {employee.department}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {employee.position}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {employee.experience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.status === 'OPEN' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {employee.startDate}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {employee.salary}
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

          {/* Pagination */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4 mt-6 transition-all duration-300`}>
            <div className="flex justify-between items-center">
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Showing 1 to {filteredEmployees.length} of {employees.length} entries
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((page) => (
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

        {/* Add Employee Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl w-full max-w-md transition-all duration-300`}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Add New Employee
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
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                      }`}
                    >
                      <option value="">Select Department</option>
                      <option value="Executive">Executive</option>
                      <option value="Operations">Operations</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 years"
                      required
                      className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="e.g., +91 9876 4563 14"
                      required
                      className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                      }`}
                    />
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
                      Add Employee
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;