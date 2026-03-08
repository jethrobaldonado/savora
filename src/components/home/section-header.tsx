import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

const PRIMARY = '#208AEF';

export function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText type="smallBold" style={styles.sectionTitle}>
        {title.toUpperCase()}
      </ThemedText>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>
        <ThemedText type="small" style={styles.seeAll}>
          See all
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { letterSpacing: 0.6 },
  seeAll:       { color: PRIMARY },
  pressed:      { opacity: 0.7 },
});
