import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ReportConfirmationModal({
  visible,
  report,
  onViewHistory,
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
      <View className="flex-1 bg-black/60 justify-center items-center p-5">
        <View className="bg-white rounded-3xl w-full max-w-sm p-6 border border-slate-200 shadow-xl items-center">
          {/* Success Check Icon */}
          <View className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 items-center justify-center mb-3">
            <Feather name="check" size={32} color="#059669" />
          </View>

          {/* Heading */}
          <Text className="text-lg font-black text-[#172B4D] text-center mb-1">
            Site Report Submitted!
          </Text>
          <Text className="text-xs text-slate-500 text-center font-medium mb-4">
            Daily construction report saved and registered in project vault.
          </Text>

          {/* Report Summary Card */}
          <View className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-5">
            <View className="flex-row justify-between mb-2 pb-2 border-b border-slate-200">
              <Text className="text-[11px] font-bold text-slate-500">
                Report ID:
              </Text>
              <Text className="text-[11px] font-black text-orange-600">
                {report.id}
              </Text>
            </View>

            <View className="flex-row justify-between mb-1.5">
              <Text className="text-[11px] text-slate-500 font-medium">
                Project:
              </Text>
              <Text
                numberOfLines={1}
                className="text-[11px] font-bold text-[#172B4D] max-w-[180px]"
              >
                {report.siteName}
              </Text>
            </View>

            <View className="flex-row justify-between mb-1.5">
              <Text className="text-[11px] text-slate-500 font-medium">
                Task Completion:
              </Text>
              <Text className="text-[11px] font-bold text-emerald-600">
                {report.completionPercentage}% ({report.tasks?.length} tasks)
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-[11px] text-slate-500 font-medium">
                Attachments:
              </Text>
              <Text className="text-[11px] font-bold text-slate-700">
                {report.images?.length || 0} Photos • {report.documents?.length || 0} Docs
              </Text>
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity
            onPress={onViewHistory}
            activeOpacity={0.8}
            className="w-full bg-orange-500 py-3.5 rounded-2xl items-center flex-row justify-center mb-2.5 shadow-md shadow-orange-300"
          >
            <Feather name="file-text" size={16} color="#FFFFFF" />
            <Text className="text-white text-xs font-black tracking-wide ml-2">
              View in Report History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="w-full py-2.5 rounded-xl items-center"
          >
            <Text className="text-xs font-bold text-slate-500">
              Create Another Report
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
