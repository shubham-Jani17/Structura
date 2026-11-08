import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * Section 6: Quick Actions
 * 1. Add Project
 * 2. Add Worker
 * 3. Mark Attendance
 * 4. Generate Report
 * 5. Add Inventory Item
 */
export default function QuickActions({
  onAddProject,
  onAddWorker,
  onMarkAttendance,
  onGenerateReport,
  onAddInventory,
}) {
  const actions = [
    {
      id: 'add_project',
      label: 'Add Project',
      icon: 'folder-plus',
      iconColor: '#172B4D',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      onPress: onAddProject,
    },
    {
      id: 'add_worker',
      label: 'Add Worker',
      icon: 'user-plus',
      iconColor: '#0284C7',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-100',
      onPress: onAddWorker,
    },
    {
      id: 'mark_attendance',
      label: 'Mark Rollcall',
      icon: 'check-square',
      iconColor: '#10B981',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      onPress: onMarkAttendance,
    },
    {
      id: 'generate_report',
      label: 'New Report',
      icon: 'file-text',
      iconColor: '#F97316',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100',
      onPress: onGenerateReport,
    },
    {
      id: 'add_inventory',
      label: 'Add Stock',
      icon: 'package',
      iconColor: '#D97706',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      onPress: onAddInventory,
    },
  ];

  return (
    <View className="mb-5">
      <View className="flex-row items-center justify-between mb-2.5">
        <Text className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
          Quick Actions
        </Text>
        <Text className="text-[11px] text-slate-400 font-medium">
          Site Operations
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 4 }}
      >
        {actions.map((act) => (
          <TouchableOpacity
            key={act.id}
            onPress={act.onPress}
            activeOpacity={0.7}
            className="w-24 bg-white rounded-xl p-3 border border-slate-200 shadow-sm mr-2.5 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel={act.label}
          >
            <View
              className={`w-10 h-10 rounded-xl items-center justify-center border mb-2 ${act.bgColor} ${act.borderColor}`}
            >
              <Feather name={act.icon} size={18} color={act.iconColor} />
            </View>
            <Text
              className="text-xs font-bold text-[#172B4D] text-center"
              numberOfLines={1}
            >
              {act.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
