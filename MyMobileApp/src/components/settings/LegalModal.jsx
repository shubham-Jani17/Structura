import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  PRIVACY_POLICY_TEXT,
  TERMS_AND_CONDITIONS_TEXT,
} from '../../services/settingsService';

export default function LegalModal({
  visible,
  type = 'PRIVACY', // 'PRIVACY' or 'TERMS'
  onClose,
}) {
  const isPrivacy = type === 'PRIVACY';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';
  const subtitle = isPrivacy
    ? 'Construction telemetry and worker data privacy'
    : 'Site compliance and operating agreement';
  const sections = isPrivacy ? PRIVACY_POLICY_TEXT : TERMS_AND_CONDITIONS_TEXT;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[85%] p-5 border-t border-slate-200">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3.5 border-b border-slate-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 items-center justify-center mr-3">
                <Feather
                  name={isPrivacy ? 'shield' : 'file-text'}
                  size={20}
                  color="#172B4D"
                />
              </View>
              <View>
                <Text className="text-base font-black text-[#172B4D]">
                  {title}
                </Text>
                <Text className="text-xs text-slate-500 font-medium">
                  {subtitle}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
            >
              <Feather name="x" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Legal Text Sections */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="my-3"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4">
              <Text className="text-xs font-bold text-[#172B4D] mb-1">
                Enterprise Regulatory Notice
              </Text>
              <Text className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Last updated November 2026. Applicable across all active Structura
                construction sites, logistics yards, and subcontractor personnel.
              </Text>
            </View>

            {sections.map((sec, idx) => (
              <View key={idx} className="mb-4">
                <Text className="text-xs font-black text-[#172B4D] mb-1">
                  {sec.title}
                </Text>
                <Text className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  {sec.body}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Footer Close */}
          <View className="pt-2 border-t border-slate-100">
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="w-full py-3 rounded-xl bg-[#172B4D] items-center"
            >
              <Text className="text-white text-xs font-bold">
                I Understand & Agree
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
