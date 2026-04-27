import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type TabParamList = {
  Home: undefined;
  Tools: undefined;
};

type Props = Readonly<{
  navigation: BottomTabNavigationProp<TabParamList, 'Home'>;
}>;

const GOLD = '#e5ae51';
const DARK = '#1a1a1a';
const CARD = '#2d2d2d';

const painPoints = [
  {
    icon: '⏰',
    title: 'No Time',
    description: 'Long work hours and meetings leave little time for fitness.',
  },
  {
    icon: '🧠',
    title: 'Decision Fatigue',
    description: 'Confusing advice and too many choices make it hard to start.',
  },
  {
    icon: '📈',
    title: 'Slow Progress',
    description: 'You work hard, but results are slow and motivation fades.',
  },
];

const toolLinks = [
  { label: 'Calories Calculator', description: 'Dial in calories and macros for hybrid training.', icon: '🍽️', active: true },
  { label: 'Meal Plans', description: 'Auto-generate weekly meal prep based on your macros.', icon: '📆', active: false },
  { label: 'Training Templates', description: 'Ready-to-use hybrid training week templates.', icon: '📑', active: false },
  { label: 'Workout Gen', description: 'Build structured gym sessions around your goals.', icon: '🏋️', active: false },
];

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>
            Training for a better body{'\n'}with a full-time job
          </Text>
          <Text style={styles.heroSubtitle}>
            Early mornings, late nights, and meal prep became my routine. This site is my logbook: honest progress, mistakes, and what works for me.
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => Linking.openURL('https://instagram.com/danilkravafit')}
          >
            <Text style={styles.heroButtonText}>Follow on Instagram</Text>
          </TouchableOpacity>
        </View>

        {/* ── Pain Points ───────────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          {painPoints.map((item, i) => (
            <View key={item.title} style={[styles.painRow, i < painPoints.length - 1 && styles.painRowBorder]}>
              <Text style={styles.painIcon}>{item.icon}</Text>
              <View style={styles.painText}>
                <Text style={styles.painTitle}>{item.title}</Text>
                <Text style={styles.painDesc}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Tools Quick Links ─────────────────────────────────────────── */}
        <View style={styles.toolsHeader}>
          <Text style={styles.sectionTitle}>Hybrid Athlete Tools</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tools')}>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.toolsGrid}>
          {toolLinks.map(tool => (
            <TouchableOpacity
              key={tool.label}
              style={[styles.toolCard, !tool.active && styles.toolCardDisabled]}
              onPress={() => tool.active && navigation.navigate('Tools')}
              activeOpacity={tool.active ? 0.7 : 1}
            >
              <Text style={styles.toolIcon}>{tool.icon}</Text>
              <Text style={[styles.toolLabel, !tool.active && styles.toolLabelDisabled]}>
                {tool.label}
              </Text>
              <Text style={styles.toolDesc}>{tool.description}</Text>
              {!tool.active && <Text style={styles.comingSoon}>Coming soon</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Tools')}>
          <Text style={styles.ctaButtonText}>Open Tools →</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: DARK },
  container: { padding: 16, paddingBottom: 40 },

  // Hero
  heroCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffffff18',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 30,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
    marginBottom: 20,
  },
  heroButton: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  heroButtonText: { fontSize: 13, fontWeight: '700', color: GOLD },

  // Pain points
  sectionCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffffff18',
  },
  painRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12 },
  painRowBorder: { borderBottomWidth: 1, borderBottomColor: '#ffffff12' },
  painIcon: { fontSize: 26, marginRight: 16, lineHeight: 32 },
  painText: { flex: 1 },
  painTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 2 },
  painDesc: { fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 18 },

  // Tools section
  toolsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  seeAll: { fontSize: 13, color: GOLD, fontWeight: '600' },

  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  toolCard: {
    width: '47.5%',
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffffff18',
  },
  toolCardDisabled: { opacity: 0.5 },
  toolIcon: { fontSize: 24, marginBottom: 8 },
  toolLabel: { fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 4 },
  toolLabelDisabled: { color: 'rgba(255,255,255,0.5)' },
  toolDesc: { fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 16 },
  comingSoon: {
    marginTop: 8,
    fontSize: 10,
    color: GOLD,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // CTA
  ctaButton: {
    backgroundColor: GOLD,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaButtonText: { fontSize: 15, fontWeight: '700', color: DARK },
});
