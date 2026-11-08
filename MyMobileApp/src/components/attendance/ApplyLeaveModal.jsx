import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  LEAVE_TYPES,
  calculateWorkingLeaveDays,
} from '../../services/leaveService';
import { getBusinessDateString } from '../../services/attendanceService';

export default function ApplyLeaveModal({
  visible,
  onClose,
  onSubmit,
  leaveBalance,
  currentYear = 2026,
}) {
  const [selectedTypeId, setSelectedTypeId] = useState('CASUAL');

  // Default start date = tomorrow, end date = tomorrow
  const [startDateStr, setStartDateStr] = useState(() => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    return getBusinessDateString(tmrw);
  });

  const [endDateStr, setEndDateStr] = useState(() => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    return getBusinessDateString(tmrw);
  });

  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Live calculation of requested working leave days
  const daysCalculation = useMemo(() => {
    return calculateWorkingLeaveDays(startDateStr, endDateStr);
  }, [startDateStr, endDateStr]);

  const selectedTypeConfig = LEAVE_TYPES[selectedTypeId] || LEAVE_TYPES.CASUAL;
  const currentCategoryBalance = leaveBalance?.breakdown?.[selectedTypeId];
  const remainingForType = currentCategoryBalance?.remaining ?? selectedTypeConfig.annualQuota;

  // Validation: Exceeds balance check
  const exceedsBalance =
    selectedTypeConfig.isPaid &&
    daysCalculation.isValid &&
    typeof remainingForType === 'number' &&
    daysCalculation.workingDays > remainingForType;

  // Helper date steppers for mobile convenience
  const adjustDate = (dateStr, daysOffset) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      date.setDate(date.getDate() + daysOffset);
      return getBusinessDateString(date);
    } catch {
      return dateStr;
    }
  };

  const handleQuickPreset = (durationDays) => {
    const base = new Date();
    base.setDate(base.getDate() + 1);
    const start = getBusinessDateString(base);

    const endObj = new Date(base);
    endObj.setDate(endObj.getDate() + (durationDays - 1));
    const end = getBusinessDateString(endObj);

    setStartDateStr(start);
    setEndDateStr(end);
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    setErrorMessage('');

    if (!daysCalculation.isValid) {
      setErrorMessage(daysCalculation.error || 'Please choose a valid date range.');
      return;
    }

    if (daysCalculation.workingDays === 0) {
      setErrorMessage('Selected range contains only rest days / holidays. No leave needed.');
      return;
    }

    if (exceedsBalance) {
      setErrorMessage(
        `Insufficient balance: You have ${remainingForType} ${selectedTypeConfig.name} day(s) remaining, but requested ${daysCalculation.workingDays} working day(s).`
      );
      return;
    }

    if (!reason.trim() || reason.trim().length < 5) {
      setErrorMessage('Please provide a reason for leave (at least 5 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        leaveTypeId: selectedTypeId,
        startDate: startDateStr,
        endDate: endDateStr,
        reason: reason.trim(),
      });
      // Reset reason on success
      setReason('');
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Unable to submit leave request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-3xl pt-5 pb-8 px-5 border-t border-slate-200 max-h-[90%]"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 items-center justify-center mr-2.5">
                <Feather name="send" size={16} color="#F97316" />
              </View>
              <View>
                <Text className="text-sm font-bold text-[#172B4D]">
                  Apply for Leave ({currentYear})
                </Text>
                <Text className="text-[10px] text-slate-400 font-medium">
                  Authoritative Annual Leave Request
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

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Error Message Banner */}
            {Boolean(errorMessage) && (
              <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3.5 flex-row items-start">
                <Feather name="alert-circle" size={15} color="#EF4444" style={{ marginTop: 2 }} />
                <Text className="text-xs text-red-700 font-medium ml-2 flex-1">
                  {errorMessage}
                </Text>
              </View>
            )}

            {/* 1. Leave Type Selector */}
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Leave Type
            </Text>
            <View className="flex-row flex-wrap justify-between mb-3.5">
              {Object.values(LEAVE_TYPES).map((type) => {
                const isSelected = selectedTypeId === type.id;
                const catData = leaveBalance?.breakdown?.[type.id];
                const available = type.isPaid ? `${catData?.remaining ?? type.annualQuota}d left` : 'Unpaid';

                return (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => {
                      setSelectedTypeId(type.id);
                      setErrorMessage('');
                    }}
                    activeOpacity={0.7}
                    className={`w-[48.5%] p-2.5 rounded-xl border mb-2 ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <View className="flex-row items-center justify-between mb-1">
                      <Text
                        className={`text-xs font-bold ${
                          isSelected ? 'text-white' : 'text-[#172B4D]'
                        }`}
                      >
                        {type.name}
                      </Text>
                      {isSelected && (
                        <Feather name="check" size={12} color="#FFFFFF" />
                      )}
                    </View>
                    <Text
                      className={`text-[10px] font-semibold ${
                        isSelected ? 'text-orange-300' : 'text-slate-500'
                      }`}
                    >
                      {available}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Quick Duration Presets */}
            <View className="flex-row items-center justify-between mb-3.5 pt-2 border-t border-slate-100">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Presets:
              </Text>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => handleQuickPreset(1)}
                  activeOpacity={0.7}
                  className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 mr-1.5"
                >
                  <Text className="text-[10px] font-bold text-slate-700">1 Day</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleQuickPreset(2)}
                  activeOpacity={0.7}
                  className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 mr-1.5"
                >
                  <Text className="text-[10px] font-bold text-slate-700">2 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleQuickPreset(3)}
                  activeOpacity={0.7}
                  className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200"
                >
                  <Text className="text-[10px] font-bold text-slate-700">3 Days</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 2. Start Date & End Date Steppers */}
            <View className="flex-row items-center justify-between mb-3">
              {/* Start Date */}
              <View className="flex-1 mr-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <Text className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Start Date
                </Text>
                <Text className="text-xs font-black text-[#172B4D] mb-1.5">
                  {startDateStr}
                </Text>
                <View className="flex-row items-center justify-between pt-1 border-t border-slate-200/60">
                  <TouchableOpacity
                    onPress={() => {
                      const next = adjustDate(startDateStr, -1);
                      setStartDateStr(next);
                      if (next > endDateStr) setEndDateStr(next);
                    }}
                    className="w-7 h-7 rounded-md bg-white border border-slate-200 items-center justify-center"
                  >
                    <Feather name="minus" size={13} color="#172B4D" />
                  </TouchableOpacity>
                  <Text className="text-[10px] text-slate-400 font-medium">Day</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const next = adjustDate(startDateStr, 1);
                      setStartDateStr(next);
                      if (next > endDateStr) setEndDateStr(next);
                    }}
                    className="w-7 h-7 rounded-md bg-white border border-slate-200 items-center justify-center"
                  >
                    <Feather name="plus" size={13} color="#172B4D" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* End Date */}
              <View className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <Text className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  End Date
                </Text>
                <Text className="text-xs font-black text-[#172B4D] mb-1.5">
                  {endDateStr}
                </Text>
                <View className="flex-row items-center justify-between pt-1 border-t border-slate-200/60">
                  <TouchableOpacity
                    onPress={() => {
                      const next = adjustDate(endDateStr, -1);
                      if (next >= startDateStr) setEndDateStr(next);
                    }}
                    className="w-7 h-7 rounded-md bg-white border border-slate-200 items-center justify-center"
                  >
                    <Feather name="minus" size={13} color="#172B4D" />
                  </TouchableOpacity>
                  <Text className="text-[10px] text-slate-400 font-medium">Day</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const next = adjustDate(endDateStr, 1);
                      setEndDateStr(next);
                    }}
                    className="w-7 h-7 rounded-md bg-white border border-slate-200 items-center justify-center"
                  >
                    <Feather name="plus" size={13} color="#172B4D" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Calculated Working Days Summary Box */}
            <View
              className={`rounded-xl p-3 border mb-3.5 ${
                exceedsBalance
                  ? 'bg-red-50 border-red-300'
                  : 'bg-blue-50/60 border-blue-200'
              }`}
            >
              <View className="flex-row items-center justify-between mb-1">
                <Text
                  className={`text-xs font-bold ${
                    exceedsBalance ? 'text-red-700' : 'text-[#172B4D]'
                  }`}
                >
                  Requested Leave: {daysCalculation.workingDays} Working Day(s)
                </Text>
                <Text
                  className={`text-[10px] font-bold ${
                    exceedsBalance ? 'text-red-600' : 'text-blue-700'
                  }`}
                >
                  {selectedTypeConfig.isPaid
                    ? `${remainingForType} available`
                    : 'Unlimited'}
                </Text>
              </View>

              <Text className="text-[10px] text-slate-500 font-medium">
                {daysCalculation.totalCalendarDays} calendar day(s) total
                {daysCalculation.weeklyOffs > 0
                  ? ` • Excludes ${daysCalculation.weeklyOffs} Sunday rest day(s)`
                  : ''}
                {daysCalculation.holidays > 0
                  ? ` • Excludes ${daysCalculation.holidays} holiday(s)`
                  : ''}
              </Text>

              {exceedsBalance && (
                <Text className="text-[10px] text-red-600 font-bold mt-1">
                  ⚠️ Request exceeds available {selectedTypeConfig.name} balance ({remainingForType} left).
                </Text>
              )}
            </View>

            {/* 3. Reason for Leave Input */}
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Reason for Leave
            </Text>
            <TextInput
              value={reason}
              onChangeText={(txt) => {
                setReason(txt);
                setErrorMessage('');
              }}
              placeholder="Provide reason (e.g. personal relocation, recovery, emergency)..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-[#172B4D] mb-4 min-h-[72px]"
            />

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting || exceedsBalance || !daysCalculation.isValid}
              activeOpacity={0.8}
              className={`w-full rounded-xl py-3.5 items-center justify-center shadow-sm ${
                isSubmitting || exceedsBalance || !daysCalculation.isValid
                  ? 'bg-slate-300'
                  : 'bg-[#172B4D]'
              }`}
              accessibilityRole="button"
              accessibilityLabel="Submit Leave Request"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View className="flex-row items-center">
                  <Feather name="check-circle" size={16} color="#FFFFFF" />
                  <Text className="text-xs font-black text-white uppercase tracking-wider ml-2">
                    Submit Leave Request
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
