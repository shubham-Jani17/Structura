/**
 * Structura MAD - Authentication Service
 * In-memory state and validation engine for user authentication,
 * reference credentials, user registration, and simulated Google OAuth.
 */

import { settingsService } from './settingsService.js';

export const REFERENCE_USER = {
  id: 'USR-ADMIN-01',
  email: 'admin@structuramad.com',
  password: 'Admin@123',
  name: 'Structura Admin',
  role: 'Administrator',
  company: 'Apex Build Corp.',
  phone: '+1 (555) 019-2834',
  avatarInitials: 'SA',
};

export const MOCK_GOOGLE_ACCOUNTS = [
  {
    id: 'GGL-001',
    name: 'Structura Admin',
    email: 'admin@structuramad.com',
    role: 'Administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    avatarInitials: 'SA',
  },
  {
    id: 'GGL-002',
    name: 'Marcus Vance',
    email: 'marcus.vance@structuramad.com',
    role: 'Lead Structural Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    avatarInitials: 'MV',
  },
  {
    id: 'GGL-003',
    name: 'Alex Mercer',
    email: 'alex.mercer@apexbuild.com',
    role: 'Lead Project Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    avatarInitials: 'AM',
  },
];

class AuthService {
  constructor() {
    this.users = [
      { ...REFERENCE_USER },
      {
        id: 'USR-MARCUS-02',
        email: 'marcus.vance@structuramad.com',
        password: 'Marcus@123',
        name: 'Marcus Vance',
        role: 'Lead Structural Specialist',
        company: 'Apex Build Corp.',
        phone: '+1 (555) 782-9014',
        avatarInitials: 'MV',
      },
    ];

    // Initial session state: Starts unauthenticated on fresh launch
    this.authenticated = false;
    this.currentUser = null;
    this.rememberMe = false;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener({
          isAuthenticated: this.authenticated,
          currentUser: this.currentUser,
        });
      } catch (err) {
        console.error('Auth state listener error:', err);
      }
    }
  }

  isAuthenticated() {
    return this.authenticated;
  }

  getCurrentUser() {
    return this.currentUser ? { ...this.currentUser } : null;
  }

  /**
   * Login with email and password
   */
  async login(email, password, rememberMe = false) {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedPassword = password || '';

    if (!trimmedEmail) {
      throw new Error('Please enter your email address.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address.');
    }

    if (!trimmedPassword) {
      throw new Error('Please enter your password.');
    }

    // Find user in registered list
    const matchedUser = this.users.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (!matchedUser) {
      throw new Error('No account found with this email address.');
    }

    if (matchedUser.password !== trimmedPassword) {
      throw new Error('Incorrect password. Please verify your credentials.');
    }

    // Establish authenticated session
    this.authenticated = true;
    this.currentUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      company: matchedUser.company || 'Apex Build Corp.',
      phone: matchedUser.phone || '',
      avatarInitials: matchedUser.avatarInitials || 'SA',
    };
    this.rememberMe = Boolean(rememberMe);

    try {
      settingsService.syncWithAuthUser(this.currentUser);
    } catch (e) {
      console.warn('Profile sync notice:', e);
    }

    this.notify();
    return { success: true, user: this.currentUser };
  }

  /**
   * Register a new user
   */
  async signup({ name, email, phone, password, confirmPassword, agreeToTerms }) {
    const trimmedName = (name || '').trim();
    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedPhone = (phone || '').trim();
    const trimmedPassword = password || '';
    const trimmedConfirm = confirmPassword || '';

    if (!trimmedName || trimmedName.length < 2) {
      throw new Error('Full Name must be at least 2 characters.');
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address.');
    }

    const digitsOnlyPhone = trimmedPhone.replace(/\D/g, '');
    if (digitsOnlyPhone.length < 7) {
      throw new Error('Please enter a valid phone number (minimum 7 digits).');
    }

    if (!trimmedPassword || trimmedPassword.length < 6) {
      throw new Error('Password must contain at least 6 characters.');
    }

    if (trimmedPassword !== trimmedConfirm) {
      throw new Error('Password and confirmation do not match.');
    }

    if (!agreeToTerms) {
      throw new Error('You must agree to the Terms and Conditions to register.');
    }

    // Check if email already registered
    const existing = this.users.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );
    if (existing) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    // Generate initials
    const parts = trimmedName.split(' ');
    const initials = parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : trimmedName.slice(0, 2).toUpperCase();

    const newUser = {
      id: `USR-${Date.now().toString().slice(-5)}`,
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      password: trimmedPassword,
      role: 'Site Specialist',
      company: 'Apex Build Corp.',
      avatarInitials: initials,
    };

    this.users.push(newUser);

    // Auto sign-in new account
    this.authenticated = true;
    this.currentUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      company: newUser.company,
      phone: newUser.phone,
      avatarInitials: newUser.avatarInitials,
    };

    try {
      settingsService.syncWithAuthUser(this.currentUser);
    } catch (e) {
      console.warn('Profile sync notice:', e);
    }

    this.notify();
    return { success: true, user: this.currentUser };
  }

  /**
   * Simulated Google Sign-In
   */
  async googleSignIn(googleAccount) {
    if (!googleAccount || !googleAccount.email) {
      throw new Error('Invalid Google account selection.');
    }

    // Check if user exists or create a linked account
    let matchedUser = this.users.find(
      (u) => u.email.toLowerCase() === googleAccount.email.toLowerCase()
    );

    if (!matchedUser) {
      matchedUser = {
        id: `USR-GGL-${Date.now().toString().slice(-4)}`,
        name: googleAccount.name || 'Google User',
        email: googleAccount.email,
        password: `GoogleAuth_${Date.now()}`,
        role: googleAccount.role || 'Site Specialist',
        company: 'Apex Build Corp.',
        avatarUrl: googleAccount.avatarUrl || null,
        avatarInitials: googleAccount.avatarInitials || 'GU',
      };
      this.users.push(matchedUser);
    }

    this.authenticated = true;
    this.currentUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      company: matchedUser.company || 'Apex Build Corp.',
      phone: matchedUser.phone || '',
      avatarUrl: matchedUser.avatarUrl || null,
      avatarInitials: matchedUser.avatarInitials || 'GU',
      provider: 'google',
    };

    try {
      settingsService.syncWithAuthUser(this.currentUser);
    } catch (e) {
      console.warn('Profile sync notice:', e);
    }

    this.notify();
    return { success: true, user: this.currentUser };
  }

  /**
   * Request password reset simulation
   */
  async requestPasswordReset(email) {
    const trimmedEmail = (email || '').trim().toLowerCase();

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('Please enter a valid registered email address.');
    }

    // Check if email exists in database
    const matchedUser = this.users.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    // Note: In real production, we return generic success to prevent email enumeration,
    // but in dev simulation we return success with email confirmation
    return {
      success: true,
      email: trimmedEmail,
      message: `Password reset instructions have been dispatched to ${trimmedEmail}. Please check your inbox.`,
      exists: Boolean(matchedUser),
    };
  }

  /**
   * Log out session
   */
  logout() {
    this.authenticated = false;
    this.currentUser = null;
    this.notify();
    return { success: true };
  }

  getReferenceCredentials() {
    return {
      email: REFERENCE_USER.email,
      password: REFERENCE_USER.password,
    };
  }

  getMockGoogleAccounts() {
    return MOCK_GOOGLE_ACCOUNTS;
  }
}

export const authService = new AuthService();
