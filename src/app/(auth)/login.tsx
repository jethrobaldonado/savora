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

export default function LoginScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  function handleLogin() {
    // TODO: implement auth logic
    router.replace('/(tabs)');
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.content, { maxWidth: MaxContentWidth }]}>
            {/* Hero */}
            <View style={styles.hero}>
              <ThemedText type="title" style={styles.logo}>
                Savora
              </ThemedText>
              <ThemedText type="default" themeColor="textSecondary" style={styles.tagline}>
                Welcome back
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
                returnKeyType="next"
              />

              <View>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: theme.backgroundElement, color: theme.text },
                  ]}
                  placeholder="Password"
                  placeholderTextColor={theme.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  autoComplete="current-password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setPasswordVisible((v) => !v)}
                  hitSlop={8}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {passwordVisible ? 'Hide' : 'Show'}
                  </ThemedText>
                </Pressable>
              </View>

              <Pressable
                style={styles.forgotLink}
                onPress={() => router.push('/(auth)/forgot-password')}>
                <ThemedText type="small" style={styles.primaryText}>
                  Forgot password?
                </ThemedText>
              </Pressable>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
                onPress={handleLogin}>
                <ThemedText style={styles.primaryButtonText}>Sign in</ThemedText>
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: theme.backgroundSelected }]} />
                <ThemedText type="small" themeColor="textSecondary">
                  or
                </ThemedText>
                <View style={[styles.dividerLine, { backgroundColor: theme.backgroundSelected }]} />
              </View>

              <Pressable
                style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed, { borderColor: theme.backgroundSelected }]}
                onPress={() => router.push('/(auth)/register')}>
                <ThemedText type="default">Create an account</ThemedText>
              </Pressable>
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
    gap: Spacing.five,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  logo: {
    fontSize: 40,
    fontWeight: '700',
  },
  tagline: {
    textAlign: 'center',
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
  eyeButton: {
    position: 'absolute',
    right: Spacing.three,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  forgotLink: {
    alignSelf: 'flex-end',
    paddingVertical: Spacing.one,
  },
  primaryText: {
    color: PRIMARY,
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  secondaryButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    borderWidth: 1.5,
  },
});
