import React from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileModal({ visible, onClose, user, statistics }) {
  if (!user) return null;

  const handleOpenSettings = () => {
    onClose();
    router.push('/(tabs)/settings');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-3xl pt-5 pb-8 px-5 border-t border-slate-200"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-2xl bg-[#172B4D] items-center justify-center mr-3 shadow-sm">
                <Text className="text-base font-bold text-white tracking-wider">
                  {user.avatarInitials}
                </Text>
              </View>
              <View>
                <Text className="text-base font-bold text-[#172B4D]">
                  {user.name}
                </Text>
                <Text className="text-xs text-[#F97316] font-bold">
                  {user.role}
                </Text>
                <Text className="text-[11px] text-slate-500 font-medium">
                  {user.company}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
            >
              <Feather name="x" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Details */}
          <View className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4">
            <View className="flex-row items-center mb-2">
              <Feather name="mail" size={13} color="#64748B" />
              <Text className="text-xs text-slate-600 font-medium ml-2">
                {user.email}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="phone" size={13} color="#64748B" />
              <Text className="text-xs text-slate-600 font-medium ml-2">
                {user.phone}
              </Text>
            </View>
          </View>

          {/* Summary Mini Stats */}
          {statistics && (
            <View className="flex-row justify-between mb-4">
              <View className="w-[48%] bg-white border border-slate-200 rounded-xl p-3 items-center">
                <Text className="text-lg font-black text-[#172B4D]">
                  {statistics.activeProjects}
                </Text>
                <Text className="text-[10px] font-semibold text-slate-500">
                  Active Sites Managed
                </Text>
              </View>
              <View className="w-[48%] bg-white border border-slate-200 rounded-xl p-3 items-center">
                <Text className="text-lg font-black text-[#172B4D]">
                  {statistics.totalWorkers}
                </Text>
                <Text className="text-[10px] font-semibold text-slate-500">
                  Total Site Workers
                </Text>
              </View>
            </View>
          )}

          {/* Open App Settings Button */}
          <TouchableOpacity
            onPress={handleOpenSettings}
            activeOpacity={0.8}
            className="w-full bg-[#172B4D] rounded-xl py-3.5 flex-row items-center justify-center shadow-sm"
          >
            <Feather name="settings" size={15} color="#FFFFFF" />
            <Text className="text-xs font-bold text-white uppercase tracking-wider ml-2">
              Open App Settings & Preferences
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
