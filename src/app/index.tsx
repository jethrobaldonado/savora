import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const PRIMARY = '#208AEF';
const HERO_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80';

export default function HomeScreen() {

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, { maxWidth: MaxContentWidth }]}>

          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoMark}>
              <ThemedText style={styles.logoGlyph}>S</ThemedText>
            </View>
            <ThemedText style={styles.wordmark}>Savora</ThemedText>
          </View>

          {/* Hero image */}
          <Image
            source={HERO_IMAGE}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />

          {/* Description */}
          <View style={styles.descriptionSection}>
            <ThemedText type="subtitle" style={styles.headline}>
              Your culinary research notebook
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary" style={styles.body}>
              Create recipes, track revisions, and document every experiment — so your best discoveries are never forgotten.
            </ThemedText>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
              onPress={() => router.push('/(auth)/login')}>
              <ThemedText style={styles.primaryButtonText}>Sign in</ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => pressed && styles.pressed}
              onPress={() => router.push('/(auth)/register')}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.secondaryLink}>
                New here?{' '}
                <ThemedText type="small" style={styles.primaryText}>
                  Create an account
                </ThemedText>
              </ThemedText>
            </Pressable>
          </View>

        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.five,
    justifyContent: 'center',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlyph: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  wordmark: {
    fontSize: 24,
    fontWeight: '700',
  },
  heroImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: Spacing.four,
  },
  descriptionSection: {
    gap: Spacing.two,
  },
  headline: {
    fontSize: 28,
    lineHeight: 36,
  },
  body: {
    lineHeight: 26,
  },
  actions: {
    gap: Spacing.three,
  },
  primaryButton: {
    backgroundColor: PRIMARY,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
  secondaryLink: {
    textAlign: 'center',
  },
  primaryText: {
    color: PRIMARY,
  },
});
