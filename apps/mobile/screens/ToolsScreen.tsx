import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type ToolsStackParamList = {
  ToolsList: undefined;
  CaloriesCalculator: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<ToolsStackParamList, 'ToolsList'>;
};

const GOLD = '#e5ae51';
const DARK = '#1a1a1a';
const CARD_BG = '#f5f5f5';

type ToolItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  screen?: keyof ToolsStackParamList;
};

const tools: ToolItem[] = [
  {
    id: 'calories',
    title: 'Calories Calculator',
    description: 'Dial in your daily calories using 5 science-backed formulas.',
    icon: '🍽️',
    screen: 'CaloriesCalculator',
  },
  {
    id: 'mealplans',
    title: 'Meal Plans',
    description: 'Auto-generate weekly meal prep based on your macros.',
    icon: '📆',
  },
  {
    id: 'training',
    title: 'Training Templates',
    description: 'Ready-to-use hybrid training week templates.',
    icon: '📑',
  },
  {
    id: 'workout',
    title: 'Workout Generator',
    description: 'Build structured gym sessions around your goals.',
    icon: '🏋️',
  },
];

function ToolCard({ tool, onPress }: Readonly<{ tool: ToolItem; onPress?: () => void }>) {
  const active = !!tool.screen;
  return (
    <TouchableOpacity
      style={[styles.card, !active && styles.cardDisabled]}
      onPress={active ? onPress : undefined}
      activeOpacity={active ? 0.7 : 1}
    >
      <View style={styles.cardIconWrap}>
        <Text style={styles.cardIcon}>{tool.icon}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, !active && styles.cardTitleDisabled]}>{tool.title}</Text>
        <Text style={styles.cardDesc}>{tool.description}</Text>
        {active ? (
          <Text style={styles.cardCta}>Open →</Text>
        ) : (
          <Text style={styles.comingSoon}>Coming soon</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ToolsScreen({ navigation }: Readonly<Props>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Hybrid Athlete Tools</Text>
          <Text style={styles.subtitle}>A toolkit for hybrid athletes</Text>
        </View>

        {/* Tool cards */}
        {tools.map(tool => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onPress={() => tool.screen && navigation.navigate(tool.screen)}
          />
        ))}

        {/* CTA */}
        <View style={styles.ctaBlock}>
          <Text style={styles.ctaTitle}>Start using tools</Text>
          <Text style={styles.ctaSubtitle}>Level up your fitness with our suite of tools</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { paddingHorizontal: 20, paddingBottom: 40 },

  header: { paddingTop: 28, paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', color: GOLD, textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 4 },

  card: {
    flexDirection: 'row',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  cardDisabled: { opacity: 0.55 },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardIcon: { fontSize: 26 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 3 },
  cardTitleDisabled: { color: '#888' },
  cardDesc: { fontSize: 12, color: '#666', lineHeight: 17, marginBottom: 6 },
  cardCta: { fontSize: 12, fontWeight: '700', color: GOLD },
  comingSoon: {
    fontSize: 11,
    fontWeight: '600',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  ctaBlock: {
    marginTop: 12,
    backgroundColor: '#fdf6e9',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0c46a',
  },
  ctaTitle: { fontSize: 16, fontWeight: '700', color: GOLD },
  ctaSubtitle: { fontSize: 13, color: '#888', marginTop: 6, textAlign: 'center' },
});
