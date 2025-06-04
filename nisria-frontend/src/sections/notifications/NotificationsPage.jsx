import React, { useState } from 'react';
import { Bell, AlertTriangle, User, MessageCircle, Clock, FileText, Settings, Filter, MoreVertical, Check, X } from 'lucide-react';

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'system',
      context: 'grant',
      title: 'Grant Expiration Warning',
      message: 'Your research grant will expire in 7 days. Please renew to avoid interruption.',
      sender: 'System',
      timestamp: '2 hours ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'admin-alert',
      context: 'policy',
      title: 'New Policy Updates Available',
      message: 'Important policy changes have been implemented. Please review the updated guidelines.',
      sender: 'SuperAdmin',
      timestamp: '4 hours ago',
      isRead: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'task-based',
      context: 'document',
      title: 'Missing Report Upload',
      message: 'Please upload your quarterly progress report by end of week.',
      sender: 'System',
      timestamp: '1 day ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'direct-msg',
      context: 'message',
      title: 'New Message from Ren',
      message: 'Hey! Can we schedule a meeting to discuss the project timeline?',
      sender: 'Ren Martinez',
      timestamp: '2 days ago',
      isRead: false,
      priority: 'low'
    },
    {
      id: 5,
      type: 'request-action',
      context: 'document',
      title: 'Access Request Pending',
      message: 'Sarah Johnson requested access to Financial Statement Q3. Approval needed.',
      sender: 'Sarah Johnson',
      timestamp: '3 days ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: 6,
      type: 'system',
      context: 'event',
      title: 'Meeting Reminder',
      message: 'Team standup meeting starts in 30 minutes in Conference Room A.',
      sender: 'System',
      timestamp: '1 week ago',
      isRead: true,
      priority: 'low'
    }
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'system': return <Bell className="w-5 h-5 text-blue-500" />;
      case 'admin-alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'task-based': return <FileText className="w-5 h-5 text-orange-500" />;
      case 'direct-msg': return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'request-action': return <User className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-300 bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.isRead;
    return notification.type === activeFilter;
  });

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filterOptions = [
    { key: 'all', label: 'All Notifications', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length },
    { key: 'admin-alert', label: 'Admin Alerts', count: notifications.filter(n => n.type === 'admin-alert').length },
    { key: 'task-based', label: 'Tasks', count: notifications.filter(n => n.type === 'task-based').length },
    { key: 'direct-msg', label: 'Messages', count: notifications.filter(n => n.type === 'direct-msg').length },
    { key: 'request-action', label: 'Requests', count: notifications.filter(n => n.type === 'request-action').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
                className={`bg-white rounded-lg shadow-sm border-l-4 border-r border-t border-b border-gray-200 transition-all hover:shadow-md ${
                  getPriorityColor(notification.priority)
                } ${!notification.isRead ? 'ring-2 ring-blue-100' : ''}`}
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.context === 'grant' ? 'bg-blue-100 text-blue-700' :
                            notification.context === 'policy' ? 'bg-red-100 text-red-700' :
                            notification.context === 'document' ? 'bg-orange-100 text-orange-700' :
                            notification.context === 'message' ? 'bg-green-100 text-green-700' :
                            notification.context === 'event' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {notification.context}
                          </span>
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
        {filteredNotifications.length > 0 && (
          <div className="mt-6 text-center">
            <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Load More Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;