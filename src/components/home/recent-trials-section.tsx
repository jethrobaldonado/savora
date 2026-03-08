import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { SectionHeader } from './section-header';

type RecentTrial = {
  id:          string;
  recipe:      string;
  trialNumber: number;
  date:        string;
  notePreview: string;
};

export function RecentTrialsSection({ trials }: { trials: RecentTrial[] }) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <SectionHeader title="Recent Trials" />
      <View style={styles.trialList}>
        {trials.map((trial) => (
          <Pressable
            key={trial.id}
            style={({ pressed }) => [
              styles.trialCard,
              { backgroundColor: theme.backgroundElement },
              pressed && styles.pressed,
            ]}>
            <View style={styles.trialCardHeader}>
              <ThemedText type="smallBold" style={styles.trialCardRecipe}>
                {trial.recipe}
              </ThemedText>
              <View style={styles.trialCardMeta}>
                <ThemedText type="small" themeColor="textSecondary">
                  #{trial.trialNumber}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {trial.date}
                </ThemedText>
              </View>
            </View>
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
              {trial.notePreview}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section:   { gap: Spacing.three },
  trialList: { gap: Spacing.two },
  trialCard: {
    borderRadius: Spacing.three,
    padding:      Spacing.three,
    gap:          Spacing.two,
  },
  trialCardHeader: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  trialCardRecipe: { flex: 1, marginRight: Spacing.two },
  trialCardMeta:   { flexDirection: 'row', gap: Spacing.two, alignItems: 'center' },
  pressed:         { opacity: 0.7 },
});
