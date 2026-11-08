import React from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { formatTime12 } from '../../services/attendanceService';

export default function DayDetailsModal({
  visible,
  onClose,
  dayInfo,
}) {
  if (!dayInfo) return null;

  const { dateKey, record, status, statusColor } = dayInfo;

  // Format date readable
  let formattedDate = dateKey || '';
  if (dateKey && typeof dateKey === 'string' && dateKey.includes('-')) {
    const [year, month, day] = dateKey.split('-').map(Number);
    if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
      const d = new Date(year, month - 1, day);
      if (!Number.isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
      }
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case 'OVERTIME':
        return `Overtime (${record?.overtimeDuration ? `+${record.overtimeDuration}` : 'Approved'})`;
      case 'PRESENT':
        return 'Present (On-Time)';
      case 'LATE':
        return 'Late Arrival';
      case 'HALF_DAY':
        return 'Half Day Shift';
      case 'ON_LEAVE':
        return 'Approved Medical Leave';
      case 'ABSENT':
        return 'Unexcused Absence';
      case 'REST_DAY':
        return 'Weekend Rest Day';
      default:
        return 'No Record Logged';
    }
  };

  const hasOvertime = Boolean(record?.hasOvertime || (record?.overtimeMinutes && record.overtimeMinutes > 0));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-3xl pt-5 pb-8 px-5 border-t border-slate-200"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 items-center justify-center mr-2">
                <Feather name="calendar" size={17} color="#172B4D" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-[#172B4D]" numberOfLines={1}>
                  {formattedDate}
                </Text>
                <Text className="text-[10px] text-slate-400 font-medium">
                  Authoritative Attendance & Overtime Record
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Feather name="x" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Status Badge Row */}
          <View className="flex-row items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3.5">
            <Text className="text-xs font-semibold text-slate-700">
              Shift Attendance Status:
            </Text>
            <View
              className="px-2.5 py-1 rounded-full border"
              style={{
                backgroundColor: `${statusColor || '#64748B'}15`,
                borderColor: `${statusColor || '#64748B'}40`,
              }}
            >
              <Text
                style={{ color: statusColor || '#172B4D' }}
                className="text-xs font-bold"
              >
                {getStatusTitle()}
              </Text>
            </View>
          </View>

          {/* Shift & Time Details */}
          {status !== 'REST_DAY' && (
            <View className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-semibold text-slate-500">
                  Assigned Shift:
                </Text>
                <Text className="text-xs font-bold text-[#172B4D]">
                  {record?.shiftName || 'Standard Day Shift (08:00 AM – 05:00 PM)'}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-semibold text-slate-500">
                  Check-In Time:
                </Text>
                <Text className="text-xs font-black text-[#172B4D]">
                  {formatTime12(record?.checkIn)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-semibold text-slate-500">
                  Check-Out Time:
                </Text>
                <Text className="text-xs font-black text-[#172B4D]">
                  {formatTime12(record?.checkOut)}
                </Text>
              </View>

              {/* Working Hours Separation */}
              <View className="mt-2 pt-2 border-t border-slate-200/70">
                <View className="flex-row items-center justify-between mb-1.5">
                  <Text className="text-xs font-semibold text-slate-600">
                    Regular Working Hours:
                  </Text>
                  <Text className="text-xs font-black text-[#172B4D]">
                    {record?.regularDuration || record?.duration || '0h 0m'}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="flex-row items-center">
                    <Text className="text-xs font-semibold text-slate-600 mr-1">
                      Overtime Hours:
                    </Text>
                    {hasOvertime && (
                      <Feather name="zap" size={11} color="#F97316" />
                    )}
                  </View>
                  <Text
                    className={`text-xs font-black ${
                      hasOvertime ? 'text-[#F97316]' : 'text-slate-500'
                    }`}
                  >
                    {record?.overtimeDuration || '0h 0m'}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between pt-1.5 border-t border-slate-200/50">
                  <Text className="text-xs font-bold text-[#172B4D]">
                    Total Working Hours:
                  </Text>
                  <Text className="text-sm font-black text-emerald-700">
                    {record?.totalDuration || record?.duration || '0h 0m'}
                  </Text>
                </View>
              </View>

              {/* Overtime Notification Pill if applicable */}
              {hasOvertime && (
                <View className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex-row items-center mt-3">
                  <Feather name="zap" size={13} color="#D97706" />
                  <Text className="text-[11px] font-bold text-amber-900 ml-2 flex-1">
                    Automatic Overtime Verified: +{record?.overtimeDuration} added to payroll records
                  </Text>
                </View>
              )}
            </View>
          )}

          {status === 'REST_DAY' && (
            <View className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 items-center justify-center">
              <Feather name="coffee" size={24} color="#94A3B8" />
              <Text className="text-xs text-slate-600 font-medium mt-1.5 text-center">
                Official Scheduled Rest Day. Zero shift requirements.
              </Text>
            </View>
          )}

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.8}
            className="w-full bg-[#172B4D] rounded-xl py-3.5 items-center justify-center shadow-sm"
          >
            <Text className="text-xs font-bold text-white uppercase tracking-wider">
              Done
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
