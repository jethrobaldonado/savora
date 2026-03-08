import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CATEGORIES } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Recipe } from '@/store/types';

const PRIMARY = '#208AEF';

export function RecipeCard({
  recipe,
  trialCount,
  lastTrialDate,
}: {
  recipe:        Recipe;
  trialCount:    number;
  lastTrialDate: string | null;
}) {
  const theme    = useTheme();
  const category = CATEGORIES.find((c) => c.id === recipe.category);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement },
        pressed && styles.pressed,
      ]}
      onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}>

      <View style={styles.cardMain}>
        <View style={styles.cardLeft}>
          <ThemedText type="default" style={styles.cardName} numberOfLines={2}>
            {recipe.name}
          </ThemedText>

          {category && (
            <View style={[styles.categoryBadge, { backgroundColor: theme.background }]}>
              <ThemedText type="small" themeColor="textSecondary">
                {category.emoji} {category.label}
              </ThemedText>
            </View>
          )}
        </View>

        <SymbolView
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          size={14}
          tintColor={theme.textSecondary}
        />
      </View>

      <View style={styles.cardMeta}>
        <View style={[styles.trialBadge, { backgroundColor: 'rgba(32,138,239,0.10)' }]}>
          <ThemedText type="small" style={styles.trialBadgeText}>
            {trialCount} trial{trialCount !== 1 ? 's' : ''}
          </ThemedText>
        </View>

        {lastTrialDate && (
          <ThemedText type="small" themeColor="textSecondary">
            Last: {lastTrialDate}
          </ThemedText>
        )}

        {recipe.tags.length > 0 && (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1} style={styles.tags}>
            {recipe.tags.join(' · ')}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding:      Spacing.three,
    gap:          Spacing.two,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           Spacing.two,
  },
  cardLeft:      { flex: 1, gap: Spacing.one },
  cardName:      { fontWeight: '600', fontSize: 16, lineHeight: 22 },
  categoryBadge: {
    alignSelf:        'flex-start',
    borderRadius:     20,
    paddingHorizontal: Spacing.two,
    paddingVertical:  2,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.two,
    flexWrap:      'wrap',
  },
  trialBadge: {
    borderRadius:     20,
    paddingHorizontal: Spacing.two,
    paddingVertical:  2,
  },
  trialBadgeText: { color: PRIMARY, fontWeight: '600' },
  tags:           { flex: 1 },
  pressed:        { opacity: 0.7 },
});
