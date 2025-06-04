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
  Moon,
  Sun,
  Download,
  Share2,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Upload,
  Clock,
  User
} from 'lucide-react';

// Mock data for documents
const mockDocuments = {
  folders: [
    { id: 1, name: 'Contracts', count: 23, size: '156 MB', color: 'bg-blue-500', icon: FileText },
    { id: 2, name: 'Email Templates', count: 8, size: '12 MB', color: 'bg-purple-500', icon: Mail },
    { id: 3, name: 'Budgets', count: 15, size: '89 MB', color: 'bg-green-500', icon: DollarSign },
    { id: 4, name: 'Tax Statements', count: 12, size: '45 MB', color: 'bg-orange-500', icon: Receipt },
    { id: 5, name: 'Bank Statements', count: 31, size: '234 MB', color: 'bg-red-500', icon: CreditCard },
    { id: 6, name: 'Service Agreements', count: 7, size: '28 MB', color: 'bg-indigo-500', icon: Briefcase }
  ],
  recentFiles: [
    { 
      id: 1, 
      name: 'Annual Data July', 
      type: 'PDF', 
      size: '2.3 MB', 
      modified: '2 days ago',
      owner: 'John Doe',
      icon: FileText,
      color: 'text-red-500'
    },
    { 
      id: 2, 
      name: 'Q2 Results', 
      type: 'XLSX', 
      size: '1.8 MB', 
      modified: '5 days ago',
      owner: 'Jane Smith',
      icon: FileText,
      color: 'text-green-500'
    },
    { 
      id: 3, 
      name: 'Environment Data', 
      type: 'PDF', 
      size: '890 KB', 
      modified: '1 week ago',
      owner: 'Mike Johnson',
      icon: FileText,
      color: 'text-blue-500'
    }
  ],
  allFiles: [
    { id: 4, name: 'Response Data', type: 'DOCX', size: '456 KB', modified: '3 days ago', owner: 'Sarah Wilson' },
    { id: 5, name: 'Q4 Results', type: 'XLSX', size: '2.1 MB', modified: '1 week ago', owner: 'Tom Brown' },
    { id: 6, name: 'Analysis Data April', type: 'PDF', size: '1.2 MB', modified: '2 weeks ago', owner: 'Lisa Davis' },
    { id: 7, name: 'Q3 Results', type: 'XLSX', size: '1.9 MB', modified: '3 weeks ago', owner: 'Alex Chen' },
    { id: 8, name: 'Service Contract', type: 'PDF', size: '678 KB', modified: '1 month ago', owner: 'Emma Taylor' }
  ]
};

const DocumentCard = ({ document, isDark, onAction }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-200 transform hover:scale-105 ${
        isHovered ? 'shadow-lg' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
                  <Download className="w-4 h-4 mr-2" />
                  Download
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

const FileItem = ({ file, isDark, isGrid = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return { icon: FileText, color: 'text-red-500' };
      case 'xlsx': case 'xls': return { icon: FileText, color: 'text-green-500' };
      case 'docx': case 'doc': return { icon: FileText, color: 'text-blue-500' };
      default: return { icon: File, color: 'text-gray-500' };
    }
  };

  const fileConfig = getFileIcon(file.type);

  if (isGrid) {
    return (
      <div
        className={`group cursor-pointer transition-all duration-200 transform hover:scale-105 ${
          isHovered ? 'shadow-lg' : 'shadow-sm'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`rounded-xl p-4 border ${
          isDark 
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
            : 'bg-white border-gray-200 hover:bg-gray-50'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <fileConfig.icon className={`w-8 h-8 ${fileConfig.color}`} />
            <span className={`text-xs px-2 py-1 rounded-md ${
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
    <div className={`flex items-center p-3 rounded-lg transition-colors ${
      isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
    }`}>
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
  const [isDark, setIsDark] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto p-6">
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
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
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

        {/* Folders Section */}
        <div className="mb-8">
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Folders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockDocuments.folders.map((folder) => (
              <DocumentCard key={folder.id} document={folder} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* Recent Files */}
        <div className="mb-8">
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Recent
          </h2>
          <div className={`rounded-xl border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {mockDocuments.recentFiles.map((file, index) => (
              <div key={file.id} className={index < mockDocuments.recentFiles.length - 1 ? 
                `border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}` : ''
              }>
                <FileItem file={file} isDark={isDark} />
              </div>
            ))}
          </div>
        </div>

        {/* All Files */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              All Files
            </h2>
            <button className={`text-sm flex items-center space-x-1 ${
              isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}>
              <span>View all</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockDocuments.allFiles.map((file) => (
                <FileItem key={file.id} file={file} isDark={isDark} isGrid={true} />
              ))}
            </div>
          ) : (
            <div className={`rounded-xl border ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              {mockDocuments.allFiles.map((file, index) => (
                <div key={file.id} className={index < mockDocuments.allFiles.length - 1 ? 
                  `border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}` : ''
                }>
                  <FileItem file={file} isDark={isDark} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-xl p-6 w-96 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Upload Documents
              </h3>
              <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDark ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Drag and drop files here, or click to browse
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className={`px-4 py-2 rounded-lg ${
                    isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;