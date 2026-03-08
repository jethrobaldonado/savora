import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CategoryFilterBar } from '@/components/explore/category-filter';
import { RecipeCard } from '@/components/explore/recipe-card';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { type CategoryFilter } from '@/constants/categories';
import { useTheme } from '@/hooks/use-theme';
import { useSavoraStore } from '@/store';
import { formatDate } from '@/utils/format';

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIMARY = '#208AEF';

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ExploreScreen() {
  const theme              = useTheme();
  const safeAreaInsets     = useSafeAreaInsets();
  const { recipes, trials } = useSavoraStore();

  const [search,         setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  // ── Derived data ──────────────────────────────────────────────────────────

  const enriched = recipes.map((r) => {
    const recipeTrials = trials.filter((t) => t.recipeId === r.id);
    const latest       = recipeTrials[0]; // store prepends, so index 0 is newest
    return {
      recipe:        r,
      trialCount:    recipeTrials.length,
      lastTrialDate: latest ? formatDate(latest.createdAt) : null,
    };
  });

  const filtered = enriched.filter(({ recipe }) => {
    const matchesSearch   = search.trim() === '' ||
      recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || recipe.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // ── Layout ────────────────────────────────────────────────────────────────

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop:    insets.top,
      paddingLeft:   insets.left,
      paddingRight:  insets.right,
      paddingBottom: insets.bottom,
    },
    web: { paddingTop: Spacing.five, paddingBottom: Spacing.five },
  });

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.scrollContent, contentPlatformStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <ThemedView style={styles.page}>

        {/* ── Header ───────────────────────────────────────────────── */}
        <View style={styles.header}>
          <ThemedText type="subtitle">Recipes</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
          </ThemedText>
        </View>

        {/* ── Search ───────────────────────────────────────────────── */}
        <View style={[styles.searchRow, { backgroundColor: theme.backgroundElement }]}>
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            size={16}
            tintColor={theme.textSecondary}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search recipes or tags…"
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {search.length > 0 && Platform.OS !== 'ios' && (
            <Pressable hitSlop={8} onPress={() => setSearch('')}>
              <ThemedText style={{ color: theme.textSecondary, fontSize: 16 }}>×</ThemedText>
            </Pressable>
          )}
        </View>

        {/* ── Category filter ──────────────────────────────────────── */}
        <CategoryFilterBar
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* ── Recipe list ──────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <View style={styles.list}>
            {filtered.map(({ recipe, trialCount, lastTrialDate }) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                trialCount={trialCount}
                lastTrialDate={lastTrialDate}
              />
            ))}
          </View>
        ) : recipes.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              No recipes yet
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyBody}>
              Tap the + button to create your first recipe.
            </ThemedText>
            <Pressable
              style={({ pressed }) => [styles.emptyButton, pressed && styles.pressed]}
              onPress={() => router.push('/new-recipe')}>
              <ThemedText style={styles.emptyButtonText}>Create a recipe</ThemedText>
            </Pressable>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <ThemedText type="small" themeColor="textSecondary">
              No recipes match your search.
            </ThemedText>
          </View>
        )}

      </ThemedView>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll:        { flex: 1 },
  scrollContent: { flexDirection: 'row', justifyContent: 'center' },
  page: {
    maxWidth:         MaxContentWidth,
    flexGrow:         1,
    gap:              Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingTop:       Spacing.four,
    paddingBottom:    Spacing.three,
  },

  // Header
  header: { gap: Spacing.one },

  // Search
  searchRow: {
    flexDirection:  'row',
    alignItems:     'center',
    borderRadius:   Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap:            Spacing.two,
  },
  searchInput: {
    flex:       1,
    fontSize:   15,
    fontWeight: '500',
    paddingVertical: Spacing.one,
  },

  // Recipe list
  list: { gap: Spacing.two },

  // Empty state
  emptyState: {
    alignItems:    'center',
    paddingVertical: Spacing.six,
    gap:           Spacing.three,
  },
  emptyBody: { textAlign: 'center', lineHeight: 20, maxWidth: 240 },
  emptyButton: {
    backgroundColor:  PRIMARY,
    borderRadius:     Spacing.three,
    paddingVertical:  Spacing.two,
    paddingHorizontal: Spacing.four,
    marginTop:        Spacing.one,
  },
  emptyButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 15 },

  pressed: { opacity: 0.7 },
});
