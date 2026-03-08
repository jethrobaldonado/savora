import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type TextInput as TextInputType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PRIMARY = '#208AEF';

export default function RegisterScreen() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const emailRef = useRef<TextInputType>(null);
  const passwordRef = useRef<TextInputType>(null);
  const confirmRef = useRef<TextInputType>(null);

  function handleRegister() {
    // TODO: implement auth logic
    router.replace('/(tabs)');
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { maxWidth: MaxContentWidth }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Pressable
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
                onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/login')}>
                <ThemedText type="default" style={styles.primaryText}>
                  ← Back
                </ThemedText>
              </Pressable>
            </View>

            <View style={styles.titleSection}>
              <ThemedText type="subtitle">Create account</ThemedText>
              <ThemedText type="default" themeColor="textSecondary">
                Fill in your details to get started
              </ThemedText>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <ThemedText type="smallBold">Full name</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: theme.backgroundElement, color: theme.text },
                  ]}
                  placeholder="Jane Smith"
                  placeholderTextColor={theme.textSecondary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>

              <View style={styles.fieldGroup}>
                <ThemedText type="smallBold">Email address</ThemedText>
                <TextInput
                  ref={emailRef}
                  style={[
                    styles.input,
                    { backgroundColor: theme.backgroundElement, color: theme.text },
                  ]}
                  placeholder="jane@example.com"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>

              <View style={styles.fieldGroup}>
                <ThemedText type="smallBold">Password</ThemedText>
                <View>
                  <TextInput
                    ref={passwordRef}
                    style={[
                      styles.input,
                      { backgroundColor: theme.backgroundElement, color: theme.text },
                    ]}
                    placeholder="At least 8 characters"
                    placeholderTextColor={theme.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                    autoComplete="new-password"
                    returnKeyType="next"
                    onSubmitEditing={() => confirmRef.current?.focus()}
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
              </View>

              <View style={styles.fieldGroup}>
                <ThemedText type="smallBold">Confirm password</ThemedText>
                <TextInput
                  ref={confirmRef}
                  style={[
                    styles.input,
                    { backgroundColor: theme.backgroundElement, color: theme.text },
                  ]}
                  placeholder="Repeat your password"
                  placeholderTextColor={theme.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!passwordVisible}
                  autoComplete="new-password"
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
                onPress={handleRegister}>
                <ThemedText style={styles.primaryButtonText}>Create account</ThemedText>
              </Pressable>

              <View style={styles.signinRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  Already have an account?{' '}
                </ThemedText>
                <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/login')}>
                  <ThemedText type="small" style={styles.primaryText}>
                    Sign in
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </ScrollView>
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
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.five,
  },
  header: {
    paddingTop: Spacing.three,
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
    gap: Spacing.four,
  },
  fieldGroup: {
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
});
