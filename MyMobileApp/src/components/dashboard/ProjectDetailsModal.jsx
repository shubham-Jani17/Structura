import React from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ProjectDetailsModal({ visible, onClose, project }) {
  if (!project) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-3xl pt-5 pb-8 px-5 border-t border-slate-200 max-h-[85%]"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 items-center justify-center mr-2">
                <Feather name="briefcase" size={17} color="#F97316" />
              </View>
              <Text className="text-base font-bold text-[#172B4D]" numberOfLines={1}>
                {project.name}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
            >
              <Feather name="x" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Project Code & Status */}
            <View className="flex-row items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3">
              <View>
                <Text className="text-[10px] text-slate-400 font-semibold uppercase">
                  Project Code
                </Text>
                <Text className="text-xs font-bold text-[#172B4D]">
                  {project.code}
                </Text>
              </View>
              <View className="bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                <Text className="text-[11px] font-bold text-[#F97316]">
                  {project.status}
                </Text>
              </View>
            </View>

            {/* Location */}
            <View className="mb-3">
              <Text className="text-xs font-semibold text-slate-700 mb-1">
                Site Location
              </Text>
              <View className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex-row items-center">
                <Feather name="map-pin" size={14} color="#6B778C" />
                <Text className="text-xs text-slate-600 font-medium ml-2">
                  {project.location}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="mb-3">
              <View className="flex-row items-baseline justify-between mb-1">
                <Text className="text-xs font-semibold text-slate-700">
                  Overall Completion
                </Text>
                <Text className="text-sm font-black text-[#F97316]">
                  {project.progress}%
                </Text>
              </View>
              <View className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <View
                  className="h-full bg-[#F97316] rounded-full"
                  style={{ width: `${Math.min(Math.max(project.progress, 0), 100)}%` }}
                />
              </View>
            </View>

            {/* Grid details */}
            <View className="flex-row justify-between mb-4">
              <View className="w-[48%] bg-slate-50 border border-slate-200 rounded-xl p-3">
                <Text className="text-[10px] text-slate-400 font-semibold uppercase">
                  Target Completion
                </Text>
                <Text className="text-xs font-bold text-[#172B4D] mt-0.5">
                  {project.targetDate}
                </Text>
              </View>
              <View className="w-[48%] bg-slate-50 border border-slate-200 rounded-xl p-3">
                <Text className="text-[10px] text-slate-400 font-semibold uppercase">
                  Project Budget
                </Text>
                <Text className="text-xs font-bold text-[#172B4D] mt-0.5">
                  {project.budget}
                </Text>
              </View>
            </View>

            {/* Active Phase */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-slate-700 mb-1">
                Active Construction Phase
              </Text>
              <View className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <Text className="text-xs font-bold text-[#172B4D]">
                  {project.activePhase}
                </Text>
                <Text className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Contractor: {project.leadContractor}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              className="w-full bg-[#172B4D] rounded-xl py-3.5 items-center justify-center shadow-sm"
            >
              <Text className="text-xs font-bold text-white uppercase tracking-wider">
                Close Project Details
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
