import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { subDays, format, eachDayOfInterval, isSameDay } from 'date-fns';

interface HeatmapProps {
  data: { date: string; count: number }[];
  totalHabits: number;
  daysToShow?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SPACING = 6;
const SQUARE_SIZE = (SCREEN_WIDTH - 48 - (6 * GRID_SPACING)) / 7;

export const Heatmap: React.FC<HeatmapProps> = ({ data, totalHabits, daysToShow = 30 }) => {
  const days = useMemo(() => {
    const end = new Date();
    const start = subDays(end, daysToShow - 1);
    return eachDayOfInterval({ start, end });
  }, [daysToShow]);

  const getColor = (date: Date) => {
    if (totalHabits === 0) return '#F0F0F0';
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = data.find(d => d.date === dateStr);
    const count = dayData ? dayData.count : 0;
    const percentage = (count / totalHabits) * 100;

    if (percentage === 0) return '#F0F0F0';
    if (percentage <= 33) return '#D0D0D0';
    if (percentage <= 66) return '#707070';
    if (percentage < 100) return '#303030';
    return '#000000';
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            style={[
              styles.square,
              { backgroundColor: getColor(day) }
            ]}
            onPress={() => {
              // Show details for the day
              const count = data.find(d => d.date === format(day, 'yyyy-MM-dd'))?.count || 0;
              alert(`${format(day, 'MMM d, yyyy')}\n${count} of ${totalHabits} habits completed`);
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_SPACING,
    justifyContent: 'flex-start',
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderRadius: 4,
    borderCurve: 'continuous',
  },
});
