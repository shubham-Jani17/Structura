import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * Section 1: Dashboard Header
 * Displays greeting, current date, profile button, and notifications trigger.
 */
export default function DashboardHeader({
  user,
  unreadCount = 0,
  onOpenNotifications,
  onOpenProfile,
}) {
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View className="mb-5 pt-2">
      <View className="flex-row items-center justify-between">
        {/* Left: Greeting & Date */}
        <View className="flex-1 mr-3">
          <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
            {todayFormatted}
          </Text>
          <Text className="text-2xl font-black text-[#172B4D] tracking-tight">
            Welcome, {user?.name?.split(' ')[0] || 'Manager'}
          </Text>
          <Text className="text-xs text-slate-500 font-medium">
            {user?.role} • {user?.company}
          </Text>
        </View>

        {/* Right: Actions (Notification & Avatar) */}
        <View className="flex-row items-center space-x-2.5">
          {/* Notification Button */}
          <TouchableOpacity
            onPress={onOpenNotifications}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 items-center justify-center relative shadow-sm"
            accessibilityRole="button"
            accessibilityLabel={`Notifications, ${unreadCount} unread`}
          >
            <Feather name="bell" size={19} color="#172B4D" />
            {unreadCount > 0 && (
              <View className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F97316] items-center justify-center border-2 border-white">
                <Text className="text-[9px] font-black text-white leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* User Profile Avatar */}
          <TouchableOpacity
            onPress={onOpenProfile}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-xl bg-[#172B4D] items-center justify-center shadow-sm ml-2"
            accessibilityRole="button"
            accessibilityLabel="Open user profile"
          >
            <Text className="text-sm font-bold text-white tracking-wider">
              {user?.avatarInitials || 'US'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
