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
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSavoraStore } from '@/store';
import type { Recipe } from '@/store/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIMARY = '#208AEF';

const CATEGORIES = [
  { id: 'all',          label: 'All',          emoji: '' },
  { id: 'bread',        label: 'Bread',        emoji: '🍞' },
  { id: 'ferments',     label: 'Ferments',     emoji: '🫙' },
  { id: 'sauce',        label: 'Sauce',        emoji: '🥣' },
  { id: 'dessert',      label: 'Dessert',      emoji: '🍮' },
  { id: 'meat',         label: 'Meat',         emoji: '🍖' },
  { id: 'fish',         label: 'Fish',         emoji: '🐟' },
  { id: 'beverage',     label: 'Beverage',     emoji: '🍵' },
  { id: 'experimental', label: 'Experimental', emoji: '⚗️' },
  { id: 'other',        label: 'Other',        emoji: '🍴' },
] as const;

type CategoryFilter = (typeof CATEGORIES)[number]['id'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoString: string): string {
  const date     = new Date(isoString);
  const now      = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7)  return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Recipe card ──────────────────────────────────────────────────────────────

function RecipeCard({
  recipe,
  trialCount,
  lastTrialDate,
}: {
  recipe: Recipe;
  trialCount: number;
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

          {category && category.id !== 'all' && (
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}>
          {CATEGORIES.map((cat) => {
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
                onPress={() => setActiveCategory(cat.id)}>
                <ThemedText
                  type="small"
                  style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
                  {cat.emoji ? `${cat.emoji} ${cat.label}` : cat.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>

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

  // Category filter
  categoryList: { gap: Spacing.two, paddingBottom: Spacing.one },
  categoryChip: {
    borderRadius:     20,
    paddingHorizontal: Spacing.three,
    paddingVertical:  Spacing.one,
  },
  categoryChipActive:     { backgroundColor: PRIMARY },
  categoryChipText:       { fontWeight: '500' },
  categoryChipTextActive: { color: '#ffffff' },

  // Recipe list
  list: { gap: Spacing.two },

  // Recipe card
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
  cardLeft: { flex: 1, gap: Spacing.one },
  cardName: { fontWeight: '600', fontSize: 16, lineHeight: 22 },
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
