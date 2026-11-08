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

export default function AddWorkerModal({ visible, onClose, onAddWorker, projects = [] }) {
  const [name, setName] = useState('');
  const [trade, setTrade] = useState('Steel Fixing');
  const [phone, setPhone] = useState('');
  const [selectedSite, setSelectedSite] = useState(
    projects.length > 0 ? projects[0].name : 'Skyline Tower'
  );

  const trades = [
    'Steel Fixing',
    'Carpentry & Formwork',
    'Masonry & Concrete',
    'Electrical & Wiring',
    'Plumbing & MEP',
    'Heavy Equipment Operator',
  ];

  const handleSubmit = () => {
    if (!name.trim()) return;

    const worker = {
      id: `wrk_${Date.now()}`,
      name: name.trim(),
      trade,
      phone: phone.trim() || '+1 (555) 000-0000',
      assignedSite: selectedSite,
      status: 'Present',
    };

    onAddWorker(worker);
    setName('');
    setPhone('');
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
                <View className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 items-center justify-center mr-2">
                  <Feather name="user-plus" size={17} color="#0284C7" />
                </View>
                <Text className="text-base font-bold text-[#172B4D]">
                  Register Site Worker
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
              {/* Full Name */}
              <View className="mb-3">
                <Text className="text-xs font-semibold text-slate-700 mb-1">
                  Worker Full Name *
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Liam Henderson"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#172B4D] font-medium"
                />
              </View>

              {/* Trade Selection */}
              <View className="mb-3">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">
                  Trade / Specialization
                </Text>
                <View className="flex-row flex-wrap">
                  {trades.map((t) => {
                    const isSelected = trade === t;
                    return (
                      <TouchableOpacity
                        key={t}
                        onPress={() => setTrade(t)}
                        activeOpacity={0.7}
                        className={`mr-2 mb-2 px-3 py-1.5 rounded-lg border ${
                          isSelected
                            ? 'bg-[#172B4D] border-[#172B4D]'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <Text
                          className={`text-[11px] font-semibold ${
                            isSelected ? 'text-white' : 'text-slate-700'
                          }`}
                        >
                          {t}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Site Assignment */}
              <View className="mb-3">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">
                  Assigned Project Site
                </Text>
                <View className="flex-row flex-wrap">
                  {projects.map((p) => {
                    const isSelected = selectedSite === p.name;
                    return (
                      <TouchableOpacity
                        key={p.id}
                        onPress={() => setSelectedSite(p.name)}
                        activeOpacity={0.7}
                        className={`mr-2 mb-2 px-3 py-1.5 rounded-lg border ${
                          isSelected
                            ? 'bg-[#172B4D] border-[#172B4D]'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <Text
                          className={`text-[11px] font-semibold ${
                            isSelected ? 'text-white' : 'text-slate-700'
                          }`}
                        >
                          {p.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Phone */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="e.g. +1 (555) 234-5678"
                  keyboardType="phone-pad"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#172B4D] font-medium"
                />
              </View>

              {/* Submit */}
              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.8}
                className="w-full bg-[#172B4D] rounded-xl py-3.5 items-center justify-center shadow-sm"
              >
                <Text className="text-xs font-bold text-white uppercase tracking-wider">
                  Save & Check-in Worker
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
