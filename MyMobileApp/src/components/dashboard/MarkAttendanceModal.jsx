import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function MarkAttendanceModal({
  visible,
  onClose,
  attendance,
  onConfirmAttendance,
}) {
  const [markedCount, setMarkedCount] = useState(5);
  const [shift, setShift] = useState('Day Shift (07:00 AM – 04:00 PM)');

  const handleMark = () => {
    onConfirmAttendance(markedCount);
    onClose();
  };

  const handleOpenFullAttendance = () => {
    onClose();
    router.push('/(tabs)/attendance');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-3xl pt-5 pb-8 px-5 border-t border-slate-200"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 items-center justify-center mr-2">
                <Feather name="check-square" size={17} color="#10B981" />
              </View>
              <Text className="text-base font-bold text-[#172B4D]">
                Mark Shift Attendance
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
            >
              <Feather name="x" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Current Rollcall Summary & Shift Selector */}
          <View className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-semibold text-slate-700">
                Active Rollcall Shift
              </Text>
              <Text className="text-[11px] font-bold text-emerald-700">
                {attendance?.attendanceRate || '83%'} Logged
              </Text>
            </View>

            <View className="flex-row space-x-2">
              {['Day Shift (07:00 AM – 04:00 PM)', 'Night Shift (07:00 PM – 04:00 AM)'].map((s) => {
                const isSelected = shift === s;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setShift(s)}
                    activeOpacity={0.7}
                    className={`flex-1 py-1.5 px-2 rounded-lg border mr-1.5 ${
                      isSelected
                        ? 'bg-[#172B4D] border-[#172B4D]'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-semibold text-center ${
                        isSelected ? 'text-white' : 'text-slate-600'
                      }`}
                      numberOfLines={1}
                    >
                      {s.includes('Day') ? '☀️ Day Shift' : '🌙 Night Shift'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Quick Increment Option */}
          <View className="mb-4">
            <Text className="text-xs font-semibold text-slate-700 mb-2">
              Quick Log Arrived Workers:
            </Text>
            <View className="flex-row space-x-2">
              {[1, 5, 10, 20].map((num) => {
                const isSelected = markedCount === num;
                return (
                  <TouchableOpacity
                    key={num}
                    onPress={() => setMarkedCount(num)}
                    activeOpacity={0.7}
                    className={`flex-1 py-2 rounded-xl items-center justify-center border mr-2 ${
                      isSelected
                        ? 'bg-[#172B4D] border-[#172B4D]'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-white' : 'text-slate-700'
                      }`}
                    >
                      +{num}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            onPress={handleMark}
            activeOpacity={0.8}
            className="w-full bg-[#10B981] rounded-xl py-3.5 items-center justify-center mb-2.5 shadow-sm"
          >
            <Text className="text-xs font-bold text-white uppercase tracking-wider">
              Confirm +{markedCount} Present Workers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleOpenFullAttendance}
            activeOpacity={0.7}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 items-center justify-center"
          >
            <Text className="text-xs font-semibold text-[#172B4D]">
              Open Full Attendance Roster & Rosters
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
