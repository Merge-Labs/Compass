
import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Corrected import path
import { 
  Search, 
  Filter, 
  Plus, 
  DollarSign, 
  Building, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download,
} from 'lucide-react';
import GrantsTable from '../../components/grants/GrantsTable';
import StatCard from '../../components/grants/card'; 


const formatCurrency = (amount, currency = 'USD') => {
  if (amount == null || isNaN(parseFloat(amount))) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2,
  }).format(parseFloat(amount));
};


// Main Component
const GrantsDashboard = () => {
  const [apiGrants, setApiGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedGrants, setSelectedGrants] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchGrants = async (page = 1, search = '', status = 'all') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (search) params.append('search', search);
      if (status !== 'all') params.append('status', status);

      const response = await api.get(`/api/grants/?${params.toString()}`);
      setApiGrants(response.data.results || []);
      const itemsPerPageApi = response.data.results?.length || 10; 
      setPaginationInfo({
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous,
        currentPage: page,
        totalPages: Math.ceil((response.data.count || 0) / itemsPerPageApi) || 1,
      });
    } catch (err) {
      console.error("Failed to fetch grants:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Could not load grants data.";
      setError(errorMessage);
      setApiGrants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrants(paginationInfo.currentPage, searchTerm, selectedStatus);
  }, [paginationInfo.currentPage, searchTerm, selectedStatus]);

  const handleSelectGrant = (grantId) => {
    setSelectedGrants(prev => 
      prev.includes(grantId) 
        ? prev.filter(id => id !== grantId)
        : [...prev, grantId]
    );
  };
  
  const handleSelectAll = () => {
    setSelectedGrants(
      selectedGrants.length === apiGrants.length && apiGrants.length > 0
        ? [] 
        : apiGrants.map(grant => grant.id)
    );
  };

  const handleStatusChange = async (grantId, newStatus) => {
    // Optimistic update
    const originalGrants = [...apiGrants];
    setApiGrants(prev => prev.map(grant => 
      grant.id === grantId ? { ...grant, status: newStatus } : grant
    ));
    try {
      await api.put(`/api/grants/${grantId}/`, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
      setError(error.response?.data?.detail || "Failed to update status.");
      setApiGrants(originalGrants); 
    }
  };

  const handleDeleteGrant = async (grantId) => {
    if (window.confirm('Are you sure you want to delete this grant?')) {
      try {
        await api.delete(`/api/grants/${grantId}/`);
        setApiGrants(prev => prev.filter(grant => grant.id !== grantId));
        setSelectedGrants(prev => prev.filter(id => id !== grantId));
        fetchGrants(paginationInfo.currentPage, searchTerm, selectedStatus);
      } catch (error) {
        console.error('Failed to delete grant:', error);
        setError(error.response?.data?.detail || "Failed to delete grant.");
      }
    }
  };

  const stats = {
    total: paginationInfo.count,
    
    totalValue: apiGrants.reduce((sum, grant) => sum + parseFloat(grant.amount_value || 0), 0),
    
    approved: apiGrants.filter(g => g.status === 'approved').length,
    pendingOrApplied: apiGrants.filter(g => g.status === 'pending' || g.status === 'applied').length,
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= paginationInfo.totalPages) {
      setPaginationInfo(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // Initial loading state for the whole page
  if (loading && apiGrants.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading grants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Grants Management</h1>
              <p className="text-gray-600">Manage and track grant applications and funding opportunities</p>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105">
              <Plus className="w-5 h-5" />
              <span>New Grant</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Grants"
              value={stats.total}
              IconComponent={Building}
              iconBgClass="bg-blue-100"
              iconColorClass="text-blue-600"
            />
            <StatCard
              title="Total Value (Page)"
              value={formatCurrency(stats.totalValue)}
              IconComponent={DollarSign}
              iconBgClass="bg-green-100"
              iconColorClass="text-green-600"
            />
            <StatCard
              title="Approved (Page)"
              value={stats.approved}
              IconComponent={CheckCircle}
              iconBgClass="bg-green-100"
              iconColorClass="text-green-600"
            />
            <StatCard
              title="Pending/Applied (Page)"
              value={stats.pendingOrApplied}
              IconComponent={Clock}
              iconBgClass="bg-yellow-100" // Adjusted for pending/applied
              iconColorClass="text-yellow-600" // Adjusted
            />
          </div>
        </div>


        {/* Filters and Search */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search grants..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPaginationInfo(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1 on search
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 w-64 transition-all duration-200"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPaginationInfo(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1 on filter change
                }}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="applied">Applied</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
                <option value="expired">Expired</option>
              </select>
              {/* Priority filter select removed as it's not in the API schema */}
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && !loading && ( // Show error only if not loading and error exists
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Grants Table */}
        <GrantsTable
          grants={apiGrants}
          loading={loading && apiGrants.length > 0} // Show table-specific loader if data already exists but is refreshing
          error={null} // Error is handled above the table for now
          selectedGrants={selectedGrants}
          onSelectGrant={handleSelectGrant}
          onSelectAll={handleSelectAll}
          onStatusChange={handleStatusChange}
          onViewDetails={(id) => console.log("View details for grant:", id)} // Placeholder
          onEditGrant={(id) => console.log("Edit grant:", id)} // Placeholder
          onDeleteGrant={handleDeleteGrant}
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          onPageChange={handlePageChange}
          totalResults={paginationInfo.count}
        />
      </div>
    </div>
  );
};

export default GrantsDashboard;