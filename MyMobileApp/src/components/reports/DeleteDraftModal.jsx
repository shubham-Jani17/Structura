import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function DeleteDraftModal({
  visible,
  report,
  onConfirmDelete,
  onClose,
}) {
  if (!report) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 items-center justify-center p-5">
        <View className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-200 shadow-xl items-center">
          <View className="w-14 h-14 rounded-2xl bg-rose-100 items-center justify-center mb-3">
            <Feather name="trash-2" size={26} color="#E11D48" />
          </View>

          <Text className="text-base font-black text-[#172B4D] text-center mb-1">
            Delete Draft Report?
          </Text>

          <Text className="text-xs text-slate-500 text-center font-medium leading-relaxed mb-4">
            Are you sure you want to delete draft{' '}
            <Text className="font-bold text-[#172B4D]">{report.id}</Text> for{' '}
            <Text className="font-bold text-[#172B4D]">{report.siteName}</Text>?
            This action cannot be undone.
          </Text>

          <View className="w-full space-y-2">
            <TouchableOpacity
              onPress={() => onConfirmDelete(report.id)}
              activeOpacity={0.8}
              className="w-full py-3.5 rounded-2xl bg-rose-600 items-center justify-center mb-2 shadow-sm"
            >
              <Text className="text-white text-xs font-black uppercase tracking-wider">
                Delete Draft
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="w-full py-3 rounded-2xl bg-slate-100 items-center justify-center"
            >
              <Text className="text-slate-700 text-xs font-bold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
