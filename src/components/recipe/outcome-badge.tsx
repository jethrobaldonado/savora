import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { OutcomeId } from '@/store/types';

export const OUTCOME_LABELS: Record<OutcomeId, string> = {
  'too-early':  '⏳ Too early',
  'promising':  '✨ Promising',
  'needs-work': '🔧 Needs work',
  'good':       '👍 Good',
  'nailed-it':  '🏆 Nailed it',
};

export const OUTCOME_COLORS: Record<OutcomeId, string> = {
  'too-early':  'rgba(255,149,0,0.15)',
  'promising':  'rgba(32,138,239,0.12)',
  'needs-work': 'rgba(255,59,48,0.12)',
  'good':       'rgba(52,199,89,0.12)',
  'nailed-it':  'rgba(175,82,222,0.12)',
};

export const OUTCOME_TEXT_COLORS: Record<OutcomeId, string> = {
  'too-early':  '#FF9500',
  'promising':  '#208AEF',
  'needs-work': '#FF3B30',
  'good':       '#34C759',
  'nailed-it':  '#AF52DE',
};

export function OutcomeBadge({ outcome }: { outcome: OutcomeId }) {
  return (
    <View style={[styles.outcomePill, { backgroundColor: OUTCOME_COLORS[outcome] }]}>
      <ThemedText
        type="small"
        style={{ color: OUTCOME_TEXT_COLORS[outcome], fontWeight: '600' }}>
        {OUTCOME_LABELS[outcome]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  outcomePill: {
    alignSelf:        'flex-start',
    borderRadius:     20,
    paddingHorizontal: Spacing.two,
    paddingVertical:  3,
  },
});
