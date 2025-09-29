import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import { Routes, Route, useParams, useNavigate, Outlet } from "react-router-dom";
import api from "../../services/api";
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
} from "lucide-react";
import GrantsTable from "../../components/grants/GrantsTable";
import StatCard from "../../components/grants/card";
import GrantDetailModal from "../../components/grants/GrantDetailModal";
import GrantForm from "../../components/grants/GrantForm";
import GrantFormUpdate from "../../components/grants/GrantFormUpdate"; // Import the new update form
import GrantExpendituresTable from "../../components/grants/GrantExpendituresTable"; // Import Expenditures Table
import GrantExpenditureForm from "../../components/grants/GrantExpenditureForm"; // Import Expenditure Form
import ConfirmDeleteModal from "../../components/shared/ConfirmDeleteModal"; // Import the modal

import bgImage from '/bg.jpg';
const formatCurrency = (amount, currency = "USD") => {
  if (amount == null || isNaN(parseFloat(amount))) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(amount));
};

const API_PAGE_SIZE = 10; // Define a constant for the page size your API uses or you expect.

// Main Component
const GrantsDashboard = () => {
  const navigate = useNavigate();
  const routeParams = useParams(); // Get the params object
  const pathSegments = routeParams['*'] ? routeParams['*'].split('/') : [];
  const primaryActionOrId = pathSegments[0]; 
  const secondaryAction = pathSegments[1]; // e.g., 'edit'

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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedGrants, setSelectedGrants] = useState([]);

  // State for Grant Detail Modal
  const [selectedGrantDetails, setSelectedGrantDetails] = useState(null);
  const [isGrantDetailModalOpen, setIsGrantDetailModalOpen] = useState(false);
  const [grantDetailLoading, setGrantDetailLoading] = useState(false);
  const [grantDetailError, setGrantDetailError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // State for Grant Form Modal
  const [isGrantFormOpen, setIsGrantFormOpen] = useState(false);

  // State for Grant Update Form Modal
  const [isGrantUpdateFormOpen, setIsGrantUpdateFormOpen] = useState(false);
  const [grantToEditDetails, setGrantToEditDetails] = useState(null);
  const [grantEditLoading, setGrantEditLoading] = useState(false);
  const [grantEditError, setGrantEditError] = useState(null);

  // State for Expenditures Tab
  const [activeTab, setActiveTab] = useState("grants"); // "grants" or "expenditures"
  const [expendituresData, setExpendituresData] = useState([]);
  const [expendituresLoading, setExpendituresLoading] = useState(false);
  const [expendituresError, setExpendituresError] = useState(null);
  const [isExpenditureFormOpen, setIsExpenditureFormOpen] = useState(false);
  const [expenditureToEdit, setExpenditureToEdit] = useState(null);

  // State for Confirm Delete Modal
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [grantToDelete, setGrantToDelete] = useState(null);
  const [isDeletingGrant, setIsDeletingGrant] = useState(false);

  const loadAndShowGrantDetails = useCallback(async (currentGrantId) => {
    setIsGrantDetailModalOpen(true);
    setGrantDetailLoading(true);
    setGrantDetailError(null);
    setSelectedGrantDetails(null);
    try {
      const response = await api.get(`/api/grants/${currentGrantId}/`);
      console.log("API response for grant details:", response.data);
      setSelectedGrantDetails(response.data);
    } catch (err) {
      console.error("Failed to fetch grant details:", err);
      setGrantDetailError(
        err.response?.data?.detail ||
          err.message ||
          "Could not load grant details."
      );
    } finally {
      setGrantDetailLoading(false);
    }
  }, []); // Dependencies: stable setters, api assumed stable

  const loadAndShowGrantForEditing = useCallback(async (grantIdForEdit) => {
    setIsGrantUpdateFormOpen(true); // Open modal shell immediately
    setGrantEditLoading(true);
    setGrantEditError(null);
    setGrantToEditDetails(null);
    try {
      const response = await api.get(`/api/grants/${grantIdForEdit}/`);
      setGrantToEditDetails(response.data);
    } catch (err) {
      console.error("Failed to fetch grant for editing:", err);
      setGrantEditError(err.response?.data?.detail || err.message || "Could not load grant for editing.");
      // Potentially close modal or show error within it
    } finally {
      setGrantEditLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log(
      "[GrantsDashboard useEffect] Triggered. ID:", primaryActionOrId, 
      "Action:", secondaryAction,
      "Current Edit ID:", grantToEditDetails?.id,
      "Current View ID:", selectedGrantDetails?.id
    );

    if (primaryActionOrId === "newgrant") {
      console.log("[GrantsDashboard useEffect] Branch: newgrant");
      setIsGrantFormOpen(true);
      setIsGrantDetailModalOpen(false);
      setIsGrantUpdateFormOpen(false);
      // No need to clear details here, as they are not relevant for 'newgrant'
      // and clearing them might cause other effects if they were dependencies elsewhere.
    } else if (primaryActionOrId && secondaryAction === "edit") {
      console.log("[GrantsDashboard useEffect] Branch: edit grant ID:", primaryActionOrId);
      // Only load if the ID changed or no grant is loaded for editing
      if (!grantToEditDetails || grantToEditDetails.id !== parseInt(primaryActionOrId)) {
        console.log("[GrantsDashboard useEffect] Edit - Loading data for ID:", primaryActionOrId);
        loadAndShowGrantForEditing(primaryActionOrId);
      }
      setIsGrantUpdateFormOpen(true);
      setIsGrantFormOpen(false);
      setIsGrantDetailModalOpen(false);
    } else if (primaryActionOrId) { // Viewing a grant
      console.log("[GrantsDashboard useEffect] Branch: view grant ID:", primaryActionOrId);
      // Only load if the ID changed or no grant is loaded for viewing
      if (!selectedGrantDetails || selectedGrantDetails.id !== parseInt(primaryActionOrId)) {
        console.log("[GrantsDashboard useEffect] View - Loading data for ID:", primaryActionOrId);
        loadAndShowGrantDetails(primaryActionOrId);
      }
      setIsGrantDetailModalOpen(true);
      setIsGrantFormOpen(false);
      setIsGrantUpdateFormOpen(false);
    } else {
      // Base path /grants, close all modals
      console.log("[GrantsDashboard useEffect] Branch: base path, closing modals");
      setIsGrantFormOpen(false);
      setIsGrantDetailModalOpen(false);
      setIsGrantUpdateFormOpen(false);
      // It's generally safer to clear details when modals are explicitly closed or navigated away from
      // if (selectedGrantDetails) setSelectedGrantDetails(null); // Optional: clear if you want to ensure fresh load next time
      // if (grantToEditDetails) setGrantToEditDetails(null); // Optional
    }
  }, [primaryActionOrId, secondaryAction, loadAndShowGrantDetails, loadAndShowGrantForEditing]);

  const handleOpenGrantForm = () => {
    navigate("/dashboard/compass/grants/newgrant");
  };

  const handleCloseGrantForm = () => {
    navigate("/dashboard/compass/grants");
  };

  const handleGrantAdded = (newGrant) => {
    console.log("Grant added:", newGrant);
    fetchGrants(paginationInfo.currentPage, searchTerm, selectedStatus); // Refresh grants list
    handleCloseGrantForm(); // Close the form modal
  };

  const handleEditGrantClick = (grantId) => {
    console.log("[GrantsDashboard handleEditGrantClick] Navigating to edit for grantId:", grantId);
    // Clear any previously viewed grant details to ensure edit form loads fresh if same ID was viewed
    if (selectedGrantDetails && selectedGrantDetails.id === grantId) setSelectedGrantDetails(null);
    navigate(`/dashboard/compass/grants/${grantId}/edit`);
  };

  const handleCloseGrantFormUpdate = () => {
    navigate("/dashboard/compass/grants"); // Or to the grant detail page: `/dashboard/compass/grants/${grantToEditDetails.id}`
  };

  const handleGrantUpdated = (updatedGrant) => {
    fetchGrants(paginationInfo.currentPage, searchTerm, selectedStatus);
    // Optionally, update selectedGrantDetails if the user was viewing this grant
    if (selectedGrantDetails && selectedGrantDetails.id === updatedGrant.id) setSelectedGrantDetails(updatedGrant);
    // If the updated grant's status is 'approved', refresh expenditures
    if (updatedGrant.status === 'approved' && activeTab === 'expenditures') {
      fetchGrantExpenditures();
    }
    handleCloseGrantFormUpdate();
  };

  // Expenditures Tab Logic
  const fetchGrantExpenditures = useCallback(async () => {
    setExpendituresLoading(true);
    setExpendituresError(null);
    try {
      const grantsResponse = await api.get("/api/grants/?limit=10000&status=approved"); // Fetch only approved grants
      const approvedGrants = grantsResponse.data.results || [];

      if (approvedGrants.length === 0) {
        setExpendituresData([]);
        setExpendituresLoading(false);
        return;
      }

      const expenditurePromises = approvedGrants.map(grant =>
        api.get(`/api/grants/${grant.id}/expenditure/`)
          .then(response => ({ ...response.data, grantId: grant.id, grantName: grant.organization_name, amount_currency: grant.amount_currency }))
          .catch(err => {
            if (err.response && err.response.status === 404) { // Expenditure record might not exist yet
              return { grantId: grant.id, grantName: grant.organization_name, amount_currency: grant.amount_currency, amount_used: null, estimated_depletion_date: null, isPlaceholder: true };
            }
            console.error(`Failed to fetch expenditure for grant ${grant.id}:`, err.message);
            return { grantId: grant.id, grantName: grant.organization_name, amount_currency: grant.amount_currency, error: `Could not load for ${grant.organization_name}` };
          })
      );
      
      const settledExpenditures = await Promise.all(expenditurePromises);
      setExpendituresData(settledExpenditures);

    } catch (err) {
      console.error("Failed to fetch grant expenditures:", err);
      setExpendituresError("Could not load grant expenditures data.");
      setExpendituresData([]);
    } finally {
      setExpendituresLoading(false);
    }
  }, []); 

  useEffect(() => {
    if (activeTab === "expenditures") {
      fetchGrantExpenditures();
    }
    // No need to fetch grants here if activeTab is 'grants', as the other useEffect handles it.
  }, [activeTab, fetchGrantExpenditures]);

  const fetchGrants = async (page = 1, search = "", status = "all") => {
    setLoading(true);
    setError(null);
    try {
      let baseEndpoint = "/api/grants/";
      const params = new URLSearchParams();
      params.append("page", page);

      const trimmedSearch = search.trim();

      if (trimmedSearch !== "") {
        baseEndpoint = "/api/grants/search/";
        params.append("q", trimmedSearch); // Assuming 'q' is the query param for the search endpoint
        if (status !== "all") {
          params.append("status", status); // Assuming search endpoint can also filter by status
        }
      } else if (status !== "all") {
        baseEndpoint = "/api/grants/filter/";
        params.append("status", status);
      }
      // If search is empty AND status is "all", baseEndpoint remains "/api/grants/"

      const response = await api.get(`${baseEndpoint}?${params.toString()}`);
      setApiGrants(response.data.results || []);
      setPaginationInfo({
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous,
        currentPage: page,
        totalPages: Math.ceil((response.data.count || 0) / API_PAGE_SIZE) || 1,
      });
    } catch (err) {
      console.error("Failed to fetch grants:", err);
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "Could not load grants data.";
      setError(errorMessage);
      setApiGrants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrants(paginationInfo.currentPage, searchTerm, selectedStatus);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationInfo.currentPage, searchTerm, selectedStatus]); // fetchGrants is stable due to useCallback if we wrap it, but not currently wrapped


  const handleSelectGrant = (grantId) => {
    setSelectedGrants((prev) =>
      prev.includes(grantId)
        ? prev.filter((id) => id !== grantId)
        : [...prev, grantId]
    );
  };

  const handleSelectAll = () => {
    setSelectedGrants(
      selectedGrants.length === apiGrants.length && apiGrants.length > 0
        ? []
        : apiGrants.map((grant) => grant.id)
    );
  };

  const handleStatusChange = async (grantId, newStatus) => {
    // Optimistic update
    const originalGrants = [...apiGrants];
    setApiGrants((prev) =>
      prev.map((grant) =>
        grant.id === grantId ? { ...grant, status: newStatus } : grant
      )
    );
    try {
      await api.put(`/api/grants/${grantId}/`, { status: newStatus });
      // If status changed to 'approved' and expenditures tab is active, refresh expenditures
      if (newStatus === 'approved' && activeTab === 'expenditures') {
        fetchGrantExpenditures();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      setError(error.response?.data?.detail || "Failed to update status.");
      setApiGrants(originalGrants);
    }
  };

  // Opens the confirmation modal
  const handleOpenConfirmDeleteModal = (grantId) => {
    const grant = apiGrants.find(g => g.id === grantId);
    if (grant) {
      setGrantToDelete(grant);
      setIsConfirmDeleteModalOpen(true);
    } else {
      console.error("Grant not found for deletion:", grantId);
      setError("Could not find the grant to delete.");
    }
  };

  // Closes the confirmation modal
  const handleCloseConfirmDeleteModal = () => {
    setIsConfirmDeleteModalOpen(false);
    setGrantToDelete(null);
    setIsDeletingGrant(false); // Reset loading state
  };

  // Performs the actual soft delete
  const handleConfirmSoftDeleteGrant = async () => {
    if (!grantToDelete) return;

    setIsDeletingGrant(true);
    setError(null); // Clear previous errors

    try {
      await api.delete(`/api/grants/${grantToDelete.id}/soft-delete/`);
      
      setApiGrants((prev) => prev.filter((grant) => grant.id !== grantToDelete.id));
      setSelectedGrants((prev) => prev.filter((id) => id !== grantToDelete.id));
      
      if (activeTab === 'grants') {
        fetchGrants(paginationInfo.currentPage, searchTerm, selectedStatus);
      }
      if (activeTab === 'expenditures') {
        fetchGrantExpenditures();
      }
      handleCloseConfirmDeleteModal();
    } catch (error) {
      console.error("Failed to soft delete grant:", error);
      setError(error.response?.data?.detail || "Failed to soft delete grant. Please try again.");
      // Keep modal open on error, or close and show a toast notification
    } finally {
      setIsDeletingGrant(false);
    }
  };

  const handleCloseGrantDetailModal = () => {
    navigate("/dashboard/compass/grants");
    // The useEffect hook will handle closing the modal when primaryActionOrId becomes null.
    // Explicitly clear selected details to ensure clean state.
    setSelectedGrantDetails(null);
  };

  const handleEditExpenditure = (expenditure) => {
    setExpenditureToEdit(expenditure);
    setIsExpenditureFormOpen(true);
  };

  const handleCloseExpenditureForm = () => {
    setIsExpenditureFormOpen(false);
    setExpenditureToEdit(null);
  };

  const handleExpenditureUpdated = () => {
    // Refetch all expenditures to get the latest state
    fetchGrantExpenditures();
    handleCloseExpenditureForm();
  };
  const stats = {
    total: paginationInfo.count,

    totalValue: apiGrants.reduce(
      (sum, grant) => sum + parseFloat(grant.amount_value || 0),
      0
    ),

    approved: apiGrants.filter((g) => g.status === "approved").length,
    pendingOrApplied: apiGrants.filter(
      (g) => g.status === "pending" || g.status === "applied"
    ).length,
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= paginationInfo.totalPages) {
      setPaginationInfo((prev) => ({ ...prev, currentPage: newPage }));
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
    <div className="min-h-screen bg-cover bg-center p-6" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                Grants Management
              </h1>
              <p className="text-black">
                Manage and track grant applications and funding opportunities
              </p>
            </div>
            <button
              onClick={handleOpenGrantForm}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105"
            >
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
                    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 })); // Reset to page 1 on search
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
                  setPaginationInfo((prev) => ({ ...prev, currentPage: 1 })); // Reset to page 1 on filter change
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
        {error &&
          !loading && ( // Show error only if not loading and error exists
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("grants")}
            className={`px-6 py-3 text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none ${
              activeTab === "grants"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Grants List
          </button>
          <button
            onClick={() => setActiveTab("expenditures")}
            className={`px-6 py-3 text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none ${
              activeTab === "expenditures"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Grant Expenditures
          </button>
        </div>

        {/* Conditional Content Based on Tab */}
        {activeTab === "grants" && (
          <GrantsTable
            grants={apiGrants}
            loading={loading && apiGrants.length === 0} // Show full loader only on initial load
            error={null} // Error is handled above the table
            selectedGrants={selectedGrants}
            onSelectGrant={handleSelectGrant}
            onSelectAll={handleSelectAll}
            onStatusChange={handleStatusChange}
            onViewDetails={(id) => navigate(`/dashboard/compass/grants/${id}`)}
            onEditGrant={handleEditGrantClick}
            onDeleteGrant={handleOpenConfirmDeleteModal} // Changed to open modal
            currentPage={paginationInfo.currentPage}
            totalPages={paginationInfo.totalPages}
            onPageChange={handlePageChange}
            totalResults={paginationInfo.count}
          />
        )}

        {activeTab === "expenditures" && (
          <GrantExpendituresTable
            expenditures={expendituresData}
            loading={expendituresLoading}
            error={expendituresError}
            onEditExpenditure={handleEditExpenditure}
          />
        )}

        {/* Nested routes for modal */}
        <Routes>
          {/* Order matters: specific 'newgrant' before dynamic ':grantId' */}
          <Route
            path="newgrant"
            element={
              <>
                {/* Diagnostic log in the console */}
                {/* {console.log(
                  `[GrantsDashboard] Route "/newgrant" element render attempt. pathSuffix: ${pathSuffix}, isGrantFormOpen: ${isGrantFormOpen}`
                )} */}
                {isGrantFormOpen ? (
                  <GrantForm
                    isOpen={true} // Explicitly true here as per condition
                    onClose={handleCloseGrantForm}
                    onGrantAdded={handleGrantAdded}
                  />
                ) : null}
              </>
            }
          />
          <Route
            path=":grantId/edit" // Matches the navigation for editing
            element={
              isGrantUpdateFormOpen ? (
                <>
                <GrantFormUpdate
                  isOpen={true}
                  onClose={handleCloseGrantFormUpdate}
                  onGrantUpdated={handleGrantUpdated}
                  existingGrant={grantToEditDetails} // Pass the grant data to be edited
                  // You might also pass loading/error states for the form if needed
                />
                </>
              ) : null // Or a loader if grantToEditDetails is still loading
            }
          />
          <Route
            path=":grantId"
            element={
              <GrantDetailModal
                isOpen={isGrantDetailModalOpen}
                onClose={handleCloseGrantDetailModal}
                grant={selectedGrantDetails}
                loading={grantDetailLoading}
                error={grantDetailError}
              />
            }
          />
        </Routes>
        {/* Modal for Expenditure Form - not tied to react-router routes here */}
        {isExpenditureFormOpen && expenditureToEdit && (
          <GrantExpenditureForm
            isOpen={isExpenditureFormOpen}
            onClose={handleCloseExpenditureForm}
            onExpenditureUpdated={handleExpenditureUpdated}
            existingExpenditure={expenditureToEdit}
          />
        )}

        {/* Confirm Soft Delete Modal */}
        {isConfirmDeleteModalOpen && grantToDelete && (
          <ConfirmDeleteModal
            isOpen={isConfirmDeleteModalOpen}
            onClose={handleCloseConfirmDeleteModal}
            onConfirm={handleConfirmSoftDeleteGrant}
            itemName={grantToDelete.organization_name || 'this grant'}
            itemType="grant"
            isProcessing={isDeletingGrant}
            title="Confirm Soft Delete"
            message={`Are you sure you want to send the grant "${grantToDelete.organization_name || 'this grant'}" to the recycle bin? This action can usually be undone by an administrator.`}
            confirmButtonText="Send to Recycle Bin"
            confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          />
        )}
        <Outlet /> {/* If you have other nested routes not handled by the modal logic */}
      </div>
    </div>
  );
};

export default GrantsDashboard;
