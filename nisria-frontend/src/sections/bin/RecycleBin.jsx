import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Trash2, Users, FileText, Award, Moon, Sun, Search, RotateCcw, X, Check, Calendar, User as UserIcon, Clock, Loader2, AlertCircle, Eye, Smile, BookUser, Handshake, ShieldQuestion } from 'lucide-react';
import api from '../../services/api'; 
import RecycleBinItemDetailModal from '../../components/bin/RecycleBinItemDetailModal';
import ConfirmPermanentDeleteModal from '../../components/bin/ConfirmPermanentDeleteModal';

const ITEM_RETENTION_DAYS = 70;

const ITEM_ICONS = {
  document: FileText,
  user: UserIcon, // System users
  grant: Award,
  educationprogramdetail: BookUser,
  microfundprogramdetail: Handshake,
  rescueprogramdetail: ShieldQuestion,
  vocationaltrainingprogramtraineedetail: Users, // Group of trainees
  vocationaltrainingprogramtrainerdetail: UserIcon, // Single trainer
  default: Trash2,
};

export const RecycleBin = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [sortBy, setSortBy] = useState('Date Deleted');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemActionState, setItemActionState] = useState({}); // Tracks loading/error for individual item actions

  // State for Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [itemToPermanentlyDelete, setItemToPermanentlyDelete] = useState(null);

  const getIconForItemType = (itemType) => {
    // Ensure itemType is a string and handle if it's not, undefined, or empty
    const typeKey = (typeof itemType === 'string' && itemType.trim()) ? itemType.trim().toLowerCase() : 'default';
    return ITEM_ICONS[typeKey] || ITEM_ICONS.default;
  };

  const processApiItem = useCallback((apiItem) => {
    const deletedDate = new Date(apiItem.deleted_at);
    const now = new Date();
    const daysAgo = Math.floor((now - deletedDate) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, ITEM_RETENTION_DAYS - daysAgo);

    let itemName = 'Unnamed Item';
    const itemType = apiItem.content_type_name ? apiItem.content_type_name.toLowerCase() : 'unknown';

    if (apiItem.original_data) {
      switch (itemType) {
        case 'document':
          itemName = apiItem.original_data.name || itemName;
          break;
        case 'grant':
          itemName = apiItem.original_data.organization_name || itemName;
          break;
        case 'user': // Assuming 'user' type might exist
          itemName = apiItem.original_data.email || apiItem.original_data.username || itemName;
          break;
        case 'vocationaltrainingprogramtrainerdetail':
          itemName = apiItem.original_data.trainer_name || itemName;
          break;
        case 'microfundprogramdetail':
          itemName = apiItem.original_data.person_name || apiItem.original_data.chama_group || itemName;
          break;
        case 'educationprogramdetail':
          itemName = apiItem.original_data.student_name || itemName;
          break;
        case 'rescueprogramdetail': // Assuming this is the content_type_name for rescue beneficiaries
          itemName = apiItem.original_data.child_name || itemName;
          break;
        case 'vocationaltrainingprogramtraineedetail': // Assuming this for vocational trainees
          itemName = apiItem.original_data.trainee_name || itemName;
          break;
        default:
          // Fallback if a more specific name isn't found in original_data
          itemName = apiItem.original_data.name || apiItem.original_data.title || `Item ID: ${apiItem.actual_object_id_display}`;
      }
    }

    return {
      id: apiItem.id,
      type: itemType,
      name: itemName,
      requestedBy: apiItem.deleted_by_email || 'N/A',
      status: apiItem.original_data?.status || 'In Recycle Bin', // Use original status if available
      daysAgo,
      daysLeft,
      icon: getIconForItemType(itemType),
    };
  }, []);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/core/recycle-bin/');
      setItems(response.data.map(processApiItem));
    } catch (err) {
      console.error("Failed to fetch recycle bin items:", err);
      setError(err.response?.data?.detail || err.message || "Could not load items.");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [processApiItem]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const tabs = [
    { name: 'All', icon: Trash2 },
    { name: 'Documents', icon: FileText },
    { name: 'Grants', icon: Award },
    { name: 'Beneficiaries', icon: Smile }, // New tab for all beneficiary types
    { name: 'Users', icon: UserIcon } // Assuming this is for system users
  ];

  const BENEFICIARY_TYPES = [
    'educationprogramdetail',
    'microfundprogramdetail',
    'rescueprogramdetail',
    'vocationaltrainingprogramtraineedetail',
    'vocationaltrainingprogramtrainerdetail', // Including trainers as program-related personnel
  ];

  const filteredAndSortedItems = useMemo(() => {
    let processedItems = [...items];

    // Filtering
    processedItems = processedItems.filter(item => {
      // item.type is already lowercased by processApiItem
      const typeLower = item.type;
      const matchesTab = activeTab === 'All' ||
        (activeTab === 'Documents' && typeLower === 'document') ||
        (activeTab === 'Grants' && typeLower === 'grant') ||
        (activeTab === 'Beneficiaries' && BENEFICIARY_TYPES.includes(typeLower)) ||
        (activeTab === 'Users' && typeLower === 'user'); // For system users

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(searchLower) ||
        item.requestedBy.toLowerCase().includes(searchLower);

      return matchesTab && matchesSearch;
    });

    // Sorting
    processedItems.sort((a, b) => {
      switch (sortBy) {
        case 'Name':
          return a.name.localeCompare(b.name);
        case 'Type':
          return a.type.localeCompare(b.type);
        case 'Days Left':
          return a.daysLeft - b.daysLeft;
        case 'Date Deleted':
        default:
          return b.daysAgo - a.daysAgo; // Sort by most recently deleted first
      }
    });

    return processedItems;
  }, [items, activeTab, searchTerm, sortBy]);

  const handleItemAction = useCallback(async (itemId, actionType, apiCall) => {
    setItemActionState(prev => ({
      ...prev,
      [itemId]: { isLoading: true, error: null, action: actionType }
    }));
    try {
      await apiCall();
      setItems(prevItems => prevItems.filter(item => item.id !== itemId)); // Optimistic update
      // Clean up action state for this item on success
      setItemActionState(prev => {
        const newState = { ...prev };
        delete newState[itemId];
        return newState;
      });
    } catch (err) {
      console.error(`Failed to ${actionType} item ${itemId}:`, err);
      setItemActionState(prev => ({
        ...prev,
        [itemId]: { isLoading: false, error: `Failed to ${actionType}`, action: actionType }
      }));
    }
  }, []);

  const handleRestoreItem = useCallback((itemId) => {
    handleItemAction(itemId, 'restore', () => api.post(`/api/core/recycle-bin/${itemId}/restore/`));
  }, [handleItemAction]);

  const openConfirmDeleteModal = (item) => {
    setItemToPermanentlyDelete(item);
    setIsConfirmDeleteOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setIsConfirmDeleteOpen(false);
    setItemToPermanentlyDelete(null);
  };

  const handleConfirmPermanentDelete = useCallback(() => {
    if (!itemToPermanentlyDelete) return;
    handleItemAction(itemToPermanentlyDelete.id, 'delete', () => api.delete(`/api/core/recycle-bin/${itemToPermanentlyDelete.id}/delete/`))
      .finally(() => {
        closeConfirmDeleteModal();
      });
  }, [handleItemAction]);

  const openDetailModal = (item) => {
    setSelectedItemForDetail(item);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => setIsDetailModalOpen(false);

  const getStatusColor = (status) => {
    if (status === 'Pending Approval') return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
  };

  const getDaysLeftColor = (days) => {
    if (days <= 7) return 'text-red-600 dark:text-red-400';
    if (days <= 14) return 'text-amber-600 dark:text-amber-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Trash2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recycle Bin</h1>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Tabs and Controls */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col space-y-4">
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.name
                        ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>

              {/* Search and Sort */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Date Deleted">Date Deleted</option>
                  <option value="Name">Name</option>
                  <option value="Type">Type</option>
                  <option value="Days Left">Days Left</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading items...</p>
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 dark:text-red-400">Error: {error}</p>
              <button
                onClick={fetchItems}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* No Items State */}
          {!isLoading && !error && filteredAndSortedItems.length === 0 && (
            <div className="p-6 text-center">
              <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || activeTab !== 'All' ? 'No items match your filters.' : 'The recycle bin is empty.'}
              </p>
            </div>
          )}

          {/* Items List */}
          {!isLoading && !error && filteredAndSortedItems.length > 0 && (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedItems.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>  
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {item.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <UserIcon className="w-4 h-4" />
                          <span>Deleted by {item.requestedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{item.daysAgo} days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {itemActionState[item.id]?.error && <span className="text-xs text-red-500">{itemActionState[item.id].error}</span>}
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getDaysLeftColor(item.daysLeft)}`}>
                        {item.daysLeft} days left
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Auto-delete
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                       <button
                        onClick={() => openDetailModal(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRestoreItem(item.id)}
                        disabled={itemActionState[item.id]?.isLoading}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="Restore"
                      >
                        {itemActionState[item.id]?.isLoading && itemActionState[item.id]?.action === 'restore' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openConfirmDeleteModal(item)}
                        disabled={itemActionState[item.id]?.isLoading}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Permanently"
                      >
                        {itemActionState[item.id]?.isLoading && itemActionState[item.id]?.action === 'delete' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                      </button>
                      {/* The "Approve Deletion" button. If item.status indicates it needs approval,
                          this could also call handlePermanentlyDeleteItem or a specific approval API if one exists.
                          For now, it also triggers permanent delete. */}
                      {item.status === 'Pending Approval' && ( // Example condition
                        <button
                          onClick={() => openConfirmDeleteModal(item)} // Or a specific approval action
                          disabled={itemActionState[item.id]?.isLoading}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Approve Deletion"
                        >
                          {itemActionState[item.id]?.isLoading && itemActionState[item.id]?.action === 'approve_delete' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>)}

          {/* Footer Info */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 rounded-b-xl border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Items are automatically deleted after {ITEM_RETENTION_DAYS} days</span>
              </div>
              <div>
                {filteredAndSortedItems.length} item{filteredAndSortedItems.length !== 1 ? 's' : ''} in recycle bin
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RecycleBinItemDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        item={selectedItemForDetail}
      />

      <ConfirmPermanentDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleConfirmPermanentDelete}
        itemName={itemToPermanentlyDelete?.name}
        isProcessing={itemToPermanentlyDelete ? itemActionState[itemToPermanentlyDelete.id]?.isLoading && itemActionState[itemToPermanentlyDelete.id]?.action === 'delete' : false}
      />

    </div>
  );
};

export default RecycleBin;