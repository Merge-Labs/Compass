import { useState } from 'react';
import { Camera, Bell, Shield, Globe, User, Upload, X, Check, Eye, EyeOff } from 'lucide-react';

import { useNavigate } from 'react-router-dom'; // Import useNavigate
export default function ProfileSettingsPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    inAppNotifications: true,
    activityAlerts: true,
    deadlineReminders: true,
    grantUpdates: false,
    communityAnnouncements: true
  });
  const [doNotDisturb, setDoNotDisturb] = useState({ start: '22:00', end: '07:00' });
  const [theme, setTheme] = useState('auto');
  const navigate = useNavigate(); // Initialize useNavigate
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile Settings' },
    { id: 'security', icon: Shield, label: 'Password & Security' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'preferences', icon: Globe, label: 'Platform Preferences' }
  ];

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveChanges = () => {
    // Here you would typically save the data to your backend
    console.log('Saving changes...');
    // Simulate saving... then navigate
    // setIsOpen(false); // You might still want to close the modal
    navigate('/dashboard/compass/dashboard'); // Navigate to the dashboard route
  };

  const handleCancel = () => {
    // setIsOpen(false); // You might still want to close the modal
    navigate('/dashboard/compass/dashboard'); // Navigate to the dashboard route
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Blurred Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-md transition-all duration-300"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Settings Modal */}
      <div className="absolute inset-4 md:inset-8 lg:inset-16 xl:inset-20 bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 p-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              {/* Profile Settings Section */}
              {activeSection === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900">Profile Settings</h2>
                  </div>

                  {/* Profile Photo Section */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                          <User size={32} className="text-white" />
                        </div>
                        <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors">
                          <Camera size={16} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                          Upload New
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl font-medium transition-colors ml-3">
                          Delete Avatar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        placeholder="First name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Last name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email (Immutable) 🔐
                      </label>
                      <input
                        type="email"
                        value="team@nisria.co"
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Only editable by Super Admin</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Username / Display Name
                      </label>
                      <input
                        type="text"
                        placeholder="Display name (optional)"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mobile Number *
                      </label>
                      <div className="flex">
                        <select className="px-3 py-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50">
                          <option>🇰🇪 +254</option>
                          <option>🇳🇬 +234</option>
                          <option>🇺🇸 +1</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="0800 123 7890"
                          className="flex-1 px-4 py-3 rounded-r-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date of Birth (Optional)
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender / Pronouns (Optional)
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input type="radio" name="gender" value="male" className="mr-2" />
                          Male
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="gender" value="female" className="mr-2" />
                          Female
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="gender" value="other" className="mr-2" />
                          Other
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ID Number
                      </label>
                      <input
                        type="text"
                        placeholder="1509 000 7788 8008"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Work & Organization */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Work & Organization Identity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Role / Title
                        </label>
                        <input
                          type="text"
                          placeholder="Program Manager"
                          disabled
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Assigned by Super Admin</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Program Affiliation
                        </label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                          <option>Microfund Program</option>
                          <option>Rescue Center</option>
                          <option>All Programs</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Location / Region
                        </label>
                        <input
                          type="text"
                          placeholder="Nairobi, Kenya"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Team / Department
                        </label>
                        <input
                          type="text"
                          placeholder="Operations Team"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-gray-900">Password & Security</h2>
                  
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Add an extra layer of security to your account</p>
                        <p className="text-sm text-gray-500 mt-1">Recommended for all users</p>
                      </div>
                      <button
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Activity</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Last Login</span>
                        <span className="text-sm text-gray-500">Today, 2:30 PM from Nairobi, KE</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Password Changed</span>
                        <span className="text-sm text-gray-500">30 days ago</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Account Created</span>
                        <span className="text-sm text-gray-500">January 15, 2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-gray-900">Notification Preferences</h2>
                  
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'emailUpdates', label: 'Receive Email Updates', desc: 'Get notified about important updates via email' },
                        { key: 'grantUpdates', label: 'Grant Updates', desc: 'Notifications about grant opportunities and deadlines' },
                        { key: 'communityAnnouncements', label: 'Community Announcements', desc: 'Stay updated with community news and events' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => handleNotificationToggle(item.key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">In-App Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'activityAlerts', label: 'Activity Alerts', desc: 'Get notified about your account activity' },
                        { key: 'deadlineReminders', label: 'Deadline Reminders', desc: 'Never miss important deadlines' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => handleNotificationToggle(item.key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Do Not Disturb</h3>
                    <p className="text-gray-600 mb-4">Set quiet hours when you won't receive notifications</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                        <input
                          type="time"
                          value={doNotDisturb.start}
                          onChange={(e) => setDoNotDisturb(prev => ({ ...prev, start: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                        <input
                          type="time"
                          value={doNotDisturb.end}
                          onChange={(e) => setDoNotDisturb(prev => ({ ...prev, end: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Section */}
              {activeSection === 'preferences' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-gray-900">Platform Preferences</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Language</h3>
                      <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Swahili</option>
                        <option>French</option>
                      </select>
                    </div>
                    
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Zone</h3>
                      <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                        <option>EAT (UTC+3) - Nairobi</option>
                        <option>GMT (UTC+0) - London</option>
                        <option>EST (UTC-5) - New York</option>
                        <option>PST (UTC-8) - Los Angeles</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Preference</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {['light', 'dark', 'auto'].map((themeOption) => (
                        <button
                          key={themeOption}
                          onClick={() => setTheme(themeOption)}
                          className={`p-4 rounded-xl border-2 transition-all capitalize ${
                            theme === themeOption
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {themeOption === 'auto' ? 'System' : themeOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Gamification Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">127</div>
                        <div className="text-sm text-gray-600">Tasks Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">89%</div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">15</div>
                        <div className="text-sm text-gray-600">Badges Earned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">#3</div>
                        <div className="text-sm text-gray-600">Leaderboard</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save and Cancel Buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                <button 
                  onClick={handleCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                >
                  <X size={20} />
                  Cancel
                </button>
                <button 
                  onClick={handleSaveChanges}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                >
                  <Check size={20} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}