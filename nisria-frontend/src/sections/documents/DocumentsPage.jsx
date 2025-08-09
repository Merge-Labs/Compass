import React, { useState, useEffect } from 'react';
import {
  Folder,
  File,
  FileText,
  DollarSign,
  Mail,
  Briefcase,
  CreditCard,
  Receipt,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  User,
  Loader2, // Added for loading state
  AlertTriangle, // Added for error state
  Award, // Added for folder icon mapping
  FileSpreadsheet, // For Excel
  Presentation, // For PPTX - Changed from FilePresentation
  Image as ImageIcon, // For JPG, PNG (aliased to avoid conflict with File component)
  Palette, // For Canva (as a generic design tool icon)
  Copy, // Icon for Templates folder
  Share2,   // For DocumentCard menu
} from 'lucide-react';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeProvider'; // Import useTheme
import { useAuth } from '../../context/AuthProvider'; // Import useAuth
import { useNavigate, Routes, Route } from 'react-router-dom'; // Import Routes and Route
import TemplateViewPage from '../../components/documents/TemplateViewPage'; // Import the new TemplateViewPage
import FolderViewPage from '../../components/documents/FolderViewPage'; // Corrected import path
import BankStatementAccessPage from '../../components/documents/BankStatementAccessPage'; // Import the new BankStatementAccessPage
import DocumentDetailModal from '../../components/documents/DocumentDetailModal'; // Import the new detail modal
import DocumentUploadForm from '../../components/documents/DocumentUploadForm'; // Import the new form
import DocumentUpdateForm from '../../components/documents/DocumentUpdateForm'; // Import the update form

