import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  File,
  FileText,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  Palette,
  User,
  Plus, // Added for Upload button
  Search, // Added for Search input
} from 'lucide-react';
import { useTheme } from '../../context/ThemeProvider'; // Import useTheme
import DocumentDetailModal from './DocumentDetailModal'; // Import the detail modal
import DocumentUploadForm from './DocumentUploadForm'; // Import the upload form

// Re-using FileItem component structure from DocumentsPage.jsx
// For a larger app, this could be a shared component.
const FileItem = ({ file, isDark, isGrid = false, onViewDetails }) => {
  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return { icon: FileText, color: 'text-red-500' };
      case 'excel': case 'xlsx': case 'xls': return { icon: FileSpreadsheet, color: 'text-green-500' };
      case 'docx': case 'doc': return { icon: FileText, color: 'text-blue-500' };
      case 'pptx': case 'ppt': return { icon: Presentation, color: 'text-orange-500' };
      case 'jpg': case 'jpeg': case 'png': return { icon: ImageIcon, color: 'text-purple-500' };
      case 'canva': return { icon: Palette, color: 'text-pink-500' };
      default: return { icon: File, color: isDark ? 'text-gray-400' : 'text-gray-600' };
    }
  };

  const fileConfig = getFileIcon(file.type);

  if (isGrid) {
    return (
      <div 
        className={`group cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-lg rounded-xl p-4 border ${
          isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
        }`}
        onClick={() => onViewDetails(file)}
        title={`View details for ${file.name}`}
      >
        <div className="flex items-start justify-between mb-3">
          <fileConfig.icon className={`w-8 h-8 ${fileConfig.color}`} />
          <span className={`text-xs px-2 py-1 rounded-md ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            {file.type}
          </span>
        </div>
        <h3 className={`font-medium text-sm mb-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {file.name}
        </h3>
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {file.size} • {file.modified}
        </p>
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
      }`}
      onClick={() => onViewDetails(file)}
      title={`View details for ${file.name}`}
    >
      <fileConfig.icon className={`w-5 h-5 mr-3 ${fileConfig.color}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {file.name}
        </p>
        <div className="flex items-center mt-1 space-x-2">
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{file.size}</span>
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{file.modified}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <User className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{file.owner}</span>
      </div>
    </div>
  );
};


