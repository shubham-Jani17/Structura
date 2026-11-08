import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from '../components/SplashScreen';
import { AuthProvider } from '../context/AuthContext';
import '../global.css';

/**
 * Root Layout managing the exact 2-second startup splash screen sequence.
 *
 * Expected behavior:
 * 1. App Launch: Render ONLY the Structura logo SplashScreen.
 * 2. Home Screen and bottom navigation are NOT rendered or mounted during splash.
 * 3. After exactly 2 seconds: SplashScreen completely unmounts.
 * 4. Home Screen + Bottom Navigation mounts cleanly.
 * 5. Splash screen and Home Screen are NEVER visible simultaneously.
 * 6. Never re-renders the splash animation during normal tab navigation.
 */
export default function RootLayout() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashComplete(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 1. Startup phase: Render ONLY the splash screen
  if (!isSplashComplete) {
    return (
      <View style={styles.rootContainer} className="flex-1 bg-white">
        <SplashScreen />
      </View>
    );
  }

  // 2. Post-splash phase: Render Home Screen and navigation only after splash unmounts
  return (
    <AuthProvider>
      <View style={styles.rootContainer} className="flex-1 bg-white">
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <Slot />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
});