const DocumentCard = ({ document, isDark, onAction }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate(); // Initialize navigate
  
  return (
    <div
      className={`relative group cursor-pointer transition-all duration-200 transform hover:scale-105 ${
        isHovered ? 'shadow-lg' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        // Relative navigation. If current path is /dashboard/compass/documents, this goes to /dashboard/compass/documents/folder/...
        navigate(`folder/${document.id}`, { state: { folderName: document.name } });
      }}
    >
      <div className={`rounded-xl p-4 border ${
        isDark 
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className={`p-3 rounded-lg ${document.color}`}>
            <document.icon className="w-6 h-6 text-white" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className={`absolute right-0 top-8 z-10 w-48 rounded-md shadow-lg border ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="py-1">
                <button className={`flex items-center w-full px-4 py-2 text-sm ${
                  isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                }`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </button>
                <button className={`flex items-center w-full px-4 py-2 text-sm ${
                  isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                }`}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                <button className={`flex items-center w-full px-4 py-2 text-sm ${
                  isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                }`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Rename
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
        
        <h3 className={`font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {document.name}
        </h3>
        <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {document.count} files • {document.size}
        </p>
      </div>
    </div>
  );
};

const FileItem = ({ file, isDark, isGrid = false, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) { // Added optional chaining and ensure lowercase
      case 'pdf': return { icon: FileText, color: 'text-red-500' }; // Keep red for PDF
      case 'excel': case 'xlsx': case 'xls': return { icon: FileSpreadsheet, color: 'text-green-500' }; // Green for Excel
      case 'docx': case 'doc': return { icon: FileText, color: 'text-blue-500' }; // Blue for Word
      case 'pptx': case 'ppt': return { icon: Presentation, color: 'text-orange-500' }; // Orange for PowerPoint
      case 'jpg': case 'jpeg': case 'png': return { icon: ImageIcon, color: 'text-purple-500' }; // Purple for Images
      case 'canva': return { icon: Palette, color: 'text-pink-500' }; // Pink for Canva (design tool)
      // You can add more specific cases here
      // e.g., case 'txt': return { icon: FileText, color: 'text-gray-500' };
      default: return { icon: File, color: isDark ? 'text-gray-400' : 'text-gray-600' };
    }
  };

  const fileConfig = getFileIcon(file.type);

  if (isGrid) {
    return (
      <div
        className={`group transition-all duration-200 transform hover:scale-105 ${
          isHovered ? 'shadow-lg' : 'shadow-sm'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onViewDetails(file)} // Trigger detail view
      >
        {/* Added cursor-pointer to the inner div to make it clear it's clickable */}
        <div className={`rounded-xl p-4 border ${
          isDark 
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
            : 'bg-white border-gray-200 hover:bg-gray-50'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <fileConfig.icon className={`w-8 h-8 ${fileConfig.color}`} />
            <span className={`text-xs px-2 py-1 rounded-md truncate max-w-[50%] ${
              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              {file.type}
            </span>
          </div>
          <h3 className={`font-medium text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {file.name}
          </h3>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {file.size} • {file.modified}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
      }`}
      onClick={() => onViewDetails(file)} // Trigger detail view
      title={`View details for ${file.name}`}
    >
      <fileConfig.icon className={`w-5 h-5 mr-3 ${fileConfig.color}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {file.name}
        </p>
        <div className="flex items-center mt-1 space-x-2">
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {file.size}
          </span>
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {file.modified}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <User className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {file.owner}
        </span>
      </div>
    </div>
  );
};

const DocumentsPage = () => {
  const { theme } = useTheme(); // Use global theme
  const { user } = useAuth(); // Get user from auth context
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const [pageData, setPageData] = useState({ folders: [], recentFiles: [], allFiles: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [documentForDetail, setDocumentForDetail] = useState(null);

  // State for Document Update Modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [documentToUpdate, setDocumentToUpdate] = useState(null);

  let fetchDataRef = React.useRef(null); // To store fetchData for re-fetching

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);

      const basePromises = [
        api.get("/api/documents/"),
        api.get("/api/templates/")
      ];

      // Conditionally add bank statement previews fetch
      if (user?.role !== 'super_admin') {
        basePromises.push(api.get("/api/documents/bank-statements/previews/"));
      }

      try {
        // Fetch documents and templates in parallel
        const results = await Promise.allSettled(basePromises);

        const documentsResponse = results[0];
        const templatesResponse = results[1];
        let bankPreviewsResponse = (user?.role !== 'super_admin' && results.length > 2) ? results[2] : null;

        if (documentsResponse.status === 'rejected' || !documentsResponse.value) {
          console.error("Failed to fetch documents:", documentsResponse.reason);
          throw new Error(documentsResponse.reason.response?.data?.detail || documentsResponse.reason.message || "Could not load documents.");
        }
        
        const response = documentsResponse.value;
        const fetchedDocuments = response.data.results || response.data; 

        if (!Array.isArray(fetchedDocuments)) {
          console.error("API response for documents is not an array:", response.data);
          throw new Error("Received invalid data format for documents.");
        }

        const transformedAllFiles = fetchedDocuments.map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.document_format || 'unknown', // API document_format (e.g. 'pdf', 'docx')
          size: 'N/A', // API schema does not provide individual file size in list view
          modified: doc.date_uploaded ? new Date(doc.date_uploaded).toLocaleDateString() : 'Unknown date',
          owner: 'N/A', // API schema does not provide owner info
          document_link: doc.document_link, // Ensure link is passed for the modal
          // document_link: doc.document_link // Available if needed for actions
        }));

        const sortedByDate = [...fetchedDocuments].sort((a, b) => {
          const dateA = a.date_uploaded ? new Date(a.date_uploaded).getTime() : 0;
          const dateB = b.date_uploaded ? new Date(b.date_uploaded).getTime() : 0;
          return dateB - dateA;
        });

        const transformedRecentFiles = sortedByDate.slice(0, 3).map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.document_format || 'unknown',
          size: 'N/A',
          modified: doc.date_uploaded ? new Date(doc.date_uploaded).toLocaleDateString() : 'Unknown date',
          owner: 'N/A',
          document_link: doc.document_link, // Ensure link is passed for the modal
          // Add other fields from the main document object that modal might need
          description: doc.description,
          document_type_display: doc.document_type_display,
          document_format_display: doc.document_format_display,
          division_display: doc.division_display,
          date_uploaded: doc.date_uploaded,
        }));

        const typeAggregates = {};
        fetchedDocuments.forEach(doc => {
          const typeKey = doc.document_type || 'uncategorized';
          const typeDisplay = doc.document_type_display || 'Uncategorized';
          if (!typeAggregates[typeKey]) {
            typeAggregates[typeKey] = {
              name: typeDisplay,
              document_type: typeKey,
              count: 0,
            };
          }
          typeAggregates[typeKey].count++;
        });

        const getFolderStyle = (docTypeKey, docTypeDisplay) => {
            const lowerCaseDisplay = docTypeDisplay.toLowerCase();
            switch (docTypeKey) {
                case 'bank_statement':
                    return { icon: CreditCard, color: 'bg-red-500' };
                case 'cbo_cert':
                case 'ngo_cert':
                    return { icon: Award, color: 'bg-yellow-500' };
                case 'impact_report':
                    return { icon: FileText, color: 'bg-teal-500' };
                case 'pitch_deck':
                    return { icon: Briefcase, color: 'bg-pink-500' };
                case 'monthly_budget_nisria':
                case 'monthly_budget_maisha':
                case 'yearly_budget_nisria':
                case 'yearly_budget_maisha':
                case 'overall_budget':
                    return { icon: DollarSign, color: 'bg-green-500' };
                default:
                    if (lowerCaseDisplay.includes('contract')) return { icon: FileText, color: 'bg-blue-500' };
                    if (lowerCaseDisplay.includes('email') || lowerCaseDisplay.includes('template')) return { icon: Mail, color: 'bg-purple-500' };
                    if (lowerCaseDisplay.includes('tax')) return { icon: Receipt, color: 'bg-orange-500' };
                    if (lowerCaseDisplay.includes('agreement')) return { icon: Briefcase, color: 'bg-indigo-500' };
                    return { icon: Folder, color: 'bg-gray-500' };
            }
        };

        const transformedFolders = Object.values(typeAggregates).map((folderEntry, index) => {
          const style = getFolderStyle(folderEntry.document_type, folderEntry.name);
          return {
            id: folderEntry.document_type || `folder-type-${index}`,
            name: folderEntry.name,
            count: folderEntry.count,
            size: 'N/A', // Total size calculation is complex without individual sizes
            color: style.color,
            icon: style.icon,
          };
        });
        
        // Handle templates data
        if (templatesResponse.status === 'fulfilled') {
          const templateData = templatesResponse.value.data.results || templatesResponse.value.data;
          if (Array.isArray(templateData) && templateData.length > 0) {
            transformedFolders.unshift({ // Add Templates folder to the beginning
              id: 'templates', // Use 'templates' as ID for routing to folder/templates
              name: 'Templates',
              count: templateData.length,
              size: 'N/A',
              color: 'bg-purple-500', // Example color for templates
              icon: Copy, // Example icon for templates
            });
          }
        } else {
          console.warn("Failed to fetch templates:", templatesResponse.reason);
          // Optionally set a specific error for templates if needed
        }

        // Handle bank statement previews if fetched
        if (user?.role !== 'super_admin' && bankPreviewsResponse) {
          if (bankPreviewsResponse.status === 'fulfilled') {
            const previewData = bankPreviewsResponse.value.data.results || [];
            if (previewData.length > 0) {
              transformedFolders.unshift({ // Add to the beginning of folders list
                id: 'bank_statement_previews', // Special ID for routing
                name: 'Bank Statement Previews',
                count: previewData.length,
                size: 'N/A',
                color: 'bg-cyan-500', // Example color for bank previews
                icon: DollarSign,    // Example icon for bank previews
              });
            }
          } else {
            console.warn("Failed to fetch bank statement previews:", bankPreviewsResponse.reason);
          }
        }

        setPageData({
          folders: transformedFolders,
          recentFiles: transformedRecentFiles,
          allFiles: transformedAllFiles,
        });

      } catch (err) {
        console.error("Failed to fetch documents:", err);
        const errorMessage = err.message; // Error is already constructed above or is a generic one
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) { // Ensure user object is available before fetching
      fetchAllData();
      fetchDataRef.current = fetchAllData; // Assign to ref
    }
  }, [user]); // Add user as a dependency

  // Client-side search (can be enhanced to API-side search later)
  const filteredFiles = pageData.allFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadSuccess = () => {
    // Re-fetch documents list
    if (fetchDataRef.current) {
      fetchDataRef.current();
    }
  };

  const handleViewDetails = (doc) => {
    setDocumentForDetail(doc);
    setShowDetailModal(true);
  };

  const handleEditDocument = (doc) => {
    setDocumentToUpdate(doc);
    setShowUpdateModal(true);
    setShowDetailModal(false); // Close detail modal if open
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    setDocumentToUpdate(null);
    // Re-fetch documents list
    if (fetchDataRef.current) {
      fetchDataRef.current();
    }
    // Optionally, if the detail modal was for the updated doc, re-open it or update its data
  };

  return (
    <div className="min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Documents
                    </h1>
                    <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Manage your files and folders
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                      <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-2 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                    </div>
                    
                    <button className={`p-2 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' 
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}>
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg ${
                        viewMode === 'grid'
                          ? 'bg-blue-600 text-white'
                          : isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${
                        viewMode === 'list'
                          ? 'bg-blue-600 text-white'
                          : isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
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
                      <h3 className="font-semibold">Error loading documents</h3>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {!isLoading && !error && (
                  <>
                    {/* Folders Section */}
                    {pageData.folders.length > 0 && (
                      <div className="mb-8">
                        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Folders
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {pageData.folders.map((folder) => (
                            <DocumentCard key={folder.id} document={folder} isDark={isDark} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent Files */}
                    {pageData.recentFiles.length > 0 && (
                      <div className="mb-8">
                        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Recent
                        </h2>
                        <div className={`rounded-xl border glass-surface ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                          {pageData.recentFiles.map((file, index) => (
                            <div key={file.id} className={index < pageData.recentFiles.length - 1 ? `border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}` : ''}>
                              <FileItem file={file} isDark={isDark} onViewDetails={handleViewDetails} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Files */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          All Files
                        </h2>
                      </div>
                      {filteredFiles.length === 0 && searchTerm && ( <p className={`text-center py-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}> No documents found for "{searchTerm}".</p>)}
                      {filteredFiles.length === 0 && !searchTerm && pageData.allFiles.length === 0 && ( <p className={`text-center py-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}> No documents available.</p>)}
                      {filteredFiles.length > 0 && viewMode === 'grid' && ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> {filteredFiles.map((file) => ( <FileItem key={file.id} file={file} isDark={isDark} isGrid={true} /> ))} </div>)}
                      {filteredFiles.length > 0 && viewMode === 'list' && ( <div className={`rounded-xl border glass-surface ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}> {filteredFiles.map((file, index) => ( <div key={file.id} className={index < filteredFiles.length - 1 ? `border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}` : ''}> <FileItem file={file} isDark={isDark} onViewDetails={handleViewDetails} /> </div> ))} </div>)}
                    </div>
                  </>
                )}
              </>
            }
          />
          <Route path="folder/templates" element={<TemplateViewPage />} /> {/* Route for templates */}
          <Route path="folder/bank_statement_previews" element={<BankStatementAccessPage />} /> {/* Route for bank statement previews */}
          <Route path="folder/:documentType" element={<FolderViewPage />} />
        </Routes>

        <DocumentUploadForm
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={handleUploadSuccess}
          isDark={isDark}
        />

        <DocumentDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          document={documentForDetail}
          isDark={isDark}
          onDocumentDeleted={handleUploadSuccess} // Assuming handleUploadSuccess also re-fetches data
          onEditDocument={handleEditDocument} // Pass the handler
        />
      </div>
        {/* Document Update Modal */}
        {documentToUpdate && (
          <DocumentUpdateForm
            isOpen={showUpdateModal}
            onClose={() => { setShowUpdateModal(false); setDocumentToUpdate(null); }}
            onUpdateSuccess={handleUpdateSuccess}
            isDark={isDark}
            existingDocument={documentToUpdate}
          />
        )}
      </div>
  );
};
export default DocumentsPage;