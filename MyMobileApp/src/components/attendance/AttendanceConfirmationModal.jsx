import React from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { formatTime12 } from '../../services/attendanceService';

export default function AttendanceConfirmationModal({
  visible,
  onClose,
  type = 'CHECK_IN', // 'CHECK_IN' or 'CHECK_OUT'
  record,
}) {
  if (!record) return null;

  const isCheckIn = type === 'CHECK_IN';
  const hasOvertime = Boolean(
    record?.hasOvertime || (record?.overtimeMinutes && record.overtimeMinutes > 0)
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-center items-center px-5" onPress={onClose}>
        <Pressable
          className="w-full bg-white rounded-2xl p-5 border border-slate-200 shadow-lg"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Success Icon */}
          <View className="items-center mb-3">
            <View
              className={`w-14 h-14 rounded-full items-center justify-center mb-2 border ${
                isCheckIn
                  ? 'bg-emerald-50 border-emerald-200'
                  : hasOvertime
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <Feather
                name={isCheckIn ? 'check-circle' : hasOvertime ? 'zap' : 'log-out'}
                size={28}
                color={isCheckIn ? '#10B981' : hasOvertime ? '#F97316' : '#172B4D'}
              />
            </View>

            <Text className="text-base font-black text-[#172B4D] text-center">
              {isCheckIn
                ? 'Shift Check-In Confirmed'
                : hasOvertime
                ? 'Check-Out & Overtime Logged'
                : 'Shift Check-Out Confirmed'}
            </Text>
            <Text className="text-xs text-slate-500 font-medium text-center mt-0.5">
              Authoritative Server Record Created
            </Text>
          </View>

          {/* Details Card */}
          <View className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-semibold text-slate-500">
                Worker Name:
              </Text>
              <Text className="text-xs font-bold text-[#172B4D]">
                {record.workerName}
              </Text>
            </View>

            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-semibold text-slate-500">
                {isCheckIn ? 'Check-In Timestamp:' : 'Check-Out Timestamp:'}
              </Text>
              <Text className="text-xs font-black text-[#172B4D]">
                {isCheckIn
                  ? formatTime12(record.checkIn)
                  : formatTime12(record.checkOut)}
              </Text>
            </View>

            {isCheckIn && record.arrivalStatus && (
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-semibold text-slate-500">
                  Arrival Status:
                </Text>
                <View
                  className="px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: `${record.arrivalStatus.color}20`,
                    borderColor: `${record.arrivalStatus.color}60`,
                  }}
                >
                  <Text
                    style={{ color: record.arrivalStatus.color }}
                    className="text-[11px] font-bold"
                  >
                    {record.arrivalStatus.label}
                  </Text>
                </View>
              </View>
            )}

            {!isCheckIn && (
              <>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-xs font-semibold text-slate-500">
                    Regular Hours:
                  </Text>
                  <Text className="text-xs font-black text-[#172B4D]">
                    {record.regularDuration || record.duration || '0h 0m'}
                  </Text>
                </View>

                {hasOvertime && (
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-xs font-semibold text-[#F97316]">
                      Overtime Logged:
                    </Text>
                    <View className="bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full flex-row items-center">
                      <Feather name="zap" size={10} color="#D97706" />
                      <Text className="text-xs font-black text-[#F97316] ml-1">
                        +{record.overtimeDuration}
                      </Text>
                    </View>
                  </View>
                )}

                <View className="flex-row items-center justify-between mb-2 pt-1.5 border-t border-slate-200/60">
                  <Text className="text-xs font-bold text-[#172B4D]">
                    Total Working Hours:
                  </Text>
                  <Text className="text-xs font-black text-emerald-700">
                    {record.totalDuration || record.duration}
                  </Text>
                </View>
              </>
            )}

            <View className="flex-row items-center justify-between pt-1">
              <Text className="text-xs font-semibold text-slate-500">
                Site Geofence:
              </Text>
              <Text className="text-[11px] font-semibold text-[#172B4D]">
                {record.siteLocation || 'Skyline Tower'}
              </Text>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.8}
            className="w-full bg-[#172B4D] rounded-xl py-3.5 items-center justify-center shadow-sm"
          >
            <Text className="text-xs font-bold text-white uppercase tracking-wider">
              Acknowledge & Continue
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
