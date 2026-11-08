import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRouter } from 'expo-router';
import { getTabIcon } from './TabIcons';

const ACTIVE_COLOR = '#F97316'; // Structura Primary Orange
const INACTIVE_COLOR = '#64748B'; // Professional Slate Grey

/**
 * Modern, professional horizontal bottom navigation bar for Structura.
 *
 * Characteristics:
 * - Fixed horizontal layout with five equally spaced navigation items:
 *   Dashboard, Report, Attendance, Inventory, Settings.
 * - Recognizable 20px Feather stroke icons with clear text labels underneath.
 * - Active tab highlighted in Structura orange (#F97316) with subtle pill background.
 * - Inactive tabs styled in neutral slate grey (#64748B).
 * - Rounded top corners (18px) and soft elevation shadow.
 * - Resilient navigation resolution preventing undefined navigation / emit errors.
 * - Full safe-area inset handling across iOS and Android.
 */
export default function BottomTabBar(props) {
  const { state, descriptors, navigation } = props || {};
  const insets = useSafeAreaInsets();
  const hookNavigation = useNavigation();
  const router = useRouter();

  // Multi-tier navigation resolver: props.navigation -> useNavigation() hook
  const nav = navigation || hookNavigation;

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 8);

  // Safety guard against uninitialized state or descriptors
  if (!state || !state.routes || !descriptors) {
    return null;
  }

  return (
    <View
      style={[
        styles.navbarContainer,
        {
          paddingBottom: bottomPadding,
        },
      ]}
      className="w-full bg-white border-t border-slate-200"
    >
      <View className="flex-row items-center justify-around px-2 pt-2.5">
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          if (!descriptor) return null;

          const { options } = descriptor;
          const isFocused = state.index === index;

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          // Route-specific navigation resolver with full descriptor fallback
          const routeNav = descriptor.navigation || nav;

          const onPress = () => {
            const event = routeNav?.emit
              ? routeNav.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                })
              : { defaultPrevented: false };

            if (!isFocused && !event?.defaultPrevented) {
              if (routeNav?.navigate) {
                routeNav.navigate({ name: route.name, merge: true });
              } else {
                router.navigate(route.name === 'index' ? '/(tabs)' : `/(tabs)/${route.name}`);
              }
            }
          };

          const onLongPress = () => {
            if (routeNav?.emit) {
              routeNav.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            }
          };

          const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || `${label} tab`}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.7}
              className="flex-1 items-center justify-center py-1"
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              {/* Rounded icon indicator pill */}
              <View
                className={`w-11 h-7 items-center justify-center rounded-full mb-1 ${
                  isFocused ? 'bg-orange-50' : 'bg-transparent'
                }`}
              >
                {getTabIcon(route.name, color, 20)}
              </View>

              {/* Navigation Label */}
              <Text
                style={{ color }}
                className={`text-[11px] tracking-[0.2px] text-center ${
                  isFocused ? 'font-bold' : 'font-medium'
                }`}
                numberOfLines={1}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
});
