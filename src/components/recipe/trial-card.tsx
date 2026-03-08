import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDate } from '@/utils/format';
import type { Trial } from '@/store/types';

import { OutcomeBadge } from './outcome-badge';

const PRIMARY = '#208AEF';

export function TrialCard({ trial }: { trial: Trial }) {
  const theme = useTheme();

  return (
    <View style={[styles.trialCard, { backgroundColor: theme.backgroundElement }]}>
      <View style={styles.trialCardHeader}>
        <ThemedText type="smallBold">Trial #{trial.trialNumber}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatDate(trial.createdAt)}
        </ThemedText>
      </View>

      {trial.outcome && <OutcomeBadge outcome={trial.outcome} />}

      {trial.changes.trim().length > 0 && (
        <View style={styles.trialField}>
          <ThemedText type="small" style={styles.trialFieldLabel}>CHANGES</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {trial.changes}
          </ThemedText>
        </View>
      )}

      {trial.notes.trim().length > 0 && (
        <View style={styles.trialField}>
          <ThemedText type="small" style={styles.trialFieldLabel}>NOTES</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {trial.notes}
          </ThemedText>
        </View>
      )}

      {trial.timer && (
        <View style={[styles.timerRow, { backgroundColor: theme.background }]}>
          <ThemedText type="small" themeColor="textSecondary">
            ⏱ {trial.timer.label}
          </ThemedText>
          <ThemedText type="small" style={{ color: PRIMARY, fontWeight: '600' }}>
            {trial.timer.hours > 0 ? `${trial.timer.hours}h ` : ''}
            {trial.timer.minutes > 0 ? `${trial.timer.minutes}m` : ''}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trialCard: {
    borderRadius: Spacing.three,
    padding:      Spacing.three,
    gap:          Spacing.three,
  },
  trialCardHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  trialField:      { gap: 4 },
  trialFieldLabel: { fontSize: 10, letterSpacing: 0.5, fontWeight: '600', opacity: 0.5 },
  timerRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    borderRadius:   Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
});
