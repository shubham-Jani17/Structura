import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// Services
import { settingsService } from '../../services/settingsService';
import { authService } from '../../services/authService';

// Settings Modular Components
import ProfileCard from '../../components/settings/ProfileCard';
import EditProfileModal from '../../components/settings/EditProfileModal';
import AvatarPickerModal from '../../components/settings/AvatarPickerModal';
import SecuritySection from '../../components/settings/SecuritySection';
import NotificationPreferencesSection from '../../components/settings/NotificationPreferencesSection';
import LanguagePreferencesModal from '../../components/settings/LanguagePreferencesModal';
import LegalModal from '../../components/settings/LegalModal';
import LogoutConfirmationModal from '../../components/settings/LogoutConfirmationModal';
import AppInfoCard from '../../components/settings/AppInfoCard';

/**
 * Structura MAD - Settings & Profile Screen
 *
 * Full-screen layout matching Dashboard, Attendance, Inventory, and Reports:
 * 1. My Profile & Personal Information (Photo, Name, Employee ID, Role, Department, Site)
 * 2. Personal Information Edit Form with validation
 * 3. Dedicated Security Section (Change Password with validation and show/hide toggle)
 * 4. Account Settings (Notification preferences switches, Language selector)
 * 5. App Info, Enterprise Privacy Policy, Terms & Conditions, and Secure Logout
 */
export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  // User Profile & Preferences State
  const [profile, setProfile] = useState(() => settingsService.getUserProfile());
  const [selectedLanguage, setSelectedLanguage] = useState(() =>
    settingsService.getSelectedLanguage()
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals Visibility State
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isAvatarPickerVisible, setIsAvatarPickerVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [legalModalType, setLegalModalType] = useState(null); // 'PRIVACY', 'TERMS', or null
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  // Pull-to-refresh handler (matches other tabs)
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setProfile(settingsService.getUserProfile());
      setSelectedLanguage(settingsService.getSelectedLanguage());
      setIsRefreshing(false);
    }, 400);
  }, []);

  // Update Profile Callback
  const handleSaveProfile = async (updatedData) => {
    const updated = settingsService.updateUserProfile(updatedData);
    setProfile(updated);
    Alert.alert('Profile Saved', 'Your personal information has been updated successfully.');
  };

  // Update Avatar Callback
  const handleSelectAvatar = (avatarUri) => {
    const updated = settingsService.updateUserProfile({ avatar: avatarUri });
    setProfile(updated);
  };

  // Language Change Callback
  const handleSelectLanguage = (lang) => {
    settingsService.setLanguage(lang.code);
    setSelectedLanguage(lang);
  };

  // Logout Callback
  const handleConfirmLogout = () => {
    setIsLogoutModalVisible(false);
    authService.logout();
    router.replace('/(auth)/login');
  };

  // Safe vertical padding calculations (identical across all modules)
  const topInset = Math.max(insets.top, Platform.OS === 'ios' ? 12 : 16);
  const bottomInset = Math.max(insets.bottom, 12) + 76;

  return (
    <View style={[styles.rootContainer, { paddingTop: topInset }]} className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset }]}
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#172B4D', '#F97316']}
            tintColor="#172B4D"
          />
        }
      >
        {/* Screen Header */}
        <View className="mb-3.5">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Structura Preferences
              </Text>
              <Text className="text-xl font-black text-[#172B4D] tracking-tight">
                Settings & Profile
              </Text>
            </View>

            <View className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 items-center justify-center">
              <Feather name="settings" size={20} color="#172B4D" />
            </View>
          </View>
        </View>

        {/* 1. My Profile & Personal Information Card */}
        <ProfileCard
          profile={profile}
          onOpenAvatarPicker={() => setIsAvatarPickerVisible(true)}
          onOpenEditProfile={() => setIsEditProfileVisible(true)}
        />

        {/* 2. Security Settings (Change Password) */}
        <SecuritySection />

        {/* 3. Notification Preferences (Switches) */}
        <NotificationPreferencesSection />

        {/* 4. Account Settings, Language, Legal Terms & Logout */}
        <AppInfoCard
          selectedLanguage={selectedLanguage}
          onOpenLanguageModal={() => setIsLanguageModalVisible(true)}
          onOpenPrivacyPolicy={() => setLegalModalType('PRIVACY')}
          onOpenTerms={() => setLegalModalType('TERMS')}
          onOpenLogoutModal={() => setIsLogoutModalVisible(true)}
        />
      </ScrollView>

      {/* Interactive Modals */}
      <EditProfileModal
        visible={isEditProfileVisible}
        profile={profile}
        onSave={handleSaveProfile}
        onClose={() => setIsEditProfileVisible(false)}
      />

      <AvatarPickerModal
        visible={isAvatarPickerVisible}
        currentAvatar={profile.avatar}
        onSelectAvatar={handleSelectAvatar}
        onClose={() => setIsAvatarPickerVisible(false)}
      />

      <LanguagePreferencesModal
        visible={isLanguageModalVisible}
        currentLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
        onClose={() => setIsLanguageModalVisible(false)}
      />

      <LegalModal
        visible={Boolean(legalModalType)}
        type={legalModalType || 'PRIVACY'}
        onClose={() => setLegalModalType(null)}
      />

      <LogoutConfirmationModal
        visible={isLogoutModalVisible}
        userName={profile.name}
        onConfirmLogout={handleConfirmLogout}
        onClose={() => setIsLogoutModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});
