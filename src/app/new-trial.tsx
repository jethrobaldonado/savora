import { router, useLocalSearchParams } from 'expo-router';
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
import { useSavoraStore } from '@/store';
import type { OutcomeId, Recipe } from '@/store/types';

// ─── Types & constants ────────────────────────────────────────────────────────

const ACCENT = '#34C759';
const TOTAL_STEPS = 2;

const OUTCOMES = [
  { id: 'too-early'  as OutcomeId, label: '⏳  Too early' },
  { id: 'promising'  as OutcomeId, label: '✨  Promising' },
  { id: 'needs-work' as OutcomeId, label: '🔧  Needs work' },
  { id: 'good'       as OutcomeId, label: '👍  Good' },
  { id: 'nailed-it'  as OutcomeId, label: '🏆  Nailed it' },
];

// ─── Step dots ────────────────────────────────────────────────────────────────

function StepDots({ current }: { current: number }) {
  return (
    <View style={dots.row}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <View
          key={i}
          style={[
            dots.dot,
            i + 1 === current ? dots.dotActive : dots.dotInactive,
            i + 1 < current && dots.dotDone,
          ]}
        />
      ))}
    </View>
  );
}

const dots = StyleSheet.create({
  row:         { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot:         { height: 6, borderRadius: 3 },
  dotActive:   { width: 18, backgroundColor: ACCENT },
  dotDone:     { width: 6,  backgroundColor: ACCENT },
  dotInactive: { width: 6,  backgroundColor: 'rgba(128,128,128,0.25)' },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function NewTrialScreen() {
  const theme = useTheme();
  const { recipes, trials, addTrial } = useSavoraStore();
  const { recipeId: preselectedId } = useLocalSearchParams<{ recipeId?: string }>();

  const searchRef  = useRef<TextInputType>(null);
  const changesRef = useRef<TextInputType>(null);
  const notesRef   = useRef<TextInputType>(null);
  const timerRef   = useRef<TextInputType>(null);

  const [step, setStep] = useState(1);

  // Step 1 — Setup
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(
    () => (preselectedId ? recipes.find((r) => r.id === preselectedId) ?? null : null),
  );
  const [pickerOpen,     setPickerOpen]     = useState(false);
  const [search,         setSearch]         = useState('');
  const [changes,        setChanges]        = useState('');
  const [outcome,        setOutcome]        = useState<OutcomeId | null>(null);

  // Step 2 — Notes & Timer
  const [notes,      setNotes]      = useState('');
  const [addTimer,   setAddTimer]   = useState(false);
  const [timerLabel, setTimerLabel] = useState('');
  const [timerHours, setTimerHours] = useState('');
  const [timerMins,  setTimerMins]  = useState('');

  const canAdvance = selectedRecipe !== null;

  // Compute next trial number for each recipe
  function nextTrialNumber(recipeId: string) {
    return trials.filter((t) => t.recipeId === recipeId).length + 1;
  }

  const filteredRecipes = search.trim()
    ? recipes.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          (r.category ?? '').toLowerCase().includes(search.toLowerCase()),
      )
    : recipes;

  // ── Helpers ────────────────────────────────────────────────────────────────

  function dismiss() {
    router.canGoBack() ? router.back() : router.replace('/(tabs)');
  }

  function selectRecipe(r: Recipe) {
    setSelectedRecipe(r);
    setPickerOpen(false);
    setSearch('');
  }

  function openPicker() {
    setPickerOpen(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  }

  function handleCreate() {
    if (!canAdvance) return;
    addTrial({
      recipeId: selectedRecipe!.id,
      changes,
      outcome,
      notes,
      timer:
        addTimer && timerLabel.trim()
          ? {
              id: Math.random().toString(36).slice(2),
              label: timerLabel.trim(),
              hours: parseInt(timerHours, 10) || 0,
              minutes: parseInt(timerMins, 10) || 0,
            }
          : null,
    });
    dismiss();
  }

  // ── Layout helpers ─────────────────────────────────────────────────────────

  const input = [styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }];

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

          {/* ── Header ─────────────────────────────────────────────── */}
          <View style={[styles.headerWrap, { maxWidth: MaxContentWidth }]}>
            <View style={[styles.handle, { backgroundColor: theme.backgroundSelected }]} />
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <ThemedText type="subtitle">New Trial</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Step {step} of {TOTAL_STEPS}
                </ThemedText>
              </View>
              <View style={styles.headerRight}>
                <StepDots current={step} />
                <Pressable hitSlop={12} onPress={dismiss}>
                  <ThemedText type="small" style={styles.link}>Cancel</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>

          {/* ── Step 1 · Setup ─────────────────────────────────────── */}
          {step === 1 && (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[styles.form, { maxWidth: MaxContentWidth }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>

              {/* Recipe picker */}
              <View style={styles.section}>
                <ThemedText type="smallBold" style={styles.label}>RECIPE</ThemedText>

                {/* Trigger */}
                <Pressable
                  style={[
                    styles.pickerTrigger,
                    { backgroundColor: theme.backgroundElement },
                    pickerOpen && styles.pickerTriggerOpen,
                  ]}
                  onPress={pickerOpen ? () => setPickerOpen(false) : openPicker}>
                  <View style={styles.pickerTriggerLeft}>
                    {selectedRecipe ? (
                      <>
                        <ThemedText style={[styles.pickerValue, { color: theme.text }]} numberOfLines={1}>
                          {selectedRecipe.name}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {selectedRecipe.category} · Trial #{nextTrialNumber(selectedRecipe.id)}
                        </ThemedText>
                      </>
                    ) : (
                      <ThemedText style={[styles.pickerPlaceholder, { color: theme.textSecondary }]}>
                        Select a recipe…
                      </ThemedText>
                    )}
                  </View>
                  <ThemedText style={[styles.pickerChevron, { color: theme.textSecondary }]}>
                    {pickerOpen ? '▴' : '▾'}
                  </ThemedText>
                </Pressable>

                {/* Dropdown */}
                {pickerOpen && (
                  <View style={[styles.pickerDropdown, { backgroundColor: theme.backgroundElement }]}>
                    <View style={[styles.pickerSearchRow, { borderBottomColor: theme.backgroundSelected }]}>
                      <ThemedText style={{ color: theme.textSecondary, fontSize: 15 }}>🔍</ThemedText>
                      <TextInput
                        ref={searchRef}
                        style={[styles.pickerSearchInput, { color: theme.text }]}
                        placeholder="Search recipes…"
                        placeholderTextColor={theme.textSecondary}
                        value={search}
                        onChangeText={setSearch}
                        autoCapitalize="none"
                        returnKeyType="search"
                      />
                      {search.length > 0 && (
                        <Pressable hitSlop={8} onPress={() => setSearch('')}>
                          <ThemedText style={{ color: theme.textSecondary, fontSize: 16 }}>×</ThemedText>
                        </Pressable>
                      )}
                    </View>

                    {recipes.length === 0 ? (
                      <View style={styles.pickerEmpty}>
                        <ThemedText type="small" themeColor="textSecondary">
                          No recipes yet. Create a recipe first.
                        </ThemedText>
                      </View>
                    ) : filteredRecipes.length > 0 ? (
                      filteredRecipes.map((r, idx) => (
                        <Pressable
                          key={r.id}
                          style={({ pressed }) => [
                            styles.pickerRow,
                            idx < filteredRecipes.length - 1 && {
                              borderBottomWidth: StyleSheet.hairlineWidth,
                              borderBottomColor: theme.backgroundSelected,
                            },
                            pressed && styles.pressed,
                          ]}
                          onPress={() => selectRecipe(r)}>
                          <View style={styles.pickerRowLeft}>
                            <ThemedText style={{ fontWeight: '500' }}>{r.name}</ThemedText>
                            <ThemedText type="small" themeColor="textSecondary">{r.category}</ThemedText>
                          </View>
                          <ThemedText type="small" themeColor="textSecondary">
                            Trial #{nextTrialNumber(r.id)}
                          </ThemedText>
                        </Pressable>
                      ))
                    ) : (
                      <View style={styles.pickerEmpty}>
                        <ThemedText type="small" themeColor="textSecondary">No recipes found</ThemedText>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Changes */}
              <View style={styles.section}>
                <ThemedText type="smallBold" style={styles.label}>CHANGES FROM LAST TRIAL</ThemedText>
                <TextInput
                  ref={changesRef}
                  style={[...input, styles.textarea]}
                  placeholder="What did you vary or adjust this time?"
                  placeholderTextColor={theme.textSecondary}
                  value={changes}
                  onChangeText={setChanges}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              {/* Outcome */}
              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <ThemedText type="smallBold" style={styles.label}>OUTCOME</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">optional</ThemedText>
                </View>
                <View style={styles.outcomeGrid}>
                  {OUTCOMES.map(o => {
                    const active = outcome === o.id;
                    return (
                      <Pressable
                        key={o.id}
                        style={[
                          styles.outcomeChip,
                          active
                            ? styles.outcomeChipActive
                            : { backgroundColor: theme.backgroundElement },
                        ]}
                        onPress={() => setOutcome(active ? null : o.id)}>
                        <ThemedText style={[styles.outcomeText, active && styles.outcomeTextActive]}>
                          {o.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.pad} />
            </ScrollView>
          )}

          {/* ── Step 2 · Notes & Timer ─────────────────────────────── */}
          {step === 2 && (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[styles.form, { maxWidth: MaxContentWidth }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>

              {/* Selected recipe badge */}
              {selectedRecipe && (
                <View style={[styles.recipeBadge, { backgroundColor: theme.backgroundElement }]}>
                  <ThemedText type="smallBold" numberOfLines={1} style={{ flex: 1 }}>
                    {selectedRecipe.name}
                  </ThemedText>
                  <View style={[styles.trialPill, { backgroundColor: 'rgba(52,199,89,0.12)' }]}>
                    <ThemedText type="small" style={{ color: ACCENT, fontWeight: '600' }}>
                      Trial #{nextTrialNumber(selectedRecipe.id)}
                    </ThemedText>
                  </View>
                </View>
              )}

              {/* Notes */}
              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <ThemedText type="smallBold" style={styles.label}>NOTES</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">optional</ThemedText>
                </View>
                <TextInput
                  ref={notesRef}
                  style={[...input, styles.notesArea]}
                  placeholder="Observations, texture, taste, what to try next…"
                  placeholderTextColor={theme.textSecondary}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  textAlignVertical="top"
                  autoFocus
                />
              </View>

              {/* Timer */}
              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <ThemedText type="smallBold" style={styles.label}>TIMER</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">optional</ThemedText>
                </View>

                {!addTimer ? (
                  <Pressable
                    style={[styles.addRowBtn, { borderColor: theme.backgroundSelected }]}
                    onPress={() => setAddTimer(true)}>
                    <ThemedText type="small" style={styles.link}>+ Add timer reminder</ThemedText>
                  </Pressable>
                ) : (
                  <View style={styles.timerFields}>
                    <TextInput
                      ref={timerRef}
                      style={[...input, { flex: 1 }]}
                      placeholder="e.g. Bulk fermentation"
                      placeholderTextColor={theme.textSecondary}
                      value={timerLabel}
                      onChangeText={setTimerLabel}
                      returnKeyType="next"
                    />
                    <View style={styles.timerDuration}>
                      <TextInput
                        style={[...input, styles.timerNumInput]}
                        placeholder="0h"
                        placeholderTextColor={theme.textSecondary}
                        value={timerHours}
                        onChangeText={setTimerHours}
                        keyboardType="number-pad"
                        returnKeyType="next"
                      />
                      <TextInput
                        style={[...input, styles.timerNumInput]}
                        placeholder="0m"
                        placeholderTextColor={theme.textSecondary}
                        value={timerMins}
                        onChangeText={setTimerMins}
                        keyboardType="number-pad"
                        returnKeyType="done"
                      />
                      <Pressable
                        hitSlop={8}
                        onPress={() => {
                          setAddTimer(false);
                          setTimerLabel('');
                          setTimerHours('');
                          setTimerMins('');
                        }}>
                        <ThemedText style={styles.removeText} themeColor="textSecondary">×</ThemedText>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.pad} />
            </ScrollView>
          )}

          {/* ── Footer navigation ──────────────────────────────────── */}
          <View style={[styles.footer, { maxWidth: MaxContentWidth }]}>
            <View style={styles.footerRow}>
              {step > 1 ? (
                <Pressable
                  style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
                  onPress={() => setStep(s => s - 1)}>
                  <ThemedText type="default" style={styles.link}>← Back</ThemedText>
                </Pressable>
              ) : (
                <View />
              )}

              {step < TOTAL_STEPS ? (
                <Pressable
                  style={({ pressed }) => [
                    styles.nextBtn,
                    !canAdvance && styles.nextBtnDisabled,
                    pressed && canAdvance && styles.pressed,
                  ]}
                  disabled={!canAdvance}
                  onPress={() => setStep(s => s + 1)}>
                  <ThemedText style={styles.nextBtnText}>Notes →</ThemedText>
                </Pressable>
              ) : (
                <Pressable
                  style={({ pressed }) => [
                    styles.nextBtn,
                    !canAdvance && styles.nextBtnDisabled,
                    pressed && canAdvance && styles.pressed,
                  ]}
                  disabled={!canAdvance}
                  onPress={handleCreate}>
                  <ThemedText style={styles.nextBtnText}>Log Trial</ThemedText>
                </Pressable>
              )}
            </View>
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, alignItems: 'center' },
  kav:  { flex: 1, width: '100%', alignItems: 'center' },

  // Header
  headerWrap: {
    width: '100%',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
  },
  handle:      { width: 36, height: 4, borderRadius: 2, alignSelf: 'center' },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft:  { gap: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  link:        { color: ACCENT },

  // Scroll / form
  scroll: { flex: 1, width: '100%' },
  form:   { width: '100%', paddingHorizontal: Spacing.four, gap: Spacing.five },
  pad:    { height: Spacing.three },

  // Sections
  section:  { gap: Spacing.three },
  label:    { letterSpacing: 0.6, fontSize: 11 },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  // Recipe picker trigger
  pickerTrigger: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pickerTriggerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  pickerTriggerLeft: { flex: 1, gap: 2 },
  pickerValue:       { fontSize: 16, fontWeight: '600' },
  pickerPlaceholder: { fontSize: 16, fontWeight: '500' },
  pickerChevron:     { fontSize: 12 },

  // Picker dropdown
  pickerDropdown: {
    borderRadius: Spacing.three,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
  pickerSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
  },
  pickerSearchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: Spacing.one,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  pickerRowLeft: { gap: 2, flex: 1, marginRight: Spacing.two },
  pickerEmpty: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    alignItems: 'center',
  },

  // Recipe badge (step 2)
  recipeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  trialPill: {
    borderRadius: 20,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },

  // Inputs
  input: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
    fontWeight: '500',
  },
  textarea:  { minHeight: 96, textAlignVertical: 'top' },
  notesArea: { minHeight: 140, textAlignVertical: 'top' },

  // Outcome chips
  outcomeGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  outcomeChip:       { borderRadius: 20, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  outcomeChipActive: { backgroundColor: ACCENT },
  outcomeText:       { fontSize: 14, fontWeight: '500' },
  outcomeTextActive: { color: '#ffffff' },

  // Timer
  timerFields:   { gap: Spacing.two },
  timerDuration: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  timerNumInput: { width: 72, textAlign: 'center' },
  removeText:    { fontSize: 20, lineHeight: 24 },

  // Add row button
  addRowBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },

  // Footer
  footer: {
    width: '100%',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  footerRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn:         { paddingVertical: Spacing.two },
  nextBtn:         { backgroundColor: ACCENT, borderRadius: Spacing.three, paddingVertical: Spacing.three, paddingHorizontal: Spacing.four },
  nextBtnDisabled: { backgroundColor: 'rgba(52,199,89,0.35)' },
  nextBtnText:     { color: '#ffffff', fontSize: 16, fontWeight: '600' },

  pressed: { opacity: 0.75 },
});
