import React from 'react';
import { Feather } from '@expo/vector-icons';

/**
 * Tab icon resolver for Structura construction-management navigation.
 * Uses Feather from @expo/vector-icons for consistent, clean 2px stroke icons:
 * 1. Dashboard  -> 'home'
 * 2. Report     -> 'file-text'
 * 3. Attendance -> 'user-check'
 * 4. Inventory  -> 'package'
 * 5. Settings   -> 'settings'
 */
export function getTabIcon(routeName, color, size = 20) {
  switch (routeName.toLowerCase()) {
    case 'index':
    case 'dashboard':
      return <Feather name="home" size={size} color={color} />;
    case 'reports':
    case 'report':
      return <Feather name="file-text" size={size} color={color} />;
    case 'attendance':
      return <Feather name="user-check" size={size} color={color} />;
    case 'inventory':
      return <Feather name="package" size={size} color={color} />;
    case 'settings':
      return <Feather name="settings" size={size} color={color} />;
    default:
      return <Feather name="grid" size={size} color={color} />;
  }
}
