import React, { useState, useEffect } from 'react';
import { SEOHead } from '../common/SEOHead';
import { User, Mail, Phone, FileText, Save, Edit3, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AnimatedBackground } from '../common/AnimatedBackground';

interface UserProfile {
  displayName: string;
  email: string;
  bio: string;
  phoneNumber: string;
  avatar?: string;
}

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    bio: '',
    phoneNumber: '',
    avatar: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, [currentUser]);

  const loadUserProfile = () => {
    if (!currentUser) return;

    try {
      const savedProfile = localStorage.getItem(`userProfile_${currentUser.uid}`);
      if (savedProfile) {
        const localProfile = JSON.parse(savedProfile);
        setProfile({
          displayName: localProfile.displayName || currentUser.displayName || '',
          email: localProfile.email || currentUser.email || '',
          bio: localProfile.bio || '',
          phoneNumber: localProfile.phoneNumber || '',
          avatar: localProfile.avatar || '',
        });
      } else {
        // If no local profile, use auth data
        setProfile(prev => ({
            ...prev,
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
        }));
      }
    } catch (error) {
      console.error('Error loading profile from local storage:', error);
      setError('Failed to load profile data');
    }
  };

  const handleSave = () => {
    if (!currentUser) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Save profile data to local storage
      localStorage.setItem(`userProfile_${currentUser.uid}`, JSON.stringify(profile));

      setSuccess('Profile updated successfully!');
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      console.error('Error updating profile to local storage:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values by reloading from local storage
    loadUserProfile();
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <SEOHead
        title="Profile Settings - HackMVP | Manage Your Account"
        description="Manage your HackMVP profile settings, update personal information, and customize your account preferences."
        keywords="profile settings, account management, user profile, personal information"
      />
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Profile Settings
            </h1>
            <p className="text-gray-400 text-lg">
              Manage your account information and preferences
            </p>
          </div>

          <div className="bg-dark-card/80 backdrop-blur-sm border border-dark-border rounded-lg p-6 sm:p-8">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-purple-glow/20 border-2 border-purple-glow/30 rounded-full flex items-center justify-center">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 sm:h-16 sm:w-16 text-purple-glow" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-glow hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {profile.displayName || 'User'}
                </h2>
                <p className="text-gray-400 mb-4">{profile.email}</p>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 bg-purple-glow hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center justify-center px-4 py-2 bg-neon-green hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 mb-6">
                <p className="text-green-400">{success}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-glow focus:ring-1 focus:ring-purple-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your display name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-glow focus:ring-1 focus:ring-purple-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={profile.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-glow focus:ring-1 focus:ring-purple-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="block w-full pl-10 pr-3 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-glow focus:ring-1 focus:ring-purple-glow disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="mt-8 pt-8 border-t border-dark-border">
              <h3 className="text-lg font-bold text-white mb-4">Account Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Account Created:</span>
                  <span className="text-white ml-2">
                    {currentUser?.metadata.creationTime ?
                      new Date(currentUser.metadata.creationTime).toLocaleDateString() :
                      'Unknown'
                    }
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Last Sign In:</span>
                  <span className="text-white ml-2">
                    {currentUser?.metadata.lastSignInTime ?
                      new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() :
                      'Unknown'
                    }
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Email Verified:</span>
                  <span className={`ml-2 ${currentUser?.emailVerified ? 'text-green-400' : 'text-red-400'}`}>
                    {currentUser?.emailVerified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">User ID:</span>
                  <span className="text-white ml-2 font-mono text-xs">
                    {currentUser?.uid.substring(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};