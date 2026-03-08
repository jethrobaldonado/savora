export const CATEGORIES = [
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

export type CategoryId = (typeof CATEGORIES)[number]['id'];
export type CategoryFilter = 'all' | CategoryId;
