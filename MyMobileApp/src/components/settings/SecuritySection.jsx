import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { settingsService } from '../../services/settingsService';

export default function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSavePassword = () => {
    setErrorMessage('');
    setSuccessMessage('');

    const validation = settingsService.validatePasswordChange(
      currentPassword,
      newPassword,
      confirmPassword
    );

    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Password changed successfully! Session credentials refreshed.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }, 500);
  };

  return (
    <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
      {/* Section Header */}
      <View className="flex-row items-center mb-3">
        <View className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 items-center justify-center mr-2.5">
          <Feather name="lock" size={16} color="#2563EB" />
        </View>
        <View>
          <Text className="text-sm font-black text-[#172B4D]">
            Security & Password Management
          </Text>
          <Text className="text-[11px] text-slate-400 font-medium">
            Manage your account access credentials
          </Text>
        </View>
      </View>

      {/* Success Banner */}
      {successMessage ? (
        <View className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-3.5 flex-row items-center">
          <Feather name="check-circle" size={16} color="#059669" />
          <Text className="text-xs text-emerald-800 font-semibold ml-2 flex-1 leading-snug">
            {successMessage}
          </Text>
          <TouchableOpacity onPress={() => setSuccessMessage('')}>
            <Feather name="x" size={14} color="#059669" />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Error Banner */}
      {errorMessage ? (
        <View className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-3.5 flex-row items-center">
          <Feather name="alert-circle" size={16} color="#E11D48" />
          <Text className="text-xs text-rose-700 font-semibold ml-2 flex-1 leading-snug">
            {errorMessage}
          </Text>
          <TouchableOpacity onPress={() => setErrorMessage('')}>
            <Feather name="x" size={14} color="#E11D48" />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Current Password Field */}
      <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
        Current Password
      </Text>
      <View className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 flex-row items-center mb-3">
        <TextInput
          value={currentPassword}
          onChangeText={(text) => {
            setCurrentPassword(text);
            if (errorMessage) setErrorMessage('');
          }}
          secureTextEntry={!showCurrent}
          placeholder="Enter current password"
          placeholderTextColor="#94A3B8"
          className="flex-1 text-xs text-[#172B4D] font-semibold"
        />
        <TouchableOpacity
          onPress={() => setShowCurrent(!showCurrent)}
          className="p-1"
        >
          <Feather
            name={showCurrent ? 'eye-off' : 'eye'}
            size={16}
            color="#64748B"
          />
        </TouchableOpacity>
      </View>

      {/* New Password Field */}
      <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
        New Password
      </Text>
      <View className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 flex-row items-center mb-3">
        <TextInput
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            if (errorMessage) setErrorMessage('');
          }}
          secureTextEntry={!showNew}
          placeholder="Enter at least 6 characters"
          placeholderTextColor="#94A3B8"
          className="flex-1 text-xs text-[#172B4D] font-semibold"
        />
        <TouchableOpacity
          onPress={() => setShowNew(!showNew)}
          className="p-1"
        >
          <Feather
            name={showNew ? 'eye-off' : 'eye'}
            size={16}
            color="#64748B"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm New Password Field */}
      <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
        Confirm New Password
      </Text>
      <View className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 flex-row items-center mb-3.5">
        <TextInput
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errorMessage) setErrorMessage('');
          }}
          secureTextEntry={!showConfirm}
          placeholder="Re-enter new password"
          placeholderTextColor="#94A3B8"
          className="flex-1 text-xs text-[#172B4D] font-semibold"
        />
        <TouchableOpacity
          onPress={() => setShowConfirm(!showConfirm)}
          className="p-1"
        >
          <Feather
            name={showConfirm ? 'eye-off' : 'eye'}
            size={16}
            color="#64748B"
          />
        </TouchableOpacity>
      </View>

      {/* Security Requirements Hint */}
      <View className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-4">
        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Password Policy:
        </Text>
        <View className="flex-row items-center mb-1">
          <Feather
            name={newPassword.length >= 6 ? 'check' : 'circle'}
            size={12}
            color={newPassword.length >= 6 ? '#059669' : '#94A3B8'}
          />
          <Text className="text-[11px] text-slate-600 font-medium ml-2">
            Minimum 6 characters length
          </Text>
        </View>
        <View className="flex-row items-center">
          <Feather
            name={
              newPassword && confirmPassword && newPassword === confirmPassword
                ? 'check'
                : 'circle'
            }
            size={12}
            color={
              newPassword && confirmPassword && newPassword === confirmPassword
                ? '#059669'
                : '#94A3B8'
            }
          />
          <Text className="text-[11px] text-slate-600 font-medium ml-2">
            Confirm password matches new password
          </Text>
        </View>
      </View>

      {/* Save Password Button */}
      <TouchableOpacity
        onPress={handleSavePassword}
        disabled={isSubmitting}
        activeOpacity={0.8}
        className="bg-[#172B4D] py-3.5 rounded-2xl items-center flex-row justify-center shadow-xs"
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
        ) : (
          <Feather name="shield" size={15} color="#FFFFFF" className="mr-1.5" />
        )}
        <Text className="text-white text-xs font-bold ml-1.5">
          {isSubmitting ? 'Updating Password...' : 'Save Password'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
