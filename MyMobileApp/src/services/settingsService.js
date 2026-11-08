/**
 * Structura MAD - Settings & Profile Service
 * In-memory state and validation engine for user profile, security,
 * notification preferences, and application metadata.
 */

export const AVATAR_OPTIONS = [
  {
    id: 'AVT-1',
    label: 'Marcus (Default)',
    uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'AVT-2',
    label: 'Hardhat Field Spec',
    uri: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'AVT-3',
    label: 'Site Engineer',
    uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'AVT-4',
    label: 'Supervisor Pro',
    uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'AVT-5',
    label: 'Safety Lead',
    uri: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  },
];

export const AVAILABLE_LANGUAGES = [
  { code: 'en-US', name: 'English (United States)', flag: '🇺🇸', native: 'English' },
  { code: 'es-ES', name: 'Spanish (Español)', flag: '🇪🇸', native: 'Español' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)', flag: '🇮🇳', native: 'हिन्दी' },
  { code: 'fr-FR', name: 'French (Français)', flag: '🇫🇷', native: 'Français' },
  { code: 'de-DE', name: 'German (Deutsch)', flag: '🇩🇪', native: 'Deutsch' },
];

export const INITIAL_USER_PROFILE = {
  id: 'WRK-8924',
  employeeId: 'EMP-8924-ST',
  name: 'Marcus Vance',
  email: 'marcus.vance@structuramad.com',
  phone: '+1 (555) 782-9014',
  role: 'Lead Structural Specialist',
  department: 'Quality Assurance & Civil Works',
  site: 'Skyline Commercial Tower',
  company: 'Apex Build Corp.',
  address: '742 Skyline Way, Suite 4B, Metro District',
  emergencyContact: 'Sarah Vance (+1 555-903-4412, Spouse)',
  avatar: AVATAR_OPTIONS[0].uri,
  avatarInitials: 'MV',
  dateJoined: 'March 14, 2022',
};

export const INITIAL_NOTIFICATION_PREFERENCES = {
  pushNotifications: true,
  shiftReminders: true,
  inventoryAlerts: true,
  reportUpdates: true,
  safetyBulletins: true,
  soundVibration: true,
};

export const APP_METADATA = {
  name: 'Structura MAD',
  fullName: 'Mobile Architecture & Development (MAD)',
  version: '2.4.0',
  build: '2026.11-PROD',
  releaseChannel: 'Production Fleet',
  framework: 'Expo SDK 58 / React Native 0.88',
  copyright: '© 2026 Structura Technologies Ltd. All rights reserved.',
};

export const PRIVACY_POLICY_TEXT = [
  {
    title: '1. Field Telemetry & Data Collection',
    body: 'Structura MAD records daily construction reports, attendance logs, and material consumption entries strictly for structural verification, payroll processing, and quality audits.',
  },
  {
    title: '2. Site Location & Device Access',
    body: 'When clocking into shifts or submitting site inspections, verified site coordinates may be referenced to confirm physical on-site presence. No continuous background tracking is performed outside shift hours.',
  },
  {
    title: '3. Data Security & Encryption',
    body: 'All inspection photographs, engineering documents, and personal records are encrypted in transit and in storage according to industrial compliance standards.',
  },
  {
    title: '4. Worker Data Rights',
    body: 'Personnel may request access, corrections, or updates to their personal and employment records at any time through their designated project superintendent.',
  },
];

export const TERMS_AND_CONDITIONS_TEXT = [
  {
    title: '1. Operational Site Compliance',
    body: 'By utilizing Structura MAD, personnel agree to submit accurate shift check-ins, authentic material usage logs, and genuine field photographs in accordance with site safety regulations.',
  },
  {
    title: '2. Document Authenticity',
    body: 'All uploaded engineering certifications, laboratory test reports, and quality inspection sign-offs must be genuine, unaltered, and adhere to the strict 10 MB file size limit.',
  },
  {
    title: '3. System Access & Credential Safety',
    body: 'Workers are responsible for maintaining the confidentiality of their session access and must report any unauthorized access attempts to project administrators immediately.',
  },
  {
    title: '4. Enterprise Work Orders',
    body: 'All material deduction transactions recorded through the application are legally binding representations of project inventory consumption.',
  },
];

