import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import StructuraLogo from './StructuraLogo';

const NAVY = '#222C50';
const ORANGE = '#F47B20';
const BACKGROUND = '#FFFFFF';

/**
 * Premium entrance / splash screen for Structura.
 *
 * Positioning:
 * - Positioned dead-center horizontally and vertically across all screen sizes.
 * - Entire brand identity (Logo + Wordmark + Tagline) contained in one unified centered group.
 * - Zero asymmetric safe-area padding or bottom offset skew.
 */
export default function SplashScreen() {
  const { width, height } = useWindowDimensions();

  // Responsive proportional metrics safely bounded
  const minDimension = Math.min(width, height);
  const logoSize = Math.min(Math.max(minDimension * 0.44, 150), 200);
  const wordmarkFontSize = Math.min(Math.max(minDimension * 0.068, 24), 28);
  const taglineFontSize = Math.min(Math.max(minDimension * 0.026, 10), 11.5);
  const wordmarkLetterSpacing = Math.min(Math.max(minDimension * 0.02, 6), 8);
  const taglineLetterSpacing = Math.min(Math.max(minDimension * 0.008, 3), 4);

  // Stable animation values (React 19 compliant)
  const [logoOpacity] = useState(() => new Animated.Value(0));
  const [logoScale] = useState(() => new Animated.Value(0.92));
  const [wordmarkOpacity] = useState(() => new Animated.Value(0));
  const [wordmarkTranslateY] = useState(() => new Animated.Value(10));
  const [taglineOpacity] = useState(() => new Animated.Value(0));
  const [taglineTranslateY] = useState(() => new Animated.Value(6));

  useEffect(() => {
    Animated.parallel([
      // Logo Animation: Smooth fade and subtle scale up
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      // Wordmark Animation: Staggered entry with subtle upward drift
      Animated.sequence([
        Animated.delay(350),
        Animated.parallel([
          Animated.timing(wordmarkOpacity, {
            toValue: 1,
            duration: 650,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(wordmarkTranslateY, {
            toValue: 0,
            duration: 650,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),

      // Tagline Animation: Final subtle reveal
      Animated.sequence([
        Animated.delay(550),
        Animated.parallel([
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: 550,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(taglineTranslateY, {
            toValue: 0,
            duration: 550,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [
    logoOpacity,
    logoScale,
    wordmarkOpacity,
    wordmarkTranslateY,
    taglineOpacity,
    taglineTranslateY,
  ]);

  return (
    <View style={styles.container} className="flex-1 bg-white justify-center items-center">
      <StatusBar style="dark" backgroundColor={BACKGROUND} translucent />

      {/* Unified brand group centered dead-middle both horizontally and vertically */}
      <View style={styles.brandGroup} className="items-center justify-center w-full">
        {/* Animated Architectural Logo */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
          className="items-center justify-center mb-5"
        >
          <StructuraLogo
            size={logoSize}
            navyColor={NAVY}
            orangeColor={ORANGE}
          />
        </Animated.View>

        {/* Animated Brand Wordmark */}
        <Animated.View
          style={[
            styles.wordmarkWrapper,
            {
              opacity: wordmarkOpacity,
              transform: [{ translateY: wordmarkTranslateY }],
            },
          ]}
          className="items-center justify-center mb-2"
        >
          <Text
            style={[
              styles.wordmark,
              {
                fontSize: wordmarkFontSize,
                letterSpacing: wordmarkLetterSpacing,
                marginRight: -wordmarkLetterSpacing, // Balance tracking offset to ensure dead-center alignment
              },
            ]}
            className="text-structura-navy font-bold text-center"
          >
            STRUCTURA
          </Text>
        </Animated.View>

        {/* Animated Tagline */}
        <Animated.View
          style={[
            styles.taglineWrapper,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineTranslateY }],
            },
          ]}
          className="items-center justify-center"
        >
          <Text
            style={[
              styles.taglineText,
              {
                fontSize: taglineFontSize,
                letterSpacing: taglineLetterSpacing,
                marginRight: -taglineLetterSpacing, // Balance tracking offset
              },
            ]}
            className="text-structura-slate font-semibold text-center uppercase"
          >
            BUILD <Text style={styles.taglineDot} className="text-structura-orange font-extrabold">•</Text> MANAGE{' '}
            <Text style={styles.taglineDot} className="text-structura-orange font-extrabold">•</Text> GROW
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandGroup: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  wordmarkWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  wordmark: {
    color: NAVY,
    fontWeight: Platform.select({ ios: '800', default: 'bold' }),
    textAlign: 'center',
    includeFontPadding: false,
  },
  taglineWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  taglineText: {
    color: '#4B556D',
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    includeFontPadding: false,
  },
  taglineDot: {
    color: ORANGE,
    fontWeight: '800',
  },
});
