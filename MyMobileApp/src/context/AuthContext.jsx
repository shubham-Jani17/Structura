import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({
  isAuthenticated: false,
  currentUser: null,
  login: async () => {},
  signup: async () => {},
  googleSignIn: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => ({
    isAuthenticated: authService.isAuthenticated(),
    currentUser: authService.getCurrentUser(),
  }));

  useEffect(() => {
    // Subscribe to auth state changes from authService
    const unsubscribe = authService.subscribe((state) => {
      setAuthState(state);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password, rememberMe) => {
    return authService.login(email, password, rememberMe);
  };

  const signup = async (formData) => {
    return authService.signup(formData);
  };

  const googleSignIn = async (account) => {
    return authService.googleSignIn(account);
  };

  const logout = () => {
    return authService.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        currentUser: authState.currentUser,
        login,
        signup,
        googleSignIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
