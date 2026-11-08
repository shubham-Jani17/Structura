import React, { useState } from 'react';
import { View, Text, Switch, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { settingsService } from '../../services/settingsService';

export default function NotificationPreferencesSection() {
  const [preferences, setPreferences] = useState(() =>
    settingsService.getNotificationPreferences()
  );

  const togglePreference = (key) => {
    const updated = {
      ...preferences,
      [key]: !preferences[key],
    };
    setPreferences(updated);
    settingsService.updateNotificationPreferences(updated);
  };

  const notificationItems = [
    {
      key: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Receive real-time mobile push notifications for urgent site operations.',
      icon: 'bell',
    },
    {
      key: 'shiftReminders',
      title: 'Shift & Attendance Reminders',
      description: 'Automated 15-minute alerts prior to assigned shift check-in and check-out.',
      icon: 'clock',
    },
    {
      key: 'inventoryAlerts',
      title: 'Inventory Stock Alerts',
      description: 'Immediate warnings when construction materials fall below minimum threshold.',
      icon: 'package',
    },
    {
      key: 'reportUpdates',
      title: 'Daily Site Report Status',
      description: 'Notifications when submitted engineering reports are approved or inspected.',
      icon: 'file-text',
    },
    {
      key: 'soundVibration',
      title: 'Sound & Vibration',
      description: 'Trigger audible tones and haptic alerts for critical safety broadcasts.',
      icon: 'volume-2',
    },
  ];

  return (
    <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <View className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 items-center justify-center mr-2.5">
          <Feather name="bell" size={16} color="#F97316" />
        </View>
        <View>
          <Text className="text-sm font-black text-[#172B4D]">
            Notification Preferences
          </Text>
          <Text className="text-[11px] text-slate-400 font-medium">
            Configure mobile alerts and push triggers
          </Text>
        </View>
      </View>

      {/* Switch Items List */}
      <View className="divide-y divide-slate-100">
        {notificationItems.map((item) => (
          <View
            key={item.key}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-start flex-1 mr-3">
              <View className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 items-center justify-center mr-2.5 mt-0.5">
                <Feather name={item.icon} size={14} color="#64748B" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-[#172B4D]">
                  {item.title}
                </Text>
                <Text className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                  {item.description}
                </Text>
              </View>
            </View>

            <Switch
              value={Boolean(preferences[item.key])}
              onValueChange={() => togglePreference(item.key)}
              trackColor={{ false: '#E2E8F0', true: '#F97316' }}
              thumbColor={
                Platform.OS === 'ios'
                  ? '#FFFFFF'
                  : preferences[item.key]
                  ? '#FFFFFF'
                  : '#CBD5E1'
              }
            />
          </View>
        ))}
      </View>
    </View>
  );
}
