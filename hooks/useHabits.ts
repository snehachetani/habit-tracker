import { useState, useEffect, useCallback } from 'react';
import { format, subDays } from 'date-fns';
import * as db from '../db/database';
import * as Haptics from 'expo-haptics';

import { scheduleHabitReminder, cancelHabitReminder } from '../utils/notifications';

export const useHabits = () => {
  const [habits, setHabits] = useState<db.Habit[]>([]);
  const [todayCompletions, setTodayCompletions] = useState<number[]>([]);
  const [heatmapData, setHeatmapData] = useState<{ date: string; count: number }[]>([]);
  const [totalHabitsCount, setTotalHabitsCount] = useState(0);
  const [stats, setStats] = useState({ activeHabits: 0, avgCompletion: 0, currentStreak: 0 });
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const [allHabits, completions, heatmap, count] = await Promise.all([
      db.getHabits(),
      db.getCompletionsForDate(todayStr),
      db.getHeatmapData(90),
      db.getHabitsCount()
    ]);

    // Calculate stats
    const activeHabits = allHabits.length;
    
    // Avg completion (last 30 days)
    const last30Days = heatmap.filter(d => {
      const dayDate = new Date(d.date);
      const thirtyDaysAgo = subDays(new Date(), 30);
      return dayDate >= thirtyDaysAgo;
    });
    const totalCompletions = last30Days.reduce((acc, d) => acc + d.count, 0);
    const possibleCompletions = activeHabits * 30;
    const avgCompletion = possibleCompletions > 0 
      ? Math.round((totalCompletions / possibleCompletions) * 100) 
      : 0;

    // Streak logic
    let currentStreak = 0;
    let checkDate = new Date();
    // If nothing done today, start checking from yesterday
    const todayDone = completions.length > 0;
    if (!todayDone) checkDate = subDays(checkDate, 1);

    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const dayData = heatmap.find(d => d.date === dateStr);
      if (dayData && dayData.count > 0) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
      if (currentStreak > 365) break; // Safety
    }

    setHabits(allHabits);
    setTodayCompletions(completions);
    setHeatmapData(heatmap);
    setTotalHabitsCount(count);
    setStats({ activeHabits, avgCompletion, currentStreak });
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addHabit = async (name: string, reminderTime: string | null) => {
    const id = await db.addHabit(name, reminderTime);
    if (reminderTime) {
      await scheduleHabitReminder(id, name, reminderTime);
    }
    await refreshData();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const toggleHabit = async (habitId: number) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const isCompleted = todayCompletions.includes(habitId);
    
    await db.toggleCompletion(habitId, today, !isCompleted);
    
    // Optimistic update
    if (isCompleted) {
      setTodayCompletions(prev => prev.filter(id => id !== habitId));
    } else {
      setTodayCompletions(prev => [...prev, habitId]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Refresh heatmap in background
    const heatmap = await db.getHeatmapData(90);
    setHeatmapData(heatmap);
    // Refresh stats
    refreshData();
  };

  const deleteHabit = async (id: number) => {
    await db.deleteHabit(id);
    await cancelHabitReminder(id);
    await refreshData();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  return {
    habits,
    todayCompletions,
    heatmapData,
    totalHabitsCount,
    stats,
    loading,
    addHabit,
    toggleHabit,
    deleteHabit,
    refreshData
  };
};
