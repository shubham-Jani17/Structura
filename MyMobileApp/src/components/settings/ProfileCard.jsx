import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ProfileCard({
  profile,
  onOpenAvatarPicker,
  onOpenEditProfile,
}) {
  return (
    <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
      {/* Top Banner & Avatar Row */}
      <View className="flex-row items-center mb-4">
        {/* Profile Avatar with Camera Badge */}
        <View className="relative mr-4">
          {profile.avatar ? (
            <Image
              source={{ uri: profile.avatar }}
              className="w-18 h-18 rounded-full bg-slate-200 border-2 border-slate-100 shadow-sm"
              style={{ width: 72, height: 72, borderRadius: 36 }}
              resizeMode="cover"
            />
          ) : (
            <View
              className="w-18 h-18 rounded-full bg-[#172B4D] items-center justify-center border-2 border-slate-100 shadow-sm"
              style={{ width: 72, height: 72, borderRadius: 36 }}
            >
              <Text className="text-white text-xl font-black">
                {profile.avatarInitials || 'MV'}
              </Text>
            </View>
          )}

          {/* Quick Camera Update Button */}
          <TouchableOpacity
            onPress={onOpenAvatarPicker}
            activeOpacity={0.8}
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-orange-500 items-center justify-center border-2 border-white shadow-xs"
          >
            <Feather name="camera" size={12} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Name & Role */}
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text
              numberOfLines={1}
              className="text-lg font-black text-[#172B4D] mr-2"
            >
              {profile.name}
            </Text>
          </View>

          <View className="bg-orange-50 self-start px-2 py-0.5 rounded-md border border-orange-200 mb-1">
            <Text className="text-[10px] font-bold text-orange-700">
              {profile.employeeId || profile.id}
            </Text>
          </View>

          <Text
            numberOfLines={1}
            className="text-xs text-slate-600 font-semibold"
          >
            {profile.role}
          </Text>
        </View>
      </View>

      {/* Organization & Site Badges */}
      <View className="bg-slate-50 rounded-2xl p-3 border border-slate-200 mb-3.5 space-y-2">
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center flex-1 mr-2">
            <Feather name="briefcase" size={13} color="#64748B" />
            <Text className="text-[11px] text-slate-500 font-medium ml-1.5">
              Department:
            </Text>
          </View>
          <Text
            numberOfLines={1}
            className="text-[11px] font-bold text-[#172B4D]"
          >
            {profile.department}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-2">
            <Feather name="map-pin" size={13} color="#F97316" />
            <Text className="text-[11px] text-slate-500 font-medium ml-1.5">
              Assigned Site:
            </Text>
          </View>
          <Text
            numberOfLines={1}
            className="text-[11px] font-bold text-orange-600"
          >
            {profile.site}
          </Text>
        </View>
      </View>

      {/* Personal Contact Details Summary */}
      <View className="border-t border-slate-100 pt-3 mb-3.5 space-y-2">
        <View className="flex-row items-center justify-between mb-1.5">
          <View className="flex-row items-center">
            <Feather name="mail" size={12} color="#64748B" />
            <Text className="text-[11px] text-slate-500 font-medium ml-2">
              Email:
            </Text>
          </View>
          <Text className="text-[11px] font-semibold text-[#172B4D]">
            {profile.email}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mb-1.5">
          <View className="flex-row items-center">
            <Feather name="phone" size={12} color="#64748B" />
            <Text className="text-[11px] text-slate-500 font-medium ml-2">
              Phone:
            </Text>
          </View>
          <Text className="text-[11px] font-semibold text-[#172B4D]">
            {profile.phone}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mb-1.5">
          <View className="flex-row items-center flex-1 mr-2">
            <Feather name="home" size={12} color="#64748B" />
            <Text className="text-[11px] text-slate-500 font-medium ml-2">
              Address:
            </Text>
          </View>
          <Text
            numberOfLines={1}
            className="text-[11px] font-semibold text-[#172B4D] max-w-[190px]"
          >
            {profile.address}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-2">
            <Feather name="shield" size={12} color="#E11D48" />
            <Text className="text-[11px] text-slate-500 font-medium ml-2">
              Emergency:
            </Text>
          </View>
          <Text
            numberOfLines={1}
            className="text-[11px] font-semibold text-rose-700 max-w-[190px]"
          >
            {profile.emergencyContact}
          </Text>
        </View>
      </View>

      {/* Edit Profile Action Button */}
      <TouchableOpacity
        onPress={onOpenEditProfile}
        activeOpacity={0.8}
        className="bg-slate-50 border border-slate-200 py-3 rounded-2xl items-center flex-row justify-center"
      >
        <Feather name="edit-2" size={14} color="#172B4D" />
        <Text className="text-[#172B4D] text-xs font-bold ml-2">
          Edit Personal Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}
