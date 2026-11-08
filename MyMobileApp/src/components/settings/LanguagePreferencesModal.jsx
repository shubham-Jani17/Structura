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
  AVAILABLE_LANGUAGES,
  settingsService,
} from '../../services/settingsService';

export default function LanguagePreferencesModal({
  visible,
  currentLanguage,
  onSelectLanguage,
  onClose,
}) {
  const languages = settingsService.getAvailableLanguages() || AVAILABLE_LANGUAGES;

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
              <View className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 items-center justify-center mr-3">
                <Feather name="globe" size={20} color="#2563EB" />
              </View>
              <View>
                <Text className="text-base font-black text-[#172B4D]">
                  Language Preferences
                </Text>
                <Text className="text-xs text-slate-500 font-medium">
                  Select your interface display language
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

          {/* Languages List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="my-3"
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Available Languages ({languages.length})
            </Text>

            {languages.map((lang) => {
              const isSelected = currentLanguage?.code === lang.code;

              return (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => {
                    onSelectLanguage(lang);
                    onClose();
                  }}
                  activeOpacity={0.7}
                  className={`p-3.5 mb-2.5 rounded-2xl border flex-row items-center justify-between ${
                    isSelected
                      ? 'bg-orange-50/60 border-orange-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <View className="flex-row items-center flex-1 mr-2">
                    <Text className="text-2xl mr-3">{lang.flag}</Text>
                    <View>
                      <Text className="text-xs font-black text-[#172B4D]">
                        {lang.name}
                      </Text>
                      <Text className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {lang.native}
                      </Text>
                    </View>
                  </View>

                  <View
                    className={`w-6 h-6 rounded-lg items-center justify-center border ${
                      isSelected
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected ? (
                      <Feather name="check" size={14} color="#FFFFFF" />
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer Close */}
          <View className="pt-2 border-t border-slate-100">
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="py-3 rounded-xl border border-slate-200 bg-slate-50 items-center"
            >
              <Text className="text-xs font-bold text-slate-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
