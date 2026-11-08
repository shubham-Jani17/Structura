import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AVATAR_OPTIONS } from '../../services/settingsService';

export default function AvatarPickerModal({
  visible,
  currentAvatar,
  onSelectAvatar,
  onClose,
}) {
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
              <View className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 items-center justify-center mr-3">
                <Feather name="camera" size={20} color="#F97316" />
              </View>
              <View>
                <Text className="text-base font-black text-[#172B4D]">
                  Update Profile Photo
                </Text>
                <Text className="text-xs text-slate-500 font-medium">
                  Select a site personnel avatar
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

          {/* Avatar Gallery */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="my-3"
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Available Profile Avatars
            </Text>

            <View className="flex-row flex-wrap justify-between">
              {AVATAR_OPTIONS.map((opt) => {
                const isSelected = currentAvatar === opt.uri;

                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => {
                      onSelectAvatar(opt.uri);
                      onClose();
                    }}
                    activeOpacity={0.8}
                    className={`w-[48.5%] p-3 mb-3 rounded-2xl border items-center ${
                      isSelected
                        ? 'bg-orange-50/70 border-orange-400'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <View className="relative mb-2">
                      <Image
                        source={{ uri: opt.uri }}
                        className="w-20 h-20 rounded-full bg-slate-200 border-2 border-white shadow-sm"
                        resizeMode="cover"
                      />
                      {isSelected ? (
                        <View className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-orange-500 items-center justify-center border-2 border-white">
                          <Feather name="check" size={13} color="#FFFFFF" />
                        </View>
                      ) : null}
                    </View>

                    <Text
                      numberOfLines={1}
                      className="text-xs font-bold text-[#172B4D] text-center"
                    >
                      {opt.label}
                    </Text>
                    <Text className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {isSelected ? 'Active Avatar' : 'Tap to Select'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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
