import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatTimer } from '@/utils/format';

import { SectionHeader } from './section-header';

const PRIMARY = '#208AEF';

type Timer = {
  id:               string;
  label:            string;
  recipe:           string;
  hoursRemaining:   number;
  minutesRemaining: number;
};

export function RemindersSection({ timers }: { timers: Timer[] }) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <SectionHeader title="Reminders" />
      {timers.length > 0 ? (
        <View style={styles.timerList}>
          {timers.map((timer) => (
            <Pressable
              key={timer.id}
              style={({ pressed }) => [
                styles.timerCard,
                { backgroundColor: theme.backgroundElement },
                pressed && styles.pressed,
              ]}>
              <View style={styles.timerCardLeft}>
                <SymbolView
                  name={{ ios: 'timer', android: 'timer', web: 'timer' }}
                  size={18}
                  tintColor={theme.textSecondary}
                />
                <View style={styles.timerCardText}>
                  <ThemedText type="smallBold">{timer.label}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {timer.recipe}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.timerBadge}>
                <ThemedText type="small" style={styles.timerBadgeText}>
                  {formatTimer(timer.hoursRemaining, timer.minutesRemaining)}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={[styles.emptyCard, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="small" themeColor="textSecondary">
            No active reminders. Add a timer when logging a trial.
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section:  { gap: Spacing.three },
  timerList: { gap: Spacing.two },
  timerCard: {
    borderRadius:   Spacing.three,
    padding:        Spacing.three,
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  timerCardLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.two,
    flex:          1,
  },
  timerCardText: { gap: 2, flex: 1 },
  timerBadge: {
    backgroundColor: 'rgba(32,138,239,0.12)',
    borderRadius:    20,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  timerBadgeText: { color: PRIMARY, fontWeight: '600' },
  emptyCard: {
    borderRadius: Spacing.three,
    padding:      Spacing.three,
  },
  pressed: { opacity: 0.7 },
});
