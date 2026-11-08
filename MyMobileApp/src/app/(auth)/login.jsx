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
import { authService, REFERENCE_USER } from '../../services/authService';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'ios' ? 16 : 24);
  const bottomInset = Math.max(insets.bottom, 16);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Quick helper to fill reference credentials for rapid testing
  const handleFillReferenceCredentials = () => {
    setEmail(REFERENCE_USER.email);
    setPassword(REFERENCE_USER.password);
    setErrorMessage('');
  };

  const handleLogin = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      await authService.login(email, password, rememberMe);
      // Navigate to the main dashboard
      router.replace('/(tabs)');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
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
      setErrorMessage(err.message || 'Google sign-in failed.');
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
        <View className="items-center mt-2 mb-6">
          <StructuraLogo size={58} />
          <Text className="text-xl font-black text-[#172B4D] tracking-tight mt-2.5">
            Structura
          </Text>
        </View>

        {/* Welcome Text */}
        <View className="mb-5">
          <Text className="text-2xl font-black text-[#172B4D] tracking-tight">
            Welcome Back
          </Text>
          <Text className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Sign in to manage your site operations, worker attendance, and daily engineering logs.
          </Text>
        </View>

        {/* Quick Reference User Banner */}
        <TouchableOpacity
          onPress={handleFillReferenceCredentials}
          activeOpacity={0.7}
          className="bg-orange-50/70 border border-orange-200 rounded-2xl p-3 mb-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-7 h-7 rounded-lg bg-orange-500 items-center justify-center mr-2">
              <Feather name="key" size={13} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-[11px] font-bold text-orange-950">
                Test with Reference Admin
              </Text>
              <Text className="text-[10px] text-orange-800/80 font-medium">
                admin@structuramad.com • Admin@123
              </Text>
            </View>
          </View>
          <View className="bg-white border border-orange-200 px-2.5 py-1 rounded-lg">
            <Text className="text-[10px] font-bold text-orange-600">
              Auto-Fill
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

        {/* Form Inputs */}
        <View className="space-y-3.5 mb-4">
          {/* Email Input */}
          <View>
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Email Address
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

          {/* Password Input */}
          <View>
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Password
            </Text>
            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 flex-row items-center">
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
        </View>

        {/* Remember Me & Forgot Password Row */}
        <View className="flex-row items-center justify-between mb-5">
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
            className="flex-row items-center"
          >
            <View
              className={`w-4 h-4 rounded items-center justify-center border mr-2 ${
                rememberMe
                  ? 'bg-orange-500 border-orange-500'
                  : 'bg-white border-slate-300'
              }`}
            >
              {rememberMe ? (
                <Feather name="check" size={11} color="#FFFFFF" />
              ) : null}
            </View>
            <Text className="text-xs text-slate-600 font-semibold">
              Remember me
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            activeOpacity={0.7}
          >
            <Text className="text-xs font-bold text-orange-600">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Primary Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
          className="bg-[#172B4D] py-4 rounded-2xl items-center flex-row justify-center mb-3.5 shadow-md shadow-slate-300"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
          ) : (
            <Feather name="log-in" size={16} color="#FFFFFF" className="mr-2" />
          )}
          <Text className="text-white text-xs font-black uppercase tracking-wider ml-1">
            {isLoading ? 'Signing In...' : 'Sign In to Structura'}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center my-3.5">
          <View className="flex-1 h-[1px] bg-slate-200" />
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
            or continue with
          </Text>
          <View className="flex-1 h-[1px] bg-slate-200" />
        </View>

        {/* Google Sign-In Button */}
        <TouchableOpacity
          onPress={() => setIsGoogleModalOpen(true)}
          activeOpacity={0.7}
          className="bg-white border border-slate-200 py-3.5 rounded-2xl items-center flex-row justify-center mb-5 shadow-xs"
        >
          <GoogleIcon size={18} />
          <Text className="text-xs font-bold text-[#172B4D] ml-2.5">
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* Signup Navigation Link */}
        <View className="flex-row items-center justify-center mt-2">
          <Text className="text-xs text-slate-500 font-medium">
            Don&apos;t have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/signup')}
            activeOpacity={0.7}
          >
            <Text className="text-xs font-black text-orange-600">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Simulated Google OAuth Account Picker Modal */}
        <GoogleSignInModal
          visible={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}
          onSelectAccount={handleGoogleAccountSelected}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
