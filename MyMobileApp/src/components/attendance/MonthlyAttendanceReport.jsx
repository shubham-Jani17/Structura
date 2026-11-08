import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { formatTime12 } from '../../services/attendanceService';

/**
 * Monthly Attendance & Automatic Overtime Reports
 *
 * Requirements Met:
 * 1. Monthly Overtime Statistics:
 *    - Total Regular Working Hours
 *    - Total Overtime Hours
 *    - Total Working Hours
 *    - Number of Overtime Days
 * 2. Month Navigation: Navigate previous/next months and view history.
 * 3. Daily Overtime Breakdown: Visual breakdown list of each day's overtime.
 * 4. Interactive Calendar: Color badges, overtime indicator dots, day selection.
 */
export default function MonthlyAttendanceReport({
  monthlyReport,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}) {
  const {
    monthName,
    firstDayIndex = 0,
    calendarDays = [],
    overtimeRecords = [],
    metrics = {},
  } = monthlyReport || {};

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Pad the start of calendar grid for the first day of the week offset
  const blankDays = Array.from({ length: firstDayIndex });

  return (
    <View className="mb-6">
      {/* Section Title */}
      <View className="flex-row items-center justify-between mb-2.5">
        <Text className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
          Monthly Analytics & Overtime
        </Text>
        <Text className="text-[11px] text-slate-400 font-medium">
          Authoritative Logs
        </Text>
      </View>

      {/* 4 Overtime & Work Hours Hero Metric Cards */}
      <View className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm mb-3">
        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Work Hours & Overtime Summary
        </Text>

        <View className="flex-row items-center justify-between">
          {/* Total Regular Hours */}
          <View className="items-center flex-1">
            <Text className="text-lg font-black text-[#172B4D]">
              {metrics.totalRegularHoursWorked || '0.0'}h
            </Text>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5 text-center">
              Regular Hours
            </Text>
          </View>

          <View className="w-[1px] h-8 bg-slate-200" />

          {/* Total Overtime Hours */}
          <View className="items-center flex-1">
            <View className="flex-row items-center">
              <Feather name="zap" size={13} color="#F97316" />
              <Text className="text-lg font-black text-[#F97316] ml-1">
                {metrics.totalOvertimeHoursWorked || '0.0'}h
              </Text>
            </View>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5 text-center">
              Overtime Hours
            </Text>
          </View>

          <View className="w-[1px] h-8 bg-slate-200" />

          {/* Total Working Hours */}
          <View className="items-center flex-1">
            <Text className="text-lg font-black text-emerald-700">
              {metrics.totalHoursWorked || '0.0'}h
            </Text>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5 text-center">
              Total Hours
            </Text>
          </View>

          <View className="w-[1px] h-8 bg-slate-200" />

          {/* Overtime Days Count */}
          <View className="items-center flex-1">
            <Text className="text-lg font-black text-amber-600">
              {metrics.overtimeDaysCount || 0}
            </Text>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5 text-center">
              OT Days
            </Text>
          </View>
        </View>

        {/* Secondary Attendance Metrics Row */}
        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <View className="items-center flex-1">
            <Text className="text-sm font-bold text-[#172B4D]">
              {metrics.totalWorkingDays || 0}
            </Text>
            <Text className="text-[9px] text-slate-400 font-medium">Work Days</Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-sm font-bold text-emerald-600">
              {metrics.presentDays || 0}
            </Text>
            <Text className="text-[9px] text-slate-400 font-medium">Present</Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-sm font-bold text-amber-600">
              {metrics.lateArrivals || 0}
            </Text>
            <Text className="text-[9px] text-slate-400 font-medium">Late</Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-sm font-bold text-red-600">
              {metrics.absentDays || 0}
            </Text>
            <Text className="text-[9px] text-slate-400 font-medium">Absent</Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-sm font-bold text-[#F97316]">
              {metrics.attendancePercentage || '0%'}
            </Text>
            <Text className="text-[9px] text-slate-400 font-medium">Rate %</Text>
          </View>
        </View>
      </View>

      {/* Monthly Interactive Calendar */}
      <View className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-3">
        {/* Month Navigation Header */}
        <View className="flex-row items-center justify-between mb-3.5">
          <View className="flex-row items-center">
            <Feather name="calendar" size={16} color="#172B4D" />
            <Text className="text-sm font-bold text-[#172B4D] ml-2">
              {monthName}
            </Text>
          </View>

          <View className="flex-row items-center space-x-1.5">
            <TouchableOpacity
              onPress={onPrevMonth}
              activeOpacity={0.7}
              className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 items-center justify-center mr-1"
              accessibilityRole="button"
              accessibilityLabel="Previous month"
            >
              <Feather name="chevron-left" size={16} color="#172B4D" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNextMonth}
              activeOpacity={0.7}
              className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Next month"
            >
              <Feather name="chevron-right" size={16} color="#172B4D" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Day-of-Week Labels */}
        <View className="flex-row justify-between mb-2 pb-2 border-b border-slate-100">
          {daysOfWeek.map((day, idx) => (
            <Text
              key={idx}
              className="w-[13.5%] text-center text-[10px] font-bold text-slate-400 uppercase"
            >
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Day Cells Grid */}
        <View className="flex-row flex-wrap">
          {/* Blank offset placeholders */}
          {blankDays.map((_, idx) => (
            <View key={`blank_${idx}`} className="w-[14.28%] h-10 items-center justify-center" />
          ))}

          {/* Real month days */}
          {calendarDays.map((item) => {
            const hasRecord = Boolean(
              item.record || item.isWeekend || item.status !== 'NOT_RECORDED'
            );
            const isOvertimeDay = Boolean(item.hasOvertime);

            return (
              <TouchableOpacity
                key={item.dateKey}
                onPress={() => onSelectDate(item.dateKey, item.record, item)}
                activeOpacity={0.7}
                className="w-[14.28%] h-10 items-center justify-center my-0.5 relative"
              >
                <View
                  style={{
                    backgroundColor:
                      item.status === 'NOT_RECORDED'
                        ? 'transparent'
                        : `${item.statusColor}18`,
                    borderColor:
                      item.status === 'NOT_RECORDED'
                        ? 'transparent'
                        : `${item.statusColor}40`,
                  }}
                  className="w-8 h-8 rounded-lg items-center justify-center border relative"
                >
                  <Text
                    style={{
                      color:
                        item.status === 'NOT_RECORDED'
                          ? '#94A3B8'
                          : item.statusColor,
                    }}
                    className={`text-xs ${
                      hasRecord ? 'font-bold' : 'font-medium'
                    }`}
                  >
                    {item.day}
                  </Text>

                  {/* Overtime Lightning Badge Indicator */}
                  {isOvertimeDay && (
                    <View className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#F97316] items-center justify-center border border-white">
                      <View className="w-1 h-1 rounded-full bg-white" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Color Badge Legend */}
        <View className="flex-row flex-wrap items-center justify-between pt-3 mt-3 border-t border-slate-100">
          <View className="flex-row items-center mr-2 mb-1">
            <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1" />
            <Text className="text-[10px] font-semibold text-slate-600">Present</Text>
          </View>
          <View className="flex-row items-center mr-2 mb-1">
            <View className="w-2.5 h-2.5 rounded-full bg-[#F97316] mr-1" />
            <Text className="text-[10px] font-semibold text-slate-600">Overtime</Text>
          </View>
          <View className="flex-row items-center mr-2 mb-1">
            <View className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1" />
            <Text className="text-[10px] font-semibold text-slate-600">Late</Text>
          </View>
          <View className="flex-row items-center mr-2 mb-1">
            <View className="w-2.5 h-2.5 rounded-full bg-purple-500 mr-1" />
            <Text className="text-[10px] font-semibold text-slate-600">Half Day</Text>
          </View>
          <View className="flex-row items-center mr-2 mb-1">
            <View className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1" />
            <Text className="text-[10px] font-semibold text-slate-600">Absent</Text>
          </View>
          <View className="flex-row items-center mb-1">
            <View className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1" />
            <Text className="text-[10px] font-semibold text-slate-600">Leave</Text>
          </View>
        </View>
      </View>

      {/* Daily Overtime History Breakdown */}
      <View className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <View className="flex-row items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <View className="flex-row items-center">
            <Feather name="clock" size={14} color="#F97316" />
            <Text className="text-xs font-bold text-[#172B4D] ml-1.5 uppercase tracking-wide">
              Daily Overtime Breakdown
            </Text>
          </View>
          <Text className="text-[10px] font-bold text-[#F97316]">
            {overtimeRecords.length} Overtime {overtimeRecords.length === 1 ? 'Day' : 'Days'}
          </Text>
        </View>

        {overtimeRecords.length === 0 ? (
          <View className="py-4 items-center justify-center">
            <Feather name="check-circle" size={20} color="#94A3B8" />
            <Text className="text-xs text-slate-400 font-medium mt-1">
              No overtime hours recorded for {monthName}.
            </Text>
          </View>
        ) : (
          overtimeRecords.map((item) => (
            <TouchableOpacity
              key={item.dateKey}
              onPress={() => {
                const dayItem = calendarDays.find((d) => d.dateKey === item.dateKey);
                onSelectDate(item.dateKey, item, dayItem || {});
              }}
              activeOpacity={0.7}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2 last:mb-0"
            >
              <View className="flex-row items-center justify-between mb-1.5">
                <View className="flex-row items-center">
                  <View className="w-6 h-6 rounded-md bg-orange-100 items-center justify-center mr-2">
                    <Text className="text-[11px] font-black text-[#F97316]">
                      {item.day}
                    </Text>
                  </View>
                  <Text className="text-xs font-bold text-[#172B4D]">
                    {item.dateKey}
                  </Text>
                </View>

                {/* Overtime Pill */}
                <View className="bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full flex-row items-center">
                  <Feather name="zap" size={10} color="#D97706" />
                  <Text className="text-[10px] font-black text-[#F97316] ml-1">
                    +{item.overtimeDuration} OT
                  </Text>
                </View>
              </View>

              {/* Hours Breakdown Row */}
              <View className="flex-row items-center justify-between pt-1.5 border-t border-slate-200/60">
                <Text className="text-[10px] text-slate-500 font-medium">
                  {formatTime12(item.checkIn)} – {formatTime12(item.checkOut)}
                </Text>
                <View className="flex-row items-center space-x-2">
                  <Text className="text-[10px] text-slate-600 font-semibold mr-2">
                    Reg: <Text className="font-bold text-[#172B4D]">{item.regularDuration}</Text>
                  </Text>
                  <Text className="text-[10px] text-slate-600 font-semibold">
                    Total: <Text className="font-black text-emerald-700">{item.totalDuration}</Text>
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
}
