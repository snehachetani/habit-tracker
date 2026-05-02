import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabits } from '../../hooks/useHabits';
import { Heatmap } from '../../components/Heatmap';

const StatCard = ({ title, value, unit, subtitle }: { title: string; value: string | number; unit?: string; subtitle?: string }) => (
  <View style={styles.statCard}>
    <View>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={styles.statValueContainer}>
        <Text style={styles.statValue}>{value}</Text>
        {unit && <Text style={styles.statUnit}>{unit}</Text>}
      </View>
    </View>
    {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
  </View>
);

const StatsScreen = () => {
  const { heatmapData, totalHabitsCount, stats } = useHabits();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Your progress at a glance</Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.mainStats}>
             <StatCard 
               title="Current Streak" 
               value={stats.currentStreak} 
               unit="days" 
               subtitle="Keep it going!" 
             />
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardTitle}>Active</Text>
              <Text style={styles.miniCardValue}>{stats.activeHabits}</Text>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardTitle}>Success</Text>
              <Text style={styles.miniCardValue}>{stats.avgCompletion}%</Text>
            </View>
          </View>

          <View style={styles.heatmapSection}>
            <Text style={styles.sectionTitle}>Monthly Consistency</Text>
            <View style={styles.heatmapCard}>
              <Heatmap data={heatmapData} totalHabits={totalHabitsCount} daysToShow={28} />
              <View style={styles.heatmapLegend}>
                 <Text style={styles.legendText}>Less</Text>
                 <View style={[styles.legendSquare, { backgroundColor: '#F0F0F0' }]} />
                 <View style={[styles.legendSquare, { backgroundColor: '#D0D0D0' }]} />
                 <View style={[styles.legendSquare, { backgroundColor: '#707070' }]} />
                 <View style={[styles.legendSquare, { backgroundColor: '#000000' }]} />
                 <Text style={styles.legendText}>More</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    fontWeight: '500',
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mainStats: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#000000',
    padding: 28,
    borderRadius: 32,
    borderCurve: 'continuous',
    minHeight: 160,
    justifyContent: 'space-between',
  },
  statTitle: {
    color: '#A0A0A0',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  statUnit: {
    color: '#A0A0A0',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 6,
  },
  statSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.6,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  miniCard: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
    borderRadius: 24,
    borderCurve: 'continuous',
  },
  miniCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A0A0A0',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  miniCardValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
  },
  heatmapSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  heatmapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderCurve: 'continuous',
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 12,
    paddingRight: 8,
    paddingBottom: 8,
  },
  legendText: {
    fontSize: 11,
    color: '#A0A0A0',
    fontWeight: '600',
    marginHorizontal: 4,
  },
  legendSquare: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
