import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Search,
  Mail, // Icon for template item
  User,
  Calendar,
  Tag, // Icon for template type
} from 'lucide-react';
import { useTheme } from '../../context/ThemeProvider';
import TemplateDetailModal from './TemplateDetailModal'; // Import the new modal

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error(e);
    return "Invalid Date";
  }
};

const TemplateListItem = ({ template, isDark, onViewTemplate }) => {
  // onViewTemplate can be used later if a detail view for templates is implemented
  const { name, template_type, created_by_name, date_created } = template;

  const templateTypeDisplay = template_type
    ? template_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'N/A';

  return (
    <div 
      className={`flex items-center p-4 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`} // Ensure cursor-pointer
      onClick={() => onViewTemplate(template)}
      title={`View details for ${name}`}
    >
      <div className={`p-2 rounded-lg mr-4 ${isDark ? 'bg-purple-700' : 'bg-purple-100'}`}>
        <Mail className={`w-5 h-5 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {name}
        </p>
        <div className="flex items-center mt-1 space-x-3 text-xs">
          <span className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Tag size={12} className="mr-1" /> {templateTypeDisplay}
          </span>
          <span className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <User size={12} className="mr-1" /> {created_by_name || 'System'}
          </span>
          <span className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Calendar size={12} className="mr-1" /> {formatDate(date_created)}
          </span>
        </div>
      </div>
      {/* Add action buttons or more details if needed */}
    </div>
  );
};


const TemplateViewPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1,
  });
  const [viewMode, setViewMode] = useState('list'); // Default to list for templates
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 15; // Adjust as needed

  const [showTemplateDetailModal, setShowTemplateDetailModal] = useState(false);
  const [selectedTemplateForDetail, setSelectedTemplateForDetail] = useState(null);

  // Effect to reset to page 1 when searchTerm changes
  useEffect(() => {
    if (pagination.currentPage !== 1) {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }
    // This effect should only run when searchTerm changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    const fetchTemplates = async (page = 1) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(page) });
        if (searchTerm.trim()) {
          params.append('search', searchTerm.trim()); // Assuming templates endpoint supports search
        }
        params.append('limit', String(itemsPerPage)); // Add limit/page_size if your API supports/requires it
        
        const response = await api.get(`/api/templates/?${params.toString()}`);
        const { results, count, next, previous } = response.data;

        setTemplates(results || []);
        setPagination({
          count: count || 0,
          next,
          previous,
          currentPage: page,
          totalPages: Math.ceil((count || 0) / itemsPerPage) || 1,
        });
      } catch (err) {
        console.error("Failed to fetch templates:", err);
        setError(err.response?.data?.detail || err.message || "Could not load templates.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates(pagination.currentPage);
  }, [pagination.currentPage, searchTerm, itemsPerPage]);

  const handleNextPage = () => {
    if (pagination.next) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination.previous) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };
  
  const handleViewTemplateDetails = (template) => {
    setSelectedTemplateForDetail(template);
    setShowTemplateDetailModal(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)} // Or navigate to '/dashboard/compass/documents'
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Templates
              </h1>
              <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {pagination.count} template(s) available
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            {/* Add Create Template button here if needed */}
            {/* View mode toggle (optional for templates, defaulting to list) */}
             <button
              onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
              title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
              className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100 shadow-sm'}`}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className={`w-12 h-12 animate-spin ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
          </div>
        )}

        {error && !isLoading && (
          <div className={`p-4 my-6 rounded-md ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'} flex items-center gap-3`}>
            <AlertTriangle size={24} />
            <div><h3 className="font-semibold">Error loading templates</h3><p className="text-sm">{error}</p></div>
          </div>
        )}

        {!isLoading && !error && templates.length === 0 && (
          <p className={`text-center py-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {searchTerm ? `No templates found for "${searchTerm}".` : "No templates available."}
          </p>
        )}

        {!isLoading && !error && templates.length > 0 && (
          <>
            {viewMode === 'list' ? (
              <div className={`rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {templates.map((template) => (
                  <TemplateListItem key={template.id} template={template} isDark={isDark} onViewTemplate={handleViewTemplateDetails} />
                ))}
              </div>
            ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* If you want a grid view for templates, adapt TemplateListItem or create TemplateGridItem */}
                    {templates.map((template) => (
                        // Replace with TemplateGridItem if you create one
                        <div key={template.id} className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{template.name}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{template.template_type}</p>
                        </div>
                    ))}
                </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-4">
                <button onClick={handlePreviousPage} disabled={!pagination.previous} className={`p-2 rounded-md flex items-center space-x-2 transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700'} disabled:cursor-not-allowed`}>
                  <ChevronLeft size={18} /> <span>Previous</span>
                </button>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button onClick={handleNextPage} disabled={!pagination.next} className={`p-2 rounded-md flex items-center space-x-2 transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700'} disabled:cursor-not-allowed`}>
                  <span>Next</span> <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/* Template Detail Modal */}
      <TemplateDetailModal
        isOpen={showTemplateDetailModal}
        onClose={() => setShowTemplateDetailModal(false)}
        template={selectedTemplateForDetail}
        // isDark prop is handled by useTheme within TemplateDetailModal itself
      />
    </div>
  );
};

export default TemplateViewPage;
