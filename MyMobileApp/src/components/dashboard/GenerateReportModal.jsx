import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function GenerateReportModal({
  visible,
  onClose,
  onReportGenerated,
  projects = [],
}) {
  const [reportType, setReportType] = useState('Daily Progress Log');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { id: '1', title: 'Daily Progress Log', desc: 'Site work, trades, weather, active phases' },
    { id: '2', title: 'Safety & Hazard Audit', desc: 'Incidents, toolbox talks, compliance checks' },
    { id: '3', title: 'Material & Inventory Log', desc: 'Deliveries, usages, remaining yard stock' },
    { id: '4', title: 'Labor & Shift Summary', desc: 'Headcount, contractor hours, shift notes' },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onReportGenerated({
        id: `rep_${Date.now()}`,
        title: `${reportType} Generated`,
        category: 'Reports',
        description: `Official PDF exported for ${projects[0]?.name || 'Skyline Tower'}. Ready for submission.`,
        timestamp: 'Just now',
        author: 'Alex Mercer (Lead PM)',
        tag: 'Official Export',
      });
      onClose();
    }, 400);
  };

  const handleOpenReports = () => {
    onClose();
    router.push('/(tabs)/reports');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-3xl pt-5 pb-8 px-5 border-t border-slate-200"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 items-center justify-center mr-2">
                <Feather name="file-text" size={17} color="#F97316" />
              </View>
              <Text className="text-base font-bold text-[#172B4D]">
                Generate Site Report
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
            >
              <Feather name="x" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Report Type Selection */}
          <View className="mb-4">
            <Text className="text-xs font-semibold text-slate-700 mb-2">
              Select Report Template:
            </Text>
            {reportTypes.map((item) => {
              const isSelected = reportType === item.title;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setReportType(item.title)}
                  activeOpacity={0.7}
                  className={`p-3 rounded-xl border mb-2 flex-row items-center justify-between ${
                    isSelected
                      ? 'bg-orange-50/50 border-[#F97316]'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <View className="flex-1 mr-2">
                    <Text className="text-xs font-bold text-[#172B4D]">
                      {item.title}
                    </Text>
                    <Text className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {item.desc}
                    </Text>
                  </View>
                  <View
                    className={`w-4 h-4 rounded-full border items-center justify-center ${
                      isSelected
                        ? 'border-[#F97316] bg-[#F97316]'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <View className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            onPress={handleGenerate}
            disabled={isGenerating}
            activeOpacity={0.8}
            className="w-full bg-[#172B4D] rounded-xl py-3.5 items-center justify-center mb-2.5 shadow-sm"
          >
            <Text className="text-xs font-bold text-white uppercase tracking-wider">
              {isGenerating ? 'Compiling PDF...' : 'Compile & Export Report'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleOpenReports}
            activeOpacity={0.7}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 items-center justify-center"
          >
            <Text className="text-xs font-semibold text-[#172B4D]">
              Open Reports Vault & Past Submissions
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
