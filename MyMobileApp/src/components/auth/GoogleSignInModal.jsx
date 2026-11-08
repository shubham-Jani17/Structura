import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import GoogleIcon from './GoogleIcon';
import { MOCK_GOOGLE_ACCOUNTS } from '../../services/authService';

export default function GoogleSignInModal({
  visible,
  onClose,
  onSelectAccount,
}) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customError, setCustomError] = useState('');

  const handleCustomSubmit = () => {
    setCustomError('');
    const email = customEmail.trim().toLowerCase();
    const name = customName.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setCustomError('Please enter a valid Google email address.');
      return;
    }

    const initials = name
      ? name.slice(0, 2).toUpperCase()
      : email.slice(0, 2).toUpperCase();

    onSelectAccount({
      id: `GGL-CUSTOM-${Date.now().toString().slice(-4)}`,
      name: name || email.split('@')[0],
      email,
      role: 'Site Specialist',
      avatarInitials: initials,
    });
    setCustomEmail('');
    setCustomName('');
    setShowCustomInput(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[85%] p-6 border-t border-slate-200">
          {/* Google Header */}
          <View className="items-center pb-4 border-b border-slate-100">
            <GoogleIcon size={32} />
            <Text className="text-base font-black text-[#172B4D] mt-2">
              Sign in with Google
            </Text>
            <Text className="text-xs text-slate-500 font-medium">
              Choose an account to continue to <Text className="font-bold text-[#172B4D]">Structura</Text>
            </Text>
          </View>

          {/* Simulation Notice */}
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 my-3 flex-row items-center">
            <Feather name="info" size={14} color="#2563EB" />
            <Text className="text-[10px] text-blue-800 font-medium ml-2 flex-1 leading-snug">
              Simulated OAuth environment for field verification. Enterprise Google Sign-In ready.
            </Text>
          </View>

          {/* Account Selection List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="my-1"
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {MOCK_GOOGLE_ACCOUNTS.map((account) => (
              <TouchableOpacity
                key={account.id}
                onPress={() => onSelectAccount(account)}
                activeOpacity={0.7}
                className="flex-row items-center p-3 mb-2 rounded-2xl bg-slate-50 border border-slate-200"
              >
                {account.avatarUrl ? (
                  <Image
                    source={{ uri: account.avatarUrl }}
                    className="w-10 h-10 rounded-full bg-slate-200 mr-3 border border-white"
                  />
                ) : (
                  <View className="w-10 h-10 rounded-full bg-[#172B4D] items-center justify-center mr-3">
                    <Text className="text-white text-xs font-bold">
                      {account.avatarInitials}
                    </Text>
                  </View>
                )}

                <View className="flex-1 mr-2">
                  <Text className="text-xs font-bold text-[#172B4D]">
                    {account.name}
                  </Text>
                  <Text className="text-[11px] text-slate-500 font-medium">
                    {account.email}
                  </Text>
                </View>

                <View className="bg-slate-200/70 px-2 py-0.5 rounded-md">
                  <Text className="text-[9px] font-bold text-slate-700">
                    {account.role}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Custom Account Option */}
            {!showCustomInput ? (
              <TouchableOpacity
                onPress={() => setShowCustomInput(true)}
                activeOpacity={0.7}
                className="flex-row items-center p-3 rounded-2xl border border-dashed border-slate-300 bg-white mt-1"
              >
                <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3">
                  <Feather name="user-plus" size={16} color="#64748B" />
                </View>
                <Text className="text-xs font-bold text-[#172B4D]">
                  Use another Google account...
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mt-1">
                <Text className="text-xs font-bold text-[#172B4D] mb-2">
                  Enter Google Credentials
                </Text>

                {customError ? (
                  <Text className="text-[11px] text-rose-600 font-semibold mb-2">
                    {customError}
                  </Text>
                ) : null}

                <TextInput
                  value={customName}
                  onChangeText={setCustomName}
                  placeholder="Your Name (optional)"
                  placeholderTextColor="#94A3B8"
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#172B4D] font-medium mb-2"
                />

                <TextInput
                  value={customEmail}
                  onChangeText={setCustomEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="your.email@gmail.com"
                  placeholderTextColor="#94A3B8"
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#172B4D] font-medium mb-2.5"
                />

                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={() => setShowCustomInput(false)}
                    className="flex-1 bg-slate-200 py-2 rounded-xl items-center mr-2"
                  >
                    <Text className="text-xs font-bold text-slate-700">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCustomSubmit}
                    className="flex-1 bg-[#172B4D] py-2 rounded-xl items-center"
                  >
                    <Text className="text-xs font-bold text-white">Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Cancel */}
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
