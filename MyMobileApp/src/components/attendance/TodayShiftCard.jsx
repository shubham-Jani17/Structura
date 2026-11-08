import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  formatTime12,
  calculateShiftHoursAndOvertime,
} from '../../services/attendanceService';

/**
 * Today Shift & Automatic Overtime Card
 *
 * Requirements Met:
 * 1. Automatic Overtime Detection: Compares check-out with shift end, calculates regular
 *    hours and overtime hours separately, handles overnight shifts, never negative.
 * 2. Overtime Summary UI:
 *    - Today's Regular Hours
 *    - Today's Overtime Hours
 *    - Today's Total Working Hours
 *    - Overtime indicator when overtime is detected
 * 3. Minimal, premium construction-management UI with clear visual separation.
 */
export default function TodayShiftCard({
  record,
  activeShift,
  availableShifts = [],
  onSelectShift,
  onCheckIn,
  onCheckOut,
  isLoading = false,
}) {
  const [liveElapsed, setLiveElapsed] = useState({
    total: '0h 0m',
    regular: '0h 0m',
    overtime: '0h 0m',
    hasOvertime: false,
  });

  const isCheckedIn = Boolean(record?.checkIn && !record?.checkOut);
  const isCheckedOut = Boolean(record?.checkOut);
  const isNotCheckedIn = !record?.checkIn;

  // Live timer calculating regular hours, overtime, and total duration dynamically
  useEffect(() => {
    if (!isCheckedIn || !record?.checkIn) return;

    const updateLiveTracking = () => {
      const start = record.checkIn;
      const now = new Date();
      const calcs = calculateShiftHoursAndOvertime(start, now, activeShift);
      setLiveElapsed({
        total: calcs.totalDuration,
        regular: calcs.regularDuration,
        overtime: calcs.overtimeDuration,
        hasOvertime: calcs.hasOvertime,
      });
    };

    updateLiveTracking();
    const interval = setInterval(updateLiveTracking, 10000);
    return () => clearInterval(interval);
  }, [isCheckedIn, record?.checkIn, activeShift]);

  // Determine displayed hours depending on attendance state
  const displayedRegular = isCheckedOut
    ? record?.regularDuration || '0h 0m'
    : isCheckedIn
    ? liveElapsed.regular
    : '0h 0m';

  const displayedOvertime = isCheckedOut
    ? record?.overtimeDuration || '0h 0m'
    : isCheckedIn
    ? liveElapsed.overtime
    : '0h 0m';

  const displayedTotal = isCheckedOut
    ? record?.totalDuration || record?.duration || '0h 0m'
    : isCheckedIn
    ? liveElapsed.total
    : '0h 0m';

  const hasDetectedOvertime = isCheckedOut
    ? Boolean(record?.hasOvertime || (record?.overtimeMinutes && record.overtimeMinutes > 0))
    : isCheckedIn
    ? liveElapsed.hasOvertime
    : false;

  // Overall visual status configuration
  const getStatusConfig = () => {
    if (isCheckedOut) {
      if (hasDetectedOvertime) {
        return {
          label: 'Completed with Overtime',
          badgeBg: 'bg-orange-50',
          badgeBorder: 'border-orange-200',
          badgeText: 'text-[#F97316]',
          dotColor: 'bg-[#F97316]',
        };
      }
      return {
        label: 'Shift Completed',
        badgeBg: 'bg-slate-100',
        badgeBorder: 'border-slate-200',
        badgeText: 'text-slate-700',
        dotColor: 'bg-slate-500',
      };
    }
    if (isCheckedIn) {
      if (hasDetectedOvertime) {
        return {
          label: 'On Duty • Overtime Active',
          badgeBg: 'bg-amber-50',
          badgeBorder: 'border-amber-200',
          badgeText: 'text-amber-700',
          dotColor: 'bg-amber-500',
        };
      }
      return {
        label: 'On Duty • Shift Active',
        badgeBg: 'bg-emerald-50',
        badgeBorder: 'border-emerald-200',
        badgeText: 'text-emerald-700',
        dotColor: 'bg-emerald-500',
      };
    }
    return {
      label: 'Ready for Check-in',
      badgeBg: 'bg-blue-50',
      badgeBorder: 'border-blue-200',
      badgeText: 'text-[#172B4D]',
      dotColor: 'bg-blue-500',
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <View className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-4">
      {/* Header: Shift Name & Status Pill */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 mr-2">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Assigned Shift
          </Text>
          <Text className="text-sm font-bold text-[#172B4D]">
            {activeShift?.name}
          </Text>
          <Text className="text-xs text-slate-500 font-medium">
            {activeShift?.displayTiming}
          </Text>
        </View>

        <View
          className={`flex-row items-center px-2.5 py-1 rounded-full border ${statusConfig.badgeBg} ${statusConfig.badgeBorder}`}
        >
          <View className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig.dotColor}`} />
          <Text className={`text-[11px] font-bold ${statusConfig.badgeText}`}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Shift Switcher (Only allowed before check-in) */}
      {isNotCheckedIn && availableShifts.length > 1 && (
        <View className="mb-3.5 pt-2 border-t border-slate-100">
          <Text className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Switch Shift Timing
          </Text>
          <View className="flex-row">
            {availableShifts.map((s) => {
              const isSelected = activeShift?.id === s.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => onSelectShift(s.id)}
                  activeOpacity={0.7}
                  className={`flex-1 py-1.5 px-2 rounded-lg border mr-2 last:mr-0 items-center justify-center ${
                    isSelected
                      ? 'bg-[#172B4D] border-[#172B4D]'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <Text
                    className={`text-[11px] font-bold ${
                      isSelected ? 'text-white' : 'text-slate-600'
                    }`}
                    numberOfLines={1}
                  >
                    {s.isOvernight ? '🌙 Night Shift' : '☀️ Day Shift'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Overtime Indicator Banner (Shown whenever overtime is detected) */}
      {hasDetectedOvertime && (
        <View className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-6 h-6 rounded-full bg-amber-500/20 items-center justify-center mr-2">
              <Feather name="zap" size={13} color="#D97706" />
            </View>
            <View className="flex-1">
              <Text className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                Overtime Detected
              </Text>
              <Text className="text-[10px] text-amber-700 font-medium">
                {isCheckedOut
                  ? `Shift exceeded scheduled end (${activeShift?.endTime}). Overtime recorded.`
                  : `Currently working beyond shift end (${activeShift?.endTime}). Tracking OT.`}
              </Text>
            </View>
          </View>
          <View className="bg-amber-500 px-2.5 py-1 rounded-full flex-row items-center shadow-xs">
            <Feather name="clock" size={10} color="#FFFFFF" />
            <Text className="text-[10px] font-black text-white ml-1">
              +{displayedOvertime}
            </Text>
          </View>
        </View>
      )}

      {/* Primary Check-In / Check-Out Action Button */}
      <View className="my-2">
        {isNotCheckedIn && (
          <TouchableOpacity
            onPress={onCheckIn}
            disabled={isLoading}
            activeOpacity={0.8}
            className="w-full bg-[#10B981] rounded-2xl py-4 flex-row items-center justify-center shadow-sm"
            accessibilityRole="button"
            accessibilityLabel="Check In to Shift"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Feather name="log-in" size={20} color="#FFFFFF" />
                <Text className="text-sm font-black text-white uppercase tracking-wider ml-2.5">
                  Check In to Shift
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {isCheckedIn && (
          <TouchableOpacity
            onPress={onCheckOut}
            disabled={isLoading}
            activeOpacity={0.8}
            className="w-full bg-[#F97316] rounded-2xl py-4 flex-row items-center justify-center shadow-sm"
            accessibilityRole="button"
            accessibilityLabel="Check Out of Shift"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Feather name="log-out" size={20} color="#FFFFFF" />
                <Text className="text-sm font-black text-white uppercase tracking-wider ml-2.5">
                  Check Out of Shift
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {isCheckedOut && (
          <View className="w-full bg-slate-100 rounded-2xl py-3.5 flex-row items-center justify-center border border-slate-200">
            <Feather name="check-circle" size={18} color="#10B981" />
            <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-2">
              Attendance Completed for Today
            </Text>
          </View>
        )}
      </View>

      {/* Check In & Check Out Timestamps */}
      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-slate-100">
        {/* Check In Timestamp */}
        <View className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 mr-2">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-[10px] font-semibold text-slate-400 uppercase">
              Check In
            </Text>
            {record?.arrivalStatus && (
              <View
                className="px-1.5 py-0.2 rounded"
                style={{ backgroundColor: `${record.arrivalStatus.color}20` }}
              >
                <Text
                  style={{ color: record.arrivalStatus.color }}
                  className="text-[9px] font-bold"
                >
                  {record.arrivalStatus.status}
                </Text>
              </View>
            )}
          </View>
          <Text className="text-base font-black text-[#172B4D]">
            {formatTime12(record?.checkIn)}
          </Text>
          <Text className="text-[10px] text-slate-400 font-medium mt-0.5">
            {record?.arrivalStatus?.label || `Scheduled ${formatTime12(activeShift?.startTime || '08:00')}`}
          </Text>
        </View>

        {/* Check Out Timestamp */}
        <View className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
          <Text className="text-[10px] font-semibold text-slate-400 uppercase mb-1">
            Check Out
          </Text>
          <Text className="text-base font-black text-[#172B4D]">
            {formatTime12(record?.checkOut)}
          </Text>
          <Text className="text-[10px] text-slate-400 font-medium mt-0.5">
            {isCheckedOut ? 'Shift Closed' : `Shift End: ${formatTime12(activeShift?.endTime || '17:00')}`}
          </Text>
        </View>
      </View>

      {/* Dedicated Working Hours & Overtime Summary Section */}
      <View className="mt-3 pt-3 border-t border-slate-100">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Hours Breakdown
          </Text>
          <Text className="text-[10px] font-semibold text-slate-500">
            {isCheckedIn ? 'Live Calculating' : isCheckedOut ? 'Finalized Record' : 'Standard Shift: 9.0h'}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          {/* Regular Working Hours */}
          <View className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 mr-2">
            <Text className="text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
              Regular Hours
            </Text>
            <Text className="text-base font-black text-[#172B4D]">
              {displayedRegular}
            </Text>
            <Text className="text-[9px] text-slate-400 font-medium mt-0.5">
              Standard Shift
            </Text>
          </View>

          {/* Overtime Hours */}
          <View
            className={`flex-1 rounded-xl p-2.5 mr-2 border ${
              hasDetectedOvertime
                ? 'bg-amber-50/70 border-amber-300'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <View className="flex-row items-center justify-between mb-0.5">
              <Text
                className={`text-[10px] font-semibold uppercase ${
                  hasDetectedOvertime ? 'text-amber-800' : 'text-slate-500'
                }`}
              >
                Overtime
              </Text>
              {hasDetectedOvertime && (
                <Feather name="zap" size={11} color="#D97706" />
              )}
            </View>
            <Text
              className={`text-base font-black ${
                hasDetectedOvertime ? 'text-amber-700' : 'text-slate-600'
              }`}
            >
              {displayedOvertime}
            </Text>
            <Text
              className={`text-[9px] font-medium mt-0.5 ${
                hasDetectedOvertime ? 'text-amber-700' : 'text-slate-400'
              }`}
            >
              {hasDetectedOvertime ? 'Approved OT' : 'None'}
            </Text>
          </View>

          {/* Total Working Hours */}
          <View className="flex-1 bg-emerald-50/50 border border-emerald-200 rounded-xl p-2.5">
            <Text className="text-[10px] font-semibold text-emerald-800 uppercase mb-0.5">
              Total Hours
            </Text>
            <Text className="text-base font-black text-emerald-700">
              {displayedTotal}
            </Text>
            <Text className="text-[9px] text-emerald-600 font-medium mt-0.5">
              Regular + OT
            </Text>
          </View>
        </View>
      </View>

      {/* Security & Verification Footer */}
      <View className="mt-3 pt-2.5 border-t border-slate-100 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-2">
          <Feather name="shield" size={12} color="#10B981" />
          <Text className="text-[10px] text-slate-500 font-medium ml-1.5 flex-1" numberOfLines={1}>
            Server Time & Automatic OT Verification
          </Text>
        </View>
        <Text className="text-[10px] text-slate-400 font-semibold">
          Single Daily Lock
        </Text>
      </View>
    </View>
  );
}
