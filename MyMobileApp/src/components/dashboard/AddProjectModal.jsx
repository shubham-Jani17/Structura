import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function AddProjectModal({ visible, onClose, onAddProject }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;

    const newProject = {
      id: `proj_${Date.now()}`,
      name: name.trim(),
      code: code.trim() || `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      location: location.trim() || 'Sector Site Yard',
      status: 'In Progress',
      progress: 0,
      targetDate: targetDate.trim() || 'TBD 2027',
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      budget: budget.trim() || '$1.0M',
      leadContractor: 'Apex Build Corp.',
      activePhase: 'Site Mobilization & Prep',
    };

    onAddProject(newProject);
    setName('');
    setCode('');
    setLocation('');
    setBudget('');
    setTargetDate('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            className="bg-white rounded-t-3xl pt-5 pb-8 px-5 border-t border-slate-200 max-h-[85%]"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 items-center justify-center mr-2">
                  <Feather name="folder-plus" size={17} color="#172B4D" />
                </View>
                <Text className="text-base font-bold text-[#172B4D]">
                  Create New Project
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
              {/* Project Name */}
              <View className="mb-3">
                <Text className="text-xs font-semibold text-slate-700 mb-1">
                  Project Title *
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Westside Logistics Park"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#172B4D] font-medium"
                />
              </View>

              {/* Code & Budget Row */}
              <View className="flex-row justify-between mb-3">
                <View className="w-[48%]">
                  <Text className="text-xs font-semibold text-slate-700 mb-1">
                    Project Code
                  </Text>
                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder="e.g. WLP-2026"
                    placeholderTextColor="#94A3B8"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#172B4D] font-medium"
                  />
                </View>
                <View className="w-[48%]">
                  <Text className="text-xs font-semibold text-slate-700 mb-1">
                    Estimated Budget
                  </Text>
                  <TextInput
                    value={budget}
                    onChangeText={setBudget}
                    placeholder="e.g. $8.5M"
                    placeholderTextColor="#94A3B8"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#172B4D] font-medium"
                  />
                </View>
              </View>

              {/* Location */}
              <View className="mb-3">
                <Text className="text-xs font-semibold text-slate-700 mb-1">
                  Site Location
                </Text>
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="e.g. Industrial Sector 9, Expressway"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#172B4D] font-medium"
                />
              </View>

              {/* Target Date */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-slate-700 mb-1">
                  Completion Target Date
                </Text>
                <TextInput
                  value={targetDate}
                  onChangeText={setTargetDate}
                  placeholder="e.g. Nov 30, 2027"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#172B4D] font-medium"
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.8}
                className="w-full bg-[#172B4D] rounded-xl py-3.5 items-center justify-center shadow-sm"
              >
                <Text className="text-xs font-bold text-white uppercase tracking-wider">
                  Save Construction Project
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
