import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../services/api';
import {
  X,
  Loader2,
  AlertTriangle,
  Eye,
  Send,
  RefreshCw,
  ClipboardCopy,
  Check,
  Edit3, // For Edit button
  Trash2, // For Delete button
} from 'lucide-react';
import { useTheme } from '../../context/ThemeProvider';
import ConfirmDeleteModal from '../shared/ConfirmDeleteModal'; // Import ConfirmDeleteModal

// New component to hold the core modal content and its hooks
const TemplateDetailContent = ({ template, onClose, onTemplateDeleted, onEditTemplate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [originalSubject, setOriginalSubject] = useState('');
  const [originalBody, setOriginalBody] = useState('');
  const [renderedSubject, setRenderedSubject] = useState('');
  const [renderedBody, setRenderedBody] = useState('');
  
  const [contextInput, setContextInput] = useState('{}');
  const [parsedContext, setParsedContext] = useState({});
  const [contextError, setContextError] = useState('');
  
  const [recipientEmail, setRecipientEmail] = useState('');
  const [exportToError, setExportToError] = useState('');
  
  const [isLoadingOriginal, setIsLoadingOriginal] = useState(false);
  const [isLoadingRendered, setIsLoadingRendered] = useState(false);
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  
  const [errorOriginal, setErrorOriginal] = useState('');
  const [errorRendered, setErrorRendered] = useState('');
  const [errorExport, setErrorExport] = useState('');
  
  const [exportSuccessMessage, setExportSuccessMessage] = useState('');
  const [copiedField, setCopiedField] = useState(null); // 'subject' or 'body'

  // Refs for the editable divs
  const subjectRef = useRef(null);
  const bodyRef = useRef(null);
  // State to store the current selection range
  const [savedSelection, setSavedSelection] = useState(null);
  // Ref to track if the state update was due to user input
  const isInputting = useRef(false);
  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchOriginalTemplate = useCallback(async () => {
    if (!template?.id) {
 return;
    }
 setIsLoadingOriginal(true);
 setErrorOriginal('');
 setOriginalSubject('');
 setOriginalBody('');
 setRenderedSubject(''); // Clear previous rendered content
 setRenderedBody('');
 setSavedSelection(null); // Clear selection on major content change
 try {
 const response = await api.get(`/api/templates/${template.id}/render/`);
 setOriginalSubject(response.data.raw_subject_template || response.data.subject_template || response.data.subject || ''); // Store original for reset
 setOriginalBody(response.data.raw_body_template || response.data.body_template || response.data.body || ''); // Store original for reset
 // Initially, rendered is same as original
 setRenderedSubject(response.data.raw_subject_template || response.data.subject_template || response.data.subject || '');
 setRenderedBody(response.data.raw_body_template || response.data.body_template || response.data.body || ''); // Display this initially
    } catch (err) {
 console.error("Failed to fetch original template:", err);
 setErrorOriginal(err.response?.data?.detail || err.message || "Could not load original template.");
    } finally {
 setIsLoadingOriginal(false);
    }
  }, [template]); // template is a dependency

  useEffect(() => {
    // Fetch original template when the component mounts or template changes
    if (template?.id) {
      fetchOriginalTemplate();
      // Reset states when modal opens with a new template or reopens
      setContextInput('{}');
      setParsedContext({});
      setContextError('');
      setRecipientEmail('');
      setExportToError('');
      setErrorRendered('');
      setErrorExport('');
      setExportSuccessMessage('');
    } // No need for isOpen check here, as this component is only mounted when isOpen is true
  }, [template, fetchOriginalTemplate]);

  const handleContextInputChange = (e) => {
    const newContextInput = e.target.value;
    setContextInput(newContextInput);
    try {
      const newParsedContext = JSON.parse(newContextInput);
      if (typeof newParsedContext === 'object' && newParsedContext !== null) {
        setParsedContext(newParsedContext);
        setContextError('');
      } else {
        throw new Error("Context must be a JSON object.");
      }
    } catch (err) {
        console.error(err);
      setParsedContext({});
      setContextError("Invalid JSON format. Please provide a valid JSON object.");
    }
  };

  // Function to save the current selection
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0));
    } else {
      setSavedSelection(null);
    }
  };

  // Function to restore the selection
  const restoreSelection = () => {
    if (savedSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }
  };

  const handlePreviewWithContext = async () => {
    if (!template?.id || contextError) return;
    setIsLoadingRendered(true);
    setErrorRendered('');
    setRenderedSubject('');
    setRenderedBody('');
    try {
      isInputting.current = false; // API update is not user input
      setSavedSelection(null); // Clear selection on major content change
      const response = await api.post(`/api/templates/${template.id}/render/`, { context: parsedContext }); // Use parsedContext
      setRenderedSubject(response.data.raw_subject_template || response.data.subject_template || response.data.subject || ''); // Update rendered state
      setRenderedBody(response.data.raw_body_template || response.data.body_template || response.data.body || ''); // Update rendered state
    } catch (err) {
      console.error("Failed to render template with context:", err);
      setErrorRendered(err.response?.data?.detail || err.message || "Could not render template with context.");
    } finally {
      setIsLoadingRendered(false);
    }
  };

  const handleExport = async () => {
    if (!template?.id || contextError) return;
    if (!recipientEmail.trim()) {
      setExportToError("Recipient email is required.");
      return;
    }
    setExportToError('');

    setIsLoadingExport(true);
    setErrorExport('');
    setExportSuccessMessage('');
    try {
      // Make the API call
      const response = await api.post(`/api/templates/${template.id}/export/`, {
        context: parsedContext,
        to: recipientEmail.trim(),
      });
      // Check if the response contains the gmail_url
      if (response.data && response.data.gmail_url) {
        window.open(response.data.gmail_url, '_blank'); // Open in a new tab
        setExportSuccessMessage(`Email draft opened for ${recipientEmail}!`);
      } else {
        // Fallback message if gmail_url is not in the response
        setExportSuccessMessage(`Template data prepared for ${recipientEmail}. Gmail URL not found in response.`);
      }
      setRecipientEmail(''); // Clear after successful export
    } catch (err) {
      console.error("Failed to export template:", err);
      setErrorExport(err.response?.data?.detail || err.message || "Could not export template.");
    } finally {
      setIsLoadingExport(false);
    }
  };
  
  const handleDeleteTemplate = async () => {
    if (!template?.id) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await api.delete(`/api/templates/${template.id}/soft-delete/`);
      if (onTemplateDeleted) {
        onTemplateDeleted(template.id);
      }
      onClose(); // Close the main modal
    } catch (err) {
      console.error("Failed to delete template:", err);
      setDeleteError(err.response?.data?.detail || err.message || "Could not delete template.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false); // Close confirmation dialog if it was open
    }
  };

  const handleEditClick = () => {
    if (onEditTemplate) {
      onEditTemplate(template); // Pass template to parent handler
    }
  };

  const handleCopyToClipboard = async (textToCopy, fieldName) => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Optionally show an error message to the user
    }
  };

  // Handlers for editing the preview content directly
  const handleSubjectPreviewInput = (e) => {
    isInputting.current = true; // Mark that input is happening
    saveSelection(); // Save selection BEFORE state update
    setRenderedSubject(e.currentTarget.textContent);
  };
  const handleBodyPreviewInput = (e) => {
    isInputting.current = true; // Mark that input is happening
    saveSelection(); // Save selection BEFORE state update
    setRenderedBody(e.currentTarget.innerHTML);
  };

  // Effect to restore selection AFTER render
  useEffect(() => {
    // This effect runs whenever dependencies change, including after state updates from input/API
    // Only attempt to restore selection if we have a saved selection AND the state change was due to user input
    if (isInputting.current && savedSelection) {
    // Use requestAnimationFrame to ensure the DOM has been updated by React
    requestAnimationFrame(() => {
    try {
    restoreSelection();
    } catch (e) {
    console.warn("Failed to restore selection:", e);
    }
    });
    }
    isInputting.current = false; // Reset the flag after the effect runs
  }, [savedSelection]); // Dependencies: Only savedSelection.

  const inputClass = `w-full p-2 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`;
  const labelClass = `block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;
  const buttonClass = `px-4 py-2 rounded-lg flex items-center justify-center min-w-[100px] transition-colors disabled:opacity-60`;
  const primaryButtonClass = `${buttonClass} bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-400`;
  const secondaryButtonClass = `${buttonClass} ${isDark ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} disabled:bg-gray-400`;

  return (
      <div
        className={`
          ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}
          rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col
          transform transition-all duration-300 ease-out
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 sm:p-5 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className="text-xl font-semibold truncate pr-4" title={template?.name || 'Template Details'}>
            {template?.name || 'Template Details'}
          </h3>
        <button
          onClick={onClose}
          className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Pane: Context & Actions */}
          <div className={`w-full lg:w-1/3 lg:border-r ${isDark ? 'border-gray-700' : 'border-gray-200'} p-4 space-y-4 overflow-y-auto`}>
            <div>
              <label htmlFor="contextInput" className={labelClass}>Context (JSON)</label>
              <textarea
                id="contextInput"
                rows="6"
                className={`${inputClass} font-mono text-xs`}
                value={contextInput}
                onChange={handleContextInputChange}
                placeholder='e.g., {"name": "John Doe", "amount": 100}'
              />
              {contextError && <p className="text-red-500 text-xs mt-1">{contextError}</p>}
            </div>
            <button
              onClick={handlePreviewWithContext} // Call the preview handler
              disabled={isLoadingRendered || !!contextError} // Button disabled only if loading or context has errors
              className={`${primaryButtonClass} w-full`}
            >
              {isLoadingRendered ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Eye size={18} className="mr-2" />}
              Preview with Context
            </button>
            {errorRendered && <p className="text-red-500 text-xs mt-1">{errorRendered}</p>}

            <hr className={isDark ? 'border-gray-700' : 'border-gray-300'} />

            <div>
              <label htmlFor="recipientEmail" className={labelClass}>Recipient Email for Export</label>
              <input
                type="email"
                id="recipientEmail"
                className={inputClass}
                value={recipientEmail}
                onChange={(e) => {
                  setRecipientEmail(e.target.value);
                  if (exportToError) setExportToError('');
                }}
                placeholder="recipient@example.com"
              />
              {exportToError && <p className="text-red-500 text-xs mt-1">{exportToError}</p>}
            </div>
            <button
              onClick={handleExport}
              disabled={isLoadingExport || !!contextError || !recipientEmail.trim()}
              className={`${secondaryButtonClass} w-full`}
            >
              {isLoadingExport ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
              Export Template
            </button>
            {errorExport && <p className="text-red-500 text-xs mt-1">{errorExport}</p>}
            {exportSuccessMessage && <p className="text-green-500 text-xs mt-1">{exportSuccessMessage}</p>}
          </div>

          {/* Actions: Edit and Delete */}
          {/* These buttons are placed at the bottom of the left pane */}
          <div className="mt-auto pt-4 border-t space-y-2 ${isDark ? 'border-gray-700' : 'border-gray-300'}">
            <button
              onClick={handleEditClick}
              className={`${secondaryButtonClass} w-full flex items-center justify-center`}
            >
              <Edit3 size={16} className="mr-2" />
              Edit Template
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className={`${buttonClass} w-full flex items-center justify-center ${
                isDark ? 'bg-red-700 hover:bg-red-800 text-red-100' : 'bg-red-500 hover:bg-red-600 text-white'
              } disabled:opacity-70`}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 size={16} className="mr-2" />}
              Delete Template
            </button>
            {deleteError && !showDeleteConfirm && <p className="text-red-500 text-xs mt-1 text-center">{deleteError}</p>}
          </div>

          {/* Right Pane: Template Preview */}
          <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
            {isLoadingOriginal && (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
              </div>
            )}
            {errorOriginal && (
              <div className={`flex-1 flex flex-col items-center justify-center p-4 rounded ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
                <AlertTriangle className={`w-8 h-8 mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                <p className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>{errorOriginal}</p>
              </div>
            )}
            {!isLoadingOriginal && !errorOriginal && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`text-md font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Subject Preview
                    </h4>
                    <button
                      onClick={() => handleCopyToClipboard(renderedSubject || originalSubject, 'subject')}
                      title="Copy subject"
                      className={`p-1 rounded ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}
                    >
                      {copiedField === 'subject' ? <Check size={16} className="text-green-500" /> : <ClipboardCopy size={16} />}
                    </button>
                  </div>
                  <div
                    ref={subjectRef} // Attach ref
                    contentEditable="true" // Make it editable
                    onInput={handleSubjectPreviewInput} // Capture changes
                    dangerouslySetInnerHTML={{ __html: renderedSubject || originalSubject || 'No subject' }} // Use dangerouslySetInnerHTML for initial content
                    className={`p-3 rounded border ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-800'} text-sm min-h-[40px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`text-md font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Body Preview
                    </h4>
                     <button
                      onClick={() => handleCopyToClipboard(renderedBody || originalBody, 'body')}
                      title="Copy body"
                      className={`p-1 rounded ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}
                    >
                      {copiedField === 'body' ? <Check size={16} className="text-green-500" /> : <ClipboardCopy size={16} />}
                    </button>
                  </div>
                  <div
                    ref={bodyRef} // Attach ref
                    contentEditable="true" // Make it editable
                    onInput={handleBodyPreviewInput} // Capture changes
                    dangerouslySetInnerHTML={{ __html: renderedBody || originalBody || 'No body content' }} // Use dangerouslySetInnerHTML for initial content
                    className={`p-3 rounded border ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-800'} text-sm min-h-[200px] whitespace-pre-wrap overflow-y-auto`}
                  />
                </div>
                <button
                  onClick={fetchOriginalTemplate}
                  disabled={isLoadingOriginal || isLoadingRendered}
                  className={`${secondaryButtonClass} w-full mt-auto`}
                >
                  <RefreshCw size={18} className="mr-2" />
                  Reset to Original Template
                </button>
              </>
            )}
          </div>
        </div>
        {showDeleteConfirm && (
          <ConfirmDeleteModal
            isOpen={showDeleteConfirm}
            onClose={() => { setShowDeleteConfirm(false); setDeleteError(''); }}
            onConfirm={handleDeleteTemplate}
            itemName={template?.name || 'this template'}
            itemType="template"
            isProcessing={isDeleting}
            title="Confirm Template Deletion"
            message={`Are you sure you want to send the template "${template?.name || 'this template'}" to the recycle bin? This action can usually be undone by an administrator.`}
            confirmButtonText="Send to Recycle Bin"
            customError={deleteError} // Pass deleteError to the modal
          />
        )}
      </div>
  );
};

// Main Modal Wrapper Component
const TemplateDetailModal = ({ isOpen, onClose, template, onTemplateDeleted, onEditTemplate }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null; // Only render the modal structure when isOpen is true

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      onClick={handleBackdropClick}
      style={{ opacity: isOpen ? 1 : 0 }} // Use opacity for transition
    >
      {/* Render the content component only when modal is open */}
      <TemplateDetailContent
        template={template}
        onClose={onClose}
        onTemplateDeleted={onTemplateDeleted}
        onEditTemplate={onEditTemplate}
      />
    </div>
  );
};

export default TemplateDetailModal;
