import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

const PRIMARY = '#208AEF';

export function HomeEmptyState() {
  return (
    <View style={styles.emptyState}>
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.emptyTitle}>
        Your notebook is empty
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.emptyBody}>
        Create your first recipe to start tracking trials and experiments.
      </ThemedText>
      <Pressable
        style={({ pressed }) => [styles.emptyButton, pressed && styles.pressed]}
        onPress={() => router.push('/new-recipe')}>
        <ThemedText style={styles.emptyButtonText}>Create a recipe</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems:     'center',
    paddingVertical: Spacing.six,
    gap:            Spacing.three,
  },
  emptyTitle:      { letterSpacing: 0.4 },
  emptyBody:       { textAlign: 'center', lineHeight: 20, maxWidth: 260 },
  emptyButton: {
    backgroundColor:  PRIMARY,
    borderRadius:     Spacing.three,
    paddingVertical:  Spacing.two,
    paddingHorizontal: Spacing.four,
    marginTop:        Spacing.one,
  },
  emptyButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 15 },
  pressed:         { opacity: 0.7 },
});
