import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Bell, AlertTriangle, User, MessageCircle, Clock, FileText, Settings, Filter, MoreVertical, Check, X, Loader2, ExternalLink } from 'lucide-react';
import bgImage from '/bg.jpg';
import api from '../../services/api'; // Assuming api service is setup

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // More user-friendly format, e.g., "Oct 23, 2023, 10:30 AM"
    // or relative time like "2 hours ago" if you add a library like date-fns
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const getNotificationIcon = (notificationType) => {
    // Assuming notification_type from API matches these keys or can be mapped
    switch (notificationType?.toLowerCase()) {
      case 'system': return <Bell className="w-5 h-5 text-blue-500" />;
      case 'admin-alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'task-based': return <FileText className="w-5 h-5 text-orange-500" />;
      case 'direct-msg': return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'request-action': return <User className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // For styling the tag based on notification_type
  const getNotificationTypeTagStyle = (notificationType) => {
    switch (notificationType?.toLowerCase()) {
      case 'system': return 'bg-blue-100 text-blue-700'; // Was 'grant'
      case 'admin-alert': return 'bg-red-100 text-red-700'; // Was 'policy'
      case 'task-based': return 'bg-orange-100 text-orange-700'; // Was 'document'
      case 'direct-msg': return 'bg-green-100 text-green-700'; // Was 'message'
      case 'request-action': return 'bg-purple-100 text-purple-700'; // Was 'event' / 'request-action'
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/notifications/');
      // Assuming API returns { results: [], ... } or just []
      const data = response.data.results || response.data || [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError(err.response?.data?.detail || err.message || "Could not load notifications.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get('/api/notifications/unread-count/');
      setUnreadCount(response.data.unread_count || 0);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
      // Optionally set an error state for unread count
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  const processedNotifications = useMemo(() => {
    return notifications.map(n => ({
      id: n.id,
      type: n.notification_type, // Use notification_type for icon and tag
      title: n.title,
      message: n.message,
      sender: n.assigner_full_name || 'System',
      timestamp: formatDate(n.created_at),
      isRead: n.read_status,
      link: n.link,
      // priority and context are removed as they are not directly in the API model
    })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by original date
  }, [notifications]);

  const filteredNotifications = processedNotifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.isRead;
    return notification.type === activeFilter;
  });

  const markAsRead = async (id) => {
    try {
      await api.post(`/api/notifications/${id}/mark-as-read/`);
      fetchNotifications(); // Refetch to update list
      fetchUnreadCount();   // Refetch unread count
    } catch (err) {
      console.error("Failed to mark as read:", err);
      // Optionally show an error to the user
    }
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setIsDetailModalOpen(true);
    // Mark as read when viewing details
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const renderNotificationDetails = () => {
    if (!selectedNotification) return null;

    const { title, message, type, timestamp, sender, link } = selectedNotification;
    
    return (
      <div className="space-y-6">
        {/* Header with title and type badge */}
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            getNotificationTypeTagStyle(type)
          }`}>
            {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
        
        {/* Message content */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">{message}</p>
        </div>
        
        {/* Metadata grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
              <p className="text-gray-700 dark:text-gray-200 font-medium">{sender}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Date Received</p>
              <p className="text-gray-700 dark:text-gray-200 font-medium">{timestamp}</p>
            </div>
          </div>
        </div>
        
        {/* Related content link */}
        {link && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">Related Content</p>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Open</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    );
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/api/notifications/mark-all-as-read/');
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}/delete/`);
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const filterOptions = [
    { key: 'all', label: 'All Notifications', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length },
    { key: 'admin-alert', label: 'Admin Alerts', count: notifications.filter(n => n.type === 'admin-alert').length },
    { key: 'task-based', label: 'Tasks', count: notifications.filter(n => n.type === 'task-based').length },
    { key: 'direct-msg', label: 'Messages', count: notifications.filter(n => n.type === 'direct-msg').length },
    { key: 'request-action', label: 'Requests', count: notifications.filter(n => n.type === 'request-action').length },
  ];

  if (loading) {
    return (
      <div
        className="min-h-screen w-full bg-cover bg-center p-6 flex justify-center items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen w-full bg-cover bg-center p-6 flex justify-center items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-cover bg-center p-6" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600">Stay updated with your latest activities</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark all read</span>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setActiveFilter(option.key)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === option.key
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{option.label}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeFilter === option.key
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">You're all caught up! Check back later for new updates.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md ${
                  !notification.isRead ? 'ring-2 ring-blue-100 bg-blue-50' : 'bg-white'
                }`} // Simplified: no priority border, subtle bg for unread
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`text-sm font-semibold ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className={`text-sm mb-2 ${
                          !notification.isRead ? 'text-gray-700' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{notification.sender}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{notification.timestamp}</span>
                          </span>
                          {notification.type && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationTypeTagStyle(notification.type)}`}>
                              {notification.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete notification"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {processedNotifications.length > 0 && notifications.length > filteredNotifications.length && ( // Example condition if pagination was implemented
          <div className="mt-6 text-center">
            <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Load More Notifications
            </button>
          </div>
        )}
      </div>
      
      {/* Notification Detail Modal */}
      {isDetailModalOpen && selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            {/* Header */}
            <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Details</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {renderNotificationDetails()}
            </div>
            
            {/* Footer */}
            <div className={`sticky bottom-0 flex justify-end space-x-3 p-4 border-t ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'
            }`}>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Close
              </button>
              {selectedNotification.link && (
                <a
                  href={selectedNotification.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Open Related Content
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;