import React from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function NotificationsModal({
  visible,
  onClose,
  notifications = [],
  onMarkAllAsRead,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-3xl pt-5 pb-8 px-5 border-t border-slate-200 max-h-[80%]"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 items-center justify-center mr-2">
                <Feather name="bell" size={17} color="#F97316" />
              </View>
              <Text className="text-base font-bold text-[#172B4D]">
                Site Notifications
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
            >
              <Feather name="x" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Mark All Read Button */}
          {notifications.some((n) => n.unread) && (
            <TouchableOpacity
              onPress={onMarkAllAsRead}
              activeOpacity={0.7}
              className="mb-3 self-end flex-row items-center bg-slate-100 px-2.5 py-1 rounded-md"
            >
              <Feather name="check" size={12} color="#172B4D" />
              <Text className="text-[11px] font-bold text-[#172B4D] ml-1">
                Mark all as read
              </Text>
            </TouchableOpacity>
          )}

          {/* List */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <View className="py-8 items-center justify-center">
                <Feather name="check-circle" size={28} color="#10B981" />
                <Text className="text-xs text-slate-500 font-medium mt-2">
                  All caught up! Zero unread notifications.
                </Text>
              </View>
            ) : (
              notifications.map((item) => (
                <View
                  key={item.id}
                  className={`p-3.5 rounded-xl border mb-2.5 ${
                    item.unread
                      ? 'bg-orange-50/30 border-orange-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <View className="flex-row items-start justify-between mb-1">
                    <Text className="text-xs font-bold text-[#172B4D] flex-1 mr-2">
                      {item.title}
                    </Text>
                    <Text className="text-[10px] text-slate-400">
                      {item.time}
                    </Text>
                  </View>
                  <Text className="text-xs text-slate-600 font-normal leading-relaxed">
                    {item.message}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
