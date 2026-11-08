import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

/**
 * Section 4: Attendance Overview
 * Displays Present, Absent, and On Leave counts with a link to the Attendance screen.
 */
export default function AttendanceOverviewCard({
  attendance,
  onNavigateToAttendance,
}) {
  const {
    present = 0,
    absent = 0,
    onLeave = 0,
    total = 0,
    shift = 'Day Shift (07:00 AM – 04:00 PM)',
    attendanceRate = '0%',
  } = attendance || {};

  const handleNavigate = () => {
    if (onNavigateToAttendance) {
      onNavigateToAttendance();
    } else {
      router.push('/(tabs)/attendance');
    }
  };

  const presentPercent = total > 0 ? (present / total) * 100 : 0;
  const absentPercent = total > 0 ? (absent / total) * 100 : 0;
  const leavePercent = total > 0 ? (onLeave / total) * 100 : 0;

  return (
    <View className="mb-5">
      <View className="flex-row items-center justify-between mb-2.5">
        <Text className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
          Attendance Overview
        </Text>
        <TouchableOpacity
          onPress={handleNavigate}
          activeOpacity={0.7}
          className="flex-row items-center"
        >
          <Text className="text-xs font-bold text-[#F97316] mr-1">
            Open Attendance
          </Text>
          <Feather name="arrow-right" size={13} color="#F97316" />
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        {/* Header: Shift and Rate Badge */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 items-center justify-center mr-2">
              <Feather name="user-check" size={15} color="#10B981" />
            </View>
            <View>
              <Text className="text-xs font-bold text-[#172B4D]">
                Today&apos;s Site Rollcall
              </Text>
              <Text className="text-[11px] text-slate-400 font-medium" numberOfLines={1}>
                {shift}
              </Text>
            </View>
          </View>

          <View className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <Text className="text-[11px] font-bold text-emerald-700">
              {attendanceRate} Present
            </Text>
          </View>
        </View>

        {/* 3 Metrics: Present, Absent, On Leave */}
        <View className="flex-row items-center justify-between py-2.5 bg-slate-50/70 rounded-lg border border-slate-100 px-3 mb-3">
          {/* Present */}
          <View className="items-center flex-1">
            <View className="flex-row items-center mb-0.5">
              <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
              <Text className="text-base font-black text-[#172B4D]">
                {present}
              </Text>
            </View>
            <Text className="text-[11px] font-semibold text-slate-500">
              Present
            </Text>
          </View>

          <View className="w-[1px] h-6 bg-slate-200" />

          {/* Absent */}
          <View className="items-center flex-1">
            <View className="flex-row items-center mb-0.5">
              <View className="w-2 h-2 rounded-full bg-red-500 mr-1.5" />
              <Text className="text-base font-black text-[#172B4D]">
                {absent}
              </Text>
            </View>
            <Text className="text-[11px] font-semibold text-slate-500">
              Absent
            </Text>
          </View>

          <View className="w-[1px] h-6 bg-slate-200" />

          {/* On Leave */}
          <View className="items-center flex-1">
            <View className="flex-row items-center mb-0.5">
              <View className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
              <Text className="text-base font-black text-[#172B4D]">
                {onLeave}
              </Text>
            </View>
            <Text className="text-[11px] font-semibold text-slate-500">
              On Leave
            </Text>
          </View>
        </View>

        {/* Multi-segment Ratio Bar */}
        <View className="w-full h-2 rounded-full overflow-hidden flex-row mb-3 bg-slate-100">
          <View
            style={{ width: `${presentPercent}%` }}
            className="h-full bg-emerald-500"
          />
          <View
            style={{ width: `${absentPercent}%` }}
            className="h-full bg-red-500"
          />
          <View
            style={{ width: `${leavePercent}%` }}
            className="h-full bg-amber-500"
          />
        </View>

        {/* Link Button to Attendance Screen */}
        <TouchableOpacity
          onPress={handleNavigate}
          activeOpacity={0.7}
          className="w-full py-2.5 bg-slate-50 border border-slate-200 rounded-lg flex-row items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="View full attendance screen"
        >
          <Feather name="calendar" size={14} color="#172B4D" />
          <Text className="text-xs font-bold text-[#172B4D] ml-2">
            View Worker Attendance Logs
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
