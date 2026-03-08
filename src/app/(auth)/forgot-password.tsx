import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PRIMARY = '#208AEF';

type ScreenState = 'idle' | 'sent';

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<ScreenState>('idle');

  function handleSend() {
    if (!email.trim()) return;
    // TODO: implement password reset logic
    setState('sent');
  }

  if (state === 'sent') {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.content, { maxWidth: MaxContentWidth }]}>
            <Pressable
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/login')}>
              <ThemedText type="default" style={styles.primaryText}>
                ← Back
              </ThemedText>
            </Pressable>

            <View style={styles.sentSection}>
              <ThemedText type="subtitle">Check your inbox</ThemedText>
              <ThemedText type="default" themeColor="textSecondary" style={styles.sentBody}>
                We sent a password reset link to{'\n'}
                <ThemedText type="default">{email}</ThemedText>
              </ThemedText>
            </View>

            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
              onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/login')}>
              <ThemedText style={styles.primaryButtonText}>Back to sign in</ThemedText>
            </Pressable>

            <View style={styles.resendRow}>
              <ThemedText type="small" themeColor="textSecondary">
                Didn't receive it?{' '}
              </ThemedText>
              <Pressable onPress={() => setState('idle')}>
                <ThemedText type="small" style={styles.primaryText}>
                  Try again
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.content, { maxWidth: MaxContentWidth }]}>
            {/* Header */}
            <Pressable
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/login')}>
              <ThemedText type="default" style={styles.primaryText}>
                ← Back
              </ThemedText>
            </Pressable>

            {/* Title */}
            <View style={styles.titleSection}>
              <ThemedText type="subtitle">Forgot password?</ThemedText>
              <ThemedText type="default" themeColor="textSecondary">
                Enter your email and we'll send you a link to reset your password.
              </ThemedText>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.backgroundElement, color: theme.text },
                ]}
                placeholder="Email address"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="done"
                onSubmitEditing={handleSend}
              />
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
                onPress={handleSend}>
                <ThemedText style={styles.primaryButtonText}>Send reset link</ThemedText>
              </Pressable>

              <View style={styles.signinRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  Remember your password?{' '}
                </ThemedText>
                <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/login')}>
                  <ThemedText type="small" style={styles.primaryText}>
                    Sign in
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.five,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
  },
  primaryText: {
    color: PRIMARY,
  },
  titleSection: {
    gap: Spacing.two,
  },
  form: {
    gap: Spacing.two,
  },
  input: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
    fontWeight: '500',
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
    opacity: 0.75,
  },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sentSection: {
    gap: Spacing.three,
  },
  sentBody: {
    lineHeight: 24,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
