import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { APP_METADATA } from '../../services/settingsService';

export default function AppInfoCard({
  selectedLanguage,
  onOpenLanguageModal,
  onOpenPrivacyPolicy,
  onOpenTerms,
  onOpenLogoutModal,
}) {
  return (
    <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <View className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 items-center justify-center mr-2.5">
          <Feather name="info" size={16} color="#172B4D" />
        </View>
        <View>
          <Text className="text-sm font-black text-[#172B4D]">
            App Preferences & Information
          </Text>
          <Text className="text-[11px] text-slate-400 font-medium">
            Language, system diagnostics, and legal terms
          </Text>
        </View>
      </View>

      {/* Language Preference Row */}
      <TouchableOpacity
        onPress={onOpenLanguageModal}
        activeOpacity={0.7}
        className="flex-row items-center justify-between p-3.5 mb-2.5 rounded-2xl bg-slate-50 border border-slate-200"
      >
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-8 h-8 rounded-xl bg-white border border-slate-200 items-center justify-center mr-2.5">
            <Feather name="globe" size={16} color="#2563EB" />
          </View>
          <View>
            <Text className="text-xs font-bold text-[#172B4D]">
              Language
            </Text>
            <Text className="text-[11px] text-slate-500 font-medium">
              {selectedLanguage ? `${selectedLanguage.flag} ${selectedLanguage.name}` : 'English (US)'}
            </Text>
          </View>
        </View>

        <Feather name="chevron-right" size={16} color="#94A3B8" />
      </TouchableOpacity>

      {/* Privacy Policy Link */}
      <TouchableOpacity
        onPress={onOpenPrivacyPolicy}
        activeOpacity={0.7}
        className="flex-row items-center justify-between p-3.5 mb-2.5 rounded-2xl bg-slate-50 border border-slate-200"
      >
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-8 h-8 rounded-xl bg-white border border-slate-200 items-center justify-center mr-2.5">
            <Feather name="shield" size={16} color="#059669" />
          </View>
          <View>
            <Text className="text-xs font-bold text-[#172B4D]">
              Privacy Policy
            </Text>
            <Text className="text-[11px] text-slate-500 font-medium">
              Field telemetry and worker data privacy
            </Text>
          </View>
        </View>

        <Feather name="chevron-right" size={16} color="#94A3B8" />
      </TouchableOpacity>

      {/* Terms and Conditions Link */}
      <TouchableOpacity
        onPress={onOpenTerms}
        activeOpacity={0.7}
        className="flex-row items-center justify-between p-3.5 mb-3.5 rounded-2xl bg-slate-50 border border-slate-200"
      >
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-8 h-8 rounded-xl bg-white border border-slate-200 items-center justify-center mr-2.5">
            <Feather name="file-text" size={16} color="#64748B" />
          </View>
          <View>
            <Text className="text-xs font-bold text-[#172B4D]">
              Terms & Conditions
            </Text>
            <Text className="text-[11px] text-slate-500 font-medium">
              Site compliance and operating agreement
            </Text>
          </View>
        </View>

        <Feather name="chevron-right" size={16} color="#94A3B8" />
      </TouchableOpacity>

      {/* System Information Badge */}
      <View className="bg-slate-50 rounded-2xl p-3 border border-slate-200 mb-4">
        <View className="flex-row justify-between mb-1">
          <Text className="text-[10px] font-bold text-slate-500">
            Application:
          </Text>
          <Text className="text-[10px] font-black text-[#172B4D]">
            {APP_METADATA.name}
          </Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-[10px] font-bold text-slate-500">
            Version & Build:
          </Text>
          <Text className="text-[10px] font-semibold text-slate-700">
            {APP_METADATA.version} ({APP_METADATA.build})
          </Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-[10px] font-bold text-slate-500">
            Fleet Channel:
          </Text>
          <Text className="text-[10px] font-semibold text-emerald-700">
            {APP_METADATA.releaseChannel}
          </Text>
        </View>
        <View className="pt-2 border-t border-slate-200">
          <Text className="text-[9px] text-slate-400 text-center font-medium">
            {APP_METADATA.copyright}
          </Text>
        </View>
      </View>

      {/* Logout Action Button */}
      <TouchableOpacity
        onPress={onOpenLogoutModal}
        activeOpacity={0.8}
        className="bg-rose-50 border border-rose-200 py-3.5 rounded-2xl items-center flex-row justify-center"
      >
        <Feather name="log-out" size={15} color="#E11D48" />
        <Text className="text-rose-700 text-xs font-bold ml-2">
          Log Out from Structura
        </Text>
      </TouchableOpacity>
    </View>
  );
}
