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
import GoogleIcon from '../../components/auth/GoogleIcon';
import GoogleSignInModal from '../../components/auth/GoogleSignInModal';
import LegalModal from '../../components/settings/LegalModal';
import { authService } from '../../services/authService';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'ios' ? 16 : 24);
  const bottomInset = Math.max(insets.bottom, 16);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleSignup = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      await authService.signup({
        name,
        email,
        phone,
        password,
        confirmPassword,
        agreeToTerms,
      });

      // Redirect to dashboard upon successful signup
      router.replace('/(tabs)');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAccountSelected = async (account) => {
    setIsGoogleModalOpen(false);
    setIsLoading(true);
    try {
      await authService.googleSignIn(account);
      router.replace('/(tabs)');
    } catch (err) {
      setErrorMessage(err.message || 'Google registration failed.');
    } finally {
      setIsLoading(false);
    }
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
        {/* Structura Brand Header */}
        <View className="items-center mt-2 mb-5">
          <StructuraLogo size={52} />
          <Text className="text-xl font-black text-[#172B4D] tracking-tight mt-2">
            Structura
          </Text>
        </View>

        {/* Create Account Title */}
        <View className="mb-4">
          <Text className="text-2xl font-black text-[#172B4D] tracking-tight">
            Create Account
          </Text>
          <Text className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Register your profile to access site management, attendance, and reports.
          </Text>
        </View>

        {/* Error Banner */}
        {errorMessage ? (
          <View className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-4 flex-row items-center">
            <Feather name="alert-circle" size={16} color="#E11D48" />
            <Text className="text-xs text-rose-700 font-semibold ml-2.5 flex-1 leading-snug">
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {/* Form Inputs */}
        <View className="space-y-3 mb-4">
          {/* Full Name */}
          <View>
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Full Name *
            </Text>
            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex-row items-center">
              <Feather name="user" size={16} color="#94A3B8" />
              <TextInput
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="e.g. Marcus Vance"
                placeholderTextColor="#94A3B8"
                className="flex-1 text-xs text-[#172B4D] font-semibold ml-2.5"
              />
            </View>
          </View>

          {/* Email Address */}
          <View>
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Email Address *
            </Text>
            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex-row items-center">
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

          {/* Phone Number */}
          <View>
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Phone Number *
            </Text>
            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex-row items-center">
              <Feather name="phone" size={16} color="#94A3B8" />
              <TextInput
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (errorMessage) setErrorMessage('');
                }}
                keyboardType="phone-pad"
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#94A3B8"
                className="flex-1 text-xs text-[#172B4D] font-semibold ml-2.5"
              />
            </View>
          </View>

          {/* Password */}
          <View>
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Password (Min 6 Characters) *
            </Text>
            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex-row items-center">
              <Feather name="lock" size={16} color="#94A3B8" />
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errorMessage) setErrorMessage('');
                }}
                secureTextEntry={!showPassword}
                placeholder="Enter password"
                placeholderTextColor="#94A3B8"
                className="flex-1 text-xs text-[#172B4D] font-semibold ml-2.5"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="p-1"
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={16}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View>
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Confirm Password *
            </Text>
            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex-row items-center">
              <Feather name="shield" size={16} color="#94A3B8" />
              <TextInput
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errorMessage) setErrorMessage('');
                }}
                secureTextEntry={!showConfirm}
                placeholder="Re-enter password"
                placeholderTextColor="#94A3B8"
                className="flex-1 text-xs text-[#172B4D] font-semibold ml-2.5"
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                className="p-1"
              >
                <Feather
                  name={showConfirm ? 'eye-off' : 'eye'}
                  size={16}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Terms & Conditions Checkbox */}
        <View className="flex-row items-start mb-5">
          <TouchableOpacity
            onPress={() => setAgreeToTerms(!agreeToTerms)}
            activeOpacity={0.7}
            className="mt-0.5 mr-2.5"
          >
            <View
              className={`w-4 h-4 rounded items-center justify-center border ${
                agreeToTerms
                  ? 'bg-orange-500 border-orange-500'
                  : 'bg-white border-slate-300'
              }`}
            >
              {agreeToTerms ? (
                <Feather name="check" size={11} color="#FFFFFF" />
              ) : null}
            </View>
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-xs text-slate-600 font-medium leading-relaxed">
              I agree to the{' '}
              <Text
                onPress={() => setIsTermsModalOpen(true)}
                className="font-bold text-orange-600 underline"
              >
                Terms and Conditions
              </Text>{' '}
              and operational safety compliance policies.
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={isLoading}
          activeOpacity={0.8}
          className="bg-orange-500 py-4 rounded-2xl items-center flex-row justify-center mb-3.5 shadow-md shadow-orange-300"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
          ) : (
            <Feather name="user-check" size={16} color="#FFFFFF" className="mr-2" />
          )}
          <Text className="text-white text-xs font-black uppercase tracking-wider ml-1">
            {isLoading ? 'Creating Account...' : 'Register Account'}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center my-2.5">
          <View className="flex-1 h-[1px] bg-slate-200" />
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
            or register with
          </Text>
          <View className="flex-1 h-[1px] bg-slate-200" />
        </View>

        {/* Google Sign-Up Button */}
        <TouchableOpacity
          onPress={() => setIsGoogleModalOpen(true)}
          activeOpacity={0.7}
          className="bg-white border border-slate-200 py-3 rounded-2xl items-center flex-row justify-center mb-4 shadow-xs"
        >
          <GoogleIcon size={18} />
          <Text className="text-xs font-bold text-[#172B4D] ml-2.5">
            Sign up with Google
          </Text>
        </TouchableOpacity>

        {/* Login Navigation Link */}
        <View className="flex-row items-center justify-center mt-1">
          <Text className="text-xs text-slate-500 font-medium">
            Already have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.7}
          >
            <Text className="text-xs font-black text-orange-600">
              Log In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Simulated Google OAuth Account Picker Modal */}
        <GoogleSignInModal
          visible={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}
          onSelectAccount={handleGoogleAccountSelected}
        />

        {/* Terms and Conditions Legal Modal */}
        <LegalModal
          visible={isTermsModalOpen}
          type="TERMS"
          onClose={() => setIsTermsModalOpen(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
