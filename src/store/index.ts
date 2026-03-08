import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Ingredient, MethodStep, OutcomeId, Recipe, Trial, TrialTimer } from './types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Re-export types for convenience ─────────────────────────────────────────

export type { Ingredient, MethodStep, OutcomeId, Recipe, Trial, TrialTimer };

// ─── Store ────────────────────────────────────────────────────────────────────

type NewRecipe = {
  name: string;
  category: string | null;
  goal: string;
  tags: string[];
  ingredients: Ingredient[];
  methodSteps: MethodStep[];
};

type NewTrial = {
  recipeId: string;
  changes: string;
  outcome: OutcomeId | null;
  notes: string;
  timer: TrialTimer | null;
};

type SavoraState = {
  recipes: Recipe[];
  trials: Trial[];

  addRecipe: (data: NewRecipe) => Recipe;
  addTrial: (data: NewTrial) => Trial;

  getRecipeById: (id: string) => Recipe | undefined;
  getTrialsByRecipeId: (recipeId: string) => Trial[];
  trialCountForRecipe: (recipeId: string) => number;
};

export const useSavoraStore = create<SavoraState>()(
  persist(
    (set, get) => ({
      recipes: [],
      trials: [],

      addRecipe: (data) => {
        const recipe: Recipe = {
          ...data,
          id: uuid(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ recipes: [recipe, ...s.recipes] }));
        return recipe;
      },

      addTrial: (data) => {
        const trialNumber = get().trialCountForRecipe(data.recipeId) + 1;
        const trial: Trial = {
          ...data,
          id: uuid(),
          trialNumber,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ trials: [trial, ...s.trials] }));
        return trial;
      },

      getRecipeById: (id) => get().recipes.find((r) => r.id === id),

      getTrialsByRecipeId: (recipeId) =>
        get().trials.filter((t) => t.recipeId === recipeId),

      trialCountForRecipe: (recipeId) =>
        get().trials.filter((t) => t.recipeId === recipeId).length,
    }),
    {
      name: 'savora-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
