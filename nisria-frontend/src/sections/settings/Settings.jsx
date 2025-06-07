import { useState, useEffect, useRef } from 'react';
import { Camera, Shield, Globe, User, Upload, X, Check, Eye, EyeOff, Loader2, AlertTriangle, LogOut } from 'lucide-react'; // Removed Bell, Added LogOut
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../../services/api'; // Import your API service
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { useAuth } from '../../context/AuthProvider'; // Import useAuth
import { useTheme } from '../../context/ThemeProvider'; // Import useTheme
import 'react-phone-number-input/style.css'; // Import the styles

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dfjet61yc/"; // Example from Team.jsx, adjust if needed


const ProfileSettingsPage = () =>  {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // User profile data states
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '', // Will store the full E.164 phone number
    location: '', // API field
    // role: '', // Comes from currentUser, read-only
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [avatarDeleted, setAvatarDeleted] = useState(false);

  const [isLoading, setIsLoading] = useState(true); // For initial data load
  const [isSaving, setIsSaving] = useState(false); // For save operation
  const [fetchError, setFetchError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Theme preference from context and local user choice
  const { logout } = useAuth(); // Get logout function from AuthProvider
  const { theme: actualAppliedTheme, toggleTheme: globalToggleActualTheme } = useTheme();
  const [userThemePreference, setUserThemePreference] = useState(() => {
    // Initialize from localStorage or default to 'auto'
    return localStorage.getItem('themeUserPreference') || 'auto';
  });

  // Static Account Activity Data
  const accountActivity = [
    { event: 'Last Login', details: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} from Current Location` },
    { event: 'Password Changed', details: '30 days ago' },
    { event: 'Account Created', details: currentUser?.date_joined ? new Date(currentUser.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'January 15, 2024' },
  ];

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile Settings' },
    { id: 'security', icon: Shield, label: 'Password & Security' },
    { id: 'preferences', icon: Globe, label: 'Platform Preferences' }
  ];

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const response = await api.get('/api/accounts/me/');
        const user = response.data;
        setCurrentUser(user);

        const nameParts = user.full_name ? user.full_name.split(' ') : ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setFormData({
          firstName: firstName,
          lastName: lastName,
          phoneNumber: user.phone_number || '',
          location: user.location || '',
        });

        if (user.profile_picture) {
          const picUrl = user.profile_picture.startsWith('http') ? user.profile_picture : CLOUDINARY_BASE_URL + user.profile_picture;
          setProfileImagePreview(picUrl);
        } else {
          setProfileImagePreview(null);
        }
      } catch (err) {
        setFetchError(err.response?.data?.detail || err.message || 'Could not load user data.');
        console.error("Failed to fetch user data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Effect to persist user's theme preference and apply it
  useEffect(() => {
    localStorage.setItem('themeUserPreference', userThemePreference);

    const applyPreference = () => {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (userThemePreference === 'light') {
        if (actualAppliedTheme === 'dark') {
          globalToggleActualTheme();
        }
      } else if (userThemePreference === 'dark') {
        if (actualAppliedTheme === 'light') {
          globalToggleActualTheme();
        }
      } else { // 'auto'
        if (systemPrefersDark && actualAppliedTheme === 'light') {
          globalToggleActualTheme();
        } else if (!systemPrefersDark && actualAppliedTheme === 'dark') {
          globalToggleActualTheme();
        }
      }
    };
    applyPreference();
  }, [userThemePreference, actualAppliedTheme, globalToggleActualTheme]);

  // Effect to listen to OS theme changes when in 'auto' mode
  useEffect(() => {
    if (userThemePreference !== 'auto') {
      return undefined; // No listener needed if not in auto mode
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      const systemPrefersDark = e.matches;
      if (systemPrefersDark && actualAppliedTheme === 'light') {
        globalToggleActualTheme();
      } else if (!systemPrefersDark && actualAppliedTheme === 'dark') {
        globalToggleActualTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Cleanup listener on component unmount or when preference changes from 'auto'
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [userThemePreference, actualAppliedTheme, globalToggleActualTheme]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for react-phone-number-input
  const handlePhoneNumberChange = (value) => {
    setFormData(prev => ({ ...prev, phoneNumber: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
      setAvatarDeleted(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteAvatar = () => {
    setProfileImageFile(null);
    setProfileImagePreview(null);
    setAvatarDeleted(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess('');

    const data = new FormData();

    data.append('full_name', `${formData.firstName} ${formData.lastName}`.trim());

    // Phone Number: Append if changed
    const currentPhoneNumber = currentUser?.phone_number || '';
    const newPhoneNumber = formData.phoneNumber || '';
    if (newPhoneNumber !== currentPhoneNumber) {
      if (newPhoneNumber && isValidPhoneNumber(newPhoneNumber)) {
        data.append('phone_number', newPhoneNumber);
      } else if (!newPhoneNumber && currentPhoneNumber) { // Field was cleared
        data.append('phone_number', ''); // Send empty string to signify clearing
      }
      // If newPhoneNumber is present but invalid, it's not appended.
      // UI should ideally prevent saving with an invalid number if it's a hard requirement.
    }

    // Location: Append if changed
    const currentLocation = currentUser?.location || '';
    const newLocation = formData.location || '';
    if (newLocation !== currentLocation) {
      if (newLocation) {
        data.append('location', newLocation);
      } else { // Field was cleared
        data.append('location', ''); // Send empty string to signify clearing
      }
    }

    // Profile Picture
    if (profileImageFile) {
      data.append('profile_picture', profileImageFile);
    } else if (avatarDeleted) {
      data.append('profile_picture', ''); // Send empty string to signify deletion by backend
    }
    // If no new file and avatar not deleted, 'profile_picture' is not appended,
    // so PATCH semantics mean it remains unchanged by default.

    try {
      const response = await api.put('/api/accounts/me/update/', data); // Use PATCH and send FormData
      const updatedUser = response.data;
      setCurrentUser(updatedUser); // Update currentUser state with the response

      // Re-sync form data and profile picture preview from the server's response
      const nameParts = updatedUser.full_name ? updatedUser.full_name.split(' ') : ['', ''];
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phoneNumber: updatedUser.phone_number || '',
        location: updatedUser.location || '',
      });

      if (updatedUser.profile_picture) {
        const picUrl = updatedUser.profile_picture.startsWith('http') ? updatedUser.profile_picture : CLOUDINARY_BASE_URL + updatedUser.profile_picture;
        setProfileImagePreview(picUrl);
      } else {
        setProfileImagePreview(null);
      }
      setProfileImageFile(null); // Clear the staged file input
      setAvatarDeleted(false); // Reset avatar deletion flag

      setSaveSuccess('Profile updated successfully!');
      setTimeout(() => {
        setIsOpen(false); // Close modal
        navigate('/dashboard/compass/dashboard'); // Navigate after a short delay
      }, 1500);
    } catch (err) {
      const res = err.response?.data;
      const message = res
        ? Object.entries(res).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; ')
        : err.message;
      setSaveError(message || 'Failed to update profile.');
      console.error("Failed to update profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    navigate('/dashboard/compass/dashboard'); // Navigate to the dashboard route
  };

  const handleChangePassword = async () => {
    setPasswordChangeError(null);
    setPasswordChangeSuccess('');

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError("New passwords do not match.");
      return;
    }
    if (!oldPassword || !newPassword) {
      setPasswordChangeError("All password fields are required.");
      return;
    }
    if (newPassword.length < 8) { // Example: Enforce minimum length
        setPasswordChangeError("New password must be at least 8 characters long.");
        return;
    }

    setIsChangingPassword(true);
    try {
      await api.put('/api/accounts/me/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordChangeSuccess('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      // Optionally, close modal or navigate after success
      // setTimeout(() => {
      //   setIsOpen(false);
      //   navigate('/dashboard/compass/dashboard');
      // }, 2000);
    } catch (err) {
      const res = err.response?.data;
      const message = res ? (res.detail || Object.values(res).flat().join(' ')) : err.message;
      setPasswordChangeError(message || 'Failed to change password.');
      console.error("Failed to change password:", err);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false); // Close settings modal
    // Navigation to login page is handled by AuthProvider or App.js typically
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Blurred Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-md transition-all duration-300"
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
                onClick={handleCancel} // Changed to call handleCancel
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

            {/* Logout Button */}
            <div className="mt-auto pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-100 transition-all duration-200"
              >
                <LogOut size={20} />
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading && (
              <div className="flex justify-center items-center h-full">
                <Loader2 size={48} className="animate-spin text-blue-600" />
              </div>
            )}
            {fetchError && !isLoading && (
              <div className="p-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> {typeof fetchError === 'string' ? fetchError : JSON.stringify(fetchError)}</span>
                </div>
              </div>
            )}
            {!isLoading && !fetchError && currentUser && (
            <div className="p-8">
              {/* Profile Settings Section */}
              {activeSection === 'profile' && (
                <div className="space-y-8">
                  {saveError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                      <p className="font-bold">Save Failed</p>
                      <p>{typeof saveError === 'string' ? saveError : JSON.stringify(saveError)}</p>
                    </div>
                  )}
                  {saveSuccess && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                      <p className="font-bold">Success</p>
                      <p>{saveSuccess}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900">Profile Settings</h2>
                  </div>

                  {/* Profile Photo Section */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        {profileImagePreview ? (
                          <img src={profileImagePreview} alt="Profile" className="w-24 h-24 rounded-2xl object-cover" />
                        ) : (
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <User size={32} className="text-white" />
                          </div>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleProfileImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button 
                          onClick={triggerFileInput}
                          className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
                          aria-label="Change profile picture"
                        >
                          <Camera size={16} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <button onClick={triggerFileInput} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                          Upload New
                        </button>
                        <button onClick={handleDeleteAvatar} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl font-medium transition-colors ml-3">
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
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
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
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
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
                        value={currentUser?.email || ''}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Only editable by Super Admin</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mobile Number *
                        {formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber) && (
                          <span className="text-red-500 text-xs ml-2">(Invalid number)</span>
                        )}
                      </label>
                      <div className="phone-input-container"> {/* Optional: for custom styling */}
                        <PhoneInput
                          placeholder="Enter phone number"
                          value={formData.phoneNumber}
                          onChange={handlePhoneNumberChange}
                          defaultCountry="KE" // Set a default country
                          international
                          className="w-full px-0 py-0 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" // Adjust styling as needed
                        />
                      </div>
                    </div>
                    
                  </div>


                  {/* Work & Organization */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    {/* Gender and ID Number fields were part of a more detailed form structure,
                        but are not included in the current simplified form based on API requirements.
                        If they were previously here, their removal would happen in this section.
                    */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Work & Organization Identity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Role / Title
                        </label>
                        <input
                          type="text"
                          value={currentUser?.role ? currentUser.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
                          disabled
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Assigned by Super Admin</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Location / Region
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Nairobi, Kenya"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    {/* Program Affiliation and Team/Department select/input fields were part of a more detailed form,
                        but are not included in the current simplified form based on API requirements.
                        If they were previously here, their removal would happen in this section.
                    */}
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="space-y-8">
                  {passwordChangeError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                      <p className="font-bold">Password Change Failed</p>
                      <p>{passwordChangeError}</p>
                    </div>
                  )}
                  {passwordChangeSuccess && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                      <p className="font-bold">Success</p>
                      <p>{passwordChangeSuccess}</p>
                    </div>
                  )}


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
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                            placeholder="Enter your current password"
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
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter new password (min. 8 characters)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button
                        onClick={handleChangePassword}
                        disabled={isChangingPassword}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isChangingPassword ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : null}
                        {isChangingPassword ? 'Changing...' : 'Change Password'}
                      </button>
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
                      {accountActivity.map((activity, index) => (
                        <div key={index} className="flex justify-between items-center py-2">
                          <span className="text-gray-700">{activity.event}</span>
                          <span className="text-sm text-gray-500">
                            {activity.event === 'Account Created' && currentUser?.date_joined ? new Date(currentUser.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : activity.details}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Section */}
              {activeSection === 'preferences' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-gray-900">Platform Preferences</h2>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Preference</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {['light', 'dark', 'auto'].map((themeOption) => (
                        <button
                          key={themeOption}
                          onClick={() => setUserThemePreference(themeOption)}
                          className={`p-4 rounded-xl border-2 transition-all capitalize ${
                            userThemePreference === themeOption
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {themeOption === 'auto' ? 'System Default' : themeOption}
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
              {activeSection === 'profile' && ( // Only show Save/Cancel for profile section
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50"
                    disabled={isSaving}
                  >
                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
            )} {/* End of !isLoading && !fetchError && currentUser check */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettingsPage;