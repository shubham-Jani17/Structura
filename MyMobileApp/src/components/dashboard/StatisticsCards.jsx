import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * Section 2: Statistics Cards
 * Displays four core metrics:
 * 1. Total Projects
 * 2. Active Projects
 * 3. Total Workers
 * 4. Pending Tasks
 */
export default function StatisticsCards({
  statistics,
  onPressProjects,
  onPressActive,
  onPressWorkers,
  onPressTasks,
}) {
  const {
    totalProjects = 0,
    activeProjects = 0,
    totalWorkers = 0,
    pendingTasks = 0,
  } = statistics || {};

  return (
    <View className="mb-5">
      <View className="flex-row items-center justify-between mb-2.5">
        <Text className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
          Operations Overview
        </Text>
        <Text className="text-[11px] text-slate-400 font-medium">
          Live Metrics
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {/* 1. Total Projects */}
        <TouchableOpacity
          onPress={onPressProjects}
          activeOpacity={0.7}
          className="w-[48.5%] bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm mb-3"
          accessibilityRole="button"
          accessibilityLabel={`Total Projects: ${totalProjects}`}
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 items-center justify-center">
              <Feather name="folder" size={16} color="#172B4D" />
            </View>
            <View className="bg-slate-100 px-1.5 py-0.5 rounded">
              <Text className="text-[10px] font-semibold text-slate-600">
                Portfolio
              </Text>
            </View>
          </View>
          <Text className="text-2xl font-black text-[#172B4D] tracking-tight">
            {totalProjects}
          </Text>
          <Text className="text-xs font-semibold text-slate-700 mt-0.5">
            Total Projects
          </Text>
          <Text className="text-[10px] text-slate-400 mt-1 font-medium">
            Managed sites
          </Text>
        </TouchableOpacity>

        {/* 2. Active Projects */}
        <TouchableOpacity
          onPress={onPressActive}
          activeOpacity={0.7}
          className="w-[48.5%] bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm mb-3"
          accessibilityRole="button"
          accessibilityLabel={`Active Projects: ${activeProjects}`}
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 items-center justify-center">
              <Feather name="activity" size={16} color="#F97316" />
            </View>
            <View className="bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded">
              <Text className="text-[10px] font-bold text-[#F97316]">
                Ongoing
              </Text>
            </View>
          </View>
          <Text className="text-2xl font-black text-[#172B4D] tracking-tight">
            {activeProjects}
          </Text>
          <Text className="text-xs font-semibold text-slate-700 mt-0.5">
            Active Projects
          </Text>
          <Text className="text-[10px] text-slate-400 mt-1 font-medium">
            Under construction
          </Text>
        </TouchableOpacity>

        {/* 3. Total Workers */}
        <TouchableOpacity
          onPress={onPressWorkers}
          activeOpacity={0.7}
          className="w-[48.5%] bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm"
          accessibilityRole="button"
          accessibilityLabel={`Total Workers: ${totalWorkers}`}
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 items-center justify-center">
              <Feather name="users" size={16} color="#10B981" />
            </View>
            <View className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              <Text className="text-[10px] font-bold text-emerald-700">
                Staffed
              </Text>
            </View>
          </View>
          <Text className="text-2xl font-black text-[#172B4D] tracking-tight">
            {totalWorkers}
          </Text>
          <Text className="text-xs font-semibold text-slate-700 mt-0.5">
            Total Workers
          </Text>
          <Text className="text-[10px] text-slate-400 mt-1 font-medium">
            Across all sites
          </Text>
        </TouchableOpacity>

        {/* 4. Pending Tasks */}
        <TouchableOpacity
          onPress={onPressTasks}
          activeOpacity={0.7}
          className="w-[48.5%] bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm"
          accessibilityRole="button"
          accessibilityLabel={`Pending Tasks: ${pendingTasks}`}
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 items-center justify-center">
              <Feather name="clock" size={16} color="#EF4444" />
            </View>
            <View className="bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
              <Text className="text-[10px] font-bold text-red-600">
                Urgent
              </Text>
            </View>
          </View>
          <Text className="text-2xl font-black text-[#172B4D] tracking-tight">
            {pendingTasks}
          </Text>
          <Text className="text-xs font-semibold text-slate-700 mt-0.5">
            Pending Tasks
          </Text>
          <Text className="text-[10px] text-slate-400 mt-1 font-medium">
            Due this week
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
