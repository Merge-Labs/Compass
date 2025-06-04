import React, { useState } from 'react';
import { 
  Eye, 
  Edit, 
  Trash2,
  X,
  Calendar,
  User,
  Moon,
  Sun,
  Plus
} from 'lucide-react';

export default function DocumentTable() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'edit', 'add'
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [documents, setDocuments] = useState([
    { id: 1, name: 'Q1 Budget Report.pdf', size: '2.4 MB', date: '2024-03-15', author: 'John Doe', type: 'PDF' },
    { id: 2, name: 'Marketing Budget.xlsx', size: '1.8 MB', date: '2024-03-10', author: 'Jane Smith', type: 'Excel' },
    { id: 3, name: 'Annual Budget Plan.docx', size: '3.2 MB', date: '2024-02-28', author: 'Mike Johnson', type: 'Word' },
    { id: 4, name: 'Department Budgets.pdf', size: '4.1 MB', date: '2024-02-15', author: 'Sarah Wilson', type: 'PDF' },
    { id: 5, name: 'Budget Analysis.pptx', size: '5.7 MB', date: '2024-01-30', author: 'David Brown', type: 'PowerPoint' },
    { id: 6, name: 'Financial Report Q4.pdf', size: '3.8 MB', date: '2024-01-20', author: 'Emily Davis', type: 'PDF' },
    { id: 7, name: 'Contract Template.docx', size: '1.2 MB', date: '2024-01-15', author: 'Robert Chen', type: 'Word' }
  ]);

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    tags: ''
  });

  const handleView = (doc) => {
    setSelectedDocument(doc);
    setModalType('view');
    setShowModal(true);
  };

  const handleEdit = (doc) => {
    setSelectedDocument(doc);
    setModalType('edit');
    setShowModal(true);
    setEditForm({
      name: doc.name,
      description: doc.description || '',
      tags: doc.tags || ''
    });
  };

  const handleDelete = (docId) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== docId));
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setDocuments(documents.map(doc => 
      doc.id === selectedDocument.id 
        ? { ...doc, name: editForm.name, description: editForm.description, tags: editForm.tags }
        : doc
    ));
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDocument(null);
    setEditForm({ name: '', description: '', tags: '' });
  };

  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return '📄';
      case 'excel': case 'xlsx': return '📊';
      case 'word': case 'docx': return '📝';
      case 'powerpoint': case 'pptx': return '📊';
      default: return '📄';
    }
  };

  const themeClass = darkMode ? 'dark bg-gray-900' : 'bg-gray-50';
  const cardClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = darkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClass}`}>
      {/* Header */}
      <div className={`${cardClass} border-b px-6 py-4 flex justify-between items-center`}>
        <h1 className={`text-2xl font-bold ${textClass}`}>Documents</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Document Table */}
      <div className="p-6">
        <div className={`${cardClass} border rounded-xl overflow-hidden shadow-sm`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <tr>
                  <th className={`text-left py-4 px-6 font-semibold ${textClass}`}>Document</th>
                  <th className={`text-left py-4 px-6 font-semibold ${textClass}`}>Size</th>
                  <th className={`text-left py-4 px-6 font-semibold ${textClass}`}>Date</th>
                  <th className={`text-left py-4 px-6 font-semibold ${textClass}`}>Author</th>
                  <th className={`text-left py-4 px-6 font-semibold ${textClass}`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {documents.map((doc) => (
                  <tr key={doc.id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getFileIcon(doc.type)}</span>
                        <div>
                          <p className={`font-medium ${textClass}`}>{doc.name}</p>
                          <p className={`text-sm ${textSecondaryClass}`}>{doc.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`py-4 px-6 ${textSecondaryClass}`}>{doc.size}</td>
                    <td className={`py-4 px-6 ${textSecondaryClass}`}>{doc.date}</td>
                    <td className={`py-4 px-6 ${textSecondaryClass}`}>{doc.author}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(doc)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(doc)}
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${cardClass} border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`text-xl font-semibold ${textClass}`}>
                {modalType === 'view' && 'View Document'}
                {modalType === 'edit' && 'Edit Document'}
              </h2>
              <button
                onClick={closeModal}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {modalType === 'view' && selectedDocument && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{getFileIcon(selectedDocument.type)}</span>
                    <div>
                      <h3 className={`text-lg font-semibold ${textClass}`}>{selectedDocument.name}</h3>
                      <p className={`${textSecondaryClass}`}>{selectedDocument.type} • {selectedDocument.size}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={`text-sm font-medium ${textClass} mb-1`}>Date Created</p>
                      <p className={`${textSecondaryClass} flex items-center`}>
                        <Calendar className="w-4 h-4 mr-2" />
                        {selectedDocument.date}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${textClass} mb-1`}>Author</p>
                      <p className={`${textSecondaryClass} flex items-center`}>
                        <User className="w-4 h-4 mr-2" />
                        {selectedDocument.author}
                      </p>
                    </div>
                  </div>
                  {selectedDocument.description && (
                    <div>
                      <p className={`text-sm font-medium ${textClass} mb-2`}>Description</p>
                      <p className={`${textSecondaryClass}`}>{selectedDocument.description}</p>
                    </div>
                  )}
                  {selectedDocument.tags && (
                    <div>
                      <p className={`text-sm font-medium ${textClass} mb-2`}>Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDocument.tags.split(',').map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {modalType === 'edit' && (
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium ${textClass} mb-2`}>
                      Document Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textClass} mb-2`}>
                      Description
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textClass} mb-2`}>
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editForm.tags}
                      onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="budget, financial, quarterly"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={closeModal}
                      className={`flex-1 border py-2 px-4 rounded-lg transition-colors ${
                        darkMode 
                          ? 'border-gray-600 hover:bg-gray-700' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}