export type Ingredient = {
  id: string;
  quantity: string;
  unit: string;
  name: string;
};

export type MethodStep = {
  id: string;
  instruction: string;
};

export type Recipe = {
  id: string;
  name: string;
  category: string | null;
  goal: string;
  tags: string[];
  ingredients: Ingredient[];
  methodSteps: MethodStep[];
  createdAt: string;
  updatedAt: string;
};

export type OutcomeId =
  | 'too-early'
  | 'promising'
  | 'needs-work'
  | 'good'
  | 'nailed-it';

export type TrialTimer = {
  id: string;
  label: string;
  hours: number;
  minutes: number;
};

export type Trial = {
  id: string;
  recipeId: string;
  trialNumber: number;
  changes: string;
  outcome: OutcomeId | null;
  notes: string;
  timer: TrialTimer | null;
  createdAt: string;
  updatedAt: string;
};
