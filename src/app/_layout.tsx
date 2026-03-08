import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { TamaguiProvider } from '@tamagui/core';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import config from '../../tamagui.config';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="new-recipe" options={{ presentation: 'modal' }} />
          <Stack.Screen name="new-trial"  options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
