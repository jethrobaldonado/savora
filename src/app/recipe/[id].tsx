import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { OutcomeBadge, OUTCOME_LABELS, OUTCOME_TEXT_COLORS } from '@/components/recipe/outcome-badge';
import { TrialCard } from '@/components/recipe/trial-card';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSavoraStore } from '@/store';
import { formatDate } from '@/utils/format';

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIMARY = '#208AEF';
const ACCENT  = '#34C759';

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function RecipeScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const theme    = useTheme();
  const { getRecipeById, getTrialsByRecipeId } = useSavoraStore();

  const recipe = getRecipeById(id);
  const trials = getTrialsByRecipeId(id);

  // ── Not found ──────────────────────────────────────────────────────────────

  if (!recipe) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.safe}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ThemedText type="default" style={styles.link}>← Back</ThemedText>
          </Pressable>
          <ThemedText type="default" themeColor="textSecondary" style={styles.notFound}>
            Recipe not found.
          </ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const lastTrial      = trials[0];
  const hasIngredients = recipe.ingredients.some((i) => i.name.trim());
  const hasMethod      = recipe.methodSteps.some((s) => s.instruction.trim());

  const filledIngredients = recipe.ingredients.filter((i) => i.name.trim());
  const filledSteps       = recipe.methodSteps.filter((s) => s.instruction.trim());

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { maxWidth: MaxContentWidth }]}
          showsVerticalScrollIndicator={false}>

          {/* ── Back ─────────────────────────────────────────────── */}
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            onPress={() => router.back()}>
            <ThemedText type="default" style={styles.link}>← Back</ThemedText>
          </Pressable>

          {/* ── Title ────────────────────────────────────────────── */}
          <View style={styles.titleSection}>
            <ThemedText style={styles.recipeName}>{recipe.name}</ThemedText>

            <View style={styles.badgeRow}>
              {recipe.category && (
                <View style={[styles.badge, { backgroundColor: theme.backgroundElement }]}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
                  </ThemedText>
                </View>
              )}
              {recipe.tags.map((tag) => (
                <View key={tag} style={[styles.badge, { backgroundColor: theme.backgroundElement }]}>
                  <ThemedText type="small" themeColor="textSecondary">#{tag}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* ── Stats ────────────────────────────────────────────── */}
          <View style={[styles.statsRow, { backgroundColor: theme.backgroundElement }]}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{trials.length}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">Trials</ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.backgroundSelected }]} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue} numberOfLines={1}>
                {lastTrial ? formatDate(lastTrial.createdAt) : '—'}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">Last trial</ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.backgroundSelected }]} />
            <View style={styles.statItem}>
              {lastTrial?.outcome ? (
                <ThemedText
                  style={[styles.statValue, { color: OUTCOME_TEXT_COLORS[lastTrial.outcome] }]}
                  numberOfLines={1}>
                  {OUTCOME_LABELS[lastTrial.outcome]}
                </ThemedText>
              ) : (
                <ThemedText style={styles.statValue} numberOfLines={1}>—</ThemedText>
              )}
              <ThemedText type="small" themeColor="textSecondary">Latest outcome</ThemedText>
            </View>
          </View>

          {/* ── New Trial CTA ─────────────────────────────────────── */}
          <Pressable
            style={({ pressed }) => [styles.newTrialBtn, pressed && styles.pressed]}
            onPress={() =>
              router.push({ pathname: '/new-trial', params: { recipeId: recipe.id } })
            }>
            <ThemedText style={styles.newTrialBtnText}>+ New Trial</ThemedText>
          </Pressable>

          {/* ── Goal ─────────────────────────────────────────────── */}
          {recipe.goal.trim().length > 0 && (
            <View style={styles.section}>
              <ThemedText type="smallBold" style={styles.sectionLabel}>GOAL</ThemedText>
              <ThemedText type="default" themeColor="textSecondary" style={styles.goalText}>
                {recipe.goal}
              </ThemedText>
            </View>
          )}

          {/* ── Ingredients ──────────────────────────────────────── */}
          {hasIngredients && (
            <View style={styles.section}>
              <ThemedText type="smallBold" style={styles.sectionLabel}>INGREDIENTS</ThemedText>
              <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
                {filledIngredients.map((ing, idx) => (
                  <View
                    key={ing.id}
                    style={[
                      styles.ingredientRow,
                      idx < filledIngredients.length - 1 && {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: theme.backgroundSelected,
                      },
                    ]}>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.ingredientQty}>
                      {[ing.quantity, ing.unit].filter(Boolean).join(' ')}
                    </ThemedText>
                    <ThemedText type="default" style={styles.ingredientName}>{ing.name}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Method ───────────────────────────────────────────── */}
          {hasMethod && (
            <View style={styles.section}>
              <ThemedText type="smallBold" style={styles.sectionLabel}>METHOD</ThemedText>
              <View style={styles.methodList}>
                {filledSteps.map((step, idx) => (
                  <View key={step.id} style={styles.methodRow}>
                    <View style={[styles.stepBadge, { backgroundColor: theme.backgroundElement }]}>
                      <ThemedText type="smallBold">{idx + 1}</ThemedText>
                    </View>
                    <ThemedText type="default" style={styles.stepText}>{step.instruction}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Trial history ─────────────────────────────────────── */}
          <View style={styles.section}>
            <ThemedText type="smallBold" style={styles.sectionLabel}>TRIAL HISTORY</ThemedText>

            {trials.length > 0 ? (
              <View style={styles.trialList}>
                {trials.map((trial) => (
                  <TrialCard key={trial.id} trial={trial} />
                ))}
              </View>
            ) : (
              <View style={[styles.emptyTrials, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="small" themeColor="textSecondary">
                  No trials yet. Tap "New Trial" to log your first run.
                </ThemedText>
              </View>
            )}
          </View>

          <View style={{ height: Spacing.six }} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, alignItems: 'center' },
  scroll: { flex: 1, width: '100%' },
  content: {
    width: '100%',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.five,
  },

  // Back
  backBtn: { alignSelf: 'flex-start', paddingVertical: Spacing.one },
  link:    { color: PRIMARY },

  // Not found
  notFound: { textAlign: 'center', marginTop: Spacing.six },

  // Title
  titleSection: { gap: Spacing.two },
  recipeName:   { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  badgeRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  badge: {
    borderRadius: 20,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    gap: 3,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  statDivider: { width: StyleSheet.hairlineWidth },

  // New trial button
  newTrialBtn: {
    backgroundColor: ACCENT,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  newTrialBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },

  // Sections
  section:      { gap: Spacing.three },
  sectionLabel: { letterSpacing: 0.6, fontSize: 11 },
  goalText:     { lineHeight: 22 },

  // Shared card
  card: { borderRadius: Spacing.three, overflow: 'hidden' },

  // Ingredients
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.three,
  },
  ingredientQty:  { width: 72, textAlign: 'right' },
  ingredientName: { flex: 1, fontWeight: '500' },

  // Method
  methodList: { gap: Spacing.two },
  methodRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  stepText: { flex: 1, lineHeight: 22, paddingTop: 3 },

  // Trial history
  trialList: { gap: Spacing.two },

  // Empty
  emptyTrials: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },

  pressed: { opacity: 0.75 },
});
