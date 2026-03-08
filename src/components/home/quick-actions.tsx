import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { SectionHeader } from './section-header';

const QUICK_ACTIONS = [
  {
    id:     'new-recipe',
    label:  'New Recipe',
    color:  '#208AEF',
    bg:     'rgba(32,138,239,0.12)',
    symbol: { ios: 'square.and.pencil', android: 'edit', web: 'edit' } as const,
  },
  {
    id:     'new-trial',
    label:  'New Trial',
    color:  '#34C759',
    bg:     'rgba(52,199,89,0.12)',
    symbol: { ios: 'flask.fill', android: 'science', web: 'science' } as const,
  },
  {
    id:     'upload-result',
    label:  'Upload Result',
    color:  '#FF9500',
    bg:     'rgba(255,149,0,0.12)',
    symbol: { ios: 'photo.badge.plus', android: 'add_photo_alternate', web: 'add_photo_alternate' } as const,
  },
  {
    id:     'add-notes',
    label:  'Add Notes',
    color:  '#AF52DE',
    bg:     'rgba(175,82,222,0.12)',
    symbol: { ios: 'note.text.badge.plus', android: 'note_add', web: 'note_add' } as const,
  },
] as const;

export function QuickActions() {
  return (
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
              <SymbolView name={action.symbol} size={22} tintColor={action.color} />
            </View>
            <ThemedText type="smallBold">{action.label}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section:     { gap: Spacing.three },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  actionButton: {
    flex:         1,
    minWidth:     '45%',
    borderRadius: Spacing.three,
    padding:      Spacing.three,
    gap:          Spacing.two,
  },
  actionIconWrap: {
    width:          40,
    height:         40,
    borderRadius:   12,
    alignItems:     'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
});