const FolderViewPage = () => {
  const { documentType } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const passedFolderName = location.state?.folderName;
  const [folderDisplayName, setFolderDisplayName] = useState(
    passedFolderName || documentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  );

  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1,
  });
  const { theme } = useTheme(); // Use global theme
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState('grid');
  const itemsPerPage = 12; // Adjust as needed, or if API supports 'limit'
  const [searchTerm, setSearchTerm] = useState('');

  // State for Document Detail Modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [documentForDetail, setDocumentForDetail] = useState(null);
  // State for Document Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Removed local useEffect for theme detection and local toggleTheme

  useEffect(() => {
    const fetchFiles = async (page = 1, currentSearchTerm = searchTerm) => {
      setIsLoading(true);
      setError(null);
      // Keep a reference to this function to allow re-fetching
      try {
        const params = new URLSearchParams({ document_type: documentType, page });
        if (currentSearchTerm.trim()) {
          params.append('search', currentSearchTerm.trim()); // Assuming 'search' is the query param for search
        }
        const response = await api.get(`/api/documents/filter/?${params.toString()}`);
        const { results, count, next, previous } = response.data;

        const transformedFiles = results.map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.document_format || 'unknown',
          size: 'N/A', // API schema does not provide individual file size
          modified: doc.date_uploaded ? new Date(doc.date_uploaded).toLocaleDateString() : 'Unknown date',
          owner: 'N/A', // API schema does not provide owner info
          document_link: doc.document_link, // Ensure link is passed for the modal
          description: doc.description,
          document_type_display: doc.document_type_display,
          document_format_display: doc.document_format_display,
          division_display: doc.division_display,
          date_uploaded: doc.date_uploaded, // Pass full date for modal formatting
        }));
        setFiles(transformedFiles);
        setPagination({
          count,
          next,
          previous,
          currentPage: page,
          totalPages: Math.ceil(count / itemsPerPage) || 1, // Assuming API doesn't give total pages
        });
        // If folderDisplayName wasn't passed, try to get it from the first document
        if (!passedFolderName && results.length > 0 && results[0].document_type_display) {
            setFolderDisplayName(results[0].document_type_display);
        }

      } catch (err) {
        console.error(`Failed to fetch files for ${documentType}:`, err);
        setError(err.response?.data?.detail || err.message || "Could not load files.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles(pagination.currentPage);
    // Storing fetchFiles in a ref is not strictly necessary here unless another child component needs to trigger it.
  }, [documentType, pagination.currentPage, passedFolderName, searchTerm]); // Added searchTerm as dependency

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

  const handleViewDetails = (doc) => {
    setDocumentForDetail(doc);
    setShowDetailModal(true);
  };

  const handleUploadSuccess = () => {
    // Re-fetch files for the current folder view
    // Directly call fetchFiles logic or trigger a re-fetch via useEffect dependency change if preferred
    // For simplicity, directly re-fetching with current page:
    // This requires fetchFiles to be accessible, e.g. by defining it outside useEffect or using useCallback and a ref.
    // For now, we'll rely on the existing useEffect to re-fetch if pagination.currentPage is reset or a new key is added.
    // A more robust way would be to have a dedicated refetch function.
    // Let's assume for now that closing the modal and potentially navigating might be enough,
    // or we can enhance this by making fetchFiles callable.
    // For a direct re-fetch, you'd need to ensure fetchFiles is callable from here.
    // A simple way to trigger re-fetch is to change a dependency of the useEffect that calls fetchFiles.
    // For example, add a 'refreshKey' state and increment it. 
    // For now, let's just log and close. A full re-fetch implementation might be more involved.
    console.log("Upload successful, ideally refresh file list here.");
    setShowUploadModal(false); // Close the upload modal
    // To ensure list updates, we can re-trigger the fetchFiles useEffect.
    // One way is to slightly change a dependency. Let's try resetting currentPage to itself,
    // which might not always work, or use a dedicated refresh trigger.
    // A better approach:
    if (fetchFilesRef.current) {
      fetchFilesRef.current(1, searchTerm); // Fetch page 1 with current search term
    }
  };

  // To make fetchFiles callable from handleUploadSuccess
  const fetchFilesRef = React.useRef(null);
  useEffect(() => {
    const fetchFiles = async (page = 1) => {
      // If search term changes, reset to page 1
      const pageToFetch = searchTerm !== fetchFilesRef.current?.lastSearchTerm ? 1 : page;

      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ document_type: documentType, page: pageToFetch });
        if (searchTerm.trim()) {
          params.append('search', searchTerm.trim());
        }
        const response = await api.get(`/api/documents/filter/?${params.toString()}`);
        const { results, count, next, previous } = response.data;

        const transformedFiles = results.map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.document_format || 'unknown',
          size: 'N/A',
          modified: doc.date_uploaded ? new Date(doc.date_uploaded).toLocaleDateString() : 'Unknown date',
          owner: 'N/A',
          document_link: doc.document_link,
          description: doc.description,
          document_type_display: doc.document_type_display,
          document_format_display: doc.document_format_display,
          division_display: doc.division_display,
          date_uploaded: doc.date_uploaded,
        }));
        setFiles(transformedFiles);
        setPagination({
          count,
          next,
          previous,
          currentPage: pageToFetch,
          totalPages: Math.ceil(count / itemsPerPage) || 1,
        });
        if (!passedFolderName && results.length > 0 && results[0].document_type_display) {
            setFolderDisplayName(results[0].document_type_display);
        }
      } catch (err) {
        console.error(`Failed to fetch files for ${documentType}:`, err);
        setError(err.response?.data?.detail || err.message || "Could not load files.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFilesRef.current = fetchFiles; 
    fetchFilesRef.current = fetchFiles; // Store the function in a ref

    // Determine if search term changed to reset page
    const pageToFetch = searchTerm !== fetchFilesRef.current.lastSearchTermForEffect ? 1 : pagination.currentPage;
    fetchFiles(pageToFetch);
    fetchFilesRef.current.lastSearchTermForEffect = searchTerm; // Update for next effect run
  }, [documentType, pagination.currentPage, passedFolderName, itemsPerPage, searchTerm]);


  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {folderDisplayName}
              </h1>
              <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {pagination.count} file(s)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search in folder..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Pagination will be reset by the useEffect dependency change
                }}
                className={`pl-10 pr-4 py-2 rounded-lg border text-sm ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm ${
                isDark ? 'shadow-md' : 'shadow-sm hover:shadow-md'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Upload</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              <List className="w-4 h-4" />
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
            <div>
              <h3 className="font-semibold">Error loading files</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && files.length === 0 && !searchTerm && (
          <p className={`text-center py-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            No documents found in this folder.
          </p>
        )}
        {!isLoading && !error && files.length === 0 && searchTerm && (
          <p className={`text-center py-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            No documents found for "{searchTerm}".
          </p>
        )}

        {!isLoading && !error && files.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {files.map((file) => (
                  <FileItem key={file.id} file={file} isDark={isDark} isGrid={true} onViewDetails={handleViewDetails} />
                ))}
              </div>
            ) : (
              <div className={`rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {files.map((file, index) => (
                  <div key={file.id} className={index < files.length - 1 ? `border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}` : ''} >
                    <FileItem file={file} isDark={isDark} onViewDetails={handleViewDetails} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={!pagination.previous}
                  className={`p-2 rounded-md flex items-center space-x-2 transition-colors ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700'
                  } disabled:cursor-not-allowed`}
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={!pagination.next}
                  className={`p-2 rounded-md flex items-center space-x-2 transition-colors ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700'
                  } disabled:cursor-not-allowed`}
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/* Document Detail Modal */}
      <DocumentDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        document={documentForDetail}
        isDark={isDark} // Pass the theme state
      />
      {/* Document Upload Modal */}
      <DocumentUploadForm
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
        isDark={isDark}
        // Optionally, pre-fill document_type if desired for this folder view
      />
    </div>
  );
};

export default FolderViewPage;
