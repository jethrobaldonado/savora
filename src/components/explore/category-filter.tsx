import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CATEGORIES, type CategoryFilter } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PRIMARY = '#208AEF';

const FILTER_CATEGORIES: ReadonlyArray<{ id: CategoryFilter; label: string; emoji: string }> = [
  { id: 'all', label: 'All', emoji: '' },
  ...CATEGORIES,
];

export function CategoryFilterBar({
  activeCategory,
  onSelect,
}: {
  activeCategory: CategoryFilter;
  onSelect:       (id: CategoryFilter) => void;
}) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryList}>
      {FILTER_CATEGORIES.map((cat) => {
        const active = activeCategory === cat.id;
        return (
          <Pressable
            key={cat.id}
            style={[
              styles.categoryChip,
              active
                ? styles.categoryChipActive
                : { backgroundColor: theme.backgroundElement },
            ]}
            onPress={() => onSelect(cat.id)}>
            <ThemedText
              type="small"
              style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
              {cat.emoji ? `${cat.emoji} ${cat.label}` : cat.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoryList: { gap: Spacing.two, paddingBottom: Spacing.one },
  categoryChip: {
    borderRadius:     20,
    paddingHorizontal: Spacing.three,
    paddingVertical:  Spacing.one,
  },
  categoryChipActive:     { backgroundColor: PRIMARY },
  categoryChipText:       { fontWeight: '500' },
  categoryChipTextActive: { color: '#ffffff' },
});
