import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LEAVE_TYPES } from '../../services/leaveService';

/**
 * Section: Leave Management Dashboard & Request Tracking
 *
 * Requirements Met:
 * 1. Leave Dashboard: 4 Minimal Statistic Cards
 *    - Total Annual Leave Allowance
 *    - Used / Completed Leaves
 *    - Remaining / Available Leaves
 *    - Pending Leave Requests
 * 2. Leave Request Tracking List:
 *    - Leave type with color badge
 *    - Requested dates & working days count
 *    - Request submission date
 *    - Approval status (Pending, Approved, Rejected)
 *    - Worker action: Cancel eligible pending requests
 *    - Manager action: Approve or Reject pending requests
 * 3. Year Switcher: View 2026 and previous historical years (2025).
 * 4. Apply for Leave primary action button.
 */
export default function LeaveManagementSection({
  leaveBalance,
  leaveRequests = [],
  selectedYear = 2026,
  availableYears = [2026, 2025],
  onSelectYear,
  onOpenApplyModal,
  onCancelRequest,
}) {
  const {
    totalAllowance = 24,
    usedLeaves = 0,
    remainingLeaves = 24,
    pendingRequestsCount = 0,
    breakdown = {},
  } = leaveBalance || {};

  const handleCancelPress = (req) => {
    Alert.alert(
      'Cancel Leave Request',
      `Are you sure you want to cancel your ${req.leaveTypeName} request for ${req.startDate} to ${req.endDate}?`,
      [
        { text: 'Keep Request', style: 'cancel' },
        {
          text: 'Cancel Request',
          style: 'destructive',
          onPress: () => onCancelRequest(req.id),
        },
      ]
    );
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <View className="mb-6">
      {/* Section Header & Year Switcher */}
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-row items-center">
          <View className="w-6 h-6 rounded-md bg-blue-50 border border-blue-200 items-center justify-center mr-2">
            <Feather name="calendar" size={13} color="#172B4D" />
          </View>
          <Text className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
            Leave Management
          </Text>
        </View>

        {/* Year Selector Tabs */}
        <View className="flex-row items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          {availableYears.map((yr) => {
            const isSelected = selectedYear === yr;
            return (
              <TouchableOpacity
                key={yr}
                onPress={() => onSelectYear(yr)}
                activeOpacity={0.7}
                className={`px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-white shadow-xs border border-slate-200' : ''
                }`}
              >
                <Text
                  className={`text-[11px] font-bold ${
                    isSelected ? 'text-[#172B4D]' : 'text-slate-500'
                  }`}
                >
                  {yr}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 4 Minimal Stat Cards (Leave Dashboard) */}
      <View className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm mb-3">
        <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-slate-100">
          {/* Card 1: Annual Allowance */}
          <View className="items-center flex-1">
            <Text className="text-xl font-black text-[#172B4D]">
              {totalAllowance}d
            </Text>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5 text-center">
              Annual Allowance
            </Text>
          </View>

          <View className="w-[1px] h-8 bg-slate-200" />

          {/* Card 2: Used Leaves */}
          <View className="items-center flex-1">
            <Text className="text-xl font-black text-purple-600">
              {usedLeaves}d
            </Text>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5 text-center">
              Used Leaves
            </Text>
          </View>

          <View className="w-[1px] h-8 bg-slate-200" />

          {/* Card 3: Remaining / Available */}
          <View className="items-center flex-1">
            <Text className="text-xl font-black text-emerald-700">
              {remainingLeaves}d
            </Text>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5 text-center">
              Available Balance
            </Text>
          </View>

          <View className="w-[1px] h-8 bg-slate-200" />

          {/* Card 4: Pending Requests */}
          <View className="items-center flex-1">
            <Text className="text-xl font-black text-amber-600">
              {pendingRequestsCount}
            </Text>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5 text-center">
              Pending
            </Text>
          </View>
        </View>

        {/* Category Breakdown Chips */}
        <View className="flex-row items-center justify-between">
          {Object.values(LEAVE_TYPES).map((type) => {
            const data = breakdown[type.id] || { remaining: type.annualQuota, quota: type.annualQuota };
            return (
              <View
                key={type.id}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 mr-1.5 last:mr-0 items-center"
              >
                <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                  {type.code}
                </Text>
                <Text className="text-xs font-black text-[#172B4D] mt-0.5">
                  {type.isPaid ? `${data.remaining ?? type.annualQuota}d` : `${data.used || 0}d`}
                </Text>
                <Text className="text-[8px] text-slate-400 font-medium">
                  {type.isPaid ? 'Left' : 'Taken'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Apply for Leave Primary Action Button */}
      <TouchableOpacity
        onPress={onOpenApplyModal}
        activeOpacity={0.8}
        className="w-full bg-[#F97316] rounded-xl py-3 flex-row items-center justify-center shadow-sm mb-3.5"
        accessibilityRole="button"
        accessibilityLabel="Apply for Leave"
      >
        <Feather name="plus-circle" size={16} color="#FFFFFF" />
        <Text className="text-xs font-black text-white uppercase tracking-wider ml-2">
          Apply for Leave
        </Text>
      </TouchableOpacity>

      {/* Leave Request Tracking List */}
      <View className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <View className="flex-row items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <View className="flex-row items-center">
            <Feather name="list" size={14} color="#172B4D" />
            <Text className="text-xs font-bold text-[#172B4D] ml-1.5 uppercase tracking-wide">
              Leave Requests & History ({selectedYear})
            </Text>
          </View>
          <Text className="text-[10px] text-slate-400 font-medium">
            {leaveRequests.length} {leaveRequests.length === 1 ? 'Record' : 'Records'}
          </Text>
        </View>

        {leaveRequests.length === 0 ? (
          <View className="py-5 items-center justify-center">
            <Feather name="calendar" size={22} color="#CBD5E1" />
            <Text className="text-xs text-slate-400 font-medium mt-1.5">
              No leave requests found for {selectedYear}.
            </Text>
          </View>
        ) : (
          leaveRequests.map((req) => {
            const isPending = req.status === 'PENDING';
            const isApproved = req.status === 'APPROVED';
            const isRejected = req.status === 'REJECTED';

            const statusConfig = isApproved
              ? {
                  label: 'Approved',
                  badgeBg: 'bg-emerald-50',
                  badgeBorder: 'border-emerald-200',
                  badgeText: 'text-emerald-700',
                  icon: 'check-circle',
                }
              : isRejected
              ? {
                  label: 'Rejected',
                  badgeBg: 'bg-red-50',
                  badgeBorder: 'border-red-200',
                  badgeText: 'text-red-700',
                  icon: 'x-circle',
                }
              : {
                  label: 'Pending Review',
                  badgeBg: 'bg-amber-50',
                  badgeBorder: 'border-amber-200',
                  badgeText: 'text-amber-800',
                  icon: 'clock',
                };

            const typeConfig = LEAVE_TYPES[req.leaveTypeId] || LEAVE_TYPES.CASUAL;

            return (
              <View
                key={req.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2.5 last:mb-0"
              >
                {/* Top Row: Type & Status Badge */}
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="flex-row items-center flex-1 mr-2">
                    <View
                      className={`px-2 py-0.5 rounded-md border mr-1.5 ${typeConfig.bgColor} ${typeConfig.borderColor}`}
                    >
                      <Text className={`text-[10px] font-bold ${typeConfig.textColor}`}>
                        {req.leaveTypeName}
                      </Text>
                    </View>
                    <Text className="text-[10px] font-bold text-slate-500">
                      • {req.workingDays} Working {req.workingDays === 1 ? 'Day' : 'Days'}
                    </Text>
                  </View>

                  <View
                    className={`flex-row items-center px-2 py-0.5 rounded-full border ${statusConfig.badgeBg} ${statusConfig.badgeBorder}`}
                  >
                    <Feather
                      name={statusConfig.icon}
                      size={10}
                      color={isApproved ? '#10B981' : isRejected ? '#EF4444' : '#D97706'}
                    />
                    <Text className={`text-[10px] font-bold ml-1 ${statusConfig.badgeText}`}>
                      {statusConfig.label}
                    </Text>
                  </View>
                </View>

                {/* Date Range & Submission Date */}
                <View className="flex-row items-center justify-between mt-0.5">
                  <Text className="text-xs font-black text-[#172B4D]">
                    {formatDisplayDate(req.startDate)}
                    {req.startDate !== req.endDate ? ` – ${formatDisplayDate(req.endDate)}` : ''}
                  </Text>
                  <Text className="text-[10px] text-slate-400 font-medium">
                    Applied: {formatDisplayDate(req.submittedAt?.split('T')[0])}
                  </Text>
                </View>

                {/* Weekly Off / Holiday Exclusion info */}
                {(req.weeklyOffs > 0 || req.holidays > 0) && (
                  <Text className="text-[9px] text-slate-400 font-medium mt-0.5">
                    ({req.totalCalendarDays} calendar days, excluding{' '}
                    {req.weeklyOffs > 0 ? `${req.weeklyOffs} Sunday rest day` : ''}
                    {req.weeklyOffs > 0 && req.holidays > 0 ? ', ' : ''}
                    {req.holidays > 0 ? `${req.holidays} holiday` : ''})
                  </Text>
                )}

                {/* Reason */}
                {Boolean(req.reason) && (
                  <Text className="text-[11px] text-slate-600 font-medium mt-1.5 italic" numberOfLines={2}>
                    {`"${req.reason}"`}
                  </Text>
                )}

                {/* Reviewer Stamp for Approved / Rejected */}
                {Boolean(req.reviewedBy) && (
                  <View className="mt-2 pt-1.5 border-t border-slate-200/60 flex-row items-center justify-between">
                    <Text className="text-[9px] text-slate-400 font-medium" numberOfLines={1}>
                      Reviewed by: {req.reviewedBy}
                    </Text>
                    <Text className="text-[9px] text-slate-400 font-medium">
                      {formatDisplayDate(req.reviewedAt?.split('T')[0])}
                    </Text>
                  </View>
                )}

                {/* Pending Actions (Worker Cancel) */}
                {isPending && (
                  <View className="mt-2.5 pt-2 border-t border-slate-200/70 flex-row items-center justify-between">
                    {/* Worker Cancel */}
                    <TouchableOpacity
                      onPress={() => handleCancelPress(req)}
                      activeOpacity={0.7}
                      className="flex-row items-center py-1 px-2.5 rounded-lg bg-red-50 border border-red-200"
                    >
                      <Feather name="trash-2" size={11} color="#EF4444" />
                      <Text className="text-[10px] font-bold text-red-600 ml-1">
                        Cancel Request
                      </Text>
                    </TouchableOpacity>

                    <Text className="text-[10px] text-amber-700 font-medium">
                      Awaiting Manager Decision
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}
