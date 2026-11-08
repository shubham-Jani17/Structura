import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import StructuraLogo from '../../components/StructuraLogo';
import { authService, REFERENCE_USER } from '../../services/authService';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'ios' ? 16 : 24);
  const bottomInset = Math.max(insets.bottom, 16);

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  const handleSendResetLink = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await authService.requestPasswordReset(email);
      setSuccessInfo(result);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to process password reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseReferenceEmail = () => {
    setEmail(REFERENCE_USER.email);
    setErrorMessage('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: topInset,
          paddingBottom: bottomInset + 20,
          paddingHorizontal: 20,
        }}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-xl bg-slate-100 items-center justify-center mb-4"
        >
          <Feather name="arrow-left" size={18} color="#172B4D" />
        </TouchableOpacity>

        {/* Structura Brand Header */}
        <View className="items-center mt-2 mb-6">
          <StructuraLogo size={58} />
          <Text className="text-xl font-black text-[#172B4D] tracking-tight mt-2.5">
            Structura
          </Text>
        </View>

        {successInfo ? (
          /* Success Confirmation State */
          <View className="bg-slate-50 border border-emerald-200 rounded-3xl p-6 items-center">
            <View className="w-14 h-14 rounded-2xl bg-emerald-100 items-center justify-center mb-4">
              <Feather name="check-circle" size={28} color="#059669" />
            </View>
            <Text className="text-lg font-black text-[#172B4D] text-center mb-2">
              Reset Link Dispatched
            </Text>
            <Text className="text-xs text-slate-600 text-center leading-relaxed mb-4">
              {successInfo.message}
            </Text>

            <View className="bg-white border border-slate-200 rounded-2xl px-4 py-3 w-full mb-5 flex-row items-center">
              <Feather name="mail" size={15} color="#059669" />
              <Text className="text-xs font-bold text-slate-700 ml-2.5 flex-1" numberOfLines={1}>
                {successInfo.email}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.replace('/(auth)/login')}
              activeOpacity={0.8}
              className="bg-[#172B4D] py-3.5 px-6 rounded-2xl w-full items-center mb-2.5 shadow-sm"
            >
              <Text className="text-white text-xs font-black uppercase tracking-wider">
                Return to Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSuccessInfo(null);
                setEmail('');
              }}
              activeOpacity={0.7}
              className="py-2"
            >
              <Text className="text-xs font-bold text-slate-500">
                Enter another email
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Password Reset Request Form */
          <View>
            {/* Title & Description */}
            <View className="mb-5">
              <Text className="text-2xl font-black text-[#172B4D] tracking-tight">
                Reset Password
              </Text>
              <Text className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Enter your registered corporate or personal email address. We&apos;ll send you a secure verification link to recover access.
              </Text>
            </View>

            {/* Quick helper for reference admin */}
            <TouchableOpacity
              onPress={handleUseReferenceEmail}
              activeOpacity={0.7}
              className="bg-orange-50/70 border border-orange-200 rounded-2xl p-3 mb-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-7 h-7 rounded-lg bg-orange-500 items-center justify-center mr-2">
                  <Feather name="info" size={13} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-[11px] font-bold text-orange-950">
                    Test Reference Account
                  </Text>
                  <Text className="text-[10px] text-orange-800/80 font-medium">
                    {REFERENCE_USER.email}
                  </Text>
                </View>
              </View>
              <View className="bg-white border border-orange-200 px-2.5 py-1 rounded-lg">
                <Text className="text-[10px] font-bold text-orange-600">
                  Insert
                </Text>
              </View>
            </TouchableOpacity>

            {/* Error Banner */}
            {errorMessage ? (
              <View className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-4 flex-row items-center">
                <Feather name="alert-circle" size={16} color="#E11D48" />
                <Text className="text-xs text-rose-700 font-semibold ml-2.5 flex-1 leading-snug">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* Email Input */}
            <View className="mb-5">
              <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Registered Email Address
              </Text>
              <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 flex-row items-center">
                <Feather name="mail" size={16} color="#94A3B8" />
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="name@structuramad.com"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 text-xs text-[#172B4D] font-semibold ml-2.5"
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSendResetLink}
              disabled={isLoading}
              activeOpacity={0.8}
              className="bg-[#172B4D] py-4 rounded-2xl items-center flex-row justify-center mb-4 shadow-md shadow-slate-300"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
              ) : (
                <Feather name="send" size={16} color="#FFFFFF" className="mr-2" />
              )}
              <Text className="text-white text-xs font-black uppercase tracking-wider ml-1">
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>

            {/* Back to Login Link */}
            <View className="flex-row items-center justify-center mt-2">
              <Text className="text-xs text-slate-500 font-medium">
                Remember your password?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => router.replace('/(auth)/login')}
                activeOpacity={0.7}
              >
                <Text className="text-xs font-black text-orange-600">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
