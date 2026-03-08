import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppTabs from '@/components/app-tabs';
import { BottomTabInset } from '@/constants/theme';

const FAB_SIZE = 58;
const PRIMARY = '#208AEF';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // Center the FAB vertically within the visible tab bar strip
  const fabBottom = insets.bottom + (BottomTabInset - FAB_SIZE) / 2;

  return (
    <View style={styles.container}>
      <AppTabs />

      {Platform.OS !== 'web' && (
        <Pressable
          style={({ pressed }) => [
            styles.fab,
            { bottom: Math.max(fabBottom, insets.bottom + 4) },
            pressed && styles.fabPressed,
          ]}
          onPress={() => router.push('/new-recipe')}>
          <SymbolView
            name={{ ios: 'plus', android: 'add', web: 'add' }}
            size={26}
            tintColor="#ffffff"
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  fabPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.93 }],
  },
});
