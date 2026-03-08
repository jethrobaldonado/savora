import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { SectionHeader } from './section-header';

const PRIMARY = '#208AEF';

type PendingNote = {
  id:          string;
  recipe:      string;
  trialNumber: number;
  date:        string;
};

export function ExperimentsSection({ pendingNotes }: { pendingNotes: PendingNote[] }) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <SectionHeader title="Continue Your Experiments" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}>
        {pendingNotes.map((trial) => (
          <Pressable
            key={trial.id}
            style={({ pressed }) => [
              styles.experimentCard,
              { backgroundColor: theme.backgroundElement },
              pressed && styles.pressed,
            ]}>
            <View style={styles.experimentCardTop}>
              <ThemedText type="smallBold" numberOfLines={2} style={styles.experimentCardTitle}>
                {trial.recipe}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {trial.date}
              </ThemedText>
            </View>
            <View style={styles.experimentCardBottom}>
              <ThemedText type="small" themeColor="textSecondary">
                Trial #{trial.trialNumber}
              </ThemedText>
              <View style={styles.addNotesChip}>
                <ThemedText type="small" style={styles.addNotesText}>
                  Add notes
                </ThemedText>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section:        { gap: Spacing.three },
  horizontalList: { gap: Spacing.three, paddingBottom: Spacing.one },
  experimentCard: {
    width:          200,
    borderRadius:   Spacing.three,
    padding:        Spacing.three,
    gap:            Spacing.three,
    justifyContent: 'space-between',
  },
  experimentCardTop:    { gap: Spacing.one },
  experimentCardTitle:  { lineHeight: 20 },
  experimentCardBottom: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  addNotesChip: {
    backgroundColor: 'rgba(32,138,239,0.12)',
    borderRadius:    20,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  addNotesText: { color: PRIMARY, fontWeight: '600' },
  pressed:      { opacity: 0.7 },
});