class SettingsService {
  constructor() {
    this.userProfile = { ...INITIAL_USER_PROFILE };
    this.notificationPreferences = { ...INITIAL_NOTIFICATION_PREFERENCES };
    this.selectedLanguage = AVAILABLE_LANGUAGES[0];
  }

  getUserProfile() {
    return { ...this.userProfile };
  }

  updateUserProfile(updatedData) {
    const validation = this.validateProfile(updatedData);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Generate initials from name
    const parts = (updatedData.name || this.userProfile.name).trim().split(' ');
    const initials = parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : (parts[0] ? parts[0].slice(0, 2).toUpperCase() : 'MV');

    this.userProfile = {
      ...this.userProfile,
      ...updatedData,
      avatarInitials: initials,
    };

    return { ...this.userProfile };
  }

  syncWithAuthUser(user) {
    if (!user) return;
    const parts = (user.name || '').trim().split(' ');
    const initials = parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : (parts[0] ? parts[0].slice(0, 2).toUpperCase() : 'SA');

    this.userProfile = {
      ...this.userProfile,
      name: user.name || this.userProfile.name,
      email: user.email || this.userProfile.email,
      role: user.role || this.userProfile.role,
      phone: user.phone || this.userProfile.phone,
      company: user.company || this.userProfile.company,
      avatarInitials: initials,
    };
  }

  validateProfile(data) {
    if (!data.name || data.name.trim().length < 2) {
      return { isValid: false, error: 'Full name must contain at least 2 characters.' };
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      return { isValid: false, error: 'Please enter a valid email address.' };
    }

    const digitsOnlyPhone = (data.phone || '').replace(/\D/g, '');
    if (digitsOnlyPhone.length < 7) {
      return { isValid: false, error: 'Phone number must contain at least 7 digits.' };
    }

    if (!data.address || data.address.trim().length < 5) {
      return { isValid: false, error: 'Residential address must contain at least 5 characters.' };
    }

    if (!data.emergencyContact || data.emergencyContact.trim().length < 5) {
      return { isValid: false, error: 'Please enter a valid emergency contact name and phone.' };
    }

    return { isValid: true, error: null };
  }

  validatePasswordChange(currentPassword, newPassword, confirmPassword) {
    if (!currentPassword || !currentPassword.trim()) {
      return { isValid: false, error: 'Please enter your current password.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { isValid: false, error: 'New password must contain at least 6 characters.' };
    }

    if (newPassword !== confirmPassword) {
      return { isValid: false, error: 'New password and confirmation password do not match.' };
    }

    if (currentPassword === newPassword) {
      return { isValid: false, error: 'New password must be different from your current password.' };
    }

    return { isValid: true, error: null };
  }

  getNotificationPreferences() {
    return { ...this.notificationPreferences };
  }

  updateNotificationPreferences(newPreferences) {
    this.notificationPreferences = {
      ...this.notificationPreferences,
      ...newPreferences,
    };
    return { ...this.notificationPreferences };
  }

  getAvailableLanguages() {
    return AVAILABLE_LANGUAGES;
  }

  getSelectedLanguage() {
    return this.selectedLanguage;
  }

  setLanguage(languageCode) {
    const found = AVAILABLE_LANGUAGES.find((l) => l.code === languageCode);
    if (found) {
      this.selectedLanguage = found;
    }
    return this.selectedLanguage;
  }

  getAvatarOptions() {
    return AVATAR_OPTIONS;
  }

  getAppMetadata() {
    return APP_METADATA;
  }
}

export const settingsService = new SettingsService();
