import React, {useState, useEffect} from 'react';
import {
  X,
  Loader2,
  AlertTriangle,
  Link as LinkIcon,
  Calendar,
  FileText,
  Type,
  Grid,
  Info,
  Maximize,
  Minimize,
  Edit3,  // For Edit button
  Trash2, // For Delete button
} from 'lucide-react';
import api from '../../services/api'; // Import api
import ConfirmDeleteModal from '../shared/ConfirmDeleteModal'; // Import ConfirmDeleteModal

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    console.error(e);
    return "Invalid Date";
  }
};

const DetailItem = ({ icon: Icon, label, value, isLink = false, linkHref, isDark }) => (
  <div className={`py-3 sm:grid sm:grid-cols-3 sm:gap-4 px-1`}>
    <dt className={`text-sm font-medium flex items-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      {Icon && <Icon className={`w-4 h-4 mr-2 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />}
      {label}
    </dt>
    <dd className={`mt-1 text-sm sm:mt-0 sm:col-span-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
      {isLink && value && value !== "N/A" ? (
        <a
          href={linkHref || value}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center break-all ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline`}
        >
          {value}
          <LinkIcon className="w-3 h-3 ml-1.5 flex-shrink-0" />
        </a>
      ) : (
        <span className={`break-words ${value === "N/A" || !value ? (isDark ? 'text-gray-500 italic' : 'text-gray-400 italic') : ''}`}>
          {value || "N/A"}
        </span>
      )}
    </dd>
  </div>
);

const DocumentDetailModal = ({ isOpen, onClose, document, isDark, onDocumentDeleted, onEditDocument }) => {
  const [isFullScreenIframe, setIsFullScreenIframe] = useState(false);
  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  
  useEffect(() => {
    // Reset fullscreen state when modal is closed or document changes
    setIsFullScreenIframe(false);
  }, [isOpen, document]);

  if (!isOpen || !document) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const {
    name,
    description,
    document_type_display,
    document_format_display,
    division_display,
    date_uploaded,
    document_link,
  } = document;

  const handleDeleteDocument = async () => {
    if (!document?.id) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await api.delete(`/api/documents/${document.id}/soft-delete/`);
      if (onDocumentDeleted) {
        onDocumentDeleted(document.id);
      }
      onClose(); // Close the main modal
    } catch (err) {
      console.error("Failed to delete document:", err);
      setDeleteError(err.response?.data?.detail || err.message || "Could not delete document.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false); // Close confirmation dialog if it was open
    }
  };

  const handleEditClick = () => {
    if (onEditDocument) {
      onEditDocument(document); // Pass document to parent handler
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      onClick={handleBackdropClick}
      style={{ opacity: isOpen ? 1 : 0 }}
    >
      <div
        className={`
          ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}
          rounded-xl shadow-2xl w-full flex flex-col
          transform transition-all duration-300 ease-out
          ${isFullScreenIframe ? 'max-w-full max-h-full h-full' : 'max-w-5xl max-h-[90vh]'}
        `}
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click from triggering on modal content
      >
        {/* Header */}
        {!isFullScreenIframe && (
          <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className="text-xl font-semibold truncate pr-4" title={name}>{name}</h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={`flex-1 flex ${isFullScreenIframe ? 'flex-col' : 'lg:flex-row'} overflow-hidden`}>
          {/* Metadata Section (conditionally rendered) */}
          {!isFullScreenIframe && (
            <div className="w-full lg:w-1/3 lg:border-r overflow-y-auto p-4 sm:p-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}">
              <dl className="divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}">
                {description && (
                  <DetailItem icon={Info} label="Description" value={description} isDark={isDark} />
                )}
                <DetailItem icon={Type} label="Type" value={document_type_display} isDark={isDark} />
                <DetailItem icon={FileText} label="Format" value={document_format_display} isDark={isDark} />
                <DetailItem icon={Grid} label="Division" value={division_display} isDark={isDark} />
                <DetailItem icon={Calendar} label="Uploaded" value={formatDate(date_uploaded)} isDark={isDark} />
                <DetailItem icon={LinkIcon} label="Document Link" value={document_link} isLink={true} isDark={isDark} />
              </dl>

              {/* Actions: Edit and Delete */}
              <div className={`mt-6 pt-4 border-t space-y-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  onClick={handleEditClick}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isDark ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <Edit3 size={16} className="mr-2" />
                  Edit Document
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isDark ? 'bg-red-700 hover:bg-red-800 text-red-100' : 'bg-red-500 hover:bg-red-600 text-white'
                  } disabled:opacity-70`}
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 size={16} className="mr-2" />}
                  Delete Document
                </button>
                {deleteError && !showDeleteConfirm && (
                  <p className="text-red-500 text-xs mt-1 text-center">{deleteError}</p>
                )}
              </div>
            </div>
          )}

          {/* Iframe Viewer Section */}
          <div className={`flex-1 flex flex-col ${isFullScreenIframe ? 'h-full' : 'h-auto lg:h-full'} relative`}>
            {document_link ? (
              <>
                <div className={`p-2 ${isDark ? 'bg-gray-750' : 'bg-gray-100'} ${isFullScreenIframe ? 'absolute top-2 right-2 z-10 rounded-md' : 'border-b ' + (isDark ? 'border-gray-700' : 'border-gray-200')}`}>
                  <button
                    onClick={() => setIsFullScreenIframe(!isFullScreenIframe)}
                    title={isFullScreenIframe ? "Exit full screen" : "View full screen"}
                    className={`p-1.5 rounded ${isDark ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-300'}`}
                  >
                    {isFullScreenIframe ? <Minimize size={18} /> : <Maximize size={18} />}
                  </button>
                </div>
                <iframe
                  src={document_link}
                  title={name}
                  className="w-full h-full flex-grow border-0" // flex-grow ensures it takes available space
                  allowFullScreen
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className={`w-12 h-12 mb-4 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
                <p className="font-semibold">No Document Link</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  A viewable link for this document is not available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          isOpen={showDeleteConfirm}
          onClose={() => { setShowDeleteConfirm(false); setDeleteError(''); }}
          onConfirm={handleDeleteDocument}
          itemName={document?.name || 'this document'}
          itemType="document"
          isProcessing={isDeleting}
          title="Confirm Document Deletion"
          message={`Are you sure you want to send the document "${document?.name || 'this document'}" to the recycle bin? This action can usually be undone by an administrator.`}
          confirmButtonText="Send to Recycle Bin"
          customError={deleteError} // Pass deleteError to the modal
        />
      )}
    </div>
  );
};

export default DocumentDetailModal;
