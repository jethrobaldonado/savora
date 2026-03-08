import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSavoraStore } from '@/store';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now   = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7)  return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTimer(h: number, m: number) {
  if (h === 0) return `${m}m left`;
  if (m === 0) return `${h}h left`;
  return `${h}h ${m}m left`;
}

// ─── Quick actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    id: 'new-recipe',
    label: 'New Recipe',
    color: '#208AEF',
    bg: 'rgba(32,138,239,0.12)',
    symbol: { ios: 'square.and.pencil', android: 'edit', web: 'edit' } as const,
  },
  {
    id: 'new-trial',
    label: 'New Trial',
    color: '#34C759',
    bg: 'rgba(52,199,89,0.12)',
    symbol: { ios: 'flask.fill', android: 'science', web: 'science' } as const,
  },
  {
    id: 'upload-result',
    label: 'Upload Result',
    color: '#FF9500',
    bg: 'rgba(255,149,0,0.12)',
    symbol: { ios: 'photo.badge.plus', android: 'add_photo_alternate', web: 'add_photo_alternate' } as const,
  },
  {
    id: 'add-notes',
    label: 'Add Notes',
    color: '#AF52DE',
    bg: 'rgba(175,82,222,0.12)',
    symbol: { ios: 'note.text.badge.plus', android: 'note_add', web: 'note_add' } as const,
  },
] as const;

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

        {/* ── Reminders ────────────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader title="Reminders" />
          {activeTimers.length > 0 ? (
            <View style={styles.trialList}>
              {activeTimers.map((timer) => (
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

        {/* ── Continue Your Experiments ────────────────────────────── */}
        {pendingNotes.length > 0 && (
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
        )}

        {/* ── Quick Actions ────────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader title="Quick Actions" />
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                style={({ pressed }) => [
                  styles.actionButton,
                  { backgroundColor: action.bg },
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  if (action.id === 'new-recipe') router.push('/new-recipe');
                  else if (action.id === 'new-trial') router.push('/new-trial');
                }}>
                <View style={[styles.actionIconWrap, { backgroundColor: action.bg }]}>
                  <SymbolView
                    name={action.symbol}
                    size={22}
                    tintColor={action.color}
                  />
                </View>
                <ThemedText type="smallBold">{action.label}</ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Recent Trials ────────────────────────────────────────── */}
        {recentTrials.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Recent Trials" />
            <View style={styles.trialList}>
              {recentTrials.map((trial) => (
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
        )}

        {/* ── Empty state ──────────────────────────────────────────── */}
        {recipes.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.emptyTitle}>
              Your notebook is empty
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyBody}>
              Create your first recipe to start tracking trials and experiments.
            </ThemedText>
            <Pressable
              style={({ pressed }) => [styles.emptyButton, pressed && styles.pressed]}
              onPress={() => router.push('/new-recipe')}>
              <ThemedText style={styles.emptyButtonText}>Create a recipe</ThemedText>
            </Pressable>
          </View>
        )}

      </ThemedView>
    </ScrollView>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText type="smallBold" style={styles.sectionTitle}>
        {title.toUpperCase()}
      </ThemedText>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>
        <ThemedText type="small" style={styles.seeAll}>
          See all
        </ThemedText>
      </Pressable>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const PRIMARY = '#208AEF';

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { flexDirection: 'row', justifyContent: 'center' },
  page: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
  },

  // Header
  header: { gap: Spacing.one },

  // Sections
  section: { gap: Spacing.three },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { letterSpacing: 0.6 },
  seeAll: { color: PRIMARY },

  // Experiment cards (horizontal scroll)
  horizontalList: { gap: Spacing.three, paddingBottom: Spacing.one },
  experimentCard: {
    width: 200,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  experimentCardTop: { gap: Spacing.one },
  experimentCardTitle: { lineHeight: 20 },
  experimentCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addNotesChip: {
    backgroundColor: 'rgba(32,138,239,0.12)',
    borderRadius: 20,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  addNotesText: { color: PRIMARY, fontWeight: '600' },

  // Quick actions grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Trial cards
  trialList: { gap: Spacing.two },
  trialCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  trialCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trialCardRecipe: { flex: 1, marginRight: Spacing.two },
  trialCardMeta: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },

  // Timer cards
  timerCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  timerCardText: { gap: 2, flex: 1 },
  timerBadge: {
    backgroundColor: 'rgba(32,138,239,0.12)',
    borderRadius: 20,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  timerBadgeText: { color: PRIMARY, fontWeight: '600' },

  // Empty card (inline section placeholder)
  emptyCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
    gap: Spacing.three,
  },
  emptyTitle: { letterSpacing: 0.4 },
  emptyBody:  { textAlign: 'center', lineHeight: 20, maxWidth: 260 },
  emptyButton: {
    backgroundColor: PRIMARY,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.one,
  },
  emptyButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 15 },

  pressed: { opacity: 0.7 },
});
