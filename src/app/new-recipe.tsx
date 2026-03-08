import { router } from 'expo-router';
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
import type { Ingredient, MethodStep } from '@/store/types';
import { CATEGORIES, type CategoryId } from '@/constants/categories';

// ─── Types & constants ────────────────────────────────────────────────────────

const PRIMARY = '#208AEF';
const TOTAL_STEPS = 3;

let _id = 0;
function uid() { return String(++_id); }
const blankIngredient = (): Ingredient => ({ id: uid(), quantity: '', unit: '', name: '' });
const blankStep       = (): MethodStep  => ({ id: uid(), instruction: '' });

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
  row:        { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot:        { height: 6, borderRadius: 3 },
  dotActive:  { width: 18, backgroundColor: PRIMARY },
  dotDone:    { width: 6,  backgroundColor: PRIMARY },
  dotInactive:{ width: 6,  backgroundColor: 'rgba(128,128,128,0.25)' },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function NewRecipeScreen() {
  const theme = useTheme();
  const addRecipe = useSavoraStore((s) => s.addRecipe);

  const goalRef    = useRef<TextInputType>(null);
  const tagRef     = useRef<TextInputType>(null);

  const [step, setStep] = useState(1);

  // Step 1 — Basics
  const [name,     setName]     = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [goal,     setGoal]     = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags,     setTags]     = useState<string[]>([]);

  // Step 2 — Ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([blankIngredient()]);

  // Step 3 — Method
  const [methodSteps, setMethodSteps] = useState<MethodStep[]>([blankStep()]);

  const canAdvance = name.trim().length > 0;

  // ── Helpers ────────────────────────────────────────────────────────────────

  function dismiss() {
    router.canGoBack() ? router.back() : router.replace('/(tabs)');
  }

  function commitTag(raw: string) {
    const value = raw.trim().replace(/,$/, '').trim();
    if (value && !tags.includes(value)) setTags(p => [...p, value]);
    setTagInput('');
  }

  function handleTagChange(text: string) {
    if (text.endsWith(',')) commitTag(text); else setTagInput(text);
  }

  function updateIngredient(id: string, field: keyof Ingredient, value: string) {
    setIngredients(p => p.map(i => i.id === id ? { ...i, [field]: value } : i));
  }

  function removeIngredient(id: string) {
    setIngredients(p => p.length > 1 ? p.filter(i => i.id !== id) : p);
  }

  function updateMethodStep(id: string, instruction: string) {
    setMethodSteps(p => p.map(s => s.id === id ? { ...s, instruction } : s));
  }

  function removeMethodStep(id: string) {
    setMethodSteps(p => p.length > 1 ? p.filter(s => s.id !== id) : p);
  }

  function handleCreate() {
    if (!canAdvance) return;
    addRecipe({ name, category, goal, tags, ingredients, methodSteps });
    dismiss();
  }

  // ── Layout ─────────────────────────────────────────────────────────────────

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
                <ThemedText type="subtitle">New Recipe</ThemedText>
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

          {/* ── Step 1 · Basics ────────────────────────────────────── */}
          {step === 1 && (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[styles.form, { maxWidth: MaxContentWidth }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>

              <TextInput
                style={[styles.nameInput, { color: theme.text }]}
                placeholder="Recipe name"
                placeholderTextColor={theme.backgroundSelected}
                value={name}
                onChangeText={setName}
                autoFocus
                returnKeyType="next"
                onSubmitEditing={() => goalRef.current?.focus()}
              />

              <View style={styles.section}>
                <ThemedText type="smallBold" style={styles.label}>CATEGORY</ThemedText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                  {CATEGORIES.map(cat => {
                    const active = category === cat.id;
                    return (
                      <Pressable
                        key={cat.id}
                        style={[styles.chip, active ? styles.chipActive : { backgroundColor: theme.backgroundElement }]}
                        onPress={() => setCategory(active ? null : cat.id)}>
                        <ThemedText style={[styles.chipText, active && styles.chipTextActive]}>
                          {cat.emoji} {cat.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.section}>
                <ThemedText type="smallBold" style={styles.label}>GOAL</ThemedText>
                <TextInput
                  ref={goalRef}
                  style={[...input, styles.textarea]}
                  placeholder="What are you trying to achieve or perfect with this recipe?"
                  placeholderTextColor={theme.textSecondary}
                  value={goal}
                  onChangeText={setGoal}
                  multiline
                  returnKeyType="next"
                  onSubmitEditing={() => tagRef.current?.focus()}
                />
              </View>

              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <ThemedText type="smallBold" style={styles.label}>TAGS</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">optional · comma to add</ThemedText>
                </View>
                {tags.length > 0 && (
                  <View style={styles.tagChips}>
                    {tags.map(tag => (
                      <Pressable
                        key={tag}
                        style={[styles.tagChip, { backgroundColor: theme.backgroundElement }]}
                        onPress={() => setTags(p => p.filter(t => t !== tag))}>
                        <ThemedText type="small">{tag}</ThemedText>
                        <ThemedText type="small" themeColor="textSecondary"> ×</ThemedText>
                      </Pressable>
                    ))}
                  </View>
                )}
                <TextInput
                  ref={tagRef}
                  style={input}
                  placeholder="e.g. sourdough, gluten-free, umami"
                  placeholderTextColor={theme.textSecondary}
                  value={tagInput}
                  onChangeText={handleTagChange}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={() => commitTag(tagInput)}
                />
              </View>

              <View style={styles.pad} />
            </ScrollView>
          )}

          {/* ── Step 2 · Ingredients ───────────────────────────────── */}
          {step === 2 && (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[styles.form, { maxWidth: MaxContentWidth }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>

              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <ThemedText type="smallBold" style={styles.label}>INGREDIENTS</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">optional</ThemedText>
                </View>

                {ingredients.map((ing, idx) => (
                  <View key={ing.id} style={styles.ingredientRow}>
                    <TextInput
                      style={[input, styles.qtyInput]}
                      placeholder="Qty"
                      placeholderTextColor={theme.textSecondary}
                      value={ing.quantity}
                      onChangeText={v => updateIngredient(ing.id, 'quantity', v)}
                      keyboardType="decimal-pad"
                      returnKeyType="next"
                    />
                    <TextInput
                      style={[input, styles.unitInput]}
                      placeholder="Unit"
                      placeholderTextColor={theme.textSecondary}
                      value={ing.unit}
                      onChangeText={v => updateIngredient(ing.id, 'unit', v)}
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                    <TextInput
                      style={[input, styles.ingNameInput]}
                      placeholder={`Ingredient ${idx + 1}`}
                      placeholderTextColor={theme.textSecondary}
                      value={ing.name}
                      onChangeText={v => updateIngredient(ing.id, 'name', v)}
                      returnKeyType="next"
                    />
                    <Pressable
                      style={styles.removeBtn}
                      onPress={() => removeIngredient(ing.id)}
                      hitSlop={8}>
                      <ThemedText style={styles.removeText} themeColor="textSecondary">×</ThemedText>
                    </Pressable>
                  </View>
                ))}

                <Pressable
                  style={[styles.addRowBtn, { borderColor: theme.backgroundSelected }]}
                  onPress={() => setIngredients(p => [...p, blankIngredient()])}>
                  <ThemedText type="small" style={styles.link}>+ Add ingredient</ThemedText>
                </Pressable>
              </View>

              <View style={styles.pad} />
            </ScrollView>
          )}

          {/* ── Step 3 · Method ────────────────────────────────────── */}
          {step === 3 && (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[styles.form, { maxWidth: MaxContentWidth }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>

              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <ThemedText type="smallBold" style={styles.label}>METHOD</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">optional</ThemedText>
                </View>

                {methodSteps.map((s, idx) => (
                  <View key={s.id} style={styles.methodRow}>
                    <View style={[styles.stepNumber, { backgroundColor: theme.backgroundElement }]}>
                      <ThemedText type="smallBold">{idx + 1}</ThemedText>
                    </View>
                    <TextInput
                      style={[input, styles.methodInput]}
                      placeholder={`Step ${idx + 1}`}
                      placeholderTextColor={theme.textSecondary}
                      value={s.instruction}
                      onChangeText={v => updateMethodStep(s.id, v)}
                      multiline
                    />
                    <Pressable
                      style={styles.removeBtn}
                      onPress={() => removeMethodStep(s.id)}
                      hitSlop={8}>
                      <ThemedText style={styles.removeText} themeColor="textSecondary">×</ThemedText>
                    </Pressable>
                  </View>
                ))}

                <Pressable
                  style={[styles.addRowBtn, { borderColor: theme.backgroundSelected }]}
                  onPress={() => setMethodSteps(p => [...p, blankStep()])}>
                  <ThemedText type="small" style={styles.link}>+ Add step</ThemedText>
                </Pressable>
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
                    step === 1 && !canAdvance && styles.nextBtnDisabled,
                    pressed && styles.pressed,
                  ]}
                  disabled={step === 1 && !canAdvance}
                  onPress={() => setStep(s => s + 1)}>
                  <ThemedText style={styles.nextBtnText}>
                    {step === 1 ? 'Ingredients →' : 'Method →'}
                  </ThemedText>
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
                  <ThemedText style={styles.nextBtnText}>Create Recipe</ThemedText>
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
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { gap: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  link: { color: PRIMARY },

  // Scroll / form
  scroll: { flex: 1, width: '100%' },
  form:   { width: '100%', paddingHorizontal: Spacing.four, gap: Spacing.five },
  pad:    { height: Spacing.three },

  // Name
  nameInput: { fontSize: 28, fontWeight: '600', lineHeight: 36, paddingVertical: Spacing.two },

  // Sections
  section:  { gap: Spacing.three },
  label:    { letterSpacing: 0.6, fontSize: 11 },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  // Category chips
  chips:        { gap: Spacing.two, paddingBottom: Spacing.one },
  chip:         { borderRadius: 20, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  chipActive:   { backgroundColor: PRIMARY },
  chipText:     { fontSize: 14, fontWeight: '500' },
  chipTextActive: { color: '#ffffff' },

  // Inputs
  input: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
    fontWeight: '500',
  },
  textarea: { minHeight: 96, textAlignVertical: 'top' },

  // Tag chips
  tagChips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  tagChip:  { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },

  // Ingredient row
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  qtyInput:      { width: 60, textAlign: 'center' },
  unitInput:     { width: 72 },
  ingNameInput:  { flex: 1 },

  // Method row
  methodRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  stepNumber:   { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  methodInput:  { flex: 1, minHeight: 52, textAlignVertical: 'top' },

  // Shared remove button
  removeBtn:  { paddingHorizontal: Spacing.one, paddingVertical: Spacing.one, marginTop: 10 },
  removeText: { fontSize: 20, lineHeight: 24 },

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
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn:   { paddingVertical: Spacing.two },
  nextBtn:         { backgroundColor: PRIMARY, borderRadius: Spacing.three, paddingVertical: Spacing.three, paddingHorizontal: Spacing.four },
  nextBtnDisabled: { backgroundColor: 'rgba(32,138,239,0.35)' },
  nextBtnText:     { color: '#ffffff', fontSize: 16, fontWeight: '600' },

  pressed: { opacity: 0.75 },
});
