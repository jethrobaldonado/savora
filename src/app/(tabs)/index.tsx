import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExperimentsSection } from '@/components/home/experiments-section';
import { HomeEmptyState } from '@/components/home/home-empty-state';
import { QuickActions } from '@/components/home/quick-actions';
import { RecentTrialsSection } from '@/components/home/recent-trials-section';
import { RemindersSection } from '@/components/home/reminders-section';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSavoraStore } from '@/store';
import { formatDate } from '@/utils/format';

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const theme  = useTheme();
  const insets = useSafeAreaInsets();
  const { recipes, trials } = useSavoraStore();

  // ── Derived data ──────────────────────────────────────────────────────────

  const pendingNotes = trials
    .filter((t) => !t.notes.trim())
    .slice(0, 5)
    .map((t) => ({
      id:          t.id,
      recipe:      recipes.find((r) => r.id === t.recipeId)?.name ?? 'Unknown Recipe',
      trialNumber: t.trialNumber,
      date:        formatDate(t.createdAt),
    }));

  const recentTrials = trials
    .filter((t) => t.notes.trim().length > 0)
    .slice(0, 5)
    .map((t) => ({
      id:          t.id,
      recipe:      recipes.find((r) => r.id === t.recipeId)?.name ?? 'Unknown Recipe',
      trialNumber: t.trialNumber,
      date:        formatDate(t.createdAt),
      notePreview: t.notes,
    }));

  const activeTimers = trials
    .filter((t) => t.timer !== null)
    .slice(0, 3)
    .map((t) => ({
      id:               t.id,
      label:            t.timer!.label,
      recipe:           `${recipes.find((r) => r.id === t.recipeId)?.name ?? 'Unknown'} · Trial #${t.trialNumber}`,
      hoursRemaining:   t.timer!.hours,
      minutesRemaining: t.timer!.minutes,
    }));

  // ── Content inset ─────────────────────────────────────────────────────────

  const contentInset = {
    top:    insets.top,
    left:   insets.left,
    right:  insets.right,
    bottom: insets.bottom + BottomTabInset + Spacing.three,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop:    contentInset.top,
      paddingLeft:   contentInset.left,
      paddingRight:  contentInset.right,
      paddingBottom: contentInset.bottom,
    },
    web: { paddingTop: Spacing.five, paddingBottom: Spacing.five },
  });

  const pendingCount = pendingNotes.length;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentInset={contentInset}
      contentContainerStyle={[styles.scrollContent, contentPlatformStyle]}
      showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.page}>

        {/* ── Header ───────────────────────────────────────────────── */}
        <View style={styles.header}>
          <ThemedText type="subtitle">Good morning, Chef</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {pendingCount > 0
              ? `${pendingCount} trial${pendingCount !== 1 ? 's' : ''} awaiting notes`
              : 'All caught up!'}
          </ThemedText>
        </View>

        <RemindersSection timers={activeTimers} />

        {pendingNotes.length > 0 && <ExperimentsSection pendingNotes={pendingNotes} />}

        <QuickActions />

        {recentTrials.length > 0 && <RecentTrialsSection trials={recentTrials} />}

        {recipes.length === 0 && <HomeEmptyState />}

      </ThemedView>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll:        { flex: 1 },
  scrollContent: { flexDirection: 'row', justifyContent: 'center' },
  page: {
    maxWidth:         MaxContentWidth,
    flexGrow:         1,
    gap:              Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop:       Spacing.four,
    paddingBottom:    Spacing.three,
  },
  header: { gap: Spacing.one },
});
