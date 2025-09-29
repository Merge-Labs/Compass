import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Star, 
  Calendar, 
  DollarSign, 
  User, 
  Building, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Utility Functions
const getStatusColor = (status) => {
  const colors = {
    todo: 'bg-gray-100 text-gray-800 border-gray-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    on_hold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    under_review: 'bg-blue-100 text-blue-800 border-blue-200',
    rejected: 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getStatusIcon = (status) => {
  switch(status) {
    case 'completed':
    case 'approved': 
      return <CheckCircle className="w-4 h-4" />;
    case 'rejected': 
      return <XCircle className="w-4 h-4" />;
    case 'in_progress':
    case 'under_review': 
      return <AlertCircle className="w-4 h-4" />;
    default: 
      return <Clock className="w-4 h-4" />;
  }
};

const getPriorityColor = (priority) => {
  const colors = {
    high: 'text-red-600',
    medium: 'text-yellow-600',
    low: 'text-green-600'
  };
  return colors[priority] || 'text-gray-600';
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Mock Data
const mockGrants = [
  {
    id: '1',
    title: 'Tech Innovation Grant 2024',
    description: 'Funding for AI-powered healthcare solutions to improve patient outcomes',
    assigned_to: { id: 1, first_name: 'John', last_name: 'Doe' },
    assigned_by: { id: 2, first_name: 'Jane', last_name: 'Manager' },
    status: 'in_progress',
    priority: 'high',
    due_date: '2024-03-15',
    created_at: '2024-01-10T10:30:00Z',
    updated_at: '2024-02-15T14:20:00Z',
    grant: {
      organization: 'TechStart Inc',
      amount: 50000,
      category: 'Technology',
      location: 'San Francisco, CA'
    }
  },
  {
    id: '2',
    title: 'Community Development Fund',
    description: 'Supporting local community infrastructure projects and social programs',
    assigned_to: { id: 3, first_name: 'Jane', last_name: 'Smith' },
    assigned_by: { id: 2, first_name: 'Jane', last_name: 'Manager' },
    status: 'completed',
    priority: 'medium',
    due_date: '2024-02-28',
    created_at: '2024-01-05T09:15:00Z',
    updated_at: '2024-02-28T16:45:00Z',
    grant: {
      organization: 'LocalCorp',
      amount: 25000,
      category: 'Community',
      location: 'Austin, TX'
    }
  },
  {
    id: '3',
    title: 'Environmental Sustainability Grant',
    description: 'Clean energy and waste reduction initiatives for sustainable development',
    assigned_to: { id: 4, first_name: 'Mike', last_name: 'Johnson' },
    assigned_by: { id: 2, first_name: 'Jane', last_name: 'Manager' },
    status: 'todo',
    priority: 'high',
    due_date: '2024-04-01',
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T11:00:00Z',
    grant: {
      organization: 'GreenTech Solutions',
      amount: 75000,
      category: 'Environment',
      location: 'Portland, OR'
    }
  },
  {
    id: '4',
    title: 'Education Technology Initiative',
    description: 'Digital learning platforms for underserved communities',
    assigned_to: { id: 5, first_name: 'Sarah', last_name: 'Wilson' },
    assigned_by: { id: 2, first_name: 'Jane', last_name: 'Manager' },
    status: 'under_review',
    priority: 'medium',
    due_date: '2024-05-20',
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-02-20T12:30:00Z',
    grant: {
      organization: 'EduTech Foundation',
      amount: 35000,
      category: 'Education',
      location: 'Chicago, IL'
    }
  },
  {
    id: '5',
    title: 'Healthcare Access Program',
    description: 'Mobile health clinics for rural communities',
    assigned_to: { id: 6, first_name: 'David', last_name: 'Brown' },
    assigned_by: { id: 2, first_name: 'Jane', last_name: 'Manager' },
    status: 'approved',
    priority: 'high',
    due_date: '2024-06-15',
    created_at: '2024-02-10T14:15:00Z',
    updated_at: '2024-03-01T10:45:00Z',
    grant: {
      organization: 'HealthReach Network',
      amount: 120000,
      category: 'Healthcare',
      location: 'Denver, CO'
    }
  },
  {
    id: '6',
    title: 'Arts & Culture Preservation',
    description: 'Supporting local artists and cultural heritage projects',
    assigned_to: { id: 7, first_name: 'Emma', last_name: 'Davis' },
    assigned_by: { id: 2, first_name: 'Jane', last_name: 'Manager' },
    status: 'pending',
    priority: 'low',
    due_date: '2024-07-10',
    created_at: '2024-02-20T13:30:00Z',
    updated_at: '2024-02-25T09:15:00Z',
    grant: {
      organization: 'Cultural Heritage Foundation',
      amount: 15000,
      category: 'Arts & Culture',
      location: 'New York, NY'
    }
  },
  {
    id: '7',
    title: 'Small Business Recovery Fund',
    description: 'Financial assistance for small businesses affected by economic challenges',
    assigned_to: { id: 8, first_name: 'Robert', last_name: 'Miller' },
    assigned_by: { id: 2, first_name: 'Jane', last_name: 'Manager' },
    status: 'on_hold',
    priority: 'medium',
    due_date: '2024-08-05',
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-10T14:20:00Z',
    grant: {
      organization: 'Business Support Network',
      amount: 45000,
      category: 'Business',
      location: 'Phoenix, AZ'
    }
  },
  {
    id: '8',
    title: 'Youth Development Program',
    description: 'Mentorship and skills training for at-risk youth',
    assigned_to: { id: 9, first_name: 'Lisa', last_name: 'Garcia' },
    assigned_by: { id: 2, first_name: 'Jane', last_name: 'Manager' },
    status: 'rejected',
    priority: 'high',
    due_date: '2024-09-12',
    created_at: '2024-03-05T11:45:00Z',
    updated_at: '2024-03-15T16:30:00Z',
    grant: {
      organization: 'Youth Empowerment Alliance',
      amount: 30000,
      category: 'Youth Development',
      location: 'Miami, FL'
    }
  }
];

// Main Component
const GrantsDashboard = () => {
  const [grants, setGrants] = useState(mockGrants);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedGrants, setSelectedGrants] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const filteredGrants = grants.filter(grant => {
    const matchesSearch = grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (grant.grant?.organization || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || grant.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || grant.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredGrants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGrants = filteredGrants.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectGrant = (grantId) => {
    setSelectedGrants(prev => 
      prev.includes(grantId) 
        ? prev.filter(id => id !== grantId)
        : [...prev, grantId]
    );
  };

  const handleSelectAll = () => {
    setSelectedGrants(
      selectedGrants.length === paginatedGrants.length 
        ? [] 
        : paginatedGrants.map(grant => grant.id)
    );
  };

  const handleStatusChange = async (grantId, newStatus) => {
    try {
      setGrants(prev => prev.map(grant => 
        grant.id === grantId ? { ...grant, status: newStatus } : grant
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDeleteGrant = (grantId) => {
    if (window.confirm('Are you sure you want to delete this grant?')) {
      setGrants(prev => prev.filter(grant => grant.id !== grantId));
      setSelectedGrants(prev => prev.filter(id => id !== grantId));
    }
  };

  const stats = {
    total: grants.length,
    totalValue: grants.reduce((sum, grant) => sum + (grant.grant?.amount || 0), 0),
    completed: grants.filter(g => g.status === 'completed' || g.status === 'approved').length,
    inProgress: grants.filter(g => g.status === 'in_progress' || g.status === 'under_review').length,
    pending: grants.filter(g => g.status === 'todo' || g.status === 'pending').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="glass-panel bg-white border border-white/40 rounded-3xl shadow-2xl overflow-hidden p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading grants...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="glass-panel bg-white border border-white/40 rounded-3xl shadow-2xl overflow-hidden p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Grants Management</h1>
                <p className="text-gray-600">Manage and track grant applications and funding opportunities</p>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105">
                <Plus className="w-5 h-5" />
                <span>New Grant</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-panel bg-white border border-white/40 rounded-3xl shadow-2xl overflow-hidden p-6 hover:shadow-3xl transition-all duration-300 hover:border-white/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Grants</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Building className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="glass-panel bg-white border border-white/40 rounded-3xl shadow-2xl overflow-hidden p-6 hover:shadow-3xl transition-all duration-300 hover:border-white/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="glass-panel bg-white border border-white/40 rounded-3xl shadow-2xl overflow-hidden p-6 hover:shadow-3xl transition-all duration-300 hover:border-white/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="glass-panel bg-white border border-white/40 rounded-3xl shadow-2xl overflow-hidden p-6 hover:shadow-3xl transition-all duration-300 hover:border-white/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="glass-panel bg-white border border-white/40 rounded-3xl shadow-2xl overflow-hidden p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search grants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm w-64 transition-all duration-200"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-white/40 rounded-xl hover:bg-white/50 backdrop-blur-sm transition-all duration-200"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="on_hold">On Hold</option>
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-4 py-2 border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200 backdrop-blur-sm">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-panel bg-red-50 border border-red-200/40 rounded-3xl shadow-2xl overflow-hidden p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Grants Table */}
        <div className="glass-panel bg-white border border-white/40 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedGrants.length === paginatedGrants.length && paginatedGrants.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">
                  {selectedGrants.length} of {paginatedGrants.length} selected
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {filteredGrants.length} Results
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/50">
              <thead className="bg-gray-50/50 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/30 divide-y divide-gray-200/50 backdrop-blur-sm">
                {paginatedGrants.map((grant) => (
                  <tr key={grant.id} className="hover:bg-white/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedGrants.includes(grant.id)}
                          onChange={() => handleSelectGrant(grant.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-4"
                        />
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-sm ${grant.priority === 'high' ? 'bg-red-100' : grant.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                            <Star className={`w-4 h-4 ${getPriorityColor(grant.priority)}`} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{grant.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{grant.description}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 shadow-sm">
                          <Building className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{grant.grant?.organization || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{formatCurrency(grant.grant?.amount || 0)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={grant.status}
                        onChange={(e) => handleStatusChange(grant.id, e.target.value)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border cursor-pointer shadow-sm ${getStatusColor(grant.status)}`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="under_review">Under Review</option>
                        <option value="completed">Completed</option>
                        <option value="approved">Approved</option>
                        <option value="on_hold">On Hold</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(grant.due_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-2 shadow-sm">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <div className="text-sm text-gray-900">
                          {grant.assigned_to ? `${grant.assigned_to.first_name} ${grant.assigned_to.last_name}` : 'Unassigned'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 shadow-sm">
                        {grant.grant?.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50 shadow-sm"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-green-600 transition-colors p-1 rounded-md hover:bg-green-50 shadow-sm"
                          title="Edit Grant"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50 shadow-sm"
                          title="Delete Grant"
                          onClick={() => handleDeleteGrant(grant.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-50 shadow-sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredGrants.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing 1 to {filteredGrants.length} of {filteredGrants.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default GrantsDashboard;