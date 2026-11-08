import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * Worker Attendance Header
 * Displays welcome message, worker profile, current date, and live ticking clock.
 */
export default function WorkerAttendanceHeader({ worker }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live ticking clock updating every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedClock = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <View className="mb-4">
      {/* Top Welcome Title & Live Clock */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1 mr-2">
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Structura Site Attendance
          </Text>
          <Text className="text-xl font-black text-[#172B4D] tracking-tight">
            Worker Check-in Portal
          </Text>
        </View>

        {/* Live Clock Card */}
        <View className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl items-end shadow-sm">
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            <Text className="text-xs font-black text-[#172B4D] font-mono tracking-wider">
              {formattedClock}
            </Text>
          </View>
          <Text className="text-[10px] text-slate-500 font-medium mt-0.5">
            {formattedDate}
          </Text>
        </View>
      </View>

      {/* Worker Profile Card */}
      <View className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex-row items-center">
        {/* Avatar */}
        <View className="w-12 h-12 rounded-xl bg-[#172B4D] items-center justify-center mr-3 shadow-sm">
          <Text className="text-base font-bold text-white tracking-wider">
            {worker?.avatarInitials || 'WR'}
          </Text>
        </View>

        {/* Worker Details */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-[#172B4D]">
              {worker?.name}
            </Text>
            <View className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
              <Text className="text-[10px] font-bold text-slate-600">
                {worker?.id}
              </Text>
            </View>
          </View>

          <Text className="text-xs text-[#F97316] font-semibold mt-0.5" numberOfLines={1}>
            {worker?.trade}
          </Text>

          <View className="flex-row items-center mt-1">
            <Feather name="map-pin" size={11} color="#6B778C" />
            <Text className="text-[11px] text-slate-500 font-medium ml-1 flex-1" numberOfLines={1}>
              {worker?.site}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
