import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * Section 3: Project Overview
 * Shows project name, location, status, completion progress bar,
 * and allows switching between active construction sites.
 */
export default function ProjectOverviewCard({
  projects = [],
  selectedProjectId,
  onSelectProject,
  onViewProjectDetails,
}) {
  const [activeId, setActiveId] = useState(
    selectedProjectId || (projects.length > 0 ? projects[0].id : null)
  );

  const currentProject =
    projects.find((p) => p.id === (selectedProjectId || activeId)) ||
    projects[0];

  const handleSelect = (id) => {
    setActiveId(id);
    if (onSelectProject) {
      onSelectProject(id);
    }
  };

  if (!currentProject) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ahead of Schedule':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
        };
      case 'Behind Schedule':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-600',
        };
      default:
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-[#F97316]',
        };
    }
  };

  const badge = getStatusBadge(currentProject.status);

  return (
    <View className="mb-5">
      <View className="flex-row items-center justify-between mb-2.5">
        <Text className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
          Project Overview
        </Text>
        <Text className="text-[11px] text-slate-400 font-medium">
          {projects.length} Sites Monitored
        </Text>
      </View>

      {/* Horizontal Project Switcher Pills */}
      {projects.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3"
          contentContainerStyle={{ paddingRight: 8 }}
        >
          {projects.map((proj) => {
            const isSelected = proj.id === currentProject.id;
            return (
              <TouchableOpacity
                key={proj.id}
                onPress={() => handleSelect(proj.id)}
                activeOpacity={0.7}
                className={`mr-2 px-3 py-1.5 rounded-lg border ${
                  isSelected
                    ? 'bg-[#172B4D] border-[#172B4D]'
                    : 'bg-white border-slate-200'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  {proj.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Active Project Card */}
      <View className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        {/* Header: Project Name & Status Badge */}
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1 mr-2">
            <View className="flex-row items-center mb-1">
              <View className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mr-2">
                <Text className="text-[10px] font-bold text-slate-700">
                  {currentProject.code || 'SITE'}
                </Text>
              </View>
              <Text className="text-xs font-medium text-slate-400">
                {currentProject.leadContractor}
              </Text>
            </View>
            <Text className="text-base font-bold text-[#172B4D]">
              {currentProject.name}
            </Text>
          </View>

          <View className={`px-2 py-0.5 rounded border ${badge.bg} ${badge.border}`}>
            <Text className={`text-[11px] font-bold ${badge.text}`}>
              {currentProject.status}
            </Text>
          </View>
        </View>

        {/* Location Row */}
        <View className="flex-row items-center mb-3">
          <Feather name="map-pin" size={13} color="#6B778C" />
          <Text className="text-xs text-slate-500 font-medium ml-1.5 flex-1" numberOfLines={1}>
            {currentProject.location}
          </Text>
        </View>

        {/* Progress Bar & Percentage */}
        <View className="mb-3">
          <View className="flex-row items-baseline justify-between mb-1.5">
            <Text className="text-xs font-bold text-[#172B4D]">
              Completion Progress
            </Text>
            <Text className="text-sm font-black text-[#F97316]">
              {currentProject.progress}%
            </Text>
          </View>

          <View className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <View
              className="h-full bg-[#F97316] rounded-full"
              style={{ width: `${Math.min(Math.max(currentProject.progress, 0), 100)}%` }}
            />
          </View>
        </View>

        {/* Details Footer: Current Phase & Target Date */}
        <View className="pt-2.5 border-t border-slate-100 flex-row items-center justify-between">
          <View className="flex-1 mr-2">
            <Text className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Current Phase
            </Text>
            <Text className="text-xs font-semibold text-[#172B4D]" numberOfLines={1}>
              {currentProject.activePhase || 'Structural & Framing'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => onViewProjectDetails && onViewProjectDetails(currentProject)}
            activeOpacity={0.7}
            className="flex-row items-center bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg"
          >
            <Feather name="calendar" size={12} color="#172B4D" />
            <Text className="text-[11px] font-bold text-[#172B4D] ml-1.5">
              Due: {currentProject.targetDate}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
