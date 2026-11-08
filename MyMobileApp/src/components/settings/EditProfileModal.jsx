import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { settingsService } from '../../services/settingsService';

export default function EditProfileModal({
  visible,
  profile,
  onSave,
  onClose,
}) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <EditProfileForm
        profile={profile}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
}

function EditProfileForm({ profile, onSave, onClose }) {
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [emergencyContact, setEmergencyContact] = useState(profile?.emergencyContact || '');
  const [role, setRole] = useState(profile?.role || '');
  const [department, setDepartment] = useState(profile?.department || '');
  const [site, setSite] = useState(profile?.site || '');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setErrorMessage('');

    const updatedData = {
      name,
      email,
      phone,
      address,
      emergencyContact,
      role,
      department,
      site,
    };

    const validation = settingsService.validateProfile(updatedData);
    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(updatedData);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-black/60 justify-end">
      <View className="bg-white rounded-t-3xl max-h-[90%] p-5 border-t border-slate-200">
        {/* Header */}
        <View className="flex-row items-center justify-between pb-3.5 border-b border-slate-100">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 items-center justify-center mr-3">
              <Feather name="user-check" size={20} color="#F97316" />
            </View>
            <View>
              <Text className="text-base font-black text-[#172B4D]">
                Edit Personal Information
              </Text>
              <Text className="text-xs text-slate-500 font-medium">
                Update your contact and operational profile
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

        {/* Validation Error Banner */}
        {errorMessage ? (
          <View className="bg-rose-50 border border-rose-200 rounded-xl p-3 my-3 flex-row items-center">
            <Feather name="alert-circle" size={16} color="#E11D48" />
            <Text className="text-xs text-rose-700 font-semibold ml-2 flex-1">
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {/* Scrollable Form Fields */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="my-3"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Section: Personal Information */}
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Contact & Personal Details
          </Text>

          {/* Full Name */}
          <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Full Name *
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Marcus Vance"
            placeholderTextColor="#94A3B8"
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] font-semibold mb-3"
          />

          {/* Email Address */}
          <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Email Address *
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="e.g. marcus.vance@structuramad.com"
            placeholderTextColor="#94A3B8"
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] font-semibold mb-3"
          />

          {/* Phone Number */}
          <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Phone Number *
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="e.g. +1 (555) 782-9014"
            placeholderTextColor="#94A3B8"
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] font-semibold mb-3"
          />

          {/* Residential Address */}
          <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Residential Address *
          </Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="e.g. 742 Skyline Way, Suite 4B, Metro District"
            placeholderTextColor="#94A3B8"
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] font-semibold mb-3"
          />

          {/* Emergency Contact */}
          <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Emergency Contact (Name & Phone) *
          </Text>
          <TextInput
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            placeholder="e.g. Sarah Vance (+1 555-903-4412, Spouse)"
            placeholderTextColor="#94A3B8"
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] font-semibold mb-4"
          />

          {/* Section: Operational Role */}
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Construction Site & Role
          </Text>

          {/* Job Role / Designation */}
          <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Designation / Job Role
          </Text>
          <TextInput
            value={role}
            onChangeText={setRole}
            placeholder="e.g. Lead Structural Specialist"
            placeholderTextColor="#94A3B8"
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] font-semibold mb-3"
          />

          {/* Department */}
          <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Department
          </Text>
          <TextInput
            value={department}
            onChangeText={setDepartment}
            placeholder="e.g. Quality Assurance & Civil Works"
            placeholderTextColor="#94A3B8"
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] font-semibold mb-3"
          />

          {/* Construction Site */}
          <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Assigned Construction Site
          </Text>
          <TextInput
            value={site}
            onChangeText={setSite}
            placeholder="e.g. Skyline Commercial Tower"
            placeholderTextColor="#94A3B8"
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] font-semibold mb-2"
          />
        </ScrollView>

        {/* Action Buttons */}
        <View className="pt-3 border-t border-slate-100 flex-row space-x-3">
          <TouchableOpacity
            onPress={onClose}
            disabled={isSaving}
            activeOpacity={0.7}
            className="flex-1 py-3 rounded-xl border border-slate-200 bg-slate-50 items-center mr-2"
          >
            <Text className="text-xs font-bold text-slate-600">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
            className="flex-1 py-3 rounded-xl bg-orange-500 items-center flex-row justify-center shadow-sm"
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
            ) : (
              <Feather name="check" size={15} color="#FFFFFF" className="mr-1.5" />
            )}
            <Text className="text-white text-xs font-bold ml-1.5">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
