import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * Section 7: Recent Activities
 * Displays recent project updates, attendance records, inventory updates, and reports.
 * Includes interactive category filter chips.
 */
export default function RecentActivities({ activities = [] }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Projects', 'Attendance', 'Inventory', 'Reports'];

  const filteredActivities =
    activeFilter === 'All'
      ? activities
      : activities.filter((act) => act.category === activeFilter);

  const getCategoryTheme = (category) => {
    switch (category) {
      case 'Projects':
        return {
          icon: 'briefcase',
          color: '#172B4D',
          badgeBg: 'bg-blue-50',
          badgeBorder: 'border-blue-200',
          badgeText: 'text-[#172B4D]',
        };
      case 'Attendance':
        return {
          icon: 'users',
          color: '#10B981',
          badgeBg: 'bg-emerald-50',
          badgeBorder: 'border-emerald-200',
          badgeText: 'text-emerald-700',
        };
      case 'Inventory':
        return {
          icon: 'package',
          color: '#D97706',
          badgeBg: 'bg-amber-50',
          badgeBorder: 'border-amber-200',
          badgeText: 'text-amber-800',
        };
      case 'Reports':
        return {
          icon: 'file-text',
          color: '#F97316',
          badgeBg: 'bg-orange-50',
          badgeBorder: 'border-orange-200',
          badgeText: 'text-[#F97316]',
        };
      default:
        return {
          icon: 'activity',
          color: '#6B778C',
          badgeBg: 'bg-slate-50',
          badgeBorder: 'border-slate-200',
          badgeText: 'text-slate-600',
        };
    }
  };

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-2.5">
        <Text className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
          Recent Activities
        </Text>
        <Text className="text-[11px] text-slate-400 font-medium">
          {filteredActivities.length} Logs
        </Text>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row items-center flex-wrap mb-3">
        {categories.map((cat) => {
          const isSelected = activeFilter === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveFilter(cat)}
              activeOpacity={0.7}
              className={`mr-2 mb-1.5 px-3 py-1 rounded-full border ${
                isSelected
                  ? 'bg-[#172B4D] border-[#172B4D]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text
                className={`text-[11px] font-bold ${
                  isSelected ? 'text-white' : 'text-slate-600'
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Activity Card Container */}
      <View className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        {filteredActivities.length === 0 ? (
          <View className="py-6 items-center justify-center">
            <Feather name="inbox" size={24} color="#94A3B8" />
            <Text className="text-xs text-slate-400 font-medium mt-1.5">
              No recent updates in this category.
            </Text>
          </View>
        ) : (
          filteredActivities.map((act, index) => {
            const theme = getCategoryTheme(act.category);
            const isLast = index === filteredActivities.length - 1;

            return (
              <View
                key={act.id || index}
                className={`py-3 ${!isLast ? 'border-b border-slate-100' : ''}`}
              >
                {/* Header Row: Title & Category Pill */}
                <View className="flex-row items-start justify-between mb-1">
                  <View className="flex-row items-center flex-1 mr-2">
                    <View
                      className={`w-6 h-6 rounded-md items-center justify-center border mr-2 ${theme.badgeBg} ${theme.badgeBorder}`}
                    >
                      <Feather name={theme.icon} size={12} color={theme.color} />
                    </View>
                    <Text
                      className="text-xs font-bold text-[#172B4D] flex-1"
                      numberOfLines={1}
                    >
                      {act.title}
                    </Text>
                  </View>

                  <View
                    className={`px-1.5 py-0.5 rounded border ${theme.badgeBg} ${theme.badgeBorder}`}
                  >
                    <Text className={`text-[9px] font-bold uppercase ${theme.badgeText}`}>
                      {act.category}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text
                  className="text-xs text-slate-600 font-normal leading-relaxed mb-1.5 pl-8"
                  numberOfLines={2}
                >
                  {act.description}
                </Text>

                {/* Footer: Author & Timestamp */}
                <View className="flex-row items-center justify-between pl-8">
                  <Text className="text-[10px] font-semibold text-slate-500">
                    {act.author} • {act.tag}
                  </Text>
                  <View className="flex-row items-center">
                    <Feather name="clock" size={10} color="#94A3B8" />
                    <Text className="text-[10px] text-slate-400 ml-1">
                      {act.timestamp}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}
