import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function LogoutConfirmationModal({
  visible,
  userName,
  onConfirmLogout,
  onClose,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-center items-center p-5">
        <View className="bg-white rounded-3xl w-full max-w-sm p-6 border border-slate-200 shadow-xl items-center">
          {/* Warning Icon */}
          <View className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 items-center justify-center mb-3">
            <Feather name="log-out" size={28} color="#E11D48" />
          </View>

          {/* Heading */}
          <Text className="text-base font-black text-[#172B4D] text-center mb-1">
            Sign Out of Structura?
          </Text>
          <Text className="text-xs text-slate-500 text-center font-medium mb-4 leading-relaxed">
            You will disconnect your active session as{' '}
            <Text className="font-bold text-[#172B4D]">{userName}</Text>.
            Verify that your shift status and report logs are saved.
          </Text>

          {/* Safety Reminder Box */}
          <View className="w-full bg-amber-50 rounded-2xl p-3 border border-amber-200 mb-5 flex-row items-center">
            <Feather name="alert-triangle" size={16} color="#D97706" />
            <Text className="text-[11px] text-amber-900 font-semibold ml-2 flex-1 leading-snug">
              Unsubmitted draft site reports or offline attendance logs will sync
              upon your next sign in.
            </Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            onPress={onConfirmLogout}
            activeOpacity={0.8}
            className="w-full bg-rose-600 py-3.5 rounded-2xl items-center flex-row justify-center mb-2.5 shadow-sm shadow-rose-300"
          >
            <Feather name="log-out" size={15} color="#FFFFFF" />
            <Text className="text-white text-xs font-black tracking-wide ml-2">
              Log Out Session
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="w-full py-2.5 rounded-xl items-center"
          >
            <Text className="text-xs font-bold text-slate-600">
              Stay Signed In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
